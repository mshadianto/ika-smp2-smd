import { useState } from "react";
import { Icon } from "../components/Icons";
import { Badge } from "../components/Primitives";

// ============================================================
// AboutPage — profil organisasi, AD/ART & Program Kerja 2024-2027
// Sumber: dokumen AD ART 2024-2027.docx & PROGRAM KERJA IKA 2024-2027.pdf
// ============================================================

const TABS = [
  { id: "profil", label: "Profil", icon: <Icon.Info /> },
  { id: "ad", label: "Anggaran Dasar", icon: <Icon.Shield /> },
  { id: "art", label: "Anggaran Rumah Tangga", icon: <Icon.Shield /> },
  { id: "program", label: "Program Kerja", icon: <Icon.Cal /> },
];

const DIVISI = [
  {
    nama: "Humas, Media & Pendataan Alumni",
    color: "c-nv",
    fungsi:
      "Melaksanakan fungsi komunikasi dan media informasi bagi pengurus, anggota dan masyarakat umum, publikasi dan eksistensi IKA.",
    program: [
      "Membuat dan mengelola website IKA",
      "Menerbitkan buletin IKA",
      "Sosialisasi kegiatan IKA",
      "Pembuatan database alumni",
      "Online social networking (medsos)",
      "Seminar/workshop (web programming, merakit, income from internet, dll)",
      "Silaturahmi tokoh, guru dan kepsek untuk menyerap aspirasi",
      "Menjalin komunikasi aktif dengan organisasi lain",
      "Pengenalan ke pihak-pihak terkait",
    ],
  },
  {
    nama: "Sumber Daya Manusia",
    color: "c-gd",
    fungsi:
      "Melaksanakan kegiatan yang bersifat edukatif, informatif, kreatif, peningkatan intelektual dan moralitas, serta peningkatan skill/kemampuan SDM.",
    program: [
      "Try out",
      "Seminar, diskusi panel, bedah buku, training",
      "Pameran pendidikan / education fair",
      "Kompetisi intelektual, seni, dan olahraga untuk mengembangkan pengetahuan, kreativitas dan sportivitas",
    ],
  },
  {
    nama: "Penelitian & Pengembangan Program",
    color: "c-sk",
    fungsi:
      "Melaksanakan fungsi penataan organisasi dan monitoring program kerja setiap bidang serta membuat konsep/kajian untuk pengembangan organisasi.",
    program: [
      "Rapat dan pertemuan pengurus (raker/rakor)",
      "Silaturahmi anggota rutin",
      "Buka puasa bersama / halal bihalal",
      "Management leadership training",
      "Penataan struktur organisasi dan kelengkapannya",
      "Pembentukan struktur wilayah dan angkatan",
      "Musyawarah anggota dan pemilihan Ketua Umum 2027",
      "Kajian strategis pengembangan organisasi untuk mencari kader terbaik bagi IKA selanjutnya",
    ],
  },
  {
    nama: "Pengabdian Masyarakat",
    color: "c-pr",
    fungsi:
      "Mengadakan kegiatan yang bersifat sosial, religius, kreatif, pembentukan forum dan peningkatan peran komunitas, pengelolaan partnership dan networking dengan instansi atau lembaga terkait.",
    program: [
      "Bakti sosial, pelayanan kesehatan masyarakat gratis",
      "Donor darah rutin",
      "Penyuluhan kesehatan/narkoba bekerja sama dengan pihak terkait",
      "Program beasiswa",
      "Kunjungan sosial ke panti",
      "Pelatihan manajemen masjid atau kegiatan ramadhan",
      "Bantuan spontan (kunjungan ke daerah musibah)",
      "Membentuk forum atau komunitas alumni sebagai sayap IKA, misalnya forum donatur",
    ],
  },
  {
    nama: "Kesejahteraan Rakyat",
    color: "c-gn",
    fungsi:
      "Melaksanakan program entrepreneurship dan mencari dana abadi atau berkesinambungan bagi kelangsungan program kerja organisasi.",
    program: [
      "Pelatihan wirausaha",
      "Pameran produk (makanan dan kerajinan)",
      "Mendirikan badan usaha milik IKA",
      "Membuat aksesoris IKA (stiker, gantungan, kaos, jaket, topi, dll)",
      "Pendataan alumni pengusaha, jenis usaha, dan promosi usaha di web IKA",
    ],
  },
  {
    nama: "Eksternal Pengembangan Alumni",
    color: "c-rd",
    fungsi: "Pengelolaan jaringan alumni.",
    program: ["Memastikan kekuatan silaturahmi sebagai sarana menjalin pertumbuhan IKA"],
  },
];

