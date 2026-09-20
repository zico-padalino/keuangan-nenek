export type Profile = {
  id: string;
  full_name: string;
  created_at: string;
};

export type Settings = {
  id: number;
  nenek_name: string;
  monthly_dues: number;
  updated_at: string;
};

export type Member = {
  id: string;
  name: string;
  user_id: string | null;
  active: boolean;
  created_at: string;
};

export type Contribution = {
  id: string;
  member_id: string;
  amount: number;
  period_month: number;
  period_year: number;
  note: string | null;
  paid_at: string;
  created_by: string | null;
  created_at: string;
  members?: Pick<Member, "id" | "name"> | null;
};

export type Expense = {
  id: string;
  amount: number;
  category: string;
  description: string;
  spent_at: string;
  created_by: string | null;
  created_at: string;
};

export type MemberPaymentStatus = Member & {
  paid_amount: number;
  is_paid: boolean;
};

export type HistoryItem =
  | {
      kind: "contribution";
      id: string;
      amount: number;
      date: string;
      title: string;
      subtitle: string;
    }
  | {
      kind: "expense";
      id: string;
      amount: number;
      date: string;
      title: string;
      subtitle: string;
    };

export const EXPENSE_CATEGORIES = [
  { value: "obat", label: "Obat & kesehatan" },
  { value: "makan", label: "Makanan" },
  { value: "perawatan", label: "Perawatan" },
  { value: "rumah", label: "Kebutuhan rumah" },
  { value: "transport", label: "Transport" },
  { value: "umum", label: "Lainnya" },
] as const;
