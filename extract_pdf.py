#!/usr/bin/env python3
import json
import sys
import os

try:
    import PyPDF2
except ImportError:
    print("Installing PyPDF2...")
    os.system("pip install PyPDF2")
    import PyPDF2

def extract_pdf_text(pdf_path):
    """Extract text from PDF file"""
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text += page.extract_text() + "\n"
            
            return text
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return None

def process_vocabulary_text(text):
    """Process the extracted text to structure vocabulary data"""
    lines = text.split('\n')
    lessons = []
    current_lesson = None
    vocabulary = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Detect lesson headers
        if 'lesson' in line.lower() or 'bài' in line.lower() or '第' in line:
            if current_lesson and vocabulary:
                current_lesson['vocabulary'] = vocabulary
                lessons.append(current_lesson)
                vocabulary = []
            
            current_lesson = {
                'title': line,
                'vocabulary': []
            }
        
        # Try to detect vocabulary entries (kanji, hiragana, meaning pattern)
        elif line and current_lesson:
            # Simple heuristic: if line contains Japanese characters
            if any(ord(char) >= 0x3040 for char in line):
                vocab_entry = {
                    'text': line,
                    'processed': False
                }
                vocabulary.append(vocab_entry)
    
    # Add the last lesson
    if current_lesson and vocabulary:
        current_lesson['vocabulary'] = vocabulary
        lessons.append(current_lesson)
    
    return {
        'title': 'Tổng Hợp Từ Vựng N3',
        'source_file': 'tong-hop-tu-vung-n3.pdf',
        'extracted_at': '2025-10-30',
        'lessons': lessons,
        'total_lessons': len(lessons),
        'raw_text_preview': text[:1000] + '...' if len(text) > 1000 else text
    }

def main():
    pdf_path = '/home/oanh_ho/react/public/pdfs/tong-hop-tu-vung-n3.pdf'
    json_path = '/home/oanh_ho/react/public/data/tu-vung-n3.json'
    
    # Create data directory if it doesn't exist
    os.makedirs(os.path.dirname(json_path), exist_ok=True)
    
    print(f"Extracting text from: {pdf_path}")
    text = extract_pdf_text(pdf_path)
    
    if text:
        print(f"Extracted {len(text)} characters")
        print("Processing vocabulary data...")
        
        data = process_vocabulary_text(text)
        
        # Save to JSON
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"Successfully saved to: {json_path}")
        print(f"Found {data['total_lessons']} lessons")
        
        # Print preview
        print("\nPreview of extracted data:")
        print(f"Title: {data['title']}")
        if data['lessons']:
            print(f"First lesson: {data['lessons'][0]['title']}")
            if data['lessons'][0]['vocabulary']:
                print(f"First vocab entry: {data['lessons'][0]['vocabulary'][0]['text'][:100]}...")
    else:
        print("Failed to extract text from PDF")

if __name__ == "__main__":
    main()