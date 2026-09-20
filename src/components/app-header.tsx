import Link from "next/link";
import { signOut } from "@/app/actions";

export function AppHeader({
  nenekName,
  userName,
  isLoggedIn = false,
}: {
  nenekName: string;
  userName?: string;
  isLoggedIn?: boolean;
}) {
  const links = isLoggedIn
    ? [
        { href: "/dashboard", label: "Monitoring" },
        { href: "/anggota", label: "Anggota" },
        { href: "/pengaturan", label: "Pengaturan" },
      ]
    : [{ href: "/dashboard", label: "Monitoring" }];

  return (
    <header className="shell pt-5 pb-2">
      <div className="panel flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-wide text-[var(--ink-soft)]">
            Kas Keluarga
          </p>
          <h1
            className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)] sm:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Perawatan {nenekName}
          </h1>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="btn btn-secondary">
              {link.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <form action={signOut}>
              <button type="submit" className="btn btn-secondary">
                Keluar{userName ? ` · ${userName.split(" ")[0]}` : ""}
              </button>
            </form>
          ) : (
            <Link href="/login?next=/dashboard" className="btn btn-primary">
              Masuk untuk edit
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
