# 📷 Gallery Photo Upload — Copy-Paste ke Claude Code

Ini prompt untuk implementasi **Supabase Storage + multi-file upload + client-side image compression**.

## ⚠️ PENTING — Lakukan dulu di Supabase Dashboard

**SEBELUM** menjalankan prompt Claude Code, setup bucket dulu di Supabase. Cuma 1 menit:

### Step 1: Create Storage Bucket

Buka: **https://supabase.com/dashboard/project/fjodyrcbpwhdkbcbctdt/storage/buckets**

1. Klik **"New bucket"**
2. **Name:** `gallery-photos`
3. **Public bucket:** ✅ **Toggle ON** (foto bisa diakses public read)
4. **File size limit:** `5 MB` (compressed file biasanya jauh di bawah ini)
5. **Allowed MIME types:** `image/jpeg, image/png, image/webp`
6. Klik **"Save"**

### Step 2: Apply Storage Policies

Buka: **https://supabase.com/dashboard/project/fjodyrcbpwhdkbcbctdt/sql/new**

Paste & run SQL ini:

```sql
-- Public bisa lihat semua foto
CREATE POLICY "Public can view gallery photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery-photos');

-- Authenticated user bisa upload (admin enforcement di app layer)
CREATE POLICY "Authenticated can upload gallery photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gallery-photos' 
  AND auth.role() = 'authenticated'
);

-- Hanya admin yang bisa hapus foto
CREATE POLICY "Admin can delete gallery photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gallery-photos' 
  AND is_admin()
);
```

Klik **"Run"**. Pastikan no error.

---

## 🚀 Sekarang copy prompt di bawah ke Claude Code:

```
Implementasi photo upload di Gallery menggunakan Supabase Storage. Saya sudah setup 
bucket `gallery-photos` (public) di Supabase Dashboard dan sudah apply RLS policies.

KONTEKS:
- BUCKETS.GALLERY = "gallery-photos" sudah didefinisikan di src/config/supabase.js
- galleryService di src/services/entities.js sudah ada method create() yang accept array photos
- gallery_photos table punya field image_url (snake_case)
- GalleryForm di src/components/Forms.jsx saat ini cuma generate placeholder color
- GalleryPage menampilkan gallery, harus support image_url juga (saat ini cuma color)

LANGKAH 1 — Install dependency:
npm install browser-image-compression

LANGKAH 2 — Buat utility upload + compression:

Buat file baru src/utils/imageUpload.js:

```javascript
import imageCompression from "browser-image-compression";
import { supabase, USE_SUPABASE, BUCKETS } from "../config/supabase";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,           // Target max 500 KB per foto
  maxWidthOrHeight: 1600,   // Max dimensi 1600px (cukup untuk full-screen view)
  useWebWorker: true,
  fileType: "image/jpeg",
  initialQuality: 0.85,
};

/**
 * Compress + upload single image ke Supabase Storage
 * Returns: { url, path, error }
 */
export async function uploadImage(file, folder = "albums") {
  try {
    // 1. Compress
    const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
    
    if (!USE_SUPABASE) {
      // Local fallback: pakai object URL (tidak persisten, untuk preview saja)
      return { 
        url: URL.createObjectURL(compressed), 
        path: null, 
        error: null,
        local: true 
      };
    }
    
    // 2. Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = "jpg"; // selalu jpeg karena hasil compression
    const filename = `${folder}/${timestamp}-${random}.${ext}`;
    
    // 3. Upload ke Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKETS.GALLERY)
      .upload(filename, compressed, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/jpeg",
      });
    
    if (error) throw error;
    
    // 4. Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKETS.GALLERY)
      .getPublicUrl(data.path);
    
    return { 
      url: urlData.publicUrl, 
      path: data.path, 
      error: null 
    };
  } catch (e) {
    console.error("[uploadImage]", e);
    return { url: null, path: null, error: e.message };
  }
}

/**
 * Upload multiple images dengan progress callback
 */
export async function uploadImages(files, folder, onProgress) {
  const results = [];
  let completed = 0;
  
  for (const file of files) {
    const result = await uploadImage(file, folder);
    results.push(result);
    completed++;
    if (onProgress) {
      onProgress({ 
        completed, 
        total: files.length, 
        percent: Math.round((completed / files.length) * 100) 
      });
    }
  }
  
  return results;
}

/**
 * Delete image dari storage (admin only via RLS)
 */
export async function deleteImage(path) {
  if (!USE_SUPABASE || !path) return { error: null };
  try {
    const { error } = await supabase.storage
      .from(BUCKETS.GALLERY)
      .remove([path]);
    if (error) throw error;
    return { error: null };
  } catch (e) {
    console.error("[deleteImage]", e);
    return { error: e.message };
  }
}

export function validateImageFile(file) {
  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB sebelum compression
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
  
  if (file.size > MAX_SIZE) {
    return `File terlalu besar (max 10 MB). File Anda: ${(file.size / 1024 / 1024).toFixed(1)} MB`;
  }
  if (!ALLOWED_TYPES.includes(file.type) && !file.type.startsWith("image/")) {
    return `Format tidak didukung. Pakai JPG, PNG, atau WebP`;
  }
  return null;
}
```

LANGKAH 3 — Rewrite GalleryForm di src/components/Forms.jsx:

Cari fungsi `GalleryForm` dan REPLACE dengan implementasi baru ini:

```jsx
export function GalleryForm({ item, alumni, onSave, onClose }) {
  const isEdit = Boolean(item?.id);
  const [form, setForm] = useState(
    item || {
      judul: "",
      deskripsi: "",
      tanggal: new Date().toISOString().slice(0, 10),
      album: "Reuni",
      uploadBy: "",
      photos: [],
    }
  );
  const [files, setFiles] = useState([]);  // File objects untuk upload
  const [previews, setPreviews] = useState([]);  // Object URLs untuk preview
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");
  
  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  
  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;
    
    // Validate files
    const { validateImageFile } = require("../utils/imageUpload");
    const errors = [];
    const valid = [];
    selected.forEach((f) => {
      const err = validateImageFile(f);
      if (err) {
        errors.push(`${f.name}: ${err}`);
      } else {
        valid.push(f);
      }
    });
    
    if (errors.length > 0) {
      setError(errors.join("\n"));
    } else {
      setError("");
    }
    
    // Append to existing
    setFiles((prev) => [...prev, ...valid]);
    setPreviews((prev) => [
      ...prev,
      ...valid.map((f) => ({
        name: f.name,
        size: f.size,
        url: URL.createObjectURL(f),
      })),
    ]);
    
    // Reset input value supaya bisa pilih file yang sama lagi
    e.target.value = "";
  };
  
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      // Revoke object URL untuk free memory
      if (prev[index]?.url) URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };
  
  const handleSave = async () => {
    if (!form.judul) {
      setError("Judul album wajib diisi");
      return;
    }
    if (!form.uploadBy) {
      setError("Pilih nama penanggung jawab");
      return;
    }
    if (!isEdit && files.length === 0) {
      setError("Pilih minimal 1 foto untuk diupload");
      return;
    }
    
    setError("");
    setUploading(true);
    
    try {
      let newPhotos = [];
      
      if (files.length > 0) {
        const { uploadImages } = require("../utils/imageUpload");
        const folder = `albums/${Date.now()}`;
        const results = await uploadImages(files, folder, setProgress);
        
        // Cek apakah ada upload yang gagal
        const failed = results.filter((r) => r.error);
        if (failed.length > 0) {
          throw new Error(`${failed.length} foto gagal upload: ${failed[0].error}`);
        }
        
        newPhotos = results.map((r, i) => ({
          imageUrl: r.url,
          caption: previews[i]?.name?.replace(/\.[^.]+$/, "") || `Foto ${i + 1}`,
          color: "#1B3A5C", // fallback color
        }));
      }
      
      // Combine existing photos (kalau edit mode) dengan yang baru
      const allPhotos = isEdit 
        ? [...(form.photos || []), ...newPhotos]
        : newPhotos;
      
      await onSave({ ...form, photos: allPhotos });
      
      // Cleanup object URLs
      previews.forEach((p) => p.url && URL.revokeObjectURL(p.url));
      
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
      setProgress(null);
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      previews.forEach((p) => p.url && URL.revokeObjectURL(p.url));
    };
  }, []);
  
  return (
    <Modal onClose={onClose} title={isEdit ? "Edit Album" : "Upload Album Baru"}>
      <div style={{ padding: 20, maxHeight: "70vh", overflowY: "auto" }}>
        {error && (
          <div style={{ 
            padding: 12, marginBottom: 16, 
            background: "#FEE", color: "#B71C1C", 
            borderRadius: 8, fontSize: 13, whiteSpace: "pre-line" 
          }}>
            {error}
          </div>
        )}
        
        <div className="fg">
          <label className="fl">Judul Album *</label>
          <input className="fi" value={form.judul}
            onChange={(e) => u("judul", e.target.value)}
            placeholder="cth: Reuni Akbar 2026" />
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="fg">
            <label className="fl">Kategori</label>
            <select className="fi" value={form.album}
              onChange={(e) => u("album", e.target.value)}>
              <option>Reuni</option>
              <option>Kegiatan</option>
              <option>Nostalgia</option>
              <option>Bakti Sosial</option>
              <option>Lainnya</option>
            </select>
          </div>
          <div className="fg">
            <label className="fl">Tanggal</label>
            <input type="date" className="fi" value={form.tanggal}
              onChange={(e) => u("tanggal", e.target.value)} />
          </div>
        </div>
        
        <div className="fg">
          <label className="fl">Penanggung Jawab *</label>
          <select className="fi" value={form.uploadBy}
            onChange={(e) => u("uploadBy", e.target.value)}>
            <option value="">-- Pilih alumni --</option>
            {alumni?.map((a) => (
              <option key={a.id} value={a.id}>{a.nama}</option>
            ))}
          </select>
        </div>
        
        <div className="fg">
          <label className="fl">Deskripsi</label>
          <textarea className="fi" rows={2} value={form.deskripsi}
            onChange={(e) => u("deskripsi", e.target.value)} />
        </div>
        
        {/* File picker */}
        <div className="fg">
          <label className="fl">
            Foto {!isEdit && "*"} 
            <span style={{ fontSize: 11, color: "#888", marginLeft: 8 }}>
              (JPG/PNG/WebP, otomatis dikompres)
            </span>
          </label>
          <label 
            htmlFor="photo-upload"
            style={{
              display: "block", padding: "32px 20px", textAlign: "center",
              border: "2px dashed #CBD5E1", borderRadius: 12,
              background: "#F8FAFC", cursor: "pointer", transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#1B3A5C"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#CBD5E1"}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
            <div style={{ fontWeight: 600, color: "#1B3A5C" }}>
              Klik untuk pilih foto
            </div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
              Bisa pilih beberapa sekaligus (Ctrl/Cmd + click)
            </div>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              style={{ display: "none" }}
              disabled={uploading}
            />
          </label>
        </div>
        
        {/* Preview */}
        {previews.length > 0 && (
          <div className="fg">
            <label className="fl">
              {previews.length} foto siap upload 
              {previews.length > 0 && (
                <span style={{ fontSize: 11, color: "#888", marginLeft: 8 }}>
                  (~{(previews.reduce((s, p) => s + p.size, 0) / 1024 / 1024).toFixed(1)} MB total, akan dikompres)
                </span>
              )}
            </label>
            <div style={{
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
              gap: 8, marginTop: 8
            }}>
              {previews.map((p, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img 
                    src={p.url} 
                    alt={p.name}
                    style={{ 
                      width: "100%", aspectRatio: "1", 
                      objectFit: "cover", borderRadius: 6,
                      border: "1px solid #E2E8F0"
                    }} 
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    disabled={uploading}
                    style={{
                      position: "absolute", top: -6, right: -6,
                      width: 20, height: 20, borderRadius: "50%",
                      background: "#DC2626", color: "white", border: "none",
                      fontSize: 12, cursor: "pointer", lineHeight: 1
                    }}
                    title="Hapus"
                  >×</button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Existing photos (edit mode) */}
        {isEdit && form.photos?.length > 0 && (
          <div className="fg">
            <label className="fl">
              {form.photos.length} foto sudah ada di album ini
              <span style={{ fontSize: 11, color: "#888", marginLeft: 8 }}>
                (foto baru di atas akan ditambahkan)
              </span>
            </label>
          </div>
        )}
        
        {/* Progress */}
        {uploading && (
          <div style={{ 
            padding: 12, marginTop: 16, 
            background: "#EFF6FF", borderRadius: 8, fontSize: 13 
          }}>
            <div style={{ marginBottom: 6 }}>
              {progress 
                ? `Mengupload foto ${progress.completed}/${progress.total} (${progress.percent}%)`
                : "Mengkompres foto..."}
            </div>
            <div style={{ height: 6, background: "#DBEAFE", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ 
                height: "100%", background: "#1B3A5C", 
                width: progress ? `${progress.percent}%` : "10%",
                transition: "width 0.3s"
              }} />
            </div>
          </div>
        )}
        
        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
          <button className="btn bo" onClick={onClose} disabled={uploading}>
            Batal
          </button>
          <button className="btn bp" onClick={handleSave} disabled={uploading}>
            {uploading 
              ? "Mengupload..." 
              : isEdit 
                ? "Simpan Perubahan" 
                : `Upload ${files.length} Foto`}
          </button>
        </div>
      </div>
    </Modal>
  );
}
```

PASTIKAN import yang diperlukan ada di top file Forms.jsx:
- useState, useEffect dari "react" (kemungkinan sudah ada)
- Modal dari Primitives (sudah ada)

LANGKAH 4 — Update GalleryPage agar tampilkan image_url:

Edit src/pages/GalleryPage.jsx. Cari bagian render foto di album card (preview thumbnails) 
dan album detail view. Ganti dari pakai background color jadi pakai imageUrl kalau ada:

```jsx
// Di album card (preview 4 foto):
<div 
  key={photo.id} 
  style={{ 
    width: "100%", 
    aspectRatio: "1",
    background: photo.imageUrl 
      ? `url(${photo.imageUrl}) center/cover` 
      : photo.color || "#1B3A5C",
    borderRadius: 6,
  }} 
/>

// Di album detail view (full grid):
<div
  key={photo.id}
  onClick={() => openLightbox(idx)}
  style={{
    aspectRatio: "1",
    background: photo.imageUrl 
      ? `url(${photo.imageUrl}) center/cover` 
      : photo.color || "#1B3A5C",
    borderRadius: 8,
    cursor: "pointer",
    position: "relative",
  }}
>
  {photo.caption && (
    <div className="cap">{photo.caption}</div>
  )}
</div>
```

LANGKAH 5 — Update Lightbox di Forms.jsx agar tampilkan foto asli:

Cari fungsi Lightbox, ubah bagian yang render image agar pakai imageUrl:

```jsx
// Di dalam Lightbox component, ganti div placeholder dengan:
<div style={{
  width: "100%",
  height: "100%",
  background: photo.imageUrl
    ? `url(${photo.imageUrl}) center/contain no-repeat`
    : photo.color || "#1B3A5C",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontSize: 24,
}}>
  {!photo.imageUrl && (photo.caption || `Foto ${index + 1}`)}
</div>
```

LANGKAH 6 — Update galleryService di src/services/entities.js:

Pastikan create() handle photos dengan imageUrl. Cari method create di galleryService 
dan pastikan saat insert ke gallery_photos table, field image_url di-include:

Cari di method create:
```js
const photoInserts = photos.map(p => ({
  album_id: album.id,
  caption: p.caption,
  color: p.color,
  image_url: p.imageUrl,  // ← pastikan ini ada
}));
```

Kalau belum ada `image_url`, tambahkan.

Sama untuk mapFromDb, pastikan image_url → imageUrl:
```js
const mapPhoto = (p) => ({
  id: p.id,
  caption: p.caption,
  color: p.color,
  imageUrl: p.image_url,  // ← snake → camel
});
```

LANGKAH 7 — Test build:
npm run build

Kalau ada error tentang `require()` di file ESM (browser-image-compression atau 
imageUpload import), ganti dynamic require pakai static import di top of file.

LANGKAH 8 — Test lokal:
npm run dev
Login sebagai admin → Gallery → Upload Album:
- Pilih beberapa foto dari device
- Verify preview muncul
- Klik Upload → progress bar muncul
- Setelah selesai, album baru muncul di list dengan foto asli (bukan placeholder)
- Klik album → foto-foto tampil
- Klik foto → lightbox dengan foto full

LANGKAH 9 — Commit + Deploy:
git add -A
git commit -m "feat(gallery): add multi-photo upload with Supabase Storage and client-side compression"
git push origin main
wrangler pages deploy dist --project-name=ika-smp2-smd --branch=main
Print URL production setelah deploy.

PENTING:
- Jangan tanya konfirmasi antar langkah, kerjakan sekuensial
- Kalau ada error, auto-fix dan lapor
- Kalau RLS policy belum ada (user belum jalankan SQL), upload akan gagal — 
  lapor ke user untuk run SQL di Step 2 README
- Pastikan static import di Forms.jsx (jangan pakai require dinamis):
  import { uploadImages, validateImageFile } from "../utils/imageUpload";
```

---

## 🎯 Hasil yang akan Anda dapatkan

```
┌─ Gallery (admin) ─────────────────────────────┐
│  [+ Upload Album]                             │
│                                                │
│  ┌──────────────────────────┐                │
│  │ Reuni Akbar 2024         │                │
│  │ ┌──┬──┬──┬──┐            │                │
│  │ │📷│📷│📷│📷│ ← foto asli │                │
│  │ └──┴──┴──┴──┘            │                │
│  │ 12 foto                  │                │
│  └──────────────────────────┘                │
└────────────────────────────────────────────────┘
            ↓ klik [Upload Album]
┌─ Modal Upload ────────────────────────────────┐
│  Judul: ____________________                  │
│  Tanggal: 23/04/2026                          │
│  Penanggung Jawab: [Sopian Hadianto ▼]       │
│                                                │
│  ┌────────────────────────────────┐          │
│  │  📷 Klik untuk pilih foto      │          │
│  │  Bisa pilih beberapa sekaligus │          │
│  └────────────────────────────────┘          │
│                                                │
│  3 foto siap upload (~12.4 MB → akan dikompres)│
│  ┌──┬──┬──┐                                   │
│  │📷│📷│📷│ ← preview thumbnails              │
│  │❌│❌│❌│                                   │
│  └──┴──┴──┘                                   │
│                                                │
│  [Batal]  [Upload 3 Foto]                    │
└────────────────────────────────────────────────┘
            ↓ klik upload
            ▓▓▓▓▓▓░░░ 67% (2/3)
            ↓ done → album live di production
```

## 💡 Spec teknis yang akan terimplementasi

| Aspek | Spec |
|---|---|
| Storage | Supabase Storage bucket `gallery-photos` |
| Compression | Client-side, target 500KB, max 1600px |
| Upload | Multi-file, sequential, progress tracking |
| Format | JPG/PNG/WebP input, JPEG output |
| Max input | 10 MB per file (sebelum compression) |
| Max storage | 1 GB free tier (~2000 foto compressed) |
| CDN | Supabase auto (egress unlimited di free tier) |
| Permission | Public read, authenticated write, admin delete |
| Cost | 100% free di tier saat ini |

## 🚀 Cara pakai

1. **DULU:** Setup bucket + RLS policy di Supabase Dashboard (instruksi paling atas, ~1 menit)
2. Copy seluruh code block prompt di atas
3. Paste ke Claude Code terminal
4. Tunggu ~5-10 menit (banyak file diubah + npm install)
5. Test di production: login admin → upload album dengan foto asli → verify

Kalau ada step yang stuck, kirim screenshot.
