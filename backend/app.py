import re
from pathlib import Path
from flask import Flask, render_template, request, jsonify

BASE_DIR = Path(__file__).resolve().parent.parent

app = Flask(
    __name__,
    template_folder=str(BASE_DIR / "templates"),
    static_folder=str(BASE_DIR / "static")
)

def mask_digits_except_last4(value):
    """ซ่อนตัวเลขทุกหลัก ยกเว้น 4 หลักสุดท้าย โดยคงเครื่องหมายเดิม"""
    value = str(value or "")
    digits = re.sub(r"\D", "", value)
    hidden_count = max(0, len(digits) - 4)
    count = 0

    def replace_digit(match):
        nonlocal count
        count += 1
        if count <= hidden_count:
            return "X"
        return match.group(0)

    return re.sub(r"\d", replace_digit, value)


def mask_email(value):
    """แสดงอักษรตัวแรกและตัวสุดท้ายก่อน @"""
    value = str(value or "").strip()

    if "@" not in value:
        return value

    local, domain = value.rsplit("@", 1)

    if len(local) <= 2:
        masked_local = local[0] + "*" * max(0, len(local) - 1)
    else:
        masked_local = local[0] + "*" * (len(local) - 2) + local[-1]

    return masked_local + "@" + domain


def mask_dob(value):
    """ตัวอย่าง 25/12/2549 -> XX/XX/25XX"""
    value = str(value or "").strip()

    match = re.fullmatch(r"(\d{1,2})/(\d{1,2})/(\d{4})", value)

    if not match:
        return value

    year = match.group(3)
    return f"XX/XX/{year[:2]}XX"


def mask_address(address):
    if not address:
        return ""

    # Mask เฉพาะตัวเลขที่อยู่ต้นข้อความ
    return re.sub(r"^(\s*)\d+(?:/\d+)?(?=\s|$)", r"\1XXX", address)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/mask", methods=["POST"])
def mask_data():
    data = request.get_json(silent=True) or {}

    address_parts = [
        str(data.get("house_number", "")).strip(),
        str(data.get("soi", "")).strip(),
        str(data.get("road", "")).strip(),
        str(data.get("subdistrict", "")).strip(),
        str(data.get("district", "")).strip(),
        str(data.get("province", "")).strip(),
    ]

    address = " ".join(part for part in address_parts if part)

    result = {
        "credit_card": mask_digits_except_last4(data.get("credit_card", "")),
        "email": mask_email(data.get("email", "")),
        "phone": mask_digits_except_last4(data.get("phone", "")),
        "dob": mask_dob(data.get("dob", "")),
        "address": mask_address(address),
    }

    return jsonify(result)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)