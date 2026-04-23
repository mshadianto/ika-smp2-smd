import { useEffect } from "react";
import { Icon } from "./Icons";

// ============================================================
// Shared Primitive Components
// ============================================================

export function Toast({ msg, type = "ok", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`toast ${type}`}>
      <Icon.Check />
      {msg}
    </div>
  );
}

export function Modal({ title, onClose, children, footer, wide }) {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="mo" onClick={onClose}>
      <div className={`modal${wide ? " wide" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="mh">
          <h3>{title}</h3>
          <button className="mc" onClick={onClose} aria-label="Tutup">
            <Icon.X />
          </button>
        </div>
        <div className="mb">{children}</div>
        {footer && <div className="mf">{footer}</div>}
      </div>
    </div>
  );
}

export function EmptyState({ icon = "📭", title = "Belum ada data", description, action }) {
  return (
    <div className="empty">
      <div className="ej">{icon}</div>
      <h4>{title}</h4>
      {description && <p>{description}</p>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

export function Spinner({ label = "Memuat..." }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div className="spinner" />
      <p style={{ marginTop: 14, color: "var(--txm)", fontSize: 13 }}>{label}</p>
    </div>
  );
}

export function InfoBanner({ variant = "info", children, icon }) {
  const iconMap = {
    info: <Icon.Info />,
    warn: <Icon.Info />,
    err: <Icon.Info />,
  };
  return (
    <div className={`info-banner${variant !== "info" ? " " + variant : ""}`}>
      {icon || iconMap[variant]}
      <div>{children}</div>
    </div>
  );
}

export function Badge({ variant = "b", children, icon }) {
  return (
    <span className={`badge bdg-${variant}`} style={icon ? { display: "flex", alignItems: "center", gap: 3 } : undefined}>
      {icon}
      {children}
    </span>
  );
}

export function SearchBar({ value, onChange, placeholder = "Cari..." }) {
  return (
    <div className="sb" style={{ marginBottom: 16 }}>
      <span className="si">
        <Icon.Search />
      </span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

export function FilterChips({ options, value, onChange, icon }) {
  return (
    <div className="chips">
      {options.map((o) => (
        <button key={o} className={`chip${value === o ? " on" : ""}`} onClick={() => onChange(o)}>
          {icon ? icon(o) : o}
        </button>
      ))}
    </div>
  );
}
