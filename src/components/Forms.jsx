import { useState, useEffect } from "react";
import { Modal, InfoBanner } from "./Primitives";
import { Icon } from "./Icons";
import { uid } from "../utils/format";
import { KAT_MARKET, KAT_UMKM, KAT_GALLERY, KAT_FORUM, KELAS_OPTIONS } from "../config/constants";
import { uploadImages, validateImageFile } from "../utils/imageUpload";

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

// ---- Gallery Form (with Supabase Storage upload + client-side compression) ----
export function GalleryForm({ item, alumni, onSave, onClose }) {
  const isEdit = Boolean(item?.id);
  const [f, setF] = useState(
    item
      ? {
          judul: item.judul || "",
          album: item.album || "Reuni",
          deskripsi: item.deskripsi || "",
          tanggal: item.tanggal || new Date().toISOString().slice(0, 10),
          uploadBy: item.uploadBy || "",
          photos: item.photos || [],
        }
      : {
          judul: "",
          album: "Reuni",
          deskripsi: "",
          tanggal: new Date().toISOString().slice(0, 10),
          uploadBy: "",
          photos: [],
        }
  );
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");
  const u = (k, v) => setF((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    return () => {
      previews.forEach((p) => p.url && URL.revokeObjectURL(p.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    const errors = [];
    const valid = [];
    selected.forEach((file) => {
      const err = validateImageFile(file);
      if (err) errors.push(`${file.name}: ${err}`);
      else valid.push(file);
    });

    setError(errors.length > 0 ? errors.join("\n") : "");
    setFiles((prev) => [...prev, ...valid]);
    setPreviews((prev) => [
      ...prev,
      ...valid.map((file) => ({
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file),
      })),
    ]);

    e.target.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      if (prev[index]?.url) URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const totalSizeMB = previews.reduce((s, p) => s + p.size, 0) / 1024 / 1024;

  const handleSave = async () => {
    if (!f.judul) return setError("Judul album wajib diisi");
    if (!isEdit && !f.uploadBy) return setError("Pilih penanggung jawab");
    if (!isEdit && files.length === 0) return setError("Pilih minimal 1 foto");

    setError("");
    setUploading(true);

    try {
      let newPhotos = [];
      if (files.length > 0) {
        const folder = `albums/${Date.now()}`;
        const results = await uploadImages(files, folder, setProgress);
        const failed = results.filter((r) => r.error);
        if (failed.length > 0) {
          throw new Error(`${failed.length} foto gagal upload: ${failed[0].error}`);
        }
        newPhotos = results.map((r, i) => ({
          imageUrl: r.url,
          caption: previews[i]?.name?.replace(/\.[^.]+$/, "") || `Foto ${i + 1}`,
          color: "#1B3A5C",
        }));
      }

      if (isEdit) {
        await onSave({
          id: item.id,
          judul: f.judul,
          album: f.album,
          deskripsi: f.deskripsi,
        });
      } else {
        await onSave({
          id: "g" + uid(),
          judul: f.judul,
          album: f.album,
          deskripsi: f.deskripsi,
          tanggal: f.tanggal,
          uploadBy: f.uploadBy,
          photos: newPhotos,
        });
      }

      previews.forEach((p) => p.url && URL.revokeObjectURL(p.url));
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
      setProgress(null);
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit Album" : "Upload Album Baru"}
      onClose={uploading ? () => {} : onClose}
      footer={
        <>
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
        </>
      }
    >
      {error && (
        <div
          style={{
            padding: 12,
            marginBottom: 16,
            background: "#FEE",
            color: "#B71C1C",
            borderRadius: 8,
            fontSize: 13,
            whiteSpace: "pre-line",
          }}
        >
          {error}
        </div>
      )}

      <div className="fg">
        <label className="fl">Judul Album *</label>
        <input
          className="fi"
          value={f.judul}
          onChange={(e) => u("judul", e.target.value)}
          placeholder="cth: Reuni Akbar 2026"
          disabled={uploading}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="fg">
          <label className="fl">Kategori</label>
          <select className="fs" value={f.album} onChange={(e) => u("album", e.target.value)} disabled={uploading}>
            {KAT_GALLERY.filter((k) => k !== "Semua").map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </div>
        <div className="fg">
          <label className="fl">Tanggal</label>
          <input
            type="date"
            className="fi"
            value={f.tanggal}
            onChange={(e) => u("tanggal", e.target.value)}
            disabled={uploading || isEdit}
          />
        </div>
      </div>

      {!isEdit && (
        <div className="fg">
          <label className="fl">Penanggung Jawab *</label>
          <select
            className="fs"
            value={f.uploadBy}
            onChange={(e) => u("uploadBy", e.target.value)}
            disabled={uploading}
          >
            <option value="">-- Pilih alumni --</option>
            {alumni?.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nama}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="fg">
        <label className="fl">Deskripsi</label>
        <textarea
          className="ft"
          rows={2}
          value={f.deskripsi}
          onChange={(e) => u("deskripsi", e.target.value)}
          disabled={uploading}
        />
      </div>

      {!isEdit && (
        <div className="fg">
          <label className="fl">
            Foto *
            <span style={{ fontSize: 11, color: "var(--txl)", marginLeft: 8, fontWeight: 400 }}>
              (JPG/PNG/WebP, otomatis dikompres ke ~500 KB)
            </span>
          </label>
          <label
            htmlFor="photo-upload"
            style={{
              display: "block",
              padding: "28px 20px",
              textAlign: "center",
              border: "2px dashed var(--bd)",
              borderRadius: 12,
              background: "var(--bg2)",
              cursor: uploading ? "not-allowed" : "pointer",
              opacity: uploading ? 0.5 : 1,
              transition: "all 0.2s",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
            <div style={{ fontWeight: 600, color: "var(--c1)" }}>Klik untuk pilih foto</div>
            <div style={{ fontSize: 12, color: "var(--txm)", marginTop: 4 }}>
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
      )}

      {previews.length > 0 && (
        <div className="fg">
          <label className="fl">
            {previews.length} foto siap upload
            <span style={{ fontSize: 11, color: "var(--txl)", marginLeft: 8, fontWeight: 400 }}>
              (~{totalSizeMB.toFixed(1)} MB sebelum kompresi)
            </span>
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
              gap: 8,
              marginTop: 8,
            }}
          >
            {previews.map((p, i) => (
              <div key={i} style={{ position: "relative" }}>
                <img
                  src={p.url}
                  alt={p.name}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    objectFit: "cover",
                    borderRadius: 6,
                    border: "1px solid var(--bd)",
                    display: "block",
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  disabled={uploading}
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "var(--err)",
                    color: "white",
                    border: "none",
                    fontSize: 12,
                    cursor: uploading ? "not-allowed" : "pointer",
                    lineHeight: 1,
                    padding: 0,
                  }}
                  title="Hapus"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isEdit && f.photos?.length > 0 && (
        <div
          style={{
            marginTop: 8,
            padding: 12,
            background: "var(--c1p)",
            borderRadius: 8,
            fontSize: 13,
            color: "var(--c1)",
          }}
        >
          <strong>{f.photos.length} foto</strong> sudah ada di album ini. Edit saat ini hanya memperbarui metadata album;
          foto existing tidak diubah.
        </div>
      )}

      {uploading && (
        <div
          style={{
            padding: 12,
            marginTop: 16,
            background: "var(--skyp)",
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          <div style={{ marginBottom: 6, fontWeight: 600 }}>
            {progress
              ? `Mengupload ${progress.completed}/${progress.total} (${progress.percent}%)`
              : "Mengkompres foto..."}
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.5)", borderRadius: 3, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                background: "var(--c1)",
                width: progress ? `${progress.percent}%` : "10%",
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}

// ---- Forum Thread Form ----
export function ForumThreadForm({ item, alumni, onSave, onClose }) {
  const isEdit = Boolean(item?.id);
  const [f, setF] = useState(
    item
      ? {
          judul: item.judul || "",
          kategori: item.kategori || "Umum",
          konten: item.konten || "",
          authorId: item.authorId || "",
        }
      : { judul: "", kategori: "Umum", konten: "", authorId: "" }
  );
  const [saving, setSaving] = useState(false);
  const u = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    setSaving(true);
    try {
      await onSave({
        id: item?.id,
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
      title={isEdit ? "Edit Topik" : "Buat Topik"}
      onClose={onClose}
      wide
      footer={
        <>
          <button className="btn bo" onClick={onClose}>
            Batal
          </button>
          <button
            className="btn bp"
            onClick={submit}
            disabled={saving || !f.judul || !f.konten || (!isEdit && !f.authorId)}
          >
            {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Posting"}
          </button>
        </>
      }
    >
      {!isEdit && (
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
      )}
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

// ---- Event Form (admin-only) ----
export function EventForm({ item, onSave, onClose }) {
  const isEdit = Boolean(item?.id);
  const [f, setF] = useState(
    item
      ? {
          judul: item.judul || "",
          tanggal: item.tanggal || new Date().toISOString().slice(0, 10),
          lokasi: item.lokasi || "",
          deskripsi: item.deskripsi || "",
          biaya: item.biaya || "",
        }
      : {
          judul: "",
          tanggal: new Date().toISOString().slice(0, 10),
          lokasi: "",
          deskripsi: "",
          biaya: "",
        }
  );
  const [saving, setSaving] = useState(false);
  const u = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    setSaving(true);
    try {
      await onSave({ ...f, id: item?.id || "e" + uid() });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit Agenda" : "Tambah Agenda"}
      onClose={onClose}
      footer={
        <>
          <button className="btn bo" onClick={onClose}>
            Batal
          </button>
          <button className="btn bp" onClick={submit} disabled={saving || !f.judul || !f.tanggal}>
            {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Agenda"}
          </button>
        </>
      }
    >
      <div className="fg">
        <label className="fl">Judul Acara *</label>
        <input className="fi" value={f.judul} onChange={(e) => u("judul", e.target.value)} placeholder="cth: Reuni Akbar 2026" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="fg">
          <label className="fl">Tanggal *</label>
          <input className="fi" type="date" value={f.tanggal} onChange={(e) => u("tanggal", e.target.value)} />
        </div>
        <div className="fg">
          <label className="fl">Biaya</label>
          <input className="fi" value={f.biaya} onChange={(e) => u("biaya", e.target.value)} placeholder="Gratis / Rp 100.000" />
        </div>
      </div>
      <div className="fg">
        <label className="fl">Lokasi</label>
        <input className="fi" value={f.lokasi} onChange={(e) => u("lokasi", e.target.value)} placeholder="cth: Aula SMPN 2 Samarinda" />
      </div>
      <div className="fg">
        <label className="fl">Deskripsi</label>
        <textarea className="ft" value={f.deskripsi} onChange={(e) => u("deskripsi", e.target.value)} />
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
      <div
        className="lb-img"
        style={{
          background: p.imageUrl ? `url(${p.imageUrl}) center/contain no-repeat black` : p.color,
          color: "white",
          fontSize: 48,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {!p.imageUrl && "📷"}
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
