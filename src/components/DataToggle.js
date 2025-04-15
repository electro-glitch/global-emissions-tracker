import React from "react";

const DataToggle = ({ selectedType, onSelect }) => {
  return (
    <div style={{ margin: "20px 0", display: "flex", gap: "12px" }}>
      <button
        onClick={() => onSelect("gas")}
        style={{
          padding: "10px 24px",
          borderRadius: "6px",
          border: "none",
          background: selectedType === "gas" ? "#4a90e2" : "#e3f0fa",
          color: selectedType === "gas" ? "#fff" : "#2d3a4a",
          fontWeight: 500,
          cursor: "pointer",
          boxShadow: selectedType === "gas" ? "0 2px 8px #4a90e222" : "none",
          transition: "background 0.2s"
        }}
      >
        Gas-wise Emissions
      </button>
      <button
        onClick={() => onSelect("sector")}
        style={{
          padding: "10px 24px",
          borderRadius: "6px",
          border: "none",
          background: selectedType === "sector" ? "#4a90e2" : "#e3f0fa",
          color: selectedType === "sector" ? "#fff" : "#2d3a4a",
          fontWeight: 500,
          cursor: "pointer",
          boxShadow: selectedType === "sector" ? "0 2px 8px #4a90e222" : "none",
          transition: "background 0.2s"
        }}
      >
        Sector-wise Emissions
      </button>
    </div>
  );
};

export default DataToggle;
