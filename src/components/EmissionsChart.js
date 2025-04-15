import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const EmissionsChart = ({ selectedType, selectedGas, data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <p style={{ margin: "20px 0" }}>No data available for the selected filters.</p>;
  }

  return (
    <div style={{ margin: "20px 0" }}>
      <h2>
        {selectedType === "gas" ? `${selectedGas} Emissions` : "Sector Emissions"}
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis
            label={{
              value: "Emissions (MtCO₂e)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="emissions"
            stroke="#8884d8"
            name={selectedType === "gas" ? selectedGas : "Emissions"}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmissionsChart;
