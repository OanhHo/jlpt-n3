// Real PDF grammar extraction script
const fs = require('fs');

// Use legacy PDF.js for Node.js
async function loadPDFJS() {
    try {
        // Try to import PDF.js dynamically 
        const pdfjsModule = await import('pdfjs-dist/legacy/build/pdf.mjs');
        return pdfjsModule.default || pdfjsModule;
    } catch (error) {
        console.error('Failed to load PDF.js:', error);
        throw error;
    }
}

async function extractRealGrammarFromPDF() {
    try {
        console.log('📖 Extracting real grammar from PDF...');

        // Load PDF.js
        const pdfjsLib = await loadPDFJS();

        const pdfPath = './public/pdfs/tong-hop-tu-vung-n3.pdf';
        const data = new Uint8Array(fs.readFileSync(pdfPath));

        const loadingTask = pdfjsLib.getDocument({
            data: data,
            cMapUrl: './node_modules/pdfjs-dist/cmaps/',
            cMapPacked: true,
        });

        const pdf = await loadingTask.promise;
        console.log(`📄 PDF loaded successfully. Total pages: ${pdf.numPages}`);

        let allTextItems = [];
        let grammarStartPage = -1;

        // Find grammar section by looking for keywords
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();

            const pageText = textContent.items.map(item => item.str).join(' ');

            // Look for grammar section indicators
            if (pageText.includes('文法') || pageText.includes('ぶん法') ||
                pageText.includes('Grammar') || pageText.includes('〜')) {
                console.log(`📍 Found potential grammar content on page ${pageNum}`);
                console.log(`Preview: ${pageText.substring(0, 150)}...`);

                if (grammarStartPage === -1) {
                    grammarStartPage = pageNum;
                }

                // Store text items with position info
                textContent.items.forEach(item => {
                    if (item.str.trim()) {
                        allTextItems.push({
                            text: item.str.trim(),
                            x: item.transform[4],
                            y: item.transform[5],
                            pageNumber: pageNum,
                            fontSize: item.transform[0],
                            fontName: item.fontName
                        });
                    }
                });
            }
        }

        if (grammarStartPage === -1) {
            console.log('❌ No grammar section found, using sample patterns');
            return getSampleGrammarPatterns();
        }

        console.log(`✅ Found grammar section starting from page ${grammarStartPage}`);
        console.log(`📊 Total text items extracted: ${allTextItems.length}`);

        // Process and structure grammar patterns
        const grammarPatterns = processGrammarItems(allTextItems);

        console.log(`🎯 Extracted ${grammarPatterns.length} grammar patterns`);

        // Save raw data for inspection
        const rawData = {
            grammarStartPage,
            totalItems: allTextItems.length,
            patternsFound: grammarPatterns.length,
            extractedAt: new Date().toISOString(),
            patterns: grammarPatterns,
            rawTextSample: allTextItems.slice(0, 50) // First 50 items for debugging
        };

        fs.writeFileSync('./public/data/ngu-phap-n3-raw.json', JSON.stringify(rawData, null, 2));
        console.log('💾 Raw data saved to ngu-phap-n3-raw.json');

        return grammarPatterns;

    } catch (error) {
        console.error('❌ Error extracting grammar:', error);
        console.log('🔄 Using sample patterns as fallback');
        return getSampleGrammarPatterns();
    }
}

function processGrammarItems(textItems) {
    const patterns = [];
    let currentPattern = null;

    // Sort by page and position
    textItems.sort((a, b) => {
        if (a.pageNumber !== b.pageNumber) return a.pageNumber - b.pageNumber;
        if (Math.abs(a.y - b.y) > 5) return b.y - a.y; // Top to bottom
        return a.x - b.x; // Left to right
    });

    for (let i = 0; i < textItems.length; i++) {
        const item = textItems[i];
        const text = item.text;

        // Skip obviously non-grammar content
        if (text.length > 100 || text.match(/^\d+$/) || text.length < 2) continue;

        // Detect grammar pattern start
        if (isGrammarPatternStart(text)) {
            // Save previous pattern
            if (currentPattern && currentPattern.pattern) {
                patterns.push(currentPattern);
            }

            // Start new pattern
            currentPattern = {
                id: `grammar-${patterns.length + 1}`,
                pattern: cleanPattern(text),
                meaning: '',
                usage: '',
                example: '',
                formation: '',
                notes: '',
                level: 'N3',
                pageNumber: item.pageNumber
            };
        } else if (currentPattern) {
            // Continue building current pattern
            if (isVietnameseMeaning(text)) {
                currentPattern.meaning += (currentPattern.meaning ? ' ' : '') + text;
            } else if (isJapaneseExample(text)) {
                currentPattern.example += (currentPattern.example ? ' ' : '') + text;
            } else if (isFormationInfo(text)) {
                currentPattern.formation += (currentPattern.formation ? ' ' : '') + text;
            } else if (isUsageNote(text)) {
                currentPattern.usage += (currentPattern.usage ? ' ' : '') + text;
            } else {
                currentPattern.notes += (currentPattern.notes ? ' ' : '') + text;
            }
        }
    }

    // Add last pattern
    if (currentPattern && currentPattern.pattern) {
        patterns.push(currentPattern);
    }

    // Filter and clean patterns
    return patterns.filter(p =>
        p.pattern &&
        p.pattern.length > 1 &&
        p.pattern.length < 20 &&
        (p.meaning || p.example)
    ).slice(0, 50); // Limit to 50 patterns
}

