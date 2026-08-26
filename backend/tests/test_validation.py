import pandas as pd
from app.utils.validation import detect_csv_category, validate_csv_dataframe

def test_detect_csv_category():
    calls_df = pd.DataFrame({"call_id": ["C1"], "caller": ["P1"], "receiver": ["P2"], "timestamp": ["2026-08-10"]})
    assert detect_csv_category(calls_df, "telecom_dump.csv") == "calls"

    tx_df = pd.DataFrame({"transaction_id": ["T1"], "from_account": ["A1"], "to_account": ["A2"], "amount": [5000], "timestamp": ["2026-08-10"]})
    assert detect_csv_category(tx_df, "swift_stream.csv") == "transactions"

    people_df = pd.DataFrame({"person_id": ["P1"], "name": ["Person_001"]})
    assert detect_csv_category(people_df, "people_records.csv") == "people"

def test_validate_valid_csv():
    df = pd.DataFrame({
        "call_id": ["C1", "C2"],
        "caller": ["P001", "P044"],
        "receiver": ["P044", "P078"],
        "timestamp": ["2026-08-10T10:00:00", "2026-08-10T11:00:00"]
    })
    is_valid, valid_count, rejected_count, errors = validate_csv_dataframe(df, "calls")
    assert is_valid is True
    assert valid_count == 2
    assert rejected_count == 0
    assert len(errors) == 0

def test_validate_missing_columns():
    df = pd.DataFrame({"bad_col": ["1", "2"]})
    is_valid, valid_count, rejected_count, errors = validate_csv_dataframe(df, "calls")
    assert is_valid is False
    assert len(errors) > 0
    assert "Missing required columns" in errors[0]

def test_validate_empty_csv():
    df = pd.DataFrame()
    is_valid, _, _, errors = validate_csv_dataframe(df, "people")
    assert is_valid is False
    assert "empty" in errors[0].lower()
