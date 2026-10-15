const creditCardInput = document.getElementById("credit-card");
const creditCardError = document.getElementById("credit-card-error");

if (creditCardInput && creditCardError) {
    creditCardInput.addEventListener("input", () => {
        const rawValue = creditCardInput.value;

        // ตรวจว่ามีอักขระอื่นที่ไม่ใช่ตัวเลขหรือไม่
        const hasInvalidCharacters = /[^0-9\s-]/.test(rawValue);

        // เก็บเฉพาะตัวเลข 16 หลัก
        const digits = rawValue.replace(/\D/g, "").slice(0, 16);

        // สร้างขีดคั่นหลังตัวเลขทุก 4 หลัก
        const groups = digits.match(/\d{1,4}/g) || [];
        creditCardInput.value = groups.join("-");

        // แจ้งเตือน
        if (hasInvalidCharacters) {
            creditCardError.textContent =
                "กรุณาแก้ไขให้เป็นตัวเลขเท่านั้น";
        } else if (digits.length < 16) {
            creditCardError.textContent =
                "กรุณากรอกเลขบัตรเครดิตให้ครบ 16 หลัก";
        } else {
            creditCardError.textContent = "";
        }

        creditCardInput.classList.toggle(
            "invalid",
            creditCardError.textContent !== ""
        );
    });
}


/* ตรวจสอบเบอร์โทรศัพท์ */
const phoneInput = document.getElementById("phone");
const phoneError = document.getElementById("phone-error");

if (phoneInput && phoneError) {
    phoneInput.addEventListener("input", () => {
        // อนุญาตเฉพาะตัวเลข และไม่เกิน 10 หลัก
        phoneInput.value = phoneInput.value
            .replace(/\D/g, "")
            .slice(0, 10);

        const digits = phoneInput.value;

        if (digits.length === 0) {
            phoneError.textContent = "กรุณากรอกเบอร์โทรศัพท์";
        } else if (digits.length < 10) {
            phoneError.textContent =
                "กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก";
        } else {
            phoneError.textContent = "";
        }

        phoneInput.classList.toggle(
            "invalid",
            phoneError.textContent !== ""
        );
    });
}

/* ตรวจสอบรูปแบบอีเมล */
const emailInput = document.getElementById("email");
const emailError = document.getElementById("email-error");

if (emailInput && emailError) {
    emailInput.addEventListener("input", () => {
        const email = emailInput.value.trim();

        // ต้องมีชื่อผู้ใช้ @ โดเมน . และส่วนท้าย
        const emailPattern =
            /^[^\s@.]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

        if (email === "") {
            emailError.textContent = "กรุณากรอกอีเมล";
        } else if (!emailPattern.test(email)) {
            emailError.textContent =
                "กรุณากรอกอีเมลให้ถูกต้อง เช่น example@gmail.com";
        } else {
            emailError.textContent = "";
        }

        emailInput.classList.toggle(
            "invalid",
            emailError.textContent !== ""
        );
    });
}


const houseNumberInput = document.getElementById("house-number");

// สร้างข้อความแจ้งเตือนใต้ช่องเลขที่บ้าน
const houseNumberError = document.createElement("small");
houseNumberError.id = "house-number-error";
houseNumberError.className = "error-message";
houseNumberError.setAttribute("aria-live", "polite");
houseNumberInput.insertAdjacentElement("afterend", houseNumberError);

// ตรวจสอบข้อมูลขณะกรอก
houseNumberInput.addEventListener("input", () => {
    const value = houseNumberInput.value;

    // อนุญาตเฉพาะตัวเลข 0-9 และ /
    const hasInvalidCharacters = /[^0-9/]/.test(value);

    // ต้องมีตัวเลขอย่างน้อยหนึ่งตัว
    const hasNumber = /[0-9]/.test(value);

    if (hasInvalidCharacters) {
        houseNumberError.textContent =
            "กรุณากรอกเฉพาะตัวเลขและเครื่องหมาย / เท่านั้น";
    } else if (value.trim() !== "" && !hasNumber) {
        houseNumberError.textContent =
            "กรุณากรอกตัวเลขให้ถูกต้อง";
    } else {
        houseNumberError.textContent = "";
    }

    houseNumberInput.classList.toggle(
        "invalid",
        houseNumberError.textContent !== ""
    );
});


const birthdateInput = document.getElementById("birthdate");

if (birthdateInput) {
    flatpickr(birthdateInput, {
        locale: "th",
        dateFormat: "d/m/Y",
        allowInput: false,
        maxDate: "today",
        disableMobile: true,

        onReady: function (selectedDates, dateStr, instance) {
            updateThaiYear(instance);
        },

        onOpen: function (selectedDates, dateStr, instance) {
            updateThaiYear(instance);
        },

        onMonthChange: function (selectedDates, dateStr, instance) {
            updateThaiYear(instance);
        },

        onYearChange: function (selectedDates, dateStr, instance) {
            updateThaiYear(instance);
        },

        onChange: function (selectedDates) {
            if (selectedDates.length > 0) {
                const date = selectedDates[0];
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear() + 543;

                birthdateInput.value = `${day}/${month}/${year}`;
            }
        }
    });
}

