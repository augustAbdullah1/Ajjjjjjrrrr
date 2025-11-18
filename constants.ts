import type { Dhikr, DuaCategory, Profile, Settings, PrayerMethod, SunnahCategory, AchievementId, PopularReciter } from './types';

export const INITIAL_DHIKR_LIST: Dhikr[] = [
    { id: 1, name: 'استغفر الله', arabic: 'استغفر الله', virtue: 'من لزم الاستغفار جعل الله له من كل هم فرجا، ومن كل ضيق مخرجا، ورزقه من حيث لا يحتسب.' },
    { id: 2, name: 'سبحان الله', arabic: 'سبحان الله' },
    { id: 3, name: 'الحمد لله', arabic: 'الحمد لله', virtue: 'الحمد لله تملأ الميزان.' },
    { id: 4, name: 'الله أكبر', arabic: 'الله أكبر' },
    { id: 5, name: 'لا إله إلا الله', arabic: 'لا إله إلا الله', virtue: 'أفضل الذكر لا إله إلا الله.' },
    { id: 6, name: 'لا حول ولا قوة إلا بالله', arabic: 'لا حول ولا قوة إلا بالله', virtue: 'كنز من كنوز الجنة.' },
    { id: 7, name: 'أستغفر الله وأتوب إليه', arabic: 'أستغفر الله وأتوب إليه' },
    { id: 8, name: 'سبحان الله وبحمده', arabic: 'سبحان الله وبحمده', virtue: 'من قالها في يوم مائة مرة حطت خطاياه ولو كانت مثل زبد البحر.' },
    { id: 9, name: 'سبحان الله العظيم', arabic: 'سبحان الله العظيم' },
    { id: 10, name: 'الصلاة على النبي', arabic: 'اللهم صل على محمد', virtue: 'من صلى علي صلاة واحدة صلى الله عليه بها عشرا.' },
    { id: 11, name: 'سبحان الله وبحمده سبحان الله العظيم', arabic: 'سبحان الله وبحمده سبحان الله العظيم', virtue: 'كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن.' }
];

export const HISNUL_MUSLIM_DUAS: DuaCategory[] = [
  {
    "ID": 1001,
    "TITLE": "أذكار الصباح",
    "icon": "☀️",
    "duas": [
      { "ID": 101, "ARABIC_TEXT": "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ\nاللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "آية الكرسي", "TRANSLATED_TEXT": "من قالها حين يصبح أجير من الجن حتى يمسي. (مرة واحدة)", count: 1 },
      { "ID": 102, "ARABIC_TEXT": "قُلْ هُوَ اللَّهُ أَحَدٌ... (سورة الإخلاص)", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Surat Al-Ikhlas", "TRANSLATED_TEXT": "من قالها حين يصبح وحين يمسي كفته من كل شيء. (3 مرات)", count: 3 },
      { "ID": 103, "ARABIC_TEXT": "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ... (سورة الفلق)", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Surat Al-Falaq", "TRANSLATED_TEXT": "من قالها حين يصبح وحين يمسي كفته من كل شيء. (3 مرات)", count: 3 },
      { "ID": 104, "ARABIC_TEXT": "قُلْ أَعُوذُ بِرَبِّ النَّاسِ... (سورة الناس)", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Surat An-Nas", "TRANSLATED_TEXT": "من قالها حين يصبح وحين يمسي كفته من كل شيء. (3 مرات)", count: 3 },
      { "ID": 105, "ARABIC_TEXT": "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ...", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "We have reached the morning...", "TRANSLATED_TEXT": "(مرة واحدة)", count: 1 },
      { "ID": 106, "ARABIC_TEXT": "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "O Allah, by you we greet the morning...", "TRANSLATED_TEXT": "(مرة واحدة)", count: 1 },
      { "ID": 107, "ARABIC_TEXT": "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ...", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سيد الإستغفار", "TRANSLATED_TEXT": "من قاله موقناً به حين يصبح فمات من يومه دخل الجنة. (مرة واحدة)", count: 1 },
      { "ID": 108, "ARABIC_TEXT": "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "In the name of Allah...", "TRANSLATED_TEXT": "لم يضره من الله شيء. (3 مرات)", count: 3 },
      { "ID": 109, "ARABIC_TEXT": "سبحانَ اللهِ وبحمدِه", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "How perfect Allah is and I praise Him.", "TRANSLATED_TEXT": "حُطَّتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ. (100 مرة)", count: 100 },
    ]
  },
  {
    "ID": 1002,
    "TITLE": "أذكار المساء",
    "icon": "🌙",
    "duas": [
      { "ID": 201, "ARABIC_TEXT": "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ\nاللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "آية الكرسي", "TRANSLATED_TEXT": "من قالها حين يمسي أجير من الجن حتى يصبح. (مرة واحدة)", count: 1 },
      { "ID": 202, "ARABIC_TEXT": "قُلْ هُوَ اللَّهُ أَحَدٌ... (سورة الإخلاص)", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Surat Al-Ikhlas", "TRANSLATED_TEXT": "من قالها حين يصبح وحين يمسي كفته من كل شيء. (3 مرات)", count: 3 },
      { "ID": 203, "ARABIC_TEXT": "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ... (سورة الفلق)", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Surat Al-Falaq", "TRANSLATED_TEXT": "من قالها حين يصبح وحين يمسي كفته من كل شيء. (3 مرات)", count: 3 },
      { "ID": 204, "ARABIC_TEXT": "قُلْ أَعُوذُ بِرَبِّ النَّاسِ... (سورة الناس)", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Surat An-Nas", "TRANSLATED_TEXT": "من قالها حين يصبح وحين يمسي كفته من كل شيء. (3 مرات)", count: 3 },
      { "ID": 205, "ARABIC_TEXT": "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ...", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "We have reached the evening...", "TRANSLATED_TEXT": "(مرة واحدة)", count: 1 },
      { "ID": 206, "ARABIC_TEXT": "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "O Allah, by you we greet the evening...", "TRANSLATED_TEXT": "(مرة واحدة)", count: 1 },
       { "ID": 207, "ARABIC_TEXT": "سبحانَ اللهِ وبحمدِه", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "How perfect Allah is and I praise Him.", "TRANSLATED_TEXT": "حُطَّتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ. (100 مرة)", count: 100 },
    ]
  },
  {
    "ID": 1003,
    "TITLE": "أذكار ما بعد الصلاة",
    "icon": "🧎",
    "duas": [
        { "ID": 301, "ARABIC_TEXT": "أَسْـتَغْفِرُ الله (ثلاثاً) اللَّهُمَّ أَنْـتَ السَّلامُ، وَمِـنْكَ السَّلام, تَبارَكْتَ يا ذا الجَـلالِ وَالإِكْـرام", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Astaghfirullah, Allahumma Antas-Salam...", "TRANSLATED_TEXT": "أستغفر ثلاث مرات ثم الدعاء.", count: 1 },
        { "ID": 302, "ARABIC_TEXT": "سُبْحَانَ اللَّهِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "SubhanAllah", "TRANSLATED_TEXT": "(33 مرة)", count: 33 },
        { "ID": 303, "ARABIC_TEXT": "الْحَمْدُ لِلَّهِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Alhamdulillah", "TRANSLATED_TEXT": "(33 مرة)", count: 33 },
        { "ID": 304, "ARABIC_TEXT": "اللَّهُ أَكْبَرُ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Allahu Akbar", "TRANSLATED_TEXT": "(33 مرة)", count: 33 },
        { "ID": 305, "ARABIC_TEXT": "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "La ilaha illallah...", "TRANSLATED_TEXT": "تمام المئة.", count: 1 },
        { "ID": 306, "ARABIC_TEXT": "قراءة آية الكرسي", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Read Ayatul Kursi", "TRANSLATED_TEXT": "من قرأها دبر كل صلاة لم يمنعه من دخول الجنة إلا أن يموت.", count: 1 },
    ]
  },
   {
    "ID": 1004,
    "TITLE": "أذكار النوم",
    "icon": "😴",
    "duas": [
      { "ID": 401, "ARABIC_TEXT": "يَجْمَعُ كَفَّيْهِ ثُمَّ يَنْفُثُ فِيهِمَا فَيَقْرَأُ فِيهِمَا: «قُلْ هُوَ اللَّهُ أَحَدٌ» و «قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ» و «قُلْ أَعُوذُ بِرَبِّ النَّاسِ» ثُمَّ يَمْسَحُ بِهِمَا مَا اسْتَطَاعَ مِنْ جَسَدِهِ يَبْدَأُ بِهِمَا عَلَى رَأْسِهِ وَوَجْهِهِ وَمَا أَقْبَلَ مِنْ جَسَدِهِ، (يَفْعَلُ ذَلِكَ ثَلَاثَ مَرَّاتٍ)", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Recite the last three Surahs", "TRANSLATED_TEXT": "يقرأ السور الثلاث ويمسح جسده (3 مرات)", count: 3 },
      { "ID": 402, "ARABIC_TEXT": "بِاسْمِكَ رَبِّـي وَضَعْـتُ جَنْـبي، وَبِكَ أَرْفَعُـه، فَإِن أَمْسَـكْتَ نَفْسـي فارْحَـمْها ، وَإِنْ أَرْسَلْتَـها فاحْفَظْـها بِمـا تَحْفَـظُ بِه عِبـادَكَ الصّـالِحـين", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "With Your Name my Lord...", "TRANSLATED_TEXT": "(مرة واحدة)", count: 1 },
      { "ID": 403, "ARABIC_TEXT": "اللّهُـمَّ قِنـي عَذابَـكَ يَـوْمَ تَبْـعَثُ عِبـادَك", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "O Allah, save me from Your punishment...", "TRANSLATED_TEXT": "(3 مرات)", count: 3 },
      { "ID": 404, "ARABIC_TEXT": "بِاسْـمِكَ اللّهُـمَّ أَمـوتُ وَأَحْـيا", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "In Your Name O Allah, I die and I live", "TRANSLATED_TEXT": "(مرة واحدة)", count: 1 }
    ]
  },
   {
    "ID": 1005,
    "TITLE": "أذكار الاستيقاظ",
    "icon": "⏰",
    "duas": [
      { "ID": 501, "ARABIC_TEXT": "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Praise is to Allah who gives us life after He has caused us to die and to Him is the resurrection.", "TRANSLATED_TEXT": "(مرة واحدة)", "count": 1 }
    ]
  },
  {
    "ID": 1006,
    "TITLE": "دعاء لبس الثوب",
    "icon": "👕",
    "duas": [
      { "ID": 601, "ARABIC_TEXT": "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا (الثَّوْبَ) وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Praise is to Allah Who has clothed me with this (garment) and provided it for me, without any power or might on my part.", "TRANSLATED_TEXT": "(مرة واحدة)", "count": 1 }
    ]
  },
  {
    "ID": 1007,
    "TITLE": "أذكار الخلاء",
    "icon": "🚻",
    "duas": [
      { "ID": 701, "ARABIC_TEXT": "(بِسْمِ الله) اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Before entering the toilet", "TRANSLATED_TEXT": "دعاء دخول الخلاء", "count": 1 },
      { "ID": 702, "ARABIC_TEXT": "غُفْرَانَكَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "After leaving the toilet", "TRANSLATED_TEXT": "دعاء الخروج من الخلاء", "count": 1 }
    ]
  },
  {
    "ID": 1008,
    "TITLE": "أذكار المسجد",
    "icon": "🕌",
    "duas": [
      { "ID": 801, "ARABIC_TEXT": "أَعُوذُ بِاللهِ العَظِيمِ، وَبِوَجْهِهِ الْكَرِيمِ، وَسُلْطَانِهِ الْقَدِيمِ، مِنَ الشَّيْطَانِ الرَّجِيمِ، [بِسْمِ اللهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللهِ]، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "When entering the mosque", "TRANSLATED_TEXT": "دعاء دخول المسجد", "count": 1 },
      { "ID": 802, "ARABIC_TEXT": "بِسْمِ اللهِ وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ، اللَّهُمَّ اعْصِمْنِي مِنَ الشَّيْطَانِ الرَّجِيمِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "When leaving the mosque", "TRANSLATED_TEXT": "دعاء الخروج من المسجد", "count": 1 }
    ]
  },
  { "ID": 45, "TITLE": "دعاء الهم والحزن", "icon": "😔", "duas": [ { "ID": 133, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Allāhumma innī aʿūdhu bika min al-hammi wa-l-ḥazan...", "TRANSLATED_TEXT": "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and from being overpowered by men." } ] },
  {
    "ID": 1009,
    "TITLE": "الرقية الشرعية",
    "icon": "🛡️",
    "duas": [
      { "ID": 901, "ARABIC_TEXT": "بِسْمِ اللَّهِ أَرْقِيكَ، مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ، مِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنِ حَاسِدٍ، اللَّهُ يَشْفِيكَ، بِسْمِ اللَّهِ أَرْقِيكَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Ruqyah for Sickness", "TRANSLATED_TEXT": "In the Name of Allah I perform Ruqyah for you, from everything that is harming you, from the evil of every soul or envious eye, may Allah cure you, in the Name of Allah I perform Ruqyah for you." },
      { "ID": 902, "ARABIC_TEXT": "أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Dua for the Sick", "TRANSLATED_TEXT": "I ask Allah the Great, Lord of the magnificent throne, to cure you. (7 مرات)", "count": 7 },
      { "ID": 903, "ARABIC_TEXT": "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Protection from Evil", "TRANSLATED_TEXT": "I seek refuge in the perfect words of Allah from the evil of that which He has created. (3 مرات)", "count": 3 }
    ]
  },
  {
    "ID": 1010,
    "TITLE": "أدعية من القرآن",
    "icon": "📖",
    "duas": [
      { "ID": 10101, "ARABIC_TEXT": "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة البقرة - 201", "TRANSLATED_TEXT": "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire." },
      { "ID": 10102, "ARABIC_TEXT": "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً ۚ إِنَّكَ أَنْتَ الْوَهَّابُ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة آل عمران - 8", "TRANSLATED_TEXT": "Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower." },
      { "ID": 10103, "ARABIC_TEXT": "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة إبراهيم - 40", "TRANSLATED_TEXT": "My Lord, make me an establisher of prayer, and [many] from my descendants. Our Lord, and accept my supplication." }
    ]
  },
  {
    "ID": 1011,
    "TITLE": "أدعية نبوية",
    "icon": "🤲",
    "duas": [
      { "ID": 1101, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Guidance and Piety", "TRANSLATED_TEXT": "O Allah, I ask You for guidance, piety, chastity, and self-sufficiency." },
      { "ID": 1102, "ARABIC_TEXT": "اللَّهُمَّ مُصَرِّفَ الْقُلُوبِ صَرِّفْ قُلُوبَنَا عَلَى طَاعَتِكَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Steadfastness of the Heart", "TRANSLATED_TEXT": "O Allah, Turner of the hearts, turn our hearts to Your obedience." },
      { "ID": 1103, "ARABIC_TEXT": "اللَّهُمَّ آتِ نَفْسِي تَقْوَاهَا، وَزَكِّهَا أَنْتَ خَيْرُ مَنْ زَكَّاهَا، أَنْتَ وَلِيُّهَا وَمَوْلَاهَا", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Purity of the Soul", "TRANSLATED_TEXT": "O Allah, grant my soul its piety and purify it, You are the best to purify it, You are its Guardian and Master." }
    ]
  },
  {
    "ID": 2000,
    "TITLE": "جوامع الدعاء",
    "icon": "💎",
    "duas": [
      { "ID": 2001, "ARABIC_TEXT": "اللَّهُمَّ آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "متفق عليه", "TRANSLATED_TEXT": "أكثر دعاء كان يدعو به النبي ﷺ." },
      { "ID": 2002, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه مسلم", "TRANSLATED_TEXT": "" },
      { "ID": 2003, "ARABIC_TEXT": "اللَّهُمَّ مُصَرِّفَ الْقُلُوبِ صَرِّفْ قُلُوبَنَا عَلَى طَاعَتِكَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه مسلم", "TRANSLATED_TEXT": "" },
      { "ID": 2004, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ زَوَالِ نِعْمَتِكَ، وَتَحَوُّلِ عَافِيَتِكَ، وَفُجَاءَةِ نِقْمَتِكَ، وَجَمِيعِ سَخَطِكَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه مسلم", "TRANSLATED_TEXT": "" },
      { "ID": 2005, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ جَهْدِ الْبَلَاءِ، وَدَرَكِ الشَّقَاءِ، وَسُوءِ الْقَضَاءِ، وَشَمَاتَةِ الْأَعْدَاءِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "متفق عليه", "TRANSLATED_TEXT": "" },
      { "ID": 2006, "ARABIC_TEXT": "اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي، وَاجْعَلِ الْحَيَياةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ، وَاجْعَلِ الْمَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه مسلم", "TRANSLATED_TEXT": "" },
      { "ID": 2007, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَالْهَرَمِ وَعَذَابِ الْقَبْرِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "متفق عليه", "TRANSLATED_TEXT": "" },
      { "ID": 2008, "ARABIC_TEXT": "اللَّهُمَّ آتِ نَفْسِي تَقْوَاهَا، وَزَكِّهَا أَنْتَ خَيْرُ مَنْ زَكَّاهَا، أَنْتَ وَلِيُّهَا وَمَوْلَاهَا", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه مسلم", "TRANSLATED_TEXT": "" },
      { "ID": 2009, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ، وَمِنْ قَلْبٍ لَا يَخْشَعُ، وَمِنْ نَفْسٍ لَا تَشْبَعُ، وَمِنْ دَعْوَةٍ لَا يُسْتَجَابُ لَهَا", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه مسلم", "TRANSLATED_TEXT": "" },
      { "ID": 2010, "ARABIC_TEXT": "اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه مسلم", "TRANSLATED_TEXT": "" },
      { "ID": 2011, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه الترمذي", "TRANSLATED_TEXT": "" },
      { "ID": 2012, "ARABIC_TEXT": "اللَّهُمَّ اغْفِرْ لِي، وَارْحَمْنِي، وَاهْدِنِي، وَعَافِنِي، وَارْزُقْنِي", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه مسلم", "TRANSLATED_TEXT": "" },
      { "ID": 2013, "ARABIC_TEXT": "رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة البقرة - 286", "TRANSLATED_TEXT": "" },
      { "ID": 2014, "ARABIC_TEXT": "رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة البقرة - 286", "TRANSLATED_TEXT": "" },
      { "ID": 2015, "ARABIC_TEXT": "رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة البقرة - 286", "TRANSLATED_TEXT": "" },
      { "ID": 2016, "ARABIC_TEXT": "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة آل عمران - 8", "TRANSLATED_TEXT": "" },
      { "ID": 2017, "ARABIC_TEXT": "رَبَّنَا إِنَّنَا آمَنَّا فَاغْفِرْ لَنَا ذُنُوبَنَا وَقِنَا عَذَابَ النَّارِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة آل عمران - 16", "TRANSLATED_TEXT": "" },
      { "ID": 2018, "ARABIC_TEXT": "رَبِّ هَبْ لِي مِنْ لَدُنْكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة آل عمران - 38", "TRANSLATED_TEXT": "" },
      { "ID": 2019, "ARABIC_TEXT": "رَبَّنَا آمَنَّا بِمَا أَنْزَلْتَ وَاتَّبَعْنَا الرَّسُولَ فَاكْتُبْنَا مَعَ الشَّاهِدِينَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة آل عمران - 53", "TRANSLATED_TEXT": "" },
      { "ID": 2020, "ARABIC_TEXT": "رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة آل عمران - 147", "TRANSLATED_TEXT": "" },
      { "ID": 2021, "ARABIC_TEXT": "رَبَّنَا فَاغْفِرْ لَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِّئَاتِنَا وَتَوَفَّنَا مَعَ الْأَبْرَارِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة آل عمران - 193", "TRANSLATED_TEXT": "" },
      { "ID": 2022, "ARABIC_TEXT": "رَبَّنَا وَآتِنَا مَا وَعَدْتَنَا عَلَى رُسُلِكَ وَلَا تُخْزِنَا يَوْمَ الْقِيَامَةِ إِنَّكَ لَا تُخْلِفْ الْمِيعَادَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة آل عمران - 194", "TRANSLATED_TEXT": "" },
      { "ID": 2023, "ARABIC_TEXT": "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة الأعراف - 23", "TRANSLATED_TEXT": "" },
      { "ID": 2024, "ARABIC_TEXT": "رَبَّنَا لَا تَجْعَلْنَا مَعَ الْقَوْمِ الظَّالِمِينَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة الأعراف - 47", "TRANSLATED_TEXT": "" },
      { "ID": 2025, "ARABIC_TEXT": "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَتَوَفَّنَا مُسْلِمِينَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة الأعراف - 126", "TRANSLATED_TEXT": "" },
      { "ID": 2026, "ARABIC_TEXT": "رَبِّ اغْفِرْ لِي وَلِأَخِي وَأَدْخِلْنَا فِي رَحْمَتِكَ وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة الأعراف - 151", "TRANSLATED_TEXT": "" },
      { "ID": 2027, "ARABIC_TEXT": "أَنْتَ وَلِيُّنَا فَاغْفِرْ لَنَا وَارْحَمْنَا وَأَنْتَ خَيْرُ الْغَافِرِينَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة الأعراف - 155", "TRANSLATED_TEXT": "" },
      { "ID": 2028, "ARABIC_TEXT": "عَلَى اللَّهِ تَوَكَّلْنَا رَبَّنَا لَا تَجْعَلْنَا فِتْنَةً لِلْقَوْمِ الظَّالِمِينَ وَنَجِّنَا بِرَحْمَتِكَ مِنَ الْقَوْمِ الْكَافِرِينَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة يونس - 85-86", "TRANSLATED_TEXT": "" },
      { "ID": 2029, "ARABIC_TEXT": "رَبِّ إِنِّي أَعُوذُ بِكَ أَنْ أَسْأَلَكَ مَا لَيْسَ لِي بِهِ عِلْمٌ وَإِلَّا تَغْفِرْ لِي وَتَرْحَمْنِي أَكُنْ مِنَ الْخَاسِرِينَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة هود - 47", "TRANSLATED_TEXT": "" },
      { "ID": 2030, "ARABIC_TEXT": "فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ أَنْتَ وَلِيِّي فِي الدُّنْيَا وَالْآخِرَةِ تَوَفَّنِي مُسْلِمًا وَأَلْحِقْنِي بِالصَّالِحِينَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة يوسف - 101", "TRANSLATED_TEXT": "" },
      { "ID": 2031, "ARABIC_TEXT": "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة إبراهيم - 40", "TRANSLATED_TEXT": "" },
      { "ID": 2032, "ARABIC_TEXT": "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة إبراهيم - 41", "TRANSLATED_TEXT": "" },
      { "ID": 2033, "ARABIC_TEXT": "رَبِّ أَدْخِلْنِي مُدْخَلَ صِدْقٍ وَأَخْرِجْنِي مُخْرَجَ صِدْقٍ وَاجْعَلْ لِي مِنْ لَدُنْكَ سُلْطَانًا نَصِيرًا", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة الإسراء - 80", "TRANSLATED_TEXT": "" },
      { "ID": 2034, "ARABIC_TEXT": "رَبَّنَا آتِنَا مِنْ لَدُنْكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة الكهف - 10", "TRANSLATED_TEXT": "" },
      { "ID": 2035, "ARABIC_TEXT": "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة طه - 25-28", "TRANSLATED_TEXT": "" },
      { "ID": 2036, "ARABIC_TEXT": "رَبِّ زِدْنِي عِلْمًا", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة طه - 114", "TRANSLATED_TEXT": "" },
      { "ID": 2037, "ARABIC_TEXT": "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة الأنبياء - 87", "TRANSLATED_TEXT": "" },
      { "ID": 2038, "ARABIC_TEXT": "رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنْتَ خَيْرُ الْوَارِثِينَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة الأنبياء - 89", "TRANSLATED_TEXT": "" },
      { "ID": 2039, "ARABIC_TEXT": "رَبِّ أَنْزِلْنِي مُنْزَلًا مُبَارَكًا وَأَنْتَ خَيْرُ الْمُنْزِلِينَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة المؤمنون - 29", "TRANSLATED_TEXT": "" },
      { "ID": 2040, "ARABIC_TEXT": "رَبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَعُوذُ بِكَ رَبِّ أَنْ يَحْضُرُونِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة المؤمنون - 97-98", "TRANSLATED_TEXT": "" },
      { "ID": 2041, "ARABIC_TEXT": "رَبَّنَا آمَنَّا فَاغْفِرْ لَنَا وَارْحَمْنَا وَأَنْتَ خَيْرُ الرَّاحِمِينَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة المؤمنون - 109", "TRANSLATED_TEXT": "" },
      { "ID": 2042, "ARABIC_TEXT": "رَبِّ اغْفِرْ وَارْحَمْ وَأَنْتَ خَيْرُ الرَّاحِمِينَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة المؤمنون - 118", "TRANSLATED_TEXT": "" },
      { "ID": 2043, "ARABIC_TEXT": "رَبَّنَا اصْرِفْ عَنَّا عَذَابَ جَهَنَّمَ إِنَّ عَذَابَهَا كَانَ غَرَامًا", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة الفرقان - 65", "TRANSLATED_TEXT": "" },
      { "ID": 2044, "ARABIC_TEXT": "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة الفرقان - 74", "TRANSLATED_TEXT": "" },
      { "ID": 2045, "ARABIC_TEXT": "رَبِّ هَبْ لِي حُكْمًا وَأَلْحِقْنِي بِالصَّالِحِينَ وَاجْعَلْ لِي لِسَانَ صِدْقٍ فِي الْآخِرِينَ وَاجْعَلْنِي مِنْ وَرَثَةِ جَنَّةِ النَّعِيمِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة الشعراء - 83-85", "TRANSLATED_TEXT": "" },
      { "ID": 2046, "ARABIC_TEXT": "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَى وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة النمل - 19", "TRANSLATED_TEXT": "" },
      { "ID": 2047, "ARABIC_TEXT": "رَبَّنَا وَسِعْتَ كُلَّ شَيْءٍ رَحْمَةً وَعِلْمًا فَاغْفِرْ لِلَّذِينَ تَابُوا وَاتَّبَعُوا sَبِيلَكَ وَقِهِمْ عَذَابَ الْجَحِيمِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة غافر - 7", "TRANSLATED_TEXT": "" },
      { "ID": 2048, "ARABIC_TEXT": "رَبَّنَا وَأَدْخِلْهُمْ جَنَّاتِ عَدْنٍ الَّتِي وَعَدْتَهُمْ وَمَنْ صَلَحَ مِنْ آبَائِهِمْ وَأَزْوَاجِهِمْ وَذُرِّيَّاتِهِمْ إِنَّكَ أَنْتَ الْعَزِيزُ الْحَكِيمُ وَقِهِمُ السَّيِّئَاتِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة غافر - 8-9", "TRANSLATED_TEXT": "" },
      { "ID": 2049, "ARABIC_TEXT": "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَى وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَصْلِحْ لِي فِي ذُرِّيَّتِي إِنِّي تُبْتُ إِلَيْكَ وَإِنِّي مِنَ الْمُسْلِمِينَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة الأحقاف - 15", "TRANSLATED_TEXT": "" },
      { "ID": 2050, "ARABIC_TEXT": "رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ وَلَا تَجْعَلْ فِي قُلُوبِنَا غِلًّا لِلَّذِينَ آمَنُوا رَبَّنَا إِنَّكَ رَءُوفٌ رَحِيمٌ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة الحشر - 10", "TRANSLATED_TEXT": "" },
      { "ID": 2051, "ARABIC_TEXT": "رَبَّنَا عَلَيْكَ تَوَكَّلْنَا وَإِلَيْكَ أَنَبْنَا وَإِلَيْكَ الْمَصِيرُ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة الممتحنة - 4", "TRANSLATED_TEXT": "" },
      { "ID": 2052, "ARABIC_TEXT": "رَبَّنَا لَا تَجْعَلْنَا فِتْنَةً لِلَّذِينَ كَفَرُوا وَاغْفِرْ لَنَا رَبَّنَا إِنَّكَ أَنْتَ الْعَزِيزُ الْحَكِيمُ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة الممتحنة - 5", "TRANSLATED_TEXT": "" },
      { "ID": 2053, "ARABIC_TEXT": "رَبَّنَا أَتْمِمْ لَنَا نُورَنَا وَاغْفِرْ لَنَا إِنَّكَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة التحريم - 8", "TRANSLATED_TEXT": "" },
      { "ID": 2054, "ARABIC_TEXT": "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَنْ دَخَلَ بَيْتِيَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "سورة نوح - 28", "TRANSLATED_TEXT": "" },
      { "ID": 2055, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه البخاري", "TRANSLATED_TEXT": "" },
      { "ID": 2056, "ARABIC_TEXT": "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه الترمذي", "TRANSLATED_TEXT": "" },
      { "ID": 2057, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَعَذَابِ الْقَبْرِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه أحمد", "TRANSLATED_TEXT": "" },
      { "ID": 2058, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ سَمْعِي، وَمِنْ شَرِّ بَصَرِي، وَمِنْ شَرِّ لِسَانِي، وَمِنْ شَرِّ قَلْبِي، وَمِنْ شَرِّ مَنِيِّي", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه أبو داود", "TRANSLATED_TEXT": "" },
      { "ID": 2059, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبَرَصِ وَالْجُنُونِ وَالْجُذَامِ، وَمِنْ سَيِّئِ الْأَسْقَامِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه أبو داود", "TRANSLATED_TEXT": "" },
      { "ID": 2060, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ مُنْكَرَاتِ الْأَخْلَاقِ وَالْأَعْمَالِ وَالْأَهْوَاءِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه الترمذي", "TRANSLATED_TEXT": "" },
      { "ID": 2061, "ARABIC_TEXT": "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه الترمذي", "TRANSLATED_TEXT": "" },
      { "ID": 2062, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَسْأَلُكَ فِعْلَ الْخَيْرَاتِ، وَتَرْكَ الْمُنْكَرَاتِ، وَحُبَّ الْمَسَاكِينِ، وَأَنْ تَغْفِرَ لِي وَتَرْحَمَنِي، وَإِذَا أَرَدْتَ فِتْنَةَ قَوْمٍ فَتَوَفَّنِي غَيْرَ مَفْتُونٍ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه الترمذي", "TRANSLATED_TEXT": "" },
      { "ID": 2063, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَسْأَلُكَ حُبَّكَ، وَحُبَّ مَنْ يُحِبُّكَ، وَالْعَمَلَ الَّذِي يُبَلِّغُنِي حُبَّكَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه الترمذي", "TRANSLATED_TEXT": "" },
      { "ID": 2064, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنَ الْخَيْرِ كُلِّهِ عَاجِلِهِ وَآجِلِهِ، مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه ابن ماجه", "TRANSLATED_TEXT": "" },
      { "ID": 2065, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الشَّرِّ كُلِّهِ عَاجِلِهِ وَآجِلِهِ، مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه ابن ماجه", "TRANSLATED_TEXT": "" },
      { "ID": 2066, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ، وَأَعُوذُ بِكَ مِنَ النَّارِ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه ابن ماجه", "TRANSLATED_TEXT": "" },
      { "ID": 2067, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِمَّا سَأَلَكَ عَبْدُكَ وَنَبِيُّكَ، وَأَعُوذُ بِكَ مِمَّا عَاذَ بِهِ عَبْدُكَ وَنَبِيُّكَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه الترمذي", "TRANSLATED_TEXT": "" },
      { "ID": 2068, "ARABIC_TEXT": "اللَّهُمَّ مَا قَضَيْتَ لِي مِنْ قَضَاءٍ فَاجْعَلْ عَاقِبَتَهُ لِي رَشَدًا", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه ابن ماجه", "TRANSLATED_TEXT": "" },
      { "ID": 2069, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الشِّقَاقِ وَالنِّفَاقِ وَسُوءِ الْأَخْلَاقِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه أبو داود", "TRANSLATED_TEXT": "" },
      { "ID": 2070, "ARABIC_TEXT": "اللَّهُمَّ لَكَ أَسْلَمْتُ، وَبِكَ آمَنْتُ، وَعَلَيْكَ تَوَكَّلْتُ، وَإِلَيْكَ أَنَبْتُ، وَبِكَ خَاصَمْتُ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "متفق عليه", "TRANSLATED_TEXT": "" },
      { "ID": 2071, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَعُوذُ بِعِزَّتِكَ لَا إِلَهَ إِلَّا أَنْتَ أَنْ تُضِلَّنِي", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه مسلم", "TRANSLATED_TEXT": "" },
      { "ID": 2072, "ARABIC_TEXT": "أَنْتَ الْحَيُّ الَّذِي لَا يَمُوتُ، وَالْجِنُّ وَالْإِنْسُ يَمُوتُونَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "متفق عليه", "TRANSLATED_TEXT": "" },
      { "ID": 2073, "ARABIC_TEXT": "اللَّهُمَّ اغْفِرْ لِي خَطِيئَتِي وَجَهْلِي، وَإِسْرَافِي فِي أَمْرِي، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّي", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "متفق عليه", "TRANSLATED_TEXT": "" },
      { "ID": 2074, "ARABIC_TEXT": "اللَّهُمَّ اغْفِرْ لِي جِدِّي وَهَزْلِي، وَخَطَئِي وَعَمْدِي، وَكُلُّ ذَلِكَ عِنْدِي", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "متفق عليه", "TRANSLATED_TEXT": "" },
      { "ID": 2075, "ARABIC_TEXT": "اللَّهُمَّ اغْفِرْ لِي مَا قَدَّمْتُ وَمَا أَخَّرْتُ، وَمَا أَسْرَرْتُ وَمَا أَعْلَنْتُ، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّي، أَنْتَ الْمُقَدِّمُ وَأَنْتَ الْمُؤَخَّرُ، وَأَنْتَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "متفق عليه", "TRANSLATED_TEXT": "" },
      { "ID": 2076, "ARABIC_TEXT": "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه أبو داود", "TRANSLATED_TEXT": "" },
      { "ID": 2077, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا، وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ، وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "متفق عليه", "TRANSLATED_TEXT": "" },
      { "ID": 2078, "ARABIC_TEXT": "اللَّهُمَّ رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً، وَفِي الآخِرَةِ حَسَنَةً، وَقِنَا عَذَابَ النَّارِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "متفق عليه", "TRANSLATED_TEXT": "" },
      { "ID": 2079, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ فِتْنَةِ النَّارِ وَعَذَابِ النَّارِ، وَفِتْنَةِ الْقَبْرِ وَعَذَابِ الْقَبْرِ، وَشَرِّ فِتْنَةِ الْغِنَى وَشَرِّ فِتْنَةِ الْفَقْرِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "متفق عليه", "TRANSLATED_TEXT": "" },
      { "ID": 2080, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "متفق عليه", "TRANSLATED_TEXT": "" },
      { "ID": 2081, "ARABIC_TEXT": "اللَّهُمَّ اغْسِلْ قَلْبِي بِمَاءِ الثَّلْجِ وَالْبَرَدِ، وَنَقِّ قَلْبِي مِنَ الْخَطَايَا كَمَا نَقَّيْتَ الثَّوْبَ الْأَبْيَضَ مِنَ الدَّنَسِ، وَبَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "متفق عليه", "TRANSLATED_TEXT": "" },
      { "ID": 2082, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكَسَلِ وَالْهَرَمِ وَالْمَأْثَمِ وَالْمَغْرَمِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "متفق عليه", "TRANSLATED_TEXT": "" },
      { "ID": 2083, "ARABIC_TEXT": "اللَّهُمَّ حَبِّبْ إِلَيْنَا الْإِيمَانَ وَزَيِّنْهُ فِي قُلُوبِنَا، وَكَرِّهْ إِلَيْنَا الْكُفْرَ وَالْفُسُوقَ وَالْعِصْيَانَ، وَاجْعَلْنَا مِنَ الرَّاشِدِينَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه أحمد", "TRANSLATED_TEXT": "" },
      { "ID": 2084, "ARABIC_TEXT": "اللَّهُمَّ تَوَفَّنَا مُسْلِمِينَ، وَأَحْيِنَا مُسْلِمِينَ، وَأَلْحِقْنَا بِالصَّالِحِينَ غَيْرَ خَزَايَا وَلَا مَفْتُونِينَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه أحمد", "TRANSLATED_TEXT": "" },
      { "ID": 2085, "ARABIC_TEXT": "اللَّهُمَّ قَاتِلِ الْكَفَرَةَ الَّذِينَ يُكَذِّبُونَ رُسُلَكَ، وَيَصُدُّونَ عَنْ سَبِيلِكَ، وَاجْعَلْ عَلَيْهِمْ رِجْزَكَ وَعَذَابَكَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه أحمد", "TRANSLATED_TEXT": "" },
      { "ID": 2086, "ARABIC_TEXT": "اللَّهُمَّ قَاتِلِ الْكَفَرَةَ الَّذِينَ أُوتُوا الْكِتَابَ، إِلَهَ الْحَقِّ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه أحمد", "TRANSLATED_TEXT": "" },
      { "ID": 2087, "ARABIC_TEXT": "اللَّهُمَّ بِعِلْمِكَ الْغَيْبَ وَقُدْرَتِكَ عَلَى الْخَلْقِ أَحْيِنِي مَا عَلِمْتَ الْحَيَاةَ خَيْرًا لِي، وَتَوَفَّنِي إِذَا عَلِمْتَ الْوَفَاةَ خَيْرًا لِي", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه النسائي", "TRANSLATED_TEXT": "" },
      { "ID": 2088, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَشْيَتَكَ فِي الْغَيْبِ وَالشَّهَادَةِ، وَأَسْأَلُكَ كَلِمَةَ الْحَقِّ فِي الرِّضَا وَالْغَضَبِ، وَأَسْأَلُكَ الْقَصْدَ فِي الْفَقْرِ وَالْغِنَى", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه النسائي", "TRANSLATED_TEXT": "" },
      { "ID": 2089, "ARABIC_TEXT": "وَأَسْأَلُكَ نَعِيمًا لَا يَنْفَدُ، وَأَسْأَلُكَ قُرَّةَ عَيْنٍ لَا تَنْقَطِعُ، وَأَسْأَلُكَ الرِّضَا بَعْدَ الْقَضَاءِ، وَأَسْأَلُكَ بَرْدَ الْعَيْشِ بَعْدَ الْمَوْتِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه النسائي", "TRANSLATED_TEXT": "" },
      { "ID": 2090, "ARABIC_TEXT": "وَأَسْأَلُكَ لَذَّةَ النَّظَرِ إِلَى وَجْهِكَ، وَالشَّوْقَ إِلَى لِقَائِكَ، فِي غَيْرِ ضَرَّاءَ مُضِرَّةٍ، وَلَا فِتْنَةٍ مُضِلَّةٍ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه النسائي", "TRANSLATED_TEXT": "" },
      { "ID": 2091, "ARABIC_TEXT": "اللَّهُمَّ زَيِّنَّا بِزِينَةِ الْإِيمَانِ، وَاجْعَلْنَا هُدَاةً مُهْتَدِينَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه النسائي", "TRANSLATED_TEXT": "" },
      { "ID": 2092, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَسْأَلُكَ يَا أَللَّهُ بِأَنَّكَ الْوَاحِدُ الْأَحَدُ الصَّمَدُ، الَّذِي لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ، أَنْ تَغْفِرَ لِي ذُنُوبِي، إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه النسائي", "TRANSLATED_TEXT": "" },
      { "ID": 2093, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَسْأَلُكَ بِأَنَّ لَكَ الْحَمْدَ، لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، الْمَنَّانُ، يَا بَدِيعَ السَّمَاوَاتِ وَالْأَرْضِ، يَا ذَا الْجَلَالِ وَالْإِكْرَامِ، يَا حَيُّ يَا قَيُّومُ، إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه أبو داود", "TRANSLATED_TEXT": "" },
      { "ID": 2094, "ARABIC_TEXT": "اللَّهُمَّ رَحْمَتَكَ أَرْجُو، فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ، وَأَصْلِحْ لِي شَأْنِي كُلَّهُ، لَا إِلَهَ إِلَّا أَنْتَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه أبو داود", "TRANSLATED_TEXT": "" },
      { "ID": 2095, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي عَبْدُكَ، ابْنُ عَبْدِكَ، ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه أحمد", "TRANSLATED_TEXT": "" },
      { "ID": 2096, "ARABIC_TEXT": "أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ، سَمَّيْتَ بِهِ نَفْسَكَ، أَوْ عَلَّمْتَهُ أَحَدًا مِنْ خَلْقِكَ، أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ، أَوِ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ، أَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجِلَاءَ حُزْنِي، وَذَهَابَ هَمِّي", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه أحمد", "TRANSLATED_TEXT": "" },
      { "ID": 2097, "ARABIC_TEXT": "اللَّهُمَّ اقْسِمْ لَنَا مِنْ خَشْيَتِكَ مَا تَحُولُ بِهِ بَيْنَنَا وَبَيْنَ مَعَاصِيكَ، وَمِنْ طَاعَتِكَ مَا تُبَلِّغُنَا بِهِ جَنَّتَكَ، وَمِنَ الْيَقِينِ مَا تُهَوِّنُ بِهِ عَلَيْنَا مَصَائِبَ الدُّنْيَا", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه الترمذي", "TRANSLATED_TEXT": "" },
      { "ID": 2098, "ARABIC_TEXT": "اللَّهُمَّ مَتِّعْنَا بِأَسْمَاعِنَا وَأَبْصَارِنَا وَقُوَّتِنَا مَا أَحْيَيْتَنَا، وَاجْعَلْهُ الْوَارِثَ مِنَّا، وَاجْعَلْ ثَأْرَنَا عَلَى مَنْ ظَلَمَنَا، وَانْصُرْنَا عَلَى مَنْ عَادَانَا، وَلَا تَجْعَلْ مُصِيبَتَنَا فِي دِينِنَا", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه الترمذي", "TRANSLATED_TEXT": "" },
      { "ID": 2099, "ARABIC_TEXT": "وَلَا تَجْعَلِ الدُّنْيَا أَكْبَرَ هَمِّنَا، وَلَا مَبْلَغَ عِلْمِنَا، وَلَا تُسَلِّطْ عَلَيْنَا مَنْ لَا يَرْحَمُنَا", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه الترمذي", "TRANSLATED_TEXT": "" },
      { "ID": 2100, "ARABIC_TEXT": "اللَّهُمَّ اغْفِرْ لِحَيِّنَا وَمَيِّتِنَا، وَشَاهِدِنَا وَغَائِبِنَا، وَصَغِيرِنَا وَكَبِيرِنَا، وَذَكَرِنَا وَأُنْثَانَا", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه أبو داود", "TRANSLATED_TEXT": "" },
      { "ID": 2101, "ARABIC_TEXT": "اللَّهُمَّ مَنْ أَحْيَيْتَهُ مِنَّا فَأَحْيِهِ عَلَى الْإِسْلَامِ، وَمَنْ تَوَفَّيْتَهُ مِنَّا فَتَوَفَّهُ عَلَى الْإِيمَانِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه أبو داود", "TRANSLATED_TEXT": "" },
      { "ID": 2102, "ARABIC_TEXT": "اللَّهُمَّ لَا تَحْرِمْنَا أَجْرَهُ، وَلَا تُضِلَّنَا بَعْدَهُ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "رواه ابن ماجه", "TRANSLATED_TEXT": "دعاء صلاة الجنازة" }
    ]
  },
  {
    "ID": 1012,
    "TITLE": "دعاء السفر",
    "icon": "✈️",
    "duas": [
      { "ID": 1201, "ARABIC_TEXT": "اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Upon Mounting a Vehicle", "TRANSLATED_TEXT": "Allah is the Most Great... Glory is to Him Who has provided this for us though we could never have had it by our own efforts. And we will surely return to our Lord." }
    ]
  },
  {
    "ID": 1013,
    "TITLE": "دعاء زيارة المريض",
    "icon": "🩹",
    "duas": [
      { "ID": 1301, "ARABIC_TEXT": "لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "To the Sick Person", "TRANSLATED_TEXT": "Do not worry, it will be a purification (for you), God willing." }
    ]
  },
  { "ID": 1014, "TITLE": "دعاء الكرب", "icon": "😥", "duas": [ { "ID": 1401, "ARABIC_TEXT": "لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Dua for distress", "TRANSLATED_TEXT": "None has the right to be worshipped but Allah the Incomparably Great, the Forbearing. None has the right to be worshipped but Allah the Lord of the Mighty Throne..." } ] },
  { "ID": 1015, "TITLE": "دعاء الاستخارة", "icon": "🤔", "duas": [ { "ID": 1501, "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ...", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Dua for Istikharah", "TRANSLATED_TEXT": "O Allah, I seek Your guidance [in making a choice] by virtue of Your knowledge, and I seek ability by virtue of Your power, and I ask You of Your great bounty..." } ] },
  { "ID": 1016, "TITLE": "أذكار الأذان", "icon": "🔊", "duas": [ { "ID": 1601, "ARABIC_TEXT": "يَقُولُ مِثْلَ مَا يَقُولُ الْمُؤَذِّنُ إِلَّا فِي «حَيَّ عَلَى الصَّلَاةِ» وَ «حَيَّ عَلَى الْفَلَاحِ» فَيَقُولُ: «لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ».", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "During the Adhan", "TRANSLATED_TEXT": "Repeat what the Mu'adhin says, except for 'Hayya 'alas-Salah' and 'Hayya 'alal-Falah', for which one should say 'La hawla wa la quwwata illa billah'." }, { "ID": 1602, "ARABIC_TEXT": "اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ.", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "After the Adhan", "TRANSLATED_TEXT": "O Allah, Lord of this perfect call and established prayer, grant Muhammad the distinction and the rank of honor, and raise him to the praised station You have promised him." } ] },
  { "ID": 1017, "TITLE": "أذكار المنزل", "icon": "🏠", "duas": [ { "ID": 1701, "ARABIC_TEXT": "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا، ثُمَّ لِيُسَلِّمْ عَلَى أَهْلِهِ.", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Entering the house", "TRANSLATED_TEXT": "In the Name of Allah we enter, in the Name of Allah we leave, and upon our Lord we depend." }, { "ID": 1702, "ARABIC_TEXT": "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ.", "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Leaving the house", "TRANSLATED_TEXT": "In the Name of Allah, I have placed my trust in Allah; there is no might and no power except by Allah." } ] }
];

export const DEFAULT_PROFILE: Profile = {
    name: "المستخدم", 
    bio: "مرحباً! أنا مستخدم تطبيق آجر", 
    title: "طالب علم",
    avatarColor: '#63B3ED',
    avatarImage: null,
    favoriteDhikrId: null,
    totalCount: 0, 
    streak: 0, 
    level: 1, 
    dailyGoal: 100,
    achievements: {
        dhikr_100: false, dhikr_1000: false, dhikr_10000: false,
        streak_3: false, streak_7: false, streak_30: false,
        khatmah_start: false, morning_adhkar_7: false, evening_adhkar_7: false
    },
};

export const DEFAULT_SETTINGS: Settings = {
    vibration: true,
    showAddDhikr: true,
    showDhikrSelection: true,
    prayerMethod: 4,
    quranReaderFontSize: 1.75,
    autoScrollAudio: true,
    tapAnywhere: false,
    timeFormat: '12h',
    prayerNotifications: {
        enabled: false,
        fajr: true,
        dhuhr: true,
        asr: true,
        maghrib: true,
        isha: true,
    },
};

export const PRAYER_METHODS: { id: PrayerMethod, name: string }[] = [
    { id: 2, name: 'ISNA (أمريكا الشمالية)' }, { id: 3, name: 'MWL (رابطة العالم الإسلامي)' }, { id: 4, name: 'Makkah (أم القرى، مكة)' }, { id: 5, name: 'Karachi (كراتشي)' }, { id: 8, name: 'Kuwait (الكويت)' }, { id: 15, name: 'Moonsighting Committee Worldwide' },
];

export const SUNNAH_GUIDE_DATA: SunnahCategory[] = [
    {
        id: 1,
        title: 'سنن يوم الجمعة',
        icon: '🕌',
        sunnahs: [
            { title: 'الاغتسال', description: 'من أفضل الأعمال وأوكدها، لقوله ﷺ: "غُسْلُ يَوْمِ الْجُمُعَةِ وَاجِبٌ عَلَى كُلِّ مُحْتَلِمٍ".' },
            { title: 'التطيب ولبس أحسن الثياب', description: 'استعمال السواك، ووضع الطيب، ولبس أفضل الملابس عند الذهاب للصلاة.' },
            { title: 'التبكير إلى المسجد', description: 'الذهاب إلى صلاة الجمعة ماشياً ومبكراً، ففي كل خطوة أجر عظيم.' },
            { title: 'قراءة سورة الكهف', description: 'من قرأ سورة الكهف في يوم الجمعة أضاء له من النور ما بين الجمعتين.' },
            { title: 'الإكثار من الصلاة على النبي ﷺ', description: 'يستحب الإكثار من الصلاة على النبي محمد ﷺ في يوم وليلة الجمعة.' },
            { title: 'كثرة الدعاء وتحري ساعة الإجابة', description: 'في يوم الجمعة ساعة لا يوافقها عبد مسلم وهو قائم يصلي يسأل الله شيئاً إلا أعطاه إياه.' },
        ]
    },
    {
        id: 2,
        title: 'سنن الصلاة (الرواتب)',
        icon: '🤲',
        sunnahs: [
            { title: 'سنة الفجر', description: 'ركعتان قبل صلاة الفجر، وهما من آكد السنن.' },
            { title: 'سنن الظهر', description: 'أربع ركعات قبل صلاة الظهر (بتسليمتين)، وركعتان بعدها.' },
            { title: 'سنة المغرب', description: 'ركعتان بعد صلاة المغرب.' },
            { title: 'سنة العشاء', description: 'ركعتان بعد صلاة العشاء.' },
            { title: 'صلاة الوتر', description: 'سنة مؤكدة، وأقلها ركعة واحدة بعد صلاة العشاء.' },
        ]
    },
    {
        id: 3,
        title: 'سنن الوضوء والغسل',
        icon: '💧',
        sunnahs: [
            { title: 'التسمية', description: 'قول "بسم الله" في بداية الوضوء أو الغسل.' },
            { title: 'السواك', description: 'استخدام السواك قبل الوضوء، فإنه مطهرة للفم مرضاة للرب.' },
            { title: 'غسل الكفين ثلاثاً', description: 'غسل اليدين ثلاث مرات في بداية الوضوء.' },
            { title: 'المضمضة والاستنشاق', description: 'المبالغة فيهما لغير الصائم.' },
            { title: 'تخليل اللحية والأصابع', description: 'إيصال الماء إلى ما بين أصابع اليدين والقدمين، وتخليل اللحية الكثيفة بالماء.' },
            { title: 'التيامن', description: 'البدء بالجهة اليمنى عند غسل الأعضاء.' },
            { title: 'الغسل ثلاثاً', description: 'غسل أعضاء الوضوء ثلاث مرات، إلا الرأس والأذنين فمرة واحدة.' },
            { title: 'الدعاء بعد الوضوء', description: 'قول: "أشهد أن لا إله إلا الله وحده لا شريك له، وأشهد أن محمداً عبده ورسوله، اللهم اجعلني من التوابين واجعلني من المتطهرين".' },
        ]
    },
     {
        id: 4,
        title: 'سنن الذكر والدعاء',
        icon: '📿',
        sunnahs: [
            { title: 'أذكار الصباح والمساء', description: 'المحافظة عليها يومياً فهي حصن المسلم.' },
            { title: 'الأذكار بعد الصلوات المكتوبة', description: 'التسبيح والتحميد والتكبير بعد كل صلاة.' },
            { title: 'الدعاء في السجود', description: 'أقرب ما يكون العبد من ربه وهو ساجد، فأكثروا الدعاء.' },
            { title: 'ذكر الله في كل حين', description: 'أن يكون لسانك رطباً بذكر الله تعالى.' },
        ]
    },
    {
        id: 5,
        title: 'سنن الطعام والشراب',
        icon: '🍇',
        sunnahs: [
            { title: 'التسمية', description: 'قول "بسم الله" قبل البدء بالأكل أو الشرب.' },
            { title: 'الأكل باليد اليمنى', description: 'الأكل والشرب باليد اليمنى.' },
            { title: 'الأكل مما يليك', description: 'أن يأكل الإنسان من الطعام الذي أمامه مباشرة.' },
            { title: 'عدم عيب الطعام', description: 'إذا أعجبه طعام أكله، وإذا لم يعجبه تركه ولم يعبه.' },
            { title: 'الحمد بعد الطعام', description: 'قول "الحمد لله" بعد الانتهاء من الأكل والشرب.' },
            { title: 'الشرب جالساً وعلى ثلاث دفعات', description: 'يُسن الشرب في حالة الجلوس، والتنفس ثلاث مرات خارج الإناء.' },
        ]
    },
    {
        id: 6,
        title: 'سنن المعاملة والأخلاق',
        icon: '🤝',
        sunnahs: [
            { title: 'التبسم وطلاقة الوجه', description: 'تبسمك في وجه أخيك صدقة.' },
            { title: 'إفشاء السلام', description: 'إلقاء السلام على من عرفت ومن لم تعرف.' },
            { title: 'الكلمة الطيبة', description: 'الكلمة الطيبة صدقة.' },
            { title: 'عيادة المريض', description: 'زيارة المريض والدعاء له بالشفاء.' },
            { title: 'إماطة الأذى عن الطريق', description: 'إزالة ما يؤذي الناس من الطريق صدقة.' },
        ]
    },
    {
        id: 7,
        title: 'سنن النوم والاستيقاظ',
        icon: '🌙',
        sunnahs: [
            { title: 'الوضوء قبل النوم', description: 'من السنة أن يتوضأ المسلم قبل أن ينام.' },
            { title: 'النوم على الشق الأيمن', description: 'الاضطجاع على الجانب الأيمن ووضع اليد اليمنى تحت الخد الأيمن.' },
            { title: 'نفض الفراش', description: 'نفض الفراش قبل النوم عليه.' },
            { title: 'أذكار النوم', description: 'قراءة آية الكرسي والمعوذات وأدعية النوم المأثورة.' },
            { title: 'أذكار الاستيقاظ', description: 'قول "الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور" عند الاستيقاظ.' },
        ]
    }
];

export const ASMAUL_HUSNA_DATA: { id: number; name: string; meaning: string; }[] = [
    { id: 1, name: 'الرحمن', meaning: 'واسع الرحمة الذي وسعت رحمته كل شيء وعمّت كل حي' },
    { id: 2, name: 'الرحيم', meaning: 'دائم الرحمة، الذي يخص بها المؤمنين يوم القيامة' },
    { id: 3, name: 'الملك', meaning: 'المتصرف في ملكه كيف يشاء، الذي لا يشاركه في ملكه أحد' },
    { id: 4, name: 'القدوس', meaning: 'الطاهر المنزه عن כל نقص وعيب، والموصوف بكل كمال' },
    { id: 5, name: 'السلام', meaning: 'الذي سلِم من كل عيب، وهو مصدر السلام والأمان لخلقه' },
    { id: 6, name: 'المؤمن', meaning: 'الذي يصدّق رسله، ويؤمِّن عباده من الخوف والظلم يوم القيامة' },
    { id: 7, name: 'المهيمن', meaning: 'الرقيب الحافظ لكل شيء، والشاهد على خلقه بأعمالهم' },
    { id: 8, name: 'العزيز', meaning: 'القوي الغالب الذي لا يُقهر ولا يُغلب' },
    { id: 9, name: 'الجبار', meaning: 'الذي يجبر كسر عباده، وتنفذ مشيئته في خلقه' },
    { id: 10, name: 'المتكبر', meaning: 'العظيم الذي يتكبر عن كل سوء ونقص' },
    { id: 11, name: 'الخالق', meaning: 'الموجد للأشياء من العدم، والمقدر لها قبل وجودها' },
    { id: 12, name: 'البارئ', meaning: 'الذي خلق الخلق وبرأهم من العدم، وميز صورهم' },
    { id: 13, name: 'المصور', meaning: 'الذي أعطى כל مخلوق صورته الخاصة وهيئته المميزة' },
    { id: 14, name: 'الغفار', meaning: 'كثير المغفرة، الذي يستر الذنوب ويتجاوز عن السيئات مرة بعد مرة' },
    { id: 15, name: 'القهار', meaning: 'الغالب فوق عباده، الذي قهر כל شيء وخضع له كل مخلوق' },
    { id: 16, name: 'الوهاب', meaning: 'كثير الهبات والعطايا، الذي يهب بلا عوض وبغير سؤال' },
    { id: 17, name: 'الرزاق', meaning: 'المتكفل بأرزاق جميع خلقه، فلا ينسى أحدًا' },
    { id: 18, name: 'الفتاح', meaning: 'الذي يفتح أبواب الرحمة والرزق والنصر لعباده' },
    { id: 19, name: 'العليم', meaning: 'الذي أحاط علمه بكل شيء، الظاهر والباطن، الماضي والحاضر والمستقبل' },
    { id: 20, name: 'القابض', meaning: 'الذي يضيق الرزق وغيره على من يشاء بحكمته وعدله' },
    { id: 21, name: 'الباسط', meaning: 'الذي يوسع الرزق لمن يشاء من عباده بجوده ورحمته' },
    { id: 22, name: 'الخافض', meaning: 'الذي يخفض الكافرين والمتكبرين ويذلهم' },
    { id: 23, name: 'الرافع', meaning: 'الذي يرفع المؤمنين في الدنيا والآخرة بالعلم والإيمان' },
    { id: 24, name: 'المعز', meaning: 'الذي يهب العزة والقوة لمن يشاء من عباده بطاعته' },
    { id: 25, name: 'المذل', meaning: 'الذي يذل من يشاء من أعدائه بعصيانهم له' },
    { id: 26, name: 'السميع', meaning: 'الذي يسمع כל الأصوات والنجوى، ويجيب دعاء الداعين' },
    { id: 27, name: 'البصير', meaning: 'الذي يرى كل شيء ويبصر أعمال خلقه، لا يغيب عن بصره شيء' },
    { id: 28, name: 'الحكم', meaning: 'الذي يفصل بين الخلق بالعدل، ولا راد لقضائه' },
    { id: 29, name: 'العدل', meaning: 'الذي لا يظلم أبدًا، وحكمه هو العدل المحض' },
    { id: 30, name: 'اللطيف', meaning: 'البر بعباده، الخبير بدقائق الأمور ومصالحهم' },
    { id: 31, name: 'الخبير', meaning: 'العالم ببواطن الأمور وخفاياها، لا يخفى عليه شيء' },
    { id: 32, name: 'الحليم', meaning: 'الذي يمهل ولا يهمل، ويصفح عن عباده ولا يعاجلهم بالعقوبة' },
    { id: 33, name: 'العظيم', meaning: 'الذي له العظمة المطلقة في ذاته وصفاته وأفعاله' },
    { id: 34, name: 'الغفور', meaning: 'الساتر لذنوب عباده المتجاوز عن سيئاتهم' },
    { id: 35, name: 'الشكور', meaning: 'الذي يثني على من أطاعه، ويجازي على العمل القليل بالأجر الكثير' },
    { id: 36, name: 'العلي', meaning: 'الذي له العلو المطلق من كل الوجوه: علو الذات والقدر والقهر' },
    { id: 37, name: 'الكبير', meaning: 'الموصوف بالجلال وكبرياء الذات، وكل شيء دونه صغير' },
    { id: 38, name: 'الحفيظ', meaning: 'الذي يحفظ الكون من الزوال، ويحفظ عباده من المهالك' },
    { id: 39, name: 'المقيت', meaning: 'خالق الأقوات وموصلها للكائنات، والحافظ لها' },
    { id: 40, name: 'الحسيب', meaning: 'الكافي لعباده، والذي يحاسبهم على أعمالهم' },
    { id: 41, name: 'الجليل', meaning: 'الموصوف بالجلال والعظمة، عظيم القدر والشأن' },
    { id: 42, name: 'الكريم', meaning: 'الكثير الخير، الذي يعطي بسخاء ولا ينفد عطاؤه' },
    { id: 43, name: 'الرقيب', meaning: 'المطلع على أعمال العباد وأسرارهم، لا يغفل عنهم طرفة عين' },
    { id: 44, name: 'المجيب', meaning: 'الذي يستجيب لدعاء عباده، ويكشف السوء عنهم' },
    { id: 45, name: 'الواسع', meaning: 'الذي وسعت رحمته وعلمه ورزقه כל شيء' },
    { id: 46, name: 'الحكيم', meaning: 'الذي يضع الأمور في مواضعها، ولا يفعل إلا ما فيه حكمة وصواب' },
    { id: 47, name: 'الودود', meaning: 'المحب لأوليائه، والمحبوب في قلوبهم' },
    { id: 48, name: 'المجيد', meaning: 'العظيم في صفاته وأفعاله، له المجد الكامل' },
    { id: 49, name: 'الباعث', meaning: 'الذي يبعث الموتى من قبورهم للحساب والجزاء' },
    { id: 50, name: 'الشهيد', meaning: 'الشاهد على كل شيء، الذي لا يغيب عنه مثقال ذرة' },
    { id: 51, name: 'الحق', meaning: 'الثابت وجوده، الذي يحق الحق بكلماته' },
    { id: 52, name: 'الوكيل', meaning: 'المتكفل بأمور خلقه، الذي يُعتمد عليه في كل شيء' },
    { id: 53, name: 'القوي', meaning: 'الذي لا يغلبه غالب ولا يعجزه شيء، كامل القوة' },
    { id: 54, name: 'المتين', meaning: 'شديد القوة الذي لا تلحقه مشقة ولا يمسه لغوب' },
    { id: 55, name: 'الولي', meaning: 'المتولي لأمور عباده المؤمنين، ناصرهم ومعينهم' },
    { id: 56, name: 'الحميد', meaning: 'المحمود في ذاته وأفعاله، المستحق للحمد والثناء' },
    { id: 57, name: 'المحصي', meaning: 'الذي أحصى כל شيء بعلمه، عددًا وكمًا وكيفًا' },
    { id: 58, name: 'المبدئ', meaning: 'الذي بدأ الخلق وأنشأه من غير مثال سابق' },
    { id: 59, name: 'المعيد', meaning: 'الذي يعيد الخلق بعد فنائهم كما بدأهم أول مرة' },
    { id: 60, name: 'المحيي', meaning: 'الذي يهب الحياة لمن يشاء' },
    { id: 61, name: 'المميت', meaning: 'الذي يسلب الحياة ممن يشاء' },
    { id: 62, name: 'الحي', meaning: 'كامل الحياة، الذي لا يموت ولا تأخذه سنة ولا نوم' },
    { id: 63, name: 'القيوم', meaning: 'القائم بنفسه، والمقيم لأمر غيره' },
    { id: 64, name: 'الواجد', meaning: 'الغني الذي لا يفتقر إلى شيء، وكل شيء مفتقر إليه' },
    { id: 65, name: 'الماجد', meaning: 'الذي له المجد والعظمة والكبرياء' },
    { id: 66, name: 'الواحد', meaning: 'المنفرد في ذاته وصفاته، الذي لا نظير له' },
    { id: 67, name: 'الأحد', meaning: 'المنفرد في ألوهيته، الذي لا شريك له في عبادته' },
    { id: 68, name: 'الصمد', meaning: 'السيد الذي يُقصد في جميع الحوائج' },
    { id: 69, name: 'القادر', meaning: 'صاحب القدرة التامة، لا يعجزه شيء في الأرض ولا في السماء' },
    { id: 70, name: 'المقتدر', meaning: 'الذي قدرته بالغة الكمال، لا يمتنع عليه شيء' },
    { id: 71, name: 'المقدم', meaning: 'الذي يقدّم من يشاء في الرتب والمنازل' },
    { id: 72, name: 'المؤخر', meaning: 'الذي يؤخّر من يشاء في الرتب والمنازل' },
    { id: 73, name: 'الأول', meaning: 'الذي ليس لوجوده بداية' },
    { id: 74, name: 'الآخر', meaning: 'الذي ليس لوجوده نهاية' },
    { id: 75, name: 'الظاهر', meaning: 'الظاهر فوق كل شيء، الذي ظهرت دلائل وجوده في كل شيء' },
    { id: 76, name: 'الباطن', meaning: 'المحتجب عن أبصار الخلق، والعالم بالخفيات' },
    { id: 77, name: 'الوالي', meaning: 'المتصرف في شؤون خلقه وتدبير أمورهم' },
    { id: 78, name: 'المتعالي', meaning: 'الرفيع المنزه عن صفات المخلوقين وعن כל نقص' },
    { id: 79, name: 'البر', meaning: 'الكثير الإحسان والخير، الذي يعم إحسانه جميع خلقه' },
    { id: 80, name: 'التواب', meaning: 'الذي يوفق عباده للتوبة ويقبلها منهم' },
    { id: 81, name: 'المنتقم', meaning: 'الذي يعاقب من يستحق العقوبة من الظالمين والمجرمين بعدله' },
    { id: 82, name: 'العفو', meaning: 'الذي يمحو السيئات ويتجاوز عن الذنوب' },
    { id: 83, name: 'الرؤوف', meaning: 'شديد الرحمة والعطف بعباده' },
    { id: 84, name: 'مالك الملك', meaning: 'الذي يملك كل شيء، ويتصرف فيه كيف يشاء' },
    { id: 85, name: 'ذو الجلال والإكرام', meaning: 'صاحب العظمة والكبرياء، ومكرم أوليائه' },
    { id: 86, name: 'المقسط', meaning: 'العادل في حكمه، الذي ينصف المظلوم من الظالم' },
    { id: 87, name: 'الجامع', meaning: 'الذي يجمع الخلائق في يوم لا ريب فيه' },
    { id: 88, name: 'الغني', meaning: 'المستغني عن כל ما سواه، والمفتقر إليه כל ما عداه' },
    { id: 89, name: 'المغني', meaning: 'الذي يغني عباده ويكفيهم بحوله وقوته' },
    { id: 90, name: 'المانع', meaning: 'الذي يمنع العطاء حفظًا وحماية، أو يمنع أسباب الهلاك' },
    { id: 91, name: 'الضار', meaning: 'الذي يقدّر الضر لمن يشاء من عباده ابتلاءً أو عقوبةً بحكمته' },
    { id: 92, name: 'النافع', meaning: 'الذي يقدّر النفع لمن يشاء من عباده فضلًا ورحمة' },
    { id: 93, name: 'النور', meaning: 'الذي يهدي بنوره من يشاء، وهو نور السماوات والأرض' },
    { id: 94, name: 'الهادي', meaning: 'الذي يهدي ويرشد عباده إلى ما فيه صلاحهم' },
    { id: 95, name: 'البديع', meaning: 'المبدع الذي خلق כל شيء على غير مثال سابق' },
    { id: 96, name: 'الباقي', meaning: 'الدائم الذي لا يفنى ولا يزول' },
    { id: 97, name: 'الوارث', meaning: 'الذي يبقى بعد فناء الخلق، ويرث الأرض ومن عليها' },
    { id: 98, name: 'الرشيد', meaning: 'الذي يرشد خلقه إلى مصالحهم، ويدبر الأمور بحكمته' },
    { id: 99, name: 'الصبور', meaning: 'الذي لا يعاجل بالعقوبة، ويؤخرها لحكمة يعلمها' }
];

export const DAILY_HADITH_DATA: { arabic: string; narrator: string; }[] = [
    { arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى.", narrator: "عمر بن الخطاب - متفق عليه" },
    { arabic: "مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ.", narrator: "معاوية بن أبي سفيان - متفق عليه" },
    { arabic: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ.", narrator: "أنس بن مالك - متفق عليه" },
    { arabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ.", narrator: "عبد الله بن عمرو - متفق عليه" },
    { arabic: "الطَّهُورُ شَطْرُ الإِيمَانِ.", narrator: "أبو مالك الأشعري - رواه مسلم" },
    { arabic: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ.", narrator: "أبو ذر الغفاري - رواه الترمذي" },
    { arabic: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ.", narrator: "أبو هريرة - متفق عليه" },
    { arabic: "الدِّينُ النَّصِيحَةُ.", narrator: "تميم الداري - رواه مسلم" },
    { arabic: "مِنْ حُسْنِ إِسْلاَمِ الْمَرْءِ تَرْكُهُ مَا لاَ يَعْنِيهِ.", narrator: "أبو هريرة - رواه الترمذي" },
    { arabic: "أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ.", narrator: "عائشة - متفق عليه" },
    { arabic: "الْحَيَاءُ لاَ يَأْتِي إِلاَّ بِخَيْرٍ.", narrator: "عمران بن حصين - متفق عليه" },
    { arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ.", narrator: "عثمان بن عفان - رواه البخاري" },
    { arabic: "مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ.", narrator: "أبو هريرة - رواه مسلم" },
    { arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ.", narrator: "أبو ذر الغفاري - رواه الترمذي" },
    { arabic: "كُلُّ مَعْرُوفٍ صَدَقَةٌ.", narrator: "جابر بن عبد الله - رواه البخاري" },
    { arabic: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ.", narrator: "أبو هريرة - متفق عليه" },
    { arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ.", narrator: "أبو هريرة - متفق عليه" },
    { arabic: "إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلاً أَنْ يُتْقِنَهُ.", narrator: "عائشة - رواه البيهقي" },
    { arabic: "مَنْ صَمَتَ نَجَا.", narrator: "عبد الله بن عمرو - رواه الترمذي" },
    { arabic: "اغْتَنِمْ خَمْسًا قَبْلَ خَمْسٍ: شَبَابَكَ قَبْلَ هَرَمِكَ، وَصِحَّتَكَ قَبْلَ سَقَمِكَ، وَغِنَاكَ قَبْلَ فَقْرِكَ، وَفَرَاغَكَ قَبْلَ شُغْلِكَ، وَحَيَاتَكَ قَبْلَ مَوْتِكَ.", narrator: "ابن عباس - رواه الحاكم" },
];

// FIX: Add list of popular reciters for the YouTube download feature.
export const POPULAR_RECITERS_YOUTUBE: PopularReciter[] = [
    { name: 'مشاري العفاسي', style: 'مرتل', youtubeQuery: 'Mishary Alafasy', imageUrl: 'https://i.pravatar.cc/150?u=alafasy' },
    { name: 'عبد الباسط عبد الصمد', style: 'مجود', youtubeQuery: 'Abdul Basit Abdus Samad', imageUrl: 'https://i.pravatar.cc/150?u=abdulbasit' },
    { name: 'ماهر المعيقلي', style: 'مرتل', youtubeQuery: 'Maher Al Muaiqly', imageUrl: 'https://i.pravatar.cc/150?u=muaiqly' },
    { name: 'سعود الشريم', style: 'مرتل', youtubeQuery: 'Saud Al Shuraim', imageUrl: 'https://i.pravatar.cc/150?u=shuraim' },
    { name: 'عبد الرحمن السديس', style: 'مرتل', youtubeQuery: 'Abdurrahman As Sudais', imageUrl: 'https://i.pravatar.cc/150?u=sudais' },
    { name: 'علي جابر', style: 'مرتل', youtubeQuery: 'Ali Jaber', imageUrl: 'https://i.pravatar.cc/150?u=jabir' },
];

export const ACHIEVEMENTS_LIST: { id: AchievementId; title: string; description: string; icon: string }[] = [
    { id: 'dhikr_100', title: 'البداية الطيبة', description: 'أكملت 100 ذكر', icon: '🌱' },
    { id: 'dhikr_1000', title: 'ذاكر الله', description: 'وصلت إلى 1,000 ذكر', icon: '⭐' },
    { id: 'dhikr_10000', title: 'من الذاكرين', description: 'وصلت إلى 10,000 ذكر', icon: '🌟' },
    { id: 'streak_3', title: 'على الطريق', description: 'حافظت على وردك 3 أيام متتالية', icon: '🥉' },
    { id: 'streak_7', title: 'مثابرة أسبوع', description: 'حافظت على وردك 7 أيام متتالية', icon: '🥈' },
    { id: 'streak_30', title: 'عزيمة شهر', description: 'حافظت على وردك 30 يومًا متتاليًا', icon: '🥇' },
    { id: 'khatmah_start', title: 'بداية الختمة', description: 'بدأت أول ختمة لك', icon: '📖' },
    { id: 'morning_adhkar_7', title: 'حصن الصباح', description: 'أكملت أذكار الصباح 7 أيام متتالية', icon: '☀️' },
    { id: 'evening_adhkar_7', title: 'حصن المساء', description: 'أكملت أذكار المساء 7 أيام متتالية', icon: '🌃' },
];