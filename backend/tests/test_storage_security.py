"""
Axiom Storage and Security Boundary Tests
"""

import pytest
from backend.app.core.errors import ValidationError
from backend.app.services.storage_service import storage_service


@pytest.mark.asyncio
async def test_path_traversal_prevention():
    malicious_keys = [
        "../../../etc/passwd",
        "..\\..\\windows\\system32",
        "/etc/shadow",
        "subfolder/../../secret.txt",
    ]

    for key in malicious_keys:
        with pytest.raises(ValidationError) as exc_info:
            await storage_service.save(content=b"exploit", safe_key=key, content_type="text/plain")
        assert exc_info.value.code in ["INVALID_STORAGE_KEY", "PATH_TRAVERSAL_DETECTED"]


def test_safe_key_generation():
    key1 = storage_service.generate_safe_key("My Confidential Contract.pdf")
    assert key1.endswith(".pdf")
    assert "/" not in key1
    assert "\\" not in key1

    key2 = storage_service.generate_safe_key("malicious.sh")
    assert key2.endswith(".bin")
