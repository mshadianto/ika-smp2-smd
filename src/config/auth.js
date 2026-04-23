// ============================================================
// Admin Configuration
// ============================================================
// Admin emails have write access to marketplace and moderation
// powers across forum, gallery, and events.
// ============================================================

export const ADMIN_EMAILS = [
  "sopian.hadianto@gmail.com",
  "firman20@yahoo.com",
];

export const isAdminEmail = (email) => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(String(email).toLowerCase().trim());
};

// Capability matrix — single source of truth for permissions
export const CAPABILITIES = {
  MARKET_CREATE: "market:create",
  MARKET_UPDATE: "market:update",
  MARKET_DELETE: "market:delete",
  FORUM_PIN: "forum:pin",
  FORUM_DELETE: "forum:delete",
  GALLERY_DELETE: "gallery:delete",
  EVENT_CREATE: "event:create",
  EVENT_UPDATE: "event:update",
  ALUMNI_DELETE: "alumni:delete",
  UMKM_DELETE: "umkm:delete",
};

// Role → capability mapping
const ROLE_CAPS = {
  admin: Object.values(CAPABILITIES), // all
  member: [],                          // registered alumni — minimal
  guest: [],                           // public — read only
};

export const hasCapability = (role, cap) => {
  const caps = ROLE_CAPS[role] || [];
  return caps.includes(cap);
};

export const getUserRole = (user) => {
  if (!user || !user.email) return "guest";
  if (isAdminEmail(user.email)) return "admin";
  return "member";
};
