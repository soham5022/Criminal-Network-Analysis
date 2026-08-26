from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Path
from app.models.enums import AuditAction, UserRole
from app.models.schemas import NoteSchema, NoteCreateRequest, UserSchema
from app.services.note_service import note_service
from app.services.audit_service import audit_service
from app.core.dependencies import get_current_user, require_role

router = APIRouter(prefix="/api/cases/{case_id}/notes", tags=["Investigation Notes"])

@router.get("", response_model=List[NoteSchema])
async def get_case_notes(
    case_id: str = Path(..., description="Case ID"),
    entity_id: Optional[str] = Query(None, description="Filter by entity ID"),
    current_user: UserSchema = Depends(get_current_user)
):
    return note_service.get_notes_for_case(case_id=case_id, entity_id=entity_id)

@router.post("", response_model=NoteSchema)
async def create_case_note(
    case_id: str = Path(..., description="Case ID"),
    note_req: NoteCreateRequest = ...,
    current_user: UserSchema = Depends(require_role([UserRole.INVESTIGATOR, UserRole.ADMIN]))
):
    note = note_service.add_note(
        case_id=case_id,
        note_req=note_req,
        author=current_user.name,
        author_badge=current_user.badge_number
    )

    # Log to audit trail
    audit_service.log_action(
        user_email=current_user.email,
        user_name=current_user.name,
        user_role=current_user.role,
        action=AuditAction.NOTE_CREATED,
        case_id=case_id,
        entity_id=note_req.entity_id,
        details=f"Investigator note created ({note.id}) on case {case_id}."
    )

    return note
