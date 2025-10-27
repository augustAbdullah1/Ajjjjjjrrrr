
import type { Dhikr, DuaCategory, Profile, Settings, PrayerMethod } from './types';

export const INITIAL_DHIKR_LIST: Dhikr[] = [
    { id: 1, name: 'استغفر الله', arabic: 'استغفر الله' },
    { id: 2, name: 'سبحان الله', arabic: 'سبحان الله' },
    { id: 3, name: 'الحمد لله', arabic: 'الحمد لله' },
    { id: 4, name: 'الله أكبر', arabic: 'الله أكبر' },
    { id: 5, name: 'لا إله إلا الله', arabic: 'لا إله إلا الله' },
    { id: 6, name: 'لا حول ولا قوة إلا بالله', arabic: 'لا حول ولا قوة إلا بالله' },
    { id: 7, name: 'أستغفر الله وأتوب إليه', arabic: 'أستغفر الله وأتوب إليه' },
    { id: 8, name: 'سبحان الله وبحمده', arabic: 'سبحان الله وبحمده' },
    { id: 9, name: 'سبحان الله العظيم', arabic: 'سبحان الله العظيم' }
];

// A large, structured collection of authentic duas from Hisn al-Muslim
// This is a truncated example. The full file would contain all categories and duas.
export const HISNUL_MUSLIM_DUAS: DuaCategory[] = [
  {
    "ID": 1,
    "TITLE": "أذكار الاستيقاظ من النوم",
    "duas": [
      {
        "ID": 1,
        "ARABIC_TEXT": "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Alhamdu lillahil-lathee ahyana baAAda ma amatana wa-ilayhin-nushoor.",
        "TRANSLATED_TEXT": "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
      },
      {
        "ID": 2,
        "ARABIC_TEXT": "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ، رَبِّ اغْفِرْ لِي",
        "LANGUAGE_ARABIC_TRANSLATED_TEXT": "La ilaha illal-lahu wahdahu la shareeka lah, lahul-mulku walahul-hamd, wahuwa AAala kulli shay-in qadeer. Subhanal-lah, walhamdu lillah, wala ilaha illal-lah, wallahu akbar, wala hawla wala quwwata illa billahil-AAaliyyil AAatheem. Rabbigh-fir lee.",
        "TRANSLATED_TEXT": "There is none worthy of worship except Allah, alone, without partner. To Him belongs sovereignty and all praise and He is over all things omnipotent. How perfect Allah is, and all praise is for Allah. There is none worthy of worship except Allah, and Allah is the greatest. There is no power nor might except with Allah, the Most High, the Most Grand. O my Lord, forgive me.",
      }
    ]
  },
  {
    "ID": 2,
    "TITLE": "دعاء لبس الثوب",
    "duas": [
      {
        "ID": 3,
        "ARABIC_TEXT": "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا (الثَّوْبَ) وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
        "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Alhamdu lillahil-lathee kasanee hatha (aththawb) warazaqaneehi min ghayri hawlin minnee wala quwwah.",
        "TRANSLATED_TEXT": "All praise is for Allah who has clothed me with this (garment) and provided it for me without any strength or power on my part.",
      }
    ]
  },
  {
    "ID": 3,
    "TITLE": "دعاء لبس الثوب الجديد",
    "duas": [
      {
        "ID": 4,
        "ARABIC_TEXT": "اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ كَسَوْتَنِيهِ، أَسْأَلُكَ مِنْ خَيْرِهِ وَخَيْرِ مَا صُنِعَ لَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّهِ وَشَرِّ مَا صُنِعَ لَهُ",
        "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Allahumma lakal-hamdu anta kasawtaneeh, as-aluka min khayrihi wakhayri ma suniAAa lah, wa-aAAoothu bika min sharrihi washarri ma suniAAa lah.",
        "TRANSLATED_TEXT": "O Allah, for You is all praise. You have clothed me with it. I ask You for the good of it and the good for which it was made, and I seek refuge in You from the evil of it and the evil for which it was made.",
      }
    ]
  },
   {
    "ID": 27,
    "TITLE": "أذكار الصباح والمساء",
    "duas": [
      {
        "ID": 96,
        "ARABIC_TEXT": "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        "LANGUAGE_ARABIC_TRANSLATED_TEXT": "A'udhu bikalimatillahi-t-tammati min sharri ma khalaq.",
        "TRANSLATED_TEXT": "I seek refuge in the Perfect Words of Allah from the evil of what He has created. (Recite three times in the evening.)",
      },
      {
        "ID": 97,
        "ARABIC_TEXT": "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
        "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Allahumma salli wa sallim 'ala nabiyyina Muhammad.",
        "TRANSLATED_TEXT": "O Allah, we ask for your peace and blessings upon our Prophet Muhammad. (Recite ten times.)",
      }
    ]
  },
  {
    "ID": 45,
    "TITLE": "دعاء الهم والحزن",
    "duas": [
        {
            "ID": 133,
            "ARABIC_TEXT": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
            "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Allāhumma innī aʿūdhu bika min al-hammi wa-l-ḥazan, wa-l-ʿajzi wa-l-kasal, wa-l-bukhli wa-l-jubn, wa ḍalaʿi d-dayni wa ghalabati r-rijāl.",
            "TRANSLATED_TEXT": "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and from being overpowered by men."
        },
        {
            "ID": 134,
            "ARABIC_TEXT": "اللَّهُمَّ رحمتَكَ أرجو، فلا تَكِلْني إلى نفسي طَرْفةَ عَيْنٍ، وأصلِحْ لي شأني كلَّهُ، لا إله إلا أنت",
            "LANGUAGE_ARABIC_TRANSLATED_TEXT": "Allāhumma raḥmataka arjū fa-lā takilnī ilā nafsī ṭarfata ʿayn, wa aṣliḥ lī sha'nī kullah, lā ilāha illā ant.",
            "TRANSLATED_TEXT": "O Allah, it is Your mercy that I hope for, so do not leave me to myself for the blink of an eye, and rectify all my affairs. There is no god except You."
        }
    ]
  }
];


export const DEFAULT_PROFILE: Profile = {
    name: "المستخدم",
    bio: "مرحباً! أنا مستخدم تطبيق آجر",
    totalCount: 0,
    streak: 0,
    level: 1,
    rank: "-",
    dailyGoal: 100,
};

export const DEFAULT_SETTINGS: Settings = {
    vibration: true,
    showSetGoal: true,
    showAddDhikr: true,
    prayerMethod: 4, // Default to Makkah, a safe choice.
    notifications: {
        prayers: true,
        reminders: false,
        reminderInterval: 60, // minutes
        sound: 'default',
    }
};

export const PRAYER_METHODS: { id: PrayerMethod, name: string }[] = [
    { id: 2, name: 'ISNA (أمريكا الشمالية)' },
    { id: 3, name: 'MWL (رابطة العالم الإسلامي)' },
    { id: 4, name: 'Makkah (أم القرى، مكة)' },
    { id: 5, name: 'Karachi (كراتشي)' },
    { id: 8, name: 'Kuwait (الكويت)' },
    { id: 15, name: 'Moonsighting Committee Worldwide' },
];

export const REMINDER_INTERVALS: { value: number, label: string }[] = [
    { value: 30, label: 'كل 30 دقيقة' },
    { value: 60, label: 'كل ساعة' },
    { value: 120, label: 'كل ساعتين' },
    { value: 240, label: 'كل 4 ساعات' },
];
