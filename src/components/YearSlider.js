import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const YearSlider = ({ yearRange, onChange }) => {
  return (
    <div>
      <h3>Year Range: {yearRange[0]} - {yearRange[1]}</h3>
      <Slider range min={1990} max={2021} defaultValue={yearRange} onChange={onChange} />
    </div>
  );
};

export default YearSlider;
