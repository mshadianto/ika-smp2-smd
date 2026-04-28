import { useEffect, useState } from "react";
import "./styles.css";

import { useAuth } from "./hooks/useAuth";
import { useCollection } from "./hooks/useCollection";
import { useToast } from "./hooks/useToast";

import { alumniService, marketService, umkmService, eventService, galleryService, forumService } from "./services/entities";
import { CAPABILITIES } from "./config/auth";

import { Header } from "./components/Header";
import { Toast, Spinner } from "./components/Primitives";
import { Icon } from "./components/Icons";
import { AdminLoginModal } from "./components/AdminLoginModal";
import { AlumniForm, MarketForm, UmkmForm, GalleryForm, ForumThreadForm, EventForm } from "./components/Forms";

import { HomePage } from "./pages/HomePage";
import { AlumniPage } from "./pages/AlumniPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { UmkmPage } from "./pages/UmkmPage";
import { GalleryPage } from "./pages/GalleryPage";
import { ForumPage } from "./pages/ForumPage";
import { EventsPage } from "./pages/EventsPage";
import { AboutPage } from "./pages/AboutPage";

import logoAsset from "./assets/logo-ika.png";

// ============================================================
// Main Application
// ============================================================

const NAV_ITEMS = [
  { id: "home", label: "Beranda", icon: <Icon.Home /> },
  { id: "alumni", label: "Alumni", icon: <Icon.Users /> },
  { id: "marketplace", label: "Marketplace", icon: <Icon.Shop /> },
  { id: "umkm", label: "UMKM", icon: <Icon.Store /> },
  { id: "gallery", label: "Gallery", icon: <Icon.Image /> },
  { id: "forum", label: "Forum", icon: <Icon.Chat /> },
  { id: "events", label: "Agenda", icon: <Icon.Cal /> },
  { id: "about", label: "Tentang", icon: <Icon.Info /> },
];

