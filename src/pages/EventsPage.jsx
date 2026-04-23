import { useState } from "react";
import { Icon } from "../components/Icons";
import { Modal, EmptyState } from "../components/Primitives";
import { fmtDate, getMonth, getDay, uid } from "../utils/format";

// ============================================================
// EventsPage - agenda / event list
// Admin-only create (enforced by RLS).
// ============================================================

export function EventsPage({ items, isAdmin, onCreate, onDelete, onOpenLogin }) {
  const [showForm, setShowForm] = useState(false);
  const sorted = [...items].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

  return (
    <>
      <div className="sh">
        <div>
          <div className="st">Agenda & Acara</div>
          <div className="ss">{items.length} acara alumni</div>
        </div>
        {isAdmin ? (
          <button className="btn ba" onClick={() => setShowForm(true)}>
            <Icon.Plus /> Tambah Agenda
          </button>
        ) : (
          <button className="btn bo bsm" onClick={onOpenLogin}>
            <Icon.Lock /> Login Admin
          </button>
        )}
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon="📅" title="Belum ada agenda" description="Agenda akan ditampilkan di sini." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {sorted.map((e) => (
            <div key={e.id} className="card">
              <div className="ec">
                <div className="edb">
                  <div className="em">{getMonth(e.tanggal)}</div>
                  <div className="ed">{getDay(e.tanggal)}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <h4 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{e.judul}</h4>
                    {isAdmin && (
                      <button
                        className="btn bgh bsm"
                        style={{ padding: 4, color: "var(--err)" }}
                        onClick={() => {
                          if (confirm(`Hapus agenda "${e.judul}"?`)) onDelete(e.id);
                        }}
                        title="Hapus"
                      >
                        <Icon.Trash />
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: "var(--txm)", marginBottom: 10, lineHeight: 1.6 }}>{e.deskripsi}</p>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12, color: "var(--txm)" }}>
                    {e.lokasi && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Icon.Pin /> {e.lokasi}
                      </span>
                    )}
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Icon.Cal /> {fmtDate(e.tanggal)}
                    </span>
                    {e.biaya && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        💰 {e.biaya}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <EventForm
          onSave={async (item) => {
            await onCreate(item);
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
}

function EventForm({ onSave, onClose }) {
  const [f, setF] = useState({ judul: "", tanggal: "", lokasi: "", deskripsi: "", biaya: "" });
  const [saving, setSaving] = useState(false);
  const u = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    setSaving(true);
    try {
      await onSave({ ...f, id: "e" + uid() });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Tambah Agenda"
      onClose={onClose}
      footer={
        <>
          <button className="btn bo" onClick={onClose}>
            Batal
          </button>
          <button className="btn bp" onClick={submit} disabled={saving || !f.judul || !f.tanggal}>
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </>
      }
    >
      <div className="fg">
        <label className="fl">Judul Acara *</label>
        <input className="fi" value={f.judul} onChange={(e) => u("judul", e.target.value)} />
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
        <input className="fi" value={f.lokasi} onChange={(e) => u("lokasi", e.target.value)} />
      </div>
      <div className="fg">
        <label className="fl">Deskripsi</label>
        <textarea className="ft" value={f.deskripsi} onChange={(e) => u("deskripsi", e.target.value)} />
      </div>
    </Modal>
  );
}
