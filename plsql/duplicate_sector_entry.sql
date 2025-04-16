DELIMITER $$

CREATE TRIGGER prevent_duplicate_sector_entry
BEFORE INSERT ON sector_emissions
FOR EACH ROW
BEGIN
  IF (
    SELECT COUNT(*) FROM sector_emissions
    WHERE country_name = NEW.country_name
      AND year = NEW.year
      AND sector = NEW.sector
  ) > 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Duplicate entry: This sector for this country and year already exists.';
  END IF;
END$$

DELIMITER ;
