# 🚀 Deploy Otomatis - Copy Paste Ini ke Claude Code

Buka terminal Claude Code di `C:\ika-portal`, lalu **copy seluruh prompt di bawah** dan paste:

---

```
Saya mau deploy ika-portal ke Cloudflare Pages. Kerjakan end-to-end dengan minimum konfirmasi:

LANGKAH 1 — Validasi prerequisites:
- Pastikan berada di C:\ika-portal
- Pastikan `gh auth status` OK (sudah ter-auth sebagai mshadianto)
- Cek apakah wrangler CLI terinstall (`wrangler --version`)
- Jika belum, install: `npm install -g wrangler`
- Jalankan `wrangler login` jika belum auth (ini akan buka browser — saya akan login manual)
- Setelah wrangler auth, verify dengan `wrangler whoami`

LANGKAH 2 — Pre-flight check:
- Baca .env.local, extract nilai VITE_SUPABASE_ANON_KEY, simpan sementara ke variable shell
- Verify repo github.com/mshadianto/ika-smp2-smd accessible: `gh repo view mshadianto/ika-smp2-smd`
- Test build lokal: `npm run build` — pastikan folder `dist/` tergenerate tanpa error
- Jika ada error build, laporkan dan STOP

LANGKAH 3 — Create Cloudflare Pages project:
- Gunakan wrangler untuk create project:
  `wrangler pages project create ika-smp2-smd --production-branch=main`
- Jika project sudah exist (error), skip create tapi lanjutkan
- Set env variable di Cloudflare:
  `wrangler pages secret put VITE_SUPABASE_ANON_KEY --project-name=ika-smp2-smd` 
  (nilainya dari .env.local yang sudah di-extract tadi)
  Untuk preview env juga: tambah flag `--env=preview` (skip kalau belum support)

LANGKAH 4 — Deploy ke Cloudflare Pages:
- Deploy folder dist/: `wrangler pages deploy dist --project-name=ika-smp2-smd --branch=main`
- Tunggu hingga selesai, tangkap URL deployment yang muncul
- Print URL production ke terminal dengan format jelas:
  ✅ LIVE URL: https://ika-smp2-smd.pages.dev
  ✅ DEPLOYMENT URL: <deployment-specific-url>

LANGKAH 5 — Post-deploy summary:
- Buat file DEPLOYMENT.md di root dengan konten:
  * Production URL
  * Cloudflare project name
  * Git-integrated auto-deploy status (belum: butuh connect manual di dashboard)
  * Langkah manual yang MASIH PERLU user lakukan:
    1. Buka Supabase Dashboard → Auth → URL Configuration
       URL: https://supabase.com/dashboard/project/fjodyrcbpwhdkbcbctdt/auth/url-configuration
       - Set Site URL ke URL production Cloudflare
       - Tambah Redirect URLs: http://localhost:5173/** dan <prod-url>/**
    2. (Opsional) Connect GitHub repo di Cloudflare dashboard untuk auto-deploy on push
       URL: https://dash.cloudflare.com/ → Workers & Pages → ika-smp2-smd → Settings → Build
- Commit DEPLOYMENT.md ke git, push ke main

LANGKAH 6 — Final verification:
- Curl URL production, cek status 200: `curl -I <prod-url>`
- Print final summary dengan:
  ✅ Apa yang sudah otomatis beres
  ⚠️ Apa yang masih perlu dilakukan user manually (dengan link langsung)
  📋 Cara deploy ulang ke depannya (wrangler pages deploy)

PENTING:
- Jangan tanya konfirmasi untuk command yang safe dan reversible
- Kalau ada error, laporkan dengan jelas dan kasih suggested fix
- Jangan commit .env.local atau file sensitive apapun
- Kalau user belum login wrangler, pause dan kasih instruksi yang jelas
```

---

## ⚠️ 2 Hal yang TIDAK bisa diotomasi (butuh Anda)

Ini batasan teknis, bukan malas. Saya jelaskan kenapa:

### 1. `wrangler login` (one-time, ~30 detik)
Saat Claude Code run `wrangler login`, terminal akan buka browser Anda ke `dash.cloudflare.com` untuk authorize. Anda klik **"Allow"** → kembali ke terminal → selesai. Setelah ini, token tersimpan lokal, gak perlu lagi seumur hidup.

**Kenapa gak bisa diotomasi:** OAuth flow butuh human-in-the-loop untuk consent. Security by design. Sama seperti `gh auth login` yang sudah Anda lakukan.

### 2. Whitelist URL di Supabase (satu kali, ~1 menit)
Setelah URL production dapat, tambahkan ke Supabase Auth URL Configuration.

**Kenapa gak bisa diotomasi:** Supabase management API memang ada, tapi butuh **Personal Access Token** yang Anda harus generate manual di dashboard dulu. Overhead-nya lebih tinggi daripada cuma klik-klik 1 menit di dashboard.

Tapi Claude Code akan **print URL langsung** + **instruksi eksplisit** di `DEPLOYMENT.md`, jadi Anda tinggal ikuti linknya.

---

## 📝 Alur yang akan terjadi

```
Anda paste prompt → Claude Code mulai:
  ✓ Check prerequisites
  ⏸ Run wrangler login → browser kebuka → Anda klik Allow → kembali
  ✓ Build lokal
  ✓ Create Cloudflare project
  ✓ Set secret VITE_SUPABASE_ANON_KEY
  ✓ Deploy
  ✓ Print URL production: https://ika-smp2-smd.pages.dev
  ✓ Create DEPLOYMENT.md
  ✓ Commit + push
  
Anda baca DEPLOYMENT.md → 
  ⏸ Buka link Supabase Auth → whitelist URL → Save
  
Done. Admin login + marketplace + semua fitur jalan di production.
```

**Total waktu:** ~3-5 menit (mostly build + upload). Interaksi manual Anda: ~1 menit total.

---

## 💡 Alternatif kalau mau lebih simpel

Kalau Anda mau skip wrangler CLI dan **cukup connect GitHub repo via dashboard** (seperti instruksi sebelumnya), waktunya sama tapi lebih GUI-friendly. Pilih mana?
