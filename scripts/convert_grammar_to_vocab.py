#!/usr/bin/env python3
"""
convert_grammar_to_vocab.py

Convert `public/data/ngu-phap-n3.json` grammar lessons into a vocabulary-style
lessons file (`public/data/grammar_vocabulary_lessons.json`) so the existing
`VocabularyLessons` component can display grammar as flashcards.

This script also writes a refined `public/data/grammar_parsed_refined.json` with
cleaned entries (split compound patterns, normalize examples).
"""

import json
from pathlib import Path
import re


def load_json(p: Path):
    with p.open('r', encoding='utf-8') as f:
        return json.load(f)


def normalize_pattern(pat: str):
    # Split patterns joined with slashes or commas into variants
    parts = re.split(r'\s*[／/、,]\s*', pat)
    parts = [p.strip() for p in parts if p.strip()]
    return parts


def convert_example(example_str: str):
    # Many examples in our source are in format: "JP。 — VI"
    if '—' in example_str:
        jp, vi = [s.strip() for s in example_str.split('—', 1)]
        return {'jp': jp, 'vi': vi}
    else:
        return {'jp': example_str, 'vi': ''}


def main():
    src = Path('public/data/ngu-phap-n3.json')
    if not src.exists():
        print('Source public/data/ngu-phap-n3.json not found. Run earlier steps first.')
        return

    data = load_json(src)

    lessons_out = []
    refined_entries = []

    for lesson in data.get('lessons', []):
        vocab_list = []
        for g in lesson.get('grammar', []):
            pattern = g.get('pattern', '')
            meaning = g.get('meaning', '')
            examples = g.get('examples', [])

            # produce one vocab card per pattern variant
            variants = normalize_pattern(pattern)
            for var in variants:
                # build simple vocab-like object
                ex = examples[0] if examples else ''
                ex_obj = convert_example(ex) if ex else {'jp': '', 'vi': ''}

                vocab = {
                    'id': f"grammar-{lesson['id']}-{g.get('id')}-{variants.index(var)+1}",
                    'kanji': var,
                    'hiragana': '',
                    'romaji': '',
                    'meaning': meaning,
                    'vietnamese': meaning,
                    'pos': 'grammar',
                    'level': data.get('level', 'N3'),
                    'lesson': lesson.get('id'),
                    'examples': [ex_obj],
                    'example': f"{ex_obj.get('jp')} — {ex_obj.get('vi')}",
                }

                vocab_list.append(vocab)

                # refined entry
                refined_entries.append({
                    'id': vocab['id'],
                    'pattern': var,
                    'meaning': meaning,
                    'examples': [ex_obj]
                })

        lessons_out.append({
            'id': f"grammar-lesson-{lesson.get('id')}",
            'title': lesson.get('title'),
            'description': lesson.get('description'),
            'vocabulary': vocab_list,
            'totalVocabulary': len(vocab_list)
        })

    out_dir = Path('public/data')
    out_dir.mkdir(parents=True, exist_ok=True)

    vocab_file = out_dir / 'grammar_vocabulary_lessons.json'
    with vocab_file.open('w', encoding='utf-8') as f:
        json.dump(lessons_out, f, ensure_ascii=False, indent=2)

    refined_file = out_dir / 'grammar_parsed_refined.json'
    with refined_file.open('w', encoding='utf-8') as f:
        json.dump({'entries': refined_entries}, f, ensure_ascii=False, indent=2)

    print(f'Wrote {vocab_file} and {refined_file}')


if __name__ == '__main__':
    main()
