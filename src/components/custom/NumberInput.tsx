import * as React from "react";
import { NumberField } from "@base-ui-components/react/number-field";
import { cn } from "@/lib/utils";

export default function InputNumberField({
  quantity,
  setQuantity,
  min = 1,
  max,
}: {
  quantity: number;
  setQuantity: (quantity: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <NumberField.Root
      defaultValue={quantity}
      className="flex flex-col items-start gap-1"
      onValueChange={(value) => setQuantity(Number(value))}
      min={min}
      max={max}
    >
      <NumberField.ScrubArea className="cursor-ew-resize">
        <NumberField.ScrubAreaCursor className="drop-shadow-[0_1px_1px_#0008] filter">
          <CursorGrowIcon />
        </NumberField.ScrubAreaCursor>
      </NumberField.ScrubArea>

      <NumberField.Group className="flex">
        <NumberField.Decrement
          className={cn(
            "flex size-12 items-center justify-center rounded-tl-md rounded-bl-md border border-gray-200 bg-gray-50 bg-clip-padding text-gray-900 select-none hover:bg-gray-100 active:bg-gray-100",
            quantity <= min && "opacity-50 cursor-not-allowed",
          )}
          disabled={quantity <= min}
        >
          <MinusIcon />
        </NumberField.Decrement>
        <NumberField.Input className="h-12 w-16 lg:w-24 border-t border-b border-gray-200 text-center text-base text-gray-900 tabular-nums focus:z-1  focus:outline-2 focus:-outline-offset-1 focus:outline-primary-400 dark:text-white" />
        <NumberField.Increment
          className={cn(
            "flex size-12 items-center justify-center rounded-tr-md rounded-br-md border border-gray-200 bg-gray-50 bg-clip-padding text-gray-900 select-none hover:bg-gray-100 active:bg-gray-100",
            max && quantity >= max && "opacity-50 cursor-not-allowed",
          )}
          disabled={max ? quantity >= max : false}
        >
          <PlusIcon />
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  );
}

function CursorGrowIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      width="26"
      height="14"
      viewBox="0 0 24 14"
      fill="black"
      stroke="white"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z" />
    </svg>
  );
}

function PlusIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentcolor"
      strokeWidth="1.6"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 5H5M10 5H5M5 5V0M5 5V10" />
    </svg>
  );
}

function MinusIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentcolor"
      strokeWidth="1.6"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 5H10" />
    </svg>
  );
}
