// ============================================================
// Entity Services
// ============================================================

import { BaseService } from "./BaseService";
import { supabase, USE_SUPABASE, TABLES } from "../config/supabase";
import { storage } from "../utils/storage";
import { uid } from "../utils/format";
import {
  SEED_ALUMNI,
  SEED_MARKET,
  SEED_UMKM,
  SEED_EVENTS,
  SEED_GALLERY,
  SEED_FORUM,
} from "../config/constants";

// ---- Alumni ----
export const alumniService = new BaseService({
  table: TABLES.ALUMNI,
  storageKey: "ika_alumni_v4",
  seed: SEED_ALUMNI,
  mapFromDb: (r) => ({
    id: r.id,
    nama: r.nama,
    angkatan: r.angkatan,
    kelas: r.kelas,
    pekerjaan: r.pekerjaan,
    kota: r.kota,
    telepon: r.telepon,
    email: r.email,
    bio: r.bio,
    avatarUrl: r.avatar_url,
    registered: r.registered,
  }),
  mapToDb: (r) => ({
    id: r.id,
    nama: r.nama,
    angkatan: r.angkatan,
    kelas: r.kelas,
    pekerjaan: r.pekerjaan,
    kota: r.kota,
    telepon: r.telepon,
    email: r.email,
    bio: r.bio,
    avatar_url: r.avatarUrl,
    registered: r.registered,
  }),
});

// ---- Marketplace (admin-only write enforced at RLS level) ----
export const marketService = new BaseService({
  table: TABLES.MARKET,
  storageKey: "ika_market_v4",
  seed: SEED_MARKET,
  mapFromDb: (r) => ({
    id: r.id,
    alumniId: r.alumni_id,
    judul: r.judul,
    harga: Number(r.harga) || 0,
    kategori: r.kategori,
    deskripsi: r.deskripsi,
    kontak: r.kontak,
    lokasi: r.lokasi,
    imageUrl: r.image_url,
    created: r.created_at,
  }),
  mapToDb: (r) => ({
    id: r.id,
    alumni_id: r.alumniId,
    judul: r.judul,
    harga: Number(r.harga) || 0,
    kategori: r.kategori,
    deskripsi: r.deskripsi,
    kontak: r.kontak,
    lokasi: r.lokasi,
    image_url: r.imageUrl,
  }),
});

// ---- UMKM ----
export const umkmService = new BaseService({
  table: TABLES.UMKM,
  storageKey: "ika_umkm_v4",
  seed: SEED_UMKM,
  mapFromDb: (r) => ({
    id: r.id,
    alumniId: r.alumni_id,
    namaUsaha: r.nama_usaha,
    kategori: r.kategori,
    deskripsi: r.deskripsi,
    alamat: r.alamat,
    telepon: r.telepon,
    instagram: r.instagram,
    website: r.website,
    logoUrl: r.logo_url,
    created: r.created_at,
  }),
  mapToDb: (r) => ({
    id: r.id,
    alumni_id: r.alumniId,
    nama_usaha: r.namaUsaha,
    kategori: r.kategori,
    deskripsi: r.deskripsi,
    alamat: r.alamat,
    telepon: r.telepon,
    instagram: r.instagram,
    website: r.website,
    logo_url: r.logoUrl,
  }),
});

// ---- Events ----
export const eventService = new BaseService({
  table: TABLES.EVENTS,
  storageKey: "ika_events_v4",
  seed: SEED_EVENTS,
  mapFromDb: (r) => ({
    id: r.id,
    judul: r.judul,
    tanggal: r.tanggal,
    lokasi: r.lokasi,
    deskripsi: r.deskripsi,
    biaya: r.biaya,
  }),
  mapToDb: (r) => ({
    id: r.id,
    judul: r.judul,
    tanggal: r.tanggal,
    lokasi: r.lokasi,
    deskripsi: r.deskripsi,
    biaya: r.biaya,
  }),
});

// ---- Gallery (composite: albums + photos) ----
// Uses a denormalized local shape matching seed data for simplicity.
// On Supabase, photos are fetched via joined query.
export const galleryService = {
  async list() {
    if (USE_SUPABASE) {
      try {
        const { data: albums, error } = await supabase
          .from(TABLES.GALLERY)
          .select(`*, gallery_photos (*)`)
          .order("created_at", { ascending: false });
        if (error) throw error;
        const mapped = (albums || []).map((a) => ({
          id: a.id,
          judul: a.judul,
          album: a.album_kategori,
          deskripsi: a.deskripsi,
          tanggal: a.tanggal,
          uploadBy: a.upload_by,
          photos: (a.gallery_photos || [])
            .sort((x, y) => (x.ord || 0) - (y.ord || 0))
            .map((p) => ({
              id: p.id,
              caption: p.caption,
              color: p.color,
              imageUrl: p.image_url,
            })),
        }));
        await storage.setJSON("ika_gallery_v4", mapped);
        return mapped;
      } catch (e) {
        console.warn("[gallery] Supabase list failed:", e.message);
      }
    }
    const cached = await storage.getJSON("ika_gallery_v4");
    if (cached) return cached;
    await storage.setJSON("ika_gallery_v4", SEED_GALLERY);
    return SEED_GALLERY;
  },

  async create(album) {
    const record = { ...album, id: album.id || uid() };
    if (USE_SUPABASE) {
      try {
        const { data: a, error } = await supabase
          .from(TABLES.GALLERY)
          .insert({
            judul: album.judul,
            album_kategori: album.album,
            deskripsi: album.deskripsi,
            tanggal: album.tanggal,
            upload_by: album.uploadBy,
          })
          .select()
          .single();
        if (error) throw error;
        const photoRows = (album.photos || []).map((p, i) => ({
          album_id: a.id,
          caption: p.caption,
          color: p.color,
          image_url: p.imageUrl,
          ord: i,
        }));
        if (photoRows.length) {
          await supabase.from(TABLES.GALLERY_PHOTOS).insert(photoRows);
        }
        return { ...record, id: a.id };
      } catch (e) {
        console.warn("[gallery] Supabase create failed:", e.message);
      }
    }
    const list = await this.list();
    const next = [record, ...list];
    await storage.setJSON("ika_gallery_v4", next);
    return record;
  },

  async remove(id) {
    if (USE_SUPABASE) {
      try {
        const { error } = await supabase.from(TABLES.GALLERY).delete().eq("id", id);
        if (error) throw error;
        return true;
      } catch (e) {
        console.warn("[gallery] Supabase remove failed:", e.message);
      }
    }
    const list = await this.list();
    const next = list.filter((x) => x.id !== id);
    await storage.setJSON("ika_gallery_v4", next);
    return true;
  },
};

