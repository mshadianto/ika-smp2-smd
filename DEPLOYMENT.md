# Deployment Info

Portal IKA SMPN 2 Samarinda v4 — deployed to Cloudflare Pages.

## Live URLs

| Environment | URL |
|---|---|
| **Production** | https://ika-smp2-smd.pages.dev |
| Latest deployment | https://9e8fc51f.ika-smp2-smd.pages.dev |

## Cloudflare Pages project

| Field | Value |
|---|---|
| Project name | `ika-smp2-smd` |
| Account | Sopian.hadianto@gmail.com's Account |
| Production branch | `main` |
| Deploy method | Direct Upload via `wrangler pages deploy` |
| Git integration | ❌ Not connected (manual deploys only — see below) |

## Secrets configured

- `VITE_SUPABASE_ANON_KEY` — set in both `production` and `preview` environments

> Note: karena deploy via Direct Upload, Vite env var (`VITE_*`) sudah di-bake ke bundle saat `npm run build` lokal. Secret di Cloudflare hanya relevan untuk Pages Functions atau jika nanti beralih ke Git integration.

---

## ⚠️ Langkah manual yang MASIH PERLU dikerjakan

### 1. Whitelist URL di Supabase Auth (WAJIB, ~1 menit)

**Tanpa ini, magic-link login akan redirect ke localhost dan gagal di produksi.**

Buka: https://supabase.com/dashboard/project/fjodyrcbpwhdkbcbctdt/auth/url-configuration

- **Site URL:** `https://ika-smp2-smd.pages.dev`
- **Redirect URLs** (tambahkan semua baris ini):
  ```
  https://ika-smp2-smd.pages.dev
  https://ika-smp2-smd.pages.dev/**
  https://*.ika-smp2-smd.pages.dev/**
  http://localhost:5173/**
  http://localhost:5174/**
  ```

Klik **Save**.

### 2. (Opsional) Connect GitHub repo untuk auto-deploy

Saat ini deploy manual via `wrangler`. Kalau mau setiap push ke `main` auto-build + deploy:

1. Buka: https://dash.cloudflare.com/ → **Workers & Pages** → **ika-smp2-smd** → **Settings** → **Builds & deployments** → **Source**
2. Klik **Connect to Git** → authorize Cloudflare GitHub App → pilih `mshadianto/ika-smp2-smd`
3. Build settings:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Save. Push berikutnya akan auto-deploy.

---

## Cara deploy ulang (manual, saat ini)

```bash
# 1. Build lokal
npm run build

# 2. Deploy
wrangler pages deploy dist --project-name=ika-smp2-smd --branch=main
```

Deployment ID + URL akan di-print. Production URL `ika-smp2-smd.pages.dev` selalu point ke build terbaru di branch `main`.

Untuk deploy ke preview branch:
```bash
wrangler pages deploy dist --project-name=ika-smp2-smd --branch=<branch-name>
```

## Smoke test produksi

Setelah step 1 di atas selesai, buka https://ika-smp2-smd.pages.dev dan verifikasi:

- [ ] Beranda load, logo + hero video muncul
- [ ] DevTools Console bersih (tidak ada error Supabase)
- [ ] Alumni page menampilkan data dari Supabase (bukan seed localStorage)
- [ ] Admin login → magic link di-email → klik link → redirect ke `ika-smp2-smd.pages.dev` (bukan localhost)
- [ ] Marketplace: tombol "Tambah" muncul setelah login admin → create produk sukses
- [ ] Incognito: public insert (Daftar Alumni) berfungsi
