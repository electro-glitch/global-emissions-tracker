import React, { useState } from "react";

function ResultTable({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div style={{ color: "#94a3b8", padding: "10px" }}>No data found.</div>;
  }
  const columns = Object.keys(data[0]);
  return (
    <table style={{
      width: "100%",
      borderCollapse: "collapse",
      background: "#232b3a",
      borderRadius: "8px",
      boxShadow: "0 1px 4px #0002",
      marginTop: "10px",
      color: "#e0e7ff"
    }}>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col} style={{
              borderBottom: "2px solid #38bdf8",
              padding: "8px",
              textAlign: "left",
              background: "#181f2a",
              color: "#38bdf8"
            }}>{col.replace(/_/g, " ").toUpperCase()}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map(col => (
              <td key={col} style={{
                borderBottom: "1px solid #334155",
                padding: "8px"
              }}>{row[col]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function NestedQueryDemo() {
  const [inputs, setInputs] = useState({ country: "", year: "" });
  const [results, setResults] = useState({ sectors: [], years: [] });
  const [error, setError] = useState({ sectors: "", years: "" });

  const handleQuery = async (endpoint) => {
    setError(prev => ({ ...prev, [endpoint]: "" }));
    try {
      const res = await fetch(`http://localhost:5000/api/nested/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (data.error) {
        setError(prev => ({ ...prev, [endpoint]: data.error }));
        setResults(prev => ({ ...prev, [endpoint]: [] }));
      } else {
        setResults(prev => ({ ...prev, [endpoint]: data }));
      }
    } catch (error) {
      setError(prev => ({ ...prev, [endpoint]: "Network error" }));
      setResults(prev => ({ ...prev, [endpoint]: [] }));
    }
  };

  return (
    <div style={{
      padding: "24px",
      borderRadius: "14px",
      margin: "24px 0",
      background: "#181f2a",
      boxShadow: "0 2px 12px #0003"
    }}>
        <h2 style={{ color: "#38bdf8", marginBottom: "15px" }}>Emissions Data Quick Analysis</h2>
        <div style={{ marginBottom: "15px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <input
          placeholder="Enter Country (e.g., India)"
          value={inputs.country}
          onChange={e => setInputs({ ...inputs, country: e.target.value })}
          style={{
            padding: "10px",
            width: "200px",
            borderRadius: "8px",
            border: "2px solid #334155",
            background: "#232b3a",
            color: "#e0e7ff"
          }}
        />
        <input
          placeholder="Enter Year (e.g., 2015)"
          value={inputs.year}
          onChange={e => setInputs({ ...inputs, year: e.target.value })}
          style={{
            padding: "10px",
            width: "150px",
            borderRadius: "8px",
            border: "2px solid #334155",
            background: "#232b3a",
            color: "#e0e7ff"
          }}
        />
      </div>
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "260px" }}>
          <button
            onClick={() => handleQuery("sectors-above-average")}
            style={{
              padding: "10px 20px",
              background: "linear-gradient(90deg, #38bdf8 0%, #6366f1 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginBottom: "10px",
              fontWeight: 600,
              fontSize: "1rem"
            }}
          >
            1. Show Sectors Above Average
          </button>
          {error["sectors-above-average"] ? (
            <div style={{ color: "#fca5a5", padding: "10px" }}>{error["sectors-above-average"]}</div>
          ) : (
            <ResultTable data={results["sectors-above-average"]} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: "260px" }}>
          <button
            onClick={() => handleQuery("years-above-average")}
            style={{
              padding: "10px 20px",
              background: "linear-gradient(90deg, #38bdf8 0%, #6366f1 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginBottom: "10px",
              fontWeight: 600,
              fontSize: "1rem"
            }}
          >
            2. Show Years Above Average
          </button>
          {error["years-above-average"] ? (
            <div style={{ color: "#fca5a5", padding: "10px" }}>{error["years-above-average"]}</div>
          ) : (
            <ResultTable data={results["years-above-average"]} />
          )}
        </div>
      </div>
    </div>
  );
}
