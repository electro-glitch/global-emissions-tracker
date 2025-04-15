import React, { useState } from "react";
import "./AdminPanel.css";

const tableFields = {
  gas_emissions: ["country_name", "year", "co2", "ch4", "n2o", "f_gas"],
  sector_emissions: ["country_name", "year", "sector", "Sector-wise Total Emissions"],
  country_emissions: ["country_name", "year", "total_emissions"],
  gdp_emissions: ["country_name", "year", "gdp"],
  emissions_change: ["country_name", "year", "percentage_change"],
  income_per_capita: ["country_name", "year", "income"],
  population_emissions: ["country_name", "year", "population"]
};

export default function AdminPanel() {
  const [selectedTable, setSelectedTable] = useState("gas_emissions");
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTableChange = (e) => {
    setSelectedTable(e.target.value);
    setFormData({});
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
  
    try {
      const res = await fetch("http://localhost:5000/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: selectedTable, data: formData })
      });
      const data = await res.json();
  
      if (data.success) {
        setMessage("✅ Data added successfully!");
        setFormData({});
      } else {
        // This will show the MySQL SIGNAL error message to the user
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage("❌ Error connecting to server.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="admin-panel">
      <h2>Admin Data Management</h2>
      <p>Add new data to database tables</p>
      
      <div className="table-selector">
        <label htmlFor="table-select">Select Table:</label>
        <select 
          id="table-select"
          value={selectedTable} 
          onChange={handleTableChange}
          disabled={isLoading}
        >
          {Object.keys(tableFields).map(table => (
            <option key={table} value={table}>{table}</option>
          ))}
        </select>
      </div>
      
      <form onSubmit={handleAdd}>
        <div className="form-fields">
            {tableFields[selectedTable].map(field => (
            <div key={field} className="form-group">
                <label htmlFor={field}>{field.replace(/_/g, " ").toUpperCase()}</label>
                <input
                id={field}
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                disabled={isLoading}
                required
                />
            </div>
            ))}
        </div>
        <button 
            type="submit" 
            className="add-button"
            disabled={isLoading}
        >
            {isLoading ? "Adding..." : "Add Data"}
        </button>
        </form>


      
      {message && <div className={`message ${message.startsWith("✅") ? "success" : "error"}`}>{message}</div>}
    </div>
  );
}
