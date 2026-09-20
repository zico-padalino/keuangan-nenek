"use client";

import { useTransition } from "react";
import { deleteContribution, deleteExpense } from "@/app/actions";
import { formatDate, formatRp } from "@/lib/format";
import type { HistoryItem } from "@/lib/types";

export function HistoryList({
  items,
  canEdit = false,
}: {
  items: HistoryItem[];
  canEdit?: boolean;
}) {
  const [pending, startTransition] = useTransition();

  if (items.length === 0) {
    return (
      <p className="text-[var(--ink-soft)]">
        Belum ada riwayat di periode ini. Catat iuran atau pengeluaran untuk mulai.
      </p>
    );
  }

  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li
          key={`${item.kind}-${item.id}`}
          className="flex items-start justify-between gap-3 border-b border-[var(--line)] pb-3 last:border-0"
        >
          <div>
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-[var(--ink-soft)]">
              {item.subtitle} · {formatDate(item.date)}
            </p>
          </div>
          <div className="text-right">
            <p
              className="font-semibold"
              style={{
                color: item.kind === "contribution" ? "var(--ok)" : "var(--danger)",
              }}
            >
              {item.kind === "contribution" ? "+" : "−"}
              {formatRp(item.amount)}
            </p>
            {canEdit ? (
              <button
                type="button"
                className="btn btn-danger mt-1"
                disabled={pending}
                onClick={() => {
                  startTransition(async () => {
                    if (item.kind === "contribution") {
                      await deleteContribution(item.id);
                    } else {
                      await deleteExpense(item.id);
                    }
                  });
                }}
              >
                Hapus
              </button>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
