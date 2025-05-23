import React, { useState } from "react";
import Slider from "@mui/material/Slider";

interface PriceSliderProps {
  min?: number;
  max?: number;
  step?: number;
  initialMin?: number;
  initialMax?: number;
  onChange?: (values: [number, number]) => void;
}

const PriceSlider: React.FC<PriceSliderProps> = ({
  min = 500,
  max = 5000,
  step = 100,
  initialMin = 500,
  initialMax = 2000,
  onChange,
}) => {
  const minDistance = 50;

  const [value, setValue] = useState<number[]>([initialMin, initialMax]);

  const handleChange = (
    _event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) return;

    let updatedValue: number[];

    if (activeThumb === 0) {
      updatedValue = [Math.min(newValue[0], value[1] - minDistance), value[1]];
    } else {
      updatedValue = [value[0], Math.max(newValue[1], value[0] + minDistance)];
    }

    setValue(updatedValue);

    if (onChange) {
      onChange([updatedValue[0], updatedValue[1]]);
    }
  };

  function valuetext(value: number) {
    return `GHC${value}`;
  }

  return (
    <div className="w-full flex flex-col gap-2 pl-10">
      <p className="text-lg font-normal">{`GHC${value[0]}.00 - GHC${value[1]}.00`}</p>
      <Slider
        aria-label="Price range"
        value={value}
        onChange={handleChange}
        getAriaValueText={valuetext}
        disableSwap
        min={min}
        max={max}
        step={step}
        sx={{
          color: "#d3a306", // primary color
          "& .MuiSlider-thumb": {
            backgroundColor: "#fff",
            border: "2px solid currentColor",
            "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
              boxShadow: "inherit",
            },
            "&:before": {
              display: "none",
            },
          },
          "& .MuiSlider-valueLabel": {
            fontSize: 12,
            fontWeight: "normal",
            top: -6,
            backgroundColor: "unset",
            color: "#92400e",
            "&:before": {
              display: "none",
            },
            "& *": {
              background: "transparent",
              color: "#92400e",
            },
          },
          "& .MuiSlider-track": {
            border: "none",
          },
          "& .MuiSlider-rail": {
            opacity: 0.5,
          },
        }}
      />
    </div>
  );
};

export default PriceSlider;
