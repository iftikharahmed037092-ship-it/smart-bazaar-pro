/*==================================================
SMARTBAZAAR PRO
FEATURE — BANNER MANAGEMENT
PART 20.2
BANNER MANAGER JAVASCRIPT

FLOW:
Banner Image Box
        ↓
File Picker / Gallery
        ↓
Image Preview
        ↓
Cloudinary Upload
        ↓
Firebase Realtime Database
        ↓
Saved Banner List
==================================================*/


/*==================================================
IMPORT FIREBASE
==================================================*/

import {
    database
} from "./firebase-config.js";


/*==================================================
IMPORT FIREBASE REALTIME DATABASE FUNCTIONS
==================================================*/

import {
    ref,
    push,
    set,
    update,
    remove,
    onValue
}
from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


/*==================================================
IMPORT CLOUDINARY
==================================================*/

import {
    uploadImage
} from "./cloudinary.js";


/*==================================================
DOM ELEMENTS
==================================================*/

const bannerForm =
    document.getElementById("bannerForm");

const bannerImage =
    document.getElementById("bannerImage");

const imagePreview =
    document.getElementById("imagePreview");

const bannerTitle =
    document.getElementById("bannerTitle");

const bannerDescription =
    document.getElementById("bannerDescription");

const bannerBadge =
    document.getElementById("bannerBadge");

const bannerButtonText =
    document.getElementById("bannerButtonText");

const bannerButtonLink =
    document.getElementById("bannerButtonLink");

const bannerStatus =
    document.getElementById("bannerStatus");

const saveBannerBtn =
    document.getElementById("saveBannerBtn");

const bannerMessage =
    document.getElementById("bannerMessage");

const bannerList =
    document.getElementById("bannerList");


/*==================================================
FEATURE — BANNER MANAGEMENT
BANNER IMAGE SELECTION
==================================================*/

let selectedBannerFile = null;


/*==================================================
IMAGE SELECT
==================================================*/

bannerImage.addEventListener(
    "change",
    function () {

        const file =
            this.files?.[0];

        if (!file) {

            selectedBannerFile = null;

            return;

        }


        /*==============================
        VALIDATE IMAGE
        ==============================*/

        if (!file.type.startsWith("image/")) {

            showMessage(
                "Please select a valid image.",
                "error"
            );

            this.value = "";

            return;

        }


        /*==============================
        MAX 10MB
        ==============================*/

        if (file.size > 10 * 1024 * 1024) {

            showMessage(
                "Image must be smaller than 10MB.",
                "error"
            );

            this.value = "";

            return;

        }


        selectedBannerFile = file;


        /*==============================
        LOCAL PREVIEW
        ==============================*/

        const imageURL =
            URL.createObjectURL(file);

        imagePreview.innerHTML = `
            <img
                src="${imageURL}"
                alt="Banner Preview"
            >
        `;

        imagePreview.classList.add("active");

    }
);


/*==================================================
FEATURE — BANNER MANAGEMENT
SAVE BANNER
==================================================*/

bannerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        /*==============================
        VALIDATE IMAGE
        ==============================*/

        if (!selectedBannerFile) {

            showMessage(
                "Please select a banner image.",
                "error"
            );

            return;

        }


        /*==============================
        VALIDATE TITLE
        ==============================*/

        const title =
            bannerTitle.value.trim();

        if (!title) {

            showMessage(
                "Please enter banner title.",
                "error"
            );

            bannerTitle.focus();

            return;

        }


        /*==============================
        BUTTON STATE
        ==============================*/

        saveBannerBtn.disabled = true;

        saveBannerBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Uploading Banner...
        `;

        clearMessage();


        try {

            /*========================================
            FEATURE — CLOUDINARY BANNER UPLOAD
            ========================================*/

            const imageURL =
                await uploadImage(
                    selectedBannerFile
                );


            /*========================================
            FEATURE — FIREBASE BANNER DATA
            ========================================*/

            const bannersRef =
                ref(
                    database,
                    "banners"
                );


            const newBannerRef =
                push(bannersRef);


            const bannerData = {

                id: newBannerRef.key,

                imageURL: imageURL,

                title: title,

                description:
                    bannerDescription.value.trim(),

                badge:
                    bannerBadge.value.trim(),

                buttonText:
                    bannerButtonText.value.trim() ||
                    "Shop Now",

                buttonLink:
                    bannerButtonLink.value.trim(),

                status:
                    bannerStatus.value,

                createdAt:
                    Date.now(),

                updatedAt:
                    Date.now()

            };


            /*========================================
            SAVE TO FIREBASE
            ========================================*/

            await set(
                newBannerRef,
                bannerData
            );


            /*========================================
            SUCCESS
            ========================================*/

            showMessage(
                "Banner uploaded and saved successfully.",
                "success"
            );


            /*========================================
            RESET FORM
            ========================================*/

            bannerForm.reset();

            selectedBannerFile = null;

            imagePreview.innerHTML = "";

            imagePreview.classList.remove("active");


        }

        catch (error) {

            console.error(
                "Banner Save Error:",
                error
            );


            showMessage(
                error?.message ||
                "Failed to save banner.",
                "error"
            );

        }


        finally {

            saveBannerBtn.disabled = false;

            saveBannerBtn.innerHTML = `
                <i class="fa-solid fa-cloud-arrow-up"></i>
                Upload & Save Banner
            `;

        }

    }
);


/*==================================================
FEATURE — BANNER MANAGEMENT
LOAD SAVED BANNERS
==================================================*/

const bannersRef =
    ref(
        database,
        "banners"
    );


onValue(
    bannersRef,
    function (snapshot) {

        const data =
            snapshot.val();


        if (!data) {

            bannerList.innerHTML = `
                <p class="empty-message">
                    No banners added yet.
                </p>
            `;

            return;

        }


        const banners =
            Object.values(data);


        /*==============================
        SORT NEWEST FIRST
        ==============================*/

        banners.sort(
            (a, b) =>
                (b.createdAt || 0) -
                (a.createdAt || 0)
        );


        bannerList.innerHTML =
            banners
                .map(
                    createBannerItem
                )
                .join("");


        attachBannerActions();

    }
);


/*==================================================
FEATURE — BANNER MANAGEMENT
CREATE BANNER ITEM
==================================================*/

function createBannerItem(
    banner
) {

    const safeTitle =
        escapeHTML(
            banner.title || ""
        );

    const safeDescription =
        escapeHTML(
            banner.description || ""
        );

    const safeStatus =
        escapeHTML(
            banner.status || "inactive"
        );


    return `

        <article
            class="banner-item"
            data-banner-id="${banner.id}"
        >

            <div class="banner-item-image">

                <img
                    src="${banner.imageURL}"
                    alt="${safeTitle}"
                >

            </div>


            <div class="banner-item-info">

                <h3>
                    ${safeTitle}
                </h3>

                <p>
                    ${safeDescription}
                </p>

                <p>
                    Status:
                    <strong>
                        ${safeStatus}
                    </strong>
                </p>


                <div
                    class="banner-item-actions"
                >

                    <button
                        type="button"
                        class="banner-delete-btn"
                        data-action="delete"
                        data-id="${banner.id}"
                    >

                        <i class="fa-solid fa-trash"></i>

                        Delete

                    </button>

                </div>

            </div>

        </article>

    `;

}


/*==================================================
FEATURE — BANNER MANAGEMENT
BANNER ACTIONS
==================================================*/

function attachBannerActions() {

    const deleteButtons =
        bannerList.querySelectorAll(
            '[data-action="delete"]'
        );


    deleteButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                async function () {

                    const id =
                        this.dataset.id;

                    if (!id) {

                        return;

                    }


                    const confirmed =
                        confirm(
                            "Are you sure you want to delete this banner?"
                        );


                    if (!confirmed) {

                        return;

                    }


                    try {

                        await remove(
                            ref(
                                database,
                                `banners/${id}`
                            )
                        );


                        showMessage(
                            "Banner deleted successfully.",
                            "success"
                        );

                    }

                    catch (error) {

                        console.error(
                            "Banner Delete Error:",
                            error
                        );


                        showMessage(
                            error?.message ||
                            "Failed to delete banner.",
                            "error"
                        );

                    }

                }
            );

        }
    );

}


/*==================================================
MESSAGE
==================================================*/

function showMessage(
    message,
    type
) {

    bannerMessage.textContent =
        message;

    bannerMessage.className =
        `banner-message ${type}`;

}


function clearMessage() {

    bannerMessage.textContent = "";

    bannerMessage.className =
        "banner-message";

}


/*==================================================
FEATURE — SECURITY
ESCAPE HTML
==================================================*/

function escapeHTML(
    value
) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/*==================================================
SMARTBAZAAR PRO
BANNER MANAGER INITIALIZED
==================================================*/

console.log(
    "SMARTBAZAAR PRO — Banner Manager initialized."
);
