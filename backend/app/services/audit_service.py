import datetime
from typing import List, Optional
from app.models.enums import AuditAction, UserRole
from app.models.schemas import AuditLogSchema

class AuditService:
    def __init__(self):
        self._logs: List[AuditLogSchema] = []
        self._counter: int = 1000
        self._seed_initial_logs()

    def _seed_initial_logs(self):
        # Seed realistic baseline audit records for demonstrability
        base_time = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=4)
        
        self.log_action(
            user_email="rajesh.verma@mha.gov.in",
            user_name="Inspector Rajesh Verma",
            user_role=UserRole.INVESTIGATOR,
            action=AuditAction.LOGIN,
            details="User logged into NEXUS INTEL investigation console.",
            custom_time=(base_time + datetime.timedelta(minutes=10)).isoformat()
        )
        self.log_action(
            user_email="rajesh.verma@mha.gov.in",
            user_name="Inspector Rajesh Verma",
            user_role=UserRole.INVESTIGATOR,
            action=AuditAction.CASE_VIEWED,
            case_id="CASE-1024",
            details="Accessed case workspace for Operation Meridian.",
            custom_time=(base_time + datetime.timedelta(minutes=15)).isoformat()
        )
        self.log_action(
            user_email="rajesh.verma@mha.gov.in",
            user_name="Inspector Rajesh Verma",
            user_role=UserRole.INVESTIGATOR,
            action=AuditAction.ANALYSIS_COMPLETED,
            case_id="CASE-1024",
            details="Graph analytics & pattern detection engine executed successfully.",
            custom_time=(base_time + datetime.timedelta(minutes=25)).isoformat()
        )

    def log_action(
        self,
        user_email: str,
        user_name: str,
        user_role: UserRole,
        action: AuditAction,
        case_id: Optional[str] = None,
        entity_id: Optional[str] = None,
        details: str = "",
        custom_time: Optional[str] = None
    ) -> AuditLogSchema:
        self._counter += 1
        entry = AuditLogSchema(
            id=f"AUD-{self._counter}",
            timestamp=custom_time or datetime.datetime.now(datetime.timezone.utc).isoformat(),
            user_email=user_email,
            user_name=user_name,
            user_role=user_role,
            action=action,
            case_id=case_id,
            entity_id=entity_id,
            details=details
        )
        self._logs.insert(0, entry)  # Prepend for chronological descending
        return entry

    def get_logs(
        self,
        user_email: Optional[str] = None,
        action: Optional[AuditAction] = None,
        case_id: Optional[str] = None,
        limit: int = 100
    ) -> List[AuditLogSchema]:
        results = self._logs
        if user_email:
            results = [log for log in results if user_email.lower() in log.user_email.lower()]
        if action:
            results = [log for log in results if log.action == action]
        if case_id:
            results = [log for log in results if log.case_id and log.case_id.lower() == case_id.lower()]
        return results[:limit]

audit_service = AuditService()
