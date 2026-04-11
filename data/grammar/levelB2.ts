
import { GrammarLesson } from '../../types';

export const LEVEL_B2: GrammarLesson[] = [
  {
    id: 'b2-narrative-tenses',
    title: '1. Narrative Tenses Mastery',
    level: 'B2',
    icon: 'fa-book-open',
    description: 'Seni menggabungkan berbagai tenses masa lalu untuk menciptakan narasi yang hidup, mendalam, dan terstruktur secara kronologis.',
    sections: [
      {
        heading: '1. Dinamika Alur: Past Simple & Past Continuous',
        content: 'Dalam sebuah cerita, Past Simple digunakan sebagai "mesin" penggerak alur; ia mencatat aksi-aksi utama yang terjadi secara berurutan. Sementara itu, Past Continuous bertindak sebagai "layar lebar" yang memberikan latar belakang (background) atau suasana agar pendengar bisa membayangkan konteks kejadian tersebut.\n\nTanpa kombinasi ini, cerita Anda akan terasa datar dan kaku. Penggunaan tenses ini secara bergantian memungkinkan Anda untuk melakukan teknik "zooming" dalam cerita: menarik perhatian ke detail suasana sebelum menghantam pembaca dengan aksi utama. Ini adalah pondasi dasar bagi setiap pencerita yang ingin memikat audiensnya.',
        examples: [
          { text: 'The sun was setting while I was walking home.', isCorrect: true },
          { text: 'Suddenly, a cat jumped onto the table.', isCorrect: true },
          { text: 'I was sleeping when the alarm went off.', isCorrect: true },
          { text: 'They were discussing the project for hours.', isCorrect: true },
          { text: 'She opened the door and entered the room.', isCorrect: true }
        ]
      },
      {
        heading: '2. Past Perfect: Sang Penunjuk Urutan',
        content: 'Past Perfect (had + V3) adalah alat navigasi waktu. Ia digunakan untuk menandai kejadian yang sudah terjadi BAHKAN SEBELUM kejadian lain di masa lalu. Ini sangat krusial dalam cerita misteri atau kilas balik (flashback) agar pembaca tidak bingung dengan kronologi kejadian.\n\nJika Anda hanya menggunakan Past Simple, semua kejadian akan terlihat terjadi di waktu yang sama. Dengan Past Perfect, Anda memberikan kedalaman dimensi waktu. Anda bisa menjelaskan motivasi karakter atau rahasia masa lalu yang memengaruhi tindakan mereka saat ini. Ini adalah tanda kemahiran logika bahasa di level B2.',
        examples: [
          { text: 'I arrived late because I had lost my keys.', isCorrect: true },
          { text: 'He had already left when I called him.', isCorrect: true },
          { text: 'She realized she had forgotten her wallet.', isCorrect: true },
          { text: 'They had finished lunch before the rain started.', isCorrect: true },
          { text: 'Had you ever seen him before that day?', isCorrect: true }
        ]
      },
      {
        heading: '3. Past Perfect Continuous: Penekanan pada Durasi',
        content: 'Past Perfect Continuous (had been + V-ing) mirip dengan Past Perfect, namun fokus utamanya adalah pada PROSES atau DURASI sebuah aksi di masa lalu sebelum terhenti oleh kejadian lain. Ini memberikan nuansa kelelahan, kerja keras, atau kebiasaan yang berlangsung lama.\n\nBayangkan Anda melihat seseorang yang bajunya basah kuyup. Alih-alih hanya berkata "Dia kehujanan", Anda bisa menekankan perjuangannya: "He had been walking in the rain for an hour". Tenses ini memberikan empati dan bobot emosional pada karakter dalam cerita Anda, membuat pembaca merasakan apa yang dirasakan tokoh tersebut.',
        examples: [
          { text: 'I had been studying for hours before I slept.', isCorrect: true },
          { text: 'She was tired because she had been working hard.', isCorrect: true },
          { text: 'They had been living there for ten years.', isCorrect: true },
          { text: 'Had you been waiting long before she arrived?', isCorrect: true },
          { text: 'The road was wet; it had been raining.', isCorrect: true }
        ]
      },
      {
        heading: '4. Memilih "Used to" vs "Would" untuk Nostalgia',
        content: 'Untuk menceritakan kebiasaan lama, B2 menuntut Anda bisa membedakan "Used to" dan "Would". "Used to" bisa digunakan untuk aksi maupun status (status: I used to be a teacher). Namun, "Would" hanya boleh digunakan untuk AKSI yang berulang (actions), memberikan kesan nostalgia yang lebih puitis.\n\nBanyak pelajar terjebak menggunakan "Would" untuk status (salah: I would be happy). Memahami perbedaan ini menunjukkan bahwa Anda peka terhadap nuansa sastra dalam bahasa Inggris. "Would" sering ditemukan dalam memoar atau esai reflektif yang menceritakan kenangan manis di masa kecil.',
        examples: [
          { text: 'Every Friday, my father would take us to the mosque.', isCorrect: true, note: 'Action habit.' },
          { text: 'I used to live in a small village.', isCorrect: true, note: 'State habit (cannot use would).' },
          { text: 'She would always cook delicious meals for us.', isCorrect: true },
          { text: 'We used to have a pet cat.', isCorrect: true, note: 'Possession state.' },
          { text: 'I would read books until late at night.', isCorrect: true }
        ]
      },
      {
        heading: '5. Konteks Adab: Menjaga Amanah dalam Cerita',
        content: 'Dalam Islam, bercerita bukan sekadar hiburan, tapi sarana mengambil pelajaran (Ibrah). Menggunakan narrative tenses dengan akurat adalah bagian dari kejujuran ilmiah (Amanah). Kita tidak boleh mencampuradukkan fakta kronologis yang bisa mengubah makna sebuah peristiwa sejarah atau nasihat.\n\nKetelitian dalam tenses mencerminkan ketelitian dalam berpikir. Saat menceritakan kebaikan orang lain, gunakan tenses ini untuk menonjolkan jejak perjuangan mereka. Bahasa yang terstruktur rapi membantu kita menghargai warisan masa lalu dan menyampaikannya kembali kepada generasi mendatang dengan penuh integritas.',
        examples: [
          { text: 'The Prophet PBUH had been praying when the revelation came.', isCorrect: true },
          { text: 'People would travel for months to seek knowledge.', isCorrect: true },
          { text: 'They had already prepared the caravan before dawn.', isCorrect: true },
          { text: 'He realized he had made a great contribution.', isCorrect: true },
          { text: 'Wisdom had been passed down through generations.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b2-nar-root', label: 'NARRATIVE TENSES', type: 'root', children: [
        { id: 'background', label: 'Background Info', type: 'main', children: [
          { id: 'pc', label: 'Past Continuous (Setting)', type: 'sub' },
          { id: 'ppc', label: 'Past Perfect Continuous (Duration)', type: 'sub' }
        ]},
        { id: 'main-action', label: 'Main Events', type: 'main', children: [
          { id: 'ps', label: 'Past Simple (Sequence)', type: 'sub' },
          { id: 'pp', label: 'Past Perfect (Flashback)', type: 'sub' }
        ]},
        { id: 'habits', label: 'Past Habits', type: 'main', children: [
          { id: 'ut', label: 'Used to (States & Actions)', type: 'formula' },
          { id: 'wd', label: 'Would (Actions only / Nostalgia)', type: 'formula' }
        ]}
      ]
    }
  },
  {
    id: 'b2-mixed-conditionals',
    title: '2. Mixed Conditionals Mastery',
    level: 'B2',
    icon: 'fa-code-branch',
    description: 'Menghubungkan penyesalan masa lalu dengan realitas masa kini atau sifat tetap seseorang dalam spekulasi logis.',
    sections: [
      {
        heading: '1. Logika Campuran: Past Cause, Present Result',
        content: 'Mixed Conditionals Tipe 1 digunakan ketika sebuah aksi di MASA LALU memiliki konsekuensi yang terasa di MASA KINI. Berbeda dengan tipe 3 murni (past-past), tipe campuran ini menyoroti bagaimana sejarah hidup Anda memengaruhi status Anda hari ini.\n\nStrukturnya menggabungkan "If + Past Perfect" (syarat masa lalu) dengan "Would + Verb 1" (hasil saat ini). Contoh: "Jika saya sudah belajar lebih rajin DULU, saya akan mahir SEKARANG". Ini adalah tenses favorit dalam diskusi filosofis tentang perkembangan diri dan hukum sebab-akibat lintas waktu.',
        examples: [
          { text: 'If I had studied harder, I would be a doctor now.', isCorrect: true },
          { text: 'If they had won the game, they would be famous today.', isCorrect: true },
          { text: 'If she had taken the job, she would be rich now.', isCorrect: true },
          { text: 'If we had saved money, we would be on vacation today.', isCorrect: true },
          { text: 'If I hadn\'t missed the flight, I would be in Mecca now.', isCorrect: true }
        ]
      },
      {
        heading: '2. Logika Campuran: Present Cause, Past Result',
        content: 'Tipe campuran kedua digunakan untuk menunjukkan bagaimana sifat atau kondisi permanen Anda (masa kini) memengaruhi kejadian di masa lalu. Strukturnya menggunakan "If + Past Simple" (kondisi umum/permanen) dan "Would have + V3" (hasil spesifik di masa lalu).\n\nMisalnya: "Jika saya orang yang berani (sifat permanen), saya pasti sudah melawan kemarin". Di sini, kita tidak membicarakan perubahan aksi di masa lalu saja, tapi bagaimana karakter dasar seseorang menjadi kunci dari peristiwa-peristiwa sejarah dalam hidupnya.',
        examples: [
          { text: 'If I weren\'t afraid of heights, I would have gone skydiving yesterday.', isCorrect: true },
          { text: 'If she were more patient, she wouldn\'t have shouted at him.', isCorrect: true },
          { text: 'If they were honest, they would have told the truth.', isCorrect: true },
          { text: 'If I knew English well, I would have accepted that job.', isCorrect: true },
          { text: 'If he were a better leader, the project would have succeeded.', isCorrect: true }
        ]
      },
      {
        heading: '3. Nuansa Penyesalan dan Evaluasi Diri',
        content: 'Mixed conditionals sering kali mengandung nada penyesalan (regret) atau kritik. Namun, di level B2, Anda belajar menggunakannya secara konstruktif untuk mengevaluasi keputusan. Ini adalah cara otak manusia memproses pengalaman agar tidak mengulangi kesalahan yang sama.\n\nMemahami struktur ini membantu Anda dalam diskusi tingkat lanjut tentang strategi, manajemen risiko, dan pengembangan karakter. Alih-alih hanya meratapi masa lalu, Anda belajar menghubungkan titik-titik (connecting the dots) antara tindakan dan konsekuensi jangka panjangnya.',
        examples: [
          { text: 'If I hadn\'t spent all my money, I wouldn\'t be broke now.', isCorrect: true },
          { text: 'If you had listened to me, we wouldn\'t be lost.', isCorrect: true },
          { text: 'If she had worked harder, she would be the manager today.', isCorrect: true },
          { text: 'If they had followed the rules, they wouldn\'t be in trouble.', isCorrect: true },
          { text: 'If I had been more careful, I wouldn\'t have broken my leg.', isCorrect: true }
        ]
      },
      {
        heading: '4. Penggunaan Modal Lain: Might dan Could',
        content: 'Anda tidak harus selalu menggunakan "Would". Untuk memberikan nuansa ketidakpastian atau peluang, Anda bisa menggantinya dengan "Might" (mungkin) atau "Could" (bisa saja). Ini membuat spekulasi Anda terdengar lebih objektif dan tidak terlalu menghakimi.\n\n"If I had prayed more, I *might* be calmer now." Perhatikan bagaimana "Might" memberikan kesan kerendahan hati. Di level mahir, pemilihan modal verb ini sangat memengaruhi "suara" atau persona Anda dalam tulisan maupun percakapan formal.',
        examples: [
          { text: 'If I had known, I might have helped you.', isCorrect: true },
          { text: 'If they had practiced, they could be the champions now.', isCorrect: true },
          { text: 'If she had stayed, things might be different today.', isCorrect: true },
          { text: 'If we had left earlier, we could have arrived on time.', isCorrect: true },
          { text: 'If I had asked, he might have said yes.', isCorrect: true }
        ]
      },
      {
        heading: '5. Etika Tawakkal: Menerima Takdir',
        content: 'Secara bahasa, berandai-andai (if clauses) sangat berguna untuk belajar. Namun, dalam Adab Islami, kita diingatkan untuk tidak membiarkan kata "Law" (Seandainya) membuka pintu setan jika itu memicu kesedihan mendalam atas takdir Allah. Gunakan tenses ini hanya untuk Muhasabah (evaluasi).\n\nFokuslah pada "If I hadn\'t... I wouldn\'t be..." sebagai sarana syukur atas pelajaran yang didapat. Bahasa membantu kita menstrukturkan pikiran, namun hati harus tetap pada keyakinan bahwa segala yang terjadi adalah kehendak-Nya. Gunakan tenses ini untuk tumbuh menjadi pribadi yang lebih bijak di masa depan.',
        examples: [
          { text: 'Alhamdulillah, even if I had failed, I would still be grateful.', isCorrect: true },
          { text: 'If Allah hadn\'t guided me, I would be lost today.', isCorrect: true },
          { text: 'If we had known the future, we would have chosen this path anyway.', isCorrect: true },
          { text: 'If I had more time, I would spend it in worship.', isCorrect: true },
          { text: 'If they were truly wise, they would have chosen patience.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b2-mix-root', label: 'MIXED CONDITIONALS', type: 'root', children: [
        { id: 'type1', label: 'Past Cause -> Present Result', type: 'main', children: [
          { id: 'f1', label: 'If + Past Perfect, Would + V1', type: 'formula' }
        ]},
        { id: 'type2', label: 'Present State -> Past Result', type: 'main', children: [
          { id: 'f2', label: 'If + Past Simple, Would have + V3', type: 'formula' }
        ]},
        { id: 'modals', label: 'Variations', type: 'sub', detail: 'Use Might/Could for possibility.' }
      ]
    }
  },
  {
    id: 'b2-advanced-passive',
    title: '3. Advanced Passive Forms',
    level: 'B2',
    icon: 'fa-shield-alt',
    description: 'Menguasai struktur pasif yang lebih kompleks untuk laporan berita, opini publik, dan aksi yang berkelanjutan secara profesional.',
    sections: [
      {
        heading: '1. Passive Continuous: Aksi yang Sedang "Dikenai"',
        content: 'Passive Continuous (Be + Being + V3) digunakan untuk menyatakan bahwa sebuah objek sedang berada dalam proses pengerjaan oleh pihak lain. Ini sangat umum dalam laporan operasional atau berita lapangan. Contoh: "Jembatan sedang diperbaiki" (The bridge is *being repaired*).\n\nTenses ini sangat penting untuk memberikan update status yang akurat. Tanpanya, Anda mungkin akan bingung membedakan antara aksi yang sudah selesai (Simple Passive) dan aksi yang masih butuh waktu untuk rampung. Penguasaan tenses ini memberikan kesan bahwa Anda sangat memperhatikan detail proses.',
        examples: [
          { text: 'The new mosque is being built right now.', isCorrect: true },
          { text: 'My car was being fixed when I called.', isCorrect: true },
          { text: 'The reports are being processed by the team.', isCorrect: true },
          { text: 'Dinner is being prepared in the kitchen.', isCorrect: true },
          { text: 'The students were being tested by the teacher.', isCorrect: true }
        ]
      },
      {
        heading: '2. Impersonal Passive: "Dikatakan bahwa..."',
        content: 'Impersonal Passive (It is said that... / He is thought to be...) adalah bahasa standar jurnalisme dan diskusi akademik. Ini digunakan untuk menyampaikan opini publik atau fakta yang belum terverifikasi 100% tanpa menyebutkan siapa sumber spesifiknya.\n\nStruktur ini memberikan kesan objektif dan berwibawa. Alih-alih berkata "Orang-orang percaya dia jujur", Anda berkata "He is believed to be honest". Ini adalah cara elegan untuk menjaga jarak profesional antara Anda sebagai penyampai pesan dan isi pesan itu sendiri.',
        examples: [
          { text: 'It is said that patience is a virtue.', isCorrect: true },
          { text: 'He is believed to have discovered a new cure.', isCorrect: true },
          { text: 'It is expected that the prices will rise.', isCorrect: true },
          { text: 'She is thought to be the best student.', isCorrect: true },
          { text: 'It is known that the earth is round.', isCorrect: true }
        ]
      },
      {
        heading: '3. Passive with Modals: Keharusan yang Pasif',
        content: 'Seringkali kita butuh menyatakan kewajiban atau kemungkinan secara pasif, seperti "Aturan harus ditaati". Di sini kita menggabungkan modal verb dengan "Be + V3". Rumusnya: **Modal + Be + Verb 3**.\n\nTeknik ini sangat vital dalam penulisan kontrak, instruksi keamanan, atau kebijakan organisasi. Ia membuat pesan terdengar sangat tegas namun tidak menyerang individu tertentu secara personal karena fokusnya adalah pada objek dan aturan tersebut.',
        examples: [
          { text: 'The rules must be followed by everyone.', isCorrect: true },
          { text: 'The data can be accessed online.', isCorrect: true },
          { text: 'This book should be read by every student.', isCorrect: true },
          { text: 'The problem might be solved soon.', isCorrect: true },
          { text: 'Your password must not be shared.', isCorrect: true }
        ]
      },
      {
        heading: '4. The "Get" Passive: Fokus pada Perubahan Status',
        content: 'Dalam percakapan informal, penutur asli sering mengganti "To Be" dengan "Get" dalam kalimat pasif (seperti: got fired, got married). Perbedaan halusnya adalah: "Get" memberikan kesan adanya aksi yang mendadak, tidak terduga, atau ada elemen keberuntungan/nasib di dalamnya.\n\nNamun, berhati-hatilah karena "Get passive" dianggap kurang formal. Gunakan ini dalam percakapan santai dengan teman, namun hindari dalam esai akademik atau surat lamaran kerja. Mengetahui kapan menggunakan "Be" dan kapan menggunakan "Get" adalah ciri Anda memahami konteks sosial bahasa.',
        examples: [
          { text: 'I got hired by a big company.', isCorrect: true },
          { text: 'They got lost in the woods.', isCorrect: true },
          { text: 'She got promoted last month.', isCorrect: true },
          { text: 'Be careful or you might get hurt.', isCorrect: true },
          { text: 'We got invited to the party.', isCorrect: true }
        ]
      },
      {
        heading: '5. Konteks Objektivitas: Menjaga Amanah Berita',
        content: 'Dalam Islam, menyampaikan informasi harus disertai dengan kejujuran (Sidiq). Penggunaan Advanced Passive membantu kita menyampaikan fakta secara proporsional. "It is reported that..." menunjukkan bahwa kita sedang menukil berita dari sumber lain dengan hati-hati.\n\nHal ini juga melatih kita untuk tidak sembarangan menuduh pelaku sebelum ada bukti yang nyata. Dengan memfokuskan kalimat pada "aksi" dan "kejadian", kita menjaga lisan dari fitnah. Bahasa yang objektif adalah cerminan dari kecerdasan emosional dan integritas moral seorang mukmin.',
        examples: [
          { text: 'It is reported that the moon has been sighted.', isCorrect: true },
          { text: 'The charity is being distributed fairly.', isCorrect: true },
          { text: 'Justice must be served for the oppressed.', isCorrect: true },
          { text: 'She is considered to be a very pious person.', isCorrect: true },
          { text: 'The message of peace is being spread worldwide.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b2-pas-root', label: 'ADVANCED PASSIVE', type: 'root', children: [
        { id: 'cont', label: 'Continuous Passive', type: 'main', children: [
          { id: 'f1', label: 'Be + BEING + V3', type: 'formula' }
        ]},
        { id: 'impers', label: 'Impersonal (Public Op)', type: 'main', children: [
          { id: 'it-said', label: 'It is said that...', type: 'sub' },
          { id: 'subj-thought', label: 'He is thought to be...', type: 'sub' }
        ]},
        { id: 'modals-p', label: 'Modal Passive', type: 'main', children: [
          { id: 'f3', label: 'Modal + BE + V3', type: 'formula' }
        ]}
      ]
    }
  },
  {
    id: 'b2-future-forms',
    title: '4. Future Perfect & Future Continuous',
    level: 'B2',
    icon: 'fa-hourglass-end',
    description: 'Mampu memproyeksikan diri ke masa depan untuk melihat hasil akhir dan proses yang sedang berjalan secara akurat.',
    sections: [
      {
        heading: '1. Future Continuous: Membayangkan Kesibukan Esok',
        content: 'Future Continuous (will be + V-ing) digunakan untuk membicarakan aksi yang akan SEDANG BERLANGSUNG pada titik waktu tertentu di masa depan. Bayangkan Anda melihat jadwal Anda besok jam 10 pagi; Anda tidak hanya akan mulai bekerja, tapi Anda akan berada di tengah-tengah pekerjaan tersebut.\n\nTenses ini sangat berguna untuk memberikan detail janji temu. "Jangan telepon jam 8, saya akan sedang shalat". Ini memberikan gambaran visual yang jelas kepada lawan bicara tentang ketersediaan waktu Anda, sehingga komunikasi menjadi lebih efektif dan penuh tenggang rasa.',
        examples: [
          { text: 'This time tomorrow, I will be flying to Mecca.', isCorrect: true },
          { text: 'At 8 PM, we will be having dinner.', isCorrect: true },
          { text: 'Will you be working this weekend?', isCorrect: true },
          { text: 'She will be studying for the exam all night.', isCorrect: true },
          { text: 'They will be waiting for us at the station.', isCorrect: true }
        ]
      },
      {
        heading: '2. Future Perfect: Melihat Hasil dari Masa Depan',
        content: 'Future Perfect (will have + V3) adalah tenses "deadline". Ia digunakan untuk menyatakan bahwa sebuah aksi akan SUDAH SELESAI sebelum titik waktu tertentu di masa depan. Fokusnya bukan pada kapan dimulainya, tapi pada ketercapaian target tersebut.\n\nDalam dunia profesional, ini adalah tenses kunci untuk negosiasi kontrak dan manajemen proyek. Mengatakan "Saya akan sudah menyelesaikan laporan ini sebelum Senin" memberikan jaminan kepastian dan menunjukkan bahwa Anda adalah orang yang sangat terencana (well-planned).',
        examples: [
          { text: 'I will have finished my homework by 9 PM.', isCorrect: true },
          { text: 'She will have graduated by next year.', isCorrect: true },
          { text: 'Will you have eaten dinner when I arrive?', isCorrect: true },
          { text: 'They will have built the school by June.', isCorrect: true },
          { text: 'I will have learned 500 words by Ramadan.', isCorrect: true }
        ]
      },
      {
        heading: '3. Nuansa Prediksi dan Asumsi',
        content: 'Kedua tenses ini juga bisa digunakan untuk membuat asumsi tentang apa yang mungkin sedang terjadi atau sudah terjadi sekarang berdasarkan logika kita. "Ali terlambat, dia pasti *sedang terjebak* macet" (Future Continuous logic applied to present assumption).\n\nMenggunakan struktur masa depan untuk asumsi masa kini memberikan nuansa keyakinan intelektual yang tinggi. Ini sering digunakan dalam diskusi strategi atau investigasi ringan. Kemampuan ini membedakan pelajar level intermediate dengan pelajar yang sudah mulai berpikir secara kompleks dalam bahasa target.',
        examples: [
          { text: 'Don\'t call him; he will be sleeping now.', isCorrect: true, note: 'Assumption about now.' },
          { text: 'They will have arrived by now, surely.', isCorrect: true, note: 'Assumption about completion.' },
          { text: 'She will be praying at this hour.', isCorrect: true },
          { text: 'The game will have finished by the time we get there.', isCorrect: true },
          { text: 'He will be wondering where we are.', isCorrect: true }
        ]
      },
      {
        heading: '4. Future Perfect Continuous: Dedikasi Waktu',
        content: 'Future Perfect Continuous (will have been + V-ing) adalah tenses yang paling jarang digunakan namun memiliki efek "prestasi" yang kuat. Ia digunakan untuk menyatakan SEBERAPA LAMA sebuah aksi akan sudah berlangsung pada titik waktu tertentu di masa depan.\n\nContoh: "Bulan depan, saya akan sudah belajar bahasa Inggris selama 3 tahun". Tenses ini menekankan pada ketekunan dan akumulasi waktu yang telah diinvestasikan. Ia sering ditemukan dalam biografi, pidato ulang tahun perusahaan, atau refleksi pencapaian hidup yang prestisius.',
        examples: [
          { text: 'By December, I will have been working here for 5 years.', isCorrect: true },
          { text: 'How long will you have been traveling by then?', isCorrect: true },
          { text: 'She will have been living in Cairo for a decade next June.', isCorrect: true },
          { text: 'They will have been playing for two hours by 5 PM.', isCorrect: true },
          { text: 'We will have been fasting for 12 hours by Iftar.', isCorrect: true }
        ]
      },
      {
        heading: '5. Etika Visi: Merancang Masa Depan yang Berkah',
        content: 'Dalam Islam, visi masa depan (Ukhrawi) harus selalu seimbang dengan usaha duniawi. Menggunakan future perfect untuk target-target mulia mencerminkan semangat "High Ambition" yang tetap dalam koridor tawakkal. Jangan lupa sertakan "InshaAllah" dalam setiap proyeksi masa depan Anda.\n\nBahasa proyeksi membantu kita untuk memvisualisasikan hasil akhir dari perjuangan kita saat ini. Saat kita berkata "I will have memorized the Quran", kita sedang menanamkan benih tekad yang kuat di dalam hati. Gunakan tenses ini sebagai alat motivasi diri untuk terus tumbuh dan memberikan manfaat luas bagi ummat.',
        examples: [
          { text: 'InshaAllah, by next Eid, I will have shared more charity.', isCorrect: true },
          { text: 'I will be working on my character every day, InshaAllah.', isCorrect: true },
          { text: 'May we have completed our goals by the end of the year.', isCorrect: true },
          { text: 'InshaAllah, she will have recovered fully by next week.', isCorrect: true },
          { text: 'The community will be growing stronger every year, InshaAllah.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b2-fut-root', label: 'FUTURE PROJECTION', type: 'root', children: [
        { id: 'cont', label: 'Future Continuous', type: 'main', children: [
          { id: 'f1', label: 'Will be + V-ing', type: 'formula' },
          { id: 'u1', label: 'Ongoing action in future', type: 'sub' }
        ]},
        { id: 'perf', label: 'Future Perfect', type: 'main', children: [
          { id: 'f2', label: 'Will have + V3', type: 'formula' },
          { id: 'u2', label: 'Completed by a deadline', type: 'sub' }
        ]},
        { id: 'dur', label: 'Future Perf Continuous', type: 'sub', detail: 'How long a task will have been going on.' }
      ]
    }
  },
  {
    id: 'b2-wish-regrets',
    title: '5. Wishes and Regrets',
    level: 'B2',
    icon: 'fa-undo',
    description: 'Belajar mengekspresikan keinginan untuk perubahan di masa kini dan refleksi atas kejadian masa lalu dengan struktur puitis.',
    sections: [
      {
        heading: '1. Wish for Present: Mengharap Realitas Berbeda',
        content: 'Struktur "I wish + Past Simple" digunakan untuk menyatakan keinginan agar situasi saat ini berbeda dari kenyataan yang ada. Meskipun menggunakan tenses lampau, maknanya tetap untuk SEKARANG. Ini adalah cara otak kita memproses imajinasi tentang solusi atau kenyamanan tambahan.\n\nMisalnya, "I wish I were rich" berarti kenyataannya sekarang saya belum kaya. Perhatikan penggunaan "Were" yang bersifat formal untuk semua subjek (termasuk I/He/She). Penggunaan struktur ini menunjukkan kedalaman perasaan Anda terhadap sebuah kekurangan atau tantangan yang sedang dihadapi.',
        examples: [
          { text: 'I wish I had more free time.', isCorrect: true },
          { text: 'She wishes she lived closer to the mosque.', isCorrect: true },
          { text: 'I wish it weren\'t so hot today.', isCorrect: true },
          { text: 'They wish they knew the answer.', isCorrect: true },
          { text: 'Do you wish you were younger?', isCorrect: true }
        ]
      },
      {
        heading: '2. Wish for Past: Refleksi dan Penyesalan',
        content: 'Untuk membicarakan kejadian yang sudah lewat dan kita ingin itu terjadi secara berbeda, kita menggunakan "I wish + Past Perfect" (had + V3). Ini adalah bahasa murni penyesalan atau evaluasi sejarah hidup yang tidak bisa diubah lagi.\n\nMemahami struktur ini membantu Anda dalam diskusi psikologis atau narasi biografi. Ia memberikan dimensi kemanusiaan pada cerita Anda, menunjukkan bahwa setiap manusia pernah melakukan kesalahan atau memiliki peluang yang terlewatkan. Di level B2, Anda harus fasih mengubah fakta masa lalu ke dalam kalimat pengandaian ini.',
        examples: [
          { text: 'I wish I had studied harder for the exam.', isCorrect: true },
          { text: 'He wishes he hadn\'t said those mean words.', isCorrect: true },
          { text: 'We wish we had arrived on time.', isCorrect: true },
          { text: 'She wishes she had taken the opportunity.', isCorrect: true },
          { text: 'I wish I had known the truth earlier.', isCorrect: true }
        ]
      },
      {
        heading: '3. "If Only": Versi yang Lebih Dramatis',
        content: '"If only" memiliki fungsi yang identik dengan "I wish", namun ia memberikan tekanan emosional yang jauh lebih kuat. Kita menggunakannya untuk menunjukkan keinginan yang sangat mendalam atau kesedihan yang lebih tajam. Seringkali kalimat ini berdiri sendiri sebagai seruan.\n\n"If only I had known!" terdengar lebih pedih daripada "I wish I had known". Di level B2, pemilihan antara "I wish" dan "If only" mencerminkan kemampuan Anda mengontrol nada (tone) dan intensitas perasaan dalam komunikasi tertulis maupun lisan.',
        examples: [
          { text: 'If only I were there with you!', isCorrect: true },
          { text: 'If only they had listened to the advice.', isCorrect: true },
          { text: 'If only it would stop raining!', isCorrect: true, note: 'Wish for behavior change.' },
          { text: 'If only we had more patience.', isCorrect: true },
          { text: 'If only she hadn\'t left so soon.', isCorrect: true }
        ]
      },
      {
        heading: '4. Wish + Would: Mengeluhkan Kebiasaan Orang Lain',
        content: 'Ketika kita ingin seseorang (atau sesuatu) mengubah perilakunya yang menyebalkan atau mengganggu, kita menggunakan "I wish + WOULD + Verb 1". Ini adalah tenses untuk mengekspresikan ketidaksabaran atau keluhan terhadap faktor eksternal.\n\nPenting: Jangan gunakan "Would" untuk diri sendiri (I wish I would - SALAH). Gunakan hanya untuk orang lain atau benda mati (cuaca, mesin). Memahami batasan ini menunjukkan ketelitian Anda dalam membedakan antara keinginan internal dan ekspektasi terhadap lingkungan luar.',
        examples: [
          { text: 'I wish you would stop talking so loudly.', isCorrect: true },
          { text: 'He wishes the noise would go away.', isCorrect: true },
          { text: 'I wish it would stop snowing.', isCorrect: true },
          { text: 'She wishes he would help her more.', isCorrect: true },
          { text: 'They wish the bus would arrive soon.', isCorrect: true }
        ]
      },
      {
        heading: '5. Konteks Muhasabah: Belajar Tanpa Meratapi',
        content: 'Dalam Adab Islam, penyesalan masa lalu (*Regret*) harus diarahkan menjadi Taubat atau pelajaran untuk masa depan. Menggunakan struktur "I wish" dalam konteks spiritual disebut Muhasabah. Kita mengakui kekurangan kita di hadapan Allah untuk memohon kekuatan agar menjadi lebih baik.\n\nNamun, kita juga diingatkan untuk tetap Ridha dengan takdir yang sudah terjadi. Gunakan bahasa "Wishes" untuk merumuskan target baru, bukan untuk terjebak dalam kesedihan yang melumpuhkan. Bahasa adalah cerminan kematangan jiwa dalam menerima masa lalu dan merancang masa depan yang lebih bertaqwa.',
        examples: [
          { text: 'I wish I had been more grateful for the blessings.', isCorrect: true },
          { text: 'If only I could spend more time in Zikr.', isCorrect: true },
          { text: 'We wish we had helped the orphans more.', isCorrect: true },
          { text: 'I wish my heart were always at peace.', isCorrect: true },
          { text: 'May Allah help us achieve what we wish for.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b2-wish-root', label: 'WISHES & REGRETS', type: 'root', children: [
        { id: 'present', label: 'Present Wish', type: 'main', children: [
          { id: 'f1', label: 'Wish + Past Simple', type: 'formula' },
          { id: 'u1', label: 'Reality is different now', type: 'sub' }
        ]},
        { id: 'past', label: 'Past Regret', type: 'main', children: [
          { id: 'f2', label: 'Wish + Past Perfect', type: 'formula' },
          { id: 'u2', label: 'Regret about history', type: 'sub' }
        ]},
        { id: 'complaint', label: 'Behavior Change', type: 'sub', detail: 'Wish + WOULD + V1 (For others only)' }
      ]
    }
  },
  {
    id: 'b2-relative-clauses',
    title: '6. Non-Defining Relative Clauses',
    level: 'B2',
    icon: 'fa-link',
    description: 'Menambahkan detail deskriptif tambahan yang kaya tanpa mengubah inti identitas benda utama.',
    sections: [
      {
        heading: '1. Filosofi: Informasi Ekstra yang Elegan',
        content: 'Non-defining relative clauses memberikan informasi tambahan tentang seseorang atau sesuatu yang SUDAH JELAS identitasnya. Informasi ini bersifat opsional; jika dihapus, pembaca tetap tahu siapa atau apa yang sedang dibicarakan. Di sinilah letak perbedaannya dengan "defining" yang bersifat wajib.\n\nDalam penulisan formal, struktur ini adalah tanda kemahiran gaya bahasa. Ia memungkinkan Anda untuk menyisipkan fakta menarik, latar belakang, atau opini di tengah kalimat tanpa harus memecahnya menjadi kalimat-kalimat pendek yang terputus. Ini menciptakan aliran bacaan yang lebih dewasa dan profesional.',
        examples: [
          { text: 'My brother, who lives in Cairo, is an imam.', isCorrect: true },
          { text: 'Medina, which is a holy city, is very peaceful.', isCorrect: true },
          { text: 'The Quran, which was revealed to the Prophet, is our guide.', isCorrect: true },
          { text: 'Ahmad, whose father is a doctor, is my friend.', isCorrect: true },
          { text: 'The Nile, which flows through Egypt, is very long.', isCorrect: true }
        ]
      },
      {
        heading: '2. Aturan Tanda Baca: Kekuatan Koma',
        content: 'Ciri fisik paling menonjol dari non-defining clause adalah penggunaan koma di awal dan di akhir klausa tersebut. Koma ini bertindak seperti tanda kurung yang memberi sinyal kepada pembaca: "Ini hanya informasi tambahan, inti kalimatnya ada di luar sini".\n\nMelupakan koma dalam struktur ini adalah kesalahan tata bahasa yang serius di level B2. Tanpa koma, kalimat tersebut akan terbaca sebagai defining clause yang mungkin mengubah makna secara total. Ketelitian dalam tanda baca mencerminkan ketelitian Anda dalam menstrukturkan logika informasi bagi pembaca.',
        examples: [
          { text: 'The school, which was built in 1990, needs repair.', isCorrect: true },
          { text: 'Sarah, who is the top student, won the award.', isCorrect: true },
          { text: 'That car, which I bought last year, is very fast.', isCorrect: true },
          { text: 'Our teacher, who is very patient, helped us.', isCorrect: true },
          { text: 'The project, which we started in May, is finished.', isCorrect: true }
        ]
      },
      {
        heading: '3. Larangan Kata "THAT"',
        content: 'Satu aturan emas yang sering menjebak pelajar adalah: Anda TIDAK BOLEH menggunakan kata "That" dalam non-defining relative clause. Anda wajib menggunakan *Who* untuk manusia, *Which* untuk benda, *Whose* untuk kepemilikan, atau *Where* untuk lokasi.\n\n"That" hanya diperuntukkan bagi defining clauses (tanpa koma). Membiasakan diri menggunakan "Which" atau "Who" setelah koma akan secara instan membuat tulisan Anda terlihat lebih akademik dan sesuai dengan standar tata bahasa internasional yang ketat.',
        examples: [
          { text: 'My laptop, which is new, works well.', isCorrect: true },
          { text: 'My laptop, that is new, works well.', isCorrect: false, note: 'Cannot use "that" here.' },
          { text: 'Ali, who is my cousin, is very kind.', isCorrect: true },
          { text: 'The mosque, where we pray, is beautiful.', isCorrect: true },
          { text: 'His books, which are famous, are in the library.', isCorrect: true }
        ]
      },
      {
        heading: '4. Menunjukkan Hubungan dan Konteks',
        content: 'Struktur ini sangat efektif untuk membangun kredibilitas karakter atau objek dalam cerita. Dengan menambahkan detail seperti profesi, hubungan keluarga, atau pencapaian masa lalu, Anda memberikan konteks yang lebih kaya bagi pembaca untuk memahami motivasi di balik sebuah aksi.\n\nDalam laporan profesional, ini digunakan untuk memberikan kualifikasi pada tokoh atau data yang disebutkan. "Mr. Ali, who has 20 years of experience, leads the team." Perhatikan bagaimana informasi di antara koma tersebut secara instan meningkatkan kepercayaan pembaca terhadap tokoh tersebut.',
        examples: [
          { text: 'The CEO, who is a very busy man, accepted the invitation.', isCorrect: true },
          { text: 'Jakarta, where millions of people live, is the capital.', isCorrect: true },
          { text: 'This computer, which I borrowed from Ali, is broken.', isCorrect: true },
          { text: 'The scholarship, which covers all costs, is very competitive.', isCorrect: true },
          { text: 'My uncle, whose house is near the beach, invited us.', isCorrect: true }
        ]
      },
      {
        heading: '5. Etika Deskripsi: Memberikan Apresiasi',
        content: 'Dalam perspektif Islam, memberikan detail yang baik tentang seseorang adalah bagian dari memuliakan sesama Muslim. Non-defining clauses memungkinkan kita menyisipkan pujian atau pengakuan atas jasa seseorang secara halus dan tidak berlebihan di dalam narasi kita.\n\n"Umar, who was known for his justice, was a great leader." Kalimat ini memberikan apresiasi pada karakter mulia tokoh tersebut. Gunakanlah struktur ini untuk menyebarkan nilai-nilai positif dan menginspirasi orang lain melalui detail-detail kebaikan yang Anda selipkan dalam setiap tulisan Anda.',
        examples: [
          { text: 'The Quran, which is the final revelation, provides peace.', isCorrect: true },
          { text: 'Our parents, who sacrificed so much, deserve our love.', isCorrect: true },
          { text: 'Ramadan, which is a month of mercy, is coming soon.', isCorrect: true },
          { text: 'The scholars, who seek knowledge for Allah, are respected.', isCorrect: true },
          { text: 'The mosque, which is a house of Allah, must be clean.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b2-rel-root', label: 'NON-DEFINING CLAUSES', type: 'root', children: [
        { id: 'logic', label: 'Extra Information', type: 'main', children: [
          { id: 'opt', label: 'Optional detail', type: 'sub' },
          { id: 'known', label: 'Identity is already clear', type: 'sub' }
        ]},
        { id: 'punctuation', label: 'The Commas Rule', type: 'formula', children: [
          { id: 'c-start', label: 'Comma before who/which', type: 'sub' },
          { id: 'c-end', label: 'Comma at the end of clause', type: 'sub' }
        ]},
        { id: 'restriction', label: 'No "THAT"', type: 'warning', detail: 'Use only Who, Which, Whose, Where.' }
      ]
    }
  },
  {
    id: 'b2-modals-past',
    title: '7. Modals of Deduction: Past',
    level: 'B2',
    icon: 'fa-search',
    description: 'Mengembangkan kemampuan melakukan investigasi logis dan spekulasi tentang kejadian masa lalu berdasarkan bukti yang ada.',
    sections: [
      {
        heading: '1. Rumus Past Deduction: Modal + Have + V3',
        content: 'Untuk membuat spekulasi tentang masa lalu, kita tidak bisa menggunakan modal verb secara tunggal. Kita wajib menggunakan struktur "Perfect Infinitive" (Have + Past Participle). Rumus utamanya: **Subject + Modal + Have + Verb 3**.\n\nMemahami struktur ini adalah lonjakan besar bagi pelajar B2. Ini memungkinkan Anda untuk "melihat ke belakang" dan menarik kesimpulan dari jejak-jejak yang tertinggal. Ketelitian dalam menggunakan Verb 3 di sini sangat krusial agar pendengar tahu bahwa Anda sedang membicarakan masa lalu, bukan kemungkinan di masa depan.',
        examples: [
          { text: 'He must have arrived by now.', isCorrect: true },
          { text: 'She might have forgotten the meeting.', isCorrect: true },
          { text: 'They could have finished the project.', isCorrect: true },
          { text: 'You should have seen his face!', isCorrect: true },
          { text: 'I must have lost my keys at the park.', isCorrect: true }
        ]
      },
      {
        heading: '2. Must Have: Kepastian Logis 90%',
        content: '"Must have + V3" digunakan ketika kita merasa sangat yakin bahwa sesuatu terjadi di masa lalu berdasarkan bukti yang sangat kuat saat ini. Ini bukan sekadar tebakan, tapi kesimpulan dari observasi yang mendalam.\n\nContoh: "Jalannya basah, pasti tadi hujan (It must have rained)". Penggunaan ini menunjukkan ketajaman analisis Anda. Di level B2, Anda diharapkan mampu memberikan alasan logis mengapa Anda menggunakan "Must have" alih-alih sekadar berkata "It rained" (yang merupakan fakta, bukan deduksi).',
        examples: [
          { text: 'The lights are off; they must have gone to bed.', isCorrect: true },
          { text: 'He looks very happy; he must have passed the exam.', isCorrect: true },
          { text: 'The food is gone; the cat must have eaten it.', isCorrect: true },
          { text: 'She didn\'t answer; she must have been busy.', isCorrect: true },
          { text: 'The team is celebrating; they must have won.', isCorrect: true }
        ]
      },
      {
        heading: '3. Can\'t Have: Ketidakmungkinan di Masa Lalu',
        content: 'Kebalikan dari "Must have" adalah "Can\'t have + V3" (atau "couldn\'t have"). Kita menggunakannya ketika kita yakin 100% bahwa sesuatu TIDAK MUNGKIN terjadi karena bertentangan dengan bukti atau logika yang kita miliki.\n\nIngat: Jangan gunakan "Must not have" untuk deduksi negatif. Ini adalah kesalahan umum yang harus dihindari. "He can\'t have seen me, I was hiding" adalah cara yang benar untuk menyatakan kemustahilan sebuah peristiwa masa lalu dalam bahasa Inggris yang tepat.',
        examples: [
          { text: 'He can\'t have stolen the money; he was with me.', isCorrect: true },
          { text: 'She can\'t have finished the book; it\'s too long.', isCorrect: true },
          { text: 'They can\'t have left already; their car is still here.', isCorrect: true },
          { text: 'I can\'t have forgotten my bag; I had it at the bus.', isCorrect: true },
          { text: 'It can\'t have been Ali; he is in Mecca now.', isCorrect: true }
        ]
      },
      {
        heading: '4. Might/Could Have: Spekulasi Ringan',
        content: 'Ketika bukti yang ada sangat minim dan kita hanya sekadar menebak-nebak berbagai kemungkinan, kita menggunakan "Might have", "May have", atau "Could have". Ketiganya menunjukkan tingkat kepastian yang rendah (sekitar 30-50%).\n\nBahasa ini sangat berguna dalam diskusi investigatif atau pemecahan masalah yang belum tuntas. Dengan menggunakan modal ini, Anda menunjukkan sikap yang objektif dan tidak terburu-buru mengambil kesimpulan. Ini adalah ciri intelektualitas seorang pembelajar yang menghargai kompleksitas sebuah peristiwa.',
        examples: [
          { text: 'He might have taken a different route.', isCorrect: true },
          { text: 'They could have misunderstood the instructions.', isCorrect: true },
          { text: 'She may have left her phone at home.', isCorrect: true },
          { text: 'It might have been a mistake.', isCorrect: true },
          { text: 'We could have helped if we had known.', isCorrect: true }
        ]
      },
      {
        heading: '5. Etika Prasangka: Husnudzon di Masa Lalu',
        content: 'Dalam Islam, kita diperintahkan untuk berprasangka baik (*Husnudzon*). Penggunaan modals of deduction membantu kita menjaga lisan dari tuduhan tanpa dasar. Gunakan "Must have" untuk menyimpulkan hal baik dan "Might have" untuk meragukan hal buruk tentang orang lain.\n\nMisalnya, daripada menuduh "Dia mencuri", gunakan deduksi yang santun: "He might have borrowed it by mistake". Bahasa yang kita pilih untuk mendeskripsikan masa lalu orang lain adalah ujian bagi kejujuran dan kasih sayang dalam hati kita. Jadikanlah tata bahasa ini sebagai pelindung martabat sesama Muslim.',
        examples: [
          { text: 'He must have intended to do good.', isCorrect: true },
          { text: 'She might have had a valid reason for being late.', isCorrect: true },
          { text: 'They could have forgotten to call us.', isCorrect: true },
          { text: 'There must have been a misunderstanding.', isCorrect: true },
          { text: 'He might not have seen your message.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b2-dedpast-root', label: 'PAST DEDUCTION', type: 'root', children: [
        { id: 'formula', label: 'The Structure', type: 'formula', children: [
          { id: 'f1', label: 'Modal + HAVE + Verb 3', type: 'formula' }
        ]},
        { id: 'certainty', label: 'Levels of Certainty', type: 'main', children: [
          { id: 'sure-y', label: '90% Sure (Yes): MUST HAVE', type: 'sub' },
          { id: 'sure-n', label: '90% Sure (No): CAN\'T HAVE', type: 'sub' },
          { id: 'maybe', label: '50% Maybe: MIGHT / COULD HAVE', type: 'sub' }
        ]},
        { id: 'adab', label: 'Islamic Adab', type: 'warning', detail: 'Always prioritize Husnudzon in deductions.' }
      ]
    }
  },
  {
    id: 'b2-causatives',
    title: '8. Causative Verbs (Have & Get)',
    level: 'B2',
    icon: 'fa-tasks',
    description: 'Seni mengomunikasikan delegasi tugas dan meminta bantuan secara profesional menggunakan Have dan Get.',
    sections: [
      {
        heading: '1. Filosofi Delegasi: Have Something Done',
        content: 'Causative structure "Have something done" digunakan ketika kita tidak melakukan pekerjaan itu sendiri, melainkan membayar atau meminta orang lain melakukannya untuk kita. Ini sangat umum untuk layanan profesional seperti potong rambut, servis mobil, atau renovasi rumah.\n\nStrukturnya adalah: **Have + Object + Verb 3**. Fokus utamanya adalah pada HASIL pengerjaannya, bukan pada siapa yang mengerjakannya. Penguasaan struktur ini menunjukkan bahwa Anda mampu mendeskripsikan manajemen tugas dalam kehidupan sehari-hari dengan cara yang sangat efisien dan alami bagi penutur asli.',
        examples: [
          { text: 'I had my car repaired yesterday.', isCorrect: true, note: 'Montir yang memperbaiki.' },
          { text: 'She is having her hair cut right now.', isCorrect: true },
          { text: 'We had the house painted last month.', isCorrect: true },
          { text: 'They need to have the roof fixed.', isCorrect: true },
          { text: 'I will have the report checked by the expert.', isCorrect: true }
        ]
      },
      {
        heading: '2. The "Get" Causative: Persuasi dan Usaha',
        content: '"Get something done" memiliki makna yang mirip dengan "Have", namun seringkali mengandung nuansa bahwa ada USAHA atau PERSUASI yang dilakukan untuk mewujudkannya. Kadang-kadang ini juga merujuk pada penyelesaian tugas yang sulit atau memakan waktu.\n\nDalam percakapan informal, "Get" jauh lebih sering digunakan daripada "Have". Contoh: "I finally got the computer fixed". Penggunaan "Get" memberikan kesan bahwa Anda telah berhasil menuntaskan sebuah masalah. Memahami perbedaan halus ini akan membuat bahasa Inggris Anda terdengar lebih dinamis dan ekspresif.',
        examples: [
          { text: 'I got my homework done early.', isCorrect: true },
          { text: 'She got her brother to help her.', isCorrect: true, note: 'Active causative: Get + Person + TO + V1.' },
          { text: 'We finally got the car started.', isCorrect: true },
          { text: 'Can you get the laundry done today?', isCorrect: true },
          { text: 'I got my passport renewed at the embassy.', isCorrect: true }
        ]
      },
      {
        heading: '3. Active Causatives: Menyebutkan Pelakunya',
        content: 'Jika Anda ingin secara spesifik menyebutkan SIAPA yang Anda suruh atau minta, kita menggunakan pola aktif. Untuk "Have", polanya adalah **Have + Person + Verb 1** (tanpa to). Untuk "Get", polanya adalah **Get + Person + TO + Verb 1**.\n\nPerbedaan penggunaan "TO" ini adalah jebakan klasik bagi pelajar level intermediate. Menguasai pola ini sangat penting dalam instruksi manajemen atau koordinasi tim. "I will have him call you" (Benar) vs "I will get him TO call you" (Benar). Pilih salah satu dan gunakan secara konsisten sesuai dengan tingkat keformalan situasi.',
        examples: [
          { text: 'I had the technician check the machine.', isCorrect: true },
          { text: 'She got her husband to wash the dishes.', isCorrect: true },
          { text: 'The teacher had the students write an essay.', isCorrect: true },
          { text: 'I will get my friend to lend me his book.', isCorrect: true },
          { text: 'He had the waiter bring some water.', isCorrect: true }
        ]
      },
      {
        heading: '4. Causatives dalam Konteks Malapetaka',
        content: 'Menariknya, struktur causative juga bisa digunakan untuk menceritakan kejadian buruk yang menimpa kita (unpleasant experiences) meskipun kita tidak merencanakannya. Contoh: "I had my bike stolen" (Sepeda saya dicuri).\n\nDi sini, subjek bukan sebagai "penyuruh", melainkan sebagai pihak yang terkena dampak dari sebuah aksi orang lain. Menggunakan pola ini memberikan nuansa objektivitas pada narasi kemalangan Anda, seolah-olah Anda sedang melaporkan sebuah kejadian kepada pihak berwenang. Ini adalah teknik narasi yang sangat berguna untuk level B2.',
        examples: [
          { text: 'She had her wallet stolen on the bus.', isCorrect: true },
          { text: 'They had their house damaged by the storm.', isCorrect: true },
          { text: 'I had my account hacked yesterday.', isCorrect: true },
          { text: 'He had his application rejected twice.', isCorrect: true },
          { text: 'We had our flight cancelled at the last minute.', isCorrect: true }
        ]
      },
      {
        heading: '5. Konteks Kerjasama: Tolong-Menolong dalam Kebaikan',
        content: 'Dalam Islam, kita tidak bisa hidup sendirian; kita diperintahkan untuk saling tolong-menolong dalam kebaikan (*Ta\'awun*). Menggunakan causative verbs mencerminkan adab dalam berinteraksi dengan orang-orang yang memberikan jasa kepada kita, baik itu pekerja profesional maupun saudara sendiri.\n\nHargailah setiap orang yang "Anda minta pengerjaannya" dengan memberikan hak mereka secara penuh dan tepat waktu. Bahasa causative mengajarkan kita tentang struktur tanggung jawab dan delegasi yang sehat. Gunakanlah struktur ini untuk mengapresiasi bantuan orang lain dalam perjalanan belajar dan dakwah Anda.',
        examples: [
          { text: 'Let\'s get the mosque cleaned before Friday.', isCorrect: true },
          { text: 'I had the books distributed to the needy.', isCorrect: true },
          { text: 'She got her children to memorize the short Surahs.', isCorrect: true },
          { text: 'We had the water wells built in the village.', isCorrect: true },
          { text: 'I will get the expert to explain the Hadith to us.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b2-caus-root', label: 'CAUSATIVE VERBS', type: 'root', children: [
        { id: 'passive-c', label: 'Passive (Focus: Result)', type: 'main', children: [
          { id: 'f1', label: 'HAVE / GET + Object + V3', type: 'formula' },
          { id: 'u1', label: 'Service/Accident', type: 'sub' }
        ]},
        { id: 'active-c', label: 'Active (Focus: Person)', type: 'main', children: [
          { id: 'f2', label: 'HAVE + Person + V1', type: 'formula' },
          { id: 'f3', label: 'GET + Person + TO + V1', type: 'formula' }
        ]},
        { id: 'diff', label: 'Nuance', type: 'sub', detail: 'Have = Order/Professional | Get = Persuade/Effort' }
      ]
    }
  },
  {
    id: 'b2-gerunds-nuance',
    title: '9. Gerunds vs Infinitives (Nuance)',
    level: 'B2',
    icon: 'fa-shapes',
    description: 'Menjelajahi perbedaan makna halus ketika sebuah kata kerja diikuti oleh bentuk -ing atau to+V1.',
    sections: [
      {
        heading: '1. Filosofi Makna: Stop, Remember, dan Forget',
        content: 'Di level B1, kita belajar bahwa beberapa kata kerja hanya bisa diikuti salah satu bentuk. Namun di level B2, kita menemui kata kerja "bunglon" yang bisa diikuti keduanya namun dengan PERUBAHAN MAKNA yang drastis. Kata kuncinya adalah: Forget, Remember, dan Stop.\n\nGunakan Gerund (-ing) untuk menengok ke belakang (masa lalu/memori). Gunakan Infinitive (to+V1) untuk melihat ke depan (tugas/tujuan). Contoh: "Remember *to pray*" (Ingat untuk shalat nanti) vs "Remember *praying*" (Ingat memori saat shalat tadi). Ketajaman dalam membedakan ini adalah bukti kematangan linguistik Anda.',
        examples: [
          { text: 'I stopped smoking.', isCorrect: true, note: 'Berhenti total dari kebiasaan.' },
          { text: 'I stopped to smoke.', isCorrect: true, note: 'Berhenti dari aktivitas lain UNTUK merokok.' },
          { text: 'Remember to lock the door.', isCorrect: true, note: 'Tugas masa depan.' },
          { text: 'I remember locking the door.', isCorrect: true, note: 'Memori masa lalu.' },
          { text: 'Don\'t forget to send the email.', isCorrect: true }
        ]
      },
      {
        heading: '2. Try dan Mean: Eksperimen vs Konsekuensi',
        content: 'Kata kerja "Try" juga memiliki dua nuansa. "Try + to V1" berarti Anda berusaha keras melakukan sesuatu yang sulit (effort). Sedangkan "Try + Gerund" berarti Anda sedang bereksperimen atau mencoba sebuah metode untuk melihat hasilnya (experiment).\n\nBegitu pula dengan "Mean". "Mean + to V1" menunjukkan niat (intention), sementara "Mean + Gerund" menunjukkan konsekuensi atau melibatkan sesuatu (involve). Memahami nuansa ini membantu Anda mendeskripsikan proses pemecahan masalah dengan sangat akurat dan cerdas.',
        examples: [
          { text: 'I tried to open the window.', isCorrect: true, note: 'Mencoba sekuat tenaga.' },
          { text: 'Try opening the window to get some air.', isCorrect: true, note: 'Saran eksperimen.' },
          { text: 'I meant to call you.', isCorrect: true, note: 'Niat saya.' },
          { text: 'This job means traveling a lot.', isCorrect: true, note: 'Konsekuensi pekerjaan.' },
          { text: 'She tries to learn Arabic every day.', isCorrect: true }
        ]
      },
      {
        heading: '3. Regret: Pengumuman vs Masa Lalu',
        content: 'Kata kerja "Regret" memiliki pola yang sangat formal di level akademik. "Regret + to V1" biasanya digunakan dalam pengumuman formal untuk menyampaikan kabar buruk (seperti "Kami menyesal mengumumkan..."). Ini adalah bahasa diplomasi.\n\nSedangkan "Regret + Gerund" digunakan untuk penyesalan personal atas tindakan di masa lalu. "I regret saying that." Penguasaan bentuk ini sangat penting untuk menjaga etika dalam komunikasi formal, seperti saat menolak lamaran kerja atau membatalkan kerjasama secara tertulis.',
        examples: [
          { text: 'We regret to inform you that you failed.', isCorrect: true, note: 'Formal announcement.' },
          { text: 'I regret buying this cheap car.', isCorrect: true, note: 'Personal regret.' },
          { text: 'She regrets to say she cannot come.', isCorrect: true },
          { text: 'They regret missing the opportunity.', isCorrect: true },
          { text: 'Do you regret changing your mind?', isCorrect: true }
        ]
      },
      {
        heading: '4. Go on: Kelanjutan vs Perubahan Aksi',
        content: '"Go on" adalah kata kerja yang sangat dinamis. "Go on + Gerund" berarti melanjutkan aktivitas yang sedang dilakukan (continue). Namun, "Go on + to V1" berarti Anda menyelesaikan satu tugas lalu berpindah melakukan tugas baru yang berbeda.\n\nBayangkan seorang ustadz yang sedang mengajar. Jika beliau "Go on talking", beliau terus bicara hal yang sama. Jika beliau "Go on to explain the next verse", beliau berpindah ke topik baru. Ketelitian ini membantu pendengar mengikuti alur presentasi atau penjelasan Anda dengan lebih sistematis.',
        examples: [
          { text: 'She went on singing for an hour.', isCorrect: true, note: 'Melanjutkan aksi yang sama.' },
          { text: 'After the intro, he went on to show the slides.', isCorrect: true, note: 'Berpindah ke aksi baru.' },
          { text: 'Go on reading, please.', isCorrect: true },
          { text: 'We will go on to discuss the results later.', isCorrect: true },
          { text: 'They went on complaining all day.', isCorrect: true }
        ]
      },
      {
        heading: '5. Etika Niat: Antara Rencana dan Memori',
        content: 'Dalam Islam, setiap perbuatan dimulai dari niat (*Intention*). Memahami perbedaan antara "Remember to do" (Amanah masa depan) dan "Remember doing" (Syukur atas masa lalu) membantu kita menstrukturkan kesadaran spiritual kita.\n\nJadilah orang yang selalu "Remember to fulfill your promises" dan "Never regret doing good deeds". Bahasa membantu kita memilah mana yang merupakan kewajiban yang harus ditunaikan dan mana yang merupakan hikmah yang harus diingat. Ketepatan kata adalah wujud dari kejernihan pikiran seorang pembelajar yang bertaqwa.',
        examples: [
          { text: 'Remember to say Bismillah before you eat.', isCorrect: true },
          { text: 'I will never forget seeing the Kaaba for the first time.', isCorrect: true },
          { text: 'We regret to say that we must leave early.', isCorrect: true },
          { text: 'Try to be patient in every situation.', isCorrect: true },
          { text: 'I mean to improve my character every day.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b2-gi-root', label: 'GERUND VS INFINITIVE', type: 'root', children: [
        { id: 'memory', label: 'Memory Verbs', type: 'main', children: [
          { id: 'rem-g', label: 'Rem/Forget + ING (Memory)', type: 'sub' },
          { id: 'rem-i', label: 'Rem/Forget + TO (Duty)', type: 'sub' }
        ]},
        { id: 'action', label: 'Action Verbs', type: 'main', children: [
          { id: 'stop-g', label: 'Stop + ING (Quit habit)', type: 'sub' },
          { id: 'stop-i', label: 'Stop + TO (Pause for another)', type: 'sub' }
        ]},
        { id: 'try-mean', label: 'Try & Mean', type: 'sub', detail: 'Try + TO (Hard) / ING (Expt) | Mean + TO (Intend) / ING (Involve)' }
      ]
    }
  },
  {
    id: 'b2-reported-speech',
    title: '10. Advanced Reported Speech',
    level: 'B2',
    icon: 'fa-comments',
    description: 'Seni melaporkan perkataan, perasaan, dan instruksi orang lain dengan akurasi dan integritas informasi yang tinggi.',
    sections: [
      {
        heading: '1. Backshift Mastery: Pergeseran Waktu',
        content: 'Reported Speech (Kalimat Tak Langsung) menuntut kita untuk menggeser tenses satu langkah ke masa lalu (Backshift) ketika melaporkan apa yang dikatakan seseorang di masa lampau. "Am" menjadi "Was", "Will" menjadi "Would", dan "Present Perfect" menjadi "Past Perfect".\n\nIni adalah teknik dasar untuk menjaga kronologi cerita. Tanpa backshift, pendengar akan bingung apakah sebuah pernyataan masih berlaku atau hanya benar di waktu lampau saat diucapkan. Penguasaan pola ini mencerminkan ketelitian Anda dalam menyampaikan pesan dari satu pihak ke pihak lain secara formal dan sistematis.',
        examples: [
          { text: 'He said he was happy.', isCorrect: true, note: 'Direct: "I am happy".' },
          { text: 'She said she had finished her work.', isCorrect: true, note: 'Direct: "I have finished".' },
          { text: 'They said they would come.', isCorrect: true, note: 'Direct: "We will come".' },
          { text: 'Ahmad said he lived in London.', isCorrect: true },
          { text: 'The teacher said the test was easy.', isCorrect: true }
        ]
      },
      {
        heading: '2. Reporting Verbs: Beyond "Say" and "Tell"',
        content: 'Di level B2, Anda harus mulai meninggalkan kata "say" dan "tell" yang monoton. Gunakan kata kerja yang lebih deskriptif untuk menunjukkan NADA atau MAKSUD dari pembicara, seperti *suggest, offer, refuse, promise, warn, dan insist*.\n\nSetiap reporting verb memiliki pola gramatikal yang unik. "Offer + to V1", "Suggest + Gerund", atau "Warn + someone + NOT to V1". Menggunakan variasi ini secara instan meningkatkan kelas bahasa Anda, membuat laporan Anda terasa lebih profesional dan mampu menangkap nuansa emosional dari percakapan aslinya.',
        examples: [
          { text: 'He offered to help me with the luggage.', isCorrect: true },
          { text: 'She suggested going to the park.', isCorrect: true },
          { text: 'They refused to sign the contract.', isCorrect: true },
          { text: 'I promised to pray for him.', isCorrect: true },
          { text: 'The guard warned us not to enter.', isCorrect: true }
        ]
      },
      {
        heading: '3. Reported Questions: Tanpa Inversi',
        content: 'Saat melaporkan pertanyaan, pola kalimat berubah kembali menjadi pola kalimat berita (Subjek + Kata Kerja). Anda TIDAK BOLEH melakukan inversi atau menggunakan kata bantu "do/does/did" dalam reported questions.\n\nUntuk pertanyaan Yes/No, kita menggunakan penghubung "IF" atau "WHETHER". Contoh: "He asked if I was hungry". Kesalahan tetap menggunakan pola tanya dalam laporan adalah penanda utama pelajar tingkat menengah. Membiasakan pola berita ini akan membuat narasi Anda terdengar sangat halus dan berpendidikan.',
        examples: [
          { text: 'He asked where I lived.', isCorrect: true, note: 'Bukan "where did I live".' },
          { text: 'She asked if I knew her name.', isCorrect: true },
          { text: 'They asked whether we liked the food.', isCorrect: true },
          { text: 'I asked what time it was.', isCorrect: true },
          { text: 'He asked how she was doing.', isCorrect: true }
        ]
      },
      {
        heading: '4. Reporting Orders and Requests',
        content: 'Untuk melaporkan perintah atau permintaan, kita menggunakan pola "Reporting Verb + Object + TO + V1". Struktur ini sangat praktis dan sering digunakan untuk merangkum instruksi dari atasan, guru, atau orang tua.\n\n"The doctor told me to rest." Perhatikan betapa ringkasnya struktur ini dibandingkan harus mengutip kalimat aslinya. Kemampuan merangkum instruksi ini sangat vital dalam dunia kerja internasional di mana kecepatan dan kejelasan informasi adalah prioritas utama bagi setiap anggota tim.',
        examples: [
          { text: 'The teacher told the students to be quiet.', isCorrect: true },
          { text: 'My father asked me to buy some bread.', isCorrect: true },
          { text: 'He ordered them to leave the building.', isCorrect: true },
          { text: 'She begged me not to tell anyone.', isCorrect: true },
          { text: 'The boss requested us to finish the report.', isCorrect: true }
        ]
      },
      {
        heading: '5. Konteks Amanah: Menukil Pesan dengan Benar',
        content: 'Dalam Islam, menyampaikan pesan orang lain adalah sebuah amanah. Kita dilarang untuk memutarbalikkan fakta atau mengubah maksud asli dari pembicara. Menggunakan reported speech dengan akurat adalah wujud nyata dari sifat *Sidiq* (jujur) dan *Tabligh* (menyampaikan).\n\nKetepatan dalam memilih reporting verbs membantu kita menyampaikan "semangat" di balik sebuah ucapan tanpa harus berlebihan. Jika seseorang memberi nasihat dengan lembut, laporkanlah sebagai "advice". Jika mereka melarang dengan keras, laporkanlah sebagai "warning". Kejujuran linguistik Anda adalah bagian dari integritas akhlak Anda sebagai pembelajar Muslim.',
        examples: [
          { text: 'The scholar advised us to be patient.', isCorrect: true },
          { text: 'He promised to return the debt tomorrow.', isCorrect: true },
          { text: 'She admitted making a mistake.', isCorrect: true },
          { text: 'The Prophet PBUH said that deeds are judged by intentions.', isCorrect: true },
          { text: 'He encouraged me to keep seeking knowledge.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b2-rs-root', label: 'REPORTED SPEECH', type: 'root', children: [
        { id: 'backshift', label: 'The Backshift Rule', type: 'main', children: [
          { id: 'pres-past', label: 'Present -> Past', type: 'sub' },
          { id: 'past-pp', label: 'Past / Pres Perf -> Past Perfect', type: 'sub' },
          { id: 'will-wd', label: 'Will -> Would', type: 'sub' }
        ]},
        { id: 'questions', label: 'Reported Questions', type: 'main', children: [
          { id: 'no-inv', label: 'No Inversion (Subj + Verb)', type: 'warning' },
          { id: 'if-whe', label: 'Use IF/WHETHER for Yes/No', type: 'formula' }
        ]},
        { id: 'verbs', label: 'Descriptive Verbs', type: 'formula', detail: 'Suggest, Offer, Refuse, Warn, Promise.' }
      ]
    }
  }
];
