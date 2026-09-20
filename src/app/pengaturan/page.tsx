import { AppHeader } from "@/components/app-header";
import { SettingsForm } from "@/components/settings-form";
import { getSettings } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function PengaturanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  const { settings } = await getSettings();

  return (
    <main className="pb-16">
      <AppHeader nenekName={settings.nenek_name} userName={profile?.full_name} />
      <div className="shell mt-6">
        <section className="panel fade-up p-5 sm:p-7">
          <h2
            className="mb-2 text-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Pengaturan
          </h2>
          <p className="mb-6 text-[var(--ink-soft)]">
            Atur nama panggilan dan target iuran bulanan per orang.
          </p>
          <SettingsForm settings={settings} />
        </section>
      </div>
    </main>
  );
}
