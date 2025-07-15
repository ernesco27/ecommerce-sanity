import React from "react";
import { Button } from "../ui/button";

interface ActiveFilter {
  type: string;
  value: string;
  onRemove: (type: string, value: string | number) => void;
}

const ActiveFilter = ({ type, value, onRemove }: ActiveFilter) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onRemove(type, value)}
      className="bg-primary-500 dark:bg-primary-500 dark:hover:bg-primary-900 cursor-pointer capitalize hover:bg-primary-100 transition-all duration-200 ease-in-out "
    >
      {value} <span className="text-[10px]">x</span>
    </Button>
  );
};

export default ActiveFilter;
