const fs = require('fs');
const path = require('path');

// Helper function to generate example sentences
function generateExampleSentence(kanji, hiragana, meaning) {
    const templates = [
        `${kanji}は大切です。(${hiragana} wa taisetsu desu.) - ${meaning} là quan trọng.`,
        `私は${kanji}が好きです。(Watashi wa ${hiragana} ga suki desu.) - Tôi thích ${meaning}.`,
        `${kanji}について話しましょう。(${hiragana} ni tsuite hanashimashou.) - Hãy nói về ${meaning}.`,
        `${kanji}を勉強します。(${hiragana} wo benkyou shimasu.) - Tôi học về ${meaning}.`,
        `${kanji}は便利です。(${hiragana} wa benri desu.) - ${meaning} rất tiện lợi.`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
}

// Helper function to extract pronunciation from various sources
function extractPronunciation(vocab) {
    if (vocab.pronunciation) return vocab.pronunciation;
    if (vocab.hiragana) return romajiFromHiragana(vocab.hiragana);
    return '';
}

// Basic hiragana to romaji conversion (simplified)
function romajiFromHiragana(hiragana) {
    const conversions = {
        'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
        'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
        'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
        'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
        'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
        'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
        'だ': 'da', 'ぢ': 'di', 'づ': 'du', 'で': 'de', 'ど': 'do',
        'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
        'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
        'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
        'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
        'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
        'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
        'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
        'わ': 'wa', 'ゐ': 'wi', 'ゑ': 'we', 'を': 'wo', 'ん': 'n',
        'ー': '', 'っ': '',
        'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
        'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
        'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
        'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
        'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
        'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
        'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
        'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
        'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
        'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
        'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo'
    };

    let result = '';
    for (let i = 0; i < hiragana.length; i++) {
        const char = hiragana[i];
        const twoChar = hiragana.substring(i, i + 2);

        if (conversions[twoChar]) {
            result += conversions[twoChar];
            i++; // Skip next character
        } else if (conversions[char]) {
            result += conversions[char];
        } else {
            result += char;
        }
    }

    return result;
}

// Clean and normalize vocabulary entry
function normalizeVocabularyEntry(vocab, index) {
    const normalized = {
        id: `vocab-${String(index + 1).padStart(3, '0')}`,
        kanji: '',
        hiragana: '',
        pronunciation: '',
        meaning: '',
        example: ''
    };

    // Extract kanji
    if (vocab.kanji) {
        normalized.kanji = vocab.kanji.trim();
    } else if (vocab.originalText && /[一-龯]/.test(vocab.originalText)) {
        // Try to extract kanji from original text
        const kanjiMatch = vocab.originalText.match(/([一-龯]+)/);
        if (kanjiMatch) {
            normalized.kanji = kanjiMatch[1];
        }
    }

    // Extract hiragana
    if (vocab.hiragana) {
        normalized.hiragana = vocab.hiragana.trim();
    } else if (vocab.originalText && /[あ-ん]/.test(vocab.originalText)) {
        // Try to extract hiragana from original text
        const hiraganaMatch = vocab.originalText.match(/([あ-ん]+)/);
        if (hiraganaMatch) {
            normalized.hiragana = hiraganaMatch[1];
        }
    }

    // Extract meaning
    if (vocab.meaning) {
        normalized.meaning = vocab.meaning.trim();
    } else if (vocab.originalText) {
        // Try to extract Vietnamese/English meaning
        const meaningMatch = vocab.originalText.match(/([a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s,]+)$/);
        if (meaningMatch) {
            normalized.meaning = meaningMatch[1].trim();
        }
    }

    // Generate pronunciation
    if (normalized.hiragana) {
        normalized.pronunciation = romajiFromHiragana(normalized.hiragana);
    }

    // Generate example sentence
    if (vocab.example) {
        normalized.example = vocab.example.trim();
    } else if (normalized.kanji && normalized.hiragana && normalized.meaning) {
        normalized.example = generateExampleSentence(normalized.kanji, normalized.hiragana, normalized.meaning);
    }

    // Use original text as fallback for missing fields
    if (!normalized.kanji && !normalized.hiragana && vocab.originalText) {
        if (/[一-龯]/.test(vocab.originalText)) {
            normalized.kanji = vocab.originalText.trim();
        } else if (/[あ-ん]/.test(vocab.originalText)) {
            normalized.hiragana = vocab.originalText.trim();
            normalized.pronunciation = romajiFromHiragana(normalized.hiragana);
        }
    }

    return normalized;
}

// Filter and clean vocabulary entries
function filterValidVocabulary(vocabularyArray) {
    return vocabularyArray.filter(vocab => {
        // Must have Japanese characters or be processed
        const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(vocab.originalText);
        const isProcessed = vocab.processed && (vocab.kanji || vocab.hiragana);
        const isNotTooShort = vocab.originalText && vocab.originalText.length > 1;

        return (hasJapanese || isProcessed) && isNotTooShort;
    });
}

// Organize vocabulary into 30-word lessons
function organizeIntoLessons(vocabularyArray) {
    const lessons = [];
    const wordsPerLesson = 30;

    for (let i = 0; i < vocabularyArray.length; i += wordsPerLesson) {
        const lessonVocab = vocabularyArray.slice(i, i + wordsPerLesson);
        const lessonNumber = Math.floor(i / wordsPerLesson) + 1;
        const startIndex = i + 1;
        const endIndex = Math.min(i + wordsPerLesson, vocabularyArray.length);

        lessons.push({
            id: `lesson-${String(lessonNumber).padStart(3, '0')}`,
            title: `Lesson ${lessonNumber}: Vocabulary ${startIndex}-${endIndex}`,
            description: `JLPT N3 vocabulary collection covering words ${startIndex} to ${endIndex}`,
            vocabularyCount: lessonVocab.length,
            vocabulary: lessonVocab
        });
    }

    return lessons;
}

async function restructureVocabularyJSON() {
    const inputPath = path.join(__dirname, 'public', 'data', 'tu-vung-n3-improved.json');
    const outputPath = path.join(__dirname, 'public', 'data', 'tu-vung-n3-lessons.json');

    try {
        console.log('Reading input file:', inputPath);
        const inputData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

        console.log(`Original data: ${inputData.totalVocabulary} vocabulary entries in ${inputData.totalLessons} lessons`);

        // Collect all vocabulary from all lessons
        let allVocabulary = [];
        for (const lesson of inputData.lessons) {
            if (lesson.vocabulary && Array.isArray(lesson.vocabulary)) {
                allVocabulary = allVocabulary.concat(lesson.vocabulary);
            }
        }

        console.log(`Collected ${allVocabulary.length} total vocabulary entries`);

        // Filter valid vocabulary
        const validVocabulary = filterValidVocabulary(allVocabulary);
        console.log(`Filtered to ${validVocabulary.length} valid vocabulary entries`);

        // Normalize vocabulary entries
        const normalizedVocabulary = validVocabulary.map((vocab, index) =>
            normalizeVocabularyEntry(vocab, index)
        );

        console.log('Normalized vocabulary entries with proper format');

        // Organize into lessons of 30 words each
        const organizedLessons = organizeIntoLessons(normalizedVocabulary);

        // Create final structure
        const outputData = {
            title: 'Tổng Hợp Từ Vựng N3',
            description: 'Từ vựng JLPT N3 được tổ chức thành các bài học 30 từ, bao gồm kanji, hiragana, nghĩa tiếng Việt, cách đọc và câu ví dụ',
            sourceFile: inputData.sourceFile,
            extractedAt: inputData.extractedAt,
            restructuredAt: new Date().toISOString(),
            format: {
                wordsPerLesson: 30,
                fields: ['kanji', 'hiragana', 'pronunciation', 'meaning', 'example']
            },
            lessons: organizedLessons,
            totalLessons: organizedLessons.length,
            totalVocabulary: normalizedVocabulary.length,
            statistics: {
                originalEntries: allVocabulary.length,
                validEntries: validVocabulary.length,
                normalizedEntries: normalizedVocabulary.length,
                lessonsCreated: organizedLessons.length,
                averageWordsPerLesson: normalizedVocabulary.length / organizedLessons.length
            }
        };

        // Save restructured data
        fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');

        console.log('\n✅ Successfully restructured vocabulary data!');
        console.log(`📊 Summary:`);
        console.log(`   - Original entries: ${outputData.statistics.originalEntries}`);
        console.log(`   - Valid entries: ${outputData.statistics.validEntries}`);
        console.log(`   - Final vocabulary: ${outputData.totalVocabulary}`);
        console.log(`   - Lessons created: ${outputData.totalLessons}`);
        console.log(`   - Words per lesson: 30 (last lesson: ${organizedLessons[organizedLessons.length - 1].vocabularyCount})`);
        console.log(`   - Output file: ${outputPath}`);

        // Show preview of first lesson
        if (organizedLessons.length > 0) {
            const firstLesson = organizedLessons[0];
            console.log(`\n📖 Preview of ${firstLesson.title}:`);
            console.log(`   Description: ${firstLesson.description}`);
            console.log(`   Vocabulary count: ${firstLesson.vocabularyCount}`);

            if (firstLesson.vocabulary.length > 0) {
                console.log(`\n   Sample entries:`);
                firstLesson.vocabulary.slice(0, 3).forEach((vocab, i) => {
                    console.log(`   ${i + 1}. ${vocab.kanji || vocab.hiragana || 'N/A'}`);
                    console.log(`      - Hiragana: ${vocab.hiragana || 'N/A'}`);
                    console.log(`      - Pronunciation: ${vocab.pronunciation || 'N/A'}`);
                    console.log(`      - Meaning: ${vocab.meaning || 'N/A'}`);
                    console.log(`      - Example: ${vocab.example ? vocab.example.substring(0, 80) + '...' : 'N/A'}`);
                });
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run the restructuring
restructureVocabularyJSON();