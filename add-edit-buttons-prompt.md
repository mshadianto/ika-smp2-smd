# ✏️ Add Edit Buttons for Admin — Copy-Paste ke Claude Code

Buka terminal Claude Code di `C:\ika-portal`, copy prompt di bawah dan paste:

---

```
Tambahkan fitur EDIT (bukan cuma hapus) untuk admin di semua entity: Marketplace, UMKM, 
Events, Gallery, Alumni, Forum Thread. Kerjakan end-to-end minimum konfirmasi.

KONTEKS ARSITEKTUR:
- App.jsx mengelola modal state + handler save/update
- Pages menerima handler onEdit sebagai prop, render tombol edit kalau isAdmin=true
- Forms.jsx: MarketForm & UmkmForm sudah support prop `item` untuk edit mode
- ForumThreadForm, GalleryForm mungkin perlu ditambah prop `item` kalau belum
- EventsPage saat ini pakai prompt() untuk create — ganti dengan form modal proper

═══════════════════════════════════════════════════════════════════
LANGKAH 1 — Analisis dulu file-file existing:
═══════════════════════════════════════════════════════════════════

Baca file-file berikut dan lapor status singkat masing-masing:
- src/components/Forms.jsx — form mana yang sudah support `item` prop?
- src/pages/MarketplacePage.jsx — apakah sudah terima prop onEdit?
- src/pages/UmkmPage.jsx — sama
- src/pages/EventsPage.jsx — handler create-nya gimana?
- src/pages/GalleryPage.jsx
- src/pages/AlumniPage.jsx
- src/pages/ForumPage.jsx
- src/App.jsx — state edit-Xxx sudah ada atau belum?

═══════════════════════════════════════════════════════════════════
LANGKAH 2 — Pastikan semua Form support edit mode:
═══════════════════════════════════════════════════════════════════

Di src/components/Forms.jsx, untuk SETIAP form yang belum support edit, update signature-nya
jadi pakai prop `item`. Pattern universal:

```jsx
export function XxxForm({ item, alumni, onSave, onClose }) {
  const isEdit = Boolean(item?.id);
  const [form, setForm] = useState(item || { /* default kosong */ });
  // ... sisa logic
  // Title modal: isEdit ? "Edit Xxx" : "Tambah Xxx"
  // Tombol submit: isEdit ? "Simpan Perubahan" : "Tambah"
}
```

Khusus untuk EventForm — kemungkinan belum ada, buat baru di Forms.jsx setelah ForumThreadForm:

```jsx
export function EventForm({ item, onSave, onClose }) {
  const isEdit = Boolean(item?.id);
  const [form, setForm] = useState(
    item || {
      judul: "",
      tanggal: new Date().toISOString().slice(0, 10),
      lokasi: "",
      deskripsi: "",
      biaya: "",
    }
  );
  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  
  const handleSave = () => {
    if (!form.judul || !form.tanggal) {
      alert("Judul dan tanggal wajib diisi");
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <Modal onClose={onClose} title={isEdit ? "Edit Agenda" : "Tambah Agenda"}>
      <div style={{ padding: 20 }}>
        <div className="fg">
          <label className="fl">Judul Acara *</label>
          <input className="fi" value={form.judul} 
            onChange={(e) => u("judul", e.target.value)}
            placeholder="cth: Reuni Akbar 2026" />
        </div>
        <div className="fg">
          <label className="fl">Tanggal *</label>
          <input type="date" className="fi" value={form.tanggal}
            onChange={(e) => u("tanggal", e.target.value)} />
        </div>
        <div className="fg">
          <label className="fl">Lokasi</label>
          <input className="fi" value={form.lokasi}
            onChange={(e) => u("lokasi", e.target.value)}
            placeholder="cth: Aula SMPN 2 Samarinda" />
        </div>
        <div className="fg">
          <label className="fl">Deskripsi</label>
          <textarea className="fi" rows={3} value={form.deskripsi}
            onChange={(e) => u("deskripsi", e.target.value)} />
        </div>
        <div className="fg">
          <label className="fl">Biaya</label>
          <input className="fi" value={form.biaya}
            onChange={(e) => u("biaya", e.target.value)}
            placeholder="cth: Rp 150.000/orang atau Gratis" />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
          <button className="btn bo" onClick={onClose}>Batal</button>
          <button className="btn bp" onClick={handleSave}>
            {isEdit ? "Simpan Perubahan" : "Tambah Agenda"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
```

═══════════════════════════════════════════════════════════════════
LANGKAH 3 — Tambah tombol Edit di semua Page:
═══════════════════════════════════════════════════════════════════

Untuk SETIAP page (MarketplacePage, UmkmPage, EventsPage, GalleryPage, AlumniPage, 
ForumPage):

a) Tambah prop `onEdit` di destructuring props (dan `isAdmin` kalau belum ada).

b) Di setiap card/item yang dapat dikelola, render tombol Edit + Delete untuk admin:

```jsx
{isAdmin && (
  <div style={{ display: "flex", gap: 6 }}>
    <button 
      className="btn bo bsm" 
      onClick={(e) => {
        e.stopPropagation();  // ← penting untuk card yang clickable
        onEdit(item);
      }}
      style={{ padding: "4px 10px" }}
      title="Edit"
    >
      <Icon.Edit /> Edit
    </button>
    <button 
      className="btn bdng bsm" 
      onClick={(e) => {
        e.stopPropagation();
        onDelete(item.id);
      }}
      style={{ padding: "4px 10px" }}
      title="Hapus"
    >
      <Icon.Trash />
    </button>
  </div>
)}
```

c) Penting untuk AlumniPage dan ForumPage — kalau card-nya clickable (onClick buat 
navigate ke detail), pastikan tombol Edit pakai `e.stopPropagation()` supaya klik 
tombol tidak trigger navigasi.

d) Pastikan import Icon.Edit sudah ada di tiap page — cek `import { Icon } from ...`

═══════════════════════════════════════════════════════════════════
LANGKAH 4 — Wire-up di App.jsx:
═══════════════════════════════════════════════════════════════════

a) Update import Forms untuk include EventForm:
```jsx
import { 
  AlumniForm, MarketForm, UmkmForm, GalleryForm, 
  ForumThreadForm, EventForm 
} from "./components/Forms";
```

b) Tambah state edit untuk setiap entity (kalau belum ada):
```jsx
const [editAlumni, setEditAlumni] = useState(null);
const [editMarket, setEditMarket] = useState(null);
const [editUmkm, setEditUmkm] = useState(null);
const [editEvent, setEditEvent] = useState(null);
const [editGallery, setEditGallery] = useState(null);
const [editThread, setEditThread] = useState(null);

const [showEventForm, setShowEventForm] = useState(false);
// tambahkan state show form yang belum ada
```

c) Pass handler onEdit + isAdmin ke semua Page component. Contoh MarketplacePage:
```jsx
<MarketplacePage
  items={market.data}
  isAdmin={isAdmin}
  alumni={alumni.data}
  onCreate={() => { setEditMarket(null); setShowMarketForm(true); }}
  onEdit={(item) => { setEditMarket(item); setShowMarketForm(true); }}
  onDelete={async (id) => {
    if (!confirm("Hapus produk ini?")) return;
    await market.remove(id);
    showToast("Produk dihapus");
  }}
/>
```

Terapkan pola serupa untuk:
- UmkmPage → editUmkm state, showUmkmForm
- EventsPage → editEvent state, showEventForm (GANTI handler onCreate yang tadinya 
  pakai prompt() jadi trigger showEventForm)
- GalleryPage → editGallery state, showGalleryForm
- AlumniPage → editAlumni state, showAlumniForm (tambah isAdmin prop)
- ForumPage → editThread state, showThreadForm (tambah handler onEditThread)

d) Tambah modal EventForm di JSX (biasanya di akhir App.jsx, dekat modal lain):
```jsx
{showEventForm && isAdmin && (
  <EventForm
    item={editEvent}
    onClose={() => {
      setShowEventForm(false);
      setEditEvent(null);
    }}
    onSave={async (item) => {
      if (editEvent) {
        await events.update(editEvent.id, item);
        showToast("Agenda diperbarui");
      } else {
        await events.create(item);
        showToast("Agenda ditambahkan");
      }
    }}
  />
)}
```

e) Update modal yang sudah ada (Market, UMKM, Gallery, Forum, Alumni) agar onSave-nya 
handle edit vs create secara konsisten:

```jsx
onSave={async (item) => {
  if (editXxx) {
    await xxx.update(editXxx.id, item);
    showToast("Xxx diperbarui");
  } else {
    await xxx.create(item);
    showToast("Xxx ditambahkan");
  }
}}
```

Dan tambahkan `item={editXxx}` ke modal props.

═══════════════════════════════════════════════════════════════════
LANGKAH 5 — Test build:
═══════════════════════════════════════════════════════════════════

Jalankan `npm run build`. Kalau error, auto-fix dan lapor apa yang di-fix.

═══════════════════════════════════════════════════════════════════
LANGKAH 6 — Commit + Deploy:
═══════════════════════════════════════════════════════════════════

- git add -A
- git commit -m "feat: add edit capability for admin across all entities (market, umkm, events, gallery, alumni, forum)"
- git push origin main
- wrangler pages deploy dist --project-name=ika-smp2-smd --branch=main
- Print URL production setelah deploy sukses

═══════════════════════════════════════════════════════════════════
SPEC PENTING:
═══════════════════════════════════════════════════════════════════

✓ Tombol Edit HANYA tampil untuk admin (isAdmin === true)
✓ Tombol Edit selalu berpasangan dengan tombol Hapus (Edit kiri, Hapus kanan)
✓ Modal form title: "Edit X" kalau edit mode, "Tambah X" kalau create
✓ Tombol submit: "Simpan Perubahan" vs "Tambah X"
✓ Toast: "X diperbarui" vs "X ditambahkan"
✓ Klik tombol Edit/Delete di card tidak boleh trigger navigasi card (stopPropagation)
✓ Jangan tanya konfirmasi antar langkah
✓ Kalau ada file yang isi-nya ternyata beda dari asumsi, adaptif dan lapor perubahan yang dibuat
```

---

## 🎯 Hasil yang diharapkan

Setelah prompt ini selesai, admin akan melihat di setiap entity:

| Entity | Create | Edit | Delete |
|---|---|---|---|
| Marketplace | ✅ | ✅ (baru) | ✅ |
| UMKM | ✅ | ✅ (baru) | ✅ |
| Events | ✅ (form proper) | ✅ (baru) | ✅ |
| Gallery (album) | ✅ | ✅ (baru) | ✅ |
| Alumni | ✅ (self-register) | ✅ (baru, admin-only) | ✅ |
| Forum Thread | ✅ | ✅ (baru) | ✅ |

Plus bonus: Events page akan punya form modal yang proper (tidak lagi pakai `prompt()` yang jelek UX-nya).

## 🚀 Jalankan

1. Copy seluruh code block di atas (yang di dalam ``` ```)
2. Paste ke terminal Claude Code
3. Tunggu ~5-10 menit (cukup banyak file yang diubah)
4. Test di production: login sebagai admin → cek setiap page → screenshot hasil

Kalau ada step yang gagal atau ambigu, kirim screenshot — saya bantu debug spesifik.
