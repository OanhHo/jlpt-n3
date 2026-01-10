const fs = require('fs');
const path = require('path');

function processImprovedVocabulary() {
    const inputPath = path.join(__dirname, 'public', 'data', 'tu-vung-n3-improved.json');
    const outputPath = path.join(__dirname, 'public', 'data', 'tu-vung-n3-complete.json');

    try {
        console.log('Loading improved vocabulary data...');
        const inputData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

        console.log(`Original data: ${inputData.totalVocabulary} vocabulary entries`);
        console.log(`Total lessons: ${inputData.totalLessons}`);

        // Collect all vocabulary from all lessons
        let allVocabulary = [];
        for (const lesson of inputData.lessons) {
            if (lesson.vocabulary && Array.isArray(lesson.vocabulary)) {
                allVocabulary = allVocabulary.concat(lesson.vocabulary);
            }
        }

        console.log(`Collected ${allVocabulary.length} total vocabulary entries`);

        // Enhanced processing for each vocabulary entry
        const processedVocabulary = allVocabulary.map((vocab, index) => {
            const processed = {
                id: `vocab-${String(index + 1).padStart(4, '0')}`,
                kanji: '',
                hiragana: '',
                pronunciation: '',
                meaning: '',
                example: '',
                originalText: vocab.originalText || '',
                lineNumber: vocab.lineNumber || index + 1
            };

            // Use existing processed data if available
            if (vocab.kanji) processed.kanji = vocab.kanji.trim();
            if (vocab.hiragana) processed.hiragana = vocab.hiragana.trim();
            if (vocab.meaning) processed.meaning = vocab.meaning.trim();
            if (vocab.pronunciation) processed.pronunciation = vocab.pronunciation.trim();
            if (vocab.example) processed.example = vocab.example.trim();

            // Try to extract more info from originalText if missing
            if (vocab.originalText && (!processed.kanji || !processed.hiragana || !processed.meaning)) {
                const text = vocab.originalText.trim();

                // Pattern: kanji hiragana meaning
                const pattern1 = text.match(/([一-龯]+)\s+([あ-ん]+)\s+(.+)/);
                if (pattern1) {
                    if (!processed.kanji) processed.kanji = pattern1[1].trim();
                    if (!processed.hiragana) processed.hiragana = pattern1[2].trim();
                    if (!processed.meaning) processed.meaning = pattern1[3].trim();
                }

                // Pattern: kanji (hiragana) meaning
                const pattern2 = text.match(/([一-龯]+)\s*[（(]\s*([あ-ん]+)\s*[）)]\s*(.+)/);
                if (pattern2) {
                    if (!processed.kanji) processed.kanji = pattern2[1].trim();
                    if (!processed.hiragana) processed.hiragana = pattern2[2].trim();
                    if (!processed.meaning) processed.meaning = pattern2[3].trim();
                }

                // Pattern: just kanji with meaning
                const pattern3 = text.match(/^([一-龯]{1,4})\s+([a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s,\-\.]+)$/);
                if (pattern3) {
                    if (!processed.kanji) processed.kanji = pattern3[1].trim();
                    if (!processed.meaning) processed.meaning = pattern3[2].trim();
                }

                // Pattern: just hiragana with meaning
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

            // Generate example if missing and we have enough info
            if (!processed.example && (processed.kanji || processed.hiragana) && processed.meaning) {
                processed.example = generateExampleSentence(processed.kanji, processed.hiragana, processed.meaning);
            }

            return processed;
        });

        // Filter valid vocabulary entries
        const validVocabulary = processedVocabulary.filter(vocab => {
            // Must have either kanji or hiragana
            const hasJapanese = vocab.kanji || vocab.hiragana;
            // Must have meaning
            const hasMeaning = vocab.meaning && vocab.meaning.length > 1;
            // Filter out invalid meanings
            const validMeaning = vocab.meaning &&
                !vocab.meaning.includes('PART') &&
                !vocab.meaning.includes('まとめ') &&
                !vocab.meaning.includes('□') &&
                !/^\d+$/.test(vocab.meaning) &&
                vocab.meaning.length > 1;

            return hasJapanese && hasMeaning && validMeaning;
        });

        console.log(`Processed ${processedVocabulary.length} entries`);
        console.log(`Valid entries: ${validVocabulary.length}`);

        // Organize into lessons of 30 words each
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
                    example: v.example
                }))
            });
        }

        const outputData = {
            title: 'Tổng Hợp Từ Vựng N3 - Complete Edition',
            description: 'Từ vựng JLPT N3 đầy đủ được tổ chức thành các bài học 30 từ, bao gồm kanji, hiragana, nghĩa tiếng Việt, cách đọc và câu ví dụ',
            sourceFile: inputData.sourceFile,
            extractedAt: inputData.extractedAt,
            processedAt: new Date().toISOString(),
            format: {
                wordsPerLesson: 30,
                fields: ['kanji', 'hiragana', 'pronunciation', 'meaning', 'example']
            },
            lessons: lessons,
            totalLessons: lessons.length,
            totalVocabulary: validVocabulary.length,
            statistics: {
                originalEntries: allVocabulary.length,
                processedEntries: processedVocabulary.length,
                validEntries: validVocabulary.length,
                filterRate: ((validVocabulary.length / allVocabulary.length) * 100).toFixed(2) + '%',
                entriesWithKanji: validVocabulary.filter(v => v.kanji).length,
                entriesWithHiragana: validVocabulary.filter(v => v.hiragana).length,
                entriesWithExamples: validVocabulary.filter(v => v.example).length
            }
        };

        fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');

        console.log('\n✅ Successfully processed complete vocabulary data!');
        console.log(`📊 Final Summary:`);
        console.log(`   - Original entries: ${outputData.statistics.originalEntries}`);
        console.log(`   - Valid entries: ${outputData.statistics.validEntries}`);
        console.log(`   - Filter rate: ${outputData.statistics.filterRate}`);
        console.log(`   - Lessons created: ${outputData.totalLessons}`);
        console.log(`   - Words per lesson: ${wordsPerLesson}`);
        console.log(`   - Entries with kanji: ${outputData.statistics.entriesWithKanji}`);
        console.log(`   - Entries with hiragana: ${outputData.statistics.entriesWithHiragana}`);
        console.log(`   - Entries with examples: ${outputData.statistics.entriesWithExamples}`);
        console.log(`   - Output: ${outputPath}`);

        // Show preview of first lesson
        if (lessons.length > 0) {
            const firstLesson = lessons[0];
            console.log(`\n📖 Preview of ${firstLesson.title}:`);
            console.log(`   Vocabulary count: ${firstLesson.vocabularyCount}`);
            console.log(`   Sample entries:`);

            firstLesson.vocabulary.slice(0, 5).forEach((vocab, i) => {
                console.log(`   ${i + 1}. ${vocab.kanji || vocab.hiragana || 'N/A'}`);
                console.log(`      - Kanji: ${vocab.kanji || 'N/A'}`);
                console.log(`      - Hiragana: ${vocab.hiragana || 'N/A'}`);
                console.log(`      - Pronunciation: ${vocab.pronunciation || 'N/A'}`);
                console.log(`      - Meaning: ${vocab.meaning || 'N/A'}`);
                if (vocab.example) {
                    console.log(`      - Example: ${vocab.example.substring(0, 80)}...`);
                }
            });
        }

        // Show some statistics about the last lesson
        if (lessons.length > 1) {
            const lastLesson = lessons[lessons.length - 1];
            console.log(`\n   Last lesson (${lastLesson.title}): ${lastLesson.vocabularyCount} words`);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
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
        'わ': 'wa', 'ゐ': 'wi', 'ゑ': 'we', 'を': 'wo', 'ん': 'n',
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
        'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
        'っ': '', 'ー': ''
    };

    let result = '';
    for (let i = 0; i < hiragana.length; i++) {
        const twoChar = hiragana.substring(i, i + 2);
        if (conversions[twoChar]) {
            result += conversions[twoChar];
            i++; // Skip next character
        } else {
            result += conversions[hiragana[i]] || hiragana[i];
        }
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
processImprovedVocabulary();