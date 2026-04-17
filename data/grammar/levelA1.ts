
import { GrammarLesson } from '../../types';

export const LEVEL_A1: GrammarLesson[] = [
  {
    id: 'a1-tobe',
    title: '1. Mastering To Be (Am, Is, Are)',
    level: 'A1',
    icon: 'fa-user',
    description: 'Fondasi Utama: Memahami jembatan identitas, status, dan kondisi dalam struktur kalimat bahasa Inggris.',
    sections: [
      {
        heading: '1. Filosofi To Be: Jembatan Identitas',
        content: 'Dalam bahasa Inggris, setiap kalimat wajib memiliki Kata Kerja (Verb). Namun, seringkali kita ingin menyatakan sesuatu yang bukan aksi fisik, melainkan status atau identitas, seperti "Saya seorang Muslim" atau "Dia bahagia". Di sinilah To Be berperan sebagai "Linking Verb" atau kata kerja penghubung yang bertindak seperti tanda sama dengan (=).\n\nTanpa To Be, kalimat dianggap cacat secara struktural dalam tata bahasa formal. Bayangkan To Be sebagai detak jantung yang menghidupkan hubungan antara Subjek dengan informasi di belakangnya. Jika Anda menghilangkannya, pendengar mungkin mengerti maksud Anda secara sekilas, namun secara hukum bahasa Anda belum membangun jembatan yang benar untuk menyambungkan ide-ide Anda.',
        examples: [
          { text: 'I am a student.', isCorrect: true, note: 'Am menghubungkan I dengan profesi.' },
          { text: 'The sky is blue.', isCorrect: true, note: 'Is menghubungkan subjek dengan sifat.' },
          { text: 'They are in the garden.', isCorrect: true, note: 'Are menghubungkan subjek dengan lokasi.' },
          { text: 'Islam is a religion of peace.', isCorrect: true, note: 'Is memberikan identitas pada subjek.' },
          { text: 'We are very grateful today.', isCorrect: true, note: 'Are menghubungkan subjek dengan kondisi emosional.' }
        ]
      },
      {
        heading: '2. Aturan Pasangan Subjek yang Tepat',
        content: 'To Be tidak bisa dipilih sembarangan; ia harus setia pada pasangannya masing-masing untuk menjaga harmoni dalam kalimat. "Am" adalah pasangan eksklusif untuk "I" (diri sendiri), "Is" dikhususkan untuk subjek tunggal (He, She, It, atau satu nama orang/benda), dan "Are" digunakan untuk subjek jamak atau lawan bicara (You, We, They).\n\nKesalahan dalam memasangkan subjek dan To Be adalah hal yang sangat fatal bagi pemula karena ini menunjukkan pemahaman dasar yang lemah. Menguasai pasangan ini secara otomatis (tanpa berpikir) adalah langkah pertama untuk mencapai kefasihan. Latihlah lidah Anda agar terbiasa dengan kombinasi ini sampai terasa sealami Anda bernapas dalam percakapan sehari-hari.',
        examples: [
          { text: 'He is an honest man.', isCorrect: true },
          { text: 'We are ready for the class.', isCorrect: true },
          { text: 'She is at the library now.', isCorrect: true },
          { text: 'I am here to help you learn.', isCorrect: true },
          { text: 'The students are very diligent.', isCorrect: true }
        ]
      },
      {
        heading: '3. Teknik Negasi (Penyangkalan)',
        content: 'Untuk menyatakan penyangkalan atau kata "Tidak", kita cukup meletakkan kata "NOT" tepat setelah To Be. Ini adalah cara yang paling sederhana dan efisien dalam bahasa Inggris untuk mengubah pernyataan positif menjadi negasi tanpa mengubah struktur kalimat lainnya secara drastis.\n\nDalam percakapan santai, penutur asli sering menggunakan singkatan (Contractions) seperti "isn\'t" atau "aren\'t" untuk mempercepat alur bicara. Namun, perlu diingat bahwa khusus untuk "am not", tidak ada singkatan standar seperti "amn\'t" dalam bahasa Inggris formal, jadi kita tetap menggunakan "am not" atau menyingkat subjeknya menjadi "I\'m not".',
        examples: [
          { text: 'I am not angry with you.', isCorrect: true },
          { text: 'He is not (isn\'t) arrogant.', isCorrect: true },
          { text: 'They are not (aren\'t) late today.', isCorrect: true },
          { text: 'The water is not (isn\'t) cold.', isCorrect: true },
          { text: 'We are not (aren\'t) tired yet.', isCorrect: true }
        ]
      },
      {
        heading: '4. Interogatif: Fenomena Inversi',
        content: 'Saat ingin bertanya menggunakan To Be, kita melakukan teknik "Inversi" atau pembalikan posisi. To Be akan melompat dari posisinya semula ke posisi paling depan, mendahului subjek. Fenomena ini berfungsi sebagai sinyal instan bagi pendengar bahwa Anda sedang mengajukan sebuah pertanyaan sebelum mereka mendengar seluruh isi kalimatnya.\n\nSelain perubahan posisi, nada suara Anda biasanya akan naik di akhir kalimat (rising intonation) untuk mempertegas bahwa itu adalah pertanyaan. Jawaban untuk pertanyaan jenis ini pun sangat sederhana, cukup gunakan "Yes" atau "No" diikuti dengan subjek dan To Be yang sesuai tanpa perlu mengulang seluruh kalimat.',
        examples: [
          { text: 'Are you a Muslim?', isCorrect: true },
          { text: 'Is he your English teacher?', isCorrect: true },
          { text: 'Am I in the right room?', isCorrect: true },
          { text: 'Are they from Indonesia?', isCorrect: true },
          { text: 'Is the book on the table?', isCorrect: true }
        ]
      },
      {
        heading: '5. Konteks Adab: Memuliakan Identitas',
        content: 'Menggunakan To Be dengan tepat dalam perkenalan adalah bagian dari Adab berkomunikasi dalam Islam. Menyebutkan identitas diri dan orang lain dengan kalimat yang lengkap dan benar menunjukkan rasa hormat, ketelitian, dan keseriusan kita dalam menjalin ukhuwwah (persaudaraan) melalui komunikasi yang jelas.\n\nKejelasan identitas sangat dihargai untuk menghindari prasangka (Su\'udzon) dan membangun kepercayaan. Dengan mengatakan "I am your brother" secara gramatikal yang tepat, Anda tidak hanya belajar bahasa, tapi juga mempraktikkan kejelasan informasi yang santun, lugas, dan penuh nilai-nilai kejujuran dalam setiap interaksi sosial.',
        examples: [
          { text: 'I am happy to meet you, brother.', isCorrect: true },
          { text: 'You are welcome in our home.', isCorrect: true },
          { text: 'He is a very pious person.', isCorrect: true },
          { text: 'We are neighbors in this city.', isCorrect: true },
          { text: 'She is a guest from Mecca.', isCorrect: true }
        ]
      }
    ],
    mindmap: { 
      id: 'a1-tobe-root', 
      label: 'TO BE SYSTEM', 
      type: 'root', 
      children: [
        { 
          id: 'logic', 
          label: 'Logic', 
          type: 'main', 
          children: [
            { id: 'ident', label: 'Identity Bridge (=)', type: 'sub' },
            { id: 'verb-rule', label: 'Required if no action verb', type: 'sub' }
          ] 
        },
        { 
          id: 'pairs', 
          label: 'Subject Pairs', 
          type: 'formula', 
          children: [
            { id: 'p1', label: 'I + Am', type: 'sub' },
            { id: 'p2', label: 'He/She/It + Is', type: 'sub' },
            { id: 'p3', label: 'You/We/They + Are', type: 'sub' }
          ] 
        },
        { 
          id: 'structures', 
          label: 'Sentence Types', 
          type: 'main', 
          children: [
            { id: 'neg', label: 'Negation: Add NOT', type: 'sub' },
            { id: 'que', label: 'Question: Inversion', type: 'sub' }
          ] 
        },
        { 
          id: 'adab-tobe', 
          label: 'Adab Context', 
          type: 'warning', 
          detail: 'Clear identity avoids Su\'udzon.' 
        }
      ]
    }
  },
  {
    id: 'a1-articles',
    title: '2. Articles & Determiners (A, An, The)',
    level: 'A1',
    icon: 'fa-font',
    description: 'Panduan menggunakan penanda benda untuk membedakan antara informasi umum dan spesifik.',
    sections: [
      {
        heading: '1. Indefinite Articles: A vs AN',
        content: 'Artikel "A" dan "An" digunakan untuk menyebutkan benda yang bersifat umum, belum spesifik, atau baru pertama kali disebutkan dalam sebuah percakapan. Perbedaan penggunaannya bukan berdasarkan huruf pertama kata benda tersebut, melainkan berdasarkan "bunyi" awal kata yang mengikutinya.\n\nGunakan "An" jika kata benda diawali dengan bunyi vokal (a, i, u, e, o), dan gunakan "A" jika diawali dengan bunyi konsonan. Memahami perbedaan bunyi ini sangat krusial karena beberapa kata yang diawali huruf konsonan justru memiliki bunyi vokal (seperti "hour"), dan sebaliknya (seperti "university").',
        examples: [
          { text: 'I saw a mosque yesterday.', isCorrect: true, note: 'Benda umum, baru disebut.' },
          { text: 'He is an honest man.', isCorrect: true, note: 'Honest berbunyi vokal /o/.' },
          { text: 'I want to buy a book.', isCorrect: true },
          { text: 'She ate an apple.', isCorrect: true },
          { text: 'A student is waiting outside.', isCorrect: true }
        ]
      },
      {
        heading: '2. Definite Article: Kekuatan Kata "THE"',
        content: '"The" digunakan ketika benda yang dimaksud sudah diketahui oleh pembicara maupun pendengar, atau benda tersebut hanya ada satu di dunia (unik). Penggunaan "The" memberikan kesan kepastian dan spesifikasi yang kuat dalam sebuah narasi.\n\nDalam bahasa Inggris, "The" bisa digunakan baik untuk benda tunggal maupun jamak. Penguasaan "The" menunjukkan bahwa Anda mampu mengarahkan perhatian pendengar pada satu titik fokus yang jelas, sehingga tidak terjadi kebingungan tentang objek mana yang sedang dibicarakan.',
        examples: [
          { text: 'The Quran is our guide.', isCorrect: true, note: 'Benda unik/spesifik.' },
          { text: 'Close the door, please.', isCorrect: true, note: 'Pintu yang sudah diketahui.' },
          { text: 'The sun rises in the east.', isCorrect: true, note: 'Hanya ada satu matahari.' },
          { text: 'The students are in the class.', isCorrect: true },
          { text: 'I liked the book you gave me.', isCorrect: true }
        ]
      },
      {
        heading: '3. Zero Article: Kapan Tidak Menggunakan Artikel',
        content: 'Ada saat-saat tertentu di mana kita tidak boleh meletakkan artikel apa pun di depan kata benda. Hal ini biasanya berlaku untuk nama orang, nama kota/negara, nama bahasa, dan kata benda abstrak yang bersifat umum atau jamak secara luas.\n\nKesalahan umum bagi pemula adalah meletakkan "The" di depan semua kata benda karena ingin terdengar formal. Padahal, penggunaan artikel yang berlebihan justru akan membuat kalimat Anda terdengar tidak alami dan kaku bagi penutur asli bahasa Inggris.',
        examples: [
          { text: 'I love Islam.', isCorrect: true, note: 'Bukan "The Islam".' },
          { text: 'He lives in Jakarta.', isCorrect: true, note: 'Bukan "The Jakarta".' },
          { text: 'Arabic is a beautiful language.', isCorrect: true },
          { text: 'Cats are cute animals.', isCorrect: true, note: 'Jamak umum.' },
          { text: 'Knowledge is light.', isCorrect: true }
        ]
      },
      {
        heading: '4. Determiners: This, That, These, Those',
        content: 'Determiner ini digunakan untuk menunjukkan posisi benda relatif terhadap pembicara. "This/These" untuk benda yang dekat secara fisik atau waktu, sedangkan "That/Those" untuk benda yang jauh. Ini adalah alat navigasi linguistik yang membantu kita berinteraksi dengan lingkungan sekitar.\n\nSelain jarak, kita juga harus memperhatikan jumlah benda. Gunakan "This/That" untuk benda tunggal, dan "These/Those" untuk benda yang berjumlah lebih dari satu. Ketepatan dalam memilih penunjuk ini menunjukkan ketelitian Anda dalam mendeskripsikan ruang dan kuantitas.',
        examples: [
          { text: 'This is my pen.', isCorrect: true },
          { text: 'That building is a mosque.', isCorrect: true },
          { text: 'These shoes are comfortable.', isCorrect: true },
          { text: 'Those stars look bright.', isCorrect: true },
          { text: 'I like this idea.', isCorrect: true }
        ]
      },
      {
        heading: '5. Etika Deskripsi: Kejelasan dan Kejujuran',
        content: 'Dalam konteks Adab, pemilihan artikel yang tepat mencerminkan kejujuran dan akurasi informasi. Menggunakan "The" untuk sesuatu yang belum pasti bisa dianggap memberikan informasi yang menyesatkan, sementara menggunakan "A" untuk hal yang sakral bisa terkesan meremehkan.\n\nDalam LovSpeak, kita belajar bahwa bahasa adalah amanah. Dengan memberikan artikel yang tepat, Anda menghargai hak pendengar untuk mendapatkan gambaran objek yang akurat, baik itu benda umum maupun sesuatu yang mulia dan spesifik seperti kitab suci atau tempat ibadah.',
        examples: [
          { text: 'This is an authentic Hadith.', isCorrect: true },
          { text: 'The Prophet PBUH is our role model.', isCorrect: true },
          { text: 'We found a solution to the problem.', isCorrect: true },
          { text: 'That man is a scholar.', isCorrect: true },
          { text: 'The truth will always prevail.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'a1-art-root',
      label: 'ARTICLES & DETERMINERS',
      type: 'root',
      children: [
        {
          id: 'indef',
          label: 'A / AN (General)',
          type: 'main',
          children: [
            { id: 'a-cons', label: 'A + Consonant Sound', type: 'sub' },
            { id: 'an-vow', label: 'An + Vowel Sound', type: 'sub' }
          ]
        },
        {
          id: 'def',
          label: 'THE (Specific)',
          type: 'main',
          children: [
            { id: 'known', label: 'Known to listener', type: 'sub' },
            { id: 'unique', label: 'Unique/Only one', type: 'sub' }
          ]
        },
        {
          id: 'penunjuk',
          label: 'Demonstratives',
          type: 'formula',
          children: [
            { id: 'near', label: 'Near: This/These', type: 'sub' },
            { id: 'far', label: 'Far: That/Those', type: 'sub' }
          ]
        }
      ]
    }
  },
  {
    id: 'a1-present-simple',
    title: '3. Present Simple Tense',
    level: 'A1',
    icon: 'fa-sync',
    description: 'Cara mendeskripsikan rutinitas, fakta umum, dan kebenaran abadi dengan struktur yang stabil.',
    sections: [
      {
        heading: '1. Logika Rutinitas dan Kebenaran Umum',
        content: 'Present Simple adalah tenses yang paling sering digunakan untuk menyatakan kebiasaan (habits), rutinitas harian, atau fakta ilmiah yang tidak berubah oleh waktu. Bayangkan tenses ini sebagai fondasi realitas kita sehari-hari, seperti terbitnya matahari atau jadwal shalat kita.\n\nKetika Anda berbicara tentang diri Anda, pekerjaan Anda, atau prinsip hidup Anda, Present Simple adalah pilihan yang paling tepat. Tenses ini memberikan kesan stabilitas dan kejelasan informasi, karena ia tidak fokus pada proses yang sedang berlangsung, melainkan pada fakta yang statis dan permanen.',
        examples: [
          { text: 'I pray five times a day.', isCorrect: true, note: 'Rutinitas harian.' },
          { text: 'The earth goes around the sun.', isCorrect: true, note: 'Fakta ilmiah.' },
          { text: 'He speaks English very well.', isCorrect: true, note: 'Kemampuan/Fakta diri.' },
          { text: 'Water boils at 100 degrees.', isCorrect: true },
          { text: 'We live in Indonesia.', isCorrect: true }
        ]
      },
      {
        heading: '2. Hukum Akhiran S/ES: Kesetiaan Subjek Tunggal',
        content: 'Aturan yang paling menonjol dalam Present Simple adalah perubahan pada kata kerja ketika subjeknya adalah He, She, atau It (Orang ketiga tunggal). Kita wajib menambahkan akhiran -s atau -es pada kata kerjanya sebagai penanda kesesuaian (agreement).\n\nBanyak pembelajar sering melupakan akhiran "S" ini karena dalam bahasa Indonesia kata kerja tidak berubah berdasarkan subjek. Namun, dalam bahasa Inggris, melupakan "S" ini dianggap sebagai kesalahan dasar yang sangat mencolok. Ingatlah: Subjek tunggal butuh "S" sebagai pendamping kata kerjanya agar kalimat tersebut harmonis.',
        examples: [
          { text: 'She reads the Quran every morning.', isCorrect: true },
          { text: 'Ahmad goes to the mosque.', isCorrect: true, note: 'Akhiran -es untuk kata berakhiran o.' },
          { text: 'It works perfectly.', isCorrect: true },
          { text: 'My mother cooks delicious food.', isCorrect: true },
          { text: 'He studies hard for the exam.', isCorrect: true, note: 'Y berubah menjadi I + es.' }
        ]
      },
      {
        heading: '3. Kalimat Negatif dengan DO dan DOES',
        content: 'Untuk menyatakan penyangkalan ("tidak") dalam Present Simple, kita membutuhkan kata bantu (Auxiliary Verb) yaitu DO atau DOES diikuti oleh NOT. "Does not" digunakan untuk He, She, It, sedangkan "Do not" untuk subjek lainnya.\n\nAturan emas yang harus diingat: Jika DOES sudah muncul, maka kata kerja utama harus KEMBALI KE BENTUK DASAR (tanpa akhiran S). DOES sudah mengambil alih tugas membawa sifat tunggal, sehingga kata kerja utama tidak perlu lagi dibebani dengan akhiran S. Ini adalah logika efisiensi dalam tata bahasa Inggris.',
        examples: [
          { text: 'I do not (don\'t) like spicy food.', isCorrect: true },
          { text: 'She does not (doesn\'t) eat pork.', isCorrect: true, note: 'Eat kembali ke V1, bukan eats.' },
          { text: 'We don\'t waste our time.', isCorrect: true },
          { text: 'He doesn\'t smoke.', isCorrect: true },
          { text: 'They don\'t arrive late.', isCorrect: true }
        ]
      },
      {
        heading: '4. Interogatif: Memulai Pertanyaan',
        content: 'Sama seperti kalimat negatif, untuk bertanya kita menggunakan kata bantu DO atau DOES di awal kalimat. Ini berfungsi untuk memberi peringatan kepada lawan bicara bahwa kita sedang menanyakan sebuah fakta atau kebiasaan sebelum mereka mendengar inti pertanyaannya.\n\nPola inversi ini sangat penting untuk dikuasai agar Anda tidak bertanya dengan nada datar seperti pernyataan. Jawaban singkat (short answers) seperti "Yes, I do" atau "No, she doesn\'t" adalah cara paling sopan dan alami untuk merespons pertanyaan Present Simple.',
        examples: [
          { text: 'Do you study English every day?', isCorrect: true },
          { text: 'Does Ali go to school by bike?', isCorrect: true },
          { text: 'Do they live near here?', isCorrect: true },
          { text: 'Does it rain often in London?', isCorrect: true },
          { text: 'Do we have enough water?', isCorrect: true }
        ]
      },
      {
        heading: '5. Konteks Disiplin: Istiqomah dalam Rutinitas',
        content: 'Dalam Islam, konsep rutinitas sangat erat kaitannya dengan "Istiqomah". Menggunakan Present Simple untuk menceritakan ibadah dan kebaikan yang dilakukan secara konsisten mencerminkan karakter seorang Muslim yang disiplin dan teratur hidupnya.\n\nTenses ini membantu kita mendeskripsikan "Way of Life" atau jalan hidup kita. Dengan berkata "I help my parents" atau "We share our food", Anda menunjukkan bahwa nilai-nilai tersebut bukanlah aksi sekali saja, melainkan prinsip yang menetap dalam diri Anda secara terus-menerus.',
        examples: [
          { text: 'I always start with Bismillah.', isCorrect: true },
          { text: 'We share our wealth with the poor.', isCorrect: true },
          { text: 'He speaks truth all the time.', isCorrect: true },
          { text: 'She respects her elders.', isCorrect: true },
          { text: 'A good Muslim helps his neighbor.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'a1-ps-root',
      label: 'PRESENT SIMPLE',
      type: 'root',
      children: [
        {
          id: 'use',
          label: 'When to use',
          type: 'main',
          children: [
            { id: 'habits', label: 'Habits/Routine', type: 'sub' },
            { id: 'facts', label: 'General Facts', type: 'sub' }
          ]
        },
        {
          id: 'verb-s',
          label: 'Verb Rules',
          type: 'formula',
          children: [
            { id: 's-add', label: '+S/ES for He/She/It', type: 'sub' },
            { id: 'v1-base', label: 'Base Form for I/You/We/They', type: 'sub' }
          ]
        },
        {
          id: 'aux',
          label: 'Helpers (Do/Does)',
          type: 'main',
          children: [
            { id: 'neg-do', label: 'Negative: Don\'t / Doesn\'t', type: 'sub' },
            { id: 'que-do', label: 'Question: Start with Do/Does', type: 'sub' }
          ]
        }
      ]
    }
  },
  {
    id: 'a1-plurals',
    title: '4. Singular and Plural Nouns',
    level: 'A1',
    icon: 'fa-layer-group',
    description: 'Menguasai perbedaan antara satu dan banyak untuk akurasi kuantitas dalam benda.',
    sections: [
      {
        heading: '1. Regular Plurals: Hukum Tambahan S/ES',
        content: 'Secara standar, mayoritas kata benda dalam bahasa Inggris berubah menjadi jamak hanya dengan menambahkan akhiran "-s". Namun, jika kata benda tersebut berakhir dengan bunyi mendesis seperti s, sh, ch, x, atau z, kita wajib menambahkan "-es" agar pelafalannya menjadi lebih mudah dan jelas.\n\nPerubahan ini sangat penting agar pendengar tahu apakah Anda sedang membicarakan satu objek atau sekelompok objek. Ketidaktelitian dalam menambahkan akhiran ini seringkali membuat makna kalimat menjadi ambigu, terutama dalam konteks instruksi atau permintaan barang.',
        examples: [
          { text: 'One book, two books.', isCorrect: true },
          { text: 'One box, three boxes.', isCorrect: true, note: 'Akhiran x butuh -es.' },
          { text: 'Many mosques are beautiful.', isCorrect: true },
          { text: 'I have four pencils.', isCorrect: true },
          { text: 'The churches have big clocks.', isCorrect: true }
        ]
      },
      {
        heading: '2. Irregular Plurals: Bentuk yang Berubah Total',
        content: 'Tidak semua kata benda patuh pada aturan penambahan "S". Ada kelompok kata benda istimewa yang berubah wujud secara total atau bahkan tidak berubah sama sekali saat menjadi jamak. Kata-kata ini harus dihafalkan karena tidak ada rumus pasti untuk memprediksi perubahannya.\n\nContoh yang paling umum adalah kata-kata yang berhubungan dengan manusia dan bagian tubuh. Mengetahui bentuk-bentuk unik ini akan membuat bahasa Inggris Anda terdengar jauh lebih mahir dan natural, karena Anda tidak akan melakukan kesalahan konyol seperti berkata "mans" atau "childs".',
        examples: [
          { text: 'One man, three men.', isCorrect: true },
          { text: 'One child, many children.', isCorrect: true },
          { text: 'Two people are waiting.', isCorrect: true, note: 'Bukan "two peoples".' },
          { text: 'My teeth are white.', isCorrect: true, note: 'Jamak dari tooth.' },
          { text: 'The mice are in the kitchen.', isCorrect: true, note: 'Jamak dari mouse.' }
        ]
      },
      {
        heading: '3. Uncountable Nouns: Benda yang Tak Terhitung',
        content: 'Ada kategori benda yang dianggap sebagai satu kesatuan utuh atau zat yang tidak bisa dihitung per butir, seperti air, pasir, uang, atau informasi. Benda-benda ini tidak memiliki bentuk jamak dan tidak boleh diikuti oleh akhiran "S".\n\nBanyak pembelajar melakukan kesalahan dengan mencoba menjamakkan kata-kata ini (seperti "waters" atau "moneys"). Untuk menghitungnya, kita butuh "wadah" atau satuan ukuran, seperti "a glass of water" atau "a piece of information". Memahami batasan ini menunjukkan Anda mengerti logika massa dalam bahasa Inggris.',
        examples: [
          { text: 'Water is essential for life.', isCorrect: true },
          { text: 'I need some advice.', isCorrect: true, note: 'Bukan "advices".' },
          { text: 'He has much money.', isCorrect: true },
          { text: 'The rice is delicious.', isCorrect: true },
          { text: 'We have little time.', isCorrect: true }
        ]
      },
      {
        heading: '4. Collective Nouns: Satu Nama untuk Banyak Jiwa',
        content: 'Collective nouns adalah kata tunggal yang mewakili sekelompok orang atau benda, seperti "Family", "Team", atau "Ummah". Meskipun di dalamnya terdiri dari banyak anggota, secara tata bahasa kata-kata ini sering dianggap sebagai satu entitas tunggal.\n\nPenggunaan kata kerja setelah collective nouns bisa bervariasi tergantung pada apakah Anda melihat kelompok itu sebagai satu kesatuan atau sebagai individu-individu yang terpisah. Di level pemula, biasanya kita menganggapnya tunggal untuk menjaga kesederhanaan struktur kalimat.',
        examples: [
          { text: 'My family is very supportive.', isCorrect: true },
          { text: 'The team wins the match.', isCorrect: true },
          { text: 'The Muslim Ummah is united.', isCorrect: true },
          { text: 'The class starts at 8 AM.', isCorrect: true },
          { text: 'Our group is ready.', isCorrect: true }
        ]
      },
      {
        heading: '5. Etika Kuantitas: Syukur dalam Setiap Jumlah',
        content: 'Dalam pandangan Islam, setiap jumlah nikmat—baik sedikit (singular) maupun banyak (plural)—adalah alasan untuk bersyukur. Menggunakan istilah jamak yang tepat saat menyebutkan berkah Allah mencerminkan kesadaran kita akan melimpahnya nikmat yang tidak terhitung (uncountable).\n\nKetepatan dalam menyebut jumlah juga berkaitan dengan amanah. Jika Anda berjanji memberikan "two books" (plural), pastikan Anda tidak memberikan hanya satu. Bahasa yang akurat dalam hal jumlah adalah bagian dari integritas seorang Muslim dalam menjaga janji dan memberikan informasi yang benar tanpa dikurangi atau dilebihkan.',
        examples: [
          { text: 'Allah gives us many blessings.', isCorrect: true },
          { text: 'I have two eyes to see.', isCorrect: true },
          { text: 'Thank you for the advices.', isCorrect: false, note: 'Correction: Thank you for the advice.' },
          { text: 'Give these dates to the orphans.', isCorrect: true },
          { text: 'The three mosques are open.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'a1-noun-root',
      label: 'NOUN SYSTEM',
      type: 'root',
      children: [
        {
          id: 'reg',
          label: 'Regular (+S/ES)',
          type: 'main',
          children: [
            { id: 's-basic', label: 'Most nouns: add S', type: 'sub' },
            { id: 'es-special', label: 'End in s, ch, sh: add ES', type: 'sub' }
          ]
        },
        {
          id: 'irreg',
          label: 'Irregular (Unique)',
          type: 'formula',
          children: [
            { id: 'total-change', label: 'Total Change: Child -> Children', type: 'sub' },
            { id: 'no-change', label: 'No Change: Sheep -> Sheep', type: 'sub' }
          ]
        },
        {
          id: 'count-logic',
          label: 'Countability',
          type: 'main',
          children: [
            { id: 'uncount', label: 'Uncountable: No S (Water/Money)', type: 'sub' },
            { id: 'containers', label: 'Use unit: A glass of...', type: 'sub' }
          ]
        }
      ]
    }
  },
  {
    id: 'a1-adjectives',
    title: '5. Adjectives: The Art of Description',
    level: 'A1',
    icon: 'fa-magic',
    description: 'Belajar mewarnai kalimat dengan kata sifat untuk memberikan detail yang hidup pada benda.',
    sections: [
      {
        heading: '1. Peran Adjective: Melukis dengan Kata',
        content: 'Kata sifat (Adjectives) adalah kata yang memberikan informasi tambahan tentang kata benda (Noun). Tanpa kata sifat, bahasa kita akan terasa hambar dan membosankan, seperti film hitam putih tanpa suara. Adjectives membantu kita mendeskripsikan warna, ukuran, perasaan, dan kualitas suatu objek.\n\nDalam bahasa Inggris, kata sifat memiliki peran pasif namun krusial. Mereka tidak berubah bentuk meskipun benda yang mereka sifati berubah menjadi jamak. Hal ini berbeda dengan beberapa bahasa lain, sehingga memudahkan Anda untuk fokus pada makna daripada perubahan bentuk kata.',
        examples: [
          { text: 'The blue sky.', isCorrect: true },
          { text: 'A kind heart.', isCorrect: true },
          { text: 'They are happy.', isCorrect: true },
          { text: 'It is a small mosque.', isCorrect: true },
          { text: 'The food is delicious.', isCorrect: true }
        ]
      },
      {
        heading: '2. Aturan Posisi: Sebelum Benda atau Setelah To Be',
        content: 'Salah satu perbedaan utama antara bahasa Inggris dan Indonesia adalah letak kata sifat. Di bahasa Inggris, kata sifat diletakkan SEBELUM kata benda (seperti "Beautiful flower" bukan "Flower beautiful"). Selain itu, kata sifat bisa diletakkan setelah "To Be" untuk mendeskripsikan status subjek.\n\nKesalahan posisi ini adalah salah satu penanda paling umum bagi penutur asing. Membiasakan diri meletakkan sifat di depan benda akan secara instan membuat susunan kalimat Anda terdengar lebih profesional dan sesuai dengan logika berpikir penutur asli.',
        examples: [
          { text: 'I have a new car.', isCorrect: true, note: 'Adjective + Noun.' },
          { text: 'The car is new.', isCorrect: true, note: 'To Be + Adjective.' },
          { text: 'She is a diligent student.', isCorrect: true },
          { text: 'This book is interesting.', isCorrect: true },
          { text: 'Look at the tall building.', isCorrect: true }
        ]
      },
      {
        heading: '3. Adjectives of Quality and Emotion',
        content: 'Kelompok kata sifat ini digunakan untuk mendeskripsikan apa yang kita rasakan atau bagaimana karakter seseorang. Kata-kata seperti "honest", "brave", "sad", atau "patient" masuk ke dalam kategori ini. Mereka membantu kita membangun koneksi emosional dalam percakapan.\n\nMenggunakan kata sifat kualitas dengan tepat memungkinkan Anda untuk memberikan pujian yang tulus atau mengekspresikan empati. Di level A1, fokuslah pada kata-kata dasar yang sering muncul dalam interaksi harian agar Anda bisa segera mempraktikkannya.',
        examples: [
          { text: 'He is a brave man.', isCorrect: true },
          { text: 'I am very tired today.', isCorrect: true },
          { text: 'They are honest merchants.', isCorrect: true },
          { text: 'She feels lonely.', isCorrect: true },
          { text: 'The baby is very cute.', isCorrect: true }
        ]
      },
      {
        heading: '4. Ukuran dan Warna (Size and Color)',
        content: 'Mendeskripsikan fisik benda seringkali dimulai dengan ukuran dan warna. Ini adalah informasi visual dasar yang membantu orang lain mengidentifikasi objek yang kita maksud. "Big", "small", "long", "short", "red", "green", dan "white" adalah kosakata wajib bagi pemula.\n\nSaat menggunakan kedua sifat ini secara bersamaan, biasanya kita meletakkan ukuran sebelum warna (seperti "A big red ball"). Urutan ini membantu otak pendengar untuk memproses gambaran objek secara logis dari dimensi umumnya ke detail warnanya.',
        examples: [
          { text: 'A small white cat.', isCorrect: true },
          { text: 'The mountain is huge.', isCorrect: true },
          { text: 'I like long hair.', isCorrect: true },
          { text: 'He wears a black robe.', isCorrect: true },
          { text: 'This is a short pencil.', isCorrect: true }
        ]
      },
      {
        heading: '5. Etika Deskripsi: Memuji dan Menjaga Perasaan',
        content: 'Dalam Islam, kata-kata yang baik (Thayyibah) sangat dianjurkan. Saat menggunakan kata sifat untuk mendeskripsikan orang, kita harus memilih kata-kata yang membangun dan tidak menghina (Ghibah). Pilihlah kata-kata seperti "Generous", "Patient", atau "Humble".\n\nMenghargai ciptaan Allah melalui kata sifat yang positif adalah bagian dari adab. Jika kita harus mendeskripsikan sesuatu yang negatif, gunakanlah kata-kata yang tetap santun dan tidak bertujuan untuk merendahkan martabat orang lain. Bahasa adalah cerminan hati, maka warnailah kalimat Anda dengan sifat-sifat yang mulia.',
        examples: [
          { text: 'You have a generous soul.', isCorrect: true },
          { text: 'He is a humble leader.', isCorrect: true },
          { text: 'They are patient learners.', isCorrect: true },
          { text: 'She is a pious woman.', isCorrect: true },
          { text: 'A good word is like a beautiful tree.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'a1-adj-root',
      label: 'ADJECTIVE SYSTEM',
      type: 'root',
      children: [
        {
          id: 'pos',
          label: 'Positioning',
          type: 'formula',
          children: [
            { id: 'before', label: 'Before Noun (Beautiful Girl)', type: 'sub' },
            { id: 'after', label: 'After To Be (She is smart)', type: 'sub' }
          ]
        },
        {
          id: 'cats',
          label: 'Categories',
          type: 'main',
          children: [
            { id: 'quality', label: 'Quality: Good, Diligent', type: 'sub' },
            { id: 'visual', label: 'Visual: Size & Color', type: 'sub' }
          ]
        },
        {
          id: 'adab-adj',
          label: 'Adab of Praise',
          type: 'warning',
          detail: 'Use positive adjectives to honor people.'
        }
      ]
    }
  },
  {
    id: 'a1-pronouns',
    title: '6. Personal Pronouns & Possessives',
    level: 'A1',
    icon: 'fa-users',
    description: 'Menguasai kata ganti orang agar percakapan mengalir alami tanpa pengulangan nama yang kaku.',
    sections: [
      {
        heading: '1. Subject Pronouns: Si Pelaku Utama',
        content: 'Subject Pronouns (I, You, He, She, It, We, They) adalah pondasi dari setiap kalimat karena mereka berfungsi sebagai pelaku atau tokoh utama dalam sebuah pernyataan. Mereka selalu diletakkan di awal kalimat, tepat sebelum kata kerja, untuk memberi tahu pendengar siapa yang sedang bertindak.\n\nDalam bahasa Inggris, tidak sopan jika kita terus-menerus menyebut nama orang dalam satu paragraf yang sama. Penggunaan kata ganti subjek membuat narasi Anda terasa lebih elegan dan profesional, sekaligus membantu otak pendengar untuk fokus pada aksi yang dilakukan, bukan hanya pada subjeknya saja.',
        examples: [
          { text: 'I read the Quran.', isCorrect: true },
          { text: 'You study hard.', isCorrect: true },
          { text: 'He helps the poor.', isCorrect: true },
          { text: 'We pray together.', isCorrect: true },
          { text: 'They visit the mosque.', isCorrect: true }
        ]
      },
      {
        heading: '2. Object Pronouns: Si Penerima Dampak',
        content: 'Object Pronouns (Me, You, Him, Her, It, Us, Them) digunakan ketika seseorang atau sesuatu menjadi sasaran dari sebuah tindakan. Berbeda dengan subjek, objek biasanya diletakkan setelah kata kerja atau setelah kata depan (preposition).\n\nMemahami perbedaan antara "I" dan "Me" sangatlah krusial. Banyak pembelajar pemula yang berkata "He sees I" padahal yang benar adalah "He sees me". Ingatlah aturan emas ini: Jika dia melakukan aksi, dia adalah subjek. Jika dia menerima aksi, dia wajib berubah wujud menjadi objek.',
        examples: [
          { text: 'Allah loves us.', isCorrect: true },
          { text: 'Can you help me?', isCorrect: true },
          { text: 'I see him at the mosque.', isCorrect: true },
          { text: 'Give it to her, please.', isCorrect: true },
          { text: 'We invited them to dinner.', isCorrect: true }
        ]
      },
      {
        heading: '3. Possessive Adjectives: Menandai Kepemilikan',
        content: 'Possessive Adjectives (My, Your, His, Her, Its, Our, Their) adalah kata-kata yang kita gunakan untuk menunjukkan siapa pemilik dari sebuah benda. Penting untuk diingat bahwa kata-kata ini tidak bisa berdiri sendiri; mereka wajib diikuti oleh kata benda (noun) tepat setelahnya.\n\nBayangkan kata ini sebagai label identitas. Tanpa label ini, komunikasi akan menjadi sangat bingung. Misalnya, "This is book" tidak sejelas "This is my book". Penggunaan possessive adjective yang tepat menunjukkan ketelitian Anda dalam menjaga hak milik orang lain dan menjelaskan milik Anda sendiri.',
        examples: [
          { text: 'This is my house.', isCorrect: true },
          { text: 'What is your name?', isCorrect: true },
          { text: 'His father is a doctor.', isCorrect: true },
          { text: 'Our teacher is very patient.', isCorrect: true },
          { text: 'Their cars are in the garage.', isCorrect: true }
        ]
      },
      {
        heading: '4. Kesalahan Umum: Subjek Ganda',
        content: 'Banyak pelajar sering melakukan kesalahan "Subjek Ganda", misalnya berkata "Ahmad, he is a teacher". Dalam bahasa Inggris yang standar, Anda cukup memilih salah satu: namanya saja atau kata gantinya saja. Menyebut keduanya sekaligus membuat kalimat terdengar sangat janggal.\n\nHal yang sama berlaku saat Anda menggabungkan diri sendiri dengan orang lain. Alih-alih berkata "Me and Ali go", gunakanlah "Ali and I go". Aturannya adalah: letakkan orang lain terlebih dahulu sebagai bentuk kesantunan, dan gunakan "I" karena Anda berdua bertindak sebagai subjek.',
        examples: [
          { text: 'Ali and I are friends.', isCorrect: true },
          { text: 'Sarah studies English.', isCorrect: true },
          { text: 'My parents love me.', isCorrect: true },
          { text: 'The students are clever.', isCorrect: true },
          { text: 'Budi is a good boy.', isCorrect: true }
        ]
      },
      {
        heading: '5. Etika Kata Ganti: Menjaga Kehormatan',
        content: 'Dalam konteks Adab, pemilihan kata ganti yang tepat saat membicarakan orang tua, guru, atau ulama adalah cerminan dari karakter kita. Gunakan "He" atau "She" dengan penuh penghormatan dalam narasi Anda, dan pastikan kepemilikan mereka disebutkan dengan jelas sebagai bentuk pengakuan atas jasa-jasa mereka.\n\nKomunikasi yang baik dimulai dengan cara kita mengidentifikasi orang lain. Dengan menyebut "Their wisdom" (Kebijaksanaan mereka) alih-alih hanya menyebut nama tanpa kata ganti, Anda menunjukkan kelas dan kualitas diri Anda sebagai pembelajar yang menjunjung tinggi nilai-nilai akhlak.',
        examples: [
          { text: 'He is my respected teacher.', isCorrect: true },
          { text: 'Her kindness is inspiring.', isCorrect: true },
          { text: 'I listen to his advice.', isCorrect: true },
          { text: 'We respect our elders.', isCorrect: true },
          { text: 'They are wise people.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'a1-pro-root',
      label: 'PRONOUN SYSTEM',
      type: 'root',
      children: [
        {
          id: 'sub-obj',
          label: 'The Doer vs Receiver',
          type: 'main',
          children: [
            { id: 'subj', label: 'Subject: I, He, We (Start)', type: 'sub' },
            { id: 'obj', label: 'Object: Me, Him, Us (End)', type: 'sub' }
          ]
        },
        {
          id: 'poss',
          label: 'Ownership',
          type: 'formula',
          children: [
            { id: 'adj-poss', label: 'Possessive Adj: My, Your (+ Noun)', type: 'sub' },
            { id: 'pron-poss', label: 'Possessive Pron: Mine, Yours (Alone)', type: 'sub' }
          ]
        },
        {
          id: 'adab-pro',
          label: 'Social Ethics',
          type: 'warning',
          detail: 'Honor teachers/parents with respectful pronouns.'
        }
      ]
    }
  },
  {
    id: 'a1-prepositions',
    title: '7. Prepositions of Place & Time',
    level: 'A1',
    icon: 'fa-map-marker-alt',
    description: 'Menentukan koordinat objek dan waktu secara presisi menggunakan In, On, dan At.',
    sections: [
      {
        heading: '1. In, On, At: Piramida Waktu',
        content: 'Bayangkan ketiga kata ini sebagai sebuah piramida terbalik. "In" digunakan untuk waktu yang sangat luas (bulan, tahun, musim). "On" digunakan untuk hari dan tanggal yang lebih spesifik. Sementara "At" berada di puncak piramida untuk waktu yang sangat presisi (jam, menit).\n\nMemahami hirarki ini akan menyelamatkan Anda dari kebingungan saat membuat janji atau menceritakan jadwal kegiatan. Tanpa preposisi yang tepat, kalimat Anda akan terdengar "mengambang" tanpa jangkar waktu yang jelas, yang bisa berujung pada kesalahpahaman dalam perencanaan.',
        examples: [
          { text: 'In Ramadan, we fast.', isCorrect: true, note: 'Bulan.' },
          { text: 'On Friday, we go to mosque.', isCorrect: true, note: 'Hari.' },
          { text: 'At 12 o\'clock, we have lunch.', isCorrect: true, note: 'Jam spesifik.' },
          { text: 'In the morning, I study.', isCorrect: true },
          { text: 'The exam is in 2024.', isCorrect: true }
        ]
      },
      {
        heading: '2. Preposisi Tempat: Menemukan Lokasi',
        content: 'Dalam hal lokasi, prinsip piramida juga berlaku. "In" digunakan untuk area tertutup atau luas (kota, negara, ruangan). "On" untuk posisi di atas permukaan (meja, lantai, jalan). "At" untuk titik lokasi yang spesifik (alamat, gedung tertentu, atau titik pertemuan).\n\nKetelitian dalam menentukan lokasi adalah bagian dari kejelasan komunikasi. Jika Anda berkata "in the table" alih-alih "on the table", pendengar akan membayangkan objek tersebut terjebak di dalam kayu meja. Latihlah penggunaan preposisi tempat ini dengan benda-benda di sekitar Anda.',
        examples: [
          { text: 'I live in Indonesia.', isCorrect: true },
          { text: 'The book is on the table.', isCorrect: true },
          { text: 'I am at the entrance.', isCorrect: true },
          { text: 'She is in the kitchen.', isCorrect: true },
          { text: 'The map is on the wall.', isCorrect: true }
        ]
      },
      {
        heading: '3. Preposisi Gerakan: Under, Next To, Between',
        content: 'Selain posisi statis, kita butuh kata-kata untuk menjelaskan hubungan antar objek secara lebih detail. "Under" (di bawah), "Next to" (di sebelah), dan "Between" (di antara dua benda) membantu kita memberikan instruksi atau deskripsi yang sangat akurat.\n\nKata-kata ini sangat berguna saat kita ingin membantu orang lain menemukan sesuatu yang hilang atau mendeskripsikan tata letak sebuah ruangan. Menguasai preposisi gerakan dan posisi relatif ini menunjukkan bahwa Anda mampu berkomunikasi secara spasial dengan cerdas.',
        examples: [
          { text: 'The cat is under the chair.', isCorrect: true },
          { text: 'The mosque is next to the school.', isCorrect: true },
          { text: 'I sat between Ali and Ahmad.', isCorrect: true },
          { text: 'The keys are near the lamp.', isCorrect: true },
          { text: 'There is a bridge over the river.', isCorrect: true }
        ]
      },
      {
        heading: '4. Kesalahan Klasik: In vs At',
        content: 'Banyak pembelajar bingung membedakan "In" dan "At" untuk bangunan. Gunakan "In" jika Anda ingin menekankan bahwa seseorang berada di dalam ruangan tersebut secara fisik. Gunakan "At" jika Anda ingin merujuk pada fungsi bangunan tersebut atau sebagai titik temu umum.\n\nMisalnya, "I am in the mosque" berarti Anda sedang berada di dalam bangunan masjid. Sedangkan "I am at the mosque" bisa berarti Anda sudah sampai di lokasinya, mungkin masih di parkiran atau halamannya. Perbedaan halus ini sangat penting untuk akurasi dalam memberikan informasi lokasi.',
        examples: [
          { text: 'He is in the hospital.', isCorrect: true, note: 'Di dalam gedung.' },
          { text: 'I will meet you at the hospital.', isCorrect: true, note: 'Titik lokasi pertemuan.' },
          { text: 'We are at school.', isCorrect: true },
          { text: 'They are in the library.', isCorrect: true },
          { text: 'Stay at home.', isCorrect: true }
        ]
      },
      {
        heading: '5. Konteks Amanah: Menjaga Waktu dan Tempat',
        content: 'Dalam Islam, menepati waktu janji adalah bagian dari iman. Menggunakan preposisi waktu yang tepat (At 08.00 sharp) adalah langkah awal untuk menunjukkan bahwa Anda adalah orang yang amanah dan menghargai waktu orang lain.\n\nBegitu pula dengan menjaga kesucian tempat. Dengan memahami preposisi, kita bisa berkomunikasi dengan baik tentang aturan-aturan di tempat suci, seperti "Leave your shoes at the entrance". Bahasa yang tepat membantu kita menjaga ketertiban dan kenyamanan bersama dalam menjalankan ibadah maupun aktivitas sosial.',
        examples: [
          { text: 'We meet at the mosque for Fajr.', isCorrect: true },
          { text: 'Put the Quran on the top shelf.', isCorrect: true },
          { text: 'Don\'t be late at our meeting.', isCorrect: true },
          { text: 'In every difficulty, there is ease.', isCorrect: true },
          { text: 'The prayer is at 5 PM.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'a1-prep-root',
      label: 'PREPOSITIONS',
      type: 'root',
      children: [
        {
          id: 'time-p',
          label: 'Time (Piramid)',
          type: 'main',
          children: [
            { id: 'in-t', label: 'In: Months, Years (Wide)', type: 'sub' },
            { id: 'on-t', label: 'On: Days, Dates', type: 'sub' },
            { id: 'at-t', label: 'At: Precise Time (Point)', type: 'sub' }
          ]
        },
        {
          id: 'place-p',
          label: 'Place',
          type: 'main',
          children: [
            { id: 'in-l', label: 'In: Inside area/city', type: 'sub' },
            { id: 'on-l', label: 'On: Surface/Road', type: 'sub' },
            { id: 'at-l', label: 'At: Specific point/address', type: 'sub' }
          ]
        },
        {
          id: 'relat',
          label: 'Relative Position',
          type: 'formula',
          children: [
            { id: 'und', label: 'Under/Below', type: 'sub' },
            { id: 'nxt', label: 'Next to / Beside', type: 'sub' },
            { id: 'bet', label: 'Between / Among', type: 'sub' }
          ]
        }
      ]
    }
  },
  {
    id: 'a1-wh-questions',
    title: '8. Wh-Questions: Seeking Knowledge',
    level: 'A1',
    icon: 'fa-question-circle',
    description: 'Mempelajari kata tanya untuk menggali informasi secara mendalam dan terstruktur.',
    sections: [
      {
        heading: '1. Filosofi Bertanya dalam Belajar',
        content: 'Bertanya adalah kunci pembuka pintu ilmu. Dalam bahasa Inggris, kita menggunakan kata-kata yang diawali dengan "Wh-" (kecuali How) untuk menanyakan berbagai aspek informasi: Who (siapa), What (apa), Where (di mana), When (kapan), Why (kenapa), dan How (bagaimana).\n\nTanpa kemampuan bertanya yang baik, proses belajar Anda akan terhambat karena Anda hanya menjadi penerima informasi pasif. Menguasai Wh-Questions memungkinkan Anda untuk mengambil inisiatif dalam percakapan, menunjukkan ketertarikan pada lawan bicara, dan memperdalam pemahaman Anda tentang dunia.',
        examples: [
          { text: 'Who is your role model?', isCorrect: true },
          { text: 'What are you reading?', isCorrect: true },
          { text: 'Where is the nearest mosque?', isCorrect: true },
          { text: 'When is the time for prayer?', isCorrect: true },
          { text: 'Why do we fast?', isCorrect: true }
        ]
      },
      {
        heading: '2. Struktur Kalimat Tanya: Pola Dasar',
        content: 'Struktur standar untuk Wh-Questions adalah: **Kata Tanya + Aux/To Be + Subjek + Kata Kerja**. Ingatlah bahwa kata tanya harus selalu berada di barisan paling depan sebagai pemimpin kalimat. Ia memberikan konteks jenis informasi apa yang sedang Anda cari.\n\nKesalahan umum adalah bertanya dengan pola kalimat berita hanya dengan menaikkan nada bicara (seperti "You live where?"). Meskipun terkadang dimengerti dalam bahasa gaul, pola ini dianggap tidak sopan dan tidak profesional dalam komunikasi formal. Belajarlah untuk selalu meletakkan kata tanya di depan.',
        examples: [
          { text: 'Where do you live?', isCorrect: true, note: 'Pola: Wh + Do + Subj + Verb.' },
          { text: 'How are you?', isCorrect: true, note: 'Pola: Wh + To Be + Subj.' },
          { text: 'What does he study?', isCorrect: true },
          { text: 'Who are they?', isCorrect: true },
          { text: 'When do we start?', isCorrect: true }
        ]
      },
      {
        heading: '3. What vs Which: Menentukan Pilihan',
        content: '"What" digunakan untuk menanyakan informasi yang sifatnya luas dan tidak terbatas (seperti hobi atau nama). Sedangkan "Which" digunakan ketika ada pilihan yang terbatas atau sudah disediakan sebelumnya. Memilih kata yang tepat menunjukkan Anda mengerti konteks pilihan.\n\nMisalnya, jika Anda bertanya "What is your favorite color?", Anda membiarkan lawan bicara memilih dari ribuan warna. Namun, jika Anda menyodorkan dua buku dan bertanya "Which book do you want?", Anda meminta mereka memilih dari opsi yang ada di depan mata. Ketelitian ini sangat membantu dalam pengambilan keputusan.',
        examples: [
          { text: 'What is your name?', isCorrect: true },
          { text: 'Which color do you like, red or blue?', isCorrect: true },
          { text: 'What time is it?', isCorrect: true },
          { text: 'Which way should we go?', isCorrect: true },
          { text: 'What do you think about this?', isCorrect: true }
        ]
      },
      {
        heading: '4. How: Kata Tanya Serbaguna',
        content: '"How" adalah satu-satunya kata tanya dalam kelompok ini yang tidak diawali "Wh-", namun ia adalah yang paling fleksibel. Ia bisa menanyakan cara ("How do you cook this?"), jumlah ("How many?"), durasi ("How long?"), hingga kondisi ("How are you?").\n\nKarena sifatnya yang multifungsi, "How" sering menjadi kata favorit bagi pembelajar untuk mengeksplorasi proses di balik sesuatu. Dengan bertanya "How", Anda tidak hanya tahu "apa" hasilnya, tapi Anda belajar "bagaimana" hasil itu dicapai. Ini adalah ciri seorang pembelajar yang kritis dan mendalam.',
        examples: [
          { text: 'How do you perform Wudu?', isCorrect: true },
          { text: 'How many brothers do you have?', isCorrect: true },
          { text: 'How long is the flight?', isCorrect: true },
          { text: 'How far is the market?', isCorrect: true },
          { text: 'How old are you?', isCorrect: true }
        ]
      },
      {
        heading: '5. Adab Bertanya: Santun dalam Mencari Tahu',
        content: 'Dalam Islam, bertanya harus dilakukan dengan niat yang tulus untuk mencari kebenaran, bukan untuk mempermalukan atau menguji orang lain. Gunakan nada bicara yang lembut dan pilihan kata yang sopan saat mengajukan Wh-Questions kepada guru atau orang tua.\n\nMulailah dengan kata-kata pembuka seperti "Excuse me" atau "May I ask" untuk menunjukkan kerendahan hati. Bertanya dengan adab yang baik akan membuat orang lain dengan senang hati membagikan ilmu mereka kepada Anda. Jadikan setiap pertanyaan Anda sebagai jembatan ilmu yang penuh berkah dan rasa hormat.',
        examples: [
          { text: 'May I ask, who is that scholar?', isCorrect: true },
          { text: 'Excuse me, where is the prayer room?', isCorrect: true },
          { text: 'What is the meaning of this verse, teacher?', isCorrect: true },
          { text: 'How can I be a better person?', isCorrect: true },
          { text: 'Why is honesty so important?', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'a1-wh-root',
      label: 'WH-QUESTIONS',
      type: 'root',
      children: [
        {
          id: 'wh-types',
          label: 'The Words',
          type: 'main',
          children: [
            { id: 'who-what', label: 'People (Who) & Things (What)', type: 'sub' },
            { id: 'place-time', label: 'Place (Where) & Time (When)', type: 'sub' },
            { id: 'reason-way', label: 'Reason (Why) & Method (How)', type: 'sub' }
          ]
        },
        {
          id: 'wh-order',
          label: 'Structure',
          type: 'formula',
          children: [
            { id: 'be-q', label: 'Wh + To Be + Subj', type: 'sub' },
            { id: 'do-q', label: 'Wh + Do/Does + Subj + V1', type: 'sub' }
          ]
        },
        {
          id: 'adab-wh',
          label: 'Seeking Wisdom',
          type: 'warning',
          detail: 'Ask with sincerity and politeness.'
        }
      ]
    }
  },
  {
    id: 'a1-modals-can',
    title: '9. Modal Verbs: Can and Could',
    level: 'A1',
    icon: 'fa-check-circle',
    description: 'Mengekspresikan kemampuan diri dan meminta izin secara santun.',
    sections: [
      {
        heading: '1. Menyatakan Kemampuan (Ability)',
        content: 'Kata "Can" adalah modal verb dasar yang digunakan untuk menyatakan kemampuan fisik atau mental seseorang. "I can speak English" berarti Anda memiliki keahlian atau potensi untuk melakukannya. Ini adalah kata yang sangat memberdayakan dalam bahasa Inggris.\n\nYang unik dari modal verbs seperti "Can" adalah mereka tidak pernah berubah bentuk. Anda tidak perlu menambahkan akhiran "S" meskipun subjeknya tunggal. Kesederhanaan aturan ini membantu Anda fokus pada pesan yang ingin disampaikan tanpa pusing dengan konjugasi yang rumit.',
        examples: [
          { text: 'I can read Arabic.', isCorrect: true },
          { text: 'He can swim very fast.', isCorrect: true, note: 'Bukan "He cans".' },
          { text: 'They can help us.', isCorrect: true },
          { text: 'We can solve this together.', isCorrect: true },
          { text: 'Birds can fly.', isCorrect: true }
        ]
      },
      {
        heading: '2. Teknik Penyangkalan: CANNOT',
        content: 'Untuk menyatakan ketidakmampuan, kita menggunakan "Cannot" yang sering disingkat menjadi "Can\'t". Kata ini memberikan batasan yang jelas tentang apa yang tidak mungkin dilakukan saat ini. Perlu dicatat bahwa dalam tulisan formal, "cannot" biasanya ditulis sebagai satu kata tanpa spasi.\n\nDalam pengucapan, "Can\'t" memiliki penekanan suara yang lebih kuat di akhir untuk membedakannya dengan "Can". Memahami perbedaan bunyi ini sangat krusial agar tidak terjadi salah paham tentang apakah Anda bisa atau tidak bisa melakukan sesuatu dalam situasi kritis.',
        examples: [
          { text: 'I cannot (can\'t) come today.', isCorrect: true },
          { text: 'She can\'t eat spicy food.', isCorrect: true },
          { text: 'We cannot lie.', isCorrect: true },
          { text: 'He can\'t drive a truck.', isCorrect: true },
          { text: 'They cannot enter the room.', isCorrect: true }
        ]
      },
      {
        heading: '3. Bertanya tentang Kemampuan',
        content: 'Untuk bertanya, kita cukup memindahkan "Can" ke depan kalimat. "Can you help me?" adalah pertanyaan paling umum yang akan Anda temui. Pola ini sangat praktis karena tidak membutuhkan kata bantu tambahan seperti "do" atau "does".\n\nJawaban untuk pertanyaan ini juga sangat efisien: "Yes, I can" atau "No, I can\'t". Menguasai pola tanya ini akan memudahkan Anda untuk berkolaborasi dengan orang lain dan mencari bantuan saat Anda membutuhkannya dalam lingkungan internasional.',
        examples: [
          { text: 'Can you speak louder?', isCorrect: true },
          { text: 'Can she finish the task?', isCorrect: true },
          { text: 'Can we pray here?', isCorrect: true },
          { text: 'Can they hear us?', isCorrect: true },
          { text: 'Can I use your pen?', isCorrect: true }
        ]
      },
      {
        heading: '4. Kesopanan dengan COULD',
        content: 'Meskipun "Could" secara teknis adalah bentuk lampau dari "Can", di level pemula kita sering menggunakannya untuk meminta izin atau bantuan secara LEBIH SOPAN daripada "Can". "Could you help me?" terdengar jauh lebih santun dan rendah hati di telinga penutur asli.\n\nBayangkan "Could" sebagai versi "Can" yang memiliki lapisan adab tambahan. Gunakan "Could" saat Anda berbicara dengan orang asing, guru, atau orang yang lebih tua untuk menunjukkan rasa hormat Anda. Perubahan kecil ini akan memberikan dampak besar pada bagaimana orang lain merespons Anda.',
        examples: [
          { text: 'Could you please open the window?', isCorrect: true, note: 'Sangat sopan.' },
          { text: 'Could I have some water?', isCorrect: true },
          { text: 'Could we start the meeting?', isCorrect: true },
          { text: 'Could you repeat that, please?', isCorrect: true },
          { text: 'Could they wait for a moment?', isCorrect: true }
        ]
      },
      {
        heading: '5. Konteks Amanah: Menjaga Batas Kemampuan',
        content: 'Dalam Islam, kita diajarkan untuk jujur tentang kemampuan diri. Mengatakan "I can do it" adalah sebuah janji (komitmen), sedangkan "I can\'t" adalah bentuk kejujuran untuk menghindari kegagalan amanah di kemudian hari. Gunakan modal verbs ini dengan penuh kesadaran akan tanggung jawab.\n\nSelain itu, meminta izin (Permission) adalah bagian inti dari adab Islami. Sebelum menggunakan milik orang lain atau memasuki ruang privasi, selalu awali dengan "Can I" atau "Could I". Kesantunan bahasa adalah wujud nyata dari kemuliaan akhlak seorang pembelajar yang beriman.',
        examples: [
          { text: 'Can I enter your house?', isCorrect: true },
          { text: 'I can help you with your burden.', isCorrect: true },
          { text: 'Could I borrow your book, please?', isCorrect: true },
          { text: 'We can work together for charity.', isCorrect: true },
          { text: 'Can you show me the right way?', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'a1-mod-root',
      label: 'CAN & COULD',
      type: 'root',
      children: [
        {
          id: 'ability',
          label: 'Capability',
          type: 'main',
          children: [
            { id: 'can-pos', label: 'CAN: General ability', type: 'sub' },
            { id: 'can-neg', label: 'CAN\'T: Inability', type: 'sub' }
          ]
        },
        {
          id: 'social-use',
          label: 'Permission & Request',
          type: 'formula',
          children: [
            { id: 'can-req', label: 'CAN: Informal request', type: 'sub' },
            { id: 'could-req', label: 'COULD: Formal/Polite request', type: 'sub' }
          ]
        },
        {
          id: 'mod-rules',
          label: 'Rules',
          type: 'warning',
          detail: 'No "S", no "Do", just base verb after Can/Could.'
        }
      ]
    }
  },
  {
    id: 'a1-demonstratives',
    title: '10. Demonstratives: This, That, These, Those',
    level: 'A1',
    icon: 'fa-hand-point-right',
    description: 'Menentukan objek dalam ruang dan waktu dengan kata penunjuk yang akurat.',
    sections: [
      {
        heading: '1. This vs That: Dimensi Jarak Tunggal',
        content: '"This" dan "That" adalah kata penunjuk untuk benda tunggal (hanya satu). Perbedaan utamanya terletak pada jarak fisik atau psikologis dari pembicara. Gunakan "This" untuk benda yang berada dalam jangkauan tangan atau sangat dekat dengan Anda.\n\nSebaliknya, gunakan "That" untuk benda yang jauh atau tidak bisa Anda sentuh secara langsung. Memahami perbedaan jarak ini membantu Anda memberikan petunjuk yang jelas kepada orang lain tanpa perlu banyak bergerak. Ini adalah navigasi kata yang sangat efisien dalam kehidupan sehari-hari.',
        examples: [
          { text: 'This is my mosque.', isCorrect: true, note: 'Masjid di dekat saya.' },
          { text: 'That is the sun.', isCorrect: true, note: 'Matahari yang jauh.' },
          { text: 'I like this book in my hand.', isCorrect: true },
          { text: 'Look at that bird in the sky.', isCorrect: true },
          { text: 'This is a beautiful day.', isCorrect: true }
        ]
      },
      {
        heading: '2. These vs Those: Penunjuk Jamak',
        content: 'Ketika benda yang Anda tunjuk lebih dari satu, "This" berubah menjadi "These", dan "That" berubah menjadi "Those". Aturan jaraknya tetap sama: "These" untuk benda-benda yang dekat, dan "Those" untuk benda-benda yang berada di kejauhan.\n\nPerlu diperhatikan bahwa pelafalan "This" (pendek) dan "These" (panjang) sangat mirip namun berbeda makna. Melatih pendengaran dan pengucapan kedua kata ini akan mencegah Anda salah menyebutkan jumlah benda dalam sebuah transaksi atau instruksi penting.',
        examples: [
          { text: 'These are my brothers.', isCorrect: true, note: 'Dekat dengan saya.' },
          { text: 'Those are beautiful mountains.', isCorrect: true, note: 'Jauh di sana.' },
          { text: 'Keep these coins in your pocket.', isCorrect: true },
          { text: 'Who are those people?', isCorrect: true },
          { text: 'These dates are very sweet.', isCorrect: true }
        ]
      },
      {
        heading: '3. Demonstratives as Pronouns vs Adjectives',
        content: 'Kata penunjuk ini bisa berdiri sendiri sebagai subjek (Pronoun) atau mendampingi kata benda (Adjective). Sebagai pronoun, ia menggantikan benda: "This is nice." Sebagai adjective, ia mensifati benda: "This car is nice." \n\nKemampuan untuk menggunakan keduanya secara bergantian memberikan Anda fleksibilitas dalam berbicara. Jika bendanya sudah jelas terlihat, Anda cukup menggunakan pronoun. Namun, jika Anda ingin lebih spesifik agar tidak tertukar dengan benda lain, gunakanlah pola adjective dengan menyebutkan nama bendanya.',
        examples: [
          { text: 'This is delicious.', isCorrect: true, note: 'Pronoun (benda sudah jelas).' },
          { text: 'This soup is delicious.', isCorrect: true, note: 'Adjective (mensifati soup).' },
          { text: 'I want those.', isCorrect: true },
          { text: 'I want those shoes.', isCorrect: true },
          { text: 'Give me that.', isCorrect: true }
        ]
      },
      {
        heading: '4. Kesalahan Umum: Singular-Plural Mix',
        content: 'Kesalahan paling sering terjadi adalah mencampuradukkan penunjuk tunggal dengan benda jamak, atau sebaliknya (seperti "This books" atau "Those man"). Anda harus selalu menjaga keselarasan (harmony) antara kata penunjuk dengan jumlah bendanya.\n\nSelalu cek kembali: Jika Anda menggunakan "These" atau "Those", pastikan kata bendanya memiliki akhiran "S" (untuk benda regular). Ketelitian kecil ini adalah tanda bahwa Anda sudah mulai memiliki "insting" bahasa Inggris yang benar dan tidak sekadar menerjemahkan kata demi kata.',
        examples: [
          { text: 'These students are smart.', isCorrect: true },
          { text: 'This students are smart.', isCorrect: false, note: 'Correction: These students...' },
          { text: 'That house is big.', isCorrect: true },
          { text: 'Those house are big.', isCorrect: false, note: 'Correction: Those houses...' },
          { text: 'This water is fresh.', isCorrect: true, note: 'Uncountable dianggap tunggal.' }
        ]
      },
      {
        heading: '5. Konteks Syukur: Menunjuk Berkah yang Dekat',
        content: 'Dalam tradisi Islami, kita diajarkan untuk menghargai apa yang ada di tangan kita (This) sebelum mendambakan apa yang ada di kejauhan (That). Menggunakan "This" dengan penuh kesyukuran mencerminkan hati yang Qanaah (merasa cukup dengan pemberian Allah).\n\nNamun, kita juga diingatkan untuk menatap tujuan mulia di kejauhan (Those higher goals). Menguasai kata penunjuk membantu kita mendefinisikan prioritas hidup: apa yang harus kita jaga sekarang (this integrity) dan apa yang ingin kita raih di masa depan (those rewards in Jannah).',
        examples: [
          { text: 'This is a blessing from Allah.', isCorrect: true },
          { text: 'Those rewards are for the patient.', isCorrect: true },
          { text: 'I am grateful for this family.', isCorrect: true },
          { text: 'Keep those good habits forever.', isCorrect: true },
          { text: 'This path leads to peace.', isCorrect: true }
        ]
      }
    ],
    mindmap: {
      id: 'a1-dem-root',
      label: 'DEMONSTRATIVES',
      type: 'root',
      children: [
        {
          id: 'dist',
          label: 'Distance (Jarak)',
          type: 'main',
          children: [
            { id: 'near-d', label: 'NEAR: This / These', type: 'sub' },
            { id: 'far-d', label: 'FAR: That / Those', type: 'sub' }
          ]
        },
        {
          id: 'qty-d',
          label: 'Quantity (Jumlah)',
          type: 'formula',
          children: [
            { id: 'sing-d', label: 'SINGULAR: This / That', type: 'sub' },
            { id: 'plur-d', label: 'PLURAL: These / Those', type: 'sub' }
          ]
        },
        {
          id: 'grammar-check',
          label: 'Common Errors',
          type: 'warning',
          detail: 'Never say "This books" or "Those man".'
        }
      ]
    }
  }
];
