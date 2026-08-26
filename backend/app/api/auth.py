from fastapi import APIRouter, HTTPException, Depends, status
from app.models.schemas import LoginRequest, TokenResponse, UserSchema
from app.models.enums import AuditAction
from app.services.auth_service import auth_service
from app.services.audit_service import audit_service
from app.core.auth import create_access_token
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
async def login(login_data: LoginRequest):
    user = auth_service.authenticate(login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    token = create_access_token(data={"sub": user.email, "role": user.role.value, "name": user.name})
    
    # Record audit log
    audit_service.log_action(
        user_email=user.email,
        user_name=user.name,
        user_role=user.role,
        action=AuditAction.LOGIN,
        details=f"User {user.name} ({user.role.value}) authenticated successfully via secure JWT."
    )

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=user
    )

@router.get("/me", response_model=UserSchema)
async def get_me(current_user: UserSchema = Depends(get_current_user)):
    return current_user
