import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";

export function formatRp(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function formatDate(value: string): string {
  try {
    return format(parseISO(value), "d MMM yyyy", { locale: localeId });
  } catch {
    return value;
  }
}

export function monthLabel(month: number, year: number): string {
  const date = new Date(year, month - 1, 1);
  return format(date, "MMMM yyyy", { locale: localeId });
}

export function currentPeriod() {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}

export function parseAmountInput(raw: string): number {
  const cleaned = raw.replace(/[^\d]/g, "");
  return cleaned ? Number(cleaned) : 0;
}
