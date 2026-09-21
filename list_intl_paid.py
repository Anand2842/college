import json, re

with open("audit_dump.json", "r") as f:
    data = json.load(f)

regs = data.get("regs") or []
abstracts = data.get("abstracts") or []

# Lookup from abstracts for missing phone numbers
abs_phone_by_email = {}
abs_phone_by_name = {}
for a in abstracts:
    em = (a.get("email") or "").strip().lower()
    nm = re.sub(r"[^a-z0-9]", "", (a.get("author_name") or a.get("name") or "").lower())
    ph = str(a.get("phone") or a.get("mobile") or "").strip()
    if em and ph:
        abs_phone_by_email[em] = ph
    if nm and ph:
        abs_phone_by_name[nm] = ph

paid_intl = []

for r in regs:
    d = r.get("data") or {}
    p_status = (d.get("payment_status") or r.get("status") or "").lower()
    is_paid = p_status in ["paid", "confirmed", "payment_claimed", "free_pass", "waived"]
    if not is_paid:
        continue

    country = (d.get("country") or r.get("country") or "").strip().upper()
    ticket = d.get("ticket_number") or d.get("ticketId") or f"ORP5IC-INT-{str(r['id'])[:5].upper()}"
    email = (d.get("email") or r.get("email") or "").strip()
    name = (d.get("full_name") or d.get("name") or "").strip()
    phone = str(d.get("phone") or r.get("phone") or d.get("mobile") or "").strip()
    inst = (d.get("institution") or d.get("affiliation") or "").strip()
    utr = d.get("utr_number") or d.get("payment_id") or d.get("transaction_id") or ""

    # Check if international
    is_intl = False
    detected_country = country

    if country and country not in ["INDIA", "IND", "IN", "BHARAT", "INDIAN"]:
        is_intl = True
    elif "INT" in ticket:
        is_intl = True
    elif phone.startswith("+") and not phone.startswith("+91"):
        is_intl = True
    elif email.endswith(".it") or "milano" in inst.lower() or "unimi" in inst.lower():
        is_intl = True
        detected_country = "ITALY"
    elif email.endswith(".br") or "volkmann" in inst.lower():
        is_intl = True
        detected_country = "BRAZIL"
    elif email.endswith(".jp") or "tohoku" in inst.lower() or "ibaraki" in inst.lower():
        is_intl = True
        detected_country = "JAPAN"
    elif email.endswith(".ph") or "cgiar.org" in email or "da.gov.ph" in email:
        is_intl = True
        detected_country = "PHILIPPINES"
    elif email.endswith(".np") or "tu.edu.np" in email:
        is_intl = True
        detected_country = "NEPAL"
    elif email.endswith(".es"):
        is_intl = True
        detected_country = "SPAIN"

    # Specific names known to be international
    clean_nm = re.sub(r"[^a-z0-9]", "", name.lower())
    if clean_nm in ["kumarashukarn", "ramnandanyadav"]:
        is_intl = True
        detected_country = "NEPAL"
        # add Nepal phone from abstract
        alt_phone = abs_phone_by_email.get(email.lower()) or abs_phone_by_name.get(clean_nm)
        if alt_phone:
            phone = f"{phone} / Nepal: {alt_phone}"

    if is_intl:
        # Standardize country name
        if detected_country in ["ITALIA", "ITALY"]: detected_country = "Italy 🇮🇹"
        elif detected_country in ["PHILIPPINES"]: detected_country = "Philippines 🇵🇭"
        elif detected_country in ["JAPAN"]: detected_country = "Japan 🇯🇵"
        elif detected_country in ["SPAIN"]: detected_country = "Spain 🇪🇸"
        elif detected_country in ["BRAZIL", "BRASIL"]: detected_country = "Brazil 🇧🇷"
        elif detected_country in ["NEPAL"]: detected_country = "Nepal 🇳🇵"
        else: detected_country = f"{detected_country} 🌐"

        paid_intl.append({
            "name": name,
            "country": detected_country,
            "phone": phone,
            "email": email,
            "ticket": ticket,
            "institution": inst,
            "utr": utr,
            "category": d.get("category") or "International Delegate"
        })

print(f"Total Verified Confirmed Paid International Delegates: {len(paid_intl)}")
print("\n" + "="*100)
for idx, p in enumerate(paid_intl, 1):
    print(f"{idx:2d}. {p['name']:32s} | {p['country']:16s} | Mobile: {p['phone']:30s} | Ticket: {p['ticket']}")
    print(f"    Email: {p['email']:35s} | Inst: {p['institution'][:45]}")
    if p['utr']:
        print(f"    Payment Reference / UTR: {p['utr']}")
    print("-" * 100)
