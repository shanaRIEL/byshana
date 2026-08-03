import type { CalculatorOption } from "@/types";

export const calculatorOptions: CalculatorOption[] = [
  { days: 2, label: "2 days" },
  { days: 5, label: "5 days" },
  { days: 10, label: "10 days" },
];

export const defaultCalculatorPrice = 35;
export const defaultCalculatorDays = 5;
export const platformFeePercent = 10;
