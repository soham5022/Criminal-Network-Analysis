from app.core.auth import hash_password, verify_password, create_access_token, decode_access_token
from app.services.auth_service import auth_service
from app.models.enums import UserRole

def test_password_hashing():
    pw = "Investigator@2026!"
    hashed = hash_password(pw)
    assert hashed != pw
    assert verify_password(pw, hashed) is True
    assert verify_password("WrongPassword!", hashed) is False

def test_jwt_token_roundtrip():
    data = {"sub": "rajesh.verma@mha.gov.in", "role": "INVESTIGATOR"}
    token = create_access_token(data)
    assert isinstance(token, str)
    
    payload = decode_access_token(token)
    assert payload is not None
    assert payload["sub"] == "rajesh.verma@mha.gov.in"
    assert payload["role"] == "INVESTIGATOR"

def test_auth_service_users():
    # Valid investigator login
    user = auth_service.authenticate("rajesh.verma@mha.gov.in", "Investigator@2026!")
    assert user is not None
    assert user.role == UserRole.INVESTIGATOR
    assert user.name == "Inspector Rajesh Verma"

    # Valid admin login
    admin = auth_service.authenticate("admin@mha.gov.in", "Admin@MHA2026!")
    assert admin is not None
    assert admin.role == UserRole.ADMIN

    # Invalid password
    assert auth_service.authenticate("admin@mha.gov.in", "WrongPw") is None
    # Invalid user
    assert auth_service.authenticate("unknown@mha.gov.in", "AnyPw") is None
