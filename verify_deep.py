import json, re
from collections import defaultdict

with open("audit_dump.json", "r") as f:
    data = json.load(f)

regs = data["regs"]
abstracts = data["abstracts"]

print("="*80)
print(f"TOTAL RAW REGISTRATIONS: {len(regs)}")
print(f"TOTAL RAW ABSTRACTS: {len(abstracts)}")
print("="*80)

def clean_text(t):
    if not t: return ""
    return re.sub(r"[^a-z0-9]", "", re.sub(r"^(dr\.|prof\.|mr\.|mrs\.|ms\.|er\.|lt\(dr\.\)|lt\.|shri|smt\.)\s*", "", str(t).lower())).strip()

# 1. Inspect Registration breakdown
reg_status_map = defaultdict(list)
for r in regs:
    d = r.get("data") or {}
    st = (d.get("payment_status") or r.get("status") or "unknown").lower()
    reg_status_map[st].append(r)

print("\n--- REGISTRATION STATUS BREAKDOWN ---")
for st, rows in reg_status_map.items():
    print(f"  {st.upper()}: {len(rows)} records")

# 2. Check duplicates in abstracts
title_groups = defaultdict(list)
for a in abstracts:
    # clean title
    t_clean = clean_text(a.get("title") or "")
    email = (a.get("email") or "").strip().lower()
    key = f"{email}::{t_clean[:50]}"
    title_groups[key].append(a)

duplicates = {k: v for k, v in title_groups.items() if len(v) > 1}
print(f"\n--- ABSTRACT DUPLICATE GROUPS ({len(duplicates)} groups found) ---")
total_duplicate_rows = 0
for k, rows in duplicates.items():
    total_duplicate_rows += len(rows) - 1
    print(f"  • Author: {rows[0].get('author_name')} | Email: {rows[0].get('email')} | Submissions: {len(rows)}x")
    print(f"    Title: {rows[0].get('title')[:70]}...")

print(f"\nTotal duplicate abstract rows to merge: {total_duplicate_rows}")
print(f"Total Unique Abstracts: {len(abstracts) - total_duplicate_rows}")

# 3. Check Registrations duplicates (same person registering multiple times)
email_regs = defaultdict(list)
phone_regs = defaultdict(list)
name_regs = defaultdict(list)

for r in regs:
    d = r.get("data") or {}
    em = (d.get("email") or r.get("email") or "").strip().lower()
    ph = re.sub(r"\D", "", (d.get("phone") or r.get("phone") or d.get("mobile") or ""))
    nm = clean_text(d.get("full_name") or d.get("name"))
    if em: email_regs[em].append(r)
    if ph and len(ph) >= 8: phone_regs[ph].append(r)
    if nm and len(nm) >= 4: name_regs[nm].append(r)

multi_regs = {}
for em, rows in email_regs.items():
    if len(rows) > 1:
        statuses = [ (r.get("data") or {}).get("payment_status") or r.get("status") for r in rows ]
        multi_regs[em] = statuses

print(f"\n--- MULTI-ORDER REGISTRANTS ({len(multi_regs)} people) ---")
for em, st_list in multi_regs.items():
    print(f"  • {em}: {st_list}")

# 4. Check Co-Author matches & Potential Missed Matches
paid_emails = set()
paid_phones = set()
paid_names = set()
paid_tickets = {}

for r in regs:
    d = r.get("data") or {}
    p_status = (d.get("payment_status") or r.get("status") or "").lower()
    is_paid = p_status in ["paid", "confirmed", "payment_claimed", "free_pass"]
    em = (d.get("email") or r.get("email") or "").strip().lower()
    ph = re.sub(r"\D", "", (d.get("phone") or r.get("phone") or d.get("mobile") or ""))
    nm = clean_text(d.get("full_name") or d.get("name"))
    reg_id_prefix = str(r["id"])[:5].upper()
    ticket_num = d.get("ticket_number") or d.get("ticketId") or f"ORP5IC-IND-{reg_id_prefix}"

    if is_paid:
        if em: paid_emails.add(em); paid_tickets[em] = ticket_num
        if ph and len(ph) >= 8: paid_phones.add(ph); paid_tickets[ph] = ticket_num
        if nm and len(nm) >= 4: paid_names.add(nm); paid_tickets[nm] = ticket_num

print("\n--- RECHECKING EVERY UNPAID ABSTRACT FOR HIDDEN MATCHES / CO-AUTHORS ---")
# Let's inspect the 41 unpaid abstracts to see if any author/co-author is registered under another name/email
unmatched_abs = []
for k, rows in title_groups.items():
    a = rows[0]
    em = (a.get("email") or "").strip().lower()
    ph = re.sub(r"\D", "", (a.get("phone") or ""))
    nm = clean_text(a.get("author_name") or a.get("full_name") or a.get("name"))
    
    is_paid = (em and em in paid_emails) or (ph and ph in paid_phones) or (nm and nm in paid_names)
    if not is_paid:
        unmatched_abs.append(a)

print(f"Total Unique Abstracts Unmatched (Pending Payment): {len(unmatched_abs)}")

print("\nListing All Unmatched (Pending Payment) Abstracts:")
for idx, a in enumerate(unmatched_abs, 1):
    auth = a.get("author_name") or a.get("full_name") or "Unknown"
    em = a.get("email") or "N/A"
    ph = a.get("phone") or "N/A"
    title = a.get("title") or "N/A"
    
    # Check if author name has partial match in paid_names
    partial_match = [p for p in paid_names if len(p) > 4 and (p in clean_text(auth) or clean_text(auth) in p)]
    hint = f" [POSSIBLE NAME MATCH: {partial_match}]" if partial_match else ""
    print(f"{idx:2d}. {auth:30s} | {em:32s} | {title[:45]}...{hint}")