const AD_BAB = [
  {
    bab: "BAB I — Nama, Bentuk, Sifat dan Azas",
    pasal: [
      { no: "Pasal 1 — Nama", isi: "Organisasi ini bernama Ikatan Keluarga Alumni SMP Negeri 2 Samarinda, disingkat IKA SMP Negeri 2 Samarinda." },
      { no: "Pasal 2 — Bentuk", isi: "Perkumpulan yang menghimpun para alumni SMP Negeri 2 Samarinda yang tersebar di seluruh Indonesia dan luar Indonesia." },
      { no: "Pasal 3 — Sifat", isi: "Mandiri, bebas, demokratis, bertanggung jawab dan tidak berafiliasi pada partai politik, suku, agama, ras dan antar golongan." },
      { no: "Pasal 4 — Azas", isi: "Organisasi ini berazaskan Pancasila." },
    ],
  },
  {
    bab: "BAB II — Pendirian, Kedudukan dan Kerjasama",
    pasal: [
      { no: "Pasal 5 — Pendirian", isi: "Didirikan pada 22 Desember 2017, untuk jangka waktu yang tidak ditentukan." },
      { no: "Pasal 6 — Kedudukan", isi: "Berkedudukan di sekretariat SMP Negeri 2 Samarinda, Jalan KH. Ahmad Dahlan No. 02 Samarinda." },
      { no: "Pasal 7 — Kerjasama", isi: "Dapat bekerja sama dengan organisasi alumni dan non-alumni lainnya, dengan tetap mempertahankan bentuk dan sifatnya sebagai organisasi yang independen." },
    ],
  },
  {
    bab: "BAB III — Tujuan dan Kegiatan",
    pasal: [
      {
        no: "Pasal 8 — Tujuan",
        isi: [
          "Menghimpun dan mempersatukan segenap alumni SMP Negeri 2 Samarinda guna mewujudkan rasa setia kawan dan mempererat tali persaudaraan.",
          "Sebagai wadah penyalur bantuan / kontribusi anggota dalam memberikan solusi atas masalah-masalah yang menyangkut tugas dan tanggung jawab civitas akademika, terutama bantuan kepada siswa yang kurang mampu.",
          "Menumbuh-kembangkan rasa kecintaan terhadap almamater SMP Negeri 2 Samarinda.",
          "Mengabdikan diri kepada masyarakat.",
          "Mengoptimalkan sumber daya alumni sebagai mitra pembangunan nasional.",
        ],
      },
      {
        no: "Pasal 9 — Kegiatan",
        isi: [
          "Konsolidasi organisasi dan pemutakhiran data anggota.",
          "Membentuk wadah penyaluran bantuan alumni untuk kepentingan civitas akademika.",
          "Menampung, mengolah, menyalurkan dan memperjuangkan aspirasi anggota, khususnya di bidang pengembangan sekolah.",
          "Meningkatkan mutu dan kemampuan alumni secara profesional.",
          "Bekerja sama dengan ikatan alumni lain di tingkat lokal maupun nasional demi kemajuan organisasi.",
          "Mengadakan usaha lain yang tidak bertentangan dengan asas, sifat dan tujuan organisasi.",
        ],
      },
    ],
  },
  {
    bab: "BAB IV — Keanggotaan",
    pasal: [
      { no: "Pasal 10 — Anggota", isi: ["Anggota Biasa", "Anggota Luar Biasa", "Anggota Kehormatan"] },
      { no: "Pasal 11 — Hak Anggota", isi: ["Hak dipilih dan memilih dalam kepengurusan.", "Hak mengemukakan pendapat baik lisan maupun tulisan untuk kemajuan dan pencapaian tujuan organisasi."] },
      {
        no: "Pasal 12 — Kewajiban",
        isi: [
          "Mentaati dan melaksanakan AD/ART serta keputusan organisasi.",
          "Membela dan menjunjung nama baik organisasi.",
          "Menghadiri undangan rapat, pertemuan, dan kegiatan organisasi.",
          "Membayar iuran sesuai ketetapan rapat pengurus.",
        ],
      },
    ],
  },
  {
    bab: "BAB V — Organisasi",
    pasal: [
      {
        no: "Pasal 13 — Kepengurusan",
        isi: [
          "Ketua Umum.",
          "3 (tiga) orang Wakil Ketua merangkap Anggota.",
          "3 (tiga) orang Sekretaris (Sekretaris Umum & Wakil) merangkap Anggota.",
          "3 (tiga) orang Bendahara (Bendahara Umum & Wakil) merangkap Anggota.",
          "Beberapa bidang sesuai kebutuhan, merangkap Anggota.",
          "Pengurus Koordinator Wilayah dan/atau Angkatan, merangkap Anggota.",
          "Masa kerja pengurus 3 tahun; Ketua dapat dipilih kembali maksimal 2 periode.",
        ],
      },
    ],
  },
  {
    bab: "BAB VI — Musyawarah dan Rapat-rapat",
    pasal: [
      { no: "Pasal 14 — Rapat Pengurus", isi: "Rapat awal kepengurusan untuk menyusun program kerja, rapat evaluasi setiap 6 bulan dan setiap tahun, serta rapat tiga tahunan untuk evaluasi AD/ART, persiapan musyawarah anggota, pertanggungjawaban kepengurusan, dan pembentukan panitia reuni akbar." },
      { no: "Pasal 15 — Musyawarah", isi: "Musyawarah Anggota adalah pemegang kekuasaan tertinggi organisasi, diselenggarakan setiap 3 tahun untuk menerima/menolak laporan pertanggungjawaban dan memilih kepengurusan periode berikutnya. Dihadiri minimal 50% perwakilan angkatan." },
      { no: "Pasal 16 — Musyawarah Anggota Istimewa", isi: "Diselenggarakan apabila terdapat ketidakpercayaan anggota terhadap kinerja Pengurus. Maksimal 1 kali dalam 1 periode kepengurusan." },
    ],
  },
  {
    bab: "BAB VII — Keuangan",
    pasal: [
      { no: "Pasal 17 — Sumber Dana", isi: ["Uang Iuran Anggota.", "Sumbangan Sukarela.", "Usaha-usaha lain yang sah."] },
    ],
  },
  {
    bab: "BAB IX — Penutup",
    pasal: [
      { no: "Pasal 20 — Penutup", isi: "Hal-hal yang belum diatur akan ditetapkan lebih lanjut oleh organisasi. Anggaran Dasar ini berlaku sejak tanggal ditetapkan." },
    ],
  },
];