export default function App() {
  // --- Auth ---
  const { user, isAdmin, loading: authLoading, can, signIn, signOut } = useAuth();

  // --- Collections (Supabase or local fallback) ---
  const alumni = useCollection(alumniService);
  const market = useCollection(marketService);
  const umkm = useCollection(umkmService);
  const events = useCollection(eventService);
  const gallery = useCollection(galleryService);
  const forum = useCollection(forumService);

  // --- UI State ---
  const [page, setPage] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [alumniDetailId, setAlumniDetailId] = useState(null);
  const [viewThread, setViewThread] = useState(null);

  // --- Modal state ---
  const [showLogin, setShowLogin] = useState(false);
  const [showAlumniForm, setShowAlumniForm] = useState(false);
  const [editAlumni, setEditAlumni] = useState(null);
  const [showMarketForm, setShowMarketForm] = useState(false);
  const [editMarket, setEditMarket] = useState(null);
  const [showUmkmForm, setShowUmkmForm] = useState(false);
  const [editUmkm, setEditUmkm] = useState(null);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [editGallery, setEditGallery] = useState(null);
  const [showForumForm, setShowForumForm] = useState(false);
  const [editThread, setEditThread] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  // --- Toast ---
  const { toast, showToast, hideToast } = useToast();

  // --- Logo loading ---
  const [logoUrl, setLogoUrl] = useState(null);
  useEffect(() => {
    // Vite imports the asset as a URL string — use directly
    if (typeof logoAsset === "string") {
      setLogoUrl(logoAsset);
    } else {
      fetch(logoAsset)
        .then((r) => r.blob())
        .then((b) => setLogoUrl(URL.createObjectURL(b)))
        .catch(() => {});
    }
  }, []);

  // --- Navigation helper ---
  const navigate = (pageId) => {
    setPage(pageId);
    setMobileOpen(false);
    setAlumniDetailId(null);
    setViewThread(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- Loading fallback ---
  if (authLoading) {
    return (
      <div className="app">
        <div className="main" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <Spinner label="Memuat portal..." />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        page={page}
        onNavigate={navigate}
        navItems={NAV_ITEMS}
        mobileOpen={mobileOpen}
        toggleMobile={() => setMobileOpen((v) => !v)}
        logoUrl={logoUrl}
        user={user}
        isAdmin={isAdmin}
        onOpenLogin={() => setShowLogin(true)}
        onSignOut={async () => {
          await signOut();
          showToast("Berhasil keluar", "ok");
        }}
      />

      <main className="main">
        {page === "home" && (
          <HomePage
            alumni={alumni.data}
            market={market.data}
            umkm={umkm.data}
            events={events.data}
            gallery={gallery.data}
            forum={forum.data}
            logoUrl={logoUrl}
            onNavigate={navigate}
            onRegister={() => {
              setEditAlumni(null);
              setShowAlumniForm(true);
            }}
            onViewThread={(t) => {
              setPage("forum");
              setViewThread(t);
            }}
          />
        )}

        {page === "alumni" && (
          <AlumniPage
            alumni={alumni.data}
            isAdmin={isAdmin}
            detailId={alumniDetailId}
            setDetailId={setAlumniDetailId}
            onRegister={() => {
              setEditAlumni(null);
              setShowAlumniForm(true);
            }}
            onEdit={(a) => {
              setEditAlumni(a);
              setShowAlumniForm(true);
            }}
          />
        )}

        {page === "marketplace" && (
          <MarketplacePage
            items={market.data}
            alumni={alumni.data}
            isAdmin={isAdmin}
            onCreate={() => {
              setEditMarket(null);
              setShowMarketForm(true);
            }}
            onEdit={(m) => {
              setEditMarket(m);
              setShowMarketForm(true);
            }}
            onDelete={async (id) => {
              if (!can(CAPABILITIES.MARKET_DELETE)) {
                showToast("Hanya admin yang dapat menghapus produk", "err");
                return;
              }
              if (!confirm("Hapus produk ini?")) return;
              await market.remove(id);
              showToast("Produk dihapus");
            }}
            onOpenLogin={() => setShowLogin(true)}
          />
        )}

        {page === "umkm" && (
          <UmkmPage
            items={umkm.data}
            alumni={alumni.data}
            isAdmin={isAdmin}
            onCreate={() => {
              setEditUmkm(null);
              setShowUmkmForm(true);
            }}
            onEdit={(u) => {
              setEditUmkm(u);
              setShowUmkmForm(true);
            }}
            onDelete={async (id) => {
              if (!can(CAPABILITIES.UMKM_DELETE)) {
                showToast("Hanya admin yang dapat menghapus", "err");
                return;
              }
              if (!confirm("Hapus UMKM ini?")) return;
              await umkm.remove(id);
              showToast("UMKM dihapus");
            }}
          />
        )}

        {page === "gallery" && (
          <GalleryPage
            albums={gallery.data}
            alumni={alumni.data}
            isAdmin={isAdmin}
            onCreate={() => {
              setEditGallery(null);
              setShowGalleryForm(true);
            }}
            onEdit={(g) => {
              setEditGallery(g);
              setShowGalleryForm(true);
            }}
            onDelete={async (id) => {
              if (!can(CAPABILITIES.GALLERY_DELETE)) {
                showToast("Hanya admin yang dapat menghapus album", "err");
                return;
              }
              await gallery.remove(id);
              showToast("Album dihapus");
            }}
          />
        )}

        {page === "forum" && (
          <ForumPage
            threads={forum.data}
            alumni={alumni.data}
            isAdmin={isAdmin}
            viewThread={viewThread}
            setViewThread={setViewThread}
            onCreateThread={() => {
              setEditThread(null);
              setShowForumForm(true);
            }}
            onEditThread={(t) => {
              setEditThread(t);
              setShowForumForm(true);
            }}
            onReply={async (threadId, reply) => {
              const r = await forumService.addReply(threadId, reply);
              forum.refresh();
              showToast("Balasan terkirim");
              return r;
            }}
            onLikeThread={async (threadId, currentLikes) => {
              await forumService.likeThread(threadId, currentLikes);
              forum.refresh();
            }}
            onLikeReply={async (threadId, replyId, currentLikes) => {
              await forumService.likeReply(threadId, replyId, currentLikes);
              forum.refresh();
            }}
            onDeleteThread={async (id) => {
              if (!can(CAPABILITIES.FORUM_DELETE)) {
                showToast("Hanya admin yang dapat menghapus topik", "err");
                return;
              }
              await forumService.remove(id);
              forum.refresh();
              showToast("Topik dihapus");
            }}
          />
        )}

        {page === "about" && <AboutPage logoUrl={logoUrl} />}

        {page === "events" && (
          <EventsPage
            items={events.data}
            isAdmin={isAdmin}
            onCreate={() => {
              if (!can(CAPABILITIES.EVENT_CREATE)) {
                showToast("Hanya admin yang dapat menambah agenda", "err");
                return;
              }
              setEditEvent(null);
              setShowEventForm(true);
            }}
            onEdit={(e) => {
              if (!can(CAPABILITIES.EVENT_UPDATE)) {
                showToast("Hanya admin yang dapat mengedit agenda", "err");
                return;
              }
              setEditEvent(e);
              setShowEventForm(true);
            }}
            onDelete={async (id) => {
              if (!isAdmin) return;
              await events.remove(id);
              showToast("Agenda dihapus");
            }}
            onOpenLogin={() => setShowLogin(true)}
          />
        )}
      </main>

      {/* ===== Modals ===== */}
      {showLogin && (
        <AdminLoginModal
          signIn={signIn}
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            setShowLogin(false);
            showToast("Login berhasil", "ok");
          }}
        />
      )}

      {showAlumniForm && (
        <AlumniForm
          item={editAlumni}
          onClose={() => {
            setShowAlumniForm(false);
            setEditAlumni(null);
          }}
          onSave={async (item) => {
            if (editAlumni) {
              await alumni.update(item.id, item);
              showToast("Data alumni diperbarui");
            } else {
              await alumni.create(item);
              showToast("Registrasi berhasil");
            }
          }}
        />
      )}

      {showMarketForm && isAdmin && (
        <MarketForm
          item={editMarket}
          alumni={alumni.data}
          onClose={() => {
            setShowMarketForm(false);
            setEditMarket(null);
          }}
          onSave={async (item) => {
            if (editMarket) {
              await market.update(item.id, item);
              showToast("Produk diperbarui");
            } else {
              await market.create(item);
              showToast("Produk ditambahkan");
            }
          }}
        />
      )}

      {showUmkmForm && (
        <UmkmForm
          item={editUmkm}
          alumni={alumni.data}
          onClose={() => {
            setShowUmkmForm(false);
            setEditUmkm(null);
          }}
          onSave={async (item) => {
            if (editUmkm) {
              await umkm.update(item.id, item);
              showToast("UMKM diperbarui");
            } else {
              await umkm.create(item);
              showToast("UMKM terdaftar");
            }
          }}
        />
      )}

      {showGalleryForm && (
        <GalleryForm
          item={editGallery}
          alumni={alumni.data}
          onClose={() => {
            setShowGalleryForm(false);
            setEditGallery(null);
          }}
          onSave={async (item) => {
            if (editGallery) {
              await gallery.update(editGallery.id, item);
              showToast("Album diperbarui");
            } else {
              await gallery.create(item);
              showToast("Album terupload");
            }
          }}
        />
      )}

      {showForumForm && (
        <ForumThreadForm
          item={editThread}
          alumni={alumni.data}
          onClose={() => {
            setShowForumForm(false);
            setEditThread(null);
          }}
          onSave={async (item) => {
            if (editThread) {
              await forumService.updateThread(editThread.id, item);
              forum.refresh();
              showToast("Topik diperbarui");
            } else {
              await forumService.createThread(item);
              forum.refresh();
              showToast("Topik dibuat");
            }
          }}
        />
      )}

      {showEventForm && isAdmin && (
        <EventForm
          item={editEvent}
          onClose={() => {
            setShowEventForm(false);
            setEditEvent(null);
          }}
          onSave={async (item) => {
            if (editEvent) {
              await events.update(editEvent.id, item);
              showToast("Agenda diperbarui");
            } else {
              await events.create(item);
              showToast("Agenda ditambahkan");
            }
          }}
        />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={hideToast} />}

      <footer className="footer">
        {logoUrl && <img src={logoUrl} alt="IKA" className="footer-logo" />}
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
          Ikatan Keluarga Alumni SMP Negeri 2 Samarinda
        </div>
        <div style={{ fontSize: 13, opacity: 0.85 }}>
          © {new Date().getFullYear()} <strong>IKA SMPN 2 Samarinda</strong> · Koneksi Tanpa Batas, Kolaborasi Tanpa Henti
        </div>

        <div style={{
          marginTop: 16,
          paddingTop: 12,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          fontSize: 12,
          opacity: 0.75,
          lineHeight: 1.6
        }}>
          <div><strong>Lead Developer:</strong> MS Hadianto</div>
          <div><strong>Tim Developer:</strong> Firman Ahmad</div>
        </div>

        <div style={{
          marginTop: 10,
          fontSize: 11,
          opacity: 0.55,
          fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
        }}>
          v{__APP_VERSION__} · build {__COMMIT_HASH__} · {new Date(__BUILD_DATE__).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
        </div>
      </footer>
    </div>
  );
}
