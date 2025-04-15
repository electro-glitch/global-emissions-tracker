import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const YearSlider = ({ value, onChange }) => {
  return (
    <div style={{ margin: "20px 0" }}>
      <h3>Select Year Range: {value[0]} - {value[1]}</h3>
      <Slider
        range
        min={2015}
        max={2021}
        defaultValue={value}
        value={value}
        onChange={onChange}
        styles={{
          handle: { borderColor: "#4a90e2", boxShadow: "none" },
          track: { backgroundColor: "#4a90e2" },
        }}
      />
    </div>
  );
};

export default YearSlider;
