import React, { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage.js";
import CountryDropdown from "./components/CountryDropdown.js";
import DataToggle from "./components/DataToggle.js";
import YearSlider from "./components/YearSlider.js";
import EmissionsTable from "./components/EmissionsTable.js";
import AdminPanel from "./components/AdminPanel.js";
import NestedQueryDemo from "./components/NestedQueryDemo.js";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, AreaChart, Area
} from "recharts";
import "./App.css";

function groupByYearAndSector(data) {
  const result = {};
  data.forEach(({ year, sector, emissions }) => {
    if (!result[year]) result[year] = { year };
    result[year][sector] = Number(emissions);
  });
  return Object.values(result);
}

function getSectors(data) {
  return Array.from(new Set(data.map(d => d.sector)));
}

function getColorForSector(sector, index) {
  const colors = [
    "#4a90e2", "#82ca9d", "#ffc658", "#d7263d", "#8e44ad", 
    "#e67e22", "#27ae60", "#f39c12", "#16a085", "#c0392b"
  ];
  return colors[index % colors.length];
}

function ChartBlock({ data, xKey, yKey, title, chartType = "line", yLabel }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="data-empty">No data available for the selected filters.</div>;
  }
  return (
    <div style={{ margin: "24px 0" }}>
      <h2>{title}</h2>
      <ResponsiveContainer width="100%" height={350}>
        {chartType === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft" } : undefined} />
            <Tooltip />
            <Bar dataKey={yKey} fill="#4a90e2" />
          </BarChart>
        ) : chartType === "area" ? (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft" } : undefined} />
            <Tooltip />
            <Area type="monotone" dataKey={yKey} stroke="#4a90e2" fill="#b3d1f7" />
          </AreaChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft" } : undefined} />
            <Tooltip />
            <Line type="monotone" dataKey={yKey} stroke="#4a90e2" />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedType, setSelectedType] = useState("sector");
  const [selectedGas, setSelectedGas] = useState("CO2");
  const [yearRange, setYearRange] = useState([2015, 2021]);
  const [emissionsData, setEmissionsData] = useState([]);
  const [activeTab, setActiveTab] = useState("emissions");
  const [gdpData, setGdpData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [populationData, setPopulationData] = useState([]);
  const [totalEmissionsData, setTotalEmissionsData] = useState([]);

  useEffect(() => {
    if (selectedCountry) {
      const fetchEmissions = async () => {
        try {
          const url = new URL("http://localhost:5000/api/emissions");
          url.searchParams.append("country", selectedCountry);
          url.searchParams.append("type", selectedType);
          url.searchParams.append("startYear", yearRange[0]);
          url.searchParams.append("endYear", yearRange[1]);
          if (selectedType === "gas") {
            url.searchParams.append("gas", selectedGas);
          }
          const response = await fetch(url);
          if (!response.ok) throw new Error("API Error");
          const data = await response.json();
          setEmissionsData(Array.isArray(data) ? data : []);
        } catch (error) {
          setEmissionsData([]);
        }
      };
      fetchEmissions();

      fetch(`http://localhost:5000/api/gdp?country=${selectedCountry}&startYear=${yearRange[0]}&endYear=${yearRange[1]}`)
        .then(res => res.json())
        .then(setGdpData)
        .catch(() => setGdpData([]));

      fetch(`http://localhost:5000/api/percentage_change?country=${selectedCountry}&startYear=${yearRange[0]}&endYear=${yearRange[1]}`)
        .then(res => res.json())
        .then(setTrendData)
        .catch(() => setTrendData([]));

      fetch(`http://localhost:5000/api/income?country=${selectedCountry}&startYear=${yearRange[0]}&endYear=${yearRange[1]}`)
        .then(res => res.json())
        .then(setIncomeData)
        .catch(() => setIncomeData([]));

      fetch(`http://localhost:5000/api/population?country=${selectedCountry}&startYear=${yearRange[0]}&endYear=${yearRange[1]}`)
        .then(res => res.json())
        .then(setPopulationData)
        .catch(() => setPopulationData([]));

      fetch(`http://localhost:5000/api/total_emissions?country=${selectedCountry}&startYear=${yearRange[0]}&endYear=${yearRange[1]}`)
        .then(res => res.json())
        .then(setTotalEmissionsData)
        .catch(() => setTotalEmissionsData([]));
    }
  }, [selectedCountry, selectedType, selectedGas, yearRange]);

  if (!user) {
    return (
      <LoginPage
        onLogin={(username, userRole) => {
          setUser(username);
          setRole(userRole);
        }}
      />
    );
  }

  return (
    <div className="container">
      <h1>Global Emissions Tracker</h1>
      <p className="welcome">
        Logged in as: <strong>{user}</strong> {role && <span>({role})</span>}
      </p>

      <CountryDropdown onSelect={setSelectedCountry} />

      {role === "admin" && <NestedQueryDemo />}

      <div className="tabs">
        <button className={activeTab === "emissions" ? "active" : ""} onClick={() => setActiveTab("emissions")}>Emissions</button>
        <button className={activeTab === "gdp" ? "active" : ""} onClick={() => setActiveTab("gdp")}>Economy</button>
        <button className={activeTab === "trends" ? "active" : ""} onClick={() => setActiveTab("trends")}>Trends</button>
        <button className={activeTab === "population" ? "active" : ""} onClick={() => setActiveTab("population")}>Population</button>
        <button className={activeTab === "income" ? "active" : ""} onClick={() => setActiveTab("income")}>Income</button>
      </div>

      {activeTab === "emissions" && (
        <>
          <DataToggle selectedType={selectedType} onSelect={setSelectedType} />
          {selectedType === "gas" && (
            <select
              onChange={(e) => setSelectedGas(e.target.value)}
              value={selectedGas}
            >
              <option value="CO2">CO₂</option>
              <option value="CH4">CH₄</option>
              <option value="N2O">N₂O</option>
              <option value="F-Gas">F-Gas</option>
            </select>
          )}
          {selectedCountry && (
            <>
              <YearSlider value={yearRange} onChange={setYearRange} />
              {selectedType === "sector" ? (
                <div style={{ margin: "24px 0" }}>
                  <h2>Sector Emissions</h2>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={groupByYearAndSector(emissionsData)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis label={{ value: "Emissions (MtCO₂e)", angle: -90, position: "insideLeft" }} />
                      <Tooltip />
                      <Legend />
                      {getSectors(emissionsData).map((sector, index) => (
                        <Bar key={sector} dataKey={sector} fill={getColorForSector(sector, index)} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <ChartBlock
                  data={emissionsData}
                  xKey="year"
                  yKey="emissions"
                  title={`${selectedGas} Emissions`}
                  chartType="line"
                  yLabel="Emissions (MtCO₂e)"
                />
              )}
              <EmissionsTable data={emissionsData} selectedType={selectedType} />
              <h3 style={{ marginTop: 32 }}>Total Emissions</h3>
              <ChartBlock
                data={totalEmissionsData}
                xKey="year"
                yKey="total_emissions"
                title="Total Emissions"
                chartType="line"
                yLabel="Total Emissions"
              />
              <EmissionsTable data={totalEmissionsData} selectedType="total" />
            </>
          )}
        </>
      )}

      {activeTab === "gdp" && (
        <div>
          <h2>GDP Data</h2>
          {selectedCountry && (
            <>
              <YearSlider value={yearRange} onChange={setYearRange} />
              <ChartBlock
                data={gdpData}
                xKey="year"
                yKey="gdp"
                title="GDP"
                chartType="line"
                yLabel="GDP"
              />
              <EmissionsTable data={gdpData} selectedType="gdp" />
            </>
          )}
        </div>
      )}

      {activeTab === "trends" && (
        <div>
          <h2>Emission Trends (Percentage Change)</h2>
          {selectedCountry && (
            <>
              <YearSlider value={yearRange} onChange={setYearRange} />
              <ChartBlock
                data={trendData}
                xKey="year"
                yKey="percentage_change"
                title="Percentage Change"
                chartType="area"
                yLabel="Percentage Change (%)"
              />
              <EmissionsTable data={trendData} selectedType="trends" />
            </>
          )}
        </div>
      )}

      {activeTab === "population" && (
        <div>
          <h2>Population</h2>
          {selectedCountry && (
            <>
              <YearSlider value={yearRange} onChange={setYearRange} />
              <ChartBlock
                data={populationData}
                xKey="year"
                yKey="population"
                title="Population"
                chartType="bar"
                yLabel="Population"
              />
              <EmissionsTable data={populationData} selectedType="population" />
            </>
          )}
        </div>
      )}

      {activeTab === "income" && (
        <div>
          <h2>Income Per Capita</h2>
          {selectedCountry && (
            <>
              <YearSlider value={yearRange} onChange={setYearRange} />
              <ChartBlock
                data={incomeData}
                xKey="year"
                yKey="income"
                title="Income Per Capita"
                chartType="line"
                yLabel="Income"
              />
              <EmissionsTable data={incomeData} selectedType="income" />
            </>
          )}
        </div>
      )}

      {role === "admin" && <AdminPanel />}
    </div>
  );
}

export default App;
