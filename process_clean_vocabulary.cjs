const fs = require('fs');
const path = require('path');

function createCleanVocabulary() {
    const inputPath = path.join(__dirname, 'public', 'data', 'tu-vung-n3-improved.json');
    const outputPath = path.join(__dirname, 'public', 'data', 'tu-vung-n3-clean.json');

    try {
        console.log('📖 Loading improved vocabulary data...');
        const fileContent = fs.readFileSync(inputPath, 'utf8');
        const inputData = JSON.parse(fileContent);

        console.log(`Processing ${inputData.lessons.length} lessons...`);

        let allValidVocab = [];

        // Process each lesson
        for (let lessonIndex = 0; lessonIndex < inputData.lessons.length; lessonIndex++) {
            const lesson = inputData.lessons[lessonIndex];
            console.log(`\nLesson ${lessonIndex + 1}: "${lesson.title}"`);
            console.log(`Raw entries: ${lesson.vocabulary.length}`);

            // Skip header lessons
            if (lesson.title.includes('PART') || lesson.title.includes('まとめ') || lesson.vocabulary.length < 100) {
                console.log('  → Skipping header lesson');
                continue;
            }

            // Process vocabulary entries
            for (let i = 0; i < lesson.vocabulary.length; i++) {
                const vocab = lesson.vocabulary[i];
                const cleanedVocab = processVocabularyEntry(vocab, allValidVocab.length);

                if (cleanedVocab && isValidVocabulary(cleanedVocab)) {
                    allValidVocab.push(cleanedVocab);
                }
            }

            console.log(`  → Processed: ${allValidVocab.length} valid entries so far`);
        }

        console.log(`\n✅ Total valid vocabulary: ${allValidVocab.length}`);

        // Sort by quality
        allValidVocab.sort((a, b) => b.qualityScore - a.qualityScore);

        // Create lessons of 30 words each
        const lessons = [];
        const wordsPerLesson = 30;

        for (let i = 0; i < allValidVocab.length; i += wordsPerLesson) {
            const lessonVocab = allValidVocab.slice(i, i + wordsPerLesson);
            const lessonNumber = Math.floor(i / wordsPerLesson) + 1;

            lessons.push({
                id: `lesson-${String(lessonNumber).padStart(3, '0')}`,
                title: `Bài ${lessonNumber}: Từ vựng N3`,
                description: `Học ${lessonVocab.length} từ vựng JLPT N3 quan trọng`,
                vocabularyCount: lessonVocab.length,
                vocabulary: lessonVocab.map(v => ({
                    id: v.id,
                    kanji: v.kanji,
                    hiragana: v.hiragana,
                    pronunciation: v.pronunciation,
                    meaning: v.meaning,
                    example: v.example
                }))
            });
        }

        // Create final output
        const outputData = {
            title: 'Từ Vựng N3 - Clean Edition',
            description: 'Từ vựng JLPT N3 được làm sạch và tối ưu hóa',
            sourceFile: inputData.sourceFile,
            extractedAt: inputData.extractedAt,
            processedAt: new Date().toISOString(),
            method: 'Clean text processing with Vietnamese meaning extraction',
            lessons: lessons,
            totalLessons: lessons.length,
            totalVocabulary: allValidVocab.length,
            statistics: {
                validEntries: allValidVocab.length,
                entriesWithKanji: allValidVocab.filter(v => v.kanji).length,
                entriesWithHiragana: allValidVocab.filter(v => v.hiragana).length,
                entriesWithMeaning: allValidVocab.filter(v => v.meaning).length,
                averageQuality: (allValidVocab.reduce((sum, v) => sum + v.qualityScore, 0) / allValidVocab.length).toFixed(2)
            }
        };

        fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');

        console.log('\n🎉 Clean vocabulary created successfully!');
        console.log(`📊 Results:`);
        console.log(`   - Valid entries: ${outputData.statistics.validEntries}`);
        console.log(`   - Lessons created: ${outputData.totalLessons}`);
        console.log(`   - Entries with kanji: ${outputData.statistics.entriesWithKanji}`);
        console.log(`   - Entries with hiragana: ${outputData.statistics.entriesWithHiragana}`);
        console.log(`   - Average quality: ${outputData.statistics.averageQuality}/5`);
        console.log(`   - Output file: ${outputPath}`);

        // Show preview
        console.log(`\n📚 Preview of clean entries:`);
        const topEntries = allValidVocab.slice(0, 10);
        topEntries.forEach((vocab, i) => {
            console.log(`   ${i + 1}. ${vocab.kanji || vocab.hiragana} (${vocab.pronunciation})`);
            console.log(`      → ${vocab.meaning}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    }
}

function processVocabularyEntry(vocab, index) {
    if (!vocab || !vocab.originalText) return null;

    const text = vocab.originalText.trim();

    // Skip unwanted entries
    if (text.includes('□') || text.includes('PART') || text.includes('まとめ') ||
        text.length < 2 || /^\d+$/.test(text)) {
        return null;
    }

    const processed = {
        id: `vocab-${String(index + 1).padStart(4, '0')}`,
        kanji: '',
        hiragana: '',
        pronunciation: '',
        meaning: '',
        example: '',
        qualityScore: 0,
        originalText: text
    };

    // Use existing processed data if available
    if (vocab.kanji) processed.kanji = vocab.kanji.trim();
    if (vocab.hiragana) processed.hiragana = vocab.hiragana.trim();
    if (vocab.meaning) processed.meaning = cleanVietnameseMeaning(vocab.meaning.trim());
    if (vocab.pronunciation) processed.pronunciation = vocab.pronunciation.trim();

    // Parse from original text if missing data
    if (!processed.kanji || !processed.hiragana || !processed.meaning) {
        parseTextContent(text, processed);
    }

    // Generate pronunciation from hiragana
    if (!processed.pronunciation && processed.hiragana) {
        processed.pronunciation = romajiFromHiragana(processed.hiragana);
    }

    // Generate example sentence
    if (processed.kanji || processed.hiragana) {
        processed.example = generateExampleSentence(
            processed.kanji,
            processed.hiragana,
            processed.meaning
        );
    }

    // Calculate quality score
    processed.qualityScore = calculateQualityScore(processed);

    return processed;
}

function cleanVietnameseMeaning(meaning) {
    if (!meaning) return '';

    // Remove Japanese characters and keep only Vietnamese/English
    let cleaned = meaning
        .replace(/[一-龯]+/g, '') // Remove kanji
        .replace(/[あ-ん]+/g, '') // Remove hiragana
        .replace(/[ア-ン]+/g, '') // Remove katakana
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();

    // Extract Vietnamese meaning (contains Vietnamese characters)
    const vietnameseMatch = cleaned.match(/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ][a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]*/);

    if (vietnameseMatch) {
        cleaned = vietnameseMatch[0].trim();
    }

    // Fallback: take first meaningful word if no Vietnamese found
    if (!cleaned || cleaned.length < 2) {
        const words = meaning.split(/\s+/).filter(word =>
            word.length > 1 &&
            !/^[一-龯あ-んア-ン]+$/.test(word) &&
            word !== 'Ý' && word !== 'ý'
        );
        if (words.length > 0) {
            cleaned = words[0];
        }
    }

    return cleaned;
}

function parseTextContent(text, processed) {
    // Pattern 1: kanji hiragana vietnamese
    const pattern1 = text.match(/([一-龯]+)\s+([あ-ん]+)\s+([a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ][a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]*)/);
    if (pattern1) {
        if (!processed.kanji) processed.kanji = pattern1[1];
        if (!processed.hiragana) processed.hiragana = pattern1[2];
        if (!processed.meaning) processed.meaning = pattern1[3].trim();
        return;
    }

    // Pattern 2: kanji (hiragana) vietnamese
    const pattern2 = text.match(/([一-龯]+)\s*[（(]\s*([あ-ん]+)\s*[）)]\s*([a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ][a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]*)/);
    if (pattern2) {
        if (!processed.kanji) processed.kanji = pattern2[1];
        if (!processed.hiragana) processed.hiragana = pattern2[2];
        if (!processed.meaning) processed.meaning = pattern2[3].trim();
        return;
    }

    // Pattern 3: hiragana vietnamese
    const pattern3 = text.match(/^([あ-ん]+)\s+([a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ][a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+)$/);
    if (pattern3) {
        if (!processed.hiragana) processed.hiragana = pattern3[1];
        if (!processed.meaning) processed.meaning = pattern3[2].trim();
        return;
    }

    // Extract individual components
    if (!processed.kanji) {
        const kanjiMatch = text.match(/[一-龯]+/);
        if (kanjiMatch) processed.kanji = kanjiMatch[0];
    }

    if (!processed.hiragana) {
        const hiraganaMatch = text.match(/[あ-ん]+/);
        if (hiraganaMatch) processed.hiragana = hiraganaMatch[0];
    }

    if (!processed.meaning) {
        const vietnameseMatch = text.match(/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ][a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]*/);
        if (vietnameseMatch) processed.meaning = vietnameseMatch[0].trim();
    }
}

function isValidVocabulary(vocab) {
    // Must have either kanji or hiragana
    const hasJapanese = vocab.kanji || vocab.hiragana;

    // Must have clean Vietnamese meaning
    const hasMeaning = vocab.meaning &&
        vocab.meaning.length > 1 &&
        /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđa-zA-Z]/.test(vocab.meaning);

    // Quality threshold
    const hasQuality = vocab.qualityScore >= 3;

    return hasJapanese && hasMeaning && hasQuality;
}

function calculateQualityScore(vocab) {
    let score = 0;

    if (vocab.kanji && vocab.kanji.length > 0) score += 1;
    if (vocab.hiragana && vocab.hiragana.length > 0) score += 1;
    if (vocab.meaning && vocab.meaning.length > 2 &&
        /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/.test(vocab.meaning)) score += 2;
    if (vocab.pronunciation && vocab.pronunciation.length > 0) score += 1;

    return score;
}

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
        'わ': 'wa', 'ゐ': 'wi', 'ゑ': 'we', 'を': 'wo', 'ん': 'n'
    };

    let result = '';
    for (const char of hiragana) {
        result += conversions[char] || char;
    }
    return result;
}

function generateExampleSentence(kanji, hiragana, meaning) {
    if (!kanji && !hiragana) return '';

    const word = kanji || hiragana;
    const reading = hiragana || '';

    const templates = [
        `${word}は大切です。${reading ? `(${reading} wa taisetsu desu.)` : ''} - ${meaning} là quan trọng.`,
        `私は${word}が好きです。${reading ? `(Watashi wa ${reading} ga suki desu.)` : ''} - Tôi thích ${meaning}.`,
        `${word}について勉強します。${reading ? `(${reading} ni tsuite benkyou shimasu.)` : ''} - Học về ${meaning}.`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
}

createCleanVocabulary();