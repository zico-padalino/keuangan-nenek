import Link from "next/link";
import { LoginForm } from "@/components/auth-forms";
import { isSupabaseConfigured } from "@/lib/env";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;

  if (!isSupabaseConfigured()) {
    return (
      <main className="shell py-16">
        <div className="panel mx-auto max-w-md p-6">
          <p>Supabase belum dikonfigurasi. Lihat README.md.</p>
          <Link href="/" className="btn btn-secondary mt-4">
            Kembali
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="shell flex min-h-screen items-center py-12">
      <div className="panel fade-up mx-auto w-full max-w-md p-6 sm:p-8">
        <p className="text-sm font-semibold text-[var(--ink-soft)]">Kas Keluarga</p>
        <h1
          className="mt-2 text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Masuk
        </h1>
        <p className="mt-2 mb-6 text-[var(--ink-soft)]">
          Pantau patungan perawatan nenek bersama keluarga.
        </p>
        <LoginForm nextPath={params.next || "/dashboard"} />
      </div>
    </main>
  );
}
