
const maskButton = document.getElementById("maskButton");

maskButton?.addEventListener("click", async () => {
    // อ่านค่าจากช่องกรอก
    const getValue = id =>
        document.getElementById(id)?.value?.trim() || "";

    // อ่านข้อความที่แสดงใน dropdown ที่เลือก
    const getSelectedText = id => {
        const select = document.getElementById(id);
        return select?.selectedOptions?.[0]?.value
            ? select.selectedOptions[0].text.trim()
            : "";
    };

    const payload = {
        credit_card: getValue("creditCard"),
        email: getValue("email"),
        phone: getValue("phone"),
        dob: getValue("dob"),
        house_number: getValue("houseNumber"),
        soi: getValue("soi"),
        road: getValue("road"),
        province: getSelectedText("province"),
        district: getSelectedText("district"),
        subdistrict: getSelectedText("subdistrict")
    };

    try {
        maskButton.disabled = true;
        maskButton.textContent = "กำลังประมวลผล...";

        const response = await fetch("/mask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        document.getElementById("resultCreditCard").textContent =
            result.credit_card;
        document.getElementById("resultEmail").textContent =
            result.email;
        document.getElementById("resultPhone").textContent =
            result.phone;
        document.getElementById("resultDob").textContent =
            result.dob;
        document.getElementById("resultAddress").textContent =
            result.address;

        document.getElementById("maskResult").hidden = false;
    } catch (error) {
        console.error("Data Masking error:", error);
        alert("ประมวลผลไม่สำเร็จ กรุณาตรวจสอบ Console");
    } finally {
        maskButton.disabled = false;
        maskButton.textContent = "แสดงผล Data Masking";
    }
});
