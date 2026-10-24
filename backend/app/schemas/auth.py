"""
Axiom Authentication Schemas
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, description="Password must be at least 8 characters")
    name: str = Field(min_length=1, max_length=255)
    role: Optional[str] = Field(default="Principal Design Engineer")
    organization: Optional[str] = Field(default="Independent Studio")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserSafeResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    email: str
    name: str
    role: str
    organization: str
    avatar_url: Optional[str] = Field(default=None, serialization_alias="avatarUrl")
    created_at: Optional[datetime] = Field(default=None, serialization_alias="createdAt")


class TokenResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    token: str
    token_type: str = Field(default="bearer", serialization_alias="tokenType")
    user: UserSafeResponse
