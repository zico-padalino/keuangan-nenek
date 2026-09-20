# Kas Keluarga — Perawatan Nenek

App monitoring patungan keluarga: iuran, pengeluaran, saldo, riwayat, dan status siapa sudah bayar.

Stack: **Next.js** (Vercel) + **Supabase** (database & auth, free tier).

## Fitur

- Login / daftar keluarga
- Dashboard saldo kas (total masuk − total keluar)
- Input iuran per anggota + periode bulan
- Status lunas / belum bayar per orang
- Input pengeluaran dengan kategori
- Riwayat transaksi (bisa dihapus)
- Kelola anggota patungan
- Atur nama panggilan nenek & target iuran bulanan

## Setup cepat (gratis)

### 1. Supabase

1. Buat project di [supabase.com](https://supabase.com) (free).
2. Buka **SQL Editor** → New query.
3. Paste isi file [`supabase/schema.sql`](./supabase/schema.sql) → Run.
4. Di **Authentication → Providers**, pastikan Email aktif.
5. (Opsional) Di **Authentication → Settings**, matikan “Confirm email” supaya daftar langsung bisa masuk tanpa cek inbox.

### 2. Environment

```bash
cp .env.example .env.local
```

Isi dari Supabase → **Project Settings → API**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Jalankan lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) → Daftar akun → tambah anggota → catat iuran.

## Deploy ke Vercel (gratis)

1. Push repo ke GitHub.
2. Import project di [vercel.com](https://vercel.com).
3. Tambahkan env yang sama (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Deploy.

Di Supabase → **Authentication → URL Configuration**, tambahkan URL Vercel ke **Site URL** / **Redirect URLs**.

## Alur pakai untuk keluarga

1. Satu orang setup Supabase + deploy.
2. Anggota keluarga daftar / login di app yang sama.
3. Admin keluarga isi daftar **Anggota** (nama saudara yang ikut iuran).
4. Setiap bulan catat siapa bayar di **Input iuran**.
5. Catat belanja obat, makan, dll di **Input pengeluaran**.
6. Lihat **Saldo** dan **Siapa sudah bayar** di dashboard.

## Catatan keamanan

Schema memakai RLS sederhana: semua user yang sudah login bisa baca/tulis data kas. Cocok untuk app privat satu keluarga. Jangan sebarkan URL ke publik; hanya bagikan ke saudara.
