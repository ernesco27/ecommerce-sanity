import React from "react";
import { NumericFormat } from "react-number-format";
import { cn } from "@/lib/utils";
const CurrencyFormat = ({
  value = 0,
  className,
}: {
  value: number;
  className?: string;
}) => {
  return (
    <NumericFormat
      className={cn(
        "tracking-wider text-xl font-normal inline-flex max-w-[160px] outline-none ",
        className,
      )}
      value={value}
      thousandSeparator={true}
      decimalSeparator="."
      prefix={"GHs"}
      displayType="text"
      decimalScale={2}
      fixedDecimalScale
    ></NumericFormat>
  );
};

export default CurrencyFormat;
