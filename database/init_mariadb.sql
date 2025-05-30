-- Create the `trade` table
CREATE TABLE trade (
    trade_id INT AUTO_INCREMENT PRIMARY KEY,
    product VARCHAR(255),
    portfolio VARCHAR(255),
    book VARCHAR(255),
    submitter_id INT,
    submitter_deal_id INT,
    deal_type VARCHAR(255),
    bid_type VARCHAR(255),
    current_value DECIMAL(15,2),
    previous_value DECIMAL(15,2),
    pl1 DECIMAL(15,2),
    pl2 DECIMAL(15,2),
    gain_dx DECIMAL(15,2),
    sx_px DECIMAL(15,2),
    x99_out DECIMAL(15,2),
    batch INT,
    birth_date DATE,
    is_sold BOOLEAN
);

-- Insert data into the `trade` table
DELIMITER //
CREATE PROCEDURE generate_data()
BEGIN
    DECLARE i INT DEFAULT 1;
    WHILE i <= 100000 DO
        INSERT INTO trade (product, portfolio, book, submitter_id, submitter_deal_id, deal_type, bid_type, current_value, previous_value, pl1, pl2, gain_dx, sx_px, x99_out, batch, birth_date, is_sold)
        VALUES (
            CONCAT('Product ', FLOOR(1 + RAND() * 10)),
            CONCAT('Portfolio ', FLOOR(1 + RAND() * 10)),
            CONCAT('Book ', FLOOR(1 + RAND() * 5)),
            i * 10, 
            CASE WHEN RAND() < 0.2 THEN NULL ELSE i * 3 END,  -- 20% chance of NULL
            CONCAT('Type ', FLOOR(1 + RAND() * 3)),
            CONCAT('Bid ', FLOOR(1 + RAND() * 2)),
            CASE WHEN RAND() < 0.2 THEN NULL ELSE RAND() * 10000 END,  -- 20% chance of NULL
            CASE WHEN RAND() < 0.2 THEN NULL ELSE RAND() * 10000 END,  -- 20% chance of NULL
            RAND() * 100, 
            RAND() * 100, 
            RAND() * 50, 
            RAND() * 50, 
            RAND() * 50, 
            i % 100, 
            CASE WHEN RAND() < 0.2 THEN NULL ELSE DATE_SUB(CURDATE(), INTERVAL (i % 365) DAY) END, 
            CASE WHEN RAND() < 0.2 THEN NULL ELSE (i % 2) = 0 END
        );
        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;

CALL generate_data();
DROP PROCEDURE generate_data;