"""
Axiom Storage Service
Manages private contract file persistence with strict path traversal defenses.
"""

import os
from pathlib import Path
from typing import Optional, Protocol
import uuid

from backend.app.core.config import settings
from backend.app.core.errors import NotFoundError, ValidationError
from backend.app.core.logging import logger


class DocumentStorage(Protocol):
    async def save(self, *, content: bytes, safe_key: str, content_type: str) -> str:
        ...

    async def open(self, *, safe_key: str) -> bytes:
        ...

    async def delete(self, *, safe_key: str) -> bool:
        ...


class LocalDocumentStorage:
    def __init__(self, base_dir: Optional[str] = None):
        self.base_dir = Path(base_dir or settings.UPLOAD_DIR).resolve()
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def _resolve_safe_path(self, safe_key: str) -> Path:
        # Defend strictly against path traversal attacks (e.g. ../ or absolute paths)
        clean_key = os.path.basename(safe_key)
        if not clean_key or clean_key != safe_key or ".." in safe_key:
            raise ValidationError(message="Invalid or malicious storage key", code="INVALID_STORAGE_KEY")
        base = Path(self.base_dir).resolve()
        target_path = (base / clean_key).resolve()
        if not str(target_path).startswith(str(base)):
            raise ValidationError(message="Storage path traversal detected", code="PATH_TRAVERSAL_DETECTED")
        return target_path

    @staticmethod
    def generate_safe_key(original_filename: str) -> str:
        ext = Path(original_filename).suffix.lower()
        if ext not in [".pdf", ".docx", ".doc"]:
            ext = ".bin"
        return f"{uuid.uuid4().hex}{ext}"

    async def save(self, *, content: bytes, safe_key: str, content_type: str) -> str:
        target_path = self._resolve_safe_path(safe_key)
        try:
            target_path.write_bytes(content)
            logger.info(f"Safely persisted {len(content)} bytes to private storage key: {safe_key}")
            return safe_key
        except Exception as e:
            logger.error(f"Failed to write file to private storage: {e}")
            raise

    async def open(self, *, safe_key: str) -> bytes:
        target_path = self._resolve_safe_path(safe_key)
        if not target_path.exists() or not target_path.is_file():
            raise NotFoundError(message="Requested document file not found in storage", code="FILE_NOT_FOUND")
        return target_path.read_bytes()

    async def delete(self, *, safe_key: str) -> bool:
        target_path = self._resolve_safe_path(safe_key)
        if target_path.exists() and target_path.is_file():
            try:
                target_path.unlink()
                logger.info(f"Safely deleted private storage file: {safe_key}")
                return True
            except Exception as e:
                logger.error(f"Failed to delete storage file {safe_key}: {e}")
                return False
        return False


storage_service = LocalDocumentStorage()
