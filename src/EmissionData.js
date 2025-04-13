import { useEffect, useState } from "react";
import { loadCSV } from "../utils/readCSV.js";

const EmissionData = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [yearRange, setYearRange] = useState({ start: 1990, end: 2025 });
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Load emissions data from Table 1 (since it contains total emissions)
    loadCSV("table1.csv").then((csvData) => {
      console.log("First Row of CSV:", csvData[0]); 
      const formattedData = csvData
      .filter(row => row["Total Emissions"]) // Remove empty values
      .map(row => ({
        year: parseInt(row["Year"]?.trim(), 10),
        value: parseFloat(row["Total Emissions"]?.trim()) || 0, // Default to 0 if NaN
        unit: "MtCO₂e",
      }));
    
      
      setData(formattedData);
      setFilteredData(formattedData);
    });
  }, []);

  // Function to filter data based on year range and search term
  useEffect(() => {
    const filtered = data.filter(
      (item) =>
        item.year >= yearRange.start &&
        item.year <= yearRange.end &&
        item.year.toString().includes(search)
    );
    setFilteredData(filtered);
  }, [yearRange, search, data]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">GHG Emissions Data</h2>

      {/* Filter Controls */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block font-medium">Start Year</label>
          <input
            type="number"
            value={yearRange.start}
            onChange={(e) =>
              setYearRange({ ...yearRange, start: parseInt(e.target.value) })
            }
            className="border p-2 rounded w-24"
          />
        </div>
        <div>
          <label className="block font-medium">End Year</label>
          <input
            type="number"
            value={yearRange.end}
            onChange={(e) =>
              setYearRange({ ...yearRange, end: parseInt(e.target.value) })
            }
            className="border p-2 rounded w-24"
          />
        </div>
        <div>
          <label className="block font-medium">Search Year</label>
          <input
            type="text"
            placeholder="1990..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-32"
          />
        </div>
      </div>

      {/* Data Display */}
      <ul className="list-disc pl-6">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <li key={index} className="text-lg">
              {item.year}: {item.value} {item.unit}
            </li>
          ))
        ) : (
          <li className="text-gray-500">No data available for this range.</li>
        )}
      </ul>
    </div>
  );
};

export default EmissionData;
