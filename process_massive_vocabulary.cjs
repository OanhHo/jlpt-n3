const fs = require('fs');
const path = require('path');

function processLargeVocabularyFile() {
    const inputPath = path.join(__dirname, 'public', 'data', 'tu-vung-n3-improved.json');
    const outputPath = path.join(__dirname, 'public', 'data', 'tu-vung-n3-massive.json');

    try {
        console.log('Loading large vocabulary file...');
        console.log('This may take a moment due to file size...');

        // Read file in chunks to handle large size
        const fileContent = fs.readFileSync(inputPath, 'utf8');
        console.log(`File loaded: ${fileContent.length} characters`);

        const inputData = JSON.parse(fileContent);
        console.log(`Parsed JSON successfully`);
        console.log(`Total lessons in input: ${inputData.lessons.length}`);
        console.log(`Total vocabulary claimed: ${inputData.totalVocabulary}`);

        // Process lessons in batches
        let allVocabulary = [];
        let processedCount = 0;

        console.log('\nProcessing lessons in batches...');
        for (let i = 0; i < inputData.lessons.length; i++) {
            const lesson = inputData.lessons[i];
            console.log(`Processing lesson ${i + 1}/${inputData.lessons.length}: ${lesson.title}`);

            if (lesson.vocabulary && Array.isArray(lesson.vocabulary)) {
                // Process vocabulary in smaller chunks
                const batchSize = 100;
                for (let j = 0; j < lesson.vocabulary.length; j += batchSize) {
                    const batch = lesson.vocabulary.slice(j, j + batchSize);
                    const processedBatch = batch.map(vocab => processVocabularyEntry(vocab, processedCount++));
                    allVocabulary = allVocabulary.concat(processedBatch.filter(v => v !== null));

                    if ((j + batchSize) % 500 === 0) {
                        console.log(`  Processed ${j + batchSize} entries in lesson ${i + 1}`);
                    }
                }
                console.log(`  Lesson ${i + 1} complete: ${lesson.vocabulary.length} entries processed`);
            }
        }

        console.log(`\nTotal vocabulary collected: ${allVocabulary.length}`);

        // Filter valid entries with better criteria
        console.log('Filtering vocabulary entries...');
        const validVocabulary = allVocabulary.filter(vocab => isValidVocabularyEntry(vocab));

        console.log(`Valid vocabulary: ${validVocabulary.length}`);
        console.log(`Filter rate: ${((validVocabulary.length / allVocabulary.length) * 100).toFixed(2)}%`);

        // Sort by quality (entries with more complete information first)
        console.log('Sorting by quality...');
        validVocabulary.sort((a, b) => {
            const scoreA = getQualityScore(a);
            const scoreB = getQualityScore(b);
            return scoreB - scoreA;
        });

        // Group into lessons of 30 words each
        console.log('Creating lessons...');
        const lessons = [];
        const wordsPerLesson = 30;

        for (let i = 0; i < validVocabulary.length; i += wordsPerLesson) {
            const lessonVocab = validVocabulary.slice(i, i + wordsPerLesson);
            const lessonNumber = Math.floor(i / wordsPerLesson) + 1;
            const startIndex = i + 1;
            const endIndex = Math.min(i + wordsPerLesson, validVocabulary.length);

            lessons.push({
                id: `lesson-${String(lessonNumber).padStart(3, '0')}`,
                title: `Lesson ${lessonNumber}: Vocabulary ${startIndex}-${endIndex}`,
                description: `JLPT N3 vocabulary collection covering words ${startIndex} to ${endIndex}`,
                vocabularyCount: lessonVocab.length,
                vocabulary: lessonVocab.map(v => ({
                    id: v.id,
                    kanji: v.kanji,
                    hiragana: v.hiragana,
                    pronunciation: v.pronunciation,
                    meaning: v.meaning,
                    example: v.example,
                    qualityScore: v.qualityScore
                }))
            });

            if (lessonNumber % 10 === 0) {
                console.log(`Created ${lessonNumber} lessons...`);
            }
        }

        // Create output data structure
        const outputData = {
            title: 'Tổng Hợp Từ Vựng N3 - Massive Edition',
            description: 'Từ vựng JLPT N3 đầy đủ từ PDF gốc, được xử lý và tổ chức thành các bài học 30 từ',
            sourceFile: inputData.sourceFile,
            extractedAt: inputData.extractedAt,
            processedAt: new Date().toISOString(),
            format: {
                wordsPerLesson: 30,
                fields: ['kanji', 'hiragana', 'pronunciation', 'meaning', 'example'],
                sortedByQuality: true
            },
            lessons: lessons,
            totalLessons: lessons.length,
            totalVocabulary: validVocabulary.length,
            statistics: {
                originalEntries: allVocabulary.length,
                validEntries: validVocabulary.length,
                filterRate: ((validVocabulary.length / allVocabulary.length) * 100).toFixed(2) + '%',
                entriesWithKanji: validVocabulary.filter(v => v.kanji).length,
                entriesWithHiragana: validVocabulary.filter(v => v.hiragana).length,
                entriesWithMeaning: validVocabulary.filter(v => v.meaning).length,
                entriesWithExamples: validVocabulary.filter(v => v.example).length,
                averageQualityScore: (validVocabulary.reduce((sum, v) => sum + v.qualityScore, 0) / validVocabulary.length).toFixed(2)
            }
        };

        // Write output file
        console.log('Writing output file...');
        fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');

        console.log('\n✅ Successfully processed massive vocabulary data!');
        console.log(`📊 Final Results:`);
        console.log(`   - Original entries: ${outputData.statistics.originalEntries}`);
        console.log(`   - Valid entries: ${outputData.statistics.validEntries}`);
        console.log(`   - Filter rate: ${outputData.statistics.filterRate}`);
        console.log(`   - Lessons created: ${outputData.totalLessons}`);
        console.log(`   - Average quality score: ${outputData.statistics.averageQualityScore}/5`);
        console.log(`   - Entries with kanji: ${outputData.statistics.entriesWithKanji}`);
        console.log(`   - Entries with hiragana: ${outputData.statistics.entriesWithHiragana}`);
        console.log(`   - Entries with examples: ${outputData.statistics.entriesWithExamples}`);
        console.log(`   - Output file: ${outputPath}`);

        // Show preview of best quality entries
        if (lessons.length > 0) {
            console.log(`\n📖 Preview of highest quality entries:`);
            const topEntries = validVocabulary.slice(0, 5);
            topEntries.forEach((vocab, i) => {
                console.log(`   ${i + 1}. ${vocab.kanji || vocab.hiragana || 'N/A'} (Score: ${vocab.qualityScore}/5)`);
                console.log(`      - Kanji: ${vocab.kanji || 'N/A'}`);
                console.log(`      - Hiragana: ${vocab.hiragana || 'N/A'}`);
                console.log(`      - Pronunciation: ${vocab.pronunciation || 'N/A'}`);
                console.log(`      - Meaning: ${vocab.meaning || 'N/A'}`);
                if (vocab.example) {
                    console.log(`      - Example: ${vocab.example.substring(0, 60)}...`);
                }
            });
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.message.includes('JSON')) {
            console.error('💡 The JSON file might be corrupted or too large to parse at once.');
            console.error('💡 Try using a streaming JSON parser or splitting the file manually.');
        }
        process.exit(1);
    }
}

