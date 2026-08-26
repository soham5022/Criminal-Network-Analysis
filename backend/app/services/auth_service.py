from typing import Optional, Dict
from app.models.enums import UserRole
from app.models.schemas import UserSchema
from app.core.auth import hash_password, verify_password

class AuthService:
    def __init__(self):
        # Seeded synthetic accounts for SIH26189 prototype with hashed passwords
        self._users_db: Dict[str, Dict] = {
            "admin@mha.gov.in": {
                "id": "USR-DIR-001",
                "email": "admin@mha.gov.in",
                "hashed_password": hash_password("Admin@MHA2026!"),
                "name": "Director K. S. Menon",
                "role": UserRole.ADMIN,
                "badge_number": "MHA-DIR-001",
                "department": "Intelligence Directorate",
                "is_active": True
            },
            "rajesh.verma@mha.gov.in": {
                "id": "USR-INT-8902",
                "email": "rajesh.verma@mha.gov.in",
                "hashed_password": hash_password("Investigator@2026!"),
                "name": "Inspector Rajesh Verma",
                "role": UserRole.INVESTIGATOR,
                "badge_number": "MHA-INT-8902",
                "department": "Special Cyber & Financial Crimes Division",
                "is_active": True
            },
            "viewer@mha.gov.in": {
                "id": "USR-ANA-4011",
                "email": "viewer@mha.gov.in",
                "hashed_password": hash_password("Viewer@2026!"),
                "name": "Analyst Priya Nair",
                "role": UserRole.VIEWER,
                "badge_number": "MHA-ANA-4011",
                "department": "Crime Analytics & Pattern Unit",
                "is_active": True
            }
        }

    def authenticate(self, email: str, plain_password: str) -> Optional[UserSchema]:
        user_record = self._users_db.get(email.strip().lower())
        if not user_record:
            return None
        if not verify_password(plain_password, user_record["hashed_password"]):
            return None
        return UserSchema(
            id=user_record["id"],
            email=user_record["email"],
            name=user_record["name"],
            role=user_record["role"],
            badge_number=user_record["badge_number"],
            department=user_record["department"],
            is_active=user_record["is_active"]
        )

    def get_by_email(self, email: str) -> Optional[UserSchema]:
        user_record = self._users_db.get(email.strip().lower())
        if not user_record:
            return None
        return UserSchema(
            id=user_record["id"],
            email=user_record["email"],
            name=user_record["name"],
            role=user_record["role"],
            badge_number=user_record["badge_number"],
            department=user_record["department"],
            is_active=user_record["is_active"]
        )

auth_service = AuthService()
