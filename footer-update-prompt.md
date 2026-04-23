# 🔧 Update Footer — Copy-Paste ke Claude Code

Buka terminal Claude Code di `C:\ika-portal`, copy seluruh prompt di bawah:

---

```
Update footer dengan kredit developer dan versi dinamis. Kerjakan sebagai berikut:

LANGKAH 1 — Tambah build-time constants via Vite define:
Edit vite.config.js → tambahkan `define` block yang inject versi dari package.json 
dan build timestamp, sehingga bisa diakses via import.meta.env.

File: vite.config.js
Ganti seluruh isi dengan:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "fs";
import { resolve } from "path";

// Read version from package.json at build time
const pkg = JSON.parse(readFileSync(resolve(__dirname, "package.json"), "utf-8"));

// Get git commit hash if available (fallback to "local")
let commitHash = "local";
try {
  const { execSync } = await import("child_process");
  commitHash = execSync("git rev-parse --short HEAD", { encoding: "utf-8" }).trim();
} catch {
  // git not available — use fallback
}

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
});
```

LANGKAH 2 — Update footer di src/App.jsx:
Cari section yang dimulai dengan `<footer className="footer">` dan ganti seluruh 
konten footer dengan versi baru berikut. Pastikan import useMemo ditambahkan di 
baris import atas kalau belum ada.

Ganti seluruh elemen <footer>...</footer> menjadi:

```jsx
<footer className="footer">
  {logoUrl && <img src={logoUrl} alt="IKA" className="footer-logo" />}
  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
    Ikatan Keluarga Alumni SMP Negeri 2 Samarinda
  </div>
  <div style={{ fontSize: 13, opacity: 0.85 }}>
    © {new Date().getFullYear()} <strong>IKA SMPN 2 Samarinda</strong> · Koneksi Tanpa Batas, Kolaborasi Tanpa Henti
  </div>
  
  {/* Developer Credits */}
  <div style={{ 
    marginTop: 16, 
    paddingTop: 12, 
    borderTop: "1px solid rgba(255,255,255,0.1)", 
    fontSize: 12, 
    opacity: 0.75,
    lineHeight: 1.6 
  }}>
    <div>
      <strong>Lead Developer:</strong> MS Hadianto
    </div>
    <div>
      <strong>Tim Developer:</strong> Firman Ahmad
    </div>
  </div>
  
  {/* Dynamic Version Info */}
  <div style={{ 
    marginTop: 10, 
    fontSize: 11, 
    opacity: 0.55,
    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace" 
  }}>
    v{__APP_VERSION__} · build {__COMMIT_HASH__} · {new Date(__BUILD_DATE__).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
  </div>
</footer>
```

LANGKAH 3 — Tambahkan type declarations untuk globals:
Buat file baru src/vite-env.d.ts dengan konten:

```ts
/// <reference types="vite/client" />

declare const __APP_VERSION__: string;
declare const __BUILD_DATE__: string;
declare const __COMMIT_HASH__: string;
```

(Walaupun project ini pakai JSX bukan TSX, file ini tetap useful untuk 
menghilangkan warning di editor modern.)

LANGKAH 4 — Update ESLint global recognition (optional):
Kalau ada .eslintrc atau eslint.config.js, tambahkan 3 globals tersebut.
Kalau tidak ada ESLint config, skip.

LANGKAH 5 — Test build lokal:
Jalankan `npm run build`, pastikan tidak ada error.
Jalankan `npm run preview`, buka browser ke URL yang muncul, scroll ke footer.
Verify:
  ✓ "Lead Developer: MS Hadianto" muncul
  ✓ "Tim Developer: Firman Ahmad" muncul
  ✓ Versi format "v4.0.0 · build abc1234 · 23 Apr 2026" muncul
  ✓ Commit hash sesuai dengan `git rev-parse --short HEAD` saat ini
  ✓ Tanggal build hari ini

LANGKAH 6 — Bump version (optional tapi direkomendasikan):
Untuk tandai perubahan ini sebagai minor release:
`npm version patch --no-git-tag-version`
Ini akan update package.json dari 4.0.0 → 4.0.1.

LANGKAH 7 — Commit & deploy:
- git add -A
- git commit -m "feat(footer): add developer credits + dynamic version info"
- git push origin main
- Deploy ulang ke Cloudflare: `wrangler pages deploy dist --project-name=ika-smp2-smd --branch=main`
- Tunggu sampai selesai, print URL production final

LANGKAH 8 — Final verification:
- Buka URL production di browser
- Scroll ke footer paling bawah
- Screenshot dan deskripsikan apa yang terlihat (tapi screenshot cukup saya yang lakukan)

PENTING:
- Jangan tanya konfirmasi per-langkah, kerjakan sekuensial
- Kalau ada error TypeScript tentang __APP_VERSION__ dkk, abaikan — 
  ini runtime global yang di-inject Vite, bukan TypeScript type
- Kalau `npm run build` error karena top-level await di vite.config.js, 
  ubah `import { execSync }` jadi sync version:
  ```js
  import { execSync } from "child_process";
  let commitHash = "local";
  try {
    commitHash = execSync("git rev-parse --short HEAD", { encoding: "utf-8" }).trim();
  } catch {}
  ```
```

---

## 🎨 Preview hasil footer

Setelah apply, footer akan terlihat seperti ini:

```
                    [Logo IKA]
        Ikatan Keluarga Alumni SMP Negeri 2 Samarinda
     © 2026 IKA SMPN 2 Samarinda · Koneksi Tanpa Batas, Kolaborasi Tanpa Henti
    
    ────────────────────────────────────────────
    Lead Developer: MS Hadianto
    Tim Developer: Firman Ahmad
    
    v4.0.1 · build a3f91c2 · 23 Apr 2026
```

Bagian paling bawah (version info) otomatis update setiap kali deploy:
- **`v4.0.1`** dari `package.json` → naik manual saat `npm version patch/minor/major`
- **`build a3f91c2`** = git commit hash pendek → otomatis sesuai commit terakhir
- **`23 Apr 2026`** = tanggal build → otomatis sesuai waktu deploy

## 🧠 Kenapa pendekatan ini yang terbaik

**Versi dari `package.json` + git hash** adalah standard praktik industry untuk web app:

1. **Semantic versioning visible** — user/admin tau versi mayor (misal v4→v5 ada perubahan signifikan)
2. **Build reproducibility** — kalau ada bug report, cukup tanya "di build hash berapa?" langsung bisa `git checkout` ke commit spesifik
3. **No runtime overhead** — Vite inject constant di build time, bukan fetch API saat page load
4. **Cache-busting natural** — beda hash = beda bundle filename = browser auto-refresh

Alternative yang saya **tidak pakai** dan alasannya:
- ❌ Hardcoded `v4.0.0` di JSX → gak dinamis, lupa update tiap release
- ❌ Fetch dari API `/version` endpoint → butuh backend, overkill untuk static site
- ❌ Import dari `package.json` langsung di App.jsx → bundle inflate (whole package.json included)
- ❌ `process.env.npm_package_version` → cuma jalan saat `npm run ...`, gak ada di runtime browser

## 🚀 Jalankan

1. Copy seluruh code block di atas (yang di dalam ``` ``` besar)
2. Paste ke terminal Claude Code
3. Tunggu ~2 menit
4. Buka URL production → scroll footer → screenshot

Kalau hasil akhir sudah sesuai, saya lanjut bantu hal lain (custom domain, storage foto, dsb).
