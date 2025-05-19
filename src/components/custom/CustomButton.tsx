import React, { useState } from "react";
import { cn } from "@/lib/utils";

const CustomButton = ({
  name,
  primaryColor,
  secondColor,
  outlineColor,
  disabled = false,
  size = "default",
  handleClick,
}: {
  name: string;
  primaryColor: string;
  secondColor: string;
  outlineColor: string;
  disabled?: boolean;
  size?: "sm" | "default" | "lg";
  handleClick?: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const sizeClasses = {
    sm: "w-[150px] text-sm",
    default: "w-[170px] lg:w-[180px] text-base",
    lg: "w-[200px] text-lg",
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "relative flex items-center gap-1 px-9 py-1 border-4 border-transparent font-semibold rounded-full overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] group",
        sizeClasses[size],
        {
          "cursor-not-allowed opacity-60 bg-slate-300 text-slate-500": disabled,
          "cursor-pointer hover:rounded-xl active:scale-95": !disabled,
        },
      )}
      style={
        !disabled
          ? {
              color: isHovered ? "#212121" : secondColor,
              backgroundColor: isHovered ? secondColor : primaryColor,
              boxShadow: isHovered
                ? `0 0 0 4px ${primaryColor}`
                : `0 0 0 2px ${outlineColor}`,
              transition:
                "box-shadow 0.5s cubic-bezier(0.23,1,0.32,1), color 0.5s cubic-bezier(0.23,1,0.32,1), border-radius 0.5s cubic-bezier(0.23,1,0.32,1), background-color 0.5s cubic-bezier(0.23,1,0.32,1)",
            }
          : {}
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
    >
      <svg
        viewBox="0 0 24 24"
        className={cn(
          "absolute w-6 z-[9] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] -left-[25%]",
          !disabled && "group-hover:left-4",
        )}
        style={{
          fill: disabled ? "#a0aec0" : isHovered ? "#212121" : secondColor,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
      </svg>
      <span
        className={cn(
          "text-[14px] lg:text-lg relative z-[1] -translate-x-3 transition-all duration-600 ease-[cubic-bezier(0.23,1,0.32,1)]",
          !disabled && "group-hover:translate-x-3",
        )}
      >
        {name}
      </span>
      {!disabled && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-yellow-500 rounded-full opacity-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100"></div>
      )}
      <svg
        viewBox="0 0 24 24"
        className={cn(
          "absolute w-6 z-[9] transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] right-4",
          !disabled && "group-hover:-right-[25%]",
        )}
        style={{
          fill: disabled ? "#a0aec0" : isHovered ? "#212121" : secondColor,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
      </svg>
    </button>
  );
};

export default CustomButton;