const ART_BAB = [
  {
    bab: "BAB I — Keanggotaan",
    pasal: [
      { no: "Pasal 1 — Tata Cara Menjadi Anggota", isi: "Setiap alumni SMP Negeri 2 Samarinda secara otomatis menjadi anggota IKA, dengan kerelaan untuk memutakhirkan data jika diperlukan." },
      { no: "Pasal 2 — Berakhirnya Keanggotaan", isi: "Berakhirnya keanggotaan IKA hanya dikarenakan meninggal dunia." },
    ],
  },
  {
    bab: "BAB II — Kepengurusan",
    pasal: [
      {
        no: "Pasal 3 — Persyaratan",
        isi: [
          "Semua anggota IKA SMP Negeri 2 Samarinda.",
          "Jujur, komunikatif, profesional.",
          "Memiliki komitmen/kepedulian terhadap perjuangan organisasi.",
          "Memiliki kemampuan, kemauan, dan dukungan untuk menjalankan organisasi.",
          "Sehat jasmani dan rohani.",
        ],
      },
      { no: "Pasal 4 — Koordinator Wilayah / Angkatan", isi: "Koordinator Wilayah dan Angkatan ditunjuk anggota di lokasinya/angkatannya, kemudian diakui dan disahkan oleh Pengurus IKA." },
      { no: "Pasal 5 — Pemilihan & Pengesahan", isi: "Ketua Umum disahkan Musyawarah Anggota; Sekretaris, Bendahara, Humas, dan perangkat lain disahkan Ketua Umum melalui SK; Koordinator Wilayah/Angkatan dipilih anggota dan disahkan Ketua Umum." },
      { no: "Pasal 6 — Pergantian Antar Waktu", isi: "Pergantian antar waktu pengurus dilakukan melalui Rapat Pengurus." },
      { no: "Pasal 7 — Berakhirnya Anggota Kepengurusan", isi: ["Meninggal dunia.", "Mengundurkan diri.", "Diberhentikan karena tidak mampu menjalankan AD/ART.", "Habis masa kerjanya."] },
    ],
  },
  {
    bab: "BAB III — Rapat Pengurus",
    pasal: [
      { no: "Pasal 8", isi: "Rapat Pengurus dihadiri oleh seluruh Pengurus dan dipimpin Ketua. Bila Ketua berhalangan, pimpinan rapat diserahkan ke Sekretaris/Bendahara atau berdasarkan kesepakatan peserta." },
    ],
  },
  {
    bab: "BAB IV — Musyawarah Anggota",
    pasal: [
      { no: "Pasal 9 — Musyawarah Besar", isi: "Dihadiri Pengurus IKA, Koordinator Wilayah, Koordinator Angkatan/Alumni, dan utusan dari masing-masing koordinator. Sah apabila dihadiri minimal 2/3 peserta. Keputusan sah dengan persetujuan minimal 50%+1 peserta yang hadir." },
      { no: "Pasal 10 — Musyawarah Anggota Istimewa", isi: "Dapat dilaksanakan atas permintaan tertulis minimal 2/3 anggota. Keputusan sah dengan persetujuan minimal 2/3 peserta." },
      { no: "Pasal 11 — Pemilihan Ketua", isi: "Mekanisme pemilihan Ketua diatur dalam Tata Cara Pemilihan Ketua." },
    ],
  },
  {
    bab: "BAB V — Keuangan",
    pasal: [
      { no: "Pasal 12 — Rencana Kerja & Anggaran", isi: "Program Kerja IKA dibuat untuk jangka 1 tahun dan disahkan dalam rapat pengurus." },
      { no: "Pasal 13 — Pembayaran & Penggunaan", isi: "Iuran dibayarkan melalui Bendahara IKA atau disetor ke rekening bank atas nama IKA SMP Negeri 2 Samarinda. Dana digunakan untuk menunjang kegiatan IKA." },
    ],
  },
  {
    bab: "BAB V — Penutup",
    pasal: [
      { no: "Pasal 14 — Penutup", isi: "Hal-hal yang belum diatur akan ditetapkan lebih lanjut oleh organisasi. ART ini berlaku sejak tanggal ditetapkan." },
    ],
  },
];

