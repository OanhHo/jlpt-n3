const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

function processVocabularyText(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const lessons = [];
    let currentLesson = null;
    let vocabulary = [];
    let vocabularyCount = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Detect lesson headers - look for patterns like "Lesson", "Bài", numbers, etc.
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
        description: 'Từ vựng N3 được trích xuất từ PDF',
        sourceFile: 'tong-hop-tu-vung-n3.pdf',
        extractedAt: new Date().toISOString(),
        lessons: lessons,
        totalLessons: lessons.length,
        totalVocabulary: vocabularyCount,
        rawTextPreview: text.substring(0, 1000) + (text.length > 1000 ? '...' : '')
    };
}

function isLessonHeader(line) {
    const lowerLine = line.toLowerCase();
    return (
        lowerLine.includes('lesson') ||
        lowerLine.includes('bài') ||
        lowerLine.includes('第') ||
        /^\d+\./.test(line) ||
        /^第\d+課/.test(line) ||
        (line.length < 100 && (lowerLine.includes('vocabular') || lowerLine.includes('từ vựng')))
    );
}

function hasJapaneseCharacters(text) {
    // Check for Hiragana, Katakana, or Kanji
    return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
}

function parseVocabularyEntry(line, lines, index) {
    // Try to extract vocabulary information from the line
    const entry = {
        originalText: line,
        processed: false
    };

    // Look for patterns: kanji, hiragana, meaning
    const patterns = [
        // Pattern: 家族（かぞく）family
        /([一-龯]+)(?:\s*[（(]\s*([あ-ん]+)\s*[）)]\s*)(.+)/,
        // Pattern: 家族 かぞく family  
        /([一-龯]+)\s+([あ-ん]+)\s+(.+)/,
        // Pattern: かぞく family (hiragana first)
        /([あ-ん]+)\s+(.+)/
    ];

    for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
            if (match.length === 4) {
                // Kanji + Hiragana + Meaning
                entry.kanji = match[1].trim();
                entry.hiragana = match[2].trim();
                entry.meaning = match[3].trim();
                entry.processed = true;
            } else if (match.length === 3) {
                // Hiragana + Meaning
                entry.hiragana = match[1].trim();
                entry.meaning = match[2].trim();
                entry.processed = true;
            }
            break;
        }
    }

    // Look for pronunciation in parentheses
    const pronunciationMatch = line.match(/\[([a-zA-Z\s]+)\]/);
    if (pronunciationMatch) {
        entry.pronunciation = pronunciationMatch[1].trim();
    }

    // Look for example sentences in surrounding lines
    if (index + 1 < lines.length) {
        const nextLine = lines[index + 1];
        if (nextLine && hasJapaneseCharacters(nextLine) && nextLine.length > line.length) {
            entry.example = nextLine.trim();
        }
    }

    return entry;
}

async function extractPDFToJSON() {
    const pdfPath = path.join(__dirname, 'public', 'pdfs', 'tong-hop-tu-vung-n3.pdf');
    const jsonPath = path.join(__dirname, 'public', 'data', 'tu-vung-n3.json');

    try {
        console.log('Reading PDF file:', pdfPath);

        // Check if PDF exists
        if (!fs.existsSync(pdfPath)) {
            throw new Error(`PDF file not found: ${pdfPath}`);
        }

        // Create data directory if it doesn't exist
        const dataDir = path.dirname(jsonPath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Read and parse PDF
        const dataBuffer = fs.readFileSync(pdfPath);
        console.log('Extracting text from PDF...');

        const parser = new PDFParse();
        const data = await parser.parse(dataBuffer);
        console.log(`Extracted ${data.text.length} characters from ${data.numpages} pages`);

        // Process the text to structure vocabulary data
        console.log('Processing vocabulary data...');
        const processedData = processVocabularyText(data.text);

        // Save to JSON file
        fs.writeFileSync(jsonPath, JSON.stringify(processedData, null, 2), 'utf8');

        console.log('✅ Successfully saved to:', jsonPath);
        console.log(`📊 Found ${processedData.totalLessons} lessons with ${processedData.totalVocabulary} vocabulary entries`);

        // Print preview
        if (processedData.lessons.length > 0) {
            console.log('\n📖 Preview:');
            console.log(`First lesson: ${processedData.lessons[0].title}`);
            if (processedData.lessons[0].vocabulary.length > 0) {
                const firstVocab = processedData.lessons[0].vocabulary[0];
                console.log(`First vocabulary: ${firstVocab.originalText}`);
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
extractPDFToJSON();