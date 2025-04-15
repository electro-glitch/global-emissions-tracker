-- Nested Subquery 1: High Emission Sectors
SET SERVEROUTPUT ON;
BEGIN
  DBMS_OUTPUT.PUT_LINE('Sectors with Above-Average Emissions:');
  FOR rec IN (
    SELECT sector, "Sector-wise Total Emissions" AS emissions
    FROM sector_emissions
    WHERE "Sector-wise Total Emissions" > (
      SELECT AVG("Sector-wise Total Emissions")
      FROM sector_emissions
      WHERE country_name = 'Bahrain' AND year = 2020
    )
    AND country_name = 'Bahrain' AND year = 2020
  ) LOOP
    DBMS_OUTPUT.PUT_LINE(rec.sector || ': ' || rec.emissions || ' MtCO₂e');
  END LOOP;
END;
/
