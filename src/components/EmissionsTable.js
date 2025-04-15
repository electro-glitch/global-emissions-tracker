import React from "react";
import "./EmissionsTable.css";

const EmissionsTable = ({ data, selectedType }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="data-empty">
        No data available for the selected filters.
      </div>
    );
  }

  // Define columns based on selected type
  let headers = [];
  if (selectedType === "sector") {
    headers = ["Year", "Emissions (MtCO₂e)", "Sector"];
  } else if (selectedType === "gas") {
    headers = ["Year", "Emissions (MtCO₂e)"];
  } else if (selectedType === "gdp") {
    headers = ["Year", "GDP"];
  } else if (selectedType === "trends") {
    headers = ["Year", "Percentage Change"];
  } else if (selectedType === "income") {
    headers = ["Year", "Income Per Capita"];
  } else if (selectedType === "population") {
    headers = ["Year", "Population"];
  } else if (selectedType === "total") {
    headers = ["Year", "Total Emissions"];
  }

  return (
    <table className="emissions-table">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((entry, idx) => (
          <tr key={`${entry.year}-${idx}`}>
            <td>{entry.year}</td>
            
            {selectedType === "sector" && (
              <>
                <td>{Number(entry.emissions).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                <td>{entry.sector}</td>
              </>
            )}
            
            {selectedType === "gas" && (
              <td>{Number(entry.emissions).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
            )}
            
            {selectedType === "gdp" && (
              <td>{Number(entry.gdp).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
            )}
            
            {selectedType === "trends" && (
              <td>{Number(entry.percentage_change).toLocaleString(undefined, { maximumFractionDigits: 2 })}%</td>
            )}
            
            {selectedType === "income" && (
              <td>${Number(entry.income).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
            )}
            
            {selectedType === "population" && (
              <td>{Number(entry.population).toLocaleString()}</td>
            )}
            
            {selectedType === "total" && (
              <td>{Number(entry.total_emissions).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EmissionsTable;
