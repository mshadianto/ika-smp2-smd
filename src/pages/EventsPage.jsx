import { Icon } from "../components/Icons";
import { EmptyState } from "../components/Primitives";
import { fmtDate, getMonth, getDay } from "../utils/format";

// ============================================================
// EventsPage - agenda / event list
// Admin-only create/edit (enforced by RLS). Form lives in Forms.jsx,
// managed centrally by App.jsx.
// ============================================================

export function EventsPage({ items, isAdmin, onCreate, onEdit, onDelete, onOpenLogin }) {
  const sorted = [...items].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

  return (
    <>
      <div className="sh">
        <div>
          <div className="st">Agenda & Acara</div>
          <div className="ss">{items.length} acara alumni</div>
        </div>
        {isAdmin ? (
          <button className="btn ba" onClick={onCreate}>
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
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          className="btn bgh bsm"
                          style={{ padding: 4 }}
                          onClick={() => onEdit(e)}
                          title="Edit"
                        >
                          <Icon.Edit />
                        </button>
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
                      </div>
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
    </>
  );
}
