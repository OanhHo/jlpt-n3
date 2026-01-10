const fs = require('fs');
const path = require('path');

// Import pdfjs-dist directly
const pdfjsLib = require('react-pdf/node_modules/pdfjs-dist/legacy/build/pdf.js');

async function extractPDFText(pdfPath) {
    try {
        console.log('Reading PDF file:', pdfPath);

        // Read PDF file
        const dataBuffer = fs.readFileSync(pdfPath);

        // Load PDF document
        const pdf = await pdfjsLib.getDocument({
            data: new Uint8Array(dataBuffer),
            verbosity: 0
        }).promise;

        console.log(`PDF loaded successfully. Pages: ${pdf.numPages}`);

        let fullText = '';

        // Extract text from each page
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();

            // Combine text items
            const pageText = textContent.items
                .map(item => item.str)
                .join(' ');

            fullText += pageText + '\n';
            console.log(`Extracted page ${pageNum}/${pdf.numPages}`);
        }

        return fullText;

    } catch (error) {
        console.error('Error extracting PDF:', error);
        throw error;
    }
}

function processVocabularyText(text) {
    const lines = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    const lessons = [];
    let currentLesson = null;
    let vocabulary = [];
    let vocabularyCount = 0;

    console.log(`Processing ${lines.length} lines of text...`);

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Detect lesson headers
        if (isLessonHeader(line)) {
            // Save previous lesson
            if (currentLesson && vocabulary.length > 0) {
                currentLesson.vocabulary = vocabulary;
                currentLesson.vocabularyCount = vocabulary.length;
                lessons.push(currentLesson);
                vocabulary = [];
            }

            currentLesson = {
                title: line,
                vocabulary: [],
                vocabularyCount: 0
            };
            console.log(`Found lesson: ${line}`);
        }
        // Process vocabulary entries
        else if (line && currentLesson && hasJapaneseCharacters(line)) {
            const vocabEntry = parseVocabularyEntry(line, lines, i);
            if (vocabEntry) {
                vocabEntry.id = `vocab-${String(++vocabularyCount).padStart(3, '0')}`;
                vocabulary.push(vocabEntry);
            }
        }
    }

    // Add the last lesson
    if (currentLesson && vocabulary.length > 0) {
        currentLesson.vocabulary = vocabulary;
        currentLesson.vocabularyCount = vocabulary.length;
        lessons.push(currentLesson);
    }

    return {
        title: 'Tổng Hợp Từ Vựng N3',
        description: 'Từ vựng N3 được trích xuất từ PDF bằng PDF.js',
        sourceFile: 'tong-hop-tu-vung-n3.pdf',
        extractedAt: new Date().toISOString(),
        lessons: lessons,
        totalLessons: lessons.length,
        totalVocabulary: vocabularyCount,
        textStats: {
            totalLines: lines.length,
            totalCharacters: text.length,
            japaneseLines: lines.filter(line => hasJapaneseCharacters(line)).length
        },
        rawTextPreview: text.substring(0, 1500) + (text.length > 1500 ? '...' : '')
    };
}

function isLessonHeader(line) {
    const lowerLine = line.toLowerCase();
    const patterns = [
        /lesson\s*\d+/i,
        /bài\s*\d+/i,
        /第\d+課/,
        /^\d+\./,
        /unit\s*\d+/i,
        /chapter\s*\d+/i
    ];

    return patterns.some(pattern => pattern.test(line)) ||
        (line.length < 80 && (
            lowerLine.includes('vocabular') ||
            lowerLine.includes('từ vựng') ||
            lowerLine.includes('grammar') ||
            lowerLine.includes('ngữ pháp')
        ));
}

function hasJapaneseCharacters(text) {
    // Check for Hiragana, Katakana, or Kanji
    return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
}

