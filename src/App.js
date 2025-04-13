import { useState, useEffect } from "react";
import CountryDropdown from "./components/CountryDropdown.js";
import EmissionsChart from "./components/EmissionsChart.js";
import "./App.css";

function App() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedType, setSelectedType] = useState("sector"); // Default to sector
  const [selectedGas, setSelectedGas] = useState("CO2"); // Default gas
  const [yearRange, setYearRange] = useState([2015, 2021]); // Updated to match dataset
  const [emissionsData, setEmissionsData] = useState([]); // Store fetched data

  useEffect(() => {
    if (selectedCountry) {
      fetchData();
    }
  }, [selectedCountry, selectedType, selectedGas]);

  const fetchData = async () => {
    let url = `http://localhost:5000/api/emissions?country=${selectedCountry}&type=${selectedType}`;

    if (selectedType === "gas") {
      url += `&gas=${selectedGas}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setEmissionsData(data);
    } catch (error) {
      console.error("Error fetching emissions data:", error);
    }
  };

  return (
    <div className="container">
      <h1>GHG Emissions Dashboard</h1>

      {/* Dropdown to select country */}
      <CountryDropdown onSelect={setSelectedCountry} />

      {/* Toggle between Gas-wise and Sector-wise */}
      <div className="option-toggle">
        <label>
          <input
            type="radio"
            value="sector"
            checked={selectedType === "sector"}
            onChange={() => setSelectedType("sector")}
          />
          Sector-wise Emissions
        </label>
        <label>
          <input
            type="radio"
            value="gas"
            checked={selectedType === "gas"}
            onChange={() => setSelectedType("gas")}
          />
          Gas-wise Emissions
        </label>
      </div>

      {/* Dropdown for selecting gases when gas-wise is chosen */}
      {selectedType === "gas" && (
        <select onChange={(e) => setSelectedGas(e.target.value)} value={selectedGas}>
          <option value="CO2">CO₂</option>
          <option value="CH4">CH₄</option>
          <option value="N2O">N₂O</option>
          <option value="F-Gas">F-Gas</option>
        </select>
      )}

      {/* Emissions Chart & Table */}
      {selectedCountry && (
        <EmissionsChart
          selectedCountry={selectedCountry}
          selectedType={selectedType}
          selectedGas={selectedGas}
          yearRange={yearRange}
          data={emissionsData} // Pass fetched data to the chart
        />
      )}
    </div>
  );
}

export default App;
