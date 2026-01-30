const fs = require('fs');
const path = require('path');

// Import pdfjs-dist directly
const pdfjsLib = require('react-pdf/node_modules/pdfjs-dist/legacy/build/pdf.js');

async function extractPDFTextImproved(pdfPath) {
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
        let pageTexts = [];

        // Extract text from each page with more detailed handling
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();

            // More sophisticated text extraction
            let pageText = '';
            let lastY = null;
            let lineText = '';

            for (const item of textContent.items) {
                const currentY = item.transform[5];

                // If Y coordinate changed significantly, it's a new line
                if (lastY !== null && Math.abs(currentY - lastY) > 5) {
                    if (lineText.trim()) {
                        pageText += lineText.trim() + '\n';
                    }
                    lineText = '';
                }

                // Add space between items if they're far apart horizontally
                if (lineText && item.str) {
                    const spaceNeeded = item.transform[4] - (lineText.length * 6); // rough calculation
                    if (spaceNeeded > 10) {
                        lineText += ' ';
                    }
                }

                lineText += item.str;
                lastY = currentY;
            }

            // Add the last line
            if (lineText.trim()) {
                pageText += lineText.trim() + '\n';
            }

            pageTexts.push({
                pageNum: pageNum,
                text: pageText,
                lines: pageText.split('\n').filter(line => line.trim().length > 0).length
            });

            fullText += pageText + '\n';
            console.log(`Extracted page ${pageNum}/${pdf.numPages} - ${pageTexts[pageNum - 1].lines} lines`);
        }

        return {
            fullText,
            pageTexts,
            totalPages: pdf.numPages
        };

    } catch (error) {
        console.error('Error extracting PDF:', error);
        throw error;
    }
}

function processVocabularyTextImproved(extractedData) {
    const { fullText, pageTexts } = extractedData;

    const allLines = fullText.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    console.log(`Total lines extracted: ${allLines.length}`);

    // Show sample of lines for debugging
    console.log('\nSample lines:');
    for (let i = 0; i < Math.min(20, allLines.length); i++) {
        console.log(`${i + 1}: ${allLines[i]}`);
    }

    const lessons = [];
    let currentLesson = null;
    let vocabulary = [];
    let vocabularyCount = 0;

    for (let i = 0; i < allLines.length; i++) {
        const line = allLines[i];

        // Enhanced lesson header detection
        if (isLessonHeaderImproved(line)) {
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
        // Process vocabulary entries with improved detection
        else if (line && hasJapaneseCharacters(line)) {
            const vocabEntry = parseVocabularyEntryImproved(line, allLines, i);
            if (vocabEntry) {
                vocabEntry.id = `vocab-${String(++vocabularyCount).padStart(3, '0')}`;
                vocabulary.push(vocabEntry);

                // Create a default lesson if none exists
                if (!currentLesson) {
                    currentLesson = {
                        title: 'General Vocabulary',
                        vocabulary: [],
                        vocabularyCount: 0
                    };
                }
            }
        }
    }

    // Add the last lesson
    if (currentLesson && vocabulary.length > 0) {
        currentLesson.vocabulary = vocabulary;
        currentLesson.vocabularyCount = vocabulary.length;
        lessons.push(currentLesson);
    }

    // If no lessons found, create sections based on content patterns
    if (lessons.length === 0 && vocabularyCount > 0) {
        console.log('No clear lessons found, organizing by content type...');
        lessons.push({
            title: 'Extracted Vocabulary',
            vocabulary: vocabulary,
            vocabularyCount: vocabulary.length
        });
    }

    return {
        title: 'Tổng Hợp Từ Vựng N3',
        description: 'Từ vựng N3 được trích xuất từ PDF với thuật toán cải tiến',
        sourceFile: 'tong-hop-tu-vung-n3.pdf',
        extractedAt: new Date().toISOString(),
        lessons: lessons,
        totalLessons: lessons.length,
        totalVocabulary: vocabularyCount,
        textStats: {
            totalLines: allLines.length,
            totalCharacters: fullText.length,
            japaneseLines: allLines.filter(line => hasJapaneseCharacters(line)).length,
            pageBreakdown: pageTexts.map(p => ({
                page: p.pageNum,
                lines: p.lines
            }))
        },
        sampleLines: allLines.slice(0, 50), // Show first 50 lines for debugging
        rawTextPreview: fullText.substring(0, 3000) + (fullText.length > 3000 ? '...' : '')
    };
}

function isLessonHeaderImproved(line) {
    const lowerLine = line.toLowerCase();
    const patterns = [
        /part\s*\d+/i,
        /lesson\s*\d+/i,
        /bài\s*\d+/i,
        /第\d+課/,
        /^\d+\./,
        /unit\s*\d+/i,
        /chapter\s*\d+/i,
        /まとめ/,
        /grammar/i,
        /vocabulary/i,
        /ngữ\s*pháp/i,
        /từ\s*vựng/i
    ];

    return patterns.some(pattern => pattern.test(line)) ||
        (line.length < 100 && line.length > 3 && (
            lowerLine.includes('part') ||
            lowerLine.includes('lesson') ||
            lowerLine.includes('まとめ') ||
            lowerLine.includes('漢字') ||
            lowerLine.includes('語彙') ||
            lowerLine.includes('文法')
        ));
}

function hasJapaneseCharacters(text) {
    // Check for Hiragana, Katakana, or Kanji
    return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
}

function parseVocabularyEntryImproved(line, lines, index) {
    const entry = {
        originalText: line,
        processed: false,
        lineNumber: index + 1
    };

    // Enhanced pattern matching for different vocabulary formats
    const patterns = [
        // Pattern: 家族（かぞく）family, gia đình
        /([一-龯]+)\s*[（(]\s*([あ-ん]+)\s*[）)]\s*(.+)/,
        // Pattern: 家族 かぞく family, gia đình  
        /([一-龯]+)\s+([あ-ん]+)\s+(.+)/,
        // Pattern: かぞく family (hiragana first)
        /^([あ-ん]+)\s+(.+)/,
        // Pattern with numbers: 1. 家族（かぞく）family
        /^\d+\.\s*([一-龯]+)\s*[（(]\s*([あ-ん]+)\s*[）)]\s*(.+)/,
        // Pattern: 家族  かぞく  family (with multiple spaces)
        /([一-龯]+)\s+([あ-ん]+)\s+(.+)/,
        // Simple kanji + meaning
        /([一-龯]+)\s+(.+)/
    ];

    for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
            if (match.length >= 4) {
                entry.kanji = match[1].trim();
                entry.hiragana = match[2].trim();
                entry.meaning = match[3].trim();
                entry.processed = true;
            } else if (match.length === 3) {
                if (/[一-龯]/.test(match[1])) {
                    entry.kanji = match[1].trim();
                    entry.meaning = match[2].trim();
                } else {
                    entry.hiragana = match[1].trim();
                    entry.meaning = match[2].trim();
                }
                entry.processed = true;
            }
            break;
        }
    }

    // Look for pronunciation in brackets or romanji
    const pronunciationMatch = line.match(/\[([a-zA-Z\s]+)\]/);
    if (pronunciationMatch) {
        entry.pronunciation = pronunciationMatch[1].trim();
    }

    // Look for example sentences in surrounding lines
    for (let j = 1; j <= 2 && index + j < lines.length; j++) {
        const nextLine = lines[index + j];
        if (nextLine && hasJapaneseCharacters(nextLine) &&
            nextLine.length > line.length &&
            (nextLine.includes('。') || nextLine.includes('です') || nextLine.includes('ます'))) {
            entry.example = nextLine.trim();
            break;
        }
    }

    // Return entry if it has Japanese characters or was successfully processed
    return (entry.processed || hasJapaneseCharacters(entry.originalText)) ? entry : null;
}