function parseVocabularyEntry(line, lines, index) {
    const entry = {
        originalText: line,
        processed: false
    };

    // Pattern matching for different vocabulary formats
    const patterns = [
        // Pattern: 家族（かぞく）family, gia đình
        /([一-龯]+)\s*[（(]\s*([あ-ん]+)\s*[）)]\s*(.+)/,
        // Pattern: 家族 かぞく family, gia đình
        /([一-龯]+)\s+([あ-ん]+)\s+(.+)/,
        // Pattern: かぞく family (hiragana first)
        /^([あ-ん]+)\s+(.+)/,
        // Pattern with numbers: 1. 家族（かぞく）family
        /^\d+\.\s*([一-龯]+)\s*[（(]\s*([あ-ん]+)\s*[）)]\s*(.+)/
    ];

    for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
            if (match.length === 4) {
                entry.kanji = match[1].trim();
                entry.hiragana = match[2].trim();
                entry.meaning = match[3].trim();
                entry.processed = true;
            } else if (match.length === 3) {
                entry.hiragana = match[1].trim();
                entry.meaning = match[2].trim();
                entry.processed = true;
            } else if (match.length === 5) {
                // Pattern with number prefix
                entry.kanji = match[2].trim();
                entry.hiragana = match[3].trim();
                entry.meaning = match[4].trim();
                entry.processed = true;
            }
            break;
        }
    }

    // Look for pronunciation in brackets
    const pronunciationMatch = line.match(/\[([a-zA-Z\s]+)\]/);
    if (pronunciationMatch) {
        entry.pronunciation = pronunciationMatch[1].trim();
    }

    // Check next few lines for example sentences
    for (let j = 1; j <= 3 && index + j < lines.length; j++) {
        const nextLine = lines[index + j];
        if (nextLine && hasJapaneseCharacters(nextLine) &&
            nextLine.length > line.length &&
            nextLine.includes('。')) {
            entry.example = nextLine.trim();
            break;
        }
    }

    return entry.processed || hasJapaneseCharacters(entry.originalText) ? entry : null;
}

async function main() {
    const pdfPath = path.join(__dirname, 'public', 'pdfs', 'tong-hop-tu-vung-n3.pdf');
    const jsonPath = path.join(__dirname, 'public', 'data', 'tu-vung-n3.json');

    try {
        // Check if PDF exists
        if (!fs.existsSync(pdfPath)) {
            throw new Error(`PDF file not found: ${pdfPath}`);
        }

        // Create data directory if it doesn't exist
        const dataDir = path.dirname(jsonPath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
            console.log('Created data directory:', dataDir);
        }

        // Extract text from PDF
        const text = await extractPDFText(pdfPath);
        console.log(`✅ Extracted ${text.length} characters from PDF`);

        // Process the text
        console.log('Processing vocabulary data...');
        const processedData = processVocabularyText(text);

        // Save to JSON file
        fs.writeFileSync(jsonPath, JSON.stringify(processedData, null, 2), 'utf8');

        console.log('✅ Successfully saved to:', jsonPath);
        console.log(`📊 Summary:`);
        console.log(`   - Lessons found: ${processedData.totalLessons}`);
        console.log(`   - Vocabulary entries: ${processedData.totalVocabulary}`);
        console.log(`   - Total lines processed: ${processedData.textStats.totalLines}`);
        console.log(`   - Japanese lines: ${processedData.textStats.japaneseLines}`);

        // Print preview
        if (processedData.lessons.length > 0) {
            console.log('\n📖 Preview:');
            const firstLesson = processedData.lessons[0];
            console.log(`First lesson: "${firstLesson.title}"`);
            console.log(`Vocabulary count: ${firstLesson.vocabularyCount}`);

            if (firstLesson.vocabulary.length > 0) {
                const firstVocab = firstLesson.vocabulary[0];
                console.log(`First vocabulary entry:`);
                console.log(`  - Original: ${firstVocab.originalText}`);
                if (firstVocab.processed) {
                    console.log(`  - Kanji: ${firstVocab.kanji || 'N/A'}`);
                    console.log(`  - Hiragana: ${firstVocab.hiragana || 'N/A'}`);
                    console.log(`  - Meaning: ${firstVocab.meaning || 'N/A'}`);
                }
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run the extraction
main();