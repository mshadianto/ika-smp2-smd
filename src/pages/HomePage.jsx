import { Icon } from "../components/Icons";
import { initials, timeAgo } from "../utils/format";
import { HERO_VIDEO_ID } from "../config/constants";
import { Badge } from "../components/Primitives";

// ============================================================
// HomePage / Landing
// ============================================================

export function HomePage({ alumni, market, umkm, events, gallery, forum, logoUrl, onNavigate, onRegister, onViewThread }) {
  const LogoHero = () =>
    logoUrl ? (
      <img src={logoUrl} alt="IKA" className="hero-logo" />
    ) : (
      <div
        className="hero-logo"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--c2)",
          fontFamily: "'Playfair Display',serif",
          fontWeight: 800,
          fontSize: 28,
        }}
      >
        IKA
      </div>
    );

  const photoCount = gallery.reduce((s, g) => s + (g.photos?.length || 0), 0);
  const alumniByName = (id) => alumni.find((a) => a.id === id)?.nama || "Alumni";

  return (
    <>
      <section className="hero">
        <div className="hero-c">
          <LogoHero />
          <div className="hero-text">
            <h2>
              Selamat Datang,
              <br />
              Keluarga Alumni!
            </h2>
            <p>
              Platform resmi Ikatan Keluarga Alumni SMP Negeri 2 Samarinda. Hubungkan silaturahmi, bangun jaringan, dan dukung UMKM sesama
              alumni.
            </p>
            <div className="hero-s">
              <div>
                <div className="n">{alumni.length}</div>
                <div className="l">Alumni</div>
              </div>
              <div>
                <div className="n">{umkm.length}</div>
                <div className="l">UMKM</div>
              </div>
              <div>
                <div className="n">{photoCount}</div>
                <div className="l">Foto</div>
              </div>
              <div>
                <div className="n">{forum.length}</div>
                <div className="l">Topik</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="sgrid">
        <div className="sc" onClick={onRegister}>
          <div className="sci c-nv">
            <Icon.UserPlus />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Daftar Alumni</div>
            <div style={{ fontSize: 12, color: "var(--txm)" }}>Input data Anda</div>
          </div>
        </div>
        <div className="sc" onClick={() => onNavigate("marketplace")}>
          <div className="sci c-gd">
            <Icon.Shop />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Marketplace</div>
            <div style={{ fontSize: 12, color: "var(--txm)" }}>{market.length} produk</div>
          </div>
        </div>
        <div className="sc" onClick={() => onNavigate("gallery")}>
          <div className="sci c-pr">
            <Icon.Image />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Gallery</div>
            <div style={{ fontSize: 12, color: "var(--txm)" }}>{gallery.length} album</div>
          </div>
        </div>
        <div className="sc" onClick={() => onNavigate("forum")}>
          <div className="sci c-sk">
            <Icon.Chat />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Forum</div>
            <div style={{ fontSize: 12, color: "var(--txm)" }}>{forum.length} topik</div>
          </div>
        </div>
        <div className="sc" onClick={() => onNavigate("umkm")}>
          <div className="sci c-gn">
            <Icon.Store />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>UMKM</div>
            <div style={{ fontSize: 12, color: "var(--txm)" }}>{umkm.length} usaha</div>
          </div>
        </div>
        <div className="sc" onClick={() => onNavigate("events")}>
          <div className="sci c-rd">
            <Icon.Cal />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Agenda</div>
            <div style={{ fontSize: 12, color: "var(--txm)" }}>{events.length} acara</div>
          </div>
        </div>
      </div>

      {/* Video section */}
      <div style={{ marginBottom: 32 }}>
        <div className="sh">
          <div>
            <div className="st">Video Keluarga Alumni</div>
            <div className="ss">Kenangan & kegiatan IKA SMPN 2 Samarinda</div>
          </div>
        </div>
        <div className="video-wrap">
          <div className="video-ratio">
            <iframe
              src={`https://www.youtube.com/embed/${HERO_VIDEO_ID}`}
              title="Video IKA SMPN 2 Samarinda"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      {/* Recent forum */}
      <div className="sh">
        <div>
          <div className="st">Diskusi Terbaru</div>
          <div className="ss">Topik hangat di forum</div>
        </div>
        <button className="btn bo bsm" onClick={() => onNavigate("forum")}>
          Ke Forum →
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        {forum.slice(0, 3).map((f) => (
          <div
            key={f.id}
            className={`fc${f.pinned ? " pin" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => onViewThread(f)}
          >
            <div className="fhd">
              <div className="fme">
                {f.pinned && (
                  <Badge variant="y" icon={<Icon.PinTack />}>
                    Disematkan
                  </Badge>
                )}
                <Badge variant="s">{f.kategori}</Badge>
              </div>
              <div className="ftitle">{f.judul}</div>
              <div className="fexc">{f.konten}</div>
              <div className="fsts">
                <span className="fst">
                  <Icon.Heart />
                  {f.likes}
                </span>
                <span className="fst">
                  <Icon.MsgCircle />
                  {(f.replies || []).length}
                </span>
                <span className="fst">
                  <Icon.Clock />
                  {timeAgo(f.created)}
                </span>
                <span className="fst">
                  oleh <strong style={{ marginLeft: 2 }}>{alumniByName(f.authorId)}</strong>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent alumni */}
      <div className="sh">
        <div>
          <div className="st">Alumni Terbaru</div>
        </div>
        <button className="btn bo bsm" onClick={() => onNavigate("alumni")}>
          Lihat Semua →
        </button>
      </div>
      <div className="g2" style={{ marginBottom: 32 }}>
        {alumni.slice(0, 4).map((a) => (
          <div key={a.id} className="card" style={{ cursor: "pointer" }} onClick={() => onNavigate("alumni")}>
            <div className="ac">
              <div className="av">{initials(a.nama)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="an">{a.nama}</div>
                <Badge variant="b">Angkatan {a.angkatan}</Badge>
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
    </>
  );
}
