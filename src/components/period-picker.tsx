"use client";

import { useRouter } from "next/navigation";

export function PeriodPicker({ month, year }: { month: number; year: number }) {
  const router = useRouter();

  function onChange(nextMonth: number, nextYear: number) {
    router.push(`/dashboard?month=${nextMonth}&year=${nextYear}`);
  }

  function shift(delta: number) {
    const date = new Date(year, month - 1 + delta, 1);
    onChange(date.getMonth() + 1, date.getFullYear());
  }

  const label = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));

  return (
    <div className="flex items-center gap-2">
      <button type="button" className="btn btn-secondary" onClick={() => shift(-1)}>
        ‹
      </button>
      <div className="min-w-40 text-center font-semibold capitalize">{label}</div>
      <button type="button" className="btn btn-secondary" onClick={() => shift(1)}>
        ›
      </button>
    </div>
  );
}
