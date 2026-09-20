import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { ContributionForm, ExpenseForm } from "@/components/forms";
import { HistoryList } from "@/components/history-list";
import { PaymentStatus } from "@/components/payment-status";
import { PeriodPicker } from "@/components/period-picker";
import { getDashboardData } from "@/lib/data";
import { currentPeriod, formatRp } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const fallback = currentPeriod();
  const month = Number(params.month) || fallback.month;
  const year = Number(params.year) || fallback.year;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = Boolean(user);

  const { data: profile } = isLoggedIn
    ? await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user!.id)
        .maybeSingle()
    : { data: null };

  const data = await getDashboardData(month, year);

  return (
    <main className="pb-16">
      <AppHeader
        nenekName={data.settings.nenek_name}
        userName={profile?.full_name}
        isLoggedIn={isLoggedIn}
      />

      <div className="shell mt-6 grid gap-5">
        {data.errors.length > 0 ? (
          <div className="panel border-[rgba(163,59,45,0.3)] p-4 text-sm text-[var(--danger)]">
            Database belum siap atau schema belum dijalankan. Error:{" "}
            {data.errors[0]}
          </div>
        ) : null}

        <section className="panel fade-up grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold text-[var(--ink-soft)]">
              Saldo kas keluarga
            </p>
            <p
              className="mt-2 text-4xl sm:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {formatRp(data.balance)}
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm">
              <span>
                Total masuk{" "}
                <strong className="text-[var(--ok)]">{formatRp(data.totalIn)}</strong>
              </span>
              <span>
                Total keluar{" "}
                <strong className="text-[var(--danger)]">
                  {formatRp(data.totalOut)}
                </strong>
              </span>
            </div>
          </div>
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-white/60 p-4">
            <PeriodPicker month={month} year={year} />
            <div className="grid w-full grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[var(--ink-soft)]">Iuran bulan ini</p>
                <p className="text-lg font-semibold text-[var(--ok)]">
                  {formatRp(data.periodIn)}
                </p>
              </div>
              <div>
                <p className="text-[var(--ink-soft)]">Pengeluaran bulan ini</p>
                <p className="text-lg font-semibold text-[var(--danger)]">
                  {formatRp(data.periodOut)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="panel fade-up-delay p-5 sm:p-7">
          <PaymentStatus
            members={data.paymentStatus}
            monthlyDues={Number(data.settings.monthly_dues)}
          />
        </section>

        {isLoggedIn ? (
          <section className="grid gap-5 lg:grid-cols-2">
            <div className="panel p-5 sm:p-7">
              <h2
                className="mb-4 text-xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Input iuran
              </h2>
              <ContributionForm
                members={data.members}
                month={month}
                year={year}
              />
            </div>
            <div className="panel p-5 sm:p-7">
              <h2
                className="mb-4 text-xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Input pengeluaran
              </h2>
              <ExpenseForm />
            </div>
          </section>
        ) : (
          <section className="panel p-5 sm:p-7">
            <h2
              className="mb-2 text-xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Input data
            </h2>
            <p className="mb-4 text-[var(--ink-soft)]">
              Monitoring bisa dilihat siapa saja. Untuk menambah, mengubah, atau
              menghapus data, masuk dulu dengan akun keluarga.
            </p>
            <Link href="/login?next=/dashboard" className="btn btn-primary">
              Masuk untuk edit
            </Link>
          </section>
        )}

        <section className="panel p-5 sm:p-7">
          <h2
            className="mb-4 text-xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Riwayat
          </h2>
          <HistoryList items={data.history} canEdit={isLoggedIn} />
        </section>
      </div>
    </main>
  );
}
