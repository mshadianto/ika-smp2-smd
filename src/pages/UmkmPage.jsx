import { useState, useMemo } from "react";
import { Icon } from "../components/Icons";
import { Badge, EmptyState, SearchBar, FilterChips } from "../components/Primitives";
import { waLink, emoji } from "../utils/format";
import { KAT_UMKM } from "../config/constants";

// ============================================================
// UmkmPage - directory of alumni businesses
// Anyone can register UMKM; admin can moderate/delete.
// ============================================================

export function UmkmPage({ items, alumni, isAdmin, onCreate, onDelete }) {
  const [q, setQ] = useState("");
  const [kat, setKat] = useState("Semua");

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return items.filter((u) => {
      const matchSearch =
        !s ||
        u.namaUsaha?.toLowerCase().includes(s) ||
        u.deskripsi?.toLowerCase().includes(s) ||
        u.alamat?.toLowerCase().includes(s);
      const matchKat = kat === "Semua" || u.kategori === kat;
      return matchSearch && matchKat;
    });
  }, [items, q, kat]);

  const nameOf = (id) => alumni.find((a) => a.id === id)?.nama || "Alumni";

  return (
    <>
      <div className="sh">
        <div>
          <div className="st">Direktori UMKM</div>
          <div className="ss">{items.length} usaha alumni</div>
        </div>
        <button className="btn bp" onClick={onCreate}>
          <Icon.Plus /> Daftar UMKM
        </button>
      </div>

      <SearchBar value={q} onChange={setQ} placeholder="Cari nama usaha, kategori, lokasi..." />
      <FilterChips
        options={KAT_UMKM}
        value={kat}
        onChange={setKat}
        icon={(k) => (k === "Semua" ? "🏪 Semua" : `${emoji(k)} ${k}`)}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon="🏪"
          title="Belum ada UMKM"
          description="Daftarkan usaha Anda untuk dipromosikan ke sesama alumni."
          action={
            <button className="btn bp" onClick={onCreate}>
              <Icon.Plus /> Daftar UMKM
            </button>
          }
        />
      ) : (
        <div className="g3">
          {filtered.map((u) => (
            <div key={u.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <div className="ul">{(u.namaUsaha?.[0] || "?").toUpperCase()}</div>
                {isAdmin && (
                  <button
                    className="btn bgh bsm"
                    style={{ padding: 4, color: "var(--err)" }}
                    onClick={() => onDelete(u.id)}
                    title="Hapus"
                  >
                    <Icon.Trash />
                  </button>
                )}
              </div>
              <h4 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{u.namaUsaha}</h4>
              <div style={{ marginBottom: 10 }}>
                <Badge variant="g">
                  {emoji(u.kategori)} {u.kategori}
                </Badge>
              </div>
              <p style={{ fontSize: 13, color: "var(--txm)", marginBottom: 12, lineHeight: 1.6 }}>{u.deskripsi}</p>
              {u.alamat && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12, color: "var(--txm)", marginBottom: 10 }}>
                  <Icon.Pin />
                  <span>{u.alamat}</span>
                </div>
              )}
              <div style={{ fontSize: 12, color: "var(--txm)", marginBottom: 12 }}>
                oleh <strong>{nameOf(u.alumniId)}</strong>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {u.telepon && (
                  <a
                    href={waLink(u.telepon)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn bp bsm"
                    style={{ textDecoration: "none", fontSize: 12 }}
                  >
                    <Icon.Phone /> WA
                  </a>
                )}
                {u.instagram && (
                  <a
                    href={`https://instagram.com/${u.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn bo bsm"
                    style={{ textDecoration: "none", fontSize: 12 }}
                  >
                    <Icon.IG /> IG
                  </a>
                )}
                {u.website && (
                  <a
                    href={u.website.startsWith("http") ? u.website : `https://${u.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn bo bsm"
                    style={{ textDecoration: "none", fontSize: 12 }}
                  >
                    <Icon.Globe /> Web
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
