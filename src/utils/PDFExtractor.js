import { usePDFParser } from '../hooks/usePDFParser';

/**
 * Utility để extract PDF content và save thành JSON
 */
export const PDFExtractor = () => {
    const extractAndSave = async (pdfUrl, fileName) => {
        try {
            console.log('🔄 Starting extraction for:', fileName);

            // Sử dụng hook để đọc PDF
            const { loading, text, lessons, grammar } = usePDFParser(pdfUrl);

            // Wait for loading to complete
            while (loading) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            const extractedData = {
                fileName,
                extractedAt: new Date().toISOString(),
                metadata: {
                    totalCharacters: text.length,
                    totalLessons: lessons.length,
                    totalGrammarItems: grammar.length,
                    totalVocabulary: lessons.flat().length
                },
                rawText: text,
                lessons: lessons.map((lesson, index) => ({
                    id: `lesson-${index + 1}`,
                    title: `Lesson ${index + 1}`,
                    items: lesson,
                    wordCount: lesson.length
                })),
                grammar: grammar.map((item, index) => ({
                    id: `grammar-${index + 1}`,
                    content: item
                }))
            };

            // Create downloadable JSON
            const dataStr = JSON.stringify(extractedData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            // Create download link
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${fileName}-extracted.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            console.log('✅ Extraction completed and downloaded:', `${fileName}-extracted.json`);
            return extractedData;

        } catch (error) {
            console.error('❌ Extraction failed:', error);
            throw error;
        }
    };

    return { extractAndSave };
};