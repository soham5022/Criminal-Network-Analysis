import io
import logging
import pandas as pd
from typing import Dict, Any, List
from .graph_service import graph_service
from .relationship_service import relationship_service, normalize_entity_id
from .nlp_service import nlp_service
from ..models.enums import EntityType, RelationshipType
from ..utils.validation import detect_csv_category, validate_csv_dataframe

logger = logging.getLogger("nexus-intel.ingestion_service")

class IngestionService:
    def process_csv_file(self, content_bytes: bytes, filename: str) -> Dict[str, Any]:
        """Validates and processes a CSV file into the graph."""
        try:
            df = pd.read_csv(io.BytesIO(content_bytes))
        except Exception as e:
            return {
                "status": "error",
                "filename": filename,
                "category": "unknown",
                "records_received": 0,
                "records_valid": 0,
                "records_rejected": 0,
                "validation_errors": [f"Could not parse CSV: {str(e)}"],
                "sample_entities": []
            }

        category = detect_csv_category(df, filename)
        is_valid, valid_count, rejected_count, errors = validate_csv_dataframe(df, category)

        if not is_valid:
            return {
                "status": "error",
                "filename": filename,
                "category": category,
                "records_received": len(df),
                "records_valid": 0,
                "records_rejected": len(df),
                "validation_errors": errors,
                "sample_entities": []
            }

        # Normalize column names
        df.columns = [c.strip().lower() for c in df.columns]
        sample_entities: List[Dict[str, Any]] = []

        # Process by category into the Graph
        if category == "people":
            for _, row in df.iterrows():
                pid = normalize_entity_id(row["person_id"])
                name = str(row.get("name", pid))
                graph_service.add_node(pid, name, EntityType.PERSON, {"alias": name})
                if len(sample_entities) < 5:
                    sample_entities.append({"id": pid, "name": name, "type": "PERSON"})

        elif category == "calls":
            for _, row in df.iterrows():
                caller = normalize_entity_id(row["caller"])
                receiver = normalize_entity_id(row["receiver"])
                
                # Ensure nodes exist
                graph_service.add_node(caller, caller, EntityType.PERSON)
                graph_service.add_node(receiver, receiver, EntityType.PERSON)
                
                rel = relationship_service.map_call_record(row.to_dict())
                graph_service.add_relationship(
                    source=rel["source"],
                    target=rel["target"],
                    rel_type=rel["type"],
                    rel_id=rel["id"],
                    timestamp=rel["timestamp"],
                    confidence=rel["confidence"],
                    source_type=rel["source_type"],
                    properties=rel.get("properties", {})
                )

        elif category == "transactions":
            for _, row in df.iterrows():
                from_acct = normalize_entity_id(row["from_account"])
                to_acct = normalize_entity_id(row["to_account"])
                
                graph_service.add_node(from_acct, from_acct, EntityType.ACCOUNT)
                graph_service.add_node(to_acct, to_acct, EntityType.ACCOUNT)

                rel = relationship_service.map_transaction_record(row.to_dict())
                graph_service.add_relationship(
                    source=rel["source"],
                    target=rel["target"],
                    rel_type=rel["type"],
                    rel_id=rel["id"],
                    timestamp=rel["timestamp"],
                    confidence=rel["confidence"],
                    source_type=rel["source_type"],
                    properties=rel.get("properties", {})
                )

        elif category == "locations":
            for _, row in df.iterrows():
                lid = normalize_entity_id(row["location_id"])
                name = str(row.get("name", lid))
                graph_service.add_node(lid, name, EntityType.LOCATION, {"location_name": name})

        elif category == "visits":
            for _, row in df.iterrows():
                person = normalize_entity_id(row["person"])
                loc = normalize_entity_id(row["location"])
                
                graph_service.add_node(person, person, EntityType.PERSON)
                graph_service.add_node(loc, loc, EntityType.LOCATION)

                rel = relationship_service.map_visit_record(row.to_dict())
                graph_service.add_relationship(
                    source=rel["source"],
                    target=rel["target"],
                    rel_type=rel["type"],
                    rel_id=rel["id"],
                    timestamp=rel["timestamp"],
                    confidence=rel["confidence"],
                    source_type=rel["source_type"],
                    properties=rel.get("properties", {})
                )

        elif category == "vehicles":
            for _, row in df.iterrows():
                vid = normalize_entity_id(row["vehicle_id"])
                reg = str(row.get("registration", vid))
                owner = normalize_entity_id(row.get("owner", ""))
                
                graph_service.add_node(vid, reg, EntityType.VEHICLE, {"registration": reg})
                if owner:
                    graph_service.add_node(owner, owner, EntityType.PERSON)
                    graph_service.add_relationship(owner, vid, RelationshipType.OWNED, f"own_{owner}_{vid}", confidence=0.95)

        elif category == "organizations":
            for _, row in df.iterrows():
                oid = str(row.get("org_id", row.get("name", "Org_X"))).strip()
                name = str(row.get("name", oid))
                graph_service.add_node(oid, name, EntityType.ORGANIZATION, {"name": name})

        # Recompute graph analytics
        graph_service.recompute_analytics()

        return {
            "status": "success",
            "filename": filename,
            "category": category,
            "records_received": len(df),
            "records_valid": valid_count,
            "records_rejected": rejected_count,
            "validation_errors": errors,
            "sample_entities": sample_entities
        }

    def process_incident_text(self, text: str) -> Dict[str, Any]:
        """Extracts entities and relationships from free-form text using NLP."""
        extracted_entities = nlp_service.extract_entities_from_text(text)
        
        # Add entities to graph
        for ent in extracted_entities:
            graph_service.add_node(ent["id"], ent["label"], EntityType(ent["type"]))

        # Extract co-occurrence relationships
        extracted_rels = relationship_service.extract_relationships_from_text(text, extracted_entities)
        for rel in extracted_rels:
            graph_service.add_relationship(
                source=rel["source"],
                target=rel["target"],
                rel_type=rel["type"],
                rel_id=rel["id"],
                timestamp=rel["timestamp"],
                confidence=rel["confidence"],
                source_type=rel["source_type"],
                properties=rel.get("properties", {})
            )

        graph_service.recompute_analytics()

        return {
            "status": "success",
            "entities_extracted_count": len(extracted_entities),
            "relationships_extracted_count": len(extracted_rels),
            "entities": extracted_entities,
            "relationships": extracted_rels
        }

ingestion_service = IngestionService()
