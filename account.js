/*==================================================
SMARTBAZAAR PRO
ACCOUNT SYSTEM JAVASCRIPT
PART — ACCOUNT PAGE
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
    signOut,
    updateProfile
}
from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


/*==================================================
FIREBASE REALTIME DATABASE
==================================================*/

import {
    ref,
    get,
    set,
    update
}
from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


/*==================================================
CLOUDINARY CONFIG
==================================================*/

const cloudName =
    "jlrjn7lu";

const uploadPreset =
    "smartbazaar_uploads";


/*==================================================
DOM ELEMENTS
==================================================*/

const profileImage =
    document.getElementById("profile-image");

const changeProfileImage =
    document.getElementById(
        "change-profile-image"
    );

const profileName =
    document.getElementById("profile-name");

const profileUsername =
    document.getElementById(
        "profile-username"
    );

const profileEmail =
    document.getElementById("profile-email");

const accountStatus =
    document.getElementById(
        "account-status"
    );

const editProfileButton =
    document.getElementById(
        "edit-profile-button"
    );

const ordersCount =
    document.getElementById(
        "orders-count"
    );

const productsCount =
    document.getElementById(
        "products-count"
    );

const projectsCount =
    document.getElementById(
        "projects-count"
    );

const downloadsCount =
    document.getElementById(
        "downloads-count"
    );

const logoutButton =
    document.getElementById(
        "logout-button"
    );

const backButton =
    document.getElementById(
        "account-back-button"
    );

const settingsButton =
    document.getElementById(
        "account-settings-button"
    );

const addMoneyButton =
    document.getElementById(
        "add-money-button"
    );

const withdrawButton =
    document.getElementById(
        "withdraw-button"
    );

const walletHistoryButton =
    document.getElementById(
        "wallet-history-button"
    );

const walletBalance =
    document.querySelector(
        ".wallet-balance strong"
    );

const createWebsiteButton =
    document.getElementById(
        "create-website-button"
    );

const actionEditor =
    document.getElementById(
        "action-editor"
    );

const browseProductsButton =
    document.getElementById(
        "browse-products-button"
    );

const bottomHome =
    document.getElementById(
        "bottom-home"
    );

const bottomProducts =
    document.getElementById(
        "bottom-products"
    );

const bottomCreate =
    document.getElementById(
        "bottom-create"
    );

const bottomOrders =
    document.getElementById(
        "bottom-orders"
    );

const bottomAccount =
    document.getElementById(
        "bottom-account"
    );


/*==================================================
CURRENT USER
==================================================*/

let currentUser =
    null;


/*==================================================
SELECTED PROFILE IMAGE
==================================================*/

let selectedProfileFile =
    null;


/*==================================================
DEFAULT PROFILE IMAGE
==================================================*/

const defaultProfileImage =
    "https://via.placeholder.com/120";


/*==================================================
UTILITY — SAFE TEXT
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
SHOW LOADING
==================================================*/

function showProfileLoading() {

    if (profileName) {

        profileName.textContent =
            "Loading...";

    }

    if (profileUsername) {

        profileUsername.textContent =
            "";

    }

    if (profileEmail) {

        profileEmail.textContent =
            "";

    }

}


/*==================================================
LOAD USER DATA
==================================================*/