function PasalBlock({ pasal }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: "var(--c1)", marginBottom: 6 }}>{pasal.no}</div>
      {Array.isArray(pasal.isi) ? (
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.7, color: "var(--tx)" }}>
          {pasal.isi.map((it, i) => (
            <li key={i} style={{ marginBottom: 4 }}>{it}</li>
          ))}
        </ul>
      ) : (
        <div style={{ fontSize: 14, lineHeight: 1.7, color: "var(--tx)" }}>{pasal.isi}</div>
      )}
    </div>
  );
}

function BabSection({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {data.map((b, i) => (
        <div key={i} className="card" style={{ padding: 20 }}>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 18,
              fontWeight: 700,
              color: "var(--c1)",
              marginBottom: 14,
              paddingBottom: 8,
              borderBottom: "2px solid var(--c2)",
            }}
          >
            {b.bab}
          </div>
          {b.pasal.map((p, j) => (
            <PasalBlock key={j} pasal={p} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function AboutPage({ logoUrl }) {
  const [tab, setTab] = useState("profil");

  return (
    <>
      <div className="sh">
        <div>
          <div className="st">Tentang IKA SMPN 2 Samarinda</div>
          <div className="ss">Profil organisasi, AD/ART, dan Program Kerja periode 2024–2027</div>
        </div>
      </div>

      {/* Tab navigation */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 24,
          flexWrap: "wrap",
          borderBottom: "1px solid var(--bd)",
          paddingBottom: 12,
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`btn bsm ${tab === t.id ? "ba" : "bo"}`}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Profil */}
      {tab === "profil" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="IKA"
                  style={{ width: 72, height: 72, borderRadius: 12, objectFit: "contain", background: "#fff", padding: 4 }}
                />
              )}
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "var(--c1)" }}>
                  Ikatan Keluarga Alumni SMP Negeri 2 Samarinda
                </div>
                <div style={{ fontSize: 13, color: "var(--txm)", marginTop: 4 }}>
                  Didirikan 22 Desember 2017 · Periode kepengurusan 2024–2027
                </div>
              </div>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--tx)" }}>
              IKA SMP Negeri 2 Samarinda adalah perkumpulan yang menghimpun seluruh alumni SMP Negeri 2 Samarinda yang
              tersebar di seluruh Indonesia maupun luar Indonesia. Organisasi ini bersifat <strong>mandiri, bebas, demokratis,
              bertanggung jawab</strong>, serta tidak berafiliasi pada partai politik, suku, agama, ras, dan antar golongan, dengan
              berazaskan Pancasila.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--tx)", marginTop: 12 }}>
              Organisasi berkedudukan di sekretariat SMP Negeri 2 Samarinda, Jalan KH. Ahmad Dahlan No. 02 Samarinda, dan
              dapat bekerja sama dengan organisasi alumni maupun non-alumni lainnya dengan tetap mempertahankan
              independensinya.
            </p>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "var(--c1)", marginBottom: 12 }}>
              Tujuan Organisasi
            </div>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 1.8, color: "var(--tx)" }}>
              <li>Menghimpun dan mempersatukan segenap alumni guna mewujudkan rasa setia kawan dan mempererat tali persaudaraan.</li>
              <li>Menjadi wadah penyaluran bantuan/kontribusi anggota terhadap civitas akademika, terutama bagi siswa yang kurang mampu.</li>
              <li>Menumbuh-kembangkan rasa kecintaan terhadap almamater SMP Negeri 2 Samarinda.</li>
              <li>Mengabdikan diri kepada masyarakat.</li>
              <li>Mengoptimalkan sumber daya alumni sebagai mitra pembangunan nasional.</li>
            </ul>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "var(--c1)", marginBottom: 12 }}>
              Nilai Organisasi
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Badge variant="b">Religius</Badge>
              <Badge variant="g">Solidaritas</Badge>
              <Badge variant="y">Misionari</Badge>
              <Badge variant="s">Intelektual</Badge>
            </div>
          </div>
        </div>
      )}

      {/* Anggaran Dasar */}
      {tab === "ad" && (
        <>
          <div style={{ marginBottom: 18, padding: 16, background: "var(--c1p)", borderRadius: 12, fontSize: 14, lineHeight: 1.7, color: "var(--tx)" }}>
            <strong style={{ color: "var(--c1)" }}>Anggaran Dasar (AD)</strong> — landasan pokok yang mengatur nama, bentuk, sifat, asas, tujuan,
            keanggotaan, organisasi, musyawarah, dan keuangan IKA SMP Negeri 2 Samarinda.
          </div>
          <BabSection data={AD_BAB} />
        </>
      )}

      {/* ART */}
      {tab === "art" && (
        <>
          <div style={{ marginBottom: 18, padding: 16, background: "var(--c1p)", borderRadius: 12, fontSize: 14, lineHeight: 1.7, color: "var(--tx)" }}>
            <strong style={{ color: "var(--c1)" }}>Anggaran Rumah Tangga (ART)</strong> — pedoman teknis pelaksanaan AD: tata cara
            keanggotaan, kepengurusan, rapat, musyawarah, dan keuangan organisasi.
          </div>
          <BabSection data={ART_BAB} />
        </>
      )}

      {/* Program Kerja */}
      {tab === "program" && (
        <>
          <div style={{ marginBottom: 18, padding: 16, background: "var(--c1p)", borderRadius: 12, fontSize: 14, lineHeight: 1.7, color: "var(--tx)" }}>
            <strong style={{ color: "var(--c1)" }}>Program Kerja 2024–2027</strong> — disusun berdasarkan enam divisi yang menjalankan
            fungsi-fungsi strategis IKA.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {DIVISI.map((d, i) => (
              <div key={i} className="card" style={{ padding: 22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                  <div className={`sci ${d.color}`} style={{ width: 40, height: 40, borderRadius: 10 }}>
                    <Icon.Users />
                  </div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "var(--c1)" }}>
                      Divisi {d.nama}
                    </div>
                  </div>
                  <Badge variant="b">{d.program.length} program</Badge>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--txm)", marginBottom: 12, fontStyle: "italic" }}>
                  {d.fungsi}
                </p>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.8, color: "var(--tx)" }}>
                  {d.program.map((p, j) => (
                    <li key={j} style={{ marginBottom: 4 }}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
