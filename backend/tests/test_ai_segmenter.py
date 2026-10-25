"""
Axiom AI Contract Segmenter & Layout Tests
Verifies page parsing, whitespace normalization, clause segmentation,
detection of scanned documents, and bounded chunking.
"""

from ai.segmenter import contract_segmenter


def test_segmenter_detects_empty_input():
    status = contract_segmenter.detect_input_status("")
    assert status.is_valid is False
    assert status.status == "empty"
    assert status.char_count == 0


def test_segmenter_detects_scanned_notice():
    scanned_text = "[Scanned or image-based PDF document: 4 pages detected without embedded text layer]"
    status = contract_segmenter.detect_input_status(scanned_text)
    assert status.is_valid is False
    assert status.status == "scanned"
    assert status.page_count == 4
    assert "OCR" in status.message


def test_segmenter_normalizes_whitespace():
    raw = "Line 1   \r\n\r\n\r\n\r\nLine 2\twith tabs and\u00a0non-breaking spaces   \n"
    normalized = contract_segmenter.normalize_text(raw)
    assert "\r" not in normalized
    assert "\u00a0" not in normalized
    assert "Line 1\n\nLine 2" in normalized


def test_segmenter_parses_page_markers():
    text = (
        "--- PAGE 1 ---\n"
        "Section 1 • Services\nContractor shall build web application.\n\n"
        "--- PAGE 2 ---\n"
        "Section 2 • Payment\nInvoices payable in 30 days.\n"
    )
    pages = contract_segmenter.parse_pages(text)
    assert len(pages) == 2
    assert pages[0]["page_number"] == 1
    assert "Section 1" in pages[0]["text"]
    assert pages[1]["page_number"] == 2
    assert "Section 2" in pages[1]["text"]


def test_segmenter_page_offset_and_excerpt_lookup():
    text = (
        "--- PAGE 1 ---\n"
        "Introductory preamble.\n\n"
        "--- PAGE 2 ---\n"
        "Section 4.3 Payment Terms\n"
        "Invoices shall be payable within ninety days.\n\n"
        "--- PAGE 3 ---\n"
        "Section 9.1 Indemnification\n"
        "Contractor shall defend and hold harmless Client.\n"
    )
    page_pay = contract_segmenter.find_best_page_for_excerpt(text, "ninety days")
    assert page_pay == 2

    page_indem = contract_segmenter.find_best_page_for_excerpt(text, "defend and hold harmless")
    assert page_indem == 3

    page_missing = contract_segmenter.find_best_page_for_excerpt(text, "unrelated text not in contract", fallback_page=1)
    assert page_missing == 1


def test_segmenter_bounded_chunking_preserves_content():
    # Construct a long text exceeding 5,000 chars
    paragraphs = [f"Section {i} • Term clause text with detailed contractual provisions." for i in range(1, 100)]
    long_text = "\n\n".join(paragraphs)

    chunks = contract_segmenter.create_bounded_chunks(long_text, max_chunk_chars=1000, overlap_chars=200)
    assert len(chunks) > 1

    # Verify that the final paragraph is present in the final chunk (no silent truncation)
    assert "Section 99" in chunks[-1]["text"]
