// ============================================================
// App-wide Constants & Seed Data
// ============================================================

export const KAT_MARKET = ["Semua", "Makanan", "Minuman", "Fashion", "Jasa", "Elektronik", "Kerajinan", "Lainnya"];
export const KAT_UMKM = ["Semua", "Kuliner", "Fashion", "Teknologi", "Konstruksi", "Pendidikan", "Kesehatan", "Jasa", "Lainnya"];
export const KAT_GALLERY = ["Semua", "Reuni", "Kegiatan", "Nostalgia", "Lainnya"];
export const KAT_FORUM = ["Semua", "Reuni", "Karir", "Promo UMKM", "Umum", "Tanya Jawab"];

export const KELAS_OPTIONS = ["3A", "3B", "3C", "3D", "3E", "3F", "3G", "3H", "3I", "3J"];

// YouTube video for landing page
export const HERO_VIDEO_ID = "W8IBBXIEnLA";

// Seed data (used when Supabase empty or for offline preview)
export const SEED_ALUMNI = [
  { id: "a1", nama: "Ahmad Ridwan", angkatan: "1995", kelas: "3A", pekerjaan: "Pengusaha", kota: "Samarinda", telepon: "081234567890", email: "ahmad@email.com", bio: "Pengusaha di bidang konstruksi, aktif di komunitas alumni.", registered: "2025-01-15" },
  { id: "a2", nama: "Siti Nurhaliza", angkatan: "1998", kelas: "3B", pekerjaan: "Dokter", kota: "Balikpapan", telepon: "081298765432", email: "siti@email.com", bio: "Dokter spesialis anak di RS Pertamina Balikpapan.", registered: "2025-02-20" },
  { id: "a3", nama: "Budi Santoso", angkatan: "1995", kelas: "3C", pekerjaan: "PNS", kota: "Samarinda", telepon: "081355544433", email: "budi@email.com", bio: "Kepala Dinas Pendidikan Kota Samarinda.", registered: "2025-03-01" },
  { id: "a4", nama: "Dewi Lestari", angkatan: "2000", kelas: "3A", pekerjaan: "Guru", kota: "Jakarta", telepon: "081377788899", email: "dewi@email.com", bio: "Guru SMA di Jakarta, penulis buku.", registered: "2025-03-10" },
  { id: "a5", nama: "Firman Hidayat", angkatan: "2003", kelas: "3B", pekerjaan: "Software Engineer", kota: "Bandung", telepon: "081399900011", email: "firman20@yahoo.com", bio: "Software Engineer di startup teknologi.", registered: "2025-04-05" },
  { id: "a6", nama: "Rina Maharani", angkatan: "2000", kelas: "3A", pekerjaan: "Wiraswasta", kota: "Samarinda", telepon: "081344455566", email: "rina@email.com", bio: "Pemilik toko kue 'Maharani Cake' di Samarinda.", registered: "2025-04-12" },
];

export const SEED_MARKET = [
  { id: "m1", alumniId: "a6", judul: "Kue Lapis Samarinda", harga: 85000, kategori: "Makanan", deskripsi: "Kue lapis khas Samarinda, resep turun-temurun.", kontak: "081344455566", lokasi: "Samarinda", created: "2025-05-01" },
  { id: "m2", alumniId: "a1", judul: "Jasa Renovasi Rumah", harga: 0, kategori: "Jasa", deskripsi: "Jasa renovasi rumah berkualitas, 15 tahun pengalaman.", kontak: "081234567890", lokasi: "Samarinda", created: "2025-05-10" },
  { id: "m3", alumniId: "a5", judul: "Jasa Pembuatan Website", harga: 3500000, kategori: "Jasa", deskripsi: "Website profesional untuk UMKM. Termasuk hosting 1 tahun.", kontak: "081399900011", lokasi: "Online", created: "2025-06-01" },
];

export const SEED_UMKM = [
  { id: "u1", alumniId: "a6", namaUsaha: "Maharani Cake", kategori: "Kuliner", deskripsi: "Toko kue premium khas Samarinda.", alamat: "Jl. P. Antasari No. 45, Samarinda", telepon: "081344455566", instagram: "@maharani.cake", website: "", created: "2025-03-15" },
  { id: "u2", alumniId: "a1", namaUsaha: "AR Construction", kategori: "Konstruksi", deskripsi: "Perusahaan konstruksi rumah, ruko, bangunan komersial.", alamat: "Jl. Juanda No. 12, Samarinda", telepon: "081234567890", instagram: "@ar.construction", website: "arconstruction.co.id", created: "2025-04-01" },
  { id: "u3", alumniId: "a5", namaUsaha: "CodeKaltim Studio", kategori: "Teknologi", deskripsi: "Studio pengembangan software & website.", alamat: "Remote - Bandung", telepon: "081399900011", instagram: "@codekaltim", website: "codekaltim.dev", created: "2025-05-20" },
];