function processVocabularyEntry(vocab, index) {
    if (!vocab || !vocab.originalText) return null;

    const processed = {
        id: `vocab-${String(index + 1).padStart(4, '0')}`,
        kanji: '',
        hiragana: '',
        pronunciation: '',
        meaning: '',
        example: '',
        originalText: vocab.originalText.trim(),
        qualityScore: 0
    };

    // Use existing processed data
    if (vocab.kanji) processed.kanji = vocab.kanji.trim();
    if (vocab.hiragana) processed.hiragana = vocab.hiragana.trim();
    if (vocab.meaning) processed.meaning = vocab.meaning.trim();
    if (vocab.pronunciation) processed.pronunciation = vocab.pronunciation.trim();
    if (vocab.example) processed.example = vocab.example.trim();

    // Enhanced text processing for missing fields
    const text = processed.originalText;

    // Pattern matching for different formats
    if (!processed.kanji || !processed.hiragana || !processed.meaning) {
        // Pattern 1: kanji hiragana meaning
        const pattern1 = text.match(/([一-龯]+)\s+([あ-ん]+)\s+(.+)/);
        if (pattern1) {
            if (!processed.kanji) processed.kanji = pattern1[1].trim();
            if (!processed.hiragana) processed.hiragana = pattern1[2].trim();
            if (!processed.meaning) processed.meaning = pattern1[3].trim();
        }

        // Pattern 2: kanji (hiragana) meaning
        const pattern2 = text.match(/([一-龯]+)\s*[（(]\s*([あ-ん]+)\s*[）)]\s*(.+)/);
        if (pattern2) {
            if (!processed.kanji) processed.kanji = pattern2[1].trim();
            if (!processed.hiragana) processed.hiragana = pattern2[2].trim();
            if (!processed.meaning) processed.meaning = pattern2[3].trim();
        }

        // Pattern 3: kanji meaning (no hiragana)
        const pattern3 = text.match(/^([一-龯]{1,4})\s+([a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s,\-\.]+)$/);
        if (pattern3) {
            if (!processed.kanji) processed.kanji = pattern3[1].trim();
            if (!processed.meaning) processed.meaning = pattern3[2].trim();
        }

        // Pattern 4: hiragana meaning (no kanji)
        const pattern4 = text.match(/^([あ-ん]+)\s+([a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s,\-\.]+)$/);
        if (pattern4) {
            if (!processed.hiragana) processed.hiragana = pattern4[1].trim();
            if (!processed.meaning) processed.meaning = pattern4[2].trim();
        }
    }

    // Generate pronunciation if missing
    if (!processed.pronunciation && processed.hiragana) {
        processed.pronunciation = romajiFromHiragana(processed.hiragana);
    }

    // Generate example if missing
    if (!processed.example && (processed.kanji || processed.hiragana) && processed.meaning) {
        processed.example = generateExampleSentence(processed.kanji, processed.hiragana, processed.meaning);
    }

    // Calculate quality score
    processed.qualityScore = getQualityScore(processed);

    return processed;
}

function isValidVocabularyEntry(vocab) {
    if (!vocab) return false;

    // Must have either kanji or hiragana
    const hasJapanese = vocab.kanji || vocab.hiragana;

    // Must have meaningful content
    const hasMeaning = vocab.meaning && vocab.meaning.length > 1;

    // Filter out invalid/system entries
    const validMeaning = vocab.meaning &&
        !vocab.meaning.includes('PART') &&
        !vocab.meaning.includes('まとめ') &&
        !vocab.meaning.includes('□') &&
        !vocab.meaning.includes('⓵') &&
        !vocab.meaning.includes('⓶') &&
        !vocab.meaning.includes('⓷') &&
        !/^\d+$/.test(vocab.meaning) &&
        !/^[A-Z]+$/.test(vocab.meaning.trim()) && // Avoid single letter meanings
        vocab.meaning.length > 1;

    // Must have quality score above threshold
    const qualityThreshold = 2;
    const hasQuality = vocab.qualityScore >= qualityThreshold;

    return hasJapanese && hasMeaning && validMeaning && hasQuality;
}

function getQualityScore(vocab) {
    let score = 0;

    // Points for having kanji
    if (vocab.kanji && vocab.kanji.length > 0) score += 1;

    // Points for having hiragana
    if (vocab.hiragana && vocab.hiragana.length > 0) score += 1;

    // Points for having meaningful Vietnamese meaning
    if (vocab.meaning && vocab.meaning.length > 2 &&
        /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/.test(vocab.meaning)) {
        score += 1;
    }

    // Points for having pronunciation
    if (vocab.pronunciation && vocab.pronunciation.length > 0) score += 1;

    // Points for having example
    if (vocab.example && vocab.example.length > 10) score += 1;

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
        `${word}について勉強します。${reading ? `(${reading} ni tsuite benkyou shimasu.)` : ''} - Học về ${meaning}.`,
        `毎日${word}を使います。${reading ? `(Mainichi ${reading} wo tsukai masu.)` : ''} - Hàng ngày sử dụng ${meaning}.`,
        `${word}は便利です。${reading ? `(${reading} wa benri desu.)` : ''} - ${meaning} rất hữu ích.`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
}

// Run the processing
processLargeVocabularyFile();