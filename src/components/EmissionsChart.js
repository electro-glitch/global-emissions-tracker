import { useEffect, useState } from "react";
import { loadCSV } from "../utils/readCSV.js";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./EmissionsChart.css";

const EmissionsChart = ({ selectedCountry, selectedType, selectedGas, yearRange }) => {
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    let fileToLoad = "";

    // 🟢 **Choose file based on selected type**
    if (selectedType === "gas") {
      if (selectedGas === "CO2") fileToLoad = "table7_co2.csv";
      else if (selectedGas === "CH4") fileToLoad = "table7_ch4.csv";
      else if (selectedGas === "N2O") fileToLoad = "table7_n2o.csv";
      else if (selectedGas === "F-Gas") fileToLoad = "table7_f-gas.csv";
    } else {
      fileToLoad = "table2.csv"; // ✅ Correct file for sector-wise emissions
    }

    if (!fileToLoad) return;

    loadCSV(fileToLoad).then((csvData) => {
      console.log(`Loaded data from ${fileToLoad}:`, csvData);

      const countryColumn = csvData[0]["Country Name"] ? "Country Name" : "Country/Region";

      // 🟢 **Sector-Wise Data Handling**
      if (selectedType === "sector") {
        const countryData = csvData.filter(item => item[countryColumn] === selectedCountry);

        if (!countryData.length) {
          setData([]);
          setTableData([]);
          return;
        }

        // 🔹 Convert into { year, emissions, sector }
        const emissionsData = countryData
          .map(item => ({
            year: parseInt(item.Year),
            emissions: parseFloat(item["Sector-wise Total Emissions"] || 0), // ✅ Ensure correct column
            sector: item["Sector"],
          }))
          .filter(entry => entry.year >= yearRange[0] && entry.year <= yearRange[1]);

        console.log("Sector-Wise Data:", emissionsData);
        setData(emissionsData);
        setTableData(emissionsData);
      } 

      // 🟢 **Gas-Wise Data Handling**
      else {
        const countryData = csvData.find(item => item[countryColumn] === selectedCountry);
        if (!countryData) {
          setData([]);
          setTableData([]);
          return;
        }

        const emissionsData = Object.keys(countryData)
          .filter(key => key.match(/^\d{4}$/)) // ✅ Extract only year columns
          .map(year => ({
            year: parseInt(year),
            emissions: parseFloat(countryData[year]) || 0,
          }))
          .filter(entry => entry.year >= yearRange[0] && entry.year <= yearRange[1]);

        console.log("Gas-Wise Data:", emissionsData);
        setData(emissionsData);
        setTableData(emissionsData);
      }
    });
  }, [selectedCountry, selectedType, selectedGas, yearRange]);

  return (
    <div>
      {data.length === 0 ? (
        <p className="no-data">No data available for the selected filters.</p>
      ) : (
        <>
          {/* 📊 Line Chart */}
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="emissions" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>

          {/* 📋 Data Table */}
          <table className="emissions-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Emissions</th>
                {selectedType === "sector" && <th>Sector</th>} {/* 🟢 Show Sector column only for sector-wise */}
              </tr>
            </thead>
            <tbody>
              {tableData.map((entry) => (
                <tr key={entry.year}>
                  <td>{entry.year}</td>
                  <td>{entry.emissions}</td>
                  {selectedType === "sector" && <td>{entry.sector}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default EmissionsChart;
