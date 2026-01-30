const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

const pdfPath = path.resolve(__dirname, '../public/pdfs/Shinkanzen -N3 -DOKKAI.pdf');
const outputPath = path.resolve(__dirname, 'output/reading_raw.txt');


// Ensure output directory exists
if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}

console.log(`Reading PDF from: ${pdfPath}`);

if (!fs.existsSync(pdfPath)) {
    console.error('PDF file not found!');
    process.exit(1);
}

const dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(function (data) {
    console.log('Number of pages:', data.numpages);
    console.log('Info:', data.info);

    // Write just the first 5000 characters to check
    console.log('Writing raw text sample to:', outputPath);
    fs.writeFileSync(outputPath, data.text);

    // Print first 500 characters
    console.log('--- PREVIEW START ---');
    console.log(data.text.substring(0, 500));
    console.log('--- PREVIEW END ---');
}).catch(err => {
    console.error('Error parsing PDF:', err);
});
