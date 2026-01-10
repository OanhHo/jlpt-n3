// src/hooks/usePDFParser.js
import { useState, useEffect } from 'react';
// Vite: import worker as URL
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
let pdfWorkerUrl = null;

try {
    // Try ESM worker (Vite supports ?url)
    // Try .mjs first, fallback to .js
    // Use dynamic import in top-level so bundler resolves it
    // eslint-disable-next-line import/no-unresolved
    pdfWorkerUrl = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href;
} catch (e) {
    // ignore, we'll try other methods below
}

/**
 * Helper to set workerSrc robustly:
 * - Prefer vite `?url` import
 * - If not available, expect file at /pdf.worker.min.js in public
 */
function setWorkerSrc() {
    // If we have a URL from above, use it
    if (pdfWorkerUrl) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
        return;
    }

    // Try to import with ?url (alternate)
    try {
        // This will be handled by Vite bundler if supported
        // eslint-disable-next-line import/no-extraneous-dependencies
        // Note: we don't use static import to avoid bundler errors; attempt dynamic URL build:
        const candidate = new URL('/pdf.worker.min.js', window.location.origin).href;
        pdfjsLib.GlobalWorkerOptions.workerSrc = candidate;
        return;
    } catch (err) {
        // final fallback: point to public path
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    }
}

setWorkerSrc();

export function usePDFParser(url) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [text, setText] = useState('');
    const [lessons, setLessons] = useState([]);
    const [grammar, setGrammar] = useState([]);

    useEffect(() => {
        if (!url) return;

        let cancelled = false;
        const loadPDF = async () => {
            setLoading(true);
            setError(null);
            try {
                // try to get document
                const loadingTask = pdfjsLib.getDocument(url);
                const pdf = await loadingTask.promise;

                let allText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    const strings = content.items.map((item) => item.str).join(' ');
                    allText += strings + '\n';
                    if (cancelled) break;
                }
                if (cancelled) return;

                setText(allText);

                // Basic splitting logic (you can improve pattern rules)
                const [vocabPart, grammarPart] = allText.split(/文法/);

                const rawVocabItems = vocabPart
                    ? vocabPart
                        .split(/\n|・|【|】|●|○|－|—|•/) // try multiple separators
                        .map((l) => l.trim())
                        .filter((l) => l.length > 0)
                    : [];

                const vocabList = rawVocabItems.map((t, i) => ({ id: i + 1, text: t }));

                // chunk into lessons of 30
                const grouped = [];
                for (let i = 0; i < vocabList.length; i += 30) {
                    grouped.push(vocabList.slice(i, i + 30));
                }

                const grammarList = grammarPart
                    ? grammarPart
                        .split(/(?:\n|。|．|\r|\t)/)
                        .map((s) => s.trim())
                        .filter((s) => s.length > 0)
                    : [];

                setLessons(grouped);
                setGrammar(grammarList);
            } catch (err) {
                console.error('PDF parse error:', err);
                setError(err.message || String(err));
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadPDF();

        return () => {
            cancelled = true;
        };
    }, [url]);

    return { loading, error, text, lessons, grammar };
}
