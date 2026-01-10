const fs = require('fs');
const path = require('path');

function processSmartVocabulary() {
    const inputPath = path.join(__dirname, 'public', 'data', 'tu-vung-n3-improved.json');
    const outputPath = path.join(__dirname, 'public', 'data', 'tu-vung-n3-smart.json');

    try {
        console.log('Loading vocabulary file...');
        const fileContent = fs.readFileSync(inputPath, 'utf8');
        const inputData = JSON.parse(fileContent);

        console.log(`Processing ${inputData.lessons.length} lessons...`);

        let allCombinedVocab = [];
        let combinedCount = 0;

        for (let lessonIndex = 0; lessonIndex < inputData.lessons.length; lessonIndex++) {
            const lesson = inputData.lessons[lessonIndex];
            console.log(`\nProcessing lesson ${lessonIndex + 1}: "${lesson.title}"`);
            console.log(`Raw entries: ${lesson.vocabulary.length}`);

            // Skip header lessons
            if (lesson.title.includes('PART') || lesson.title.includes('まとめ') || lesson.vocabulary.length < 10) {
                console.log(`Skipping header lesson`);
                continue;
            }

            const combinedVocab = combineAdjacentEntries(lesson.vocabulary);
            console.log(`Combined entries: ${combinedVocab.length}`);

            allCombinedVocab = allCombinedVocab.concat(combinedVocab);
            combinedCount += combinedVocab.length;

            // Show preview
            if (combinedVocab.length > 0) {
                console.log(`Preview of combined entries:`);
                const preview = combinedVocab.slice(0, 3);
                preview.forEach((vocab, i) => {
                    console.log(`  ${i + 1}. ${vocab.combinedText} → K:${vocab.kanji || 'N/A'} H:${vocab.hiragana || 'N/A'} M:${vocab.meaning || 'N/A'}`);
                });
            }
        }

        console.log(`\n🔄 Total combined entries: ${allCombinedVocab.length}`);

        // Filter valid vocabulary with looser criteria
        console.log('Filtering valid vocabulary...');
        const validVocab = allCombinedVocab.filter(vocab => {
            // Must have at least one Japanese character
            const hasJapanese = vocab.kanji || vocab.hiragana;

            // Must have some meaningful content
            const hasMeaning = vocab.meaning && vocab.meaning.length > 0 &&
                !vocab.meaning.includes('□') &&
                !vocab.meaning.includes('PART') &&
                vocab.meaning !== 'Ý' && // Skip single letter meanings
                vocab.meaning !== 'ý';

            // Combined text should be reasonable
            const reasonableLength = vocab.combinedText.length >= 2 && vocab.combinedText.length <= 50;

            return hasJapanese && hasMeaning && reasonableLength;
        });

        console.log(`Valid vocabulary: ${validVocab.length}`);
        console.log(`Improvement rate: ${((validVocab.length / allCombinedVocab.length) * 100).toFixed(1)}%`);

        // Sort by completeness (entries with both kanji and meaning first)
        validVocab.sort((a, b) => {
            const scoreA = getCompletenessScore(a);
            const scoreB = getCompletenessScore(b);
            return scoreB - scoreA;
        });

        // Add pronunciation and examples
        console.log('Enhancing vocabulary entries...');
        const enhancedVocab = validVocab.map((vocab, index) => {
            const enhanced = {
                id: `vocab-${String(index + 1).padStart(4, '0')}`,
                kanji: vocab.kanji || '',
                hiragana: vocab.hiragana || '',
                pronunciation: vocab.pronunciation || (vocab.hiragana ? romajiFromHiragana(vocab.hiragana) : ''),
                meaning: cleanMeaning(vocab.meaning || ''),
                example: '',
                combinedText: vocab.combinedText,
                completenessScore: getCompletenessScore(vocab)
            };

            // Generate example sentence
            enhanced.example = generateExampleSentence(enhanced.kanji, enhanced.hiragana, enhanced.meaning);

            return enhanced;
        });

        // Group into lessons
        console.log('Creating lessons...');
        const lessons = [];
        const wordsPerLesson = 30;

        for (let i = 0; i < enhancedVocab.length; i += wordsPerLesson) {
            const lessonVocab = enhancedVocab.slice(i, i + wordsPerLesson);
            const lessonNumber = Math.floor(i / wordsPerLesson) + 1;

            lessons.push({
                id: `lesson-${String(lessonNumber).padStart(3, '0')}`,
                title: `Bài ${lessonNumber}: Từ vựng N3 (${i + 1}-${Math.min(i + wordsPerLesson, enhancedVocab.length)})`,
                description: `Từ vựng JLPT N3 được tối ưu hóa với ${lessonVocab.length} từ`,
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

        // Create output
        const outputData = {
            title: 'Từ Vựng N3 - Smart Combined',
            description: 'Từ vựng JLPT N3 được kết hợp thông minh từ dữ liệu PDF gốc',
            sourceFile: inputData.sourceFile,
            extractedAt: inputData.extractedAt,
            processedAt: new Date().toISOString(),
            method: 'Smart adjacent line combination',
            lessons: lessons,
            totalLessons: lessons.length,
            totalVocabulary: enhancedVocab.length,
            statistics: {
                originalEntries: combinedCount,
                combinedEntries: allCombinedVocab.length,
                validEntries: enhancedVocab.length,
                improvementRate: ((validVocab.length / allCombinedVocab.length) * 100).toFixed(1) + '%',
                entriesWithKanji: enhancedVocab.filter(v => v.kanji).length,
                entriesWithHiragana: enhancedVocab.filter(v => v.hiragana).length,
                entriesWithMeaning: enhancedVocab.filter(v => v.meaning).length,
                averageCompleteness: (enhancedVocab.reduce((sum, v) => sum + v.completenessScore, 0) / enhancedVocab.length).toFixed(2)
            }
        };

        fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');

        console.log('\n✅ Smart processing completed!');
        console.log(`📊 Results:`);
        console.log(`   - Original entries: ${outputData.statistics.originalEntries}`);
        console.log(`   - Combined entries: ${outputData.statistics.combinedEntries}`);
        console.log(`   - Valid entries: ${outputData.statistics.validEntries}`);
        console.log(`   - Improvement rate: ${outputData.statistics.improvementRate}`);
        console.log(`   - Lessons created: ${outputData.totalLessons}`);
        console.log(`   - Entries with kanji: ${outputData.statistics.entriesWithKanji}`);
        console.log(`   - Entries with hiragana: ${outputData.statistics.entriesWithHiragana}`);
        console.log(`   - Average completeness: ${outputData.statistics.averageCompleteness}/3`);

        // Show best entries
        console.log(`\n📚 Top quality entries:`);
        const topEntries = enhancedVocab.slice(0, 10);
        topEntries.forEach((vocab, i) => {
            console.log(`   ${i + 1}. ${vocab.kanji || vocab.hiragana} - ${vocab.meaning}`);
            console.log(`      Combined from: "${vocab.combinedText}"`);
            console.log(`      Pronunciation: ${vocab.pronunciation}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    }
}

function combineAdjacentEntries(vocabularyEntries) {
    const combined = [];
    let i = 0;

    while (i < vocabularyEntries.length) {
        const current = vocabularyEntries[i];

        // Look ahead to combine related entries
        const lookAhead = [];
        lookAhead.push(current);

        // Check next 5 entries for potential combinations
        for (let j = 1; j <= 5 && (i + j) < vocabularyEntries.length; j++) {
            const next = vocabularyEntries[i + j];

            // Stop if we hit a clear boundary
            if (isVocabularyBoundary(next.originalText)) {
                break;
            }

            lookAhead.push(next);
        }

        // Try to form a complete vocabulary entry
        const vocabularyEntry = formVocabularyFromGroup(lookAhead);
        if (vocabularyEntry) {
            combined.push(vocabularyEntry);
            i += lookAhead.length;
        } else {
            i++;
        }
    }

    return combined;
}

function isVocabularyBoundary(text) {
    // Indicators that this starts a new vocabulary entry
    return text.includes('□') ||
        text.includes('意') ||
        text.includes('PART') ||
        /^[0-9]+$/.test(text.trim()) ||
        text.includes('まとめ');
}

function formVocabularyFromGroup(entries) {
    if (entries.length === 0) return null;

    let combinedText = entries.map(e => e.originalText).join(' ').trim();

    // Remove common prefixes
    combinedText = combinedText.replace(/^□\s*/, '').replace(/^意\s*/, '').trim();

    if (combinedText.length === 0) return null;

    const vocab = {
        combinedText: combinedText,
        kanji: '',
        hiragana: '',
        meaning: '',
        pronunciation: ''
    };

    // Extract kanji, hiragana, and meaning from combined text
    parseVocabularyFromText(combinedText, vocab);

    // Use preprocessed data if available
    for (const entry of entries) {
        if (entry.kanji && !vocab.kanji) vocab.kanji = entry.kanji;
        if (entry.hiragana && !vocab.hiragana) vocab.hiragana = entry.hiragana;
        if (entry.meaning && !vocab.meaning) vocab.meaning = entry.meaning;
        if (entry.pronunciation && !vocab.pronunciation) vocab.pronunciation = entry.pronunciation;
    }

    return vocab;
}

function parseVocabularyFromText(text, vocab) {
    // Remove common symbols
    const cleanText = text.replace(/□/g, '').replace(/^\s*意\s*/g, '').trim();

    // Pattern 1: kanji hiragana meaning
    const pattern1 = cleanText.match(/([一-龯]+)\s+([あ-ん]+)\s+(.+)/);
    if (pattern1) {
        vocab.kanji = pattern1[1].trim();
        vocab.hiragana = pattern1[2].trim();
        vocab.meaning = pattern1[3].trim();
        return;
    }

    // Pattern 2: kanji (hiragana) meaning  
    const pattern2 = cleanText.match(/([一-龯]+)\s*[（(]\s*([あ-ん]+)\s*[）)]\s*(.+)/);
    if (pattern2) {
        vocab.kanji = pattern2[1].trim();
        vocab.hiragana = pattern2[2].trim();
        vocab.meaning = pattern2[3].trim();
        return;
    }

    // Pattern 3: kanji meaning (detect Vietnamese)
    const pattern3 = cleanText.match(/^([一-龯]+)\s+([a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s,\-\.]+)$/);
    if (pattern3) {
        vocab.kanji = pattern3[1].trim();
        vocab.meaning = pattern3[2].trim();
        return;
    }

    // Pattern 4: hiragana meaning
    const pattern4 = cleanText.match(/^([あ-ん]+)\s+([a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s,\-\.]+)$/);
    if (pattern4) {
        vocab.hiragana = pattern4[1].trim();
        vocab.meaning = pattern4[2].trim();
        return;
    }

    // Pattern 5: Extract individual components
    const kanjiMatch = cleanText.match(/[一-龯]+/);
    const hiraganaMatch = cleanText.match(/[あ-ん]+/);
    const vietnameseMatch = cleanText.match(/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ][a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]*/);

    if (kanjiMatch) vocab.kanji = kanjiMatch[0].trim();
    if (hiraganaMatch) vocab.hiragana = hiraganaMatch[0].trim();
    if (vietnameseMatch) vocab.meaning = vietnameseMatch[0].trim();
}

function getCompletenessScore(vocab) {
    let score = 0;
    if (vocab.kanji) score++;
    if (vocab.hiragana) score++;
    if (vocab.meaning && vocab.meaning.length > 1) score++;
    return score;
}

function cleanMeaning(meaning) {
    return meaning.replace(/^\s*Ý\s*/g, '').replace(/^\s*ý\s*/g, '').trim();
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

processSmartVocabulary();