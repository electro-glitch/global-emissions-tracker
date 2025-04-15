-- PL/SQL Command: Update Total Emissions
CREATE OR REPLACE PROCEDURE update_total_emissions AS
BEGIN
  UPDATE country_emissions ce
  SET ce.total_emissions = (
    SELECT SUM(se."Sector-wise Total Emissions")
    FROM sector_emissions se
    WHERE se.country_name = ce.country_name
      AND se.year = ce.year
  );
  DBMS_OUTPUT.PUT_LINE('Total emissions updated successfully');
END update_total_emissions;
/
