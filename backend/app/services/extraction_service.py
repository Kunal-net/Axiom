"""
Axiom Text & Structure Extraction Service
Extracts normalized text, page counts, and section anchors from PDF and DOCX files.
"""

import io
from typing import NamedTuple, Optional
from pypdf import PdfReader
from pypdf.errors import EmptyFileError, PdfReadError
import docx

from backend.app.core.errors import ProcessingError, ValidationError
from backend.app.core.logging import logger


class ExtractionResult(NamedTuple):
    text: str
    page_count: int
    char_count: int
    file_type: str


class ExtractionService:
    @staticmethod
    def extract_from_pdf(content: bytes) -> ExtractionResult:
        if not content:
            raise ValidationError(message="Uploaded PDF file is empty (0 bytes)", code="EMPTY_FILE")
        try:
            reader = PdfReader(io.BytesIO(content))
            if reader.is_encrypted:
                try:
                    # Attempt empty password decrypt
                    reader.decrypt("")
                except Exception:
                    raise ValidationError(message="Password-protected PDF files are not supported", code="ENCRYPTED_FILE")

            page_count = len(reader.pages)
            if page_count == 0:
                raise ValidationError(message="PDF contains 0 pages", code="EMPTY_DOCUMENT")

            extracted_pages = []
            for i, page in enumerate(reader.pages):
                page_text = page.extract_text() or ""
                extracted_pages.append(f"--- PAGE {i + 1} ---\n{page_text.strip()}\n")

            full_text = "\n".join(extracted_pages).strip()
            if not full_text:
                full_text = f"[Scanned or image-based PDF document: {page_count} pages detected without embedded text layer]"

            return ExtractionResult(
                text=full_text,
                page_count=page_count,
                char_count=len(full_text),
                file_type="pdf",
            )
        except (EmptyFileError, PdfReadError) as e:
            logger.warning(f"Corrupted or invalid PDF format: {e}")
            raise ValidationError(message="Malformed or corrupted PDF file", code="CORRUPTED_FILE")
        except Exception as e:
            if isinstance(e, ValidationError):
                raise
            logger.error(f"Unexpected error extracting PDF: {e}")
            raise ProcessingError(message="Failed to extract text from PDF document", code="EXTRACTION_FAILED")

    @staticmethod
    def extract_from_docx(content: bytes) -> ExtractionResult:
        if not content:
            raise ValidationError(message="Uploaded DOCX file is empty (0 bytes)", code="EMPTY_FILE")
        try:
            doc = docx.Document(io.BytesIO(content))
            paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
            
            # Also extract from tables
            for table in doc.tables:
                for row in table.rows:
                    row_texts = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                    if row_texts:
                        paragraphs.append(" | ".join(row_texts))

            full_text = "\n\n".join(paragraphs).strip()
            # Estimate pages from word/char count (~300 words or 1800 chars per standard legal page)
            char_len = len(full_text)
            page_count = max(1, (char_len + 1799) // 1800)

            return ExtractionResult(
                text=full_text,
                page_count=page_count,
                char_count=char_len,
                file_type="docx",
            )
        except Exception as e:
            logger.warning(f"Failed to extract DOCX: {e}")
            raise ValidationError(message="Malformed or corrupted DOCX file", code="CORRUPTED_FILE")

    def extract(self, content: bytes, file_type: str) -> ExtractionResult:
        clean_type = file_type.lower().replace(".", "")
        if clean_type == "pdf":
            return self.extract_from_pdf(content)
        elif clean_type in ["docx", "doc"]:
            return self.extract_from_docx(content)
        else:
            raise ValidationError(message=f"Unsupported format '{file_type}'. Supported: PDF, DOCX", code="UNSUPPORTED_MEDIA_TYPE")


extraction_service = ExtractionService()
