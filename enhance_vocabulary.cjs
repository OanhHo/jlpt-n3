const fs = require('fs');
const path = require('path');

// Enhanced vocabulary processing with better parsing
function enhancedVocabularyProcessing() {
    const inputPath = path.join(__dirname, 'public', 'data', 'tu-vung-n3-improved.json');
    const outputPath = path.join(__dirname, 'public', 'data', 'tu-vung-n3-enhanced.json');

    try {
        console.log('Reading and processing vocabulary data...');
        const inputData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

        // Process raw text to find vocabulary patterns
        const rawText = inputData.rawTextPreview;
        const lines = rawText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        console.log(`Processing ${lines.length} lines for vocabulary patterns...`);

        const vocabularyEntries = [];
        let entryCount = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Skip non-vocabulary lines
            if (line.length < 2 ||
                line.includes('PART') ||
                line.includes('まとめ') ||
                line.includes('□') ||
                /^\d+$/.test(line)) {
                continue;
            }

            // Pattern 1: kanji hiragana meaning (separated by spaces)
            const pattern1 = line.match(/([一-龯]+)\s+([あ-ん]+)\s+(.+)/);
            if (pattern1) {
                const vocab = {
                    id: `vocab-${String(++entryCount).padStart(3, '0')}`,
                    kanji: pattern1[1].trim(),
                    hiragana: pattern1[2].trim(),
                    pronunciation: romajiFromHiragana(pattern1[2].trim()),
                    meaning: pattern1[3].trim(),
                    example: generateExampleSentence(pattern1[1], pattern1[2], pattern1[3])
                };
                vocabularyEntries.push(vocab);
                continue;
            }

            // Pattern 2: kanji (hiragana) meaning
            const pattern2 = line.match(/([一-龯]+)\s*[（(]\s*([あ-ん]+)\s*[）)]\s*(.+)/);
            if (pattern2) {
                const vocab = {
                    id: `vocab-${String(++entryCount).padStart(3, '0')}`,
                    kanji: pattern2[1].trim(),
                    hiragana: pattern2[2].trim(),
                    pronunciation: romajiFromHiragana(pattern2[2].trim()),
                    meaning: pattern2[3].trim(),
                    example: generateExampleSentence(pattern2[1], pattern2[2], pattern2[3])
                };
                vocabularyEntries.push(vocab);
                continue;
            }

            // Pattern 3: kanji meaning (look for hiragana in next line)
            const pattern3 = line.match(/([一-龯]+)\s+(.+)/);
            if (pattern3 && i + 1 < lines.length) {
                const nextLine = lines[i + 1];
                const hiraganaMatch = nextLine.match(/^([あ-ん]+)$/);
                if (hiraganaMatch) {
                    const vocab = {
                        id: `vocab-${String(++entryCount).padStart(3, '0')}`,
                        kanji: pattern3[1].trim(),
                        hiragana: hiraganaMatch[1].trim(),
                        pronunciation: romajiFromHiragana(hiraganaMatch[1].trim()),
                        meaning: pattern3[2].trim(),
                        example: generateExampleSentence(pattern3[1], hiraganaMatch[1], pattern3[2])
                    };
                    vocabularyEntries.push(vocab);
                    i++; // Skip next line since we used it
                    continue;
                }
            }

            // Pattern 4: Just kanji with meaning
            const pattern4 = line.match(/^([一-龯]{1,3})\s+([a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s,]+)$/);
            if (pattern4) {
                const vocab = {
                    id: `vocab-${String(++entryCount).padStart(3, '0')}`,
                    kanji: pattern4[1].trim(),
                    hiragana: '',
                    pronunciation: '',
                    meaning: pattern4[2].trim(),
                    example: ''
                };
                vocabularyEntries.push(vocab);
                continue;
            }

            // Pattern 5: Just hiragana with meaning
            const pattern5 = line.match(/^([あ-ん]+)\s+([a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s,]+)$/);
            if (pattern5) {
                const vocab = {
                    id: `vocab-${String(++entryCount).padStart(3, '0')}`,
                    kanji: '',
                    hiragana: pattern5[1].trim(),
                    pronunciation: romajiFromHiragana(pattern5[1].trim()),
                    meaning: pattern5[2].trim(),
                    example: generateExampleSentence('', pattern5[1], pattern5[2])
                };
                vocabularyEntries.push(vocab);
                continue;
            }
        }

        console.log(`Extracted ${vocabularyEntries.length} vocabulary entries`);

        // Filter out entries with insufficient data
        const validEntries = vocabularyEntries.filter(entry =>
            (entry.kanji || entry.hiragana) &&
            entry.meaning &&
            entry.meaning.length > 1 &&
            !entry.meaning.includes('PART') &&
            !entry.meaning.includes('まとめ')
        );

        console.log(`Filtered to ${validEntries.length} valid entries`);

        // Group into lessons of 30
        const lessons = [];
        const wordsPerLesson = 30;

        for (let i = 0; i < validEntries.length; i += wordsPerLesson) {
            const lessonVocab = validEntries.slice(i, i + wordsPerLesson);
            const lessonNumber = Math.floor(i / wordsPerLesson) + 1;
            const startIndex = i + 1;
            const endIndex = Math.min(i + wordsPerLesson, validEntries.length);

            lessons.push({
                id: `lesson-${String(lessonNumber).padStart(3, '0')}`,
                title: `Lesson ${lessonNumber}: Vocabulary ${startIndex}-${endIndex}`,
                description: `JLPT N3 essential vocabulary covering words ${startIndex} to ${endIndex}`,
                vocabularyCount: lessonVocab.length,
                vocabulary: lessonVocab
            });
        }

        const outputData = {
            title: 'Tổng Hợp Từ Vựng N3 - Enhanced',
            description: 'Từ vựng JLPT N3 được xử lý và tổ chức tốt hơn với đầy đủ kanji, hiragana, nghĩa tiếng Việt, cách đọc và câu ví dụ',
            sourceFile: inputData.sourceFile,
            extractedAt: inputData.extractedAt,
            enhancedAt: new Date().toISOString(),
            format: {
                wordsPerLesson: 30,
                fields: ['kanji', 'hiragana', 'pronunciation', 'meaning', 'example']
            },
            lessons: lessons,
            totalLessons: lessons.length,
            totalVocabulary: validEntries.length,
            statistics: {
                rawLines: lines.length,
                extractedEntries: vocabularyEntries.length,
                validEntries: validEntries.length,
                completionRate: (validEntries.length / vocabularyEntries.length * 100).toFixed(2) + '%'
            }
        };

        fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');

        console.log('\n✅ Enhanced vocabulary processing complete!');
        console.log(`📊 Results:`);
        console.log(`   - Raw lines processed: ${lines.length}`);
        console.log(`   - Vocabulary extracted: ${vocabularyEntries.length}`);
        console.log(`   - Valid entries: ${validEntries.length}`);
        console.log(`   - Lessons created: ${lessons.length}`);
        console.log(`   - Completion rate: ${outputData.statistics.completionRate}`);
        console.log(`   - Output: ${outputPath}`);

        // Show preview
        if (lessons.length > 0) {
            const firstLesson = lessons[0];
            console.log(`\n📖 Preview of ${firstLesson.title}:`);
            firstLesson.vocabulary.slice(0, 5).forEach((vocab, i) => {
                console.log(`   ${i + 1}. ${vocab.kanji || vocab.hiragana}`);
                console.log(`      - Hiragana: ${vocab.hiragana || 'N/A'}`);
                console.log(`      - Pronunciation: ${vocab.pronunciation || 'N/A'}`);
                console.log(`      - Meaning: ${vocab.meaning}`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Helper functions
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
        `${word}は便利です。${reading ? `(${reading} wa benri desu.)` : ''} - ${meaning} rất tiện lợi.`,
        `毎日${word}を使います。${reading ? `(Mainichi ${reading} wo tsukai masu.)` : ''} - Hàng ngày sử dụng ${meaning}.`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
}

// Run the enhanced processing
enhancedVocabularyProcessing();