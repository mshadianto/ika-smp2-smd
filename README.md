# IKA SMPN 2 Samarinda — Portal Alumni v4

Portal resmi **Ikatan Keluarga Alumni SMP Negeri 2 Samarinda** — modular, scalable, stable.

**Repo:** https://github.com/mshadianto/ika-smp2-smd
**Deploy:** Cloudflare Pages (manual via dashboard)

Stack: **React 18 + Vite + Supabase**, dengan fallback otomatis ke `localStorage` bila Supabase tidak tersedia.

---

## Fitur

- 🏠 **Beranda** — hero, stat, video YouTube, diskusi & alumni terbaru
- 👥 **Direktori Alumni** — publik: pendaftaran & pencarian
- 🛒 **Marketplace** — **ADMIN ONLY** untuk CRUD, publik lihat saja
- 🏪 **UMKM** — direktori usaha alumni dengan WA/IG/Web
- 📸 **Gallery** — album foto + lightbox
- 💬 **Forum** — topik & balasan dengan fitur like & sematkan
- 📅 **Agenda** — daftar acara (admin-only create)

---

## Arsitektur

```
src/
├── config/
│   ├── supabase.js        # Supabase client + SQL schema (comment)
│   ├── auth.js            # ADMIN_EMAILS whitelist + capabilities
│   └── constants.js       # Kategori, seed data, HERO_VIDEO_ID
├── utils/
│   ├── format.js          # initials, fmtRp, fmtDate, waLink, dll
│   └── storage.js         # Local storage adapter (async)
├── services/
│   ├── BaseService.js     # Generic CRUD Supabase + fallback
│   ├── entities.js        # alumni, market, umkm, event, gallery, forum
│   └── authService.js     # Supabase auth + magic link
├── hooks/
│   ├── useAuth.js         # Auth state + role + capabilities
│   ├── useCollection.js   # Reactive service wrapper
│   └── useToast.js
├── components/
│   ├── Icons.jsx
│   ├── Primitives.jsx     # Modal, Toast, Badge, EmptyState, dll
│   ├── Header.jsx
│   ├── AdminLoginModal.jsx
│   └── Forms.jsx          # AlumniForm, MarketForm, UmkmForm, ...
├── pages/
│   ├── HomePage.jsx
│   ├── AlumniPage.jsx
│   ├── MarketplacePage.jsx
│   ├── UmkmPage.jsx
│   ├── GalleryPage.jsx
│   ├── ForumPage.jsx
│   └── EventsPage.jsx
├── assets/logo-ika.png
├── App.jsx                # Root — wiring + state
├── main.jsx               # Vite entry
└── styles.css             # Blue navy/gold theme
```

**Prinsip:**

- **Separation of Concerns** — config, utils, services, hooks, UI terpisah tegas
- **Service Layer Abstraction** — semua panggilan DB lewat service, komponen tidak tahu Supabase
- **Graceful Fallback** — bila Supabase tidak konfigurasi/offline, otomatis ke `localStorage`
- **Capability-Based Access** — permission matrix di `config/auth.js`, bukan inline cek
- **RLS Defense in Depth** — security di-enforce di DB (Postgres RLS) + UI

---

## Keamanan & Akses

### Admin (whitelist)

Hanya dua email berikut yang diakui sebagai admin:

- `sopian.hadianto@gmail.com`
- `firman20@yahoo.com`

Admin memiliki kemampuan:

| Capability      | Aksi                                 |
| --------------- | ------------------------------------ |
| MARKET_CREATE   | Tambah produk marketplace            |
| MARKET_UPDATE   | Edit produk marketplace              |
| MARKET_DELETE   | Hapus produk marketplace             |
| FORUM_DELETE    | Hapus topik forum                    |
| GALLERY_DELETE  | Hapus album gallery                  |
| EVENT_CREATE    | Tambah agenda                        |
| EVENT_UPDATE    | Edit agenda                          |
| ALUMNI_DELETE   | Hapus data alumni                    |
| UMKM_DELETE     | Moderasi UMKM                        |

### Publik (tanpa login)

- **READ ALL**: semua data bisa dilihat
- **CREATE**: registrasi alumni, daftar UMKM, upload gallery, post forum/reply
- **TIDAK BISA**: CRUD marketplace, hapus apapun

### Enforcement Layer

1. **UI layer** — tombol admin disembunyikan untuk non-admin, dengan cek `can(CAPABILITY)`
2. **Service layer** — operasi mutasi akan dieksekusi tapi…
3. **Database layer (RLS)** — Postgres menolak request non-admin via policy `is_admin()`

Jadi **meski klien di-tamper**, RLS Supabase tetap menolak.

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Konfigurasi Supabase

Copy `.env.example` → `.env`:

```bash
cp .env.example .env
```

Ambil anon key dari **Supabase Dashboard > Project Settings > API > Project API keys > `anon (public)`** dan isi:

```
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

Project URL sudah hard-coded: `https://fjodyrcbpwhdkbcbctdt.supabase.co`

### 3. Run SQL Schema

Buka **Supabase Dashboard > SQL Editor**, lalu jalankan schema yang ada di comment bagian bawah file `src/config/supabase.js`.

Schema tersebut akan membuat:

- Tables: `alumni`, `market_items`, `umkm`, `events`, `gallery_albums`, `gallery_photos`, `forum_threads`, `forum_replies`, `admin_emails`
- Function: `is_admin()` — cek email user terdaftar di `admin_emails`
- RLS policies untuk setiap table

Admin email otomatis di-seed saat schema dijalankan.

### 4. Dev server

```bash
npm run dev
```

Akses di `http://localhost:5173`.

### 5. Build production

```bash
npm run build
# hasil di dist/
```

---

## Mode Operasi

### Mode Supabase (production)

Bila `VITE_SUPABASE_ANON_KEY` terisi → aplikasi menggunakan Supabase sebagai source of truth. Data tersimpan di cloud, RLS aktif, magic link email untuk login admin.

### Mode Lokal (development / offline)

Bila env key kosong → aplikasi otomatis jalan pakai `localStorage`:

- Data seed di-load ke cache lokal
- Admin login "simulasi" — whitelist dicek di client, auto-authenticate tanpa email
- Semua perubahan tersimpan di browser user (bukan shared)

Mode lokal berguna untuk: demo, development, showcase tanpa backend.

---

## Login Admin

Dari header, klik **"Admin Login"**:

1. Masukkan email admin terdaftar
2. Klik **"Kirim Magic Link"**
3. Cek inbox email, klik link untuk login otomatis (flow Supabase OTP)

**Mode lokal**: email admin langsung di-auth tanpa magic link.

---

## Skalabilitas — Cara Menambah Entitas Baru

Misal mau tambah fitur "Beasiswa":

**1. Tambah table di Supabase** (via `src/config/supabase.js` schema comment)

**2. Buat service** di `src/services/entities.js`:

```js
export const beasiswaService = new BaseService({
  table: "beasiswa",
  storageKey: "ika_beasiswa_v4",
  seed: [],
  mapFromDb: r => ({ id: r.id, nama: r.nama, jumlah: r.jumlah }),
  mapToDb:   r => ({ nama: r.nama, jumlah: r.jumlah }),
});
```

**3. (Opsional) tambah capability** di `src/config/auth.js`

**4. Buat page** `src/pages/BeasiswaPage.jsx`

**5. Wire di App.jsx** dengan `useCollection(beasiswaService)` + tambah nav item

Selesai. Infrastruktur CRUD + RLS + fallback sudah otomatis.

---

## Video Landing Page

Video YouTube di-embed via `HERO_VIDEO_ID` di `src/config/constants.js`:

```js
export const HERO_VIDEO_ID = "W8IBBXIEnLA";
```

Ganti ID untuk mengupdate video tanpa refactor.

---

## Kredit

Dibangun untuk **Ikatan Keluarga Alumni SMP Negeri 2 Samarinda**.

© 2026 IKA SMPN 2 Samarinda.
