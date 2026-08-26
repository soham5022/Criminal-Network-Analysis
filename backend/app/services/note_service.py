import datetime
from typing import List, Optional
from app.models.schemas import NoteSchema, NoteCreateRequest

class NoteService:
    def __init__(self):
        self._notes: List[NoteSchema] = []
        self._counter: int = 100
        self._seed_initial_notes()

    def _seed_initial_notes(self):
        base_time = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=2)
        self._counter += 1
        self._notes.append(NoteSchema(
            id=f"NOTE-{self._counter}",
            case_id="CASE-1024",
            entity_id="Person_044",
            author="Inspector Rajesh Verma",
            author_badge="MHA-INT-8902",
            content="Cross-community bridging pattern verified. Person_044 acts as the sole communication link between executive cell (Cluster 01) and logistics warehouse (Cluster 02).",
            created_at=base_time.isoformat()
        ))
        self._counter += 1
        self._notes.append(NoteSchema(
            id=f"NOTE-{self._counter}",
            case_id="CASE-1024",
            entity_id="Account_103",
            author="Inspector Rajesh Verma",
            author_badge="MHA-INT-8902",
            content="Sub-threshold structured transfers flagged beneath ₹50,000 threshold. Recommend formal FIU-IND enquiry on beneficiary accounts.",
            created_at=(base_time + datetime.timedelta(minutes=45)).isoformat()
        ))

    def add_note(
        self,
        case_id: str,
        note_req: NoteCreateRequest,
        author: str,
        author_badge: str
    ) -> NoteSchema:
        self._counter += 1
        note = NoteSchema(
            id=f"NOTE-{self._counter}",
            case_id=case_id,
            entity_id=note_req.entity_id,
            author=author,
            author_badge=author_badge,
            content=note_req.content.strip(),
            created_at=datetime.datetime.now(datetime.timezone.utc).isoformat()
        )
        self._notes.insert(0, note)
        return note

    def get_notes_for_case(self, case_id: str, entity_id: Optional[str] = None) -> List[NoteSchema]:
        results = [n for n in self._notes if n.case_id.lower() == case_id.lower()]
        if entity_id:
            results = [n for n in results if n.entity_id and n.entity_id.lower() == entity_id.lower()]
        return results

note_service = NoteService()
