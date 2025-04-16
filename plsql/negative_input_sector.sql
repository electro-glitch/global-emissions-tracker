DELIMITER $$

CREATE TRIGGER check_negative_emissions
BEFORE INSERT ON sector_emissions
FOR EACH ROW
BEGIN
  IF NEW.`Sector-wise Total Emissions` < 0 AND NEW.sector != 'Land Use' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Negative emissions only allowed for Land Use sector';
  END IF;
END$$

DELIMITER ;
