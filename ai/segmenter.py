"""
Axiom Contract Segmentation and Text Normalization Service
Parses extracted PDF/DOCX text into structured pages, clauses, and sections.
Preserves page references, detects scanned documents, and enables bounded chunking.
"""

import re
from typing import Any, Dict, List, NamedTuple, Optional, Tuple

from ai.schemas import ContractSegment
from backend.app.core.logging import logger


class DocumentInputStatus(NamedTuple):
    is_valid: bool
    status: str  # 'valid' | 'empty' | 'scanned' | 'too_long'
    message: str
    page_count: int
    char_count: int


class ContractSegmenter:
    """Intelligent legal text segmenter and layout anchor tracker."""

    PAGE_MARKER_REGEX = re.compile(r"--- PAGE (\d+) ---", re.IGNORECASE)
    SECTION_HEADER_REGEX = re.compile(
        r"(?m)^[ \t]*(?:(?:Section|Article|Clause|\§)\s+)?([0-9IVXLCDM]+(?:\.[0-9]+)*)\s*[:.•\-–—]\s*([A-Za-z0-9 ,/&\'\"–—\-]{2,60}?)(?:[\.\n\r:]|$)",
        re.IGNORECASE,
    )

    def detect_input_status(self, text: Optional[str]) -> DocumentInputStatus:
        """Detects whether input text is empty, scanned without OCR, or valid."""
        if not text or not text.strip():
            return DocumentInputStatus(
                is_valid=False,
                status="empty",
                message="Contract document contains no readable text layer (0 characters).",
                page_count=0,
                char_count=0,
            )

        clean = text.strip()
        char_count = len(clean)

        # Detect scanned notice from backend extraction service
        if "[scanned or image-based pdf document" in clean.lower():
            # Extract detected page count if present
            pages_match = re.search(r"(\d+)\s+pages detected", clean, re.IGNORECASE)
            page_count = int(pages_match.group(1)) if pages_match else 1
            return DocumentInputStatus(
                is_valid=False,
                status="scanned",
                message=(
                    "Scanned or image-only document detected. Axiom requires a digital text layer. "
                    "Please run OCR on this contract or provide an original PDF/DOCX."
                ),
                page_count=page_count,
                char_count=char_count,
            )

        # Count total pages via page markers
        page_markers = self.PAGE_MARKER_REGEX.findall(clean)
        page_count = len(page_markers) if page_markers else max(1, (char_count + 1799) // 1800)

        # Check for garbled / non-alphabetical content (e.g. pure binary or whitespace)
        words = re.findall(r"[A-Za-z]{2,}", clean)
        if len(words) < 5:
            return DocumentInputStatus(
                is_valid=False,
                status="scanned",
                message="Document appears to be image-based or garbled without readable contract text.",
                page_count=page_count,
                char_count=char_count,
            )

        return DocumentInputStatus(
            is_valid=True,
            status="valid",
            message="Document text successfully segmented and ready for analysis.",
            page_count=page_count,
            char_count=char_count,
        )

    def normalize_text(self, text: str) -> str:
        """Normalizes excessive whitespace and carriage returns while preserving structure."""
        if not text:
            return ""
        # Convert CRLF to LF
        normalized = text.replace("\r\n", "\n").replace("\r", "\n")
        # Replace non-breaking spaces and tab indentations
        normalized = normalized.replace("\u00a0", " ").replace("\t", "    ")
        # Collapse 3+ newlines into 2
        normalized = re.sub(r"\n{3,}", "\n\n", normalized)
        # Strip trailing whitespace on each line
        lines = [line.rstrip() for line in normalized.split("\n")]
        return "\n".join(lines).strip()

    def parse_pages(self, text: str) -> List[Dict[str, Any]]:
        """Splits document text into individual page objects with accurate 1-indexed page numbers."""
        normalized = self.normalize_text(text)
        page_splits = self.PAGE_MARKER_REGEX.split(normalized)

        pages: List[Dict[str, Any]] = []

        # If no page markers exist, treat entire text as page 1
        if len(page_splits) == 1:
            pages.append({
                "page_number": 1,
                "text": page_splits[0].strip(),
                "char_length": len(page_splits[0].strip()),
            })
            return pages

        # Regex split with capture group returns: [pre_text, page_num_1, page_text_1, page_num_2, page_text_2, ...]
        i = 1
        while i < len(page_splits):
            try:
                page_num = int(page_splits[i])
                page_content = page_splits[i + 1].strip() if i + 1 < len(page_splits) else ""
                pages.append({
                    "page_number": page_num,
                    "text": page_content,
                    "char_length": len(page_content),
                })
            except (ValueError, IndexError):
                pass
            i += 2

        return pages

    def get_page_for_offset(self, text: str, char_offset: int) -> int:
        """Determines the 1-indexed page number corresponding to a character offset in text."""
        matches = list(self.PAGE_MARKER_REGEX.finditer(text))
        if not matches:
            return 1

        current_page = 1
        for match in matches:
            if match.start() <= char_offset:
                try:
                    current_page = int(match.group(1))
                except ValueError:
                    pass
            else:
                break
        return current_page

    def find_best_page_for_excerpt(self, text: str, excerpt: str, fallback_page: int = 1) -> int:
        """Finds the page number where the given excerpt physically appears."""
        if not excerpt:
            return fallback_page

        clean_excerpt = excerpt.strip().lower()
        # Try direct exact match
        idx = text.lower().find(clean_excerpt)
        if idx != -1:
            return self.get_page_for_offset(text, idx)

        # Try matching first 40 chars of excerpt
        short_excerpt = clean_excerpt[:40].strip()
        if len(short_excerpt) >= 15:
            idx = text.lower().find(short_excerpt)
            if idx != -1:
                return self.get_page_for_offset(text, idx)

        return fallback_page

    def find_section_for_excerpt(self, text: str, excerpt: str) -> Optional[str]:
        """Identifies the enclosing section number and title for a verbatim excerpt from text."""
        if not text or not excerpt:
            return None

        # 1. If excerpt itself starts with a section header, extract it directly
        m_head = self.SECTION_HEADER_REGEX.match(excerpt.strip())
        if m_head:
            sec_num = m_head.group(1).strip()
            sec_title = m_head.group(2).strip()
            return f"Section {sec_num} • {sec_title}"

        clean_exc = excerpt.strip()
        idx = text.lower().find(clean_exc.lower())
        if idx == -1:
            short_exc = clean_exc[:40].strip()
            if len(short_exc) >= 15:
                idx = text.lower().find(short_exc.lower())

        if idx == -1:
            return None

        # Look at preceding text up to the start of the excerpt (+ small margin)
        preceding = text[: idx + min(len(clean_exc), 60)]
        matches = list(self.SECTION_HEADER_REGEX.finditer(preceding))
        if matches:
            last_m = matches[-1]
            sec_num = last_m.group(1).strip()
            sec_title = last_m.group(2).strip()
            return f"Section {sec_num} • {sec_title}"

        return None

    def segment_into_clauses(self, text: str) -> List[ContractSegment]:
        """Segments text into distinct clauses and sections with stable anchors."""
        normalized = self.normalize_text(text)
        pages = self.parse_pages(normalized)

        segments: List[ContractSegment] = []
        counter = 1

        for page in pages:
            page_num = page["page_number"]
            page_text = page["text"]

            # Split paragraphs
            paragraphs = [p.strip() for p in page_text.split("\n\n") if p.strip()]
            current_section = f"Page {page_num} Provisions"

            for para in paragraphs:
                # Check if paragraph begins with a section heading
                header_match = self.SECTION_HEADER_REGEX.match(para)
                if header_match:
                    sec_num = header_match.group(1)
                    sec_name = header_match.group(2).strip()
                    current_section = f"Section {sec_num} • {sec_name}"

                segments.append(
                    ContractSegment(
                        index=counter,
                        page_number=page_num,
                        section_title=current_section,
                        text=para,
                    )
                )
                counter += 1

        return segments

    def create_bounded_chunks(
        self,
        text: str,
        max_chunk_chars: int = 12000,
        overlap_chars: int = 1000,
    ) -> List[Dict[str, Any]]:
        """Creates bounded chunks for long contracts without truncating final pages."""
        normalized = self.normalize_text(text)
        if len(normalized) <= max_chunk_chars:
            return [{
                "chunk_index": 0,
                "text": normalized,
                "start_page": 1,
                "end_page": self.get_page_for_offset(normalized, len(normalized)),
            }]

        chunks: List[Dict[str, Any]] = []
        paragraphs = normalized.split("\n\n")

        current_chunk_paragraphs: List[str] = []
        current_len = 0
        chunk_idx = 0

        for para in paragraphs:
            para_len = len(para) + 2
            if current_len + para_len > max_chunk_chars and current_chunk_paragraphs:
                chunk_text = "\n\n".join(current_chunk_paragraphs)
                start_offset = normalized.find(current_chunk_paragraphs[0])
                end_offset = start_offset + len(chunk_text)

                chunks.append({
                    "chunk_index": chunk_idx,
                    "text": chunk_text,
                    "start_page": self.get_page_for_offset(normalized, max(0, start_offset)),
                    "end_page": self.get_page_for_offset(normalized, max(0, end_offset)),
                })
                chunk_idx += 1

                # Keep overlap paragraphs from end of chunk
                overlap_paragraphs: List[str] = []
                overlap_len = 0
                for p in reversed(current_chunk_paragraphs):
                    if overlap_len + len(p) <= overlap_chars:
                        overlap_paragraphs.insert(0, p)
                        overlap_len += len(p)
                    else:
                        break

                current_chunk_paragraphs = overlap_paragraphs
                current_len = overlap_len

            current_chunk_paragraphs.append(para)
            current_len += para_len

        # Append final chunk
        if current_chunk_paragraphs:
            chunk_text = "\n\n".join(current_chunk_paragraphs)
            start_offset = normalized.find(current_chunk_paragraphs[0])
            end_offset = start_offset + len(chunk_text)
            chunks.append({
                "chunk_index": chunk_idx,
                "text": chunk_text,
                "start_page": self.get_page_for_offset(normalized, max(0, start_offset)),
                "end_page": self.get_page_for_offset(normalized, max(0, end_offset)),
            })

        logger.info(f"Segmented long contract ({len(normalized)} chars) into {len(chunks)} bounded chunks")
        return chunks


contract_segmenter = ContractSegmenter()
