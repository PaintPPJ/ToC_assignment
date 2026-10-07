from flask import Flask, request, jsonify, send_from_directory
import re

app = Flask(__name__)


# =========================================================
# Data Masking Functions
# =========================================================

def mask_credit_card(match):
    """
    1234-5678-9012-3456
    ->
    XXXX-XXXX-XXXX-3456
    """

    card = match.group(0)

    last_four = card[-4:]

    return f"XXXX-XXXX-XXXX-{last_four}"


def mask_email(match):
    """
    somchai@company.com
    ->
    s******d@company.com
    """

    username = match.group(1)
    domain = match.group(2)

    # กรณีชื่อมี 2 ตัวอักษร
    if len(username) == 1:
        masked_username = username + "*"

    elif len(username) == 2:
        masked_username = username[0] + "*"

    else:
        masked_username = (
            username[0]
            + "*" * (len(username) - 2)
            + username[-1]
        )

    return f"{masked_username}@{domain}"


def mask_phone(match):
    """
    093-245-7894
    ->
    XXX-XXX-7894
    """

    phone = match.group(0)

    return f"XXX-XXX-{phone[-4:]}"


def mask_dob(match):
    """
    DOB:25/12/2549
    ->
    DOB:XX/XX/25XX
    """

    prefix = match.group(1)
    year = match.group(4)

    return f"{prefix}XX/XX/{year[:2]}XX"


def mask_address(match):
    """
    Address: 689 ซอยลาดกระบัง 19
    ->
    Address: XXX ซอยลาดกระบัง 19
    """

    prefix = match.group(1)

    return f"{prefix}XXX"


# =========================================================
# Main Masking Function
# =========================================================

def mask_data(text):

    # -----------------------------------------------------
    # 1. Credit Card
    # -----------------------------------------------------

    text = re.sub(
        r"\b\d{4}-\d{4}-\d{4}-\d{4}\b",
        mask_credit_card,
        text
    )


    # -----------------------------------------------------
    # 2. Email
    # -----------------------------------------------------

    text = re.sub(
        r"\b([A-Za-z0-9])[A-Za-z0-9._%+-]*([A-Za-z0-9])@([A-Za-z0-9.-]+\.[A-Za-z]{2,})\b",
        lambda match: (
            match.group(1)
            + (
                "*" * (
                    len(
                        match.group(0).split("@")[0]
                    ) - 2
                )
            )
            + match.group(0).split("@")[0][-1]
            + "@"
            + match.group(3)
        ),
        text
    )


    # -----------------------------------------------------
    # 3. Phone Number
    # -----------------------------------------------------

    text = re.sub(
        r"\b\d{3}-\d{3}-\d{4}\b",
        mask_phone,
        text
    )


    # -----------------------------------------------------
    # 4. Date of Birth
    # -----------------------------------------------------

    text = re.sub(
        r"(?i)(DOB:)\s*(\d{2})/(\d{2})/(\d{4})",
        mask_dob,
        text
    )


    # -----------------------------------------------------
    # 5. Address
    # -----------------------------------------------------

    text = re.sub(
        r"(?i)(Address:\s*)\d+",
        mask_address,
        text
    )


    return text


# =========================================================
# Web Routes
# =========================================================

@app.route("/")
def index():

    return send_from_directory(
        "main",
        "main.html"
    )


@app.route("/mask", methods=["POST"])
def mask():

    data = request.get_json()

    if not data or "text" not in data:

        return jsonify({
            "error": "No text provided"
        }), 400


    input_text = data["text"]

    output_text = mask_data(input_text)


    return jsonify({
        "input": input_text,
        "output": output_text
    })


# =========================================================
# Run Server
# =========================================================

if __name__ == "__main__":

    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )