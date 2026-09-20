"use client";

import { useState, useTransition } from "react";
import { addContribution, addExpense } from "@/app/actions";
import { parseAmountInput } from "@/lib/format";
import { EXPENSE_CATEGORIES, type Member } from "@/lib/types";

export function ContributionForm({
  members,
  month,
  year,
}: {
  members: Member[];
  month: number;
  year: number;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-3"
      action={(formData) => {
        const amount = parseAmountInput(String(formData.get("amount_raw") || ""));
        formData.set("amount", String(amount));
        formData.set("period_month", String(month));
        formData.set("period_year", String(year));
        startTransition(async () => {
          const result = await addContribution(formData);
          setError(result.error ?? null);
          if (!result.error) {
            (document.getElementById("contribution-form") as HTMLFormElement | null)?.reset();
          }
        });
      }}
      id="contribution-form"
    >
      <div className="field">
        <label htmlFor="member_id">Anggota</label>
        <select id="member_id" name="member_id" required defaultValue="">
          <option value="" disabled>
            Pilih anggota
          </option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="amount_raw">Jumlah iuran (Rp)</label>
        <input
          id="amount_raw"
          name="amount_raw"
          inputMode="numeric"
          placeholder="500000"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="paid_at">Tanggal bayar</label>
        <input
          id="paid_at"
          name="paid_at"
          type="date"
          defaultValue={new Date().toISOString().slice(0, 10)}
        />
      </div>
      <div className="field">
        <label htmlFor="note">Catatan (opsional)</label>
        <input id="note" name="note" placeholder="Transfer BCA / cash" />
      </div>
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      <button className="btn btn-primary" disabled={pending || members.length === 0}>
        {pending ? "Menyimpan..." : "Catat iuran"}
      </button>
      {members.length === 0 ? (
        <p className="text-sm text-[var(--ink-soft)]">
          Tambah anggota dulu di menu Anggota.
        </p>
      ) : null}
    </form>
  );
}

export function ExpenseForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-3"
      id="expense-form"
      action={(formData) => {
        const amount = parseAmountInput(String(formData.get("amount_raw") || ""));
        formData.set("amount", String(amount));
        startTransition(async () => {
          const result = await addExpense(formData);
          setError(result.error ?? null);
          if (!result.error) {
            (document.getElementById("expense-form") as HTMLFormElement | null)?.reset();
          }
        });
      }}
    >
      <div className="field">
        <label htmlFor="description">Keterangan</label>
        <input
          id="description"
          name="description"
          placeholder="Beli obat darah tinggi"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="expense_amount">Jumlah (Rp)</label>
        <input
          id="expense_amount"
          name="amount_raw"
          inputMode="numeric"
          placeholder="150000"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="category">Kategori</label>
        <select id="category" name="category" defaultValue="obat">
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="spent_at">Tanggal</label>
        <input
          id="spent_at"
          name="spent_at"
          type="date"
          defaultValue={new Date().toISOString().slice(0, 10)}
        />
      </div>
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      <button className="btn btn-primary" disabled={pending}>
        {pending ? "Menyimpan..." : "Catat pengeluaran"}
      </button>
    </form>
  );
}
