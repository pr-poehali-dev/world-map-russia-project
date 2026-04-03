"""
API для работы с пользовательскими работами (поделки, рисунки, аппликации).
Поддерживает страны всего мира: получение, загрузку, модерацию.
"""
import json
import os
import base64
import uuid
import boto3
import psycopg2
from datetime import datetime

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p10920719_world_map_russia_pro')
CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def get_s3():
    return boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )

def json_response(data, status=200):
    return {
        'statusCode': status,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False, default=str)
    }

def error_response(msg, status=400):
    return json_response({'error': msg}, status)


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    params = event.get('queryStringParameters') or {}
    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except Exception:
            pass

    # GET /?country=RUS&region=north  — список одобренных работ по стране (и опционально региону)
    if method == 'GET' and path == '/':
        country_iso = params.get('country')
        region = params.get('region')
        conn = get_conn()
        cur = conn.cursor()
        cols = ['id', 'region_key', 'country_iso', 'country_name', 'title', 'author_name', 'category', 'description', 'image_url', 'created_at']

        if country_iso and region:
            cur.execute(
                f"SELECT id, region_key, country_iso, country_name, title, author_name, category, description, image_url, created_at "
                f"FROM {SCHEMA}.works WHERE status='approved' AND country_iso=%s AND region_key=%s ORDER BY created_at DESC",
                (country_iso, region)
            )
        elif country_iso:
            cur.execute(
                f"SELECT id, region_key, country_iso, country_name, title, author_name, category, description, image_url, created_at "
                f"FROM {SCHEMA}.works WHERE status='approved' AND country_iso=%s ORDER BY created_at DESC",
                (country_iso,)
            )
        else:
            cur.execute(
                f"SELECT id, region_key, country_iso, country_name, title, author_name, category, description, image_url, created_at "
                f"FROM {SCHEMA}.works WHERE status='approved' ORDER BY created_at DESC LIMIT 50"
            )
        rows = cur.fetchall()
        conn.close()
        return json_response([dict(zip(cols, r)) for r in rows])

    # GET /?action=countries — список всех стран с работами
    if method == 'GET' and params.get('action') == 'countries':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT country_iso, country_name, COUNT(*) as cnt "
            f"FROM {SCHEMA}.works WHERE status='approved' "
            f"GROUP BY country_iso, country_name ORDER BY cnt DESC"
        )
        rows = cur.fetchall()
        conn.close()
        return json_response([{'iso': r[0], 'name': r[1], 'count': r[2]} for r in rows])

    # GET /?action=regions — список регионов России
    if method == 'GET' and params.get('action') == 'regions':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT key, name, description FROM {SCHEMA}.regions ORDER BY name")
        rows = cur.fetchall()
        conn.close()
        return json_response([{'key': r[0], 'name': r[1], 'description': r[2]} for r in rows])

    # POST / — загрузить новую работу (любая страна)
    if method == 'POST' and path == '/':
        required = ['title', 'author_name', 'category', 'country_iso', 'country_name', 'image_base64', 'image_ext']
        for f in required:
            if not body.get(f):
                return error_response(f'Поле {f} обязательно')

        category = body['category']
        if category not in ('craft', 'applique', 'drawing', 'other'):
            return error_response('Неверная категория')

        image_data = base64.b64decode(body['image_base64'])
        ext = body['image_ext'].lower().strip('.')
        if ext not in ('jpg', 'jpeg', 'png', 'gif', 'webp'):
            return error_response('Разрешены только jpg, png, gif, webp')

        file_key = f"works/{uuid.uuid4()}.{ext}"
        content_types = {'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'gif': 'image/gif', 'webp': 'image/webp'}

        s3 = get_s3()
        s3.put_object(
            Bucket='files',
            Key=file_key,
            Body=image_data,
            ContentType=content_types.get(ext, 'image/jpeg')
        )
        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_key}"

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.works (country_iso, country_name, region_key, title, author_name, category, description, image_url, status) "
            f"VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'pending') RETURNING id",
            (body['country_iso'], body['country_name'],
             body.get('region_key') or None,
             body['title'], body['author_name'], category,
             body.get('description', ''), cdn_url)
        )
        work_id = cur.fetchone()[0]
        conn.commit()
        conn.close()

        return json_response({'success': True, 'id': work_id, 'message': 'Работа отправлена на модерацию'}, 201)

    # GET /?action=pending — список работ на модерацию
    if method == 'GET' and params.get('action') == 'pending':
        if params.get('password') != os.environ.get('ADMIN_PASSWORD', ''):
            return error_response('Неверный пароль', 403)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, region_key, country_iso, country_name, title, author_name, category, description, image_url, created_at "
            f"FROM {SCHEMA}.works WHERE status='pending' ORDER BY created_at ASC"
        )
        rows = cur.fetchall()
        conn.close()
        cols = ['id', 'region_key', 'country_iso', 'country_name', 'title', 'author_name', 'category', 'description', 'image_url', 'created_at']
        return json_response([dict(zip(cols, r)) for r in rows])

    # POST /?action=moderate — одобрить или отклонить
    if method == 'POST' and params.get('action') == 'moderate':
        if body.get('password') != os.environ.get('ADMIN_PASSWORD', ''):
            return error_response('Неверный пароль', 403)
        work_id = body.get('id')
        action = body.get('action')
        if not work_id or action not in ('approve', 'reject'):
            return error_response('Укажите id и action (approve/reject)')
        status = 'approved' if action == 'approve' else 'rejected'
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"UPDATE {SCHEMA}.works SET status=%s, moderated_at=%s WHERE id=%s",
            (status, datetime.now(), work_id)
        )
        conn.commit()
        conn.close()
        return json_response({'success': True, 'status': status})

    return error_response('Маршрут не найден', 404)
