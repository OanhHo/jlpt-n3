#!/usr/bin/env python3
"""
parse_grammar_raw.py

Reads `scripts/output/grammar_extracted_raw.json` (produced by `ocr_extract_grammar.py`)
and applies simple heuristics to split the OCR lines into grammar entries. It then
groups entries into lessons with 5 structures each and writes the result to
`scripts/output/grammar_parsed.json` and `public/data/grammar_parsed.json`.

This script uses heuristics and will need manual review. It's intended to run
after you've executed the OCR script and confirmed `grammar_extracted_raw.json` exists.
"""

import re
import json
from pathlib import Path
from typing import List


def load_raw(path: Path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def is_heading_line(line: str) -> bool:
    """Heuristic to decide if a line is the start of a grammar pattern/entry.

    We look for common markers: lines starting with V / N / 普通形 / patterns with +/＋/〜,
    or lines that look like short headings (<= 40 chars) and contain Japanese kana/kanji
    or typical grammar bullets.
    """
    if not line:
        return False

    # Contains explicit plus/＋ or tilde which often appears in patterns
    if '+' in line or '＋' in line or '〜' in line or '~' in line:
        return True

    # Short lines (likely headings) that contain Japanese characters
    if len(line) < 60 and re.search(r'[一-龯ぁ-んァ-ン]', line):
        return True

    # Lines starting with V or N or 普通形 etc
    if re.match(r'^(V|N|A|普通形|Nの|Vる|Vます|Vた)', line):
        return True

    return False


def extract_entries(all_lines: List[str]) -> List[dict]:
    entries = []
    current = None

    for ln in all_lines:
        ln = ln.strip()
        if not ln:
            # treat blank as potential separator
            if current is not None and current.get('lines'):
                current['lines'].append('')
            continue

        if is_heading_line(ln):
            # start new entry
            if current and any(l.strip() for l in current.get('lines', [])):
                entries.append(current)

            current = {
                'pattern': ln,
                'lines': [],
            }
        else:
            if current is None:
                # no heading yet: create a catch-all heading
                current = {'pattern': 'UNKNOWN', 'lines': [ln]}
            else:
                current['lines'].append(ln)

    if current and (current.get('pattern') or current.get('lines')):
        entries.append(current)

    # Post-process: merge entries with very short patterns into previous if needed
    merged = []
    for e in entries:
        if merged and (e['pattern'] == 'UNKNOWN' or len(e['pattern']) < 3) and len(e['lines']) < 3:
            # append lines to previous
            merged[-1]['lines'].extend([''] + e['lines'])
        else:
            merged.append(e)

    # Assign ids and compact text
    for i, e in enumerate(merged, start=1):
        e['id'] = i
        # compact lines into text and keep raw lines
        e['text'] = '\n'.join([l for l in e['lines'] if l.strip()])

    return merged


def group_into_lessons(entries: List[dict], per_lesson: int = 5):
    lessons = []
    for i in range(0, len(entries), per_lesson):
        chunk = entries[i:i+per_lesson]
        lesson = {
            'lesson_id': (i // per_lesson) + 1,
            'title': f'Lesson {(i // per_lesson) + 1}',
            'entries': chunk,
        }
        lessons.append(lesson)
    return lessons


def main():
    raw_path = Path('scripts/output/grammar_extracted_raw.json')
    if not raw_path.exists():
        print('Error: scripts/output/grammar_extracted_raw.json not found. Run OCR script first.')
        return

    raw = load_raw(raw_path)

    # collect lines from all images in order
    all_lines = []
    for page in raw.get('results', []):
        lines = page.get('lines', [])
        if lines:
            all_lines.append(f'--- PAGE: {page.get("file")} ---')
            all_lines.extend(lines)
            all_lines.append('')

    entries = extract_entries(all_lines)

    lessons = group_into_lessons(entries, per_lesson=5)

    out = {
        'meta': {
            'source': str(raw_path),
            'count_entries': len(entries),
            'count_lessons': len(lessons),
        },
        'lessons': lessons,
    }

    out_dir = Path('scripts/output')
    out_dir.mkdir(parents=True, exist_ok=True)
    with open(out_dir / 'grammar_parsed.json', 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    # also copy to public/data for app use
    public_dir = Path('public/data')
    public_dir.mkdir(parents=True, exist_ok=True)
    with open(public_dir / 'grammar_parsed.json', 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    print(f'Parsed {len(entries)} entries into {len(lessons)} lessons.')
    print('Wrote scripts/output/grammar_parsed.json and public/data/grammar_parsed.json')


if __name__ == '__main__':
    main()