async function loadUserData(user) {

    if (!user) {

        return;

    }


    try {

        const userRef =
            ref(
                database,
                "users/" + user.uid
            );


        const snapshot =
            await get(userRef);


        let userData =
            snapshot.exists()
                ? snapshot.val()
                : {};


        /*========================================
        FIREBASE AUTH DATA
        ========================================*/

        const authName =
            user.displayName ||
            "";


        const authEmail =
            user.email ||
            "";


        /*========================================
        PROFILE NAME
        ========================================*/

        const name =
            userData.name ||
            authName ||
            "SmartBazaar User";


        if (profileName) {

            profileName.textContent =
                name;

        }


        /*========================================
        USERNAME
        ========================================*/

        const username =
            userData.username ||
            "";


        if (profileUsername) {

            if (username) {

                profileUsername.textContent =
                    username.startsWith("@")
                        ? username
                        : "@" + username;

            }
            else {

                profileUsername.textContent =
                    "@user";

            }

        }


        /*========================================
        EMAIL
        ========================================*/

        if (profileEmail) {

            profileEmail.textContent =
                userData.email ||
                authEmail ||
                "No email";

        }


        /*========================================
        PROFILE IMAGE
        ========================================*/

        const image =
            userData.photoURL ||
            user.photoURL ||
            defaultProfileImage;


        if (profileImage) {

            profileImage.src =
                image;

        }


        /*========================================
        ACCOUNT STATUS
        ========================================*/

        if (accountStatus) {

            if (user.emailVerified) {

                accountStatus.textContent =
                    "✓ Verified Account";

                accountStatus.classList.add(
                    "verified-status"
                );

            }
            else {

                accountStatus.textContent =
                    "○ Email Not Verified";

            }

        }


        /*========================================
        STATISTICS
        ========================================*/

        const stats =
            userData.stats || {};


        if (ordersCount) {

            ordersCount.textContent =
                Number(
                    stats.orders || 0
                );

        }


        if (productsCount) {

            productsCount.textContent =
                Number(
                    stats.products || 0
                );

        }


        if (projectsCount) {

            projectsCount.textContent =
                Number(
                    stats.projects || 0
                );

        }


        if (downloadsCount) {

            downloadsCount.textContent =
                Number(
                    stats.downloads || 0
                );

        }


        /*========================================
        WALLET
        ========================================*/

        const wallet =
            userData.wallet || {};


        const balance =
            Number(
                wallet.balance || 0
            );


        if (walletBalance) {

            walletBalance.textContent =
                "Rs. " +
                balance.toLocaleString();

        }


        /*========================================
        CREATE INITIAL USER RECORD
        ========================================*/

        if (!snapshot.exists()) {

            await set(
                userRef,
                {

                    name:
                        authName ||
                        "SmartBazaar User",

                    email:
                        authEmail,

                    username:
                        "",

                    photoURL:
                        user.photoURL ||
                        "",

                    createdAt:
                        Date.now(),

                    stats: {

                        orders: 0,

                        products: 0,

                        projects: 0,

                        downloads: 0

                    },

                    wallet: {

                        balance: 0

                    }

                }
            );

        }

    }
    catch(error) {

        console.error(
            "ACCOUNT LOAD ERROR:",
            error
        );

    }

}


/*==================================================
CLOUDINARY PROFILE IMAGE UPLOAD
==================================================*/