async function main() {
    const pdfPath = path.join(__dirname, 'public', 'pdfs', 'tong-hop-tu-vung-n3.pdf');
    const jsonPath = path.join(__dirname, 'public', 'data', 'tu-vung-n3-improved.json');

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

        // Extract text from PDF with improved method
        const extractedData = await extractPDFTextImproved(pdfPath);
        console.log(`✅ Total text length: ${extractedData.fullText.length} characters`);
        console.log(`📄 Total lines across all pages: ${extractedData.fullText.split('\n').filter(l => l.trim().length > 0).length}`);

        // Process the text
        console.log('\nProcessing vocabulary data...');
        const processedData = processVocabularyTextImproved(extractedData);

        // Save to JSON file
        fs.writeFileSync(jsonPath, JSON.stringify(processedData, null, 2), 'utf8');

        console.log('\n✅ Successfully saved to:', jsonPath);
        console.log(`📊 Summary:`);
        console.log(`   - Total lines extracted: ${processedData.textStats.totalLines}`);
        console.log(`   - Japanese lines: ${processedData.textStats.japaneseLines}`);
        console.log(`   - Lessons found: ${processedData.totalLessons}`);
        console.log(`   - Vocabulary entries: ${processedData.totalVocabulary}`);

        // Show page breakdown
        console.log('\n📖 Page breakdown:');
        processedData.textStats.pageBreakdown.slice(0, 10).forEach(p => {
            console.log(`   Page ${p.page}: ${p.lines} lines`);
        });
        if (processedData.textStats.pageBreakdown.length > 10) {
            console.log(`   ... and ${processedData.textStats.pageBreakdown.length - 10} more pages`);
        }

        // Print preview
        if (processedData.lessons.length > 0) {
            console.log('\n📖 Preview:');
            const firstLesson = processedData.lessons[0];
            console.log(`First lesson: "${firstLesson.title}"`);
            console.log(`Vocabulary count: ${firstLesson.vocabularyCount}`);

            if (firstLesson.vocabulary.length > 0) {
                console.log(`Sample vocabulary entries:`);
                firstLesson.vocabulary.slice(0, 3).forEach((vocab, i) => {
                    console.log(`  ${i + 1}. ${vocab.originalText}`);
                    if (vocab.processed) {
                        console.log(`     - Kanji: ${vocab.kanji || 'N/A'}`);
                        console.log(`     - Hiragana: ${vocab.hiragana || 'N/A'}`);
                        console.log(`     - Meaning: ${vocab.meaning || 'N/A'}`);
                    }
                });
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run the extraction
main();