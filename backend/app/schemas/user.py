"""
Axiom User Profile Schemas
Directly matches frontend UserProfile interface in src/types/contract.ts
"""

from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserProfileSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    name: str
    email: EmailStr
    role: str
    organization: str
    avatar_url: Optional[str] = Field(default=None, alias="avatarUrl")
    risk_sensitivity: str = Field(default="standard", alias="riskSensitivity")
    explanation_style: str = Field(default="plain_english", alias="explanationStyle")
    auto_generate_redlines: bool = Field(default=True, alias="autoGenerateRedlines")
    document_retention_days: int = Field(default=30, alias="documentRetentionDays")
    email_notifications: bool = Field(default=True, alias="emailNotifications")
    high_risk_alerts: bool = Field(default=True, alias="highRiskAlerts")


class UserProfileUpdateSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    organization: Optional[str] = None
    avatar_url: Optional[str] = Field(default=None, alias="avatarUrl")
    risk_sensitivity: Optional[str] = Field(default=None, alias="riskSensitivity")
    explanation_style: Optional[str] = Field(default=None, alias="explanationStyle")
    auto_generate_redlines: Optional[bool] = Field(default=None, alias="autoGenerateRedlines")
    document_retention_days: Optional[int] = Field(default=None, alias="documentRetentionDays")
    email_notifications: Optional[bool] = Field(default=None, alias="emailNotifications")
    high_risk_alerts: Optional[bool] = Field(default=None, alias="highRiskAlerts")
