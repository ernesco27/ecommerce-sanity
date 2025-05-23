import React from "react";
import { Check } from "lucide-react";

interface ColorOption {
  name: string;
  code: string;
}

const COLORS: ColorOption[] = [
  { name: "black", code: "#000000" },
  { name: "grey", code: "#808080" },
  { name: "green", code: "#00A36C" },
  { name: "red", code: "#FF0000" },
  { name: "orange", code: "#FFA500" },
  { name: "blue", code: "#0000FF" },
  { name: "pink", code: "#FFC0CB" },
  { name: "white", code: "#FFFFFF" },
];

interface ColorFilterProps {
  selectedColors: string[];
  onColorChange: (colors: string[]) => void;
}

const ColorFilter: React.FC<ColorFilterProps> = ({
  selectedColors,
  onColorChange,
}) => {
  const toggleColor = (colorName: string) => {
    if (selectedColors.includes(colorName)) {
      onColorChange(selectedColors.filter((c) => c !== colorName));
    } else {
      onColorChange([...selectedColors, colorName]);
    }
  };

  return (
    <div className="w-full flex flex-col gap-3 justify-center ml-10">
      {COLORS.map((color) => (
        <button
          key={color.name}
          onClick={() => toggleColor(color.name)}
          className={`
            w-8 h-8 rounded-full flex items-center justify-center cursor-pointer
            ${color.name === "White" ? "border border-gray-200" : ""}
            transition-transform hover:scale-110
            ${selectedColors.includes(color.name) ? "ring-2 ring-yellow-500 ring-offset-2" : ""}
          `}
          style={{ backgroundColor: color.code }}
          title={color.name}
        >
          {selectedColors.includes(color.name) && (
            <Check
              size={16}
              className={color.name === "White" ? "text-black" : "text-white"}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default ColorFilter;
