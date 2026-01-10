const fs = require('fs');
const path = require('path');

// Use canvas backend for PDF.js in Node.js
const { createRequire } = require('module');
const require2 = createRequire(import.meta.url || __filename);

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

async function extractGrammarFromPDF() {
    try {
        console.log('📖 Loading PDF for grammar extraction...');

        // Load PDF.js
        const pdfjsLib = await loadPDFJS();

        // Configure PDF.js
        const CMAP_URL = './node_modules/pdfjs-dist/cmaps/';
        const CMAP_PACKED = true;

        const pdfPath = './public/pdfs/tong-hop-tu-vung-n3.pdf';
        const data = new Uint8Array(fs.readFileSync(pdfPath));

        const loadingTask = pdfjsLib.getDocument({
            data: data,
            cMapUrl: CMAP_URL,
            cMapPacked: CMAP_PACKED,
        });

        const pdf = await loadingTask.promise;
        console.log(`📄 PDF loaded successfully. Total pages: ${pdf.numPages}`);

        let allTextItems = [];

        // Extract text from all pages to find grammar section
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();

            textContent.items.forEach(item => {
                allTextItems.push({
                    text: item.str,
                    x: item.transform[4],
                    y: item.transform[5],
                    pageNumber: pageNum,
                    fontSize: item.transform[0],
                    fontName: item.fontName
                });
            });

            // Check if this page contains grammar content
            const pageText = textContent.items.map(item => item.str).join(' ');
            if (pageText.includes('文法') || pageText.includes('ぶん') || pageText.includes('ぽう')) {
                console.log(`📝 Found grammar content on page ${pageNum}`);
                console.log(`Preview: ${pageText.substring(0, 200)}...`);
            }
        }

        console.log(`\n📊 Total text items extracted: ${allTextItems.length}`);

        // Find grammar section start
        const grammarStartIndex = findGrammarSectionStart(allTextItems);
        if (grammarStartIndex === -1) {
            console.log('❌ Could not find grammar section start');
            return;
        }

        console.log(`📍 Found grammar section starting at index ${grammarStartIndex}`);

        // Extract grammar items from the identified section
        const grammarItems = extractGrammarItems(allTextItems.slice(grammarStartIndex));

        console.log(`✅ Extracted ${grammarItems.length} grammar items`);

        // Save raw grammar data
        const outputData = {
            totalItems: grammarItems.length,
            extractedAt: new Date().toISOString(),
            grammarItems: grammarItems
        };

        const outputPath = './public/data/ngu-phap-n3-raw.json';
        fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');

        console.log(`💾 Raw grammar data saved to: ${outputPath}`);

        // Preview first 10 items
        console.log('\n📚 Preview of first 10 grammar items:');
        grammarItems.slice(0, 10).forEach((item, index) => {
            console.log(`${index + 1}. ${item.originalText} (Page ${item.pageNumber})`);
        });

    } catch (error) {
        console.error('❌ Error extracting grammar:', error);
    }
}

function findGrammarSectionStart(textItems) {
    // Look for grammar section indicators
    const grammarIndicators = ['文法', '文ぶん法ぽう', 'ぶん法ぽう', 'Grammar'];

    for (let i = 0; i < textItems.length; i++) {
        const text = textItems[i].text;
        if (grammarIndicators.some(indicator => text.includes(indicator))) {
            console.log(`📍 Found grammar indicator "${text}" at index ${i}, page ${textItems[i].pageNumber}`);
            return i;
        }
    }

    // If not found by indicators, look for patterns specific to grammar
    for (let i = 0; i < textItems.length; i++) {
        const text = textItems[i].text;
        // Look for grammar pattern like "〜ても" or similar
        if (text.match(/[〜～].{1,3}[てもでにがをは]/)) {
            console.log(`📍 Found grammar pattern "${text}" at index ${i}, page ${textItems[i].pageNumber}`);
            return i;
        }
    }

    return -1;
}

function extractGrammarItems(grammarTextItems) {
    const grammarItems = [];
    let currentItem = null;

    for (let i = 0; i < grammarTextItems.length; i++) {
        const item = grammarTextItems[i];
        const text = item.text.trim();

        if (!text) continue;

        // Skip page numbers and headers
        if (text.match(/^\d+$/) || text.length > 100) continue;

        // Detect new grammar pattern (starts with 〜 or grammar indicators)
        if (isGrammarPatternStart(text)) {
            // Save previous item if exists
            if (currentItem) {
                grammarItems.push(currentItem);
            }

            // Start new grammar item
            currentItem = {
                id: `grammar-${grammarItems.length + 1}`,
                originalText: text,
                pageNumber: item.pageNumber,
                pattern: extractPattern(text),
                meaning: '',
                usage: '',
                example: '',
                notes: ''
            };
        } else if (currentItem) {
            // Continue building current item
            if (isJapaneseExample(text)) {
                currentItem.example += (currentItem.example ? ' ' : '') + text;
            } else if (isVietnameseMeaning(text)) {
                currentItem.meaning += (currentItem.meaning ? ' ' : '') + text;
            } else if (isUsageNote(text)) {
                currentItem.usage += (currentItem.usage ? ' ' : '') + text;
            } else {
                // Add to notes or extend original text
                currentItem.originalText += ' ' + text;
            }
        }
    }

    // Add last item
    if (currentItem) {
        grammarItems.push(currentItem);
    }

    return grammarItems;
}

function isGrammarPatternStart(text) {
    // Check if text starts a new grammar pattern
    return text.startsWith('〜') ||
        text.startsWith('～') ||
        text.match(/^[ひらがな]+[てもでにがをは]/) ||
        text.match(/^[A-Za-z]+\s*\+/);
}

function extractPattern(text) {
    // Extract the grammar pattern from text
    const match = text.match(/[〜～]?([^〜～\s]+)/);
    return match ? match[1] : text;
}

function isJapaneseExample(text) {
    // Check if text contains Japanese example
    return text.match(/[ひらがなカタカナ漢字]/) && text.length > 3 && text.length < 50;
}

function isVietnameseMeaning(text) {
    // Check if text is Vietnamese meaning
    return text.match(/[aăâbcdđeêfghijklmnoôơpqrstuưvwxyz]/i) && !text.match(/[A-Z]{2,}/);
}

function isUsageNote(text) {
    // Check if text is usage note
    return text.includes('用法') || text.includes('注意') || text.includes('Cách dùng');
}

extractGrammarFromPDF();