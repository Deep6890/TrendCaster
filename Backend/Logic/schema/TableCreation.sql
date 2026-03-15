Use treadcasterdb;

-- this is the master datafrme schema 
CREATE TABLE mainProcessedDailyFeatures(
	id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    date date,
    Close float,
    High float,
    Low float,
    Open float,
    Volume float,
    trend_strength FLOAT,
    trend_consistency FLOAT,
    volatility_regime FLOAT,
    momentum_acceleration FLOAT,
    cycle_position FLOAT,
    sector VARCHAR(100),
    trend_strength_z FLOAT,
    trend_consistency_z FLOAT,
    volatility_regime_z FLOAT,
    momentum_acceleration_z FLOAT,
    cycle_position_z FLOAT,
    composite_score FLOAT,
    Asset VARCHAR(150),
    created_at TIMESTAMP
    );
-- assest storing table 
CREATE TABLE assets(
	asset_id BIGINT NOT NULL PRIMARY KEY,
    asset_name VARCHAR(100),
    asset_type VARCHAR(100),
    sector VARCHAR(100)
);
-- pca data after pivot table 
CREATE TABLE PCA_macro_factors(
	id BIGINT NOT NULL PRIMARY KEY,
	date date,
	pc1 FLOAT,
	pc2 FLOAT,
	pc3 FLOAT,
	pc4 FLOAT,
	pc5 FLOAT
);
-- one componets of llms json 
CREATE TABLE market_strucutre_daily(
	id BIGINT NOT NULL PRIMARY KEY,
    data DATE,
    avg_cross_asset_correlation_60d FLOAT,
    correlation_dispersion_60d FLOAT 
);

-- Market leader and looser things 
CREATE TABLE market_leadership_daily(
	id BIGINT NOT NULL PRIMARY KEY,
    date DATE,
    asset VARCHAR(100),
    leadership_type VARCHAR(100)
);
