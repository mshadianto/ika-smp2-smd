import { Icon } from "./Icons";

// ============================================================
// Header Component
// ============================================================

export function Header({ page, onNavigate, navItems, mobileOpen, toggleMobile, logoUrl, user, isAdmin, onOpenLogin, onSignOut }) {
  const LogoImg = () =>
    logoUrl ? (
      <img src={logoUrl} alt="IKA SMPN 2" className="logo-img" />
    ) : (
      <div
        className="logo-img"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--c2)",
          fontFamily: "'Playfair Display',serif",
          fontWeight: 800,
          fontSize: 16,
        }}
      >
        IKA
      </div>
    );

  return (
    <header className="hdr">
      <div className="hdr-in">
        <div className="logo-area" onClick={() => onNavigate("home")}>
          <LogoImg />
          <div className="logo-txt">
            <h1>IKA SMPN 2 Samarinda</h1>
            <span>Ikatan Keluarga Alumni</span>
          </div>
        </div>

        <nav className="nav-d">
          {navItems.map((n) => (
            <button key={n.id} className={`nb${page === n.id ? " on" : ""}`} onClick={() => onNavigate(n.id)}>
              {n.icon}
              {n.label}
            </button>
          ))}
        </nav>

        <div className="hdr-actions">
          {isAdmin && (
            <span className="admin-pill">
              <Icon.Shield />
              ADMIN
            </span>
          )}
          {user ? (
            <button className="hdr-btn" onClick={onSignOut} title={user.email}>
              <Icon.LogOut />
              <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis" }}>Keluar</span>
            </button>
          ) : (
            <button className="hdr-btn" onClick={onOpenLogin}>
              <Icon.Lock />
              Admin Login
            </button>
          )}
          <button className="mmb" onClick={toggleMobile} aria-label="Menu">
            <Icon.Menu />
          </button>
        </div>
      </div>

      <nav className={`mnav${mobileOpen ? " open" : ""}`}>
        {navItems.map((n) => (
          <button key={n.id} className={`nb${page === n.id ? " on" : ""}`} onClick={() => onNavigate(n.id)}>
            {n.icon}
            {n.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
