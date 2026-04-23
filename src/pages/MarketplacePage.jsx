import { useState, useMemo } from "react";
import { Icon } from "../components/Icons";
import { Badge, EmptyState, SearchBar, FilterChips, InfoBanner } from "../components/Primitives";
import { fmtRp, waLink, emoji } from "../utils/format";
import { KAT_MARKET } from "../config/constants";

// ============================================================
// MarketplacePage
// Admin-only write. Public sees read-only grid.
// ============================================================

export function MarketplacePage({ items, alumni, isAdmin, onCreate, onEdit, onDelete, onOpenLogin }) {
  const [q, setQ] = useState("");
  const [kat, setKat] = useState("Semua");

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return items.filter((m) => {
      const matchSearch = !s || m.judul?.toLowerCase().includes(s) || m.deskripsi?.toLowerCase().includes(s);
      const matchKat = kat === "Semua" || m.kategori === kat;
      return matchSearch && matchKat;
    });
  }, [items, q, kat]);

  const nameOf = (id) => alumni.find((a) => a.id === id)?.nama || "Alumni";

  return (
    <>
      <div className="sh">
        <div>
          <div className="st">Marketplace Alumni</div>
          <div className="ss">Produk & jasa dari keluarga alumni</div>
        </div>
        {isAdmin ? (
          <button className="btn ba" onClick={onCreate}>
            <Icon.Plus /> Tambah Produk
          </button>
        ) : (
          <button className="btn bo bsm" onClick={onOpenLogin}>
            <Icon.Lock /> Login Admin
          </button>
        )}
      </div>

      {!isAdmin && (
        <InfoBanner>
          <strong>Mode Baca Saja</strong>
          <br />
          Marketplace sementara hanya dapat dikelola oleh admin. Anda dapat melihat produk dan menghubungi penjual langsung via WhatsApp.
        </InfoBanner>
      )}

      <SearchBar value={q} onChange={setQ} placeholder="Cari produk atau jasa..." />
      <FilterChips
        options={KAT_MARKET}
        value={kat}
        onChange={setKat}
        icon={(k) => (k === "Semua" ? "🏷️ Semua" : `${emoji(k)} ${k}`)}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon="🛒"
          title="Belum ada produk"
          description={isAdmin ? "Klik tombol 'Tambah Produk' untuk menambahkan." : "Produk akan ditampilkan di sini."}
          action={
            isAdmin ? (
              <button className="btn bp" onClick={onCreate}>
                <Icon.Plus /> Tambah
              </button>
            ) : null
          }
        />
      ) : (
        <div className="g3">
          {filtered.map((m) => (
            <div key={m.id} className="card">
              <div className="mi">
                <span>{emoji(m.kategori)}</span>
                <div className="mp">{fmtRp(m.harga)}</div>
              </div>
              <div className="card-b">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 6 }}>
                  <Badge variant="y">{m.kategori}</Badge>
                  {isAdmin && (
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn bgh bsm" style={{ padding: 4 }} onClick={() => onEdit(m)} title="Edit">
                        <Icon.Edit />
                      </button>
                      <button
                        className="btn bgh bsm"
                        style={{ padding: 4, color: "var(--err)" }}
                        onClick={() => onDelete(m.id)}
                        title="Hapus"
                      >
                        <Icon.Trash />
                      </button>
                    </div>
                  )}
                </div>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{m.judul}</h4>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--txm)",
                    marginBottom: 10,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {m.deskripsi}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "var(--txm)" }}>
                    oleh <strong>{nameOf(m.alumniId)}</strong>
                  </span>
                  {m.kontak && (
                    <a
                      href={waLink(m.kontak)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn bp bsm"
                      style={{ textDecoration: "none", padding: "5px 12px", fontSize: 12 }}
                    >
                      <Icon.Phone /> Hubungi
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
