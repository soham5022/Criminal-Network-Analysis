import re
from typing import List, Dict, Any, Tuple
from ..models.enums import RelationshipType, EntityType

def normalize_entity_id(raw_id: str, default_type: str = "PERSON") -> str:
    """Standardizes IDs e.g. P001 -> Person_001, L001 -> Location_A, A103 -> Account_103."""
    val = str(raw_id).strip()
    if re.match(r'^P\d{3,4}$', val, re.I):
        return f"Person_{int(val[1:]):03d}"
    if re.match(r'^L\d{3,4}$', val, re.I):
        idx = int(val[1:])
        return f"Location_{chr(64 + idx) if idx <= 26 else idx}"
    if re.match(r'^A\d{3,4}$', val, re.I):
        return f"Account_{int(val[1:]):03d}"
    if re.match(r'^V\d{3,4}$', val, re.I):
        return f"Vehicle_{int(val[1:]):03d}"
    return val

class RelationshipService:
    def map_call_record(self, record: Dict[str, Any]) -> Dict[str, Any]:
        caller = normalize_entity_id(record.get("caller", ""))
        receiver = normalize_entity_id(record.get("receiver", ""))
        timestamp = str(record.get("timestamp", "2026-08-26T10:00:00"))
        call_id = str(record.get("call_id", f"C_{caller}_{receiver}"))

        return {
            "id": call_id,
            "source": caller,
            "target": receiver,
            "type": RelationshipType.CALLED,
            "timestamp": timestamp,
            "confidence": 0.96,
            "source_type": "CDR",
            "properties": {
                "duration": record.get("duration", "3m 45s"),
                "tower": record.get("tower", "Sector 14 North")
            }
        }

    def map_transaction_record(self, record: Dict[str, Any]) -> Dict[str, Any]:
        from_acct = normalize_entity_id(record.get("from_account", ""))
        to_acct = normalize_entity_id(record.get("to_account", ""))
        amount = float(record.get("amount", 0.0))
        timestamp = str(record.get("timestamp", "2026-08-26T14:00:00"))
        tx_id = str(record.get("transaction_id", f"T_{from_acct}_{to_acct}"))

        # Flag sub-threshold structuring anomaly (₹45k - ₹50k threshold)
        is_smurfing = (45000 <= amount <= 49999)

        return {
            "id": tx_id,
            "source": from_acct,
            "target": to_acct,
            "type": RelationshipType.TRANSFERRED,
            "timestamp": timestamp,
            "confidence": 0.99,
            "source_type": "BANKING_SWIFT",
            "amount": amount,
            "properties": {
                "amount": amount,
                "currency": "INR",
                "flagged_anomaly": is_smurfing,
                "notes": "Sub-threshold structured relay" if is_smurfing else "Standard Wire"
            }
        }

    def map_visit_record(self, record: Dict[str, Any]) -> Dict[str, Any]:
        person = normalize_entity_id(record.get("person", ""))
        location = normalize_entity_id(record.get("location", ""))
        timestamp = str(record.get("timestamp", "2026-08-26T11:00:00"))
        v_id = str(record.get("visit_id", f"V_{person}_{location}"))

        return {
            "id": v_id,
            "source": person,
            "target": location,
            "type": RelationshipType.VISITED,
            "timestamp": timestamp,
            "confidence": 0.94,
            "source_type": "SURVEILLANCE_LOG",
            "properties": {
                "location_name": location
            }
        }

    def extract_relationships_from_text(self, text: str, entities: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Extracts candidate relationships from sentences containing multiple entities."""
        rels: List[Dict[str, Any]] = []
        sentences = re.split(r'[.\n]+', text)

        for sent in sentences:
            sent_text = sent.strip()
            if not sent_text: continue
            
            # Find entities mentioned in this sentence
            mentioned = [e for e in entities if e["id"].lower() in sent_text.lower() or e["label"].lower() in sent_text.lower()]
            if len(mentioned) >= 2:
                for i in range(len(mentioned)):
                    for j in range(i + 1, len(mentioned)):
                        e1 = mentioned[i]
                        e2 = mentioned[j]
                        
                        rel_type = RelationshipType.ASSOCIATED_WITH
                        if re.search(r'\b(?:call|called|calling|phone|phoned|contact|contacted|spoke|dial|dialed)\b', sent_text, re.I):
                            rel_type = RelationshipType.CALLED
                        elif re.search(r'\b(?:transfer|transferred|transferring|paid|pay|sent|send|wire|wired|funds?)\b', sent_text, re.I):
                            rel_type = RelationshipType.TRANSFERRED
                        elif re.search(r'\b(?:visit|visited|visiting|near|at|warehouse|terminal|depot)\b', sent_text, re.I):
                            rel_type = RelationshipType.VISITED
                        elif re.search(r'\b(?:meet|met|meeting|rendezvous|gathered)\b', sent_text, re.I):
                            rel_type = RelationshipType.MET

                        rels.append({
                            "id": f"text_rel_{e1['id']}_{e2['id']}",
                            "source": e1["id"],
                            "target": e2["id"],
                            "type": rel_type,
                            "timestamp": "2026-08-26T18:00:00",
                            "confidence": 0.88,
                            "source_type": "INCIDENT_TEXT",
                            "properties": {"evidence_snippet": sent_text[:120]}
                        })

        return rels

relationship_service = RelationshipService()