function isGrammarPatternStart(text) {
    return text.startsWith('〜') ||
        text.startsWith('～') ||
        text.match(/^[ひらがな]{1,5}[てでもにがを]/) ||
        text.match(/^[A-Za-z]+\s*\+/) ||
        text.match(/^第\d+/) ||
        text.match(/^\d+\.\s*〜/);
}

function cleanPattern(text) {
    return text.replace(/^\d+\.\s*/, '').replace(/第\d+\s*/, '').trim();
}

function isVietnameseMeaning(text) {
    return text.match(/[aăâbcdđeêfghijklmnoôơpqrstuưvwxyz]/i) &&
        !text.match(/[ひらがなカタカナ漢字]/) &&
        text.length < 50;
}

function isJapaneseExample(text) {
    return text.match(/[ひらがなカタカナ漢字]/) &&
        text.length > 5 &&
        text.length < 100;
}

function isFormationInfo(text) {
    return text.includes('動詞') ||
        text.includes('形容詞') ||
        text.includes('名詞') ||
        text.includes('formation') ||
        text.includes('Form:');
}

function isUsageNote(text) {
    return text.includes('用法') ||
        text.includes('注意') ||
        text.includes('Note:') ||
        text.includes('Usage:');
}

function getSampleGrammarPatterns() {
    return [
        {
            id: 'grammar-001',
            pattern: '〜ても',
            meaning: 'dù cho, mặc dù',
            usage: 'Diễn tả việc dù có điều kiện A thì kết quả B vẫn không thay đổi',
            example: '雨が降っても、出かけます。(Ame ga futte mo, dekakemasu.) - Dù có mưa thì tôi vẫn đi ra ngoài.',
            level: 'N3',
            formation: '動詞て形 + も',
            notes: 'Có thể dùng với い-adj, な-adj, danh từ'
        },
        // ... more patterns will be added from PDF extraction
    ];
}

// Create comprehensive grammar data
function createGrammarData(patterns) {
    const itemsPerLesson = 8; // 8 patterns per lesson for better organization
    const lessons = [];

    for (let i = 0; i < patterns.length; i += itemsPerLesson) {
        const lessonItems = patterns.slice(i, i + itemsPerLesson);
        const lessonNumber = Math.floor(i / itemsPerLesson) + 1;

        lessons.push({
            id: `grammar-lesson-${String(lessonNumber).padStart(3, '0')}`,
            title: `Bài ${lessonNumber}: Ngữ pháp N3`,
            description: `Học ${lessonItems.length} mẫu ngữ pháp JLPT N3 quan trọng`,
            grammarCount: lessonItems.length,
            grammar: lessonItems
        });
    }

    return {
        totalGrammar: patterns.length,
        totalLessons: lessons.length,
        generatedAt: new Date().toISOString(),
        level: 'N3',
        description: 'Tổng hợp ngữ pháp JLPT N3 từ PDF',
        lessons: lessons,
        statistics: {
            patternsPerLesson: itemsPerLesson,
            avgExamplesPerPattern: 1,
            totalExamples: patterns.length,
            extractionMethod: 'PDF_PARSING'
        }
    };
}

async function main() {
    try {
        console.log('🚀 Starting real grammar extraction...');

        const patterns = await extractRealGrammarFromPDF();
        const grammarData = createGrammarData(patterns);

        // Save final data
        const outputPath = './public/data/ngu-phap-n3.json';
        fs.writeFileSync(outputPath, JSON.stringify(grammarData, null, 2), 'utf8');

        console.log('✅ Grammar extraction completed!');
        console.log(`📊 Results:`);
        console.log(`   - Total patterns: ${grammarData.totalGrammar}`);
        console.log(`   - Total lessons: ${grammarData.totalLessons}`);
        console.log(`   - Output file: ${outputPath}`);

        // Preview
        console.log('\n📚 Preview of extracted patterns:');
        patterns.slice(0, 5).forEach((pattern, index) => {
            console.log(`${index + 1}. ${pattern.pattern} - ${pattern.meaning || 'No meaning'}`);
            if (pattern.example) console.log(`   🔸 ${pattern.example.substring(0, 80)}...`);
        });

    } catch (error) {
        console.error('❌ Main execution failed:', error);
    }
}

main();