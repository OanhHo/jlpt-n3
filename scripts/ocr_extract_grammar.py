#!/usr/bin/env python3
"""
ocr_extract_grammar.py

Simple OCR extraction script for grammar images.

What it does:
 - Reads images from `scripts/input_images/` (create this folder and drop your photos there)
 - Preprocesses images (grayscale, denoise, threshold)
 - Runs Tesseract OCR (configurable languages)
 - Writes per-image raw text and per-line arrays to `scripts/output/`
 - Produces a combined `grammar_extracted_raw.json` for easier inspection

Notes:
 - Install Tesseract on your system and language packs you need (jpn, vie, eng...)
 - See `scripts/README_OCR.md` for usage and installation steps
"""

import os
import sys
import json
from pathlib import Path
import argparse

try:
    import cv2
    from PIL import Image
    import pytesseract
    import numpy as np
except Exception as e:
    print("Missing dependency:", e)
    print("Run: pip install -r scripts/requirements.txt")
    sys.exit(1)


def preprocess_image_cv(img_path):
    # Read image with OpenCV
    img = cv2.imread(str(img_path))
    if img is None:
        raise ValueError(f"Cannot read image: {img_path}")

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Resize if too large (keep aspect ratio)
    h, w = gray.shape
    max_dim = 2400
    if max(h, w) > max_dim:
        scale = max_dim / max(h, w)
        gray = cv2.resize(gray, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)

    # Denoise
    gray = cv2.bilateralFilter(gray, 9, 75, 75)

    # Adaptive threshold
    th = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                               cv2.THRESH_BINARY, 11, 2)

    # Optionally invert if background is dark
    # Count white vs black
    if np.sum(th == 255) < np.sum(th == 0):
        th = 255 - th

    return th


def ocr_image(img_path, lang=None, psm=3):
    pre = preprocess_image_cv(img_path)

    # Convert back to PIL Image for pytesseract
    pil_img = Image.fromarray(pre)

    tconfig = f"--psm {psm}"
    if lang:
        text = pytesseract.image_to_string(pil_img, lang=lang, config=tconfig)
    else:
        text = pytesseract.image_to_string(pil_img, config=tconfig)

    # Split into lines and strip
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    return text, lines


def ensure_dir(p: Path):
    p.mkdir(parents=True, exist_ok=True)


def main(args):
    input_dir = Path(args.input_dir)
    out_dir = Path(args.output_dir)
    ensure_dir(out_dir)

    results = []

    files = sorted([p for p in input_dir.iterdir() if p.suffix.lower() in ('.png', '.jpg', '.jpeg', '.tif', '.tiff')])
    if not files:
        print(f"No images found in {input_dir}. Please add your grammar photos there.")
        return

    for p in files:
        print(f"Processing: {p.name}")
        try:
            raw_text, lines = ocr_image(p, lang=args.lang, psm=args.psm)
        except Exception as e:
            print(f"Error processing {p}: {e}")
            continue

        item = {
            'file': p.name,
            'path': str(p.resolve()),
            'raw_text': raw_text,
            'lines': lines,
        }

        results.append(item)

        # Write per-file JSON
        out_file = out_dir / (p.stem + '.json')
        with open(out_file, 'w', encoding='utf-8') as f:
            json.dump(item, f, ensure_ascii=False, indent=2)

    # Combined output
    combined = {
        'source_dir': str(input_dir.resolve()),
        'count': len(results),
        'results': results,
    }

    combined_file = out_dir / 'grammar_extracted_raw.json'
    with open(combined_file, 'w', encoding='utf-8') as f:
        json.dump(combined, f, ensure_ascii=False, indent=2)

    print(f"Done. Wrote {len(results)} files to {out_dir}. Combined: {combined_file}")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='OCR extract grammar images to JSON')
    parser.add_argument('--input-dir', default='scripts/input_images', help='Input images folder')
    parser.add_argument('--output-dir', default='scripts/output', help='Output folder for JSON')
    parser.add_argument('--lang', default=None, help='Tesseract language(s), e.g. jpn+vie+eng')
    parser.add_argument('--psm', type=int, default=3, help='Tesseract PSM (page segmentation mode)')
    args = parser.parse_args()

    main(args)
