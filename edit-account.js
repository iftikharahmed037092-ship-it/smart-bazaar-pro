// Firebase اور Cloudinary کی سیٹنگز یہاں شامل کریں
// (اگر آپ کی فائل میں پہلے سے Firebase امپورٹ ہے تو صرف لاجک استعمال کریں)

document.addEventListener("DOMContentLoaded", function () {
    
    // 1. Toast Notification Function
    function showMessage(text, isError = false) {
        let msgBox = document.querySelector(".account-message");
        if (!msgBox) {
            msgBox = document.createElement("div");
            msgBox.className = "account-message";
            document.body.appendChild(msgBox);
        }
        msgBox.textContent = text;
        msgBox.style.background = isError ? "#dc2626" : "#2e7d32";
        msgBox.classList.add("show");

        setTimeout(() => {
            msgBox.classList.remove("show");
        }, 3000);
    }

    // 2. DOM Elements
    const photoInput = document.getElementById("profile-photo-input") || createHiddenFileInput();
    const profilePhotoContainer = document.querySelector(".profile-photo");
    const profileImg = profilePhotoContainer ? profilePhotoContainer.querySelector("img") : null;
    const changePhotoBtns = document.querySelectorAll(".change-photo-btn, .photo-change-action");
    const removePhotoBtn = document.querySelector(".photo-remove-action");
    const saveBtn = document.querySelector(".save-account-btn");
    
    let uploadedImageUrl = ""; // کلاؤڈنری کا لنک یہاں محفوظ ہوگا

    function createHiddenFileInput() {
        const input = document.createElement("input");
        input.type = "file";
        input.id = "profile-photo-input";
        input.accept = "image/*";
        input.style.display = "none";
        document.body.appendChild(input);
        return input;
    }

    // بٹن کلک پر گیلری کھلنا
    changePhotoBtns.forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            photoInput.click();
        });
    });

    // 3. Cloudinary پر تصویر اپلوڈ کرنے کا فنکشن
    photoInput.addEventListener("change", async function (e) {
        const file = e.target.files[0];
        if (!file) return;

        // پہلے لوکل پریویو دکھائیں تاکہ یوزر کو فوری رسپانس ملے
        const reader = new FileReader();
        reader.onload = function (event) {
            if (profileImg) {
                profileImg.src = event.target.result;
                profilePhotoContainer.classList.add("has-image");
            }
        };
        reader.readAsDataURL(file);

        showMessage("تصویر اپلوڈ ہو رہی ہے، براہ کرم انتظار کریں...");

        // اب Cloudinary پر اپلوڈ کریں
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "YAHAN_APNA_CLOUDINARY_UPLOAD_PRESET_ LIKHEIN"); // اپنا کلاؤڈنری پری سیٹ یہاں لکھیں

        try {
            const cloudName = "YAHAN_APNA_CLOUD_NAME_LIKHEIN"; // اپنا کلاؤڈ نیم یہاں لکھیں
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: formData
            });
            const data = await response.json();
            
            if (data.secure_url) {
                uploadedImageUrl = data.secure_url; // یہ ہے وہ پکا لنک جو فائر بیس میں سیو ہوگا
                showMessage("تصویر کامیابی سے کلاؤڈنری پر اپلوڈ ہو گئی!");
            } else {
                throw new Error("اپلوڈ ناکام ہو گیا");
            }
        } catch (error) {
            console.error(error);
            showMessage("تصویر اپلوڈ کرنے میں خرابی پیش آئی!", true);
        }
    });

    // تصویر ہٹانے کا بٹن
    if (removePhotoBtn) {
        removePhotoBtn.addEventListener("click", function (e) {
            e.preventDefault();
            if (profileImg) {
                profileImg.src = "";
                profilePhotoContainer.classList.remove("has-image");
                photoInput.value = "";
                uploadedImageUrl = "";
                showMessage("پروفائل تصویر ہٹا دی گئی ہے۔");
            }
        });
    }

    // 4. پیج لوڈ ہونے پر فائر بیس سے ڈیٹا (اور تصویر کا پرانا لنک) لانا تاکہ ریفریش پر غائب نہ ہو
    async function loadUserDataFromFirebase() {
        // یہاں فائر بیس سے یوزر کا ڈیٹا گیٹ کرنے کا کوڈ آئے گا
        // مثال کے طور پر:
        // const userId = firebase.auth().currentUser.uid;
        // const doc = await firebase.firestore().collection("users").doc(userId).get();
        // if (doc.exists) {
        //     const data = doc.data();
        //     document.getElementById("name-input").value = data.name || "";
        //     if (data.profileImage) {
        //         profileImg.src = data.profileImage;
        //         profilePhotoContainer.classList.add("has-image");
        //         uploadedImageUrl = data.profileImage;
        //     }
        // }
    }
    
    // loadUserDataFromFirebase(); // جب فائر بیس کنیکٹ ہو تو اسے ان کممنٹ کر دیں

    // 5. فائر بیس میں تمام ڈیٹا (بشمول کلاؤڈنری تصویر کا لنک) سیو کرنا
    if (saveBtn) {
        saveBtn.addEventListener("click", async function (e) {
            e.preventDefault();

            // فارم کی فیلڈز کا ڈیٹا حاصل کریں
            const fullName = document.querySelector('input[name="full_name"]')?.value || "";
            const phone = document.querySelector('input[name="phone"]')?.value || "";
            const email = document.querySelector('input[name="email"]')?.value || "";
            const gender = document.querySelector('select[name="gender"]')?.value || "";

            try {
                showMessage("ڈیٹا محفوظ کیا جا رہا ہے...");

                // فائر بیس فائر اسٹور میں سیو کرنے کا کوڈ
                /*
                const userId = firebase.auth().currentUser.uid;
                await firebase.firestore().collection("users").doc(userId).set({
                    fullName: fullName,
                    phone: phone,
                    email: email,
                    gender: gender,
                    profileImage: uploadedImageUrl, // کلاؤڈنری کا لنک یہاں فائر بیس میں سیو ہو رہا ہے
                    updatedAt: new Date()
                }, { merge: true });
                */

                setTimeout(() => {
                    showMessage("آپ کی تبدیلیاں اور پروفائل تصویر کامیابی سے محفوظ کر دی گئی ہیں!");
                }, 1000);

            } catch (error) {
                console.error(error);
                showMessage("ڈیٹا محفوظ کرنے میں مسئلہ پیش آیا!", true);
            }
        });
    }

    // Cancel Button Action
    const cancelBtn = document.querySelector(".cancel-account-btn");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", function (e) {
            e.preventDefault();
            if (confirm("کیا آپ واقعی تبدیلیاں منسوخ کرنا چاہتے ہیں؟")) {
                location.reload();
            }
        });
    }
});
