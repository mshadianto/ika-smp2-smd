import { useState, useEffect } from "react";
import { Modal, InfoBanner } from "./Primitives";
import { Icon } from "./Icons";
import { uid } from "../utils/format";
import { KAT_MARKET, KAT_UMKM, KAT_GALLERY, KAT_FORUM, KELAS_OPTIONS } from "../config/constants";

// ============================================================
// Entity Forms
// ============================================================

// ---- Alumni Registration (3-step wizard) ----
export function AlumniForm({ item, onSave, onClose }) {
  const [f, setF] = useState(
    item || { nama: "", angkatan: "", kelas: "", pekerjaan: "", kota: "", telepon: "", email: "", bio: "" }
  );
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const u = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const ok1 = f.nama && f.angkatan && f.kelas;
  const ok2 = f.telepon || f.email;

  const submit = async () => {
    setSaving(true);
    try {
      await onSave({ ...f, id: item?.id || "a" + uid(), registered: item?.registered || new Date().toISOString().slice(0, 10) });
      setDone(true);
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <Modal title={item ? "Data Diperbarui" : "Registrasi Berhasil"} onClose={onClose}>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div className="sanim">
            <svg fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, marginBottom: 8, color: "var(--c1)" }}>
            {item ? "Data diperbarui!" : `Selamat datang, ${f.nama}!`}
          </h3>
          <p style={{ color: "var(--txm)", fontSize: 14 }}>
            {item ? "Perubahan tersimpan." : "Anda terdaftar sebagai alumni IKA SMPN 2 Samarinda."}
          </p>
          <button className="btn bp blg" style={{ marginTop: 20 }} onClick={onClose}>
            Tutup
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title={item ? "Edit Alumni" : "Registrasi Alumni"} onClose={onClose}>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{ flex: 1, height: 4, borderRadius: 4, background: s <= step ? "var(--c1)" : "var(--bd)", transition: ".3s" }} />
        ))}
      </div>
      <p style={{ fontSize: 13, color: "var(--txm)", marginBottom: 16 }}>Langkah {step}/3</p>

      {step === 1 && (
        <>
          <div className="fg">
            <label className="fl">Nama Lengkap *</label>
            <input className="fi" value={f.nama} onChange={(e) => u("nama", e.target.value)} placeholder="Nama lengkap" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="fg">
              <label className="fl">Angkatan *</label>
              <input className="fi" value={f.angkatan} onChange={(e) => u("angkatan", e.target.value)} placeholder="cth: 1998" />
            </div>
            <div className="fg">
              <label className="fl">Kelas *</label>
              <select className="fs" value={f.kelas} onChange={(e) => u("kelas", e.target.value)}>
                <option value="">Pilih</option>
                {KELAS_OPTIONS.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
            <button className="btn bp" onClick={() => setStep(2)} disabled={!ok1}>
              Lanjut →
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="fg">
            <label className="fl">Pekerjaan</label>
            <input className="fi" value={f.pekerjaan} onChange={(e) => u("pekerjaan", e.target.value)} placeholder="cth: Wiraswasta" />
          </div>
          <div className="fg">
            <label className="fl">Kota</label>
            <input className="fi" value={f.kota} onChange={(e) => u("kota", e.target.value)} placeholder="cth: Samarinda" />
          </div>
          <div className="fg">
            <label className="fl">No. WhatsApp</label>
            <input className="fi" value={f.telepon} onChange={(e) => u("telepon", e.target.value)} placeholder="081234567890" />
          </div>
          <div className="fg">
            <label className="fl">Email</label>
            <input className="fi" type="email" value={f.email} onChange={(e) => u("email", e.target.value)} placeholder="nama@email.com" />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <button className="btn bo" onClick={() => setStep(1)}>
              ← Kembali
            </button>
            <button className="btn bp" onClick={() => setStep(3)} disabled={!ok2}>
              Lanjut →
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="fg">
            <label className="fl">Bio</label>
            <textarea className="ft" value={f.bio} onChange={(e) => u("bio", e.target.value)} placeholder="Tentang Anda..." rows={4} />
          </div>
          <div style={{ background: "var(--c1p)", borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--c1)", marginBottom: 8 }}>Ringkasan:</p>
            <p style={{ fontSize: 13, color: "var(--txm)" }}>
              <strong>{f.nama}</strong> — Angkatan {f.angkatan}, Kelas {f.kelas}
              {f.pekerjaan && (
                <>
                  <br />
                  Profesi: {f.pekerjaan}
                </>
              )}
              {f.kota && (
                <>
                  <br />
                  Domisili: {f.kota}
                </>
              )}
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button className="btn bo" onClick={() => setStep(2)} disabled={saving}>
              ← Kembali
            </button>
            <button className="btn ba blg" onClick={submit} disabled={saving}>
              {saving ? "Menyimpan..." : item ? "Simpan" : "✓ Daftar"}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}

// ---- Market Form (admin-only) ----
export function MarketForm({ item, alumni, onSave, onClose }) {
  const [f, setF] = useState(
    item || { judul: "", harga: "", kategori: "Makanan", deskripsi: "", kontak: "", lokasi: "", alumniId: "" }
  );
  const [saving, setSaving] = useState(false);
  const u = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    setSaving(true);
    try {
      await onSave({
        ...f,
        id: item?.id || "m" + uid(),
        harga: Number(f.harga) || 0,
        created: item?.created || new Date().toISOString().slice(0, 10),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={item ? "Edit Produk/Jasa" : "Tambah Produk/Jasa"}
      onClose={onClose}
      footer={
        <>
          <button className="btn bo" onClick={onClose}>
            Batal
          </button>
          <button className="btn bp" onClick={submit} disabled={saving || !f.judul || !f.alumniId}>
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </>
      }
    >
      <InfoBanner>
        <strong>Admin Area</strong>
        <br />
        Hanya admin yang dapat menambah/mengelola produk marketplace. Pengunjung lain hanya dapat melihat.
      </InfoBanner>

      <div className="fg">
        <label className="fl">Penjual *</label>
        <select className="fs" value={f.alumniId} onChange={(e) => u("alumniId", e.target.value)}>
          <option value="">Pilih alumni</option>
          {alumni.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nama} ({a.angkatan})
            </option>
          ))}
        </select>
      </div>
      <div className="fg">
        <label className="fl">Produk/Jasa *</label>
        <input className="fi" value={f.judul} onChange={(e) => u("judul", e.target.value)} placeholder="cth: Kue Lapis Samarinda" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="fg">
          <label className="fl">Harga (Rp)</label>
          <input className="fi" type="number" value={f.harga} onChange={(e) => u("harga", e.target.value)} placeholder="0=Hubungi" />
        </div>
        <div className="fg">
          <label className="fl">Kategori</label>
          <select className="fs" value={f.kategori} onChange={(e) => u("kategori", e.target.value)}>
            {KAT_MARKET.filter((k) => k !== "Semua").map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="fg">
        <label className="fl">Deskripsi</label>
        <textarea className="ft" value={f.deskripsi} onChange={(e) => u("deskripsi", e.target.value)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="fg">
          <label className="fl">Kontak WA</label>
          <input className="fi" value={f.kontak} onChange={(e) => u("kontak", e.target.value)} />
        </div>
        <div className="fg">
          <label className="fl">Lokasi</label>
          <input className="fi" value={f.lokasi} onChange={(e) => u("lokasi", e.target.value)} />
        </div>
      </div>
    </Modal>
  );
}

// ---- UMKM Form ----
export function UmkmForm({ item, alumni, onSave, onClose }) {
  const [f, setF] = useState(
    item || {
      namaUsaha: "",
      kategori: "Kuliner",
      deskripsi: "",
      alamat: "",
      telepon: "",
      instagram: "",
      website: "",
      alumniId: "",
    }
  );
  const [saving, setSaving] = useState(false);
  const u = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    setSaving(true);
    try {
      await onSave({
        ...f,
        id: item?.id || "u" + uid(),
        created: item?.created || new Date().toISOString().slice(0, 10),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={item ? "Edit UMKM" : "Daftarkan UMKM"}
      onClose={onClose}
      footer={
        <>
          <button className="btn bo" onClick={onClose}>
            Batal
          </button>
          <button className="btn bp" onClick={submit} disabled={saving || !f.namaUsaha || !f.alumniId}>
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </>
      }
    >
      <div className="fg">
        <label className="fl">Pemilik *</label>
        <select className="fs" value={f.alumniId} onChange={(e) => u("alumniId", e.target.value)}>
          <option value="">Pilih alumni</option>
          {alumni.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nama} ({a.angkatan})
            </option>
          ))}
        </select>
      </div>
      <div className="fg">
        <label className="fl">Nama Usaha *</label>
        <input className="fi" value={f.namaUsaha} onChange={(e) => u("namaUsaha", e.target.value)} />
      </div>
      <div className="fg">
        <label className="fl">Kategori</label>
        <select className="fs" value={f.kategori} onChange={(e) => u("kategori", e.target.value)}>
          {KAT_UMKM.filter((k) => k !== "Semua").map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
      </div>
      <div className="fg">
        <label className="fl">Deskripsi</label>
        <textarea className="ft" value={f.deskripsi} onChange={(e) => u("deskripsi", e.target.value)} />
      </div>
      <div className="fg">
        <label className="fl">Alamat</label>
        <input className="fi" value={f.alamat} onChange={(e) => u("alamat", e.target.value)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="fg">
          <label className="fl">Telepon</label>
          <input className="fi" value={f.telepon} onChange={(e) => u("telepon", e.target.value)} />
        </div>
        <div className="fg">
          <label className="fl">Instagram</label>
          <input className="fi" value={f.instagram} onChange={(e) => u("instagram", e.target.value)} placeholder="@akun" />
        </div>
      </div>
      <div className="fg">
        <label className="fl">Website</label>
        <input className="fi" value={f.website} onChange={(e) => u("website", e.target.value)} />
      </div>
    </Modal>
  );
}

// ---- Gallery Form ----
export function GalleryForm({ alumni, onSave, onClose }) {
  const [f, setF] = useState({ judul: "", album: "Reuni", deskripsi: "", uploadBy: "", photoCount: 4 });
  const [saving, setSaving] = useState(false);
  const u = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const colors = [
    "#1B3A5C",
    "#2A5F8F",
    "#E8B84B",
    "#5DADE2",
    "#27AE60",
    "#1A5276",
    "#2980B9",
    "#C9952A",
    "#154360",
    "#3498DB",
    "#148F77",
    "#6C3483",
  ];

  const submit = async () => {
    setSaving(true);
    try {
      const photos = Array.from({ length: Number(f.photoCount) || 3 }, (_, i) => ({
        id: "p" + uid(),
        caption: `Foto ${i + 1} - ${f.judul}`,
        color: colors[i % colors.length],
      }));
      await onSave({
        id: "g" + uid(),
        judul: f.judul,
        album: f.album,
        deskripsi: f.deskripsi,
        tanggal: new Date().toISOString().slice(0, 10),
        uploadBy: f.uploadBy,
        photos,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Upload Album"
      onClose={onClose}
      footer={
        <>
          <button className="btn bo" onClick={onClose}>
            Batal
          </button>
          <button className="btn bp" onClick={submit} disabled={saving || !f.judul || !f.uploadBy}>
            {saving ? "Mengupload..." : "Upload"}
          </button>
        </>
      }
    >
      <div className="fg">
        <label className="fl">Oleh *</label>
        <select className="fs" value={f.uploadBy} onChange={(e) => u("uploadBy", e.target.value)}>
          <option value="">Pilih</option>
          {alumni.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nama}
            </option>
          ))}
        </select>
      </div>
      <div className="fg">
        <label className="fl">Judul Album *</label>
        <input className="fi" value={f.judul} onChange={(e) => u("judul", e.target.value)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="fg">
          <label className="fl">Kategori</label>
          <select className="fs" value={f.album} onChange={(e) => u("album", e.target.value)}>
            {KAT_GALLERY.filter((k) => k !== "Semua").map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </div>
        <div className="fg">
          <label className="fl">Jumlah Foto</label>
          <input className="fi" type="number" min="1" max="20" value={f.photoCount} onChange={(e) => u("photoCount", e.target.value)} />
        </div>
      </div>
      <div className="fg">
        <label className="fl">Deskripsi</label>
        <textarea className="ft" value={f.deskripsi} onChange={(e) => u("deskripsi", e.target.value)} />
      </div>
    </Modal>
  );
}

// ---- Forum Thread Form ----
export function ForumThreadForm({ alumni, onSave, onClose }) {
  const [f, setF] = useState({ judul: "", kategori: "Umum", konten: "", authorId: "" });
  const [saving, setSaving] = useState(false);
  const u = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    setSaving(true);
    try {
      await onSave({
        authorId: f.authorId,
        judul: f.judul,
        kategori: f.kategori,
        konten: f.konten,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Buat Topik"
      onClose={onClose}
      wide
      footer={
        <>
          <button className="btn bo" onClick={onClose}>
            Batal
          </button>
          <button className="btn bp" onClick={submit} disabled={saving || !f.judul || !f.konten || !f.authorId}>
            {saving ? "Mengirim..." : "Posting"}
          </button>
        </>
      }
    >
      <div className="fg">
        <label className="fl">Sebagai *</label>
        <select className="fs" value={f.authorId} onChange={(e) => u("authorId", e.target.value)}>
          <option value="">Pilih</option>
          {alumni.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nama} ({a.angkatan})
            </option>
          ))}
        </select>
      </div>
      <div className="fg">
        <label className="fl">Judul *</label>
        <input className="fi" value={f.judul} onChange={(e) => u("judul", e.target.value)} />
      </div>
      <div className="fg">
        <label className="fl">Kategori</label>
        <select className="fs" value={f.kategori} onChange={(e) => u("kategori", e.target.value)}>
          {KAT_FORUM.filter((k) => k !== "Semua").map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
      </div>
      <div className="fg">
        <label className="fl">Isi *</label>
        <textarea className="ft" value={f.konten} onChange={(e) => u("konten", e.target.value)} style={{ minHeight: 160 }} />
      </div>
    </Modal>
  );
}

// ---- Lightbox ----
export function Lightbox({ photos, index, onClose, onNav }) {
  const p = photos[index];
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNav(-1);
      if (e.key === "ArrowRight") onNav(1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, onNav]);

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lb-close" onClick={onClose}>
        <Icon.X />
      </button>
      <button
        className="lb-nav"
        style={{ left: 16 }}
        onClick={(e) => {
          e.stopPropagation();
          onNav(-1);
        }}
      >
        <Icon.ChevLeft />
      </button>
      <div className="lb-img" style={{ background: p.color }} onClick={(e) => e.stopPropagation()}>
        📷
      </div>
      <div className="lb-cap">
        {p.caption} — {index + 1}/{photos.length}
      </div>
      <button
        className="lb-nav"
        style={{ right: 16 }}
        onClick={(e) => {
          e.stopPropagation();
          onNav(1);
        }}
      >
        <Icon.ChevRight />
      </button>
    </div>
  );
}