export const SEED_EVENTS = [
  { id: "e1", judul: "Reuni Akbar 2026", tanggal: "2026-08-17", lokasi: "SMP Negeri 2 Samarinda", deskripsi: "Reuni akbar seluruh angkatan di hari kemerdekaan.", biaya: "Rp 150.000/orang" },
  { id: "e2", judul: "Bakti Sosial Alumni", tanggal: "2026-06-15", lokasi: "Panti Asuhan Harapan, Samarinda", deskripsi: "Bakti sosial bersama alumni.", biaya: "Sukarela" },
  { id: "e3", judul: "Workshop UMKM Digital", tanggal: "2026-05-10", lokasi: "Aula SMP Negeri 2 Samarinda", deskripsi: "Workshop digitalisasi UMKM. Gratis untuk anggota IKA.", biaya: "Gratis" },
];

export const SEED_GALLERY = [
  {
    id: "g1", judul: "Reuni Akbar 2024", album: "Reuni", deskripsi: "Dokumentasi reuni akbar, 200+ alumni hadir.", tanggal: "2024-08-17", uploadBy: "a3", photos: [
      { id: "p1", caption: "Upacara pembukaan", color: "#1B3A5C" },
      { id: "p2", caption: "Foto bersama angkatan 95", color: "#2980B9" },
      { id: "p3", caption: "Pentas seni alumni", color: "#E8B84B" },
      { id: "p4", caption: "Makan bersama", color: "#27AE60" },
    ]
  },
  {
    id: "g2", judul: "Bakti Sosial 2025", album: "Kegiatan", deskripsi: "Kunjungan ke Panti Asuhan Kasih Sayang.", tanggal: "2025-03-22", uploadBy: "a2", photos: [
      { id: "p5", caption: "Pembagian sembako", color: "#3498DB" },
      { id: "p6", caption: "Bermain dengan anak-anak", color: "#5DADE2" },
      { id: "p7", caption: "Foto bersama pengurus", color: "#1A5276" },
    ]
  },
  {
    id: "g3", judul: "Kenangan SMP Negeri 2", album: "Nostalgia", deskripsi: "Foto kenangan masa sekolah.", tanggal: "2024-12-01", uploadBy: "a1", photos: [
      { id: "p8", caption: "Gedung sekolah", color: "#154360" },
      { id: "p9", caption: "Lapangan upacara", color: "#1F618D" },
      { id: "p10", caption: "Perpustakaan", color: "#D4AC0D" },
      { id: "p11", caption: "Ruang kelas 3A", color: "#2E86C1" },
      { id: "p12", caption: "Kantin favorit", color: "#148F77" },
    ]
  },
];

export const SEED_FORUM = [
  {
    id: "f1", authorId: "a3", judul: "Persiapan Reuni Akbar 2026", kategori: "Reuni", konten: "Assalamualaikum rekan-rekan alumni. Reuni akbar 17 Agustus 2026. Mari diskusikan:\n\n1. Konsep acara\n2. Iuran per orang\n3. Susunan panitia\n4. Undangan guru", created: "2026-02-15T10:00:00", pinned: true, likes: 12, replies: [
      { id: "r1", authorId: "a1", konten: "Siap bantu seksi konsumsi. Iuran Rp 150.000 termasuk makan siang dan kaos?", created: "2026-02-15T14:30:00", likes: 8 },
      { id: "r2", authorId: "a2", konten: "Setuju! Saya usulkan sesi kesehatan gratis — cek tensi dan gula darah.", created: "2026-02-16T09:15:00", likes: 15 },
    ]
  },
  {
    id: "f2", authorId: "a5", judul: "Lowongan Kerja IT untuk Anak Alumni", kategori: "Karir", konten: "Kantor saya di Bandung buka lowongan:\n- Junior Web Developer\n- UI/UX Designer\n- Digital Marketing\n\nBisa remote dari Samarinda.", created: "2026-03-01T08:00:00", pinned: false, likes: 20, replies: [
      { id: "r4", authorId: "a6", konten: "Anak saya baru lulus SMK multimedia, boleh kirim CV?", created: "2026-03-01T12:00:00", likes: 3 },
    ]
  },
];
