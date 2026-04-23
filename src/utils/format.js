// ============================================================
// Utility Functions
// ============================================================

export const initials = (n) =>
  n?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

export const fmtRp = (n) =>
  n === 0 || n == null ? "Hubungi" : "Rp " + Number(n).toLocaleString("id-ID");

export const fmtDate = (d) => {
  try {
    return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return d;
  }
};

export const fmtDateTime = (d) => {
  try {
    const dt = new Date(d);
    return (
      dt.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) +
      " " +
      dt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    );
  } catch {
    return d;
  }
};

export const getMonth = (d) => {
  try {
    return new Date(d).toLocaleDateString("id-ID", { month: "short" });
  } catch {
    return "";
  }
};

export const getDay = (d) => {
  try {
    return new Date(d).getDate();
  } catch {
    return "";
  }
};

export const uid = () => Math.random().toString(36).slice(2, 10);

export const emoji = (k) =>
  ({
    Makanan: "🍽️",
    Minuman: "☕",
    Fashion: "👗",
    Jasa: "🔧",
    Elektronik: "📱",
    Kerajinan: "🎨",
    Kuliner: "🍳",
    Teknologi: "💻",
    Konstruksi: "🏗️",
    Pendidikan: "📚",
    Kesehatan: "🏥",
  }[k] || "📦");

export const timeAgo = (d) => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return "Baru saja";
  if (s < 3600) return Math.floor(s / 60) + " mnt lalu";
  if (s < 86400) return Math.floor(s / 3600) + " jam lalu";
  if (s < 2592000) return Math.floor(s / 86400) + " hari lalu";
  return fmtDate(d);
};

export const waLink = (phone) => {
  if (!phone) return "";
  return `https://wa.me/${String(phone).replace(/[^0-9]/g, "").replace(/^0/, "62")}`;
};

// Safe JSON parse
export const safeParse = (v, fallback = null) => {
  try {
    return typeof v === "string" ? JSON.parse(v) : v ?? fallback;
  } catch {
    return fallback;
  }
};

// Debounce for search inputs
export const debounce = (fn, delay = 300) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};

// Simple validator helper
export const validate = (value, rules = {}) => {
  const errors = [];
  if (rules.required && !value) errors.push("wajib diisi");
  if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors.push("format email tidak valid");
  if (rules.phone && value && !/^[0-9+\-\s()]{7,20}$/.test(value)) errors.push("format telepon tidak valid");
  if (rules.min && value && value.length < rules.min) errors.push(`minimal ${rules.min} karakter`);
  if (rules.max && value && value.length > rules.max) errors.push(`maksimal ${rules.max} karakter`);
  return errors;
};
