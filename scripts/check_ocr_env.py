import sys
try:
    import pytesseract
    import pdf2image
    from pdf2image import convert_from_path
    print("OCR dependencies found.")
    
    # Check if tesseract binary is available
    try:
        pytesseract.get_tesseract_version()
        print("Tesseract binary found.")
    except Exception as e:
        print(f"Tesseract binary NOT found: {e}")
        
    # Check if poppler is available (by trying to import, pdf2image wraps it)
    # pdf2image usually throws error on convert_from_path if poppler not found
    print("Poppler check requires running conversion.")

except ImportError as e:
    print(f"Missing dependency: {e}")
