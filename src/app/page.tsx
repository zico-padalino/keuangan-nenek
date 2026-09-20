import Link from "next/link";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/dashboard");
  }

  return (
    <main className="shell flex min-h-screen flex-col justify-center py-12">
      <section className="panel fade-up overflow-hidden px-6 py-10 sm:px-10 sm:py-14">
        <p className="text-sm font-semibold tracking-[0.14em] text-[var(--ink-soft)] uppercase">
          Kas Keluarga
        </p>
        <h1
          className="mt-3 max-w-2xl text-4xl leading-tight text-[var(--ink)] sm:text-6xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Monitoring patungan perawatan nenek
        </h1>
        <p className="fade-up-delay mt-5 max-w-xl text-lg text-[var(--ink-soft)]">
          Catat iuran, pengeluaran, lihat saldo kas, riwayat, dan siapa yang
          sudah bayar — gratis untuk keluarga.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {isSupabaseConfigured() ? (
            <>
              <Link href="/login" className="btn btn-primary">
                Masuk
              </Link>
              <Link href="/signup" className="btn btn-secondary">
                Daftar
              </Link>
            </>
          ) : (
            <div className="max-w-xl rounded-2xl bg-white/70 p-4 text-sm text-[var(--ink-soft)]">
              <p className="font-semibold text-[var(--ink)]">Setup dulu (sekali saja)</p>
              <ol className="mt-2 list-decimal space-y-1 pl-4">
                <li>Buat project gratis di supabase.com</li>
                <li>Jalankan SQL di folder <code>supabase/schema.sql</code></li>
                <li>
                  Isi <code>.env.local</code> dari <code>.env.example</code>
                </li>
                <li>
                  Restart <code>npm run dev</code>
                </li>
              </ol>
              <p className="mt-3">
                Panduan lengkap ada di <code>README.md</code>.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
