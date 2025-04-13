const DataToggle = ({ selectedType, onSelect }) => {
    return (
      <div>
        <button onClick={() => onSelect("gas")} style={{ margin: "5px", background: selectedType === "gas" ? "lightblue" : "white" }}>
          Gas-wise Emissions
        </button>
        <button onClick={() => onSelect("sector")} style={{ margin: "5px", background: selectedType === "sector" ? "lightblue" : "white" }}>
          Sector-wise Emissions
        </button>
      </div>
    );
  };
  
  export default DataToggle;
  