-- Editing the schema 
ALTER TABLE mainProcessedDailyFeatures
ADD CONSTRAINT unique_asset_date UNIQUE (date, asset);

-- Creating the timestamp that shows generated date 
ALTER TABLE mainProcessedDailyFeatures
MODIFY created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX idx_asset_date 
ON mainProcessedDailyFeatures(date, asset);

CREATE INDEX idx_date 
ON mainProcessedDailyFeatures(date);

ALTER TABLE assets
MODIFY asset_id BIGINT AUTO_INCREMENT;

ALTER TABLE PCA_macro_factors
MODIFY id BIGINT AUTO_INCREMENT;

ALTER TABLE PCA_macro_factors
ADD CONSTRAINT unique_pca_date UNIQUE(date);

RENAME TABLE market_strucutre_daily 
TO market_structure_daily;

ALTER TABLE market_structure_daily
CHANGE data date DATE;

ALTER TABLE market_structure_daily
MODIFY id BIGINT AUTO_INCREMENT;

ALTER TABLE market_structure_daily
ADD CONSTRAINT unique_structure_date UNIQUE(date);

ALTER TABLE market_leadership_daily
MODIFY id BIGINT AUTO_INCREMENT;

CREATE INDEX idx_leadership_date
ON market_leadership_daily(date);

CREATE TABLE macro_regime_daily (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date DATE UNIQUE,
    regime_name VARCHAR(100),
    regime_score FLOAT
);

CREATE TABLE sector_ranking_daily (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    asset VARCHAR(100) NOT NULL,
    rank_position INT,
    score FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_asset_day (date, asset)
);
