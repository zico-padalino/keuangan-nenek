"use client";

import { useState, useTransition } from "react";
import { addMember, deleteMember, toggleMember } from "@/app/actions";
import type { Member } from "@/lib/types";

export function MembersManager({ members }: { members: Member[] }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="grid gap-6">
      <form
        className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"
        action={(formData) => {
          startTransition(async () => {
            const result = await addMember(formData);
            setError(result.error ?? null);
          });
        }}
      >
        <div className="field">
          <label htmlFor="name">Nama anggota keluarga</label>
          <input id="name" name="name" placeholder="Contoh: Budi" required />
        </div>
        <button className="btn btn-primary" disabled={pending}>
          Tambah
        </button>
      </form>
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

      <ul className="grid gap-2">
        {members.map((member) => (
          <li
            key={member.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3"
          >
            <div>
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-[var(--ink-soft)]">
                {member.active ? "Aktif" : "Nonaktif"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await toggleMember(member.id, !member.active);
                  })
                }
              >
                {member.active ? "Nonaktifkan" : "Aktifkan"}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await deleteMember(member.id);
                  })
                }
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