function updateThaiYear(instance) {
    const yearInput = instance.currentYearElement;

    if (yearInput) {
        yearInput.value = Number(instance.currentYear) + 543;
        yearInput.setAttribute("aria-label", "ปี พ.ศ.");
    }
}






function updateThaiYear(instance) {
    const yearInput = instance.currentYearElement;

    if (yearInput) {
        yearInput.value = Number(instance.currentYear) + 543;
        yearInput.setAttribute("aria-label", "ปี พ.ศ.");
    }
}

(async function setupAddressDropdowns() {
    const provinceSelect = document.getElementById("province");
    const districtSelect = document.getElementById("district");
    const subdistrictSelect = document.getElementById("subdistrict");

    if (!provinceSelect || !districtSelect || !subdistrictSelect) {
        console.error("ไม่พบ select province, district หรือ subdistrict");
        return;
    }

    const base = "/static/data_address_thailand/";

    try {
        const files = [
            "province.json",
            "district.json",
            "sub_district.json"
        ];

        const responses = await Promise.all(
            files.map(file => fetch(base + file))
        );

        for (let i = 0; i < responses.length; i++) {
            if (!responses[i].ok) {
                throw new Error(
                    `${files[i]}: HTTP ${responses[i].status}`
                );
            }
        }

        const [provinceData, districtData, subdistrictData] =
            await Promise.all(responses.map(res => res.json()));

        const provinces = Array.isArray(provinceData)
            ? provinceData
            : provinceData.data;

        const districts = Array.isArray(districtData)
            ? districtData
            : districtData.data;

        const subdistricts = Array.isArray(subdistrictData)
            ? subdistrictData
            : subdistrictData.data;

        if (
            !Array.isArray(provinces) ||
            !Array.isArray(districts) ||
            !Array.isArray(subdistricts)
        ) {
            throw new Error("ข้อมูล JSON ไม่ได้อยู่ในรูปแบบ Array");
        }

        const getName = item =>
            item.name?.th ?? item.name_th ?? "";

        const getPrefix = item =>
            item.prefix?.th ?? item.prefix_th ?? "";

        function fillSelect(select, placeholder, items) {
            select.replaceChildren(new Option(placeholder, ""));

            items.forEach(item => {
                select.add(new Option(item.label, item.value));
            });
        }

        // แสดงรายชื่อจังหวัด
        const provinceOptions = provinces
            .filter(p => !p.deleted_at)
            .map(p => ({
                label: getName(p),
                value: String(p.id)
            }))
            .filter(p => p.label);

        fillSelect(
            provinceSelect,
            "เลือกจังหวัด",
            provinceOptions
        );

        fillSelect(districtSelect, "เลือกเขต / อำเภอ", []);
        fillSelect(subdistrictSelect, "เลือกแขวง / ตำบล", []);

        districtSelect.disabled = true;
        subdistrictSelect.disabled = true;

        // เลือกจังหวัด → แสดงอำเภอ/เขต
        provinceSelect.addEventListener("change", () => {
            const provinceId = provinceSelect.value;

            const options = districts
                .filter(d =>
                    !d.deleted_at &&
                    String(d.province_id) === provinceId
                )
                .map(d => ({
                    label: getPrefix(d) + getName(d),
                    value: String(d.id)
                }))
                .filter(d => d.label);

            fillSelect(
                districtSelect,
                "เลือกเขต / อำเภอ",
                options
            );

            fillSelect(subdistrictSelect, "เลือกแขวง / ตำบล", []);

            districtSelect.disabled = !provinceId;
            subdistrictSelect.disabled = true;

            console.log("จำนวนอำเภอ/เขต:", options.length);
        });

        // เลือกอำเภอ/เขต → แสดงตำบล/แขวง
        districtSelect.addEventListener("change", () => {
            const districtId = districtSelect.value;

            const options = subdistricts
                .filter(s =>
                    !s.deleted_at &&
                    String(s.district_id) === districtId
                )
                .map(s => ({
                    label: getPrefix(s) + getName(s),
                    value: String(s.id)
                }))
                .filter(s => s.label);

            fillSelect(
                subdistrictSelect,
                "เลือกแขวง / ตำบล",
                options
            );

            subdistrictSelect.disabled = !districtId;

            console.log("จำนวนตำบล/แขวง:", options.length);
        });

        console.log("โหลดข้อมูลที่อยู่สำเร็จ");
        console.log("จำนวนจังหวัด:", provinces.length);
        console.log("ตัวอย่างจังหวัด:", provinces[0]);

    } catch (error) {
        console.error("โหลดข้อมูลที่อยู่ไม่สำเร็จ:", error);
    }
})();
