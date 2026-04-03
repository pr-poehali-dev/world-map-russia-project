
ALTER TABLE t_p10920719_world_map_russia_pro.works
  ADD COLUMN IF NOT EXISTS country_iso VARCHAR(10) DEFAULT 'RUS',
  ADD COLUMN IF NOT EXISTS country_name VARCHAR(150) DEFAULT 'Россия';

UPDATE t_p10920719_world_map_russia_pro.works SET country_iso = 'RUS', country_name = 'Россия' WHERE country_iso IS NULL;

CREATE INDEX IF NOT EXISTS idx_works_country ON t_p10920719_world_map_russia_pro.works(country_iso);
