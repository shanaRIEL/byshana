import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return `\u00a3${price}`;
}

export function calculateRentalTotal(
  dailyRate: number,
  days: number,
  deposit: number
): { rentalCost: number; total: number } {
  const rentalCost = dailyRate * days;
  const total = rentalCost + deposit;
  return { rentalCost, total };
}

export function calculateEarnings(
  dailyRate: number,
  daysPerMonth: number,
  feePercent: number = 10
): number {
  return Math.round(dailyRate * daysPerMonth * (1 - feePercent / 100));
}

export function getDaysBetween(from: string, to: string): number {
  if (!from || !to) return 0;
  return Math.max(
    1,
    Math.round(
      (new Date(to).getTime() - new Date(from).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );
}
