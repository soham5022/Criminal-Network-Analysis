import re
from typing import Dict, List, Tuple, Any
import pandas as pd

REQUIRED_COLUMNS: Dict[str, List[str]] = {
    "people": ["person_id", "name"],
    "calls": ["call_id", "caller", "receiver", "timestamp"],
    "transactions": ["transaction_id", "from_account", "to_account", "amount", "timestamp"],
    "locations": ["location_id", "name"],
    "visits": ["visit_id", "person", "location", "timestamp"],
    "vehicles": ["vehicle_id", "registration", "owner"],
    "organizations": ["org_id", "name"]
}

def detect_csv_category(df: pd.DataFrame, filename: str) -> str:
    """Detects the category of CSV based on columns and filename."""
    cols = set([c.strip().lower() for c in df.columns])
    fn = filename.lower()

    if "caller" in cols and "receiver" in cols:
        return "calls"
    if "from_account" in cols and "to_account" in cols:
        return "transactions"
    if "location_id" in cols or ("name" in cols and "location" in fn):
        return "locations"
    if "visit_id" in cols or ("person" in cols and "location" in cols):
        return "visits"
    if "vehicle_id" in cols or "registration" in cols:
        return "vehicles"
    if "org_id" in cols or ("org" in fn and "name" in cols):
        return "organizations"
    if "person_id" in cols or ("name" in cols and ("people" in fn or "person" in fn)):
        return "people"
    
    # Fallback to filename matching
    for cat in REQUIRED_COLUMNS.keys():
        if cat in fn:
            return cat
            
    return "people"

def validate_csv_dataframe(df: pd.DataFrame, category: str) -> Tuple[bool, int, int, List[str]]:
    """
    Validates dataframe against expected schema.
    Returns: (is_valid, valid_rows_count, rejected_rows_count, error_messages)
    """
    errors: List[str] = []
    
    if df.empty:
        return False, 0, 0, ["CSV file is completely empty."]

    # Normalize column names
    df.columns = [c.strip().lower() for c in df.columns]
    
    req_cols = REQUIRED_COLUMNS.get(category, [])
    missing_cols = [c for c in req_cols if c not in df.columns]
    if missing_cols:
        errors.append(f"Missing required columns for category '{category}': {', '.join(missing_cols)}")
        return False, 0, len(df), errors

    initial_count = len(df)
    
    # Check for empty/null key values in first column
    primary_key = req_cols[0]
    valid_df = df.dropna(subset=[primary_key])
    
    # Clean whitespace
    valid_df = valid_df[valid_df[primary_key].astype(str).str.strip() != ""]

    # If transactions, validate positive amounts
    if category == "transactions" and "amount" in valid_df.columns:
        valid_df["amount"] = pd.to_numeric(valid_df["amount"], errors="coerce")
        valid_df = valid_df[valid_df["amount"].notnull() & (valid_df["amount"] > 0)]

    valid_count = len(valid_df)
    rejected_count = initial_count - valid_count
    
    if rejected_count > 0:
        errors.append(f"Rejected {rejected_count} malformed or incomplete records during validation.")

    return True, valid_count, rejected_count, errors
