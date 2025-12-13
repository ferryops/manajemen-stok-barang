# Sistem Manajemen Stok

Aplikasi dashboard manajemen stok barang berbasis Next.js 16 (App Router) dengan UI shadcn/ui, database Supabase, dan integrasi notifikasi Telegram.

## Fitur Utama

- Autentikasi Supabase Auth + proteksi route via middleware.
- Manajemen user (CRUD) dengan role `admin` & `staff`.
- Dashboard barang dengan kartu statistik, grafik stok total, grafik stok menipis, dan daftar barang kritis.
- CRUD barang lengkap (nama, SKU, kategori, stok, satuan, lokasi) dengan form & dialog edit.
- Halaman Settings untuk menyimpan kredensial Telegram dan tombol "Test Notification".
- API route untuk notifikasi stok menipis & pengujian bot Telegram.

## Prasyarat

- Node.js 20+
- pnpm 9+
- Akun Supabase dengan project aktif
- Bot Telegram + chat ID channel/grup

## Menjalankan Secara Lokal

1. **Clone repository**
   ```bash
   git clone https://github.com/ferryops/manajemen-stok-barang.git
   cd manajemen-stok-barang
   ```

2. **Install dependensi**
   ```bash
   pnpm install
   ```

3. **Setup Supabase Project**
   - Buat project baru di [Supabase](https://supabase.com)
   - Buka SQL Editor di dashboard Supabase
   - Jalankan script `schema.sql` untuk membuat tabel & dummy data
   - Script akan membuat:
     - Tabel `users`, `items`, `settings`
     - 2 user dummy (admin & staff)
     - 10 barang dummy untuk testing

4. **Konfigurasi Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Isi file `.env.local` dengan kredensial dari Supabase:
   ```env
   # Dari Project Settings → API
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   
   # Dari Project Settings → API → service_role (secret)
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # Opsional - bisa diisi melalui halaman Settings
   TELEGRAM_BOT_TOKEN=your-bot-token
   TELEGRAM_CHAT_ID=your-chat-id
   ```

5. **Jalankan development server**
   ```bash
   pnpm dev
   ```
   
   Aplikasi tersedia di `http://localhost:3000`

6. **Login dengan akun dummy**
   - Admin: `admin@example.com` / `password123`
   - Staff: `staff@example.com` / `password123`

## Struktur Folder Penting

```
app/
  (auth)/login        -> halaman login
  (dashboard)/        -> layout admin + dashboard, users, items, settings
  api/notifications/  -> API notifikasi Telegram
components/           -> UI shadcn, layout, form & tabel
lib/                  -> Supabase client, auth helper, server actions, notifikasi
public/               -> aset statis
schema.sql            -> skema Supabase & dummy data
```

## API Notifikasi Telegram

- `POST /api/notifications/low-stock`
  - Mengecek tabel `items` untuk stok < 5 dan mengirim pesan ke Telegram jika aktif.
  - Cocok dijalankan via cron job.
- `POST /api/notifications/test`
  - Mengirim pesan uji menggunakan kredensial yang tersimpan (Settings atau env fallback).

## Catatan Penting

- Middleware otomatis mengarahkan user yang belum login ke `/login`.
- CRUD user & Settings hanya dapat diakses role `admin`.
- Fungsi notifikasi memerlukan `SUPABASE_SERVICE_ROLE_KEY` agar dapat membaca tabel `settings` dan menjalankan Admin API Supabase.
- File `schema.sql` sudah menyertakan dummy data (2 user & 10 barang) untuk mempermudah testing awal.

## Build & Deploy

```bash
pnpm build
pnpm start
```

Deploy ke Vercel/hosting lain seperti aplikasi Next.js pada umumnya. Pastikan environment variable sama dengan `.env.example` dan jalankan job berkala (cron) untuk endpoint `POST /api/notifications/low-stock` jika ingin notifikasi otomatis tanpa interaksi UI.
