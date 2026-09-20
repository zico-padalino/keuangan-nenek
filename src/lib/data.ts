import { createClient } from "@/lib/supabase/server";
import type {
  Contribution,
  Expense,
  HistoryItem,
  Member,
  MemberPaymentStatus,
  Settings,
} from "@/lib/types";
import { EXPENSE_CATEGORIES } from "@/lib/types";

const defaultSettings: Settings = {
  id: 1,
  nenek_name: "Nenek",
  monthly_dues: 500000,
  updated_at: new Date().toISOString(),
};

export async function getDashboardData(month: number, year: number) {
  const supabase = await createClient();

  const [
    settingsRes,
    membersRes,
    contributionsRes,
    allContributionsRes,
    expensesRes,
    allExpensesRes,
  ] = await Promise.all([
    supabase.from("settings").select("*").eq("id", 1).maybeSingle(),
    supabase
      .from("members")
      .select("*")
      .eq("active", true)
      .order("name", { ascending: true }),
    supabase
      .from("contributions")
      .select("*, members(id, name)")
      .eq("period_month", month)
      .eq("period_year", year)
      .order("paid_at", { ascending: false }),
    supabase.from("contributions").select("amount"),
    supabase
      .from("expenses")
      .select("*")
      .gte("spent_at", `${year}-${String(month).padStart(2, "0")}-01`)
      .lt(
        "spent_at",
        month === 12
          ? `${year + 1}-01-01`
          : `${year}-${String(month + 1).padStart(2, "0")}-01`,
      )
      .order("spent_at", { ascending: false }),
    supabase.from("expenses").select("amount"),
  ]);

  const settings = (settingsRes.data as Settings | null) ?? defaultSettings;
  const members = (membersRes.data as Member[]) ?? [];
  const contributions = (contributionsRes.data as Contribution[]) ?? [];
  const expenses = (expensesRes.data as Expense[]) ?? [];

  const totalIn = ((allContributionsRes.data as { amount: number }[]) ?? []).reduce(
    (sum, row) => sum + Number(row.amount),
    0,
  );
  const totalOut = ((allExpensesRes.data as { amount: number }[]) ?? []).reduce(
    (sum, row) => sum + Number(row.amount),
    0,
  );

  const paymentStatus: MemberPaymentStatus[] = members.map((member) => {
    const paidAmount = contributions
      .filter((c) => c.member_id === member.id)
      .reduce((sum, c) => sum + Number(c.amount), 0);
    return {
      ...member,
      paid_amount: paidAmount,
      is_paid: paidAmount >= Number(settings.monthly_dues),
    };
  });

  const history: HistoryItem[] = [
    ...contributions.map((c) => ({
      kind: "contribution" as const,
      id: c.id,
      amount: Number(c.amount),
      date: c.paid_at,
      title: `Iuran ${c.members?.name ?? "Anggota"}`,
      subtitle: c.note || "Setoran keluarga",
    })),
    ...expenses.map((e) => ({
      kind: "expense" as const,
      id: e.id,
      amount: Number(e.amount),
      date: e.spent_at,
      title: e.description,
      subtitle:
        EXPENSE_CATEGORIES.find((c) => c.value === e.category)?.label ||
        e.category,
    })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  return {
    settings,
    members,
    contributions,
    expenses,
    paymentStatus,
    history,
    balance: totalIn - totalOut,
    totalIn,
    totalOut,
    periodIn: contributions.reduce((s, c) => s + Number(c.amount), 0),
    periodOut: expenses.reduce((s, e) => s + Number(e.amount), 0),
    errors: [
      settingsRes.error?.message,
      membersRes.error?.message,
      contributionsRes.error?.message,
      expensesRes.error?.message,
    ].filter(Boolean) as string[],
  };
}

export async function getMembers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("active", { ascending: false })
    .order("name", { ascending: true });
  return { members: (data as Member[]) ?? [], error: error?.message };
}

export async function getSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  return {
    settings: (data as Settings | null) ?? defaultSettings,
    error: error?.message,
  };
}
