/*==================================================
SMARTBAZAAR PRO
EDIT ACCOUNT SYSTEM JAVASCRIPT
==================================================*/


/*==================================================
FIREBASE
==================================================*/

import {
    auth,
    database
} from "./firebase-config.js";


/*==================================================
FIREBASE AUTH
==================================================*/

import {
    onAuthStateChanged,
    updateProfile,
    sendEmailVerification,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


/*==================================================
FIREBASE REALTIME DATABASE
==================================================*/

import {
    ref,
    get,
    update
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


/*==================================================
CLOUDINARY CONFIG
==================================================*/

const cloudName =
    "jlrjn7lu";

const uploadPreset =
    "smartbazaar_uploads";


/*==================================================
CURRENT USER
==================================================*/

let currentUser = null;

let selectedPhotoFile = null;

let saving = false;


/*==================================================
DOM ELEMENTS
==================================================*/

const profileImage =
    document.getElementById(
        "profileImage"
    );

const profilePhotoPlaceholder =
    document.getElementById(
        "profilePhotoPlaceholder"
    );

const changePhotoBtn =
    document.getElementById(
        "changePhotoBtn"
    );

const uploadPhotoBtn =
    document.getElementById(
        "uploadPhotoBtn"
    );

const removePhotoBtn =
    document.getElementById(
        "removePhotoBtn"
    );

const profileImageInput =
    document.getElementById(
        "profileImageInput"
    );


/*==================================================
PERSONAL INFORMATION
==================================================*/

const fullName =
    document.getElementById(
        "fullName"
    );

const username =
    document.getElementById(
        "username"
    );

const email =
    document.getElementById(
        "email"
    );

const phone =
    document.getElementById(
        "phone"
    );


/*==================================================
EMAIL
==================================================*/

const emailStatus =
    document.getElementById(
        "emailStatus"
    );

const emailMessage =
    document.getElementById(
        "emailMessage"
    );

const verificationText =
    document.getElementById(
        "verificationText"
    );

const sendVerificationBtn =
    document.getElementById(
        "sendVerificationBtn"
    );


/*==================================================
ADDRESS
==================================================*/

const address =
    document.getElementById(
        "address"
    );

const city =
    document.getElementById(
        "city"
    );

const district =
    document.getElementById(
        "district"
    );

const province =
    document.getElementById(
        "province"
    );

const postalCode =
    document.getElementById(
        "postalCode"
    );

const defaultAddress =
    document.getElementById(
        "defaultAddress"
    );


/*==================================================
SECURITY
==================================================*/

const changePasswordBtn =
    document.getElementById(
        "changePasswordBtn"
    );


/*==================================================
NOTIFICATIONS
==================================================*/

const orderNotifications =
    document.getElementById(
        "orderNotifications"
    );

const promoNotifications =
    document.getElementById(
        "promoNotifications"
    );

const emailNotifications =
    document.getElementById(
        "emailNotifications"
    );


/*==================================================
SAVE / CANCEL
==================================================*/

const saveAccountBtn =
    document.getElementById(
        "saveAccountBtn"
    );

const cancelAccountBtn =
    document.getElementById(
        "cancelAccountBtn"
    );


/*==================================================
MESSAGE
==================================================*/

const accountMessage =
    document.getElementById(
        "accountMessage"
    );


/*==================================================
UTILITY
==================================================*/

function safeText(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(value);

}


/*==================================================
SHOW MESSAGE
==================================================*/

function showMessage(
    message,
    type = "success"
) {

    if (!accountMessage) {

        alert(message);

        return;

    }


    accountMessage.textContent =
        message;


    accountMessage.classList.add(
        "show"
    );


    if (type === "error") {

        accountMessage.style.background =
            "#dc2626";

    }
    else if (type === "warning") {

        accountMessage.style.background =
            "#d97706";

    }
    else {

        accountMessage.style.background =
            "#16a34a";

    }


    clearTimeout(
        showMessage.timer
    );


    showMessage.timer =
        setTimeout(
            function() {

                accountMessage.classList.remove(
                    "show"
                );

            },
            4000
        );

}


/*==================================================
BUTTON LOADING
==================================================*/

function buttonLoading(
    button,
    loading,
    text
) {

    if (!button) {

        return;

    }


    if (loading) {

        button.dataset.oldHTML =
            button.innerHTML;


        button.disabled =
            true;


        button.innerHTML =
            `<i class="fa-solid fa-spinner fa-spin"></i> ${text}`;

    }
    else {

        button.disabled =
            false;


        if (
            button.dataset.oldHTML
        ) {

            button.innerHTML =
                button.dataset.oldHTML;


            delete button.dataset.oldHTML;

        }

    }

}


/*==================================================
PROFILE IMAGE DISPLAY
==================================================*/

function displayProfileImage(
    imageURL
) {

    if (!profileImage) {

        return;

    }


    if (imageURL) {

        profileImage.src =
            imageURL;


        profileImage.style.display =
            "block";


        if (profilePhotoPlaceholder) {

            profilePhotoPlaceholder.style.display =
                "none";

        }

    }
    else {

        profileImage.removeAttribute(
            "src"
        );


        profileImage.style.display =
            "none";


        if (profilePhotoPlaceholder) {

            profilePhotoPlaceholder.style.display =
                "flex";

        }

    }

}


/*==================================================
OPEN FILE SELECTOR
==================================================*/

function openPhotoSelector() {

    if (profileImageInput) {

        profileImageInput.click();

    }

}


/*==================================================
CHANGE PHOTO BUTTON
==================================================*/

if (changePhotoBtn) {

    changePhotoBtn.addEventListener(
        "click",
        openPhotoSelector
    );

}


/*==================================================
UPLOAD PHOTO BUTTON
==================================================*/

if (uploadPhotoBtn) {

    uploadPhotoBtn.addEventListener(
        "click",
        openPhotoSelector
    );

}


/*==================================================
SELECT PHOTO
==================================================*/

if (profileImageInput) {

    profileImageInput.addEventListener(
        "change",
        function() {

            const file =
                this.files &&
                this.files[0];


            if (!file) {

                return;

            }


            if (
                !file.type ||
                !file.type.startsWith(
                    "image/"
                )
            ) {

                showMessage(
                    "Please select a valid image.",
                    "error"
                );


                this.value =
                    "";


                return;

            }


            const maxSize =
                10 * 1024 * 1024;


            if (file.size > maxSize) {

                showMessage(
                    "Image must be smaller than 10MB.",
                    "error"
                );


                this.value =
                    "";


                return;

            }


            selectedPhotoFile =
                file;


            /*====================================
            INSTANT PREVIEW
            ====================================*/

            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    displayProfileImage(
                        event.target.result
                    );

                };


            reader.readAsDataURL(
                file
            );


            showMessage(
                "Photo selected. Click Save Changes to save it."
            );

        }
    );

}


/*==================================================
REMOVE PROFILE PHOTO
==================================================*/

if (removePhotoBtn) {

    removePhotoBtn.addEventListener(
        "click",
        function() {

            selectedPhotoFile =
                null;


            if (profileImageInput) {

                profileImageInput.value =
                    "";

            }


            displayProfileImage(
                ""
            );


            showMessage(
                "Profile photo will be removed when you save."
            );

        }
    );

}


/*==================================================
CLOUDINARY UPLOAD
==================================================*/

async function uploadProfilePhoto(
    file
) {

    if (!file) {

        throw new Error(
            "No image selected."
        );

    }


    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    formData.append(
        "upload_preset",
        uploadPreset
    );


    const uploadURL =
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;


    const response =
        await fetch(
            uploadURL,
            {

                method:
                    "POST",

                body:
                    formData

            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data?.error?.message ||
            "Cloudinary upload failed."
        );

    }


    if (!data.secure_url) {

        throw new Error(
            "Cloudinary did not return an image URL."
        );

    }


    return data.secure_url;

}


/*==================================================
UPDATE EMAIL STATUS
==================================================*/

function updateEmailStatus(
    user
) {

    if (!user) {

        return;

    }


    if (user.emailVerified) {

        if (emailStatus) {

            emailStatus.classList.add(
                "verified"
            );


            emailStatus.innerHTML =
                `
                <i class="fa-solid fa-circle-check"></i>
                <span>Verified</span>
                `;

        }


        if (verificationText) {

            verificationText.textContent =
                "Your email address is verified and your account is protected.";

        }


        if (emailMessage) {

            emailMessage.textContent =
                "Your email address has been verified.";

        }


        if (sendVerificationBtn) {

            sendVerificationBtn.style.display =
                "none";

        }

    }
    else {

        if (emailStatus) {

            emailStatus.classList.remove(
                "verified"
            );


            emailStatus.innerHTML =
                `
                <i class="fa-solid fa-circle-xmark"></i>
                <span>Not Verified</span>
                `;

        }


        if (verificationText) {

            verificationText.textContent =
                "Your email address has not been verified yet.";

        }


        if (emailMessage) {

            emailMessage.textContent =
                "Please verify your email address for better account security.";

        }


        if (sendVerificationBtn) {

            sendVerificationBtn.style.display =
                "inline-flex";

        }

    }

}


/*==================================================
LOAD ACCOUNT DATA
==================================================*/

async function loadAccountData(
    user
) {

    try {

        const userRef =
            ref(
                database,
                "users/" +
                user.uid
            );


        const snapshot =
            await get(
                userRef
            );


        const data =
            snapshot.exists()
                ? snapshot.val()
                : {};


        /*========================================
        NAME
        ========================================*/

        if (fullName) {

            fullName.value =
                safeText(
                    data.name ||
                    user.displayName ||
                    ""
                );

        }


        /*========================================
        USERNAME
        ========================================*/

        if (username) {

            username.value =
                safeText(
                    data.username ||
                    ""
                )
                .replace(
                    /^@+/,
                    ""
                );

        }


        /*========================================
        EMAIL
        ========================================*/

        if (email) {

            email.value =
                safeText(
                    data.email ||
                    user.email ||
                    ""
                );

        }


        /*========================================
        PHONE
        ========================================*/

        if (phone) {

            phone.value =
                safeText(
                    data.phone ||
                    ""
                );

        }


        /*========================================
        PROFILE PHOTO
        ========================================*/

        const photoURL =
            safeText(
                data.photoURL ||
                user.photoURL ||
                ""
            );


        displayProfileImage(
            photoURL
        );


        /*========================================
        EMAIL STATUS
        ========================================*/

        updateEmailStatus(
            user
        );


        /*========================================
        ADDRESS
        ========================================*/

        const savedAddress =
            data.address ||
            {};


        if (address) {

            address.value =
                safeText(
                    savedAddress.address ||
                    ""
                );

        }


        if (city) {

            city.value =
                safeText(
                    savedAddress.city ||
                    ""
                );

        }


        if (district) {

            district.value =
                safeText(
                    savedAddress.district ||
                    ""
                );

        }


        if (province) {

            province.value =
                safeText(
                    savedAddress.province ||
                    ""
                );

        }


        if (postalCode) {

            postalCode.value =
                safeText(
                    savedAddress.postalCode ||
                    ""
                );

        }


        if (defaultAddress) {

            defaultAddress.checked =
                savedAddress.isDefault !== false;

        }


        /*========================================
        NOTIFICATIONS
        ========================================*/

        const notifications =
            data.notifications ||
            {};


        if (orderNotifications) {

            orderNotifications.checked =
                notifications.order !== false;

        }


        if (promoNotifications) {

            promoNotifications.checked =
                notifications.promotional !== false;

        }


        if (emailNotifications) {

            emailNotifications.checked =
                notifications.email !== false;

        }


        console.log(
            "Edit Account Data Loaded"
        );

    }
    catch(error) {

        console.error(
            "LOAD ACCOUNT ERROR:",
            error
        );


        showMessage(
            "Account information could not be loaded.",
            "error"
        );

    }

}


/*==================================================
SAVE ACCOUNT
==================================================*/

if (saveAccountBtn) {

    saveAccountBtn.addEventListener(
        "click",
        async function() {

            if (
                !currentUser ||
                saving
            ) {

                return;

            }


            /*====================================
            BASIC VALIDATION
            ====================================*/

            const name =
                safeText(
                    fullName?.value
                ).trim();


            const userName =
                safeText(
                    username?.value
                )
                .trim()
                .replace(
                    /^@+/,
                    ""
                );


            const phoneNumber =
                safeText(
                    phone?.value
                ).trim();


            if (!name) {

                showMessage(
                    "Please enter your full name.",
                    "error"
                );


                fullName?.focus();


                return;

            }


            if (
                userName &&
                !/^[a-zA-Z0-9._-]{3,30}$/.test(
                    userName
                )
            ) {

                showMessage(
                    "Username must contain 3–30 valid characters.",
                    "error"
                );


                username?.focus();


                return;

            }


            saving =
                true;


            buttonLoading(
                saveAccountBtn,
                true,
                "Saving..."
            );


            try {

                /*================================
                CURRENT PHOTO
                =================================*/

                let photoURL =
                    currentUser.photoURL ||
                    "";


                /*================================
                UPLOAD NEW PHOTO
                =================================*/

                if (selectedPhotoFile) {

                    photoURL =
                        await uploadProfilePhoto(
                            selectedPhotoFile
                        );

                }


                /*================================
                REMOVE PHOTO
                =================================*/

                if (
                    !selectedPhotoFile &&
                    profileImage &&
                    !profileImage.getAttribute(
                        "src"
                    )
                ) {

                    photoURL =
                        "";

                }


                /*================================
                ADDRESS OBJECT
                =================================*/

                const addressData = {

                    address:
                        safeText(
                            address?.value
                        ).trim(),

                    city:
                        safeText(
                            city?.value
                        ).trim(),

                    district:
                        safeText(
                            district?.value
                        ).trim(),

                    province:
                        safeText(
                            province?.value
                        ).trim(),

                    postalCode:
                        safeText(
                            postalCode?.value
                        ).trim(),

                    isDefault:
                        Boolean(
                            defaultAddress?.checked
                        )

                };


                /*================================
                NOTIFICATIONS OBJECT
                =================================*/

                const notificationData = {

                    order:
                        Boolean(
                            orderNotifications?.checked
                        ),

                    promotional:
                        Boolean(
                            promoNotifications?.checked
                        ),

                    email:
                        Boolean(
                            emailNotifications?.checked
                        )

                };


                /*================================
                FIREBASE DATABASE
                =================================*/

                const userRef =
                    ref(
                        database,
                        "users/" +
                        currentUser.uid
                    );


                await update(
                    userRef,
                    {

                        name:
                            name,

                        username:
                            userName,

                        email:
                            currentUser.email ||
                            safeText(
                                email?.value
                            ),

                        phone:
                            phoneNumber,

                        photoURL:
                            photoURL,

                        address:
                            addressData,

                        notifications:
                            notificationData,

                        updatedAt:
                            Date.now()

                    }
                );


                /*================================
                FIREBASE AUTH PROFILE
                =================================*/

                await updateProfile(
                    currentUser,
                    {

                        displayName:
                            name,

                        photoURL:
                            photoURL ||
                            null

                    }
                );


                /*================================
                UPDATE LOCAL PHOTO
                =================================*/

                displayProfileImage(
                    photoURL
                );


                selectedPhotoFile =
                    null;


                if (profileImageInput) {

                    profileImageInput.value =
                        "";

                }


                showMessage(
                    "Account changes saved successfully."
                );


                /*================================
                GO ACCOUNT PAGE
                =================================*/

                setTimeout(
                    function() {

                        window.location.href =
                            "account.html";

                    },
                    1000
                );

            }
            catch(error) {

                console.error(
                    "SAVE ACCOUNT ERROR:",
                    error
                );


                showMessage(
                    error?.message ||
                    "Could not save account changes.",
                    "error"
                );

            }
            finally {

                saving =
                    false;


                buttonLoading(
                    saveAccountBtn,
                    false
                );

            }

        }
    );

}


/*==================================================
REMOVE PHOTO STATE FIX
==================================================*/

if (removePhotoBtn) {

    removePhotoBtn.addEventListener(
        "click",
        function() {

            if (profileImageInput) {

                profileImageInput.value =
                    "";

            }

        }
    );

}


/*==================================================
EMAIL VERIFICATION
==================================================*/

if (sendVerificationBtn) {

    sendVerificationBtn.addEventListener(
        "click",
        async function() {

            if (!currentUser) {

                showMessage(
                    "Please login first.",
                    "error"
                );


                return;

            }


            if (
                currentUser.emailVerified
            ) {

                showMessage(
                    "Your email is already verified."
                );


                return;

            }


            buttonLoading(
                sendVerificationBtn,
                true,
                "Sending..."
            );


            try {

                await sendEmailVerification(
                    currentUser
                );


                showMessage(
                    "Verification email sent. Please check your inbox."
                );


                if (verificationText) {

                    verificationText.textContent =
                        "Verification email sent. Please check your inbox.";

                }

            }
            catch(error) {

                console.error(
                    "VERIFICATION ERROR:",
                    error
                );


                showMessage(
                    error?.message ||
                    "Could not send verification email.",
                    "error"
                );

            }
            finally {

                buttonLoading(
                    sendVerificationBtn,
                    false
                );

            }

        }
    );

}


/*==================================================
CHANGE PASSWORD
==================================================*/

if (changePasswordBtn) {

    changePasswordBtn.addEventListener(
        "click",
        async function() {

            if (
                !currentUser ||
                !currentUser.email
            ) {

                showMessage(
                    "Please login first.",
                    "error"
                );


                return;

            }


            const confirmed =
                confirm(
                    "A password reset email will be sent to your email. Continue?"
                );


            if (!confirmed) {

                return;

            }


            buttonLoading(
                changePasswordBtn,
                true,
                "Sending..."
            );


            try {

                await sendPasswordResetEmail(
                    auth,
                    currentUser.email
                );


                showMessage(
                    "Password reset email sent successfully."
                );

            }
            catch(error) {

                console.error(
                    "PASSWORD RESET ERROR:",
                    error
                );


                showMessage(
                    error?.message ||
                    "Could not send password reset email.",
                    "error"
                );

            }
            finally {

                buttonLoading(
                    changePasswordBtn,
                    false
                );

            }

        }
    );

}


/*==================================================
CANCEL
==================================================*/

if (cancelAccountBtn) {

    cancelAccountBtn.addEventListener(
        "click",
        function() {

            window.location.href =
                "account.html";

        }
    );

}


/*==================================================
SETTINGS BUTTON
==================================================*/

const settingsButton =
    document.querySelector(
        ".edit-settings-btn"
    );


if (settingsButton) {

    settingsButton.addEventListener(
        "click",
        function() {

            const notificationSection =
                orderNotifications?.closest(
                    ".edit-section-card"
                );


            if (notificationSection) {

                notificationSection.scrollIntoView({
                    behavior:
                        "smooth",

                    block:
                        "start"

                });

            }

        }
    );

}


/*==================================================
AUTH STATE
==================================================*/

onAuthStateChanged(
    auth,
    async function(user) {

        if (!user) {

            window.location.href =
                "login.html";


            return;

        }


        currentUser =
            user;


        /*========================================
        REFRESH AUTH USER
        ========================================*/

        try {

            await currentUser.reload();

        }
        catch(error) {

            console.warn(
                "AUTH RELOAD WARNING:",
                error
            );

        }


        currentUser =
            auth.currentUser ||
            user;


        /*========================================
        LOAD ACCOUNT
        ========================================*/

        await loadAccountData(
            currentUser
        );

    }
);


/*==================================================
REFRESH EMAIL STATUS
==================================================*/

window.addEventListener(
    "focus",
    async function() {

        if (!currentUser) {

            return;

        }


        try {

            await currentUser.reload();


            currentUser =
                auth.currentUser ||
                currentUser;


            updateEmailStatus(
                currentUser
            );

        }
        catch(error) {

            console.warn(
                "EMAIL STATUS ERROR:",
                error
            );

        }

    }
);


/*==================================================
MOBILE ORDERS
==================================================*/

const mobileBottomItems =
    document.querySelectorAll(
        ".mobile-bottom-item"
    );


if (
    mobileBottomItems &&
    mobileBottomItems.length >= 4
) {

    const ordersItem =
        mobileBottomItems[3];


    ordersItem.addEventListener(
        "click",
        function(event) {

            const href =
                ordersItem.getAttribute(
                    "href"
                );


            if (
                !href ||
                href === "#"
            ) {

                event.preventDefault();


                window.location.href =
                    "orders.html";

            }

        }
    );

}


/*==================================================
END
==================================================*/
