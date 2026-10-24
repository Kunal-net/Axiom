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
