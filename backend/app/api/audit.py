from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from app.models.enums import AuditAction, UserRole
from app.models.schemas import AuditLogSchema, UserSchema
from app.services.audit_service import audit_service
from app.core.dependencies import require_role

router = APIRouter(prefix="/api/audit", tags=["Audit Trail"])

@router.get("", response_model=List[AuditLogSchema])
async def get_audit_logs(
    user_email: Optional[str] = Query(None, description="Filter by user email"),
    action: Optional[AuditAction] = Query(None, description="Filter by action type"),
    case_id: Optional[str] = Query(None, description="Filter by case ID"),
    limit: int = Query(100, ge=1, le=500),
    current_user: UserSchema = Depends(require_role([UserRole.ADMIN, UserRole.INVESTIGATOR]))
):
    return audit_service.get_logs(
        user_email=user_email,
        action=action,
        case_id=case_id,
        limit=limit
    )