// ---- Forum (composite: threads + replies) ----
export const forumService = {
  async list() {
    if (USE_SUPABASE) {
      try {
        const { data: threads, error } = await supabase
          .from(TABLES.FORUM)
          .select(`*, forum_replies (*)`)
          .order("pinned", { ascending: false })
          .order("created_at", { ascending: false });
        if (error) throw error;
        const mapped = (threads || []).map((t) => ({
          id: t.id,
          authorId: t.author_id,
          judul: t.judul,
          kategori: t.kategori,
          konten: t.konten,
          pinned: t.pinned,
          likes: t.likes || 0,
          created: t.created_at,
          replies: (t.forum_replies || [])
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            .map((r) => ({
              id: r.id,
              authorId: r.author_id,
              konten: r.konten,
              likes: r.likes || 0,
              created: r.created_at,
            })),
        }));
        await storage.setJSON("ika_forum_v4", mapped);
        return mapped;
      } catch (e) {
        console.warn("[forum] Supabase list failed:", e.message);
      }
    }
    const cached = await storage.getJSON("ika_forum_v4");
    if (cached) return cached;
    await storage.setJSON("ika_forum_v4", SEED_FORUM);
    return SEED_FORUM;
  },

  async createThread(thread) {
    const record = {
      ...thread,
      id: thread.id || uid(),
      pinned: false,
      likes: 0,
      replies: [],
      created: new Date().toISOString(),
    };
    if (USE_SUPABASE) {
      try {
        const { data, error } = await supabase
          .from(TABLES.FORUM)
          .insert({
            author_id: thread.authorId,
            judul: thread.judul,
            kategori: thread.kategori,
            konten: thread.konten,
          })
          .select()
          .single();
        if (error) throw error;
        return { ...record, id: data.id, created: data.created_at };
      } catch (e) {
        console.warn("[forum] createThread failed:", e.message);
      }
    }
    const list = await this.list();
    const next = [record, ...list];
    await storage.setJSON("ika_forum_v4", next);
    return record;
  },

  async addReply(threadId, reply) {
    const record = {
      ...reply,
      id: reply.id || uid(),
      likes: 0,
      created: new Date().toISOString(),
    };
    if (USE_SUPABASE) {
      try {
        const { data, error } = await supabase
          .from(TABLES.FORUM_REPLIES)
          .insert({
            thread_id: threadId,
            author_id: reply.authorId,
            konten: reply.konten,
          })
          .select()
          .single();
        if (error) throw error;
        return { ...record, id: data.id, created: data.created_at };
      } catch (e) {
        console.warn("[forum] addReply failed:", e.message);
      }
    }
    const list = await this.list();
    const next = list.map((t) =>
      t.id === threadId ? { ...t, replies: [...(t.replies || []), record] } : t
    );
    await storage.setJSON("ika_forum_v4", next);
    return record;
  },

  async likeThread(threadId, currentLikes) {
    const newLikes = (currentLikes || 0) + 1;
    if (USE_SUPABASE) {
      try {
        const { error } = await supabase
          .from(TABLES.FORUM)
          .update({ likes: newLikes })
          .eq("id", threadId);
        if (error) throw error;
        return newLikes;
      } catch (e) {
        console.warn("[forum] likeThread failed:", e.message);
      }
    }
    const list = await this.list();
    const next = list.map((t) => (t.id === threadId ? { ...t, likes: newLikes } : t));
    await storage.setJSON("ika_forum_v4", next);
    return newLikes;
  },

  async likeReply(threadId, replyId, currentLikes) {
    const newLikes = (currentLikes || 0) + 1;
    if (USE_SUPABASE) {
      try {
        const { error } = await supabase
          .from(TABLES.FORUM_REPLIES)
          .update({ likes: newLikes })
          .eq("id", replyId);
        if (error) throw error;
        return newLikes;
      } catch (e) {
        console.warn("[forum] likeReply failed:", e.message);
      }
    }
    const list = await this.list();
    const next = list.map((t) =>
      t.id === threadId
        ? {
            ...t,
            replies: t.replies.map((r) =>
              r.id === replyId ? { ...r, likes: newLikes } : r
            ),
          }
        : t
    );
    await storage.setJSON("ika_forum_v4", next);
    return newLikes;
  },

  async remove(id) {
    if (USE_SUPABASE) {
      try {
        const { error } = await supabase.from(TABLES.FORUM).delete().eq("id", id);
        if (error) throw error;
        return true;
      } catch (e) {
        console.warn("[forum] remove failed:", e.message);
      }
    }
    const list = await this.list();
    const next = list.filter((t) => t.id !== id);
    await storage.setJSON("ika_forum_v4", next);
    return true;
  },
};
