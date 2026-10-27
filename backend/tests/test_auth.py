"""
Axiom Authentication and Identity Tests
"""

from fastapi.testclient import TestClient


def test_register_success(client: TestClient):
    payload = {
        "email": "newuser@example.com",
        "password": "StrongPassword123!",
        "name": "New User",
        "role": "Design Lead",
        "organization": "Independent Labs",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "token" in data
    assert data["tokenType"] == "bearer"
    assert data["user"]["email"] == "newuser@example.com"
    assert data["user"]["name"] == "New User"


def test_register_duplicate_email(client: TestClient):
    payload = {
        "email": "duplicate@example.com",
        "password": "StrongPassword123!",
        "name": "Duplicate User",
    }
    res1 = client.post("/api/v1/auth/register", json=payload)
    assert res1.status_code == 201

    res2 = client.post("/api/v1/auth/register", json=payload)
    assert res2.status_code == 409
    data = res2.json()
    assert data["error"]["code"] == "EMAIL_ALREADY_EXISTS"


def test_login_success(client: TestClient):
    # Register first
    client.post(
        "/api/v1/auth/register",
        json={"email": "loginuser@example.com", "password": "Password123!", "name": "Login User"},
    )

    # Login
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "loginuser@example.com", "password": "Password123!"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["user"]["email"] == "loginuser@example.com"


def test_login_invalid_password(client: TestClient):
    client.post(
        "/api/v1/auth/register",
        json={"email": "wrongpwd@example.com", "password": "CorrectPassword123!", "name": "User"},
    )

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "wrongpwd@example.com", "password": "WrongPassword!"},
    )
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "INVALID_CREDENTIALS"


def test_get_me_authenticated(client: TestClient, auth_headers_a: dict):
    response = client.get("/api/v1/auth/me", headers=auth_headers_a)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "user_a@example.com"
    assert data["name"] == "Alice User"


def test_user_profile_get_and_update(client: TestClient, auth_headers_a: dict):
    # Get profile
    res_get = client.get("/api/v1/user/profile", headers=auth_headers_a)
    assert res_get.status_code == 200
    profile = res_get.json()
    assert profile["name"] == "Alice User"

    # Update profile
    updates = {
        "organization": "Updated Creative Studio",
        "riskSensitivity": "strict",
        "autoGenerateRedlines": True,
    }
    res_put = client.put("/api/v1/user/profile", json=updates, headers=auth_headers_a)
    assert res_put.status_code == 200
    updated = res_put.json()
    assert updated["organization"] == "Updated Creative Studio"
    assert updated["riskSensitivity"] == "strict"


def test_auth_cookie_flow(client: TestClient):
    # Register sets cookie
    reg_res = client.post(
        "/api/v1/auth/register",
        json={"email": "cookieuser@example.com", "password": "CookiePassword123!", "name": "Cookie User"},
    )
    assert reg_res.status_code == 201
    assert "access_token" in reg_res.cookies

    # Use cookie on /api/v1/auth/me without Authorization header
    client.cookies.set("access_token", reg_res.cookies["access_token"])
    me_res = client.get("/api/v1/auth/me")
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "cookieuser@example.com"

    # Logout clears cookie
    logout_res = client.post("/api/v1/auth/logout")
    assert logout_res.status_code == 200
    assert logout_res.json()["message"] == "Logged out successfully"
    set_cookie_header = logout_res.headers.get("set-cookie", "")
    assert "access_token" in set_cookie_header


def test_login_rate_limiting(client: TestClient):
    from backend.app.core.security import login_rate_limiter
    login_rate_limiter._attempts.clear()

    # Register user
    client.post(
        "/api/v1/auth/register",
        json={"email": "bruteforce@example.com", "password": "LegitPassword123!", "name": "Target"},
    )

    # Attempt 5 wrong passwords -> 401
    for i in range(5):
        res = client.post(
            "/api/v1/auth/login",
            json={"email": "bruteforce@example.com", "password": f"WrongPwd{i}!"},
        )
        assert res.status_code == 401

    # 6th attempt should be rate limited with 429
    res_limit = client.post(
        "/api/v1/auth/login",
        json={"email": "bruteforce@example.com", "password": "WrongPwdAgain!"},
    )
    assert res_limit.status_code == 429
    assert res_limit.json()["error"]["code"] == "TOO_MANY_ATTEMPTS"


def test_protected_routes_reject_unauthenticated(client: TestClient):
    client.cookies.clear()
    # Unauthenticated /documents
    doc_res = client.get("/api/v1/documents")
    assert doc_res.status_code == 401
    assert doc_res.json()["error"]["code"] == "UNAUTHORIZED"

    # Unauthenticated /user/profile
    prof_res = client.get("/api/v1/user/profile")
    assert prof_res.status_code == 401
    assert prof_res.json()["error"]["code"] == "UNAUTHORIZED"

    # Unauthenticated /auth/me
    me_res = client.get("/api/v1/auth/me")
    assert me_res.status_code == 401
    assert me_res.json()["error"]["code"] == "UNAUTHORIZED"

    # Invalid Bearer token
    bad_token_res = client.get("/api/v1/auth/me", headers={"Authorization": "Bearer invalid_token_123"})
    assert bad_token_res.status_code == 401
    assert bad_token_res.json()["error"]["code"] == "INVALID_TOKEN"

