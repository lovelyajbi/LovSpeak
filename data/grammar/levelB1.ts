
import { GrammarLesson } from '../../types';

export const LEVEL_B1: GrammarLesson[] = [
  {
    id: 'b1-present-perfect-simple',
    title: '1. Present Perfect Simple',
    level: 'B1',
    icon: 'fa-hourglass-half',
    description: 'Jembatan antara masa lalu dan sekarang. Fokus pada pengalaman dan hasil nyata di saat ini.',
    sections: [
      {
        heading: '1. Filosofi: Hasil vs Waktu Kejadian',
        content: 'Present Perfect Simple sering dianggap sebagai tenses yang paling membingungkan bagi pelajar Indonesia karena kita tidak memiliki padanan kata kerja yang serupa. Kunci utama untuk memahaminya bukanlah menghafal rumus, melainkan memahami logikanya: WAKTU KEJADIAN TIDAK PENTING, yang penting adalah HASILNYA SEKARANG.\n\nJika Anda berkata "I have eaten", pendengar tidak peduli apakah Anda makan 5 menit yang lalu atau 2 jam yang lalu. Yang mereka tangkap adalah status Anda sekarang: "Saya kenyang/tidak lapar lagi". Tenses ini menghubungkan memori masa lalu dengan realitas saat ini, menjadikannya tenses yang sangat dinamis untuk menceritakan status diri dalam percakapan.',
        examples: [
          { text: 'I have finished my project.', isCorrect: true, note: 'Status: Pekerjaan sudah beres sekarang.' },
          { text: 'They have arrived at the mosque.', isCorrect: true },
          { text: 'She has lost her keys.', isCorrect: true, note: 'Status: Sekarang dia tidak punya kunci.' },
          { text: 'We have seen this movie before.', isCorrect: true },
          { text: 'The rain has stopped.', isCorrect: true, note: 'Status: Sekarang jalanan basah tapi tidak hujan.' }
        ]
      },
      {
        heading: '2. Pengalaman Hidup: "Pernah" dalam Narasi',
        content: 'Kegunaan kedua yang sangat populer adalah untuk membicarakan pengalaman hidup (life experiences). Di sini, kita tidak menyebutkan kapan kejadiannya terjadi secara spesifik. Fokusnya adalah apakah aksi tersebut pernah tercatat dalam sejarah hidup Anda atau tidak.\n\nDalam konteks ini, kita sering menggunakan kata "ever" (pernah) dalam pertanyaan dan "never" (tidak pernah) dalam pernyataan. Ini adalah cara paling elegan untuk saling mengenal latar belakang seseorang tanpa harus menginterogasi waktu kejadian yang detail. "Have you ever been to Mecca?" adalah pertanyaan pembuka yang sangat umum di level intermediate.',
        examples: [
          { text: 'Have you ever visited Turkey?', isCorrect: true },
          { text: 'I have never tried this food before.', isCorrect: true },
          { text: 'She has met many great scholars.', isCorrect: true },
          { text: 'They have traveled around the world.', isCorrect: true },
          { text: 'We have never complained about our lives.', isCorrect: true }
        ]
      },
      {
        heading: '3. Durasi: Penggunaan SINCE dan FOR',
        content: 'Present Perfect juga digunakan untuk menyatakan aksi yang dimulai di masa lalu dan MASIH BERLANJUT sampai sekarang. Untuk menunjukkan durasi, kita menggunakan dua kata kunci: "For" (selama) untuk menunjukkan periode waktu, dan "Since" (sejak) untuk menunjukkan titik awal waktu.\n\nBanyak pelajar salah menggunakan "Since" dengan durasi (misal: since 2 years). Ingatlah: "Since" adalah titik di kalender (Since 2021, Since Monday), sedangkan "For" adalah jumlah waktu (For 2 hours, For a decade). Ketepatan ini sangat krusial dalam menunjukkan profesionalitas Anda saat menjelaskan latar belakang karier atau studi.',
        examples: [
          { text: 'I have lived here for five years.', isCorrect: true, note: 'Berarti masih tinggal di sini.' },
          { text: 'She has worked there since 2010.', isCorrect: true },
          { text: 'We have known each other for ages.', isCorrect: true },
          { text: 'They have been married since last summer.', isCorrect: true },
          { text: 'He has been sick for three days.', isCorrect: true }
        ]
      },
      {
        heading: '4. Just, Already, dan Yet: Presisi Waktu',
        content: 'Untuk memberikan nuansa yang lebih tajam pada hasil kejadian, kita menggunakan "Just" (baru saja), "Already" (sudah - lebih awal dari perkiraan), dan "Yet" (belum - tapi diharapkan terjadi). Ketiga kata ini adalah bumbu yang membuat bahasa Inggris Anda terdengar lebih natural.\n\n"Just" dan "Already" biasanya diletakkan di antara "have" dan kata kerja utama. Sedangkan "Yet" hampir selalu diletakkan di akhir kalimat negatif atau pertanyaan. Penggunaan kata-kata ini menunjukkan bahwa Anda memiliki kontrol yang baik atas urutan kejadian dan harapan dalam sebuah situasi.',
        examples: [
          { text: 'I have just finished my prayer.', isCorrect: true },
          { text: 'He has already eaten lunch.', isCorrect: true },
          { text: 'Have you finished the report yet?', isCorrect: true },
          { text: 'We haven\'t started the meeting yet.', isCorrect: true },
          { text: 'She has just sent the email.', isCorrect: true }
        ]
      },
      {
        heading: '5. Etika Tahaddus bin Ni\'mah: Mensyukuri Hasil',
        content: 'Dalam tradisi Islami, menyebutkan nikmat Allah (Tahaddus bin Ni\'mah) adalah bagian dari syukur. Present Perfect Simple adalah tenses terbaik untuk mengekspresikan ini. Saat kita berkata "Allah has blessed me", kita mengakui bahwa keberkahan itu telah datang dan efeknya masih kita rasakan hingga detik ini.\n\nTenses ini mengajarkan kita untuk fokus pada "pencapaian" yang membawa manfaat saat ini. Bukan sekadar mengingat masa lalu sebagai sejarah mati, tapi melihatnya sebagai rangkaian nikmat yang terus mengalir. Gunakan tenses ini untuk menceritakan kemajuan belajar Anda dengan penuh kerendahan hati dan kesadaran akan pertolongan-Nya.',
        examples: [
          { text: 'Allah has guided me to the truth.', isCorrect: true },
          { text: 'I have learned many valuable lessons.', isCorrect: true },
          { text: 'We have found a way to help others.', isCorrect: true },
          { text: 'They have shared their wealth generously.', isCorrect: true },
          { text: 'She has achieved her spiritual goals.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b1-pp-root', label: 'PRESENT PERFECT SIMPLE', type: 'root', children: [
        { id: 'logic', label: 'Logic', type: 'main', children: [
          { id: 'res', label: 'Focus on Result NOW', type: 'sub' },
          { id: 'exp', label: 'Life Experience', type: 'sub' },
          { id: 'dur', label: 'Duration (Still true)', type: 'sub' }
        ]},
        { id: 'markers', label: 'Time Markers', type: 'formula', children: [
          { id: 's-f', label: 'Since (Point) / For (Duration)', type: 'sub' },
          { id: 'j-a-y', label: 'Just / Already / Yet', type: 'sub' },
          { id: 'e-n', label: 'Ever / Never', type: 'sub' }
        ]},
        { id: 'v3', label: 'Form: Have/Has + V3', type: 'formula' }
      ]
    }
  },
  {
    id: 'b1-present-perfect-continuous',
    title: '2. Present Perfect Continuous',
    level: 'B1',
    icon: 'fa-spinner',
    description: 'Menekankan proses, durasi, dan aksi yang berulang. Fokus pada "seberapa lama" Anda telah berusaha.',
    sections: [
      {
        heading: '1. Filosofi Proses: Fokus pada Durasi',
        content: 'Present Perfect Continuous digunakan untuk menyatakan aksi yang dimulai di masa lalu dan MASIH BERLANGSUNG hingga sekarang, dengan penekanan kuat pada PROSES atau DURASI. Jika Present Perfect Simple menjawab pertanyaan "Apa hasilnya?", maka tenses ini menjawab "Berapa lama Anda melakukannya?".\n\nBayangkan seseorang yang matanya merah karena membaca terlalu lama. Kita tidak hanya ingin tahu bahwa dia sudah membaca buku tersebut (Simple), tapi kita ingin menekankan proses melelahkan yang dia jalani: "He has been reading for 5 hours". Tenses ini memberikan kesan aktivitas yang intens dan berkelanjutan.',
        examples: [
          { text: 'I have been studying English for two hours.', isCorrect: true },
          { text: 'It has been raining all morning.', isCorrect: true },
          { text: 'She has been working here since Monday.', isCorrect: true },
          { text: 'They have been waiting for the bus for a long time.', isCorrect: true },
          { text: 'We have been discussing this topic for days.', isCorrect: true }
        ]
      },
      {
        heading: '2. Perbedaan Kontras dengan Present Perfect Simple',
        content: 'Perbedaan utama terletak pada fokus akhir. Simple fokus pada penyelesaian atau hasil permanen, sedangkan Continuous fokus pada aktivitas itu sendiri yang mungkin belum selesai atau baru saja berhenti dengan dampak yang masih terlihat.\n\nContoh: "I have painted the wall" (Tembok sudah selesai dicat). vs "I have been painting the wall" (Saya sedang dalam proses mengecat, mungkin baju saya masih penuh noda cat). Memilih di antara keduanya menunjukkan apakah Anda ingin membanggakan hasil akhir atau menceritakan perjuangan di balik proses tersebut.',
        examples: [
          { text: 'I have written three letters.', isCorrect: true, note: 'Simple: Fokus pada jumlah hasil.' },
          { text: 'I have been writing letters all day.', isCorrect: true, note: 'Continuous: Fokus pada kesibukan.' },
          { text: 'She has been cooking dinner.', isCorrect: true, note: 'Dampaknya: Dapur masih berantakan.' },
          { text: 'They have built a house.', isCorrect: true, note: 'Rumahnya sudah jadi.' },
          { text: 'They have been building a house.', isCorrect: true, note: 'Masih dalam konstruksi.' }
        ]
      },
      {
        heading: '3. Aksi Berulang dan Kebiasaan Sementara',
        content: 'Tenses ini juga bisa digunakan untuk membicarakan aksi yang terjadi berulang kali dalam kurun waktu terakhir, meskipun saat ini aksi tersebut sedang tidak dilakukan. Ini memberikan kesan kebiasaan baru yang sedang Anda jalani.\n\nMisalnya, jika Anda akhir-akhir ini sering pergi ke gym, Anda bisa berkata "I have been going to the gym lately". Ini terdengar lebih alami daripada sekadar Present Simple, karena memberikan konteks waktu yang spesifik untuk kebiasaan tersebut.',
        examples: [
          { text: 'I have been feeling tired lately.', isCorrect: true },
          { text: 'He has been playing a lot of tennis recently.', isCorrect: true },
          { text: 'She has been seeing a doctor for her back pain.', isCorrect: true },
          { text: 'We have been eating more vegetables these weeks.', isCorrect: true },
          { text: 'They have been working out every evening.', isCorrect: true }
        ]
      },
      {
        heading: '4. Batasan State Verbs (Kata Kerja Statis)',
        content: 'Penting untuk diingat bahwa tidak semua kata kerja bisa digunakan dalam bentuk Continuous. Kata kerja yang menunjukkan perasaan, kepemilikan, atau kondisi mental (State Verbs) seperti *know, believe, like, want, have (own)* tidak boleh masuk ke tenses ini.\n\nKesalahan umum adalah berkata "I have been knowing him". Bentuk yang benar tetap Present Perfect Simple: "I have known him". Memahami batasan ini adalah tanda bahwa Anda sudah memiliki insting bahasa yang matang dan tidak memaksakan semua kata kerja ke dalam rumus "-ing".',
        examples: [
          { text: 'I have known him for years.', isCorrect: true, note: 'Bukan "have been knowing".' },
          { text: 'She has always wanted to be a pilot.', isCorrect: true },
          { text: 'We have owned this car since 2015.', isCorrect: true },
          { text: 'They have believed in his vision.', isCorrect: true },
          { text: 'He has liked coffee since he was young.', isCorrect: true }
        ]
      },
      {
        heading: '5. Konteks Mujahadah: Istiqomah dalam Perjuangan',
        content: 'Dalam perspektif spiritual, Present Perfect Continuous mencerminkan konsep "Mujahadah" atau kesungguhan dalam berproses. Saat Anda berkata "I have been learning the Quran", Anda sedang menceritakan perjalanan panjang yang penuh dedikasi dan kesabaran.\n\nTenses ini menghargai waktu yang Anda investasikan. Allah tidak hanya melihat hasil akhir, tapi juga setiap detik proses yang Anda jalani. Gunakan tenses ini untuk merefleksikan usaha-usaha kebaikan Anda yang berkelanjutan, karena dalam Islam, proses yang baik adalah bagian dari ibadah itu sendiri.',
        examples: [
          { text: 'I have been seeking knowledge all my life.', isCorrect: true },
          { text: 'We have been helping the needy since last Ramadan.', isCorrect: true },
          { text: 'She has been praying for your success.', isCorrect: true },
          { text: 'They have been working for a better community.', isCorrect: true },
          { text: 'He has been practicing patience during this trial.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b1-ppc-root', label: 'PRESENT PERFECT CONTINUOUS', type: 'root', children: [
        { id: 'foc', label: 'Primary Focus', type: 'main', children: [
          { id: 'proc', label: 'Process/Duration', type: 'sub' },
          { id: 'temp', label: 'Temporary Habits', type: 'sub' }
        ]},
        { id: 'stru', label: 'Formula', type: 'formula', children: [
          { id: 'form1', label: 'Have/Has + BEEN + V-ing', type: 'sub' }
        ]},
        { id: 'warn', label: 'Restrictions', type: 'warning', detail: 'No State Verbs (Know, Like, Want)' }
      ]
    }
  },
  {
    id: 'b1-passive-voice',
    title: '3. The Passive Voice (Present & Past)',
    level: 'B1',
    icon: 'fa-shield-alt',
    description: 'Seni menggeser fokus dari pelaku ke objek atau aksi itu sendiri. Sangat penting untuk teks formal dan ilmiah.',
    sections: [
      {
        heading: '1. Filosofi: Mengapa Pasif Lebih Penting?',
        content: 'Dalam kalimat aktif, kita fokus pada SIAPA yang melakukan aksi. Namun, dalam Passive Voice, kita fokus pada APA yang terjadi atau SIAPA yang menerima aksi. Kita menggunakan kalimat pasif ketika pelakunya tidak diketahui, tidak penting, atau kita ingin terdengar lebih objektif dan formal.\n\nBayangkan sebuah berita atau jurnal ilmiah. "Peneliti menemukan obat baru" (Aktif) terdengar seperti cerita personal. "Obat baru ditemukan" (Pasif) terdengar lebih kredibel karena obatnya menjadi bintang utama cerita tersebut. Memahami kapan harus beralih ke mode pasif adalah kunci untuk menulis secara akademis dan profesional.',
        examples: [
          { text: 'The cake was eaten by Ali.', isCorrect: true, note: 'Kue lebih penting daripada Ali.' },
          { text: 'Arabic is spoken in many countries.', isCorrect: true, note: 'Pelaku bersifat umum/tidak perlu disebut.' },
          { text: 'The window was broken last night.', isCorrect: true, note: 'Pelakunya tidak diketahui.' },
          { text: 'Our office is cleaned every day.', isCorrect: true },
          { text: 'Rice is grown in Indonesia.', isCorrect: true }
        ]
      },
      {
        heading: '2. Rumus Inti: To Be + Verb 3',
        content: 'Kunci dari kalimat pasif adalah penggunaan "To Be" yang diikuti oleh "Past Participle" (Verb 3). Bentuk To Be menentukan waktunya (Present: am/is/are, Past: was/were). Tanpa To Be, kalimat pasif tidak akan pernah terbentuk.\n\nBanyak pembelajar sering lupa mencantumkan To Be atau salah menggunakan bentuk kata kerja. Ingatlah: Subjek baru dalam kalimat pasif menentukan To Be-nya. Jika bendanya jamak, gunakan "Are" atau "Were". Jika tunggal, gunakan "Is" atau "Was". Latihlah pasangan ini agar reflex Anda dalam mengubah aktif ke pasif menjadi semakin tajam.',
        examples: [
          { text: 'Present: The books ARE written in English.', isCorrect: true },
          { text: 'Past: The letter WAS sent yesterday.', isCorrect: true },
          { text: 'Present: Fasting IS practiced by Muslims.', isCorrect: true },
          { text: 'Past: These buildings WERE built in 1990.', isCorrect: true },
          { text: 'Present: The truth IS often hidden.', isCorrect: true }
        ]
      },
      {
        heading: '3. Penggunaan "BY" untuk Menyebutkan Pelaku',
        content: 'Jika Anda tetap ingin menyebutkan siapa pelaku aksinya dalam kalimat pasif, kita menggunakan kata depan "By" (oleh). Ini biasanya dilakukan jika identitas pelaku tersebut memberikan informasi tambahan yang krusial bagi pendengar.\n\nNamun, jika pelaku sudah jelas atau sangat umum (seperti "people"), sebaiknya tidak perlu mencantumkan "By". Kalimat pasif yang efektif adalah kalimat yang hemat kata. Gunakan "By" hanya untuk tokoh-tokoh penting atau spesifik yang melengkapi narasi Anda.',
        examples: [
          { text: 'The Quran was revealed by Allah to the Prophet.', isCorrect: true },
          { text: 'The theory was developed by Einstein.', isCorrect: true },
          { text: 'This beautiful song was composed by a blind man.', isCorrect: true },
          { text: 'The mosque was designed by a famous architect.', isCorrect: true },
          { text: 'My laptop was fixed by my brother.', isCorrect: true }
        ]
      },
      {
        heading: '4. Kalimat Pasif Negatif dan Tanya',
        content: 'Untuk membuat kalimat pasif negatif, cukup tambahkan "NOT" setelah To Be. Untuk bertanya, pindahkan To Be ke depan subjek. Polanya sangat konsisten dengan aturan To Be dasar yang sudah Anda pelajari di level pemula.\n\nKemampuan bertanya secara pasif sangat berguna dalam konteks formal, seperti bertanya tentang prosedur atau sejarah sebuah tempat. "Was this house built a long time ago?" terdengar lebih natural daripada mencoba menanyakan siapa yang membangunnya jika Anda hanya peduli pada rumah tersebut.',
        examples: [
          { text: 'The problem was not solved.', isCorrect: true },
          { text: 'Are these cars made in Japan?', isCorrect: true },
          { text: 'The results were not announced yet.', isCorrect: true },
          { text: 'Is the money kept in a safe?', isCorrect: true },
          { text: 'When was the mosque opened?', isCorrect: true }
        ]
      },
      {
        heading: '5. Konteks Objektivitas: Menjaga Amanah Fakta',
        content: 'Dalam Islam, objektivitas dan kejujuran fakta adalah bagian dari adab. Kalimat pasif membantu kita menyampaikan informasi tanpa harus menonjolkan diri atau mencari-cari kesalahan orang lain (jika tidak perlu). Ini adalah bahasa diplomasi yang santun.\n\nDalam pelaporan amal shalih, kalimat pasif sering digunakan untuk menghindari riya (pamer). Mengatakan "Zakat telah disalurkan" (Pasif) seringkali lebih mulia daripada "Saya telah menyalurkan zakat" (Aktif). Bahasa yang kita pilih bisa menjadi tameng bagi hati agar tetap ikhlas dalam setiap tindakan.',
        examples: [
          { text: 'The charity was distributed to the orphans.', isCorrect: true },
          { text: 'The message of peace is spread everywhere.', isCorrect: true },
          { text: 'The truth will be revealed eventually.', isCorrect: true },
          { text: 'Manners are taught at home.', isCorrect: true },
          { text: 'The invitation was accepted with gratitude.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b1-pas-root', label: 'PASSIVE VOICE', type: 'root', children: [
        { id: 'reason', label: 'Why use it?', type: 'main', children: [
          { id: 'obj', label: 'Focus on Object/Action', type: 'sub' },
          { id: 'unk', label: 'Unknown Doer', type: 'sub' },
          { id: 'form', label: 'Formal/Academic Tone', type: 'sub' }
        ]},
        { id: 'formu', label: 'Formula', type: 'formula', children: [
          { id: 'tbv3', label: 'To Be + Verb 3', type: 'sub' },
          { id: 'agt', label: 'Agent: use "BY"', type: 'sub' }
        ]},
        { id: 'tense', label: 'Tenses', type: 'main', children: [
          { id: 'pres-p', label: 'Present: is/are + V3', type: 'sub' },
          { id: 'past-p', label: 'Past: was/were + V3', type: 'sub' }
        ]}
      ]
    }
  },
  {
    id: 'b1-conditionals',
    title: '4. Zero and First Conditionals',
    level: 'B1',
    icon: 'fa-code-branch',
    description: 'Menyatakan fakta ilmiah dan kemungkinan nyata di masa depan dengan logika sebab-akibat.',
    sections: [
      {
        heading: '1. Zero Conditional: Hukum Alam yang Pasti',
        content: 'Zero Conditional digunakan untuk menyatakan kebenaran umum, fakta ilmiah, atau hal yang SELALU terjadi jika syaratnya terpenuhi. Rumusnya sangat sederhana: **If + Present Simple, Present Simple**. Tidak ada spekulasi di sini, hanya logika murni.\n\nContohnya, jika Anda memanaskan air, ia mendidih. Hubungan ini bersifat absolut. Dalam bahasa sehari-hari, kita menggunakan Zero Conditional untuk memberikan instruksi yang bersifat tetap atau menjelaskan prinsip-prinsip dasar yang tidak terbantahkan.',
        examples: [
          { text: 'If you heat ice, it melts.', isCorrect: true },
          { text: 'Plants die if they don\'t get enough water.', isCorrect: true },
          { text: 'If you press this button, the light turns on.', isCorrect: true },
          { text: 'If I drink too much coffee, I can\'t sleep.', isCorrect: true },
          { text: 'The teacher gets angry if we are late.', isCorrect: true }
        ]
      },
      {
        heading: '2. First Conditional: Peluang Nyata di Masa Depan',
        content: 'Berbeda dengan Zero, First Conditional membicarakan situasi SPESIFIK yang mungkin terjadi di masa depan. Ada peluang besar hal tersebut akan menjadi kenyataan jika syaratnya terpenuhi. Rumusnya: **If + Present Simple, WILL + Verb 1**.\n\nIni adalah tenses untuk perencanaan dan janji. "Jika besok hujan, saya akan di rumah". Kalimat ini bukan hukum alam, melainkan rencana Anda untuk kejadian tertentu. Memahami perbedaan antara First dan Zero menunjukkan kemampuan Anda membedakan antara fakta abadi dan rencana situasional.',
        examples: [
          { text: 'If it rains tomorrow, I will stay at home.', isCorrect: true },
          { text: 'If she studies hard, she will pass the exam.', isCorrect: true },
          { text: 'We will be late if we don\'t hurry.', isCorrect: true },
          { text: 'If you help me, I will help you too.', isCorrect: true },
          { text: 'I will call you if I find your keys.', isCorrect: true }
        ]
      },
      {
        heading: '3. Penggunaan UNLESS: Penyangkalan yang Praktis',
        content: '"Unless" adalah kata ajaib yang berarti "If... not" (kecuali jika). Menggunakan "Unless" seringkali membuat kalimat Anda terasa lebih ringkas dan berwibawa daripada menggunakan pola "If" negatif yang bertele-tele.\n\nMisalnya, alih-alih berkata "If you don\'t study, you will fail", Anda bisa berkata "Unless you study, you will fail". Ini memberikan tekanan yang lebih kuat pada syarat tersebut. Latihlah penggunaan "Unless" untuk memperkaya variasi kalimat pengandaian Anda agar tidak terdengar seperti robot.',
        examples: [
          { text: 'I won\'t go unless you come with me.', isCorrect: true },
          { text: 'Unless it is urgent, don\'t call me.', isCorrect: true },
          { text: 'You will get sick unless you eat healthy.', isCorrect: true },
          { text: 'Unless we hurry, we will miss the prayer.', isCorrect: true },
          { text: 'She will not arrive on time unless she takes a taxi.', isCorrect: true }
        ]
      },
      {
        heading: '4. Variasi Modal dalam First Conditional',
        content: 'Meskipun "Will" adalah yang paling umum, kita bisa menggantinya dengan modal verbs lain seperti *Can, May, atau Should* untuk memberikan nuansa kepastian yang berbeda. Ini sangat berguna untuk memberikan izin atau saran yang bersyarat.\n\n"If you finish your work, you *can* go" memberikan izin. "If you are tired, you *should* rest" memberikan saran. Fleksibilitas ini memungkinkan Anda untuk berkomunikasi dengan lebih bernuansa sesuai dengan hubungan Anda dengan lawan bicara.',
        examples: [
          { text: 'If you are free, we can go to the market.', isCorrect: true },
          { text: 'If he asks politely, she might help him.', isCorrect: true },
          { text: 'You should see a doctor if the pain continues.', isCorrect: true },
          { text: 'If they arrive early, they may start the game.', isCorrect: true },
          { text: 'Can I borrow your pen if you don\'t need it?', isCorrect: true }
        ]
      },
      {
        heading: '5. Konteks Tawakkal: Merancang Hari Esok',
        content: 'Dalam Islam, merencanakan masa depan harus selalu disertai dengan kesadaran bahwa Allah-lah penentu segalanya. Menggunakan First Conditional adalah wujud ikhtiar (usaha), namun hasilnya tetap di tangan-Nya. Di sinilah ungkapan "InshaAllah" menjadi sangat relevan.\n\nBahasa pengandaian mengajarkan kita tentang tanggung jawab (Amanah). Jika kita melakukan A, maka hasilnya B. Kesadaran akan sebab-akibat ini mendorong kita untuk selalu memilih "sebab" yang baik agar mendapatkan "akibat" yang diridhai-Nya. Jadikan tenses ini sebagai alat untuk memotivasi diri melakukan kebaikan hari ini demi masa depan yang lebih cerah.',
        examples: [
          { text: 'If we work together, we will succeed, InshaAllah.', isCorrect: true },
          { text: 'Allah will increase our favors if we are grateful.', isCorrect: true },
          { text: 'If I fail, I will try again with Sabr.', isCorrect: true },
          { text: 'We will find peace if we remember Allah.', isCorrect: true },
          { text: 'InshaAllah, if I have time, I will visit you.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b1-con-root', label: 'CONDITIONALS (0 & 1)', type: 'root', children: [
        { id: 'zero', label: 'Zero (Fakta/Hukum Alam)', type: 'main', children: [
          { id: 'z-form', label: 'If + Pres Simple, Pres Simple', type: 'formula' }
        ]},
        { id: 'first', label: 'First (Rencana/Peluang)', type: 'main', children: [
          { id: 'f-form', label: 'If + Pres Simple, Will + V1', type: 'formula' },
          { id: 'f-mod', label: 'Can/May/Should variation', type: 'sub' }
        ]},
        { id: 'unl', label: 'Unless = If Not', type: 'warning' }
      ]
    }
  },
  {
    id: 'b1-relative-clauses',
    title: '5. Relative Clauses (Defining)',
    level: 'B1',
    icon: 'fa-link',
    description: 'Menyambungkan informasi penting pada benda tanpa harus membuat kalimat baru yang terputus-putus.',
    sections: [
      {
        heading: '1. Filosofi: Jembatan Informasi Spesifik',
        content: 'Relative Clauses berfungsi sebagai kartu identitas bagi sebuah kata benda. Tanpa klausa ini, sebuah kalimat mungkin akan terdengar sangat umum atau membosankan. Kita menggunakan kata penghubung seperti *Who, Which, That, Whose,* dan *Where* untuk menambahkan detail yang vital.\n\nBayangkan Anda berkata "I see a man". Kalimat ini sangat hambar. Namun dengan relative clause: "I see a man WHO is wearing a green robe". Sekarang, pendengar tahu persis laki-laki mana yang Anda maksud. Ini adalah teknik untuk membangun presisi dan kedalaman dalam narasi Anda.',
        examples: [
          { text: 'The student who studies hard will succeed.', isCorrect: true },
          { text: 'The book that you gave me is interesting.', isCorrect: true },
          { text: 'The mosque where we pray is very beautiful.', isCorrect: true },
          { text: 'I know the person whose car was stolen.', isCorrect: true },
          { text: 'This is the city which I love.', isCorrect: true }
        ]
      },
      {
        heading: '2. Who vs Which vs That: Memilih yang Tepat',
        content: 'Aturan dasarnya sangat logis: "Who" digunakan untuk manusia, "Which" digunakan untuk benda atau hewan, dan "That" sangat fleksibel karena bisa digunakan untuk keduanya (meskipun lebih sering untuk benda dalam konteks informal).\n\nKesalahan umum adalah tertukarnya penggunaan ini, seperti "The boy which...". Membiasakan diri menggunakan "Who" untuk manusia adalah tanda penghormatan bahasa yang benar. Di level B1, Anda harus mulai peka terhadap pemilihan ini agar kalimat Anda terdengar lebih terstruktur dan sesuai dengan norma tata bahasa internasional.',
        examples: [
          { text: 'The doctor WHO treated me was kind.', isCorrect: true },
          { text: 'The computer WHICH I bought is fast.', isCorrect: true },
          { text: 'The person THAT called you is my brother.', isCorrect: true },
          { text: 'The cat WHICH lives there is cute.', isCorrect: true },
          { text: 'A teacher WHO inspires students is a hero.', isCorrect: true }
        ]
      },
      {
        heading: '3. Whose dan Where: Kepemilikan dan Lokasi',
        content: '"Whose" adalah satu-satunya relative pronoun yang menunjukkan kepemilikan. Ia menggantikan kata ganti seperti "his, her, its, atau their". Sementara itu, "Where" digunakan secara spesifik untuk merujuk pada tempat kejadian sebuah aksi.\n\nKedua kata ini memberikan detail yang sangat kaya. "Whose" membantu Anda mendeskripsikan hubungan antar orang atau benda dengan efisien. "Where" membantu Anda membangun *setting* atau lokasi dalam sebuah cerita tanpa perlu mengulang nama tempat tersebut berkali-kali.',
        examples: [
          { text: 'The boy whose father is an imam is my friend.', isCorrect: true },
          { text: 'This is the house where I was born.', isCorrect: true },
          { text: 'The girl whose cat is lost looks sad.', isCorrect: true },
          { text: 'Medina is the place where the Prophet migrated.', isCorrect: true },
          { text: 'I like shops where they sell authentic products.', isCorrect: true }
        ]
      },
      {
        heading: '4. Menghilangkan Relative Pronoun (Ellipsis)',
        content: 'Dalam bahasa Inggris, terkadang kita boleh menghilangkan kata *Who, Which,* atau *That* jika mereka bertindak sebagai OBJEK dalam klausa tersebut. Hal ini membuat bicara kita terdengar lebih cepat dan alami bagi penutur asli.\n\nAturannya: Jika setelah relative pronoun ada subjek baru (I, you, Ali, etc.), maka kata tersebut boleh dihilangkan. Contoh: "The book (that) I read". Namun, jika relative pronoun tersebut adalah subjeknya sendiri (diikuti langsung oleh kata kerja), maka ia TIDAK BOLEH dihilangkan. Memahami trik ini akan membuat Anda terdengar lebih mahir.',
        examples: [
          { text: 'The book (that) I bought is great.', isCorrect: true, note: 'Boleh dihilangkan.' },
          { text: 'The man (who) you saw is my uncle.', isCorrect: true, note: 'Boleh dihilangkan.' },
          { text: 'The teacher who teaches us is nice.', isCorrect: true, note: 'TIDAK boleh dihilangkan.' },
          { text: 'The car (which) they drive is old.', isCorrect: true },
          { text: 'The students (that) we met were smart.', isCorrect: true }
        ]
      },
      {
        heading: '5. Konteks Identitas Muslim yang Jelas',
        content: 'Dalam Adab, kejelasan informasi adalah amanah. Menggunakan relative clauses membantu kita mendefinisikan identitas orang atau hal-hal mulia dengan tepat agar tidak terjadi kesalahpahaman. Misalnya, menyebutkan "The Prophet who brought Islam" memberikan penegasan identitas yang kuat.\n\nKetepatan dalam mendeskripsikan orang juga menghindari fitnah. Dengan memberikan detail yang akurat ("Laki-laki yang memakai jam tangan merah itu"), kita membantu orang lain mengidentifikasi objek dengan benar. Bahasa yang detail adalah wujud dari karakter pembelajar yang teliti dan jujur dalam menyampaikan fakta.',
        examples: [
          { text: 'He is the man who always helps the poor.', isCorrect: true },
          { text: 'The Quran is the light that guides us.', isCorrect: true },
          { text: 'Ramadan is the month when we fast.', isCorrect: true },
          { text: 'A Muslim is a person who respects others.', isCorrect: true },
          { text: 'This is the knowledge that benefits humanity.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b1-rel-root', label: 'RELATIVE CLAUSES', type: 'root', children: [
        { id: 'pron', label: 'Pronouns', type: 'main', children: [
          { id: 'who-p', label: 'Who (People)', type: 'sub' },
          { id: 'whi-p', label: 'Which (Things)', type: 'sub' },
          { id: 'tha-p', label: 'That (Both - Informal)', type: 'sub' },
          { id: 'who-s', label: 'Whose (Ownership)', type: 'sub' }
        ]},
        { id: 'place', label: 'Where (Places)', type: 'main' },
        { id: 'rule', label: 'Omission Rule', type: 'warning', detail: 'Can drop if pronoun is the OBJECT.' }
      ]
    }
  },
  {
    id: 'b1-modals-deduction',
    title: '6. Modals of Deduction (Present)',
    level: 'B1',
    icon: 'fa-search-plus',
    description: 'Belajar membuat spekulasi dan tebakan cerdas berdasarkan bukti yang ada menggunakan Must, Might, dan Can\'t.',
    sections: [
      {
        heading: '1. Must: Kepastian 100% Positif',
        content: 'Dalam konteks deduksi, "Must" bukan berarti "harus", melainkan "pasti". Kita menggunakannya ketika kita merasa sangat yakin akan sesuatu berdasarkan bukti yang sangat kuat di depan mata kita. Ini adalah puncak dari keyakinan logika.\n\nMisalnya, Anda melihat seseorang turun dari mobil mewah dan memakai jam tangan mahal. Anda berspekulasi: "He MUST be rich". Penggunaan "Must" di sini menunjukkan bahwa Anda telah menarik kesimpulan yang tidak terbantahkan dari petunjuk-petunjuk fisik yang ada.',
        examples: [
          { text: 'It\'s raining, so he must be wet.', isCorrect: true },
          { text: 'They have five cars; they must be wealthy.', isCorrect: true },
          { text: 'She is smiling; she must be happy.', isCorrect: true },
          { text: 'He is wearing a white coat; he must be a doctor.', isCorrect: true },
          { text: 'The lights are off; they must be sleeping.', isCorrect: true }
        ]
      },
      {
        heading: '2. Can\'t: Kepastian 100% Negatif',
        content: 'Banyak pelajar mengira lawan kata dari "Must" dalam deduksi adalah "Must not". Padahal, untuk menyatakan "Pasti Tidak", kita menggunakan kata "CAN\'T". Ini digunakan untuk sesuatu yang kita rasa mustahil terjadi karena bertentangan dengan bukti yang ada.\n\nContoh: "Dia baru saja makan dua piring nasi, dia pasti tidak (can\'t) lapar lagi". Kesalahan menggunakan "Must not" untuk deduksi negatif adalah salah satu penanda paling umum bagi pelajar tingkat menengah. Ingatlah: Must = Pasti Ya, Can\'t = Pasti Tidak.',
        examples: [
          { text: 'He just ate; he can\'t be hungry.', isCorrect: true },
          { text: 'She is in Jakarta; she can\'t be in London now.', isCorrect: true },
          { text: 'The door is locked; he can\'t be inside.', isCorrect: true },
          { text: 'This answer can\'t be right; it doesn\'t make sense.', isCorrect: true },
          { text: 'They are shouting; they can\'t be happy.', isCorrect: true }
        ]
      },
      {
        heading: '3. Might, May, Could: Ketidakpastian (50%)',
        content: 'Ketika kita tidak yakin dan hanya sekadar menebak kemungkinan, kita menggunakan *Might, May,* atau *Could*. Ketiganya memiliki makna yang hampir sama di level B1: "Mungkin". Ini adalah bahasa untuk spekulasi yang hati-hati.\n\nMenggunakan kata-kata ini menunjukkan bahwa Anda adalah orang yang objektif dan tidak terburu-buru mengambil kesimpulan tanpa bukti yang lengkap. Dalam diskusi akademik atau pemecahan masalah, modal verbs ini sangat sering digunakan untuk mengeksplorasi berbagai kemungkinan solusi.',
        examples: [
          { text: 'He is late; he might be stuck in traffic.', isCorrect: true },
          { text: 'It may rain later, so take an umbrella.', isCorrect: true },
          { text: 'The keys could be in the kitchen.', isCorrect: true },
          { text: 'She might not come to the party.', isCorrect: true },
          { text: 'They could be at the mosque now.', isCorrect: true }
        ]
      },
      {
        heading: '4. Struktur Kalimat: Modals + Be + Adjective/-ing',
        content: 'Untuk deduksi tentang status saat ini, polanya adalah **Modal + Be + Kata Sifat**. Sedangkan untuk deduksi tentang aksi yang mungkin sedang dilakukan, polanya adalah **Modal + Be + Verb-ing**.\n\nMemahami struktur ini memungkinkan Anda untuk mendeskripsikan situasi yang sedang berlangsung dengan nuansa kepastian yang berbeda. Misalnya, mendengar suara berisik dari lantai atas: "They must be playing". Penguasaan pola ini akan membuat bahasa Inggris Anda terdengar jauh lebih luwes dan deskriptif.',
        examples: [
          { text: 'He must be tired.', isCorrect: true, note: 'Status/Sifat.' },
          { text: 'She might be sleeping.', isCorrect: true, note: 'Aksi sedang berlangsung.' },
          { text: 'They can\'t be working at this hour.', isCorrect: true },
          { text: 'It must be freezing outside.', isCorrect: true },
          { text: 'They could be waiting for us.', isCorrect: true }
        ]
      },
      {
        heading: '5. Etika Prasangka: Menghindari Su\'udzon',
        content: 'Dalam Islam, kita dilarang untuk berprasangka buruk (*Su\'udzon*). Penggunaan modals of deduction mengajarkan kita untuk memilih kata dengan bijak. Gunakanlah "Might" atau "Could" daripada "Must" jika menyangkut hal negatif tentang orang lain, agar kita tidak menuduh tanpa bukti yang nyata.\n\nSebaliknya, gunakan "Must" untuk memberikan prasangka baik (*Husnudzon*). "He must be busy with his prayers" terdengar jauh lebih mulia daripada menebak hal yang buruk. Bahasa adalah cerminan ketakwaan hati, maka gunakanlah modals ini untuk menjaga lisan kita dari perkataan yang tidak berdasar.',
        examples: [
          { text: 'He is not here; he must be doing a good deed.', isCorrect: true },
          { text: 'She didn\'t answer; she might be tired.', isCorrect: true },
          { text: 'They are quiet; they must be concentrating on their study.', isCorrect: true },
          { text: 'Let\'s think positive; they could be on their way.', isCorrect: true },
          { text: 'He hasn\'t arrived; there must be a good reason.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b1-ded-root', label: 'MODALS OF DEDUCTION', type: 'root', children: [
        { id: 'pos-d', label: 'Sure (YES)', type: 'main', children: [
          { id: 'must-d', label: 'MUST (90-100%)', type: 'sub' }
        ]},
        { id: 'neg-d', label: 'Sure (NO)', type: 'main', children: [
          { id: 'cant-d', label: 'CAN\'T (90-100%)', type: 'sub' }
        ]},
        { id: 'uns-d', label: 'Not Sure', type: 'main', children: [
          { id: 'prob-d', label: 'Might / May / Could (50%)', type: 'sub' }
        ]},
        { id: 'struc-d', label: 'Form: Modal + Be + Adj/V-ing', type: 'formula' }
      ]
    }
  },
  {
    id: 'b1-used-to',
    title: '7. Used to: Past Habits & States',
    level: 'B1',
    icon: 'fa-history',
    description: 'Menceritakan kebiasaan masa lalu yang sudah tidak dilakukan lagi sekarang untuk menunjukkan perubahan hidup.',
    sections: [
      {
        heading: '1. Filosofi Perubahan: Masa Lalu vs Sekarang',
        content: '"Used to" digunakan secara khusus untuk aksi yang terjadi berulang kali di masa lalu namun SUDAH BERHENTI sepenuhnya saat ini, atau untuk kondisi (states) yang dulunya benar tapi sekarang tidak lagi.\n\nTenses ini adalah alat utama untuk menunjukkan evolusi diri. "I used to be shy" berarti sekarang Anda sudah percaya diri. Tanpa "Used to", Anda mungkin akan bingung menjelaskan perbedaan gaya hidup Anda dulu dan sekarang dalam satu kalimat yang padu.',
        examples: [
          { text: 'I used to play football every day.', isCorrect: true, note: 'Sekarang tidak lagi.' },
          { text: 'She used to live in London.', isCorrect: true, note: 'Sekarang tinggal di tempat lain.' },
          { text: 'We used to be best friends.', isCorrect: true },
          { text: 'They used to travel a lot before the pandemic.', isCorrect: true },
          { text: 'He used to smoke, but he quit.', isCorrect: true }
        ]
      },
      {
        heading: '2. Struktur Kalimat Positif, Negatif, dan Tanya',
        content: 'Pola positifnya adalah **Subject + Used to + Verb 1**. Namun, saat menjadi negatif atau tanya, kita menggunakan kata bantu "DID". Aturan emasnya: saat DID muncul, akhiran "-d" pada kata *used* harus dihilangkan, menjadi "DIDN\'T USE TO".\n\nBanyak pembelajar melakukan kesalahan fatal dengan tetap menulis "didn\'t used to". Ingatlah logika "DID Sang Pencuri": ia mengambil beban masa lalu dari kata kerjanya. Latihlah perubahan ini agar Anda terdengar lancar saat menceritakan hal-hal yang dulu tidak pernah Anda lakukan.',
        examples: [
          { text: 'I didn\'t use to like vegetables.', isCorrect: true },
          { text: 'Did you use to wear glasses?', isCorrect: true },
          { text: 'She didn\'t use to study hard.', isCorrect: true },
          { text: 'Did they use to live near here?', isCorrect: true },
          { text: 'We didn\'t use to have computers in school.', isCorrect: true }
        ]
      },
      {
        heading: '3. Used To vs Past Simple: Kapan Pilih Mana?',
        content: 'Meskipun keduanya membicarakan masa lalu, Past Simple digunakan untuk kejadian satu kali yang spesifik (seperti "I went to Mecca in 2010"). Sedangkan "Used to" digunakan untuk kebiasaan atau kondisi yang berlangsung lama dan berulang.\n\nJika Anda ingin menekankan rutinitas masa kecil Anda, "Used to" adalah pilihan yang jauh lebih baik dan bergaya bahasa lebih tinggi daripada sekadar Past Simple. Ia memberikan kesan "era" atau "zaman" tertentu dalam kehidupan Anda yang sudah berlalu.',
        examples: [
          { text: 'I used to go to that school.', isCorrect: true, note: 'Kebiasaan bertahun-tahun.' },
          { text: 'I went to that school yesterday.', isCorrect: true, note: 'Kejadian satu kali.' },
          { text: 'She used to drink tea every morning.', isCorrect: true },
          { text: 'She drank a tea this morning.', isCorrect: true },
          { text: 'We used to play here every summer.', isCorrect: true }
        ]
      },
      {
        heading: '4. Perbedaan dengan "Be Used To" (Hati-hati!)',
        content: 'Satu jebakan besar bagi pelajar B1 adalah tertukarnya "Used to" dengan "Be used to". "Used to" (tanpa am/is/are) membicarakan masa lalu. Sedangkan "Be used to" (dengan am/is/are) berarti "Terbiasa" dengan sesuatu yang mungkin baru atau sulit bagi Anda.\n\nContoh: "I am used to the cold" (Saya sudah terbiasa dengan dingin sekarang). Struktur "Be used to" harus diikuti oleh kata benda atau Verb-ing. Memahami perbedaan ini sangat penting agar Anda tidak salah menyampaikan status adaptasi Anda saat ini dengan memori masa lalu.',
        examples: [
          { text: 'I used to drive.', isCorrect: true, note: 'Dulu menyetir, sekarang tidak.' },
          { text: 'I am used to driving.', isCorrect: true, note: 'Saya terbiasa menyetir sekarang.' },
          { text: 'She used to eat spicy food.', isCorrect: true },
          { text: 'She is used to eating spicy food.', isCorrect: true },
          { text: 'We are used to the noisy traffic.', isCorrect: true }
        ]
      },
      {
        heading: '5. Konteks Hijrah: Menceritakan Transformasi Diri',
        content: 'Dalam Islam, konsep Hijrah atau perubahan menuju yang lebih baik sangat dihargai. Menggunakan "Used to" membantu kita menceritakan titik balik dalam hidup kita dengan bangga namun tetap rendah hati. "I used to waste my time" memberikan konteks betapa Anda sudah berkembang sekarang.\n\nNarasi tentang perubahan kebiasaan buruk menjadi baik adalah motivasi bagi orang lain. Gunakanlah struktur ini untuk memberikan testimoni tentang perjalanan iman Anda, bagaimana Allah membimbing Anda keluar dari kebiasaan masa lalu yang kurang bermanfaat menuju cahaya istiqomah saat ini.',
        examples: [
          { text: 'I used to pray late, but now I pray on time.', isCorrect: true },
          { text: 'We used to ignore our neighbors, now we help them.', isCorrect: true },
          { text: 'He used to be arrogant, now he is humble.', isCorrect: true },
          { text: 'I didn\'t use to recite the Quran every day.', isCorrect: true },
          { text: 'She used to spend all her money on toys.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b1-used-root', label: 'USED TO', type: 'root', children: [
        { id: 'usage-u', label: 'Past Habits/States', type: 'main', children: [
          { id: 'done', label: 'Finished now', type: 'sub' },
          { id: 'not-one', label: 'NOT for one-time events', type: 'warning' }
        ]},
        { id: 'struc-u', label: 'Structure', type: 'formula', children: [
          { id: 'pos-u', label: '+ Used to + V1', type: 'sub' },
          { id: 'neg-u', label: '- Didn\'t use to + V1', type: 'sub' },
          { id: 'que-u', label: '? Did .. use to + V1', type: 'sub' }
        ]},
        { id: 'conf', label: 'Don\'t confuse with...', type: 'warning', detail: '"Be used to" (Terbiasa sekarang)' }
      ]
    }
  },
  {
    id: 'b1-future-arrangements',
    title: '8. Present Continuous for Future',
    level: 'B1',
    icon: 'fa-calendar-check',
    description: 'Menggunakan bentuk "-ing" untuk membicarakan janji temu dan rencana yang sudah dipastikan jadwalnya.',
    sections: [
      {
        heading: '1. Filosofi Kepastian: Lebih dari Sekadar Niat',
        content: 'Di level B1, kita belajar bahwa Present Continuous (am/is/are + -ing) tidak hanya untuk aksi yang sedang terjadi SEKARANG, tapi juga untuk masa depan. Namun, ada syarat ketat: aksi tersebut harus berupa RENCANA YANG SUDAH DIATUR (Fixed Arrangement).\n\nApa bedanya dengan "Going to"? "Going to" baru sekadar niat di hati. "Present Continuous" berarti Anda sudah melakukan aksi nyata untuk mewujudkannya, seperti sudah membeli tiket, memesan meja, atau membuat janji dengan orang lain. Ini adalah tenses untuk tingkat kepastian tertinggi dalam perencanaan.',
        examples: [
          { text: 'I am meeting the doctor tomorrow at 10.', isCorrect: true, note: 'Sudah buat janji.' },
          { text: 'We are flying to Medina next Friday.', isCorrect: true, note: 'Sudah punya tiket.' },
          { text: 'She is having dinner with Ali tonight.', isCorrect: true },
          { text: 'They are playing a match this evening.', isCorrect: true },
          { text: 'I am starting my new job on Monday.', isCorrect: true }
        ]
      },
      {
        heading: '2. Peran Keterangan Waktu (Time Expressions)',
        content: 'Karena bentuknya identik dengan aksi yang terjadi sekarang, penggunaan keterangan waktu masa depan sangat krusial dalam struktur ini. Tanpa kata seperti "tomorrow", "next week", atau "tonight", pendengar akan mengira Anda sedang melakukannya saat ini.\n\nKeterangan waktu bertindak sebagai jangkar yang memindahkan makna kalimat ke masa depan. Membiasakan diri mencantumkan waktu spesifik menunjukkan bahwa Anda adalah orang yang teratur dan memiliki manajemen jadwal yang baik dalam berkomunikasi.',
        examples: [
          { text: 'I am praying now.', isCorrect: true, note: 'Present action.' },
          { text: 'I am praying with the group at 7 PM.', isCorrect: true, note: 'Future arrangement.' },
          { text: 'They are arriving in an hour.', isCorrect: true },
          { text: 'She is getting married next month.', isCorrect: true },
          { text: 'We are leaving for Jakarta tomorrow morning.', isCorrect: true }
        ]
      },
      {
        heading: '3. Membatalkan Rencana dengan Elegan',
        content: 'Dalam dunia profesional dan sosial, membatalkan janji harus dilakukan dengan jelas. Menggunakan bentuk negatif "I am not coming" memberikan kepastian kepada lawan bicara bahwa Anda tidak akan hadir karena ada perubahan jadwal yang sudah pasti.\n\nIni terdengar lebih meyakinkan daripada berkata "I won\'t come" yang terkadang terdengar seperti keputusan mendadak. Dengan Present Continuous, Anda memberikan kesan bahwa pembatalan tersebut adalah bagian dari penyesuaian jadwal yang sudah Anda pertimbangkan dengan matang.',
        examples: [
          { text: 'I\'m sorry, I\'m not attending the meeting tonight.', isCorrect: true },
          { text: 'She isn\'t joining us for lunch tomorrow.', isCorrect: true },
          { text: 'We aren\'t traveling this weekend anymore.', isCorrect: true },
          { text: 'They aren\'t showing the movie today.', isCorrect: true },
          { text: 'He isn\'t working this coming Saturday.', isCorrect: true }
        ]
      },
      {
        heading: '4. Bertanya Tentang Jadwal Orang Lain',
        content: 'Pola tanya "What are you doing...?" adalah cara paling umum untuk menanyakan rencana seseorang tanpa terkesan terlalu ingin tahu. Ini adalah pertanyaan sopan untuk mengecek ketersediaan waktu seseorang sebelum Anda mengajukan ajakan atau permintaan.\n\nJawaban untuk pertanyaan ini biasanya juga menggunakan Present Continuous untuk menunjukkan kepastian jadwal masing-masing. Menguasai pola tanya-jawab ini sangat vital untuk kelancaran interaksi sosial di lingkungan kerja maupun komunitas.',
        examples: [
          { text: 'What are you doing this weekend?', isCorrect: true },
          { text: 'Is he coming to the study group tonight?', isCorrect: true },
          { text: 'Are they visiting their parents next Sunday?', isCorrect: true },
          { text: 'When are you finishing your project?', isCorrect: true },
          { text: 'Where are we meeting tomorrow?', isCorrect: true }
        ]
      },
      {
        heading: '5. Konteks Disiplin: Menghargai Janji (Al-Wa\'d)',
        content: 'Dalam Islam, menepati janji adalah salah satu tanda orang beriman. Menggunakan tenses yang menunjukkan kepastian jadwal mencerminkan keseriusan kita dalam menjaga komitmen sosial. Kita tidak boleh sembarangan membuat janji yang tidak berniat kita tepati.\n\nBahasa yang pasti membantu kita menghindari kesalahpahaman yang bisa merusak ukhuwwah. Saat kita berkata "I am meeting you", kita sedang memberikan kata-kata yang harus dipertanggungjawabkan. Jadikanlah ketelitian bahasa ini sebagai bagian dari integritas karakter Anda dalam membangun hubungan yang terpercaya dengan sesama.',
        examples: [
          { text: 'I am visiting the sick brother after Asr.', isCorrect: true },
          { text: 'We are gathering for the community service at 8 AM.', isCorrect: true },
          { text: 'InshaAllah, I am hosting the dinner tomorrow.', isCorrect: true },
          { text: 'They are donating the food this afternoon.', isCorrect: true },
          { text: 'I am attending the Islamic lecture on Saturday.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b1-ffa-root', label: 'FUTURE ARRANGEMENTS', type: 'root', children: [
        { id: 'logic-f', label: 'Logic: Fixed Plans', type: 'main', children: [
          { id: 'con-f', label: 'Confirmed with others', type: 'sub' },
          { id: 'tic-f', label: 'Booking/Tickets done', type: 'sub' }
        ]},
        { id: 'form-f', label: 'Form: Be + V-ing', type: 'formula', children: [
          { id: 'time-f', label: 'Must include FUTURE time', type: 'warning' }
        ]},
        { id: 'diff-f', label: 'vs Going to', type: 'sub', detail: 'Arrangement (Fixed) vs Intention (Plan in head)' }
      ]
    }
  },
  {
    id: 'b1-quantifiers',
    title: '9. Advanced Quantifiers',
    level: 'B1',
    icon: 'fa-balance-scale',
    description: 'Menguasai penggunaan "Few, Little, Plenty of, dan Enough" untuk presisi kuantitas dalam berbagai konteks.',
    sections: [
      {
        heading: '1. A Few vs Few: Nuansa Positif vs Negatif',
        content: 'Dalam bahasa Inggris, ada perbedaan besar antara menambahkan "A" atau tidak di depan kata "Few". "A few" bermakna positif (beberapa - cukup untuk digunakan), sedangkan "Few" bermakna negatif (sedikit sekali - hampir tidak ada/tidak cukup).\n\nMemahami perbedaan halus ini sangat penting untuk menyampaikan perasaan Anda terhadap sebuah jumlah. Jika Anda berkata "I have a few friends", Anda merasa senang karena punya teman. Jika "I have few friends", Anda mungkin merasa kesepian. Ketelitian ini menunjukkan kematangan emosional Anda dalam berbahasa.',
        examples: [
          { text: 'I have a few dates to eat.', isCorrect: true, note: 'Cukup untuk cemilan.' },
          { text: 'He has few dates left.', isCorrect: true, note: 'Hampir habis.' },
          { text: 'There are a few mosques in this area.', isCorrect: true },
          { text: 'Few people know the real truth.', isCorrect: true, note: 'Sangat sedikit orang.' },
          { text: 'A few students passed the test.', isCorrect: true }
        ]
      },
      {
        heading: '2. A Little vs Little: Logika Benda Tak Terhitung',
        content: 'Prinsip yang sama berlaku untuk benda tak terhitung (uncountable). "A little" bermakna positif (sedikit tapi ada), sedangkan "Little" bermakna negatif (sangat sedikit, hampir habis/kurang).\n\nMisalnya, saat menawarkan bantuan, "I have a little time" terdengar ramah. Namun, "I have little time" terdengar seperti Anda sedang terburu-buru dan tidak bisa diganggu. Pilihlah kata yang tepat agar niat baik Anda tersampaikan dengan nuansa yang benar kepada lawan bicara.',
        examples: [
          { text: 'I need a little water, please.', isCorrect: true },
          { text: 'There is little water in the desert.', isCorrect: true, note: 'Sangat kering.' },
          { text: 'He showed a little interest in the project.', isCorrect: true },
          { text: 'We have little money to waste.', isCorrect: true },
          { text: 'A little patience can solve many problems.', isCorrect: true }
        ]
      },
      {
        heading: '3. Plenty of: Kelimpahan yang Menenangkan',
        content: '"Plenty of" adalah quantifiers yang digunakan untuk menyatakan jumlah yang LEBIH DARI CUKUP. Kata ini bisa digunakan baik untuk benda yang bisa dihitung maupun yang tidak bisa dihitung. Ia memberikan kesan kelimpahan dan ketenangan.\n\nDalam situasi yang menegangkan, menggunakan "Plenty of" bisa memberikan efek menenangkan. "Don\'t worry, we have plenty of time". Penggunaan kata ini menunjukkan bahwa Anda adalah orang yang optimis dan mampu mengelola sumber daya dengan baik.',
        examples: [
          { text: 'There is plenty of food for everyone.', isCorrect: true },
          { text: 'We have plenty of books in our library.', isCorrect: true },
          { text: 'Don\'t rush, you have plenty of time.', isCorrect: true },
          { text: 'She has plenty of ideas for the event.', isCorrect: true },
          { text: 'There are plenty of reasons to be happy.', isCorrect: true }
        ]
      },
      {
        heading: '4. Enough: Batas Kecukupan',
        content: 'Kata "Enough" (cukup) memiliki aturan posisi yang unik. Jika digunakan dengan KATA BENDA, ia diletakkan di DEPAN (enough water). Namun, jika digunakan dengan KATA SIFAT atau KATA KETERANGAN, ia diletakkan di BELAKANG (good enough, fast enough).\n\nKesalahan posisi "Enough" adalah salah satu kesalahan yang paling sering dilakukan oleh pemula. Menguasai posisi ini akan membuat kalimat Anda terdengar jauh lebih alami dan profesional. "Enough" membantu kita mendefinisikan batasan kepuasan atau kebutuhan kita secara akurat.',
        examples: [
          { text: 'I have enough money for the ticket.', isCorrect: true, note: 'Before noun.' },
          { text: 'Is the room big enough?', isCorrect: true, note: 'After adjective.' },
          { text: 'He speaks English well enough to work.', isCorrect: true },
          { text: 'We don\'t have enough chairs.', isCorrect: true },
          { text: 'You are old enough to decide.', isCorrect: true }
        ]
      },
      {
        heading: '5. Konteks Qanaah: Cukup dalam Nikmat',
        content: 'Dalam Islam, kita diajarkan sifat Qanaah (merasa cukup). Pemilihan quantifiers yang tepat membantu kita mengekspresikan rasa syukur atas nikmat yang Allah berikan, baik itu "A little" (yang tetap disyukuri) maupun "Plenty of" (yang tidak boleh membuat sombong).\n\nBahasa yang kita gunakan untuk mendeskripsikan rezeki mencerminkan isi hati kita. Dengan berkata "I have enough" alih-alih mengeluh tentang kekurangan, kita mempraktikkan kesantunan spiritual. Gunakanlah kata-kata ini untuk menjaga integritas syukur kita dalam setiap keadaan rezeki yang kita terima.',
        examples: [
          { text: 'A little gratitude brings more blessings.', isCorrect: true },
          { text: 'We have plenty of reasons to praise Allah.', isCorrect: true },
          { text: 'Is our faith strong enough to face trials?', isCorrect: true },
          { text: 'Few people truly understand the value of time.', isCorrect: true },
          { text: 'Give even if you have only a little.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b1-qua-root', label: 'ADVANCED QUANTIFIERS', type: 'root', children: [
        { id: 'few-lit', label: 'Positive vs Negative', type: 'main', children: [
          { id: 'a-few-lit', label: 'A few/A little: Positive (+) Enough', type: 'sub' },
          { id: 'few-lit-n', label: 'Few/Little: Negative (-) Not enough', type: 'sub' }
        ]},
        { id: 'plenty', label: 'Plenty of: More than enough', type: 'main' },
        { id: 'enough-rule', label: 'Enough Rule', type: 'formula', children: [
          { id: 'en-n', label: 'Enough + Noun', type: 'sub' },
          { id: 'adj-en', label: 'Adjective + Enough', type: 'sub' }
        ]}
      ]
    }
  },
  {
    id: 'b1-gerunds-infinitives',
    title: '10. Gerunds and Infinitives (Part 1)',
    level: 'B1',
    icon: 'fa-shapes',
    description: 'Memahami kapan harus menggunakan akhiran "-ing" atau awalan "to" setelah kata kerja tertentu.',
    sections: [
      {
        heading: '1. Filosofi: Pasangan Kata Kerja yang Harmonis',
        content: 'Dalam bahasa Inggris, ketika dua kata kerja muncul berturut-turut, kata kerja kedua harus berubah wujud menjadi "Gerund" (-ing) atau "Infinitive" (to + V1). Tidak ada rumus pasti; ini murni masalah "pasangan" yang sudah ditetapkan oleh tradisi bahasa.\n\nMemahami pasangan ini adalah langkah besar menuju kefasihan level menengah. Jika Anda salah memasangkannya (seperti berkata "I want going"), penutur asli tetap akan mengerti, namun Anda akan terdengar sangat asing. Menghafal kelompok kata kerja ini secara bertahap akan membangun insting bahasa yang kuat.',
        examples: [
          { text: 'I want to study English.', isCorrect: true, note: 'Want + Infinitive.' },
          { text: 'I enjoy studying English.', isCorrect: true, note: 'Enjoy + Gerund.' },
          { text: 'They decided to leave early.', isCorrect: true },
          { text: 'She suggested going to the park.', isCorrect: true },
          { text: 'We hope to see you soon.', isCorrect: true }
        ]
      },
      {
        heading: '2. Kelompok Gerund: Fokus pada Aktivitas',
        content: 'Gerund (-ing) biasanya mengikuti kata kerja yang menunjukkan perasaan atau proses yang sedang dinikmati atau dihindari, seperti *enjoy, mind, avoid, finish, suggest, dan consider*. Gerund memperlakukan aksi tersebut sebagai sebuah konsep atau hobi.\n\nSeringkali pembelajar mencoba menambahkan "to" karena pengaruh bahasa ibu. Ingatlah: "I finish reading", bukan "I finish to read". Latihlah telinga Anda untuk mendengar ritme "-ing" setelah kata-kata kunci ini agar aliran bicara Anda terasa lebih natural dan tidak terputus-putus.',
        examples: [
          { text: 'I avoid eating junk food.', isCorrect: true },
          { text: 'Do you mind opening the window?', isCorrect: true },
          { text: 'She finished writing the book.', isCorrect: true },
          { text: 'They considered moving to another city.', isCorrect: true },
          { text: 'I keep thinking about the exam.', isCorrect: true }
        ]
      },
      {
        heading: '3. Kelompok Infinitive: Fokus pada Tujuan',
        content: 'Infinitive (to + V1) biasanya mengikuti kata kerja yang menunjukkan keinginan, rencana, atau janji di masa depan, seperti *want, hope, plan, decide, agree, dan refuse*. "To" di sini seolah-olah bertindak sebagai jembatan menuju tujuan masa depan.\n\nKarena sifatnya yang mengarah ke depan, infinitive memberikan nuansa niat dan komitmen. Menggunakan infinitive dengan benar membantu Anda menyampaikan ambisi dan keputusan Anda dengan cara yang tegas dan jelas kepada orang lain.',
        examples: [
          { text: 'I hope to visit Mecca next year.', isCorrect: true },
          { text: 'She refused to give up.', isCorrect: true },
          { text: 'We agreed to meet at the library.', isCorrect: true },
          { text: 'He plans to start a business.', isCorrect: true },
          { text: 'They need to buy some groceries.', isCorrect: true }
        ]
      },
      {
        heading: '4. Gerund Setelah Preposisi',
        content: 'Aturan emas yang paling mudah diingat adalah: SETIAP KATA KERJA yang muncul setelah preposisi (in, on, at, with, about, for, etc.) WAJIB dalam bentuk Gerund (-ing). Ini adalah aturan tanpa pengecualian yang akan menyelamatkan tata bahasa Anda.\n\nBanyak pelajar terjebak saat menggunakan frasa seperti "I am interested in...". Seringkali mereka lupa menambahkan "-ing" pada kata kerja berikutnya. Membiasakan pola ini akan secara instan meningkatkan akurasi tulisan dan ucapan Anda di berbagai situasi formal maupun santai.',
        examples: [
          { text: 'I am interested in learning Arabic.', isCorrect: true },
          { text: 'Thank you for helping me.', isCorrect: true },
          { text: 'He is good at solving puzzles.', isCorrect: true },
          { text: 'She is worried about failing the test.', isCorrect: true },
          { text: 'They succeeded in finishing the task.', isCorrect: true }
        ]
      },
      {
        heading: '5. Konteks Niat: Memurnikan Tujuan Ibadah',
        content: 'Dalam Islam, niat (Innamal a\'malu binniyat) adalah pondasi segala amal. Menggunakan infinitives (fokus tujuan) dan gerunds (fokus aktivitas) membantu kita merumuskan niat dengan jelas. "I plan TO help" (Infinitive) menekankan komitmen niat Anda.\n\nBegitu pula saat mendeskripsikan aktivitas ibadah yang kita nikmati ("I enjoy reciting..."). Bahasa membantu kita menstrukturkan pikiran tentang apa yang kita cintai dan apa yang kita tuju. Gunakanlah pola-pola ini untuk mendeskripsikan tujuan mulia Anda dalam mencari ilmu dan mendekatkan diri kepada Sang Pencipta.',
        examples: [
          { text: 'I hope to gain Allah\'s pleasure.', isCorrect: true },
          { text: 'We enjoy listening to Islamic lectures.', isCorrect: true },
          { text: 'She decided to wear the hijab.', isCorrect: true },
          { text: 'He is dedicated to serving his parents.', isCorrect: true },
          { text: 'They are looking forward to meeting the scholars.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'b1-g-i-root', label: 'GERUNDS & INFINITIVES', type: 'root', children: [
        { id: 'gerund', label: 'Gerund (-ing)', type: 'main', children: [
          { id: 'g-verbs', label: 'After: Enjoy, Mind, Avoid, Suggest', type: 'sub' },
          { id: 'g-prep', label: 'ALWAYS after prepositions', type: 'warning' }
        ]},
        { id: 'infinitive', label: 'Infinitive (to + V1)', type: 'main', children: [
          { id: 'i-verbs', label: 'After: Want, Hope, Decide, Plan', type: 'sub' }
        ]},
        { id: 'memo', label: 'Tip', type: 'formula', detail: 'Learn them in pairs, not isolated words.' }
      ]
    }
  }
];
