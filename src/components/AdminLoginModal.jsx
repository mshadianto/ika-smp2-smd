import { useState } from "react";
import { Modal, InfoBanner } from "./Primitives";
import { Icon } from "./Icons";
import { isAdminEmail } from "../config/auth";
import { USE_SUPABASE } from "../config/supabase";

// ============================================================
// Admin Login Modal (magic link via Supabase)
// ============================================================

export function AdminLoginModal({ onClose, onSuccess, signIn }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const submit = async () => {
    setLoading(true);
    setResult(null);
    const trimmed = email.trim().toLowerCase();

    if (!isAdminEmail(trimmed)) {
      setResult({ type: "err", msg: "Email tidak terdaftar sebagai admin." });
      setLoading(false);
      return;
    }

    const res = await signIn(trimmed);
    setLoading(false);

    if (res.ok) {
      if (res.mode === "local") {
        setResult({ type: "ok", msg: "Berhasil masuk (mode lokal)." });
        setTimeout(() => onSuccess?.(), 800);
      } else {
        setResult({ type: "ok", msg: `Magic link dikirim ke ${trimmed}. Cek email Anda dan klik link untuk login.` });
      }
    } else {
      setResult({ type: "err", msg: res.error || "Gagal mengirim magic link" });
    }
  };

  return (
    <Modal
      title="Login Admin"
      onClose={onClose}
      footer={
        <>
          <button className="btn bo" onClick={onClose}>
            Batal
          </button>
          <button className="btn bp" onClick={submit} disabled={loading || !email}>
            {loading ? "Mengirim..." : "Kirim Magic Link"}
          </button>
        </>
      }
    >
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "var(--c1p)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
            color: "var(--c1)",
          }}
        >
          <Icon.Shield />
        </div>
        <p style={{ color: "var(--txm)", fontSize: 14 }}>
          Area admin untuk mengelola marketplace dan moderasi. Hanya email yang terdaftar sebagai admin yang dapat masuk.
        </p>
      </div>

      <div className="fg">
        <label className="fl">Email Admin</label>
        <input
          className="fi"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@email.com"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
      </div>

      {!USE_SUPABASE && (
        <InfoBanner variant="warn">
          <strong>Mode Lokal Aktif</strong>
          <br />
          Supabase belum terkonfigurasi. Admin akan diautentikasi secara lokal via whitelist email.
        </InfoBanner>
      )}

      {result && (
        <div
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 8,
            background: result.type === "ok" ? "var(--grnp)" : "#FDEDEC",
            color: result.type === "ok" ? "var(--grn)" : "var(--err)",
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          {result.msg}
        </div>
      )}

      <p style={{ fontSize: 12, color: "var(--txl)", marginTop: 16, textAlign: "center" }}>
        Pengunjung umum dapat melihat semua konten tanpa login.
      </p>
    </Modal>
  );
}
