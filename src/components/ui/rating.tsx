"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface ProductRatingProps {
  value?: number;
  onChange?: (value: number) => void;
}

const ProductRating = ({ value = 0, onChange }: ProductRatingProps) => {
  const [rating, setRating] = useState(value);

  const handleClick = (newRating: number) => {
    setRating(newRating);
    onChange?.(newRating);
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 cursor-pointer ${
            star <= rating ? "text-primary-300" : "text-gray-300"
          }`}
          onClick={() => handleClick(star)}
        />
      ))}
    </div>
  );
};

export default ProductRating;
