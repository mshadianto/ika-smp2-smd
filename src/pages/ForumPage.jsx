import { useState, useMemo } from "react";
import { Icon } from "../components/Icons";
import { Badge, EmptyState, SearchBar, FilterChips } from "../components/Primitives";
import { initials, timeAgo } from "../utils/format";
import { KAT_FORUM } from "../config/constants";

// ============================================================
// ForumPage - threads + detail view with replies
// Anyone can post; admin can delete.
// ============================================================

export function ForumPage({ threads, alumni, isAdmin, onCreateThread, onEditThread, onReply, onLikeThread, onLikeReply, onDeleteThread, viewThread, setViewThread }) {
  const [q, setQ] = useState("");
  const [kat, setKat] = useState("Semua");
  const [replyText, setReplyText] = useState("");
  const [replyAuthorId, setReplyAuthorId] = useState("");
  const [sending, setSending] = useState(false);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return threads.filter((t) => {
      const matchSearch = !s || t.judul?.toLowerCase().includes(s) || t.konten?.toLowerCase().includes(s);
      const matchKat = kat === "Semua" || t.kategori === kat;
      return matchSearch && matchKat;
    });
  }, [threads, q, kat]);

  const alumniById = (id) => alumni.find((a) => a.id === id);
  const nameOf = (id) => alumniById(id)?.nama || "Alumni";

  // Thread detail view
  if (viewThread) {
    const current = threads.find((t) => t.id === viewThread.id) || viewThread;
    const author = alumniById(current.authorId);

    const submitReply = async () => {
      if (!replyText.trim() || !replyAuthorId) return;
      setSending(true);
      try {
        await onReply(current.id, { authorId: replyAuthorId, konten: replyText.trim() });
        setReplyText("");
      } finally {
        setSending(false);
      }
    };

    return (
      <>
        <button className="btn bgh" style={{ marginBottom: 20 }} onClick={() => setViewThread(null)}>
          <Icon.Back /> Kembali ke Forum
        </button>

        <div className={`fc${current.pinned ? " pin" : ""}`}>
          <div className="fhd" style={{ cursor: "default" }}>
            <div className="fme">
              {current.pinned && (
                <Badge variant="y" icon={<Icon.PinTack />}>
                  Disematkan
                </Badge>
              )}
              <Badge variant="s">{current.kategori}</Badge>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, marginBottom: 12, color: "var(--c1)" }}>
              {current.judul}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div className="av av-sm">{initials(author?.nama)}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{author?.nama || "Alumni"}</div>
                <div style={{ fontSize: 11, color: "var(--txl)" }}>{timeAgo(current.created)}</div>
              </div>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "var(--tx)" }}>{current.konten}</div>
            <div className="fsts" style={{ marginTop: 16 }}>
              <button className="fst" onClick={() => onLikeThread(current.id, current.likes)}>
                <Icon.Heart /> {current.likes || 0}
              </button>
              <span className="fst">
                <Icon.MsgCircle /> {(current.replies || []).length} balasan
              </span>
              {isAdmin && (
                <>
                  <button
                    className="fst"
                    style={{ marginLeft: "auto" }}
                    onClick={() => onEditThread(current)}
                  >
                    <Icon.Edit /> Edit
                  </button>
                  <button
                    className="fst"
                    style={{ color: "var(--err)" }}
                    onClick={() => {
                      if (confirm("Hapus topik ini?")) {
                        onDeleteThread(current.id);
                        setViewThread(null);
                      }
                    }}
                  >
                    <Icon.Trash /> Hapus
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="rbox">
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: "var(--c1)" }}>
              {(current.replies || []).length} Balasan
            </div>
            {(current.replies || []).map((r) => {
              const rAuthor = alumniById(r.authorId);
              return (
                <div key={r.id} className="ri">
                  <div className="av av-sm">{initials(rAuthor?.nama)}</div>
                  <div className="rc">
                    <div className="ra">{rAuthor?.nama || "Alumni"}</div>
                    <div className="rtx">{r.konten}</div>
                    <div className="rtm">
                      <span>{timeAgo(r.created)}</span>
                      <button
                        style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 4, cursor: "pointer", color: "var(--txm)", fontFamily: "inherit", fontSize: 11 }}
                        onClick={() => onLikeReply(current.id, r.id, r.likes)}
                      >
                        <Icon.Heart /> {r.likes || 0}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <div style={{ marginTop: 16 }}>
              <select
                className="fs"
                value={replyAuthorId}
                onChange={(e) => setReplyAuthorId(e.target.value)}
                style={{ marginBottom: 10 }}
              >
                <option value="">Balas sebagai...</option>
                {alumni.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nama}
                  </option>
                ))}
              </select>
              <div className="riw">
                <textarea
                  className="rin"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Tulis balasan..."
                  disabled={!replyAuthorId}
                />
                <button
                  className="sndb"
                  disabled={!replyText.trim() || !replyAuthorId || sending}
                  onClick={submitReply}
                  title="Kirim"
                >
                  <Icon.Send />
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sh">
        <div>
          <div className="st">Forum Alumni</div>
          <div className="ss">{threads.length} topik diskusi</div>
        </div>
        <button className="btn bp" onClick={onCreateThread}>
          <Icon.Plus /> Topik Baru
        </button>
      </div>

      <SearchBar value={q} onChange={setQ} placeholder="Cari topik..." />
      <FilterChips options={KAT_FORUM} value={kat} onChange={setKat} />

      {filtered.length === 0 ? (
        <EmptyState
          icon="💬"
          title="Belum ada topik"
          description="Mulai diskusi pertama bersama keluarga alumni."
          action={
            <button className="btn bp" onClick={onCreateThread}>
              <Icon.Plus /> Buat Topik
            </button>
          }
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((t) => (
            <div key={t.id} className={`fc${t.pinned ? " pin" : ""}`} style={{ position: "relative" }}>
              {isAdmin && (
                <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 4, zIndex: 1 }}>
                  <button
                    className="btn bgh bsm"
                    style={{ padding: 4 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditThread(t);
                    }}
                    title="Edit"
                  >
                    <Icon.Edit />
                  </button>
                  <button
                    className="btn bgh bsm"
                    style={{ padding: 4, color: "var(--err)" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Hapus topik "${t.judul}"?`)) onDeleteThread(t.id);
                    }}
                    title="Hapus"
                  >
                    <Icon.Trash />
                  </button>
                </div>
              )}
              <div className="fhd" onClick={() => setViewThread(t)}>
                <div className="fme">
                  {t.pinned && (
                    <Badge variant="y" icon={<Icon.PinTack />}>
                      Disematkan
                    </Badge>
                  )}
                  <Badge variant="s">{t.kategori}</Badge>
                </div>
                <div className="ftitle">{t.judul}</div>
                <div className="fexc">{t.konten}</div>
                <div className="fsts">
                  <span className="fst">
                    <Icon.Heart /> {t.likes || 0}
                  </span>
                  <span className="fst">
                    <Icon.MsgCircle /> {(t.replies || []).length}
                  </span>
                  <span className="fst">
                    <Icon.Clock /> {timeAgo(t.created)}
                  </span>
                  <span className="fst">
                    oleh <strong style={{ marginLeft: 2 }}>{nameOf(t.authorId)}</strong>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
