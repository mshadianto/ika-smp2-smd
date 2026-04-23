import { useState, useMemo } from "react";
import { Icon } from "../components/Icons";
import { Badge, EmptyState, FilterChips } from "../components/Primitives";
import { Lightbox } from "../components/Forms";
import { fmtDate } from "../utils/format";
import { KAT_GALLERY } from "../config/constants";

// ============================================================
// GalleryPage - album grid + lightbox
// Anyone can upload; admin can delete.
// ============================================================

export function GalleryPage({ albums, alumni, isAdmin, onCreate, onDelete }) {
  const [kat, setKat] = useState("Semua");
  const [openAlbum, setOpenAlbum] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const filtered = useMemo(() => {
    return albums.filter((g) => kat === "Semua" || g.album === kat);
  }, [albums, kat]);

  const nameOf = (id) => alumni.find((a) => a.id === id)?.nama || "Alumni";

  // Album detail view
  if (openAlbum) {
    const album = albums.find((g) => g.id === openAlbum);
    if (!album) {
      setOpenAlbum(null);
      return null;
    }
    return (
      <>
        <button className="btn bgh" style={{ marginBottom: 20 }} onClick={() => setOpenAlbum(null)}>
          <Icon.Back /> Kembali ke Gallery
        </button>
        <div className="sh">
          <div>
            <div className="st">{album.judul}</div>
            <div className="ss">
              {album.photos?.length || 0} foto · {fmtDate(album.tanggal)} · oleh {nameOf(album.uploadBy)}
            </div>
          </div>
          {isAdmin && (
            <button
              className="btn bdng bsm"
              onClick={() => {
                if (confirm(`Hapus album "${album.judul}"?`)) {
                  onDelete(album.id);
                  setOpenAlbum(null);
                }
              }}
            >
              <Icon.Trash /> Hapus Album
            </button>
          )}
        </div>

        {album.deskripsi && (
          <p style={{ fontSize: 14, color: "var(--txm)", marginBottom: 20, maxWidth: 600 }}>{album.deskripsi}</p>
        )}

        <div className="gal-view">
          {(album.photos || []).map((p, i) => (
            <div
              key={p.id}
              className="gal-th"
              style={{ background: p.imageUrl ? `url(${p.imageUrl}) center/cover` : p.color }}
              onClick={() => setLightboxIdx(i)}
            >
              {!p.imageUrl && "📷"}
              {p.caption && <div className="cap">{p.caption}</div>}
            </div>
          ))}
        </div>

        {lightboxIdx !== null && (
          <Lightbox
            photos={album.photos}
            index={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
            onNav={(dir) => {
              const next = lightboxIdx + dir;
              if (next >= 0 && next < album.photos.length) setLightboxIdx(next);
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="sh">
        <div>
          <div className="st">Gallery</div>
          <div className="ss">{albums.length} album · {albums.reduce((s, g) => s + (g.photos?.length || 0), 0)} foto</div>
        </div>
        <button className="btn bp" onClick={onCreate}>
          <Icon.Camera /> Upload Album
        </button>
      </div>

      <FilterChips options={KAT_GALLERY} value={kat} onChange={setKat} />

      {filtered.length === 0 ? (
        <EmptyState
          icon="📸"
          title="Belum ada album"
          description="Upload foto kenangan dan kegiatan alumni."
          action={
            <button className="btn bp" onClick={onCreate}>
              <Icon.Camera /> Upload
            </button>
          }
        />
      ) : (
        <div className="gal-grid">
          {filtered.map((g) => {
            const previews = (g.photos || []).slice(0, 4);
            return (
              <div key={g.id} className="gal-card" onClick={() => setOpenAlbum(g.id)}>
                <div className="gal-prev">
                  {previews.map((p, i) => (
                    <div
                      key={p.id}
                      style={{ background: p.imageUrl ? `url(${p.imageUrl}) center/cover` : p.color }}
                    >
                      {!p.imageUrl && "📷"}
                      {i === 3 && g.photos.length > 4 && <div className="gal-cnt">+{g.photos.length - 4}</div>}
                    </div>
                  ))}
                </div>
                <div className="gal-info">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 4 }}>
                    <h4>{g.judul}</h4>
                    <Badge variant="p">{g.album}</Badge>
                  </div>
                  <p>
                    {g.photos?.length || 0} foto · {fmtDate(g.tanggal)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
