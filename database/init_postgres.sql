-- POSTGRESQL VERSION
-- Create the `trade` table
CREATE TABLE trade (
    trade_id SERIAL PRIMARY KEY,
    product VARCHAR(255),
    portfolio VARCHAR(255),
    book VARCHAR(255),
    submitter_id INTEGER,
    submitter_deal_id INTEGER,
    deal_type VARCHAR(255),
    bid_type VARCHAR(255),
    current_value NUMERIC,
    previous_value NUMERIC,
    pl1 NUMERIC,
    pl2 NUMERIC,
    gain_dx NUMERIC,
    sx_px NUMERIC,
    x99_out NUMERIC,
    batch INTEGER,
    birth_date DATE,
    is_sold BOOLEAN
);

-- Insert data into the `trade` table
DO $$
BEGIN
    FOR i IN 1..100000 LOOP
        INSERT INTO trade (product, portfolio, book, submitter_id, submitter_deal_id, deal_type, bid_type, current_value, previous_value, pl1, pl2, gain_dx, sx_px, x99_out, batch, birth_date, is_sold)
        VALUES (
            'Product ' || (FLOOR(RANDOM() * 10) + 1),  -- Random product between 1 and 10
            'Portfolio ' || (FLOOR(RANDOM() * 10) + 1),  -- Random portfolio between 1 and 10
            'Book ' || (FLOOR(RANDOM() * 5) + 1),  -- Random book between 1 and 5
            i * 10, 
            CASE WHEN RANDOM() < 0.2 THEN NULL ELSE i * 20 END,  -- 20% chance of NULL
            'Type ' || (FLOOR(RANDOM() * 3) + 1),  -- Random deal type between 1 and 3
            'Bid ' || (FLOOR(RANDOM() * 2) + 1),
            CASE WHEN RANDOM() < 0.2 THEN NULL ELSE RANDOM() * 10000 END,  -- 20% chance of NULL
            CASE WHEN RANDOM() < 0.2 THEN NULL ELSE RANDOM() * 10000 END,  -- 20% chance of NULL
            RANDOM() * 100, 
            RANDOM() * 100, 
            RANDOM() * 50, 
            RANDOM() * 50, 
            RANDOM() * 50, 
            i % 100, 
            CASE WHEN RANDOM() < 0.2 THEN NULL ELSE CURRENT_DATE - (i % 365) END, 
            CASE WHEN RANDOM() < 0.2 THEN NULL ELSE (i % 2) = 0 END
        );
    END LOOP;
END $$;