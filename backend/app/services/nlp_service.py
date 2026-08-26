import re
import logging
from typing import List, Dict, Any, Set
from ..models.enums import EntityType

logger = logging.getLogger("nexus-intel.nlp_service")

# Regex patterns for structured deterministic extraction
PATTERNS = {
    EntityType.PERSON: [
        r'\b(?:Person|Subject|Suspect)[_\s-]?([0-9]{3,4})\b',
        r'\b(?:P[0-9]{3,4})\b',
        r'\bPerson_[A-Za-z0-9_]+\b'
    ],
    EntityType.PHONE: [
        r'\bPhone[_\s-]?([0-9]{3,4})\b',
        r'\b(?:\+91|0)?[6-9][0-9]{9}\b',
        r'\b\+91-[0-9]{5}-[0-9]{5}\b'
    ],
    EntityType.ACCOUNT: [
        r'\b(?:Account|ACCT|Acct)[_\s-]?([A-Za-z0-9-]+)\b',
        r'\bA[0-9]{3,4}\b',
        r'\bACCT-[0-9]{4}-[0-9]{3}\b'
    ],
    EntityType.LOCATION: [
        r'\bLocation[_\s-]?([A-Za-z0-9_]+)\b',
        r'\bL[0-9]{3,4}\b',
        r'\b(?:Sector\s+[0-9]+|Terminal\s+[0-9]+|Warehouse\s+[A-Za-z0-9]+)\b'
    ],
    EntityType.ORGANIZATION: [
        r'\b(?:Organization|Org|Company)[_\s-]?([A-Za-z0-9_]+)\b',
        r'\b[A-Z][a-zA-Z]+\s+(?:Holdings|Enterprises|Logistics|Maritime|Corp|Ltd|Limited)\b'
    ],
    EntityType.VEHICLE: [
        r'\bVehicle[_\s-]?([0-9]{3,4})\b',
        r'\b(?:[A-Z]{2}[-\s]?[0-9]{2}[-\s]?[A-Z]{1,2}[-\s]?[0-9]{4})\b'
    ]
}

class NLPService:
    def __init__(self):
        self._nlp = None
        self._load_spacy()

    def _load_spacy(self):
        """Attempts to load spaCy language model, or falls back to blank model."""
        try:
            import spacy
            try:
                self._nlp = spacy.load("en_core_web_sm")
            except Exception:
                self._nlp = spacy.blank("en")
            logger.info("Loaded spaCy NLP pipeline.")
        except Exception as e:
            logger.warning(f"spaCy could not be initialized: {e}. Utilizing regex pattern matcher.")
            self._nlp = None

    def extract_entities_from_text(self, text: str) -> List[Dict[str, Any]]:
        """Extracts structured investigation entities from free-form text or incident reports."""
        extracted: List[Dict[str, Any]] = []
        seen_keys: Set[str] = set()

        # 1. Deterministic pattern matching (high precision on synthetic ID structures)
        for entity_type, pattern_list in PATTERNS.items():
            for pat in pattern_list:
                for match in re.finditer(pat, text, re.IGNORECASE):
                    matched_str = match.group(0).strip()
                    
                    # Normalize ID
                    norm_id = matched_str
                    if entity_type == EntityType.PERSON and re.match(r'^P\d{3,4}$', matched_str, re.I):
                        num_part = matched_str[1:]
                        norm_id = f"Person_{int(num_part):03d}"
                    elif entity_type == EntityType.LOCATION and re.match(r'^L\d{3,4}$', matched_str, re.I):
                        num_part = matched_str[1:]
                        norm_id = f"Location_{chr(64 + int(num_part)) if int(num_part) <= 26 else num_part}"
                    elif entity_type == EntityType.ACCOUNT and re.match(r'^A\d{3,4}$', matched_str, re.I):
                        num_part = matched_str[1:]
                        norm_id = f"Account_{int(num_part):03d}"

                    key = f"{entity_type.value}:{norm_id}"
                    if key not in seen_keys:
                        seen_keys.add(key)
                        extracted.append({
                            "id": norm_id,
                            "label": matched_str,
                            "type": entity_type.value,
                            "confidence": 0.95,
                            "start_char": match.start(),
                            "end_char": match.end()
                        })

        # 2. spaCy NER enhancements if available
        if self._nlp:
            try:
                doc = self._nlp(text)
                for ent in doc.ents:
                    etype = None
                    if ent.label_ in ["PERSON"]:
                        etype = EntityType.PERSON
                    elif ent.label_ in ["GPE", "LOC", "FAC"]:
                        etype = EntityType.LOCATION
                    elif ent.label_ in ["ORG"]:
                        etype = EntityType.ORGANIZATION
                    elif ent.label_ in ["MONEY"]:
                        etype = EntityType.ACCOUNT

                    if etype:
                        key = f"{etype.value}:{ent.text}"
                        if key not in seen_keys and len(ent.text) > 2:
                            seen_keys.add(key)
                            extracted.append({
                                "id": ent.text.replace(" ", "_"),
                                "label": ent.text,
                                "type": etype.value,
                                "confidence": 0.88,
                                "start_char": ent.start_char,
                                "end_char": ent.end_char
                            })
            except Exception as e:
                logger.debug(f"spaCy doc parsing note: {e}")

        return extracted

nlp_service = NLPService()
