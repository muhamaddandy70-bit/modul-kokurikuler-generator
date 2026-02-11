
import { GoogleGenAI } from "@google/genai";
import type { FormData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateCurriculumPlan(formData: FormData): Promise<string> {
  const { 
    nama_sekolah, 
    fase_kelas, 
    tema, 
    subtema,
    subtema_lainnya, 
    alokasi_waktu, 
    jenis_kokurikuler,
    jenis_kokurikuler_lainnya,
    dimensi_pilihan, 
    pilihan_pedagogik, 
    pilihan_lingkungan 
  } = formData;

  const finalJenisKokurikuler = jenis_kokurikuler === 'Lainnya' ? jenis_kokurikuler_lainnya : jenis_kokurikuler;
  const finalSubtema = subtema === 'Lainnya' ? subtema_lainnya : subtema;


  const prompt = `
ROLE: Anda adalah "Senior AI Curriculum Architect" spesialis Kurikulum Merdeka Kemendikbudristek. Tugas Anda adalah menghasilkan dokumen PERENCANAAN KOKurikuler jenjang SD yang sangat terstruktur, administratif, dan siap cetak berdasarkan variabel pilihan pengguna.

INPUT VARIABLES (Context for AI):
- nama_sekolah: ${nama_sekolah}
- fase_kelas: ${fase_kelas}
- tema: ${tema}
- subtema: ${finalSubtema}
- alokasi_waktu: ${alokasi_waktu}
- jenis_kokurikuler: ${finalJenisKokurikuler}
- dimensi_pilihan: ${dimensi_pilihan.join(', ')} (Pilih 2 atau 3 dimensi ini sebagai fokus utama)
- pilihan_pedagogik: ${pilihan_pedagogik}
- pilihan_lingkungan: ${pilihan_lingkungan}

LOGIKA PEMROSESAN (GUIDELINES):
1.  **Pedagogical Alignment**: Seluruh alur kegiatan di poin F WAJIB mencerminkan karakteristik pendekatan belajar '${pilihan_pedagogik}'. Contoh: Jika PjBL, harus ada produk akhir yang jelas. Jika Inquiry, harus ada fase bertanya dan investigasi.
2.  **Environmental Adaptation**: Aktivitas WAJIB melibatkan interaksi fisik, observasi, atau penggunaan sumber daya dari lokasi '${pilihan_lingkungan}'.
3.  **Time Management**: Bagi total ${alokasi_waktu} ke dalam 4-5 sesi pertemuan yang logis, mencakup tahap: Pengenalan, Kontekstualisasi, Aksi, dan Refleksi & Tindak Lanjut. Alokasikan Jam Pelajaran (JP) secara proporsional.
4.  **Content Generation**:
    *   **Dimensi Profil Lulusan**: Untuk setiap dimensi yang dipilih, tentukan 1 elemen yang paling relevan, lalu generate sub-elemen yang sesuai dengan fase kelas (${fase_kelas}) berdasarkan dokumen resmi BSKAP Kemendikbudristek.
    *   **Tujuan Pembelajaran**: Buat 2 tujuan. Satu terkait pemahaman konten (${finalSubtema}), satu lagi terkait pengembangan karakter sesuai dimensi yang dipilih.
    *   **Kemitraan Pembelajaran**: Buat bagian kemitraan yang lengkap, mencakup: (1) Pihak Internal Sekolah (guru lain, kepala sekolah, penjaga sekolah), (2) Keluarga (peran orang tua), dan (3) Masyarakat (mitra eksternal yang relevan). Jelaskan peran spesifik dari masing-masing pihak.
    *   **Alur Kegiatan Detail**: Untuk setiap sesi di bagian F, berikan rincian yang kaya: **Tujuan Sesi** (objektif yang jelas), **Aktivitas Utama** (2-3 langkah konkret dalam format bullet point), dan **Produk/Hasil Sesi** (output yang diharapkan dari sesi tersebut).
    *   **Asesmen**: Buat indikator dan deskripsi rubrik yang spesifik, konkret, dan terukur, langsung berkaitan dengan tujuan dan dimensi yang dipilih.
    *   **Rapor P5**: Tulis narasi singkat seolah-olah untuk siswa, menggambarkan pencapaian mereka dalam projek ini. Beri nilai bintang (contoh: ★★★☆ untuk BSH).

[FORMAT OUTPUT WAJIB] - Ikuti format ini dengan SANGAT KETAT. Pastikan semua tabel menggunakan sintaks Markdown yang valid (dengan header dan baris pemisah seperti | Kolom 1 | Kolom 2 |\\n| :--- | :--- |). Gunakan <br> untuk baris baru di dalam sel tabel. Jangan menambahkan atau mengurangi bagian apapun.

# Perencanaan Kokurikuler

**I. INFORMASI UMUM**
| Komponen | Keterangan |
| :--- | :--- |
| **Nama Satuan Pendidikan** | ${nama_sekolah} |
| **Fase / Kelas** | ${fase_kelas} |
| **Tema Utama** | ${tema} |
| **Subtema / Topik** | ${finalSubtema} |
| **Alokasi Waktu** | ${alokasi_waktu} |
| **Lokasi Kegiatan** | ${pilihan_lingkungan} |
| **Jenis Kokurikuler** | ${finalJenisKokurikuler} |

**A. DIMENSI PROFIL PELAJAR PANCASILA**
(AI: Generate sub-elemen resmi BSKAP berdasarkan dimensi yang dipilih dan fase kelas)
| Dimensi | Elemen | Sub-Elemen (Sesuai Fase) |
| :--- | :--- | :--- |
| ${dimensi_pilihan[0]} | [Generate Elemen yang relevan] | [Generate Sub-Elemen Resmi untuk ${fase_kelas}] |
| ${dimensi_pilihan[1]} | [Generate Elemen yang relevan] | [Generate Sub-Elemen Resmi untuk ${fase_kelas}] |
${dimensi_pilihan[2] ? `| ${dimensi_pilihan[2]} | [Generate Elemen yang relevan] | [Generate Sub-Elemen Resmi untuk ${fase_kelas}] |` : ''}

**B. TUJUAN PEMBELAJARAN**
1. Peserta didik mampu [Generate tujuan konkret terkait pemahaman dan aksi nyata tentang '${finalSubtema}'].
2. Peserta didik dapat mengembangkan [Generate tujuan terkait pengembangan sikap dan keterampilan dari dimensi '${dimensi_pilihan[0]}' dan '${dimensi_pilihan[1]}'].

**C. PRAKTIK PEDAGOGIS**
*   **Pendekatan Belajar**: ${pilihan_pedagogik}
*   **Deskripsi**: [Jelaskan dalam 2 kalimat ringkas bagaimana pendekatan '${pilihan_pedagogik}' diterapkan dalam projek ini, kaitkan dengan topik '${finalSubtema}'].

**D. LINGKUNGAN PEMBELAJARAN**
*   **Kondisi Lingkungan**: ${pilihan_lingkungan}
*   **Pemanfaatan**: [Jelaskan bagaimana area '${pilihan_lingkungan}' digunakan secara aktif sebagai sumber belajar utama dalam projek ini].

**E. KEMITRAAN PEMBELAJARAN**
*   **Internal (Guru di Sekolah)**: [Sebutkan 2-3 guru/pihak sekolah yang relevan, contoh: Guru Kelas lain, Guru Seni Rupa, Penjaga Sekolah].
    *   **Peran**: [Jelaskan peran masing-masing pihak dalam mendukung pelaksanaan projek].
*   **Keluarga (Orang Tua/Wali)**: Keterlibatan aktif orang tua di rumah.
    *   **Peran**: [Jelaskan peran spesifik orang tua, contoh: menjadi narasumber, membantu menyiapkan alat, mendampingi observasi di lingkungan rumah].
*   **Masyarakat/Mitra Eksternal**: [Generate 1 mitra eksternal yang paling relevan, contoh: Ketua RT, Petugas Kebersihan, Komunitas Lokal].
    *   **Peran**: [Deskripsi peran spesifik mitra eksternal dalam 1-2 kalimat untuk menyukseskan projek].

**F. KEGIATAN (ALUR PROJEK & SESI)**
| Sesi | Tahap | Detail Aktivitas (Berdasarkan '${pilihan_pedagogik}') | Durasi |
| :--- | :--- | :--- | :---: |
| 1 | **Pengenalan** | **Tujuan Sesi:** [Generate tujuan spesifik sesi ini].<br>**Aktivitas Utama:**<br>• [Generate aktivitas 1 yang menarik dan sesuai '${pilihan_pedagogik}'].<br>• [Generate aktivitas 2].<br>**Produk/Hasil:** [Generate output konkret sesi ini, misal: Peta Pikiran Awal, Daftar Pertanyaan Kunci]. | [X] JP |
| 2 | **Kontekstualisasi** | **Tujuan Sesi:** [Generate tujuan spesifik sesi ini].<br>**Aktivitas Utama:**<br>• [Generate aktivitas eksplorasi/investigasi di '${pilihan_lingkungan}'].<br>• [Generate aktivitas pengolahan data/informasi awal].<br>**Produk/Hasil:** [Generate output konkret, misal: Dokumentasi Foto & Catatan Lapangan, Hasil Wawancara]. | [X] JP |
| 3-4 | **Aksi** | **Tujuan Sesi:** [Generate tujuan spesifik sesi aksi].<br>**Aktivitas Utama:**<br>• [Generate langkah 1 perancangan produk/solusi].<br>• [Generate langkah 2 pembuatan/implementasi].<br>• [Generate langkah 3 uji coba/revisi].<br>**Produk/Hasil:** [Sebutkan produk akhir yang jelas, misal: Prototipe Alat, Poster Kampanye, Video Edukasi]. | [X] JP |
| 5 | **Refleksi & TL** | **Tujuan Sesi:** [Generate tujuan spesifik sesi refleksi].<br>**Aktivitas Utama:**<br>• [Generate aktivitas presentasi atau pameran karya].<br>• [Generate aktivitas refleksi diri & kelompok (misal: pengisian jurnal, diskusi)].<br>**Produk/Hasil:** [Generate output, misal: Lembar Refleksi Terisi, Rencana Tindak Lanjut Kelompok]. | [X] JP |

**G. ASESMEN (INSTRUMEN DETAIL)**
**1. Asesmen Formatif (Observasi Sikap)**
| Indikator Perilaku | Teramati | Belum Teramati |
| :--- | :---: | :---: |
| [Generate 1 indikator perilaku konkret terkait Dimensi ${dimensi_pilihan[0]}] | [ ] | [ ] |
| [Generate 1 indikator perilaku konkret terkait Dimensi ${dimensi_pilihan[1]}] | [ ] | [ ] |

**2. Asesmen Sumatif (Rubrik Capaian Projek)**
| Kriteria | Mulai Berkembang (MB) | Sedang Berkembang (SB) | Berkembang Sesuai Harapan (BSH) | Sangat Berkembang (SAB) |
| :--- | :--- | :--- | :--- | :--- |
| **${dimensi_pilihan[0]}** | [Deskripsi konkret capaian level MB] | [Deskripsi konkret capaian level SB] | [Deskripsi konkret capaian level BSH] | [Deskripsi konkret capaian level SAB] |
| **${dimensi_pilihan[1]}** | [Deskripsi konkret capaian level MB] | [Deskripsi konkret capaian level SB] | [Deskripsi konkret capaian level BSH] | [Deskripsi konkret capaian level SAB] |

**H. RAPOR PROJEK (CONTOH NARASI)**
| Projek | Deskripsi Capaian | Nilai Akhir |
| :--- | :--- | :--- |
| **${finalSubtema}** | [Generate narasi capaian otomatis untuk siswa. Contoh: "Ananda menunjukkan inisiatif tinggi dalam kerja kelompok dan mampu mengidentifikasi masalah sampah di lingkungan sekolah secara kritis..."] | [Generate nilai bintang. Contoh: ★★★☆ (BSH)] |

**I. LAMPIRAN PENDUKUNG**
*   **Aktivitas Pemantik**: [Generate 1 ide kegiatan pembuka yang menarik dan 'joyful learning'].
*   **Mitigasi Kendala**: [Berikan 1 solusi praktis jika '${pilihan_lingkungan}' tidak dapat diakses atau terkendala, misal karena cuaca buruk].
*   **Pertanyaan Pemantik**: [Generate 2 pertanyaan pemantik yang mendalam untuk mendorong 'deep learning' terkait topik].

---
[PRINT & MARGIN CONTROL (F4 STANDARD)]
STRICT LAYOUT INSTRUCTIONS:

1.  **Margin Orientation**: Susun konten agar optimal untuk margin cetak: Atas 3cm, Kiri 2cm, Kanan 1,5cm, dan Bawah 2cm. Ini berarti hindari teks atau tabel yang terlalu lebar.
2.  **Horizontal Constraint**: DILARANG KERAS membuat tabel lebih dari 4 kolom. Jika informasi membutuhkan lebih banyak kolom, ubah formatnya menjadi Daftar Bertingkat (Nested Bullet Points) di dalam sel agar teks tetap berada dalam batas margin kanan yang sempit (1,5cm).
3.  **Table Formatting**: Gunakan format Markdown sederhana untuk semua tabel. Jaga agar kalimat di dalam sel tabel tetap singkat dan padat; gunakan poin-poin singkat jika perlu. Ini akan memaksa tabel untuk memanjang ke bawah (vertikal) sesuai ruang kertas F4, bukan melebar ke samping (horizontal) dan keluar dari margin.
4.  **Text Wrapping**: Pastikan ada jarak baris (satu baris kosong) yang jelas antar sub-bab (misalnya antara akhir tabel Asesmen dan judul Rapor Projek) agar saat disalin ke pengolah kata, teks tidak menumpuk dan mudah diatur.
5.  **F4 Optimization**: Karena target kertas adalah F4 (panjang 33cm), berikan detail yang kaya pada bagian F (Kegiatan) dan G (Asesmen) agar halaman terisi secara proporsional dan tidak banyak ruang kosong.
`;
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error generating curriculum plan:", error);
    if (error instanceof Error) {
        return `Error from Gemini API: ${error.message}`;
    }
    return "An unknown error occurred while contacting the Gemini API.";
  }
}
