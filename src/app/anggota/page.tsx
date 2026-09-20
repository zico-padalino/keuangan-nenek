import { AppHeader } from "@/components/app-header";
import { MembersManager } from "@/components/members-manager";
import { getMembers, getSettings } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function AnggotaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  const [{ members }, { settings }] = await Promise.all([
    getMembers(),
    getSettings(),
  ]);

  return (
    <main className="pb-16">
      <AppHeader nenekName={settings.nenek_name} userName={profile?.full_name} />
      <div className="shell mt-6">
        <section className="panel fade-up p-5 sm:p-7">
          <h2
            className="mb-2 text-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Anggota patungan
          </h2>
          <p className="mb-6 text-[var(--ink-soft)]">
            Daftar saudara yang ikut iuran perawatan {settings.nenek_name}.
          </p>
          <MembersManager members={members} />
        </section>
      </div>
    </main>
  );
}
