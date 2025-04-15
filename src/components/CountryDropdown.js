import React, { useState, useEffect } from "react";

const CountryDropdown = ({ onSelect }) => {
  const [countries, setCountries] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/countries");
        const data = await response.json();
        setCountries(Array.isArray(data) ? data : []);
      } catch (error) {
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSelected(value);
    onSelect(value);
  };

  return (
    <div className="country-dropdown">
      <label htmlFor="country-select">Select Country:</label>
      <select
        id="country-select"
        value={selected}
        onChange={handleChange}
        disabled={loading}
      >
        <option value="">-- Select a country --</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
      {loading && <span className="loading-indicator">Loading countries...</span>}
    </div>
  );
};

export default CountryDropdown;
