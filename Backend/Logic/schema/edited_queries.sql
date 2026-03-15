use treadcasterdb;
-- drop table mainprocesseddailyfeatures;
TRUNCATE TABLE assets;
TRUNCATE TABLE macro_regime_daily;
TRUNCATE TABLE mainprocesseddailyfeatures;
ALTER TABLE mainProcessedDailyFeatures
ADD UNIQUE KEY unique_asset_date (date, Asset);
SELECT COUNT(*)
FROM mainProcessedDailyFeatures
WHERE DATE(created_at) = CURDATE();

SELECT *
FROM mainProcessedDailyFeatures
ORDER BY created_at DESC
LIMIT 10;

ALTER TABLE PCA_macro_factors
MODIFY id BIGINT NOT NULL AUTO_INCREMENT;
ALTER TABLE PCA_macro_factors
ADD UNIQUE KEY unique_date (date);


DROP TABLE market_leadership_daily;

DROP TABLE sector_ranking_daily;
USE treadcasterdb;
CREATE TABLE sector_ranking_daily (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    asset VARCHAR(100) NOT NULL,
    rank_position INT,
    score FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_asset_day (date, asset)
);

ALTER TABLE assets
MODIFY asset_id BIGINT AUTO_INCREMENT;

CREATE TABLE asset_metadata(
    asset VARCHAR(100) PRIMARY KEY,
    asset_class VARCHAR(100),
    macro_role VARCHAR(100)
);

DROP table sector_ranking_daily;