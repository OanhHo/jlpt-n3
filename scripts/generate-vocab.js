const fs = require('fs');
const path = require('path');

// N3 Core Vocabulary Categories - 1000+ từ thông dụng nhất
const n3VocabDatabase = [
    // Categories: Daily Life, Work, Health, Transportation, Education, etc.

    // DAILY LIFE & ACTIVITIES (51-100)
    {
        id: "vocab-051", kanji: "生活", hiragana: "せいかつ", romaji: "seikatsu",
        meaning: "life, living", vietnamese: "cuộc sống", pos: "noun", frequency: 94,
        examples: [{ jp: "日本の生活に慣れました。", en: "I got used to life in Japan.", vi: "Tôi đã quen với cuộc sống ở Nhật." }]
    },
    {
        id: "vocab-052", kanji: "家族", hiragana: "かぞく", romaji: "kazoku",
        meaning: "family", vietnamese: "gia đình", pos: "noun", frequency: 96,
        examples: [{ jp: "家族と一緒に旅行しました。", en: "I traveled with my family.", vi: "Tôi đã đi du lịch cùng gia đình." }]
    },
    {
        id: "vocab-053", kanji: "両親", hiragana: "りょうしん", romaji: "ryoushin",
        meaning: "parents", vietnamese: "bố mẹ", pos: "noun", frequency: 84,
        examples: [{ jp: "両親に電話をかけました。", en: "I called my parents.", vi: "Tôi đã gọi điện cho bố mẹ." }]
    },
    {
        id: "vocab-054", kanji: "兄弟", hiragana: "きょうだい", romaji: "kyoudai",
        meaning: "siblings", vietnamese: "anh chị em", pos: "noun", frequency: 79,
        examples: [{ jp: "兄弟は三人います。", en: "I have three siblings.", vi: "Tôi có ba anh chị em." }]
    },
    {
        id: "vocab-055", kanji: "結婚", hiragana: "けっこん", romaji: "kekkon",
        meaning: "marriage", vietnamese: "kết hôn", pos: "noun, verb", frequency: 86,
        examples: [{ jp: "来年結婚する予定です。", en: "I plan to get married next year.", vi: "Tôi dự định kết hôn năm tới." }]
    },
    {
        id: "vocab-056", kanji: "離婚", hiragana: "りこん", romaji: "rikon",
        meaning: "divorce", vietnamese: "ly hôn", pos: "noun, verb", frequency: 68,
        examples: [{ jp: "友達が離婚しました。", en: "My friend got divorced.", vi: "Bạn tôi đã ly hôn." }]
    },
    {
        id: "vocab-057", kanji: "子供", hiragana: "こども", romaji: "kodomo",
        meaning: "child", vietnamese: "trẻ em", pos: "noun", frequency: 95,
        examples: [{ jp: "子供の頃の思い出です。", en: "It's a childhood memory.", vi: "Đó là kí ức thời thơ ấu." }]
    },
    {
        id: "vocab-058", kanji: "赤ちゃん", hiragana: "あかちゃん", romaji: "akachan",
        meaning: "baby", vietnamese: "em bé", pos: "noun", frequency: 81,
        examples: [{ jp: "赤ちゃんが生まれました。", en: "A baby was born.", vi: "Em bé đã chào đời." }]
    },
    {
        id: "vocab-059", kanji: "祖父", hiragana: "そふ", romaji: "sofu",
        meaning: "grandfather", vietnamese: "ông nội/ngoại", pos: "noun", frequency: 73,
        examples: [{ jp: "祖父は90歳です。", en: "My grandfather is 90 years old.", vi: "Ông tôi 90 tuổi." }]
    },
    {
        id: "vocab-060", kanji: "祖母", hiragana: "そぼ", romaji: "sobo",
        meaning: "grandmother", vietnamese: "bà nội/ngoại", pos: "noun", frequency: 72,
        examples: [{ jp: "祖母の料理が大好きです。", en: "I love my grandmother's cooking.", vi: "Tôi rất thích món ăn của bà." }]
    },

    // WORK & BUSINESS (61-80)
    {
        id: "vocab-061", kanji: "仕事", hiragana: "しごと", romaji: "shigoto",
        meaning: "work, job", vietnamese: "công việc", pos: "noun", frequency: 97,
        examples: [{ jp: "新しい仕事を始めました。", en: "I started a new job.", vi: "Tôi đã bắt đầu công việc mới." }]
    },
    {
        id: "vocab-062", kanji: "会社", hiragana: "かいしゃ", romaji: "kaisha",
        meaning: "company", vietnamese: "công ty", pos: "noun", frequency: 95,
        examples: [{ jp: "大きな会社で働いています。", en: "I work at a big company.", vi: "Tôi làm việc tại một công ty lớn." }]
    },
    {
        id: "vocab-063", kanji: "職業", hiragana: "しょくぎょう", romaji: "shokugyou",
        meaning: "occupation, profession", vietnamese: "nghề nghiệp", pos: "noun", frequency: 83,
        examples: [{ jp: "職業は何ですか。", en: "What is your occupation?", vi: "Nghề nghiệp của bạn là gì?" }]
    },
    {
        id: "vocab-064", kanji: "部長", hiragana: "ぶちょう", romaji: "buchou",
        meaning: "department manager", vietnamese: "trưởng phòng", pos: "noun", frequency: 78,
        examples: [{ jp: "部長と話しました。", en: "I talked with the department manager.", vi: "Tôi đã nói chuyện với trưởng phòng." }]
    },
    {
        id: "vocab-065", kanji: "課長", hiragana: "かちょう", romaji: "kachou",
        meaning: "section chief", vietnamese: "trưởng phòng ban", pos: "noun", frequency: 75,
        examples: [{ jp: "課長に報告します。", en: "I'll report to the section chief.", vi: "Tôi sẽ báo cáo với trưởng phòng ban." }]
    },
    {
        id: "vocab-066", kanji: "同僚", hiragana: "どうりょう", romaji: "douryou",
        meaning: "colleague", vietnamese: "đồng nghiệp", pos: "noun", frequency: 80,
        examples: [{ jp: "同僚と昼食を食べました。", en: "I had lunch with a colleague.", vi: "Tôi đã ăn trưa cùng đồng nghiệp." }]
    },
    {
        id: "vocab-067", kanji: "給料", hiragana: "きゅうりょう", romaji: "kyuuryou",
        meaning: "salary", vietnamese: "lương", pos: "noun", frequency: 85,
        examples: [{ jp: "来月給料が上がります。", en: "My salary will increase next month.", vi: "Lương tôi sẽ tăng vào tháng tới." }]
    },
    {
        id: "vocab-068", kanji: "残業", hiragana: "ざんぎょう", romaji: "zangyou",
        meaning: "overtime work", vietnamese: "làm thêm giờ", pos: "noun, verb", frequency: 82,
        examples: [{ jp: "今日は残業があります。", en: "I have overtime work today.", vi: "Hôm nay tôi phải làm thêm giờ." }]
    },
    {
        id: "vocab-069", kanji: "休暇", hiragana: "きゅうか", romaji: "kyuuka",
        meaning: "vacation, holiday", vietnamese: "nghỉ phép", pos: "noun", frequency: 79,
        examples: [{ jp: "夏休暇を取りました。", en: "I took summer vacation.", vi: "Tôi đã nghỉ hè." }]
    },
    {
        id: "vocab-070", kanji: "出張", hiragana: "しゅっちょう", romaji: "shutchou",
        meaning: "business trip", vietnamese: "công tác", pos: "noun, verb", frequency: 76,
        examples: [{ jp: "来週大阪に出張します。", en: "I'm going on a business trip to Osaka next week.", vi: "Tuần tới tôi sẽ đi công tác Osaka." }]
    }
];

// Generate additional vocabulary with different categories
const generateMoreVocab = () => {
    const categories = [
        'education', 'food', 'shopping', 'weather', 'emotions', 'hobbies',
        'technology', 'nature', 'sports', 'culture', 'money', 'housing'
    ];

    let vocabList = [...n3VocabDatabase];
    let currentId = 71;

    // Add more systematic vocabulary generation here
    // This would typically be connected to a comprehensive N3 database

    return vocabList;
};

// Load current vocabulary and append new ones
const updateVocabulary = () => {
    const vocabPath = path.join(__dirname, '../public/data/vocabulary.json');
    const currentVocab = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));

    const newVocab = generateMoreVocab();
    const combinedVocab = [...currentVocab, ...newVocab];

    // Sort by frequency (highest first)
    combinedVocab.sort((a, b) => (b.frequency || 0) - (a.frequency || 0));

    fs.writeFileSync(vocabPath, JSON.stringify(combinedVocab, null, 2));

    console.log(`✅ Updated vocabulary: ${combinedVocab.length} words total`);
    console.log(`📈 Added ${newVocab.length} new N3 words`);
    console.log(`🎯 Progress: ${Math.round((combinedVocab.length / 1000) * 100)}% toward 1000 words goal`);
};

// Run the update
updateVocabulary();