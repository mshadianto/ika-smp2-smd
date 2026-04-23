import { useState, useMemo } from "react";
import { Icon } from "../components/Icons";
import { Badge, EmptyState, SearchBar, FilterChips } from "../components/Primitives";
import { initials, waLink } from "../utils/format";

// ============================================================
// AlumniPage - directory + detail view
// ============================================================

export function AlumniPage({ alumni, isAdmin, onRegister, onEdit, detailId, setDetailId }) {
  const [q, setQ] = useState("");
  const [ang, setAng] = useState("Semua");

  const angList = useMemo(() => ["Semua", ...[...new Set(alumni.map((a) => a.angkatan).filter(Boolean))].sort()], [alumni]);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return alumni.filter((a) => {
      const matchSearch =
        !s ||
        a.nama?.toLowerCase().includes(s) ||
        a.kota?.toLowerCase().includes(s) ||
        a.pekerjaan?.toLowerCase().includes(s);
      const matchAng = ang === "Semua" || a.angkatan === ang;
      return matchSearch && matchAng;
    });
  }, [alumni, q, ang]);

  const detail = alumni.find((a) => a.id === detailId);

  if (detail) {
    return (
      <>
        <button className="btn bgh" style={{ marginBottom: 20 }} onClick={() => setDetailId(null)}>
          <Icon.Back /> Kembali
        </button>
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 24, flexWrap: "wrap" }}>
            <div className="av av-lg">{initials(detail.nama)}</div>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700 }}>{detail.nama}</h2>
              <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                <Badge variant="b">Angkatan {detail.angkatan}</Badge>
                <Badge variant="x">Kelas {detail.kelas}</Badge>
              </div>
            </div>
          </div>
          {detail.bio && <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--txm)", marginBottom: 20, maxWidth: 600 }}>{detail.bio}</p>}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16, marginBottom: 24 }}>
            {detail.pekerjaan && (
              <InfoRow icon={<Icon.Briefcase />} bg="var(--c1p)" color="var(--c1)" label="Profesi" value={detail.pekerjaan} />
            )}
            {detail.kota && <InfoRow icon={<Icon.Pin />} bg="#FDF2D0" color="var(--c2d)" label="Domisili" value={detail.kota} />}
            {detail.telepon && (
              <InfoRow icon={<Icon.Phone />} bg="var(--skyp)" color="#1A5276" label="Telepon" value={detail.telepon} />
            )}
            {detail.email && <InfoRow icon={<Icon.Mail />} bg="#FDEDEC" color="var(--err)" label="Email" value={detail.email} />}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {isAdmin && (
              <button className="btn bo bsm" onClick={() => onEdit(detail)}>
                <Icon.Edit /> Edit
              </button>
            )}
            {detail.telepon && (
              <a href={waLink(detail.telepon)} target="_blank" rel="noopener noreferrer" className="btn bp bsm" style={{ textDecoration: "none" }}>
                <Icon.Phone /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sh">
        <div>
          <div className="st">Direktori Alumni</div>
          <div className="ss">{alumni.length} terdaftar</div>
        </div>
        <button className="btn bp" onClick={onRegister}>
          <Icon.UserPlus /> Daftar
        </button>
      </div>

      <SearchBar value={q} onChange={setQ} placeholder="Cari nama, kota, profesi..." />
      <FilterChips options={angList} value={ang} onChange={setAng} />

      {filtered.length === 0 ? (
        <EmptyState icon="🔍" title="Tidak ditemukan" description="Coba ubah kata kunci atau filter." />
      ) : (
        <div className="g2">
          {filtered.map((a) => (
            <div key={a.id} className="card" style={{ cursor: "pointer", position: "relative" }} onClick={() => setDetailId(a.id)}>
              {isAdmin && (
                <button
                  className="btn bgh bsm"
                  style={{ position: "absolute", top: 10, right: 10, padding: 4 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(a);
                  }}
                  title="Edit"
                >
                  <Icon.Edit />
                </button>
              )}
              <div className="ac">
                <div className="av">{initials(a.nama)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="an">{a.nama}</div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
                    <Badge variant="b">Angkatan {a.angkatan}</Badge>
                    <Badge variant="x">Kelas {a.kelas}</Badge>
                  </div>
                  <div className="am">
                    {a.pekerjaan && (
                      <span className="ami">
                        <Icon.Briefcase />
                        {a.pekerjaan}
                      </span>
                    )}
                    {a.kota && (
                      <span className="ami">
                        <Icon.Pin />
                        {a.kota}
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

function InfoRow({ icon, bg, color, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: bg, display: "flex", alignItems: "center", justifyContent: "center", color }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 11, color: "var(--txm)" }}>{label}</div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{value}</div>
      </div>
    </div>
  );
}
