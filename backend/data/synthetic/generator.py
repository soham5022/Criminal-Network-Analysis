import os
import random
import csv
from datetime import datetime, timedelta

def generate_synthetic_dataset(output_dir: str = None):
    if output_dir is None:
        output_dir = os.path.dirname(os.path.abspath(__file__))

    os.makedirs(output_dir, exist_ok=True)
    random.seed(42)

    base_time = datetime(2026, 8, 10, 8, 0, 0)

    # 1. People
    # 6-8 Community clusters:
    # Cluster 01 (Executive/Finance): P001 - P020
    # Cluster 02 (Logistics Dispatch): P021 - P043
    # Bridge Coordinator: P044
    # Cluster 03 (Northern Fleet & Warehousing): P045 - P075
    # Secondary Bridge: P078
    # Cluster 04 (Front Enterprise Shells): P079 - P115
    # Cluster 05 (Maritime & Transit Escort): P116 - P150
    # Cluster 06 (Peripheral Telephony): P151 - P250
    # Background nodes: P251 - P500
    people = []
    for i in range(1, 501):
        pid = f"P{i:03d}"
        pname = f"Person_{i:03d}"
        if i == 44: pname = "Person_044 (Delta Coordinator)"
        elif i == 1: pname = "Person_001 (Apex Lead)"
        elif i == 78: pname = "Person_078 (Vanguard Director)"
        elif i == 27: pname = "Person_027 (Fleet Lead)"
        elif i == 120: pname = "Person_120 (Maritime Liaison)"
        people.append({"person_id": pid, "name": pname})

    with open(os.path.join(output_dir, "people.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["person_id", "name"])
        writer.writeheader()
        writer.writerows(people)

    # 2. Locations
    locations = [
        {"location_id": "L001", "name": "Sector 4 Logistics Warehouse (Location_A)"},
        {"location_id": "L002", "name": "Terminal 2 Safehouse Facility (Location_B)"},
        {"location_id": "L003", "name": "Northern Expressway Toll Checkpoint"},
        {"location_id": "L004", "name": "Financial District Escrow Tower"},
        {"location_id": "L005", "name": "Industrial Port Berth 9 (Location_C)"}
    ]
    for i in range(6, 101):
        locations.append({"location_id": f"L{i:03d}", "name": f"Location_Site_{i:03d}"})

    with open(os.path.join(output_dir, "locations.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["location_id", "name"])
        writer.writeheader()
        writer.writerows(locations)

    # 3. Organizations
    orgs = [
        {"org_id": "Organization_X", "name": "Apex Maritime Holdings Ltd."},
        {"org_id": "Organization_Y", "name": "Vanguard Freight Global"},
        {"org_id": "Organization_Z", "name": "Krypton Financial Corp"},
        {"org_id": "Organization_Alpha", "name": "Metro Logistics Escrow"}
    ]
    for i in range(5, 51):
        orgs.append({"org_id": f"Org_{i:03d}", "name": f"Commercial Enterprise {i:03d}"})

    with open(os.path.join(output_dir, "organizations.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["org_id", "name"])
        writer.writeheader()
        writer.writerows(orgs)

    # 4. Vehicles
    vehicles = [
        {"vehicle_id": "Vehicle_017", "registration": "DL-08-CC-9017", "owner": "P027"},
        {"vehicle_id": "Vehicle_039", "registration": "MH-04-T-8821", "owner": "P078"},
        {"vehicle_id": "Vehicle_088", "registration": "HR-26-AB-1204", "owner": "P044"}
    ]
    for i in range(4, 76):
        vehicles.append({"vehicle_id": f"Vehicle_{i:03d}", "registration": f"DL-{i:02d}-AA-{random.randint(1000, 9999)}", "owner": f"P{random.randint(1, 500):03d}"})

    with open(os.path.join(output_dir, "vehicles.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["vehicle_id", "registration", "owner"])
        writer.writeheader()
        writer.writerows(vehicles)

    # 5. Calls (CDRs)
    # Deliberate structure:
    # High internal density within Cluster 01, Cluster 03, Cluster 05
    # High cross-community bridges through P044 and P078
    calls = []
    call_idx = 1

    # Dense Cluster 01 internal mesh
    for p1 in range(1, 15):
        for p2 in range(p1 + 1, min(p1 + 5, 16)):
            for _ in range(3):
                t = base_time + timedelta(minutes=random.randint(10, 2000))
                calls.append({"call_id": f"C{call_idx:04d}", "caller": f"P{p1:03d}", "receiver": f"P{p2:03d}", "timestamp": t.isoformat()})
                call_idx += 1

    # Dense Cluster 03 internal mesh
    for p1 in range(45, 60):
        for p2 in range(p1 + 1, min(p1 + 5, 61)):
            for _ in range(4):
                t = base_time + timedelta(minutes=random.randint(10, 2000))
                calls.append({"call_id": f"C{call_idx:04d}", "caller": f"P{p1:03d}", "receiver": f"P{p2:03d}", "timestamp": t.isoformat()})
                call_idx += 1

    # Bridge Nodes P044 & P078 multi-cluster cross-links
    bridge_pairs = [
        ("P001", "P044", 28),   # Cluster 01 <-> Bridge P044
        ("P014", "P044", 15),   # Cluster 01 <-> Bridge P044
        ("P044", "P078", 24),   # Bridge P044 <-> Bridge P078
        ("P044", "P052", 18),   # Bridge P044 <-> Cluster 03
        ("P044", "P057", 14),   # Bridge P044 <-> Cluster 03
        ("P044", "P120", 16),   # Bridge P044 <-> Cluster 05
        ("P078", "P027", 18),   # Bridge P078 <-> Cluster 02
        ("P078", "P081", 15),   # Bridge P078 <-> Cluster 04
        ("P078", "P093", 12),   # Bridge P078 <-> Cluster 04
        ("P120", "P131", 10)    # Cluster 05 internal
    ]

    for c_from, c_to, count in bridge_pairs:
        for _ in range(count):
            t = base_time + timedelta(minutes=random.randint(10, 4000))
            calls.append({"call_id": f"C{call_idx:04d}", "caller": c_from, "receiver": c_to, "timestamp": t.isoformat()})
            call_idx += 1

    # Background random calls
    for _ in range(300):
        c_from = f"P{random.randint(1, 150):03d}"
        c_to = f"P{random.randint(1, 150):03d}"
        if c_from != c_to:
            t = base_time + timedelta(minutes=random.randint(10, 5000))
            calls.append({"call_id": f"C{call_idx:04d}", "caller": c_from, "receiver": c_to, "timestamp": t.isoformat()})
            call_idx += 1

    with open(os.path.join(output_dir, "calls.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["call_id", "caller", "receiver", "timestamp"])
        writer.writeheader()
        writer.writerows(calls)

    # 6. Transactions
    # Smurfing loop: Account_103 disbursing structured payments
    transactions = [
        {"transaction_id": "T001", "from_account": "A103", "to_account": "A221", "amount": 48000, "timestamp": "2026-08-10T14:32:00"},
        {"transaction_id": "T002", "from_account": "A221", "to_account": "A340", "amount": 47500, "timestamp": "2026-08-10T15:10:00"},
        {"transaction_id": "T003", "from_account": "A103", "to_account": "Organization_X", "amount": 49000, "timestamp": "2026-08-11T09:15:00"},
        {"transaction_id": "T004", "from_account": "A001", "to_account": "A103", "amount": 49500, "timestamp": "2026-08-10T14:10:00"},
        {"transaction_id": "T005", "from_account": "A103", "to_account": "A088", "amount": 46500, "timestamp": "2026-08-10T16:00:00"},
        {"transaction_id": "T006", "from_account": "A103", "to_account": "A092", "amount": 48200, "timestamp": "2026-08-10T16:45:00"}
    ]
    for i in range(7, 300):
        f_acct = f"A{random.randint(1, 60):03d}"
        t_acct = f"A{random.randint(1, 60):03d}"
        if f_acct != t_acct:
            transactions.append({
                "transaction_id": f"T{i:04d}",
                "from_account": f_acct,
                "to_account": t_acct,
                "amount": random.randint(5000, 75000),
                "timestamp": (base_time + timedelta(hours=random.randint(1, 120))).isoformat()
            })

    with open(os.path.join(output_dir, "transactions.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["transaction_id", "from_account", "to_account", "amount", "timestamp"])
        writer.writeheader()
        writer.writerows(transactions)

    # 7. Visits (Surveillance)
    visits = [
        {"visit_id": "V001", "person": "P044", "location": "L001", "timestamp": "2026-08-10T11:15:00"},
        {"visit_id": "V002", "person": "P078", "location": "L001", "timestamp": "2026-08-10T11:20:00"},
        {"visit_id": "V003", "person": "P027", "location": "L002", "timestamp": "2026-08-10T15:30:00"},
        {"visit_id": "V004", "person": "P044", "location": "L002", "timestamp": "2026-08-11T18:00:00"},
        {"visit_id": "V005", "person": "P120", "location": "L005", "timestamp": "2026-08-12T09:00:00"}
    ]
    for i in range(6, 120):
        visits.append({
            "visit_id": f"V{i:04d}",
            "person": f"P{random.randint(1, 80):03d}",
            "location": f"L{random.randint(1, 15):03d}",
            "timestamp": (base_time + timedelta(hours=random.randint(1, 100))).isoformat()
        })

    with open(os.path.join(output_dir, "visits.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["visit_id", "person", "location", "timestamp"])
        writer.writeheader()
        writer.writerows(visits)

    # 8. Unstructured Incident Narrative
    incident_text = """INVESTIGATION INCIDENT INTELLIGENCE REPORT
Date: 26 August 2026 | Ref: FIR-289/Cyber-Crime
Surveillance intercept logs confirm that Person_044 contacted Person_078 near Sector 4 Logistics Warehouse (Location_A) using burner line Phone_021. 
Person_078 later transferred structured funds from Account_103 to Account_221.
Vehicle_017 was logged departing Gate 2 towards Terminal 2 Safehouse Facility (Location_B).
Corporate filing cross-match identifies Person_078 as authorized board representative for Apex Maritime Holdings Ltd. (Organization_X).
"""
    with open(os.path.join(output_dir, "incident_reports.txt"), "w", encoding="utf-8") as f:
        f.write(incident_text)

    print(f"Generated synthetic multi-cluster benchmark dataset in {output_dir}")

if __name__ == "__main__":
    generate_synthetic_dataset()