async function uploadProfileImage(
    file
) {

    if (!file) {

        throw new Error(
            "Please select a profile image."
        );

    }


    if (
        !file.type ||
        !file.type.startsWith("image/")
    ) {

        throw new Error(
            "Please select a valid image."
        );

    }


    const maxSize =
        10 * 1024 * 1024;


    if (file.size > maxSize) {

        throw new Error(
            "Profile image must be smaller than 10MB."
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
            data.error?.message ||
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
CREATE HIDDEN FILE INPUT
==================================================*/

const profileFileInput =
    document.createElement("input");


profileFileInput.type =
    "file";


profileFileInput.accept =
    "image/*";


profileFileInput.style.display =
    "none";


document.body.appendChild(
    profileFileInput
);


/*==================================================
CHANGE PROFILE IMAGE
==================================================*/

if (changeProfileImage) {

    changeProfileImage.addEventListener(
        "click",
        function() {

            profileFileInput.click();

        }
    );

}


/*==================================================
SELECT PROFILE IMAGE
==================================================*/

profileFileInput.addEventListener(
    "change",
    function() {

        const file =
            this.files &&
            this.files[0];


        if (!file) {

            return;

        }


        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            alert(
                "Please select an image."
            );

            this.value =
                "";

            return;

        }


        selectedProfileFile =
            file;


        /*====================================
        INSTANT PREVIEW
        ====================================*/

        const reader =
            new FileReader();


        reader.onload =
            function(event) {

                if (profileImage) {

                    profileImage.src =
                        event.target.result;

                }

            };


        reader.readAsDataURL(
            file
        );


        /*====================================
        UPLOAD
        ====================================*/

        uploadSelectedProfileImage();

    }
);


/*==================================================
UPLOAD SELECTED PROFILE IMAGE
==================================================*/

async function uploadSelectedProfileImage() {

    if (
        !selectedProfileFile ||
        !currentUser
    ) {

        return;

    }


    try {

        if (changeProfileImage) {

            changeProfileImage.disabled =
                true;

            changeProfileImage.textContent =
                "…";

        }


        const imageURL =
            await uploadProfileImage(
                selectedProfileFile
            );


        /*====================================
        SAVE PHOTO URL TO FIREBASE
        ====================================*/

        const userRef =
            ref(
                database,
                "users/" +
                currentUser.uid
            );


        await update(
            userRef,
            {

                photoURL:
                    imageURL,

                updatedAt:
                    Date.now()

            }
        );


        /*====================================
        UPDATE FIREBASE AUTH PROFILE
        ====================================*/

        await updateProfile(
            currentUser,
            {

                photoURL:
                    imageURL

            }
        );


        if (profileImage) {

            profileImage.src =
                imageURL;

        }


        alert(
            "Profile picture updated successfully."
        );


        selectedProfileFile =
            null;

        profileFileInput.value =
            "";

    }
    catch(error) {

        console.error(
            "PROFILE IMAGE ERROR:",
            error
        );


        alert(
            error.message ||
            "Profile image upload failed."
        );

    }
    finally {

        if (changeProfileImage) {

            changeProfileImage.disabled =
                false;

            changeProfileImage.textContent =
                "+";

        }

    }

}


/*==================================================
EDIT PROFILE
==================================================*

if (editProfileButton) {

    editProfileButton.addEventListener(
        "click",
        async function() {

            if (!currentUser) {

                alert(
                    "Please login first."
                );

                return;

            }


            const oldName =
                profileName
                    ? profileName.textContent
                    : "";


            const oldUsername =
                profileUsername
                    ? profileUsername.textContent
                        .replace("@", "")
                    : "";


            const newName =
                prompt(
                    "Enter your name:",
                    oldName
                );


            if (
                newName === null ||
                !newName.trim()
            ) {

                return;

            }


            const newUsername =
                prompt(
                    "Enter username:",
                    oldUsername
                );


            try {

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
                            newName.trim(),

                        username:
                            newUsername
                                ? newUsername
                                    .trim()
                                : oldUsername,

                        updatedAt:
                            Date.now()

                    }
                );


                await updateProfile(
                    currentUser,
                    {

                        displayName:
                            newName.trim()

                    }
                );


                if (profileName) {

                    profileName.textContent =
                        newName.trim();

                }


                if (profileUsername) {

                    const username =
                        newUsername
                            ? newUsername.trim()
                            : oldUsername;


                    profileUsername.textContent =
                        username
                            ? "@" + username
                            : "@user";

                }


                alert(
                    "Profile updated successfully."
                );

            }
            catch(error) {

                console.error(
                    "EDIT PROFILE ERROR:",
                    error
                );


                alert(
                    error.message ||
                    "Could not update profile."
                );

            }

        }
    );

}*/

/*==================================================
EDIT PROFILE — REDIRECT TO EDIT PAGE
==================================================*/

if (editProfileButton) {

    editProfileButton.addEventListener(
        "click",
        function() {

            /* یوزر لاگ ان ہے یا نہیں، یہ چیک کریں */
            if (!currentUser) {
                alert("Please login first.");
                return;
            }

            /* نئے ایڈٹ پیج پر بھیج دیں */
            window.location.href = "edit-account.html";

        }
    );

}


/*==================================================
LOGOUT
==================================================*/

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function() {

            const confirmed =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmed) {

                return;

            }


            try {

                await signOut(auth);


                window.location.href =
                    "index.html";

            }
            catch(error) {

                console.error(
                    "LOGOUT ERROR:",
                    error
                );


                alert(
                    "Logout failed."
                );

            }

        }
    );

}


/*==================================================
BACK BUTTON
==================================================*/

if (backButton) {

    backButton.addEventListener(
        "click",
        function() {

            if (
                window.history.length > 1
            ) {

                window.history.back();

            }
            else {

                window.location.href =
                    "index.html";

            }

        }
    );

}


/*==================================================
SETTINGS BUTTON
==================================================*/

