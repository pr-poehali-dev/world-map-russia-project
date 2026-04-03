
CREATE TABLE t_p10920719_world_map_russia_pro.regions (
  id SERIAL PRIMARY KEY,
  key VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

INSERT INTO t_p10920719_world_map_russia_pro.regions (key, name, description) VALUES
('north', 'Север', 'Архангельская, Вологодская, Мурманская области. Суровый климат, строгие орнаменты, кружево.'),
('south', 'Юг', 'Краснодарский край, Ростовская, Воронежская области. Яркие краски, казачество, степные мотивы.'),
('ural', 'Урал', 'Свердловская, Пермская, Челябинская области. Самоцветы, горнозаводской стиль.'),
('siberia', 'Сибирь', 'От Тюмени до Байкала. Слияние русских традиций с культурой коренных народов.'),
('center', 'Центр', 'Московская, Ярославская, Тверская области. Сердце русской культуры и ремёсел.'),
('volga', 'Поволжье', 'Нижегородская, Самарская, Казанская области. Многонациональный регион с богатым орнаментом.'),
('northwest', 'Северо-Запад', 'Санкт-Петербург, Псков, Новгород. Балтийские мотивы и европейские влияния.');

CREATE TABLE t_p10920719_world_map_russia_pro.works (
  id SERIAL PRIMARY KEY,
  region_key VARCHAR(50) NOT NULL REFERENCES t_p10920719_world_map_russia_pro.regions(key),
  title VARCHAR(200) NOT NULL,
  author_name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('craft', 'applique', 'drawing', 'other')),
  description TEXT,
  image_url TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW(),
  moderated_at TIMESTAMP
);

CREATE INDEX idx_works_region ON t_p10920719_world_map_russia_pro.works(region_key);
CREATE INDEX idx_works_status ON t_p10920719_world_map_russia_pro.works(status);
