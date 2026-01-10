# OCR grammar extraction

This folder contains a small script to OCR grammar images and produce JSON outputs.

Prerequisites
 - Install Tesseract on your system.
   - Ubuntu/Debian: `sudo apt update && sudo apt install tesseract-ocr tesseract-ocr-jpn tesseract-ocr-vie tesseract-ocr-eng`
   - macOS (Homebrew): `brew install tesseract-lang tesseract` (or `brew install tesseract` then add languages as needed)
 - Ensure the Tesseract language packs you need are installed (e.g. `jpn`, `vie`, `eng`).

Python deps
 - Create a virtualenv and install packages:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r scripts/requirements.txt
```

Usage
 - Put your grammar photos (png/jpg/jpeg/tiff) into `scripts/input_images/`.
 - Run the OCR script. Example:

```bash
python3 scripts/ocr_extract_grammar.py --input-dir scripts/input_images --output-dir scripts/output --lang jpn+vie+eng
```

 - Outputs:
   - `scripts/output/{image_name}.json` per image with keys `file`, `path`, `raw_text`, `lines`.
   - `scripts/output/grammar_extracted_raw.json` combined file for all images.

Notes & tips
 - If OCR quality is poor, try different `--psm` values (e.g. 6 or 3) or higher resolution images.
 - You may need to install additional Tesseract traineddata for languages. On Debian/Ubuntu it's `tesseract-ocr-<lang>`.
 - This script produces raw text and lines; it does not yet parse grammar entries. After confirming the raw text, we can add heuristics to split into structured grammar JSON.

Next steps
 - Run OCR and check `scripts/output/grammar_extracted_raw.json`.
 - Then run the parser to produce lesson JSON (5 structures per lesson):

```bash
python3 scripts/parse_grammar_raw.py
```

 - Output files:
  - `scripts/output/grammar_parsed.json` (for inspection)
  - `public/data/grammar_parsed.json` (copied for app use)

If the parsing needs improvement I can refine the heuristics after you provide the OCR output (or an example of it).
