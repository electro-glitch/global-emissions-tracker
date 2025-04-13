import { useEffect, useState } from "react";

const CountryDropdown = ({ onSelect }) => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    loadCSV("table1.csv").then((csvData) => {
      const uniqueCountries = [...new Set(csvData.map((item) => item["Country Name"]))].sort();
      setCountries(uniqueCountries);
    });
  }, []);

  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      <option value="">Select a country</option>
      {countries.map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
  );
};

export default CountryDropdown;
