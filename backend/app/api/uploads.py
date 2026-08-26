from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from typing import Optional
from ..models.schemas import UploadValidationResponse
from ..services.ingestion_service import ingestion_service

router = APIRouter(prefix="/uploads", tags=["Data Ingestion"])

@router.post("", response_model=UploadValidationResponse, summary="Ingest Investigation Dataset (CSV / Text)")
async def upload_dataset(
    file: UploadFile = File(...),
    case_id: Optional[str] = Form("CASE-1024")
):
    """
    Accepts raw multi-source investigation files (CDR logs, bank transfers, FIR sheets),
    validates headers & row schemas, and extracts entities into the knowledge graph.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Uploaded file must have a valid filename.")

    allowed_exts = [".csv", ".txt", ".json", ".tsv"]
    if not any(file.filename.lower().endswith(ext) for ext in allowed_exts):
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file format '{file.filename}'. Allowed formats: {', '.join(allowed_exts)}"
        )

    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if file.filename.lower().endswith(".txt"):
        res = ingestion_service.process_incident_text(content.decode("utf-8", errors="ignore"))
        return UploadValidationResponse(
            status="success",
            filename=file.filename,
            category="incident_narrative",
            records_received=1,
            records_valid=1,
            records_rejected=0,
            sample_entities=res["entities"][:5]
        )

    # Process CSV
    result = ingestion_service.process_csv_file(content, file.filename)
    if result["status"] == "error":
        raise HTTPException(status_code=422, detail=result["validation_errors"])

    return UploadValidationResponse(**result)