if (settingsButton) {

    settingsButton.addEventListener(
        "click",
        function() {

            const settings =
                document.getElementById(
                    "settings-section"
                );


            if (settings) {

                settings.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

}


/*==================================================
OPEN EDITOR
==================================================*/

function openEditor() {

    window.location.href =
        "editor.html";

}


if (actionEditor) {

    actionEditor.addEventListener(
        "click",
        openEditor
    );

}


if (createWebsiteButton) {

    createWebsiteButton.addEventListener(
        "click",
        openEditor
    );

}


if (bottomCreate) {

    bottomCreate.addEventListener(
        "click",
        openEditor
    );

}


/*==================================================
BOTTOM HOME
==================================================*/

if (bottomHome) {

    bottomHome.addEventListener(
        "click",
        function() {

            window.location.href =
                "index.html";

        }
    );

}


/*==================================================
BOTTOM PRODUCTS
==================================================*/

if (bottomProducts) {

    bottomProducts.addEventListener(
        "click",
        function() {

            window.location.href =
                "products.html";

        }
    );

}


/*==================================================
BOTTOM ORDERS
==================================================*/

if (bottomOrders) {

    bottomOrders.addEventListener(
        "click",
        function() {

            window.location.href =
                "orders.html";

        }
    );

}


/*==================================================
BOTTOM ACCOUNT
==================================================*/

if (bottomAccount) {

    bottomAccount.addEventListener(
        "click",
        function() {

            window.location.href =
                "account.html";

        }
    );

}


/*==================================================
BROWSE PRODUCTS
==================================================*/

if (browseProductsButton) {

    browseProductsButton.addEventListener(
        "click",
        function() {

            window.location.href =
                "products.html";

        }
    );

}


/*==================================================
WALLET — ADD MONEY
==================================================*/

if (addMoneyButton) {

    addMoneyButton.addEventListener(
        "click",
        function() {

            alert(
                "Wallet top-up system will open here."
            );

        }
    );

}


/*==================================================
WALLET — WITHDRAW
==================================================*/

if (withdrawButton) {

    withdrawButton.addEventListener(
        "click",
        function() {

            alert(
                "Withdrawal system will open here."
            );

        }
    );

}


/*==================================================
WALLET — HISTORY
==================================================*/

if (walletHistoryButton) {

    walletHistoryButton.addEventListener(
        "click",
        function() {

            alert(
                "Wallet history will open here."
            );

        }
    );

}


/*==================================================
DARK MODE
==================================================*/

const darkModeButton =
    document.getElementById(
        "dark-mode-button"
    );


if (darkModeButton) {

    darkModeButton.addEventListener(
        "click",
        function() {

            document.body.classList.toggle(
                "dark-mode"
            );


            const enabled =
                document.body.classList.contains(
                    "dark-mode"
                );


            localStorage.setItem(
                "smartbazaar-dark-mode",
                enabled
                    ? "1"
                    : "0"
            );

        }
    );

}


/*==================================================
LOAD DARK MODE
==================================================*/

if (
    localStorage.getItem(
        "smartbazaar-dark-mode"
    ) === "1"
) {

    document.body.classList.add(
        "dark-mode"
    );

}


/*==================================================
GENERIC MENU BUTTONS
==================================================*/

const menuButtonIds = [

    "change-password-button",

    "two-factor-button",

    "login-activity-button",

    "help-center-button",

    "contact-support-button",

    "report-problem-button",

    "view-all-projects",

    "view-all-purchases",

    "view-wishlist"

];


menuButtonIds.forEach(
    function(id) {

        const button =
            document.getElementById(id);


        if (!button) {

            return;

        }


        button.addEventListener(
            "click",
            function() {

                console.log(
                    "Account action:",
                    id
                );

                alert(
                    "This section is ready to be connected."
                );

            }
        );

    }
);


/*==================================================
AUTH STATE
==================================================*/

showProfileLoading();


onAuthStateChanged(
    auth,
    async function(user) {

        if (!user) {

            /*================================
            NO USER LOGGED IN
            =================================*/

            console.log(
                "No authenticated user."
            );


            window.location.href =
                "login.html";


            return;

        }


        /*================================
        SAVE CURRENT USER
        =================================*/

        currentUser =
            user;


        console.log(
            "Logged in user:",
            user.uid
        );


        /*================================
        LOAD ACCOUNT
        =================================*/

        await loadUserData(
            user
        );

    }
);




/*==================================================
 SMARTBAZAAR PRO
 ADD PRODUCT BUTTON
==================================================*/

const addProductButton =
document.getElementById("add-product-button");


const addProductCard =
document.getElementById("add-product-card");


/*==============================
 OPEN PRODUCT EDITOR
==============================*/

function openProductEditor(){

    window.location.href =
    "product-editor.html";

}


/*==============================
 BUTTON CLICK
==============================*/

if(addProductButton){

    addProductButton.addEventListener(
        "click",
        function(event){

            event.stopPropagation();

            openProductEditor();

        }
    );

}


/*==============================
 WHOLE CARD CLICK
==============================*/

if(addProductCard){

    addProductCard.addEventListener(
        "click",
        function(){

            openProductEditor();

        }
    );

}

