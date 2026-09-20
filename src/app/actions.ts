"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function revalidateApp() {
  revalidatePath("/dashboard");
  revalidatePath("/anggota");
  revalidatePath("/pengaturan");
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { supabase, user: null, error: "Login dulu untuk mengubah data." };
  }
  return { supabase, user, error: null };
}

export async function addMember(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  if (!name) return { error: "Nama anggota wajib diisi." };

  const { supabase, error: authError } = await requireUser();
  if (authError) return { error: authError };

  const { error } = await supabase.from("members").insert({ name });
  if (error) return { error: error.message };

  revalidateApp();
  return { ok: true };
}

export async function toggleMember(id: string, active: boolean) {
  const { supabase, error: authError } = await requireUser();
  if (authError) return { error: authError };

  const { error } = await supabase
    .from("members")
    .update({ active })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidateApp();
  return { ok: true };
}

export async function deleteMember(id: string) {
  const { supabase, error: authError } = await requireUser();
  if (authError) return { error: authError };

  const { error } = await supabase.from("members").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidateApp();
  return { ok: true };
}

export async function addContribution(formData: FormData) {
  const memberId = String(formData.get("member_id") || "");
  const amount = Number(formData.get("amount") || 0);
  const periodMonth = Number(formData.get("period_month") || 0);
  const periodYear = Number(formData.get("period_year") || 0);
  const note = String(formData.get("note") || "").trim() || null;
  const paidAt = String(formData.get("paid_at") || "") || new Date().toISOString().slice(0, 10);

  if (!memberId) return { error: "Pilih anggota." };
  if (!amount || amount <= 0) return { error: "Jumlah iuran tidak valid." };
  if (!periodMonth || !periodYear) return { error: "Periode tidak valid." };

  const { supabase, user, error: authError } = await requireUser();
  if (authError) return { error: authError };

  const { error } = await supabase.from("contributions").insert({
    member_id: memberId,
    amount,
    period_month: periodMonth,
    period_year: periodYear,
    note,
    paid_at: paidAt,
    created_by: user!.id,
  });

  if (error) return { error: error.message };

  revalidateApp();
  return { ok: true };
}

export async function deleteContribution(id: string) {
  const { supabase, error: authError } = await requireUser();
  if (authError) return { error: authError };

  const { error } = await supabase.from("contributions").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidateApp();
  return { ok: true };
}

export async function addExpense(formData: FormData) {
  const amount = Number(formData.get("amount") || 0);
  const category = String(formData.get("category") || "umum");
  const description = String(formData.get("description") || "").trim();
  const spentAt =
    String(formData.get("spent_at") || "") ||
    new Date().toISOString().slice(0, 10);

  if (!amount || amount <= 0) return { error: "Jumlah pengeluaran tidak valid." };
  if (!description) return { error: "Keterangan wajib diisi." };

  const { supabase, user, error: authError } = await requireUser();
  if (authError) return { error: authError };

  const { error } = await supabase.from("expenses").insert({
    amount,
    category,
    description,
    spent_at: spentAt,
    created_by: user!.id,
  });

  if (error) return { error: error.message };

  revalidateApp();
  return { ok: true };
}

export async function deleteExpense(id: string) {
  const { supabase, error: authError } = await requireUser();
  if (authError) return { error: authError };

  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidateApp();
  return { ok: true };
}

export async function updateSettings(formData: FormData) {
  const nenekName = String(formData.get("nenek_name") || "").trim();
  const monthlyDues = Number(formData.get("monthly_dues") || 0);

  if (!nenekName) return { error: "Nama panggilan wajib diisi." };
  if (monthlyDues < 0) return { error: "Iuran bulanan tidak valid." };

  const { supabase, error: authError } = await requireUser();
  if (authError) return { error: authError };

  const { error } = await supabase
    .from("settings")
    .update({
      nenek_name: nenekName,
      monthly_dues: monthlyDues,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidateApp();
  return { ok: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/dashboard");
}
