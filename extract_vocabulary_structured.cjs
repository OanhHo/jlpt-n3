const fs = require('fs');
const path = require('path');

// Import pdfjs-dist directly
const pdfjsLib = require('react-pdf/node_modules/pdfjs-dist/legacy/build/pdf.js');

async function extractVocabularyStructured() {
    const pdfPath = path.join(__dirname, 'public', 'pdfs', 'tong-hop-tu-vung-n3.pdf');
    const outputPath = path.join(__dirname, 'public', 'data', 'tu-vung-n3-structured.json');

    try {
        console.log('📖 Loading PDF file...');
        const data = new Uint8Array(fs.readFileSync(pdfPath));
        const doc = await pdfjsLib.getDocument({
            data: data,
            useSystemFonts: true
        }).promise;

        console.log(`Found ${doc.numPages} pages`);

        let allVocabularyEntries = [];

        // Process each page
        for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
            console.log(`Processing page ${pageNum}/${doc.numPages}...`);

            const page = await doc.getPage(pageNum);
            const textContent = await page.getTextContent();

            // Group text items by position to reconstruct vocabulary entries
            const vocabularyEntries = reconstructVocabularyEntries(textContent.items, pageNum);
            allVocabularyEntries = allVocabularyEntries.concat(vocabularyEntries);

            console.log(`  → Found ${vocabularyEntries.length} vocabulary entries`);
        }

        console.log(`\n✅ Total vocabulary entries extracted: ${allVocabularyEntries.length}`);

        // Process and clean vocabulary entries
        const processedVocabulary = processVocabularyEntries(allVocabularyEntries);

        // Group into lessons
        const lessons = groupIntoLessons(processedVocabulary);

        // Create output data structure
        const outputData = {
            title: 'Từ Vựng N3 - Structured Extraction',
            description: 'Từ vựng JLPT N3 được trích xuất theo cấu trúc chính xác từ PDF',
            sourceFile: 'tong-hop-tu-vung-n3.pdf',
            extractedAt: new Date().toISOString(),
            method: 'Structured vocabulary entry reconstruction',
            lessons: lessons,
            totalLessons: lessons.length,
            totalVocabulary: processedVocabulary.length,
            statistics: {
                extractedEntries: allVocabularyEntries.length,
                validEntries: processedVocabulary.length,
                successRate: ((processedVocabulary.length / allVocabularyEntries.length) * 100).toFixed(2) + '%',
                entriesWithKanji: processedVocabulary.filter(v => v.kanji).length,
                entriesWithHiragana: processedVocabulary.filter(v => v.hiragana).length,
                entriesWithMeaning: processedVocabulary.filter(v => v.meaning).length
            }
        };

        fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');

        console.log('\n🎉 Structured vocabulary extraction completed!');
        console.log(`📊 Results:`);
        console.log(`   - Extracted entries: ${outputData.statistics.extractedEntries}`);
        console.log(`   - Valid entries: ${outputData.statistics.validEntries}`);
        console.log(`   - Success rate: ${outputData.statistics.successRate}`);
        console.log(`   - Lessons created: ${outputData.totalLessons}`);
        console.log(`   - Output file: ${outputPath}`);

        // Show preview
        console.log(`\n📚 Preview of structured entries:`);
        const preview = processedVocabulary.slice(0, 10);
        preview.forEach((vocab, i) => {
            console.log(`   ${i + 1}. ${vocab.kanji} (${vocab.hiragana}) → ${vocab.meaning}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    }
}

function reconstructVocabularyEntries(textItems, pageNum) {
    const vocabularyEntries = [];

    // Sort text items by Y position (top to bottom), then X position (left to right)
    const sortedItems = textItems.sort((a, b) => {
        const yDiff = Math.abs(a.transform[5] - b.transform[5]);
        if (yDiff < 2) { // Same line
            return a.transform[4] - b.transform[4]; // Sort by X position
        }
        return b.transform[5] - a.transform[5]; // Sort by Y position (top to bottom)
    });

    // Group text items into vocabulary entries
    let currentEntry = [];
    let currentY = null;
    let entryId = 1;

    for (let i = 0; i < sortedItems.length; i++) {
        const item = sortedItems[i];
        const text = item.str.trim();
        const x = item.transform[4];
        const y = item.transform[5];

        // Skip empty text
        if (!text) continue;

        // Skip page headers, footers, and navigation elements
        if (isHeaderFooterOrNavigation(text)) continue;

        // Check if this starts a new vocabulary entry
        if (isNewVocabularyEntry(text, currentEntry)) {
            // Process the current entry if it has content
            if (currentEntry.length > 0) {
                const entry = processVocabularyEntry(currentEntry, pageNum, entryId++);
                if (entry) vocabularyEntries.push(entry);
            }

            // Start new entry
            currentEntry = [{ text, x, y }];
            currentY = y;
        } else if (isPartOfCurrentEntry(text, x, y, currentY)) {
            // Add to current entry
            currentEntry.push({ text, x, y });
        } else {
            // Process current entry and start new one
            if (currentEntry.length > 0) {
                const entry = processVocabularyEntry(currentEntry, pageNum, entryId++);
                if (entry) vocabularyEntries.push(entry);
            }

            currentEntry = [{ text, x, y }];
            currentY = y;
        }
    }

    // Process the last entry
    if (currentEntry.length > 0) {
        const entry = processVocabularyEntry(currentEntry, pageNum, entryId++);
        if (entry) vocabularyEntries.push(entry);
    }

    return vocabularyEntries;
}

function isHeaderFooterOrNavigation(text) {
    const skipPatterns = [
        /^PART\s*[0-9①②③④⑤⑥⑦⑧⑨⑩]/,
        /^まとめ/,
        /^文法/,
        /^[0-9]+$/,
        /^□+$/,
        /^ページ/,
        /^Page/
    ];

    return skipPatterns.some(pattern => pattern.test(text));
}

function isNewVocabularyEntry(text, currentEntry) {
    // A new vocabulary entry typically starts with:
    // 1. Kanji characters followed by hiragana
    // 2. A word in a box (□)
    // 3. A clear vocabulary pattern

    // If no current entry, this starts a new one
    if (currentEntry.length === 0) return true;

    // Check if this looks like the start of a new vocabulary entry
    const isKanji = /^[一-龯]+$/.test(text);
    const isNumberOrBullet = /^[0-9]+\.?$|^[①②③④⑤⑥⑦⑧⑨⑩]/.test(text);

    return isKanji || isNumberOrBullet;
}

function isPartOfCurrentEntry(text, x, y, currentY) {
    // Text is part of current entry if:
    // 1. It's on the same line (similar Y coordinate)
    // 2. It's related vocabulary content (hiragana, vietnamese, etc.)

    const yTolerance = 5;
    const isOnSameLine = Math.abs(y - currentY) < yTolerance;

    // Check if this is vocabulary-related content
    const isHiragana = /[あ-ん]/.test(text);
    const isVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/.test(text);
    const isEnglish = /^[a-zA-Z\s]+$/.test(text);
    const isNumber = /^[0-9]+$/.test(text);

    return isOnSameLine && (isHiragana || isVietnamese || isEnglish) && !isNumber;
}

function processVocabularyEntry(entryItems, pageNum, entryId) {
    if (entryItems.length === 0) return null;

    // Combine all text from the entry
    const fullText = entryItems.map(item => item.text).join(' ').trim();

    // Skip if too short or contains unwanted content
    if (fullText.length < 2 ||
        fullText.includes('□') ||
        fullText.includes('PART') ||
        /^[0-9]+$/.test(fullText)) {
        return null;
    }

    const entry = {
        id: `vocab-${String(entryId).padStart(4, '0')}`,
        originalText: fullText,
        pageNumber: pageNum,
        kanji: '',
        hiragana: '',
        pronunciation: '',
        meaning: '',
        example: ''
    };

    // Parse the vocabulary entry
    parseVocabularyContent(fullText, entry);

    return entry;
}

function parseVocabularyContent(text, entry) {
    // Pattern 1: 注意 ちゅう chú ý
    const pattern1 = text.match(/([一-龯]+)\s+([あ-ん]+)\s+([a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+)/);
    if (pattern1) {
        entry.kanji = pattern1[1].trim();
        entry.hiragana = pattern1[2].trim();
        entry.meaning = pattern1[3].trim();
        entry.pronunciation = romajiFromHiragana(entry.hiragana);
        return;
    }

    // Pattern 2: 意味 ý nghĩa (no hiragana)
    const pattern2 = text.match(/^([一-龯]+)\s+([a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+)$/);
    if (pattern2) {
        entry.kanji = pattern2[1].trim();
        entry.meaning = pattern2[2].trim();
        return;
    }

    // Pattern 3: ちゅう chú ý (hiragana + meaning)
    const pattern3 = text.match(/^([あ-ん]+)\s+([a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]+)$/);
    if (pattern3) {
        entry.hiragana = pattern3[1].trim();
        entry.meaning = pattern3[2].trim();
        entry.pronunciation = romajiFromHiragana(entry.hiragana);
        return;
    }

    // Extract individual components if patterns don't match
    const kanjiMatch = text.match(/[一-龯]+/);
    const hiraganaMatch = text.match(/[あ-ん]+/);
    const vietnameseMatch = text.match(/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ][a-zA-Zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]*/);

    if (kanjiMatch) entry.kanji = kanjiMatch[0];
    if (hiraganaMatch) entry.hiragana = hiraganaMatch[0];
    if (vietnameseMatch) entry.meaning = vietnameseMatch[0].trim();
    if (entry.hiragana && !entry.pronunciation) {
        entry.pronunciation = romajiFromHiragana(entry.hiragana);
    }
}

function processVocabularyEntries(entries) {
    return entries.filter(entry => {
        // Must have either kanji or hiragana
        const hasJapanese = entry.kanji || entry.hiragana;

        // Must have meaningful Vietnamese meaning
        const hasMeaning = entry.meaning &&
            entry.meaning.length > 1 &&
            /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđa-zA-Z]/.test(entry.meaning);

        return hasJapanese && hasMeaning;
    }).map((entry, index) => {
        // Generate example sentence
        entry.example = generateExampleSentence(entry.kanji, entry.hiragana, entry.meaning);

        // Update ID
        entry.id = `vocab-${String(index + 1).padStart(4, '0')}`;

        return entry;
    });
}

function groupIntoLessons(vocabulary) {
    const lessons = [];
    const wordsPerLesson = 30;

    for (let i = 0; i < vocabulary.length; i += wordsPerLesson) {
        const lessonVocab = vocabulary.slice(i, i + wordsPerLesson);
        const lessonNumber = Math.floor(i / wordsPerLesson) + 1;

        lessons.push({
            id: `lesson-${String(lessonNumber).padStart(3, '0')}`,
            title: `Bài ${lessonNumber}: Từ vựng N3`,
            description: `Học ${lessonVocab.length} từ vựng JLPT N3 quan trọng`,
            vocabularyCount: lessonVocab.length,
            vocabulary: lessonVocab
        });
    }

    return lessons;
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

extractVocabularyStructured();