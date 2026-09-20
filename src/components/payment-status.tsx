import { formatRp } from "@/lib/format";
import type { MemberPaymentStatus } from "@/lib/types";

export function PaymentStatus({
  members,
  monthlyDues,
}: {
  members: MemberPaymentStatus[];
  monthlyDues: number;
}) {
  const paidCount = members.filter((m) => m.is_paid).length;

  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h3
            className="text-xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Siapa sudah bayar
          </h3>
          <p className="text-sm text-[var(--ink-soft)]">
            Target iuran {formatRp(monthlyDues)} / orang
          </p>
        </div>
        <p className="text-sm font-semibold text-[var(--accent)]">
          {paidCount}/{members.length} lunas
        </p>
      </div>

      {members.length === 0 ? (
        <p className="text-[var(--ink-soft)]">Belum ada anggota aktif.</p>
      ) : (
        <ul className="grid gap-2">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3"
            >
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-[var(--ink-soft)]">
                  {formatRp(member.paid_amount)} dari {formatRp(monthlyDues)}
                </p>
              </div>
              <span
                className="rounded-full px-3 py-1 text-sm font-semibold"
                style={{
                  background: member.is_paid
                    ? "var(--accent-soft)"
                    : "rgba(196, 122, 58, 0.15)",
                  color: member.is_paid ? "var(--ok)" : "var(--warm)",
                }}
              >
                {member.is_paid ? "Lunas" : "Belum"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
