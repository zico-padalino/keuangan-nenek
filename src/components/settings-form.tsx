"use client";

import { useState, useTransition } from "react";
import { updateSettings } from "@/app/actions";
import { parseAmountInput } from "@/lib/format";
import type { Settings } from "@/lib/types";

export function SettingsForm({ settings }: { settings: Settings }) {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="grid max-w-lg gap-4"
      action={(formData) => {
        const dues = parseAmountInput(String(formData.get("monthly_dues_raw") || ""));
        formData.set("monthly_dues", String(dues));
        startTransition(async () => {
          const result = await updateSettings(formData);
          setError(result.error ?? null);
          setOk(!result.error);
        });
      }}
    >
      <div className="field">
        <label htmlFor="nenek_name">Panggilan nenek</label>
        <input
          id="nenek_name"
          name="nenek_name"
          defaultValue={settings.nenek_name}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="monthly_dues_raw">Iuran bulanan per orang (Rp)</label>
        <input
          id="monthly_dues_raw"
          name="monthly_dues_raw"
          inputMode="numeric"
          defaultValue={String(Math.round(Number(settings.monthly_dues)))}
          required
        />
      </div>
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      {ok ? (
        <p className="text-sm text-[var(--ok)]">Pengaturan tersimpan.</p>
      ) : null}
      <button className="btn btn-primary" disabled={pending}>
        {pending ? "Menyimpan..." : "Simpan pengaturan"}
      </button>
    </form>
  );
}
