/*==================================================
SMARTBAZAAR PRO
FEATURE — BANNER MANAGEMENT
PART 20.2
BANNER MANAGER JAVASCRIPT

FLOW:

IMAGE BOX
    ↓
DEVICE GALLERY
    ↓
IMAGE PREVIEW
    ↓
CLOUDINARY
    ↓
FIREBASE REALTIME DATABASE
    ↓
SAVED BANNER LIST
==================================================*/


/*==================================================
IMPORT FIREBASE CONFIG
==================================================*/

import {
    database
} from "./firebase-config.js";


/*==================================================
IMPORT FIREBASE REALTIME DATABASE
==================================================*/

import {
    ref,
    push,
    set,
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


const bannerImageButton =
    document.getElementById("bannerImageButton");


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
SELECTED FILE
==================================================*/

let selectedBannerFile = null;


/*==================================================
FEATURE — BANNER MANAGEMENT
OPEN DEVICE GALLERY

IMPORTANT:
This section does NOT use Firebase.
This section does NOT use Cloudinary.

It only opens the browser/device file picker.
==================================================*/

if (bannerImageButton && bannerImage) {

    bannerImageButton.addEventListener(
        "click",
        function () {

            bannerImage.click();

        }
    );

}


/*==================================================
FEATURE — BANNER MANAGEMENT
IMAGE SELECTION
==================================================*/

if (bannerImage) {

    bannerImage.addEventListener(
        "change",
        function () {

            const file =
                this.files?.[0];


            /*==============================
            NO FILE
            ==============================*/

            if (!file) {

                selectedBannerFile = null;

                return;

            }


            /*==============================
            VALIDATE IMAGE TYPE
            ==============================*/

            if (
                !file.type ||
                !file.type.startsWith("image/")
            ) {

                showMessage(
                    "Please select a valid image.",
                    "error"
                );

                this.value = "";

                selectedBannerFile = null;

                return;

            }


            /*==============================
            MAXIMUM 10MB
            ==============================*/

            if (
                file.size >
                10 * 1024 * 1024
            ) {

                showMessage(
                    "Image must be smaller than 10MB.",
                    "error"
                );

                this.value = "";

                selectedBannerFile = null;

                return;

            }


            /*==============================
            SAVE SELECTED FILE
            ==============================*/

            selectedBannerFile = file;


            /*==============================
            CREATE PREVIEW
            ==============================*/

            const imageURL =
                URL.createObjectURL(file);


            imagePreview.innerHTML = `

                <img
                    src="${imageURL}"
                    alt="Banner Preview"
                >

            `;


            imagePreview.classList.add(
                "active"
            );


            clearMessage();

        }
    );

}


/*==================================================
FEATURE — BANNER MANAGEMENT
SAVE BANNER
==================================================*/

if (bannerForm) {

    bannerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /*==============================
            IMAGE VALIDATION
            ==============================*/

            if (!selectedBannerFile) {

                showMessage(
                    "Please select a banner image first.",
                    "error"
                );

                return;

            }


            /*==============================
            TITLE VALIDATION
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


                /*==================================================
                FEATURE — CLOUDINARY
                UPLOAD BANNER IMAGE
                ==================================================*/

                const imageURL =
                    await uploadImage(
                        selectedBannerFile
                    );


                /*==================================================
                FEATURE — FIREBASE
                BANNER DATABASE REFERENCE
                ==================================================*/

                const bannersRef =
                    ref(
                        database,
                        "banners"
                    );


                /*==================================================
                CREATE NEW BANNER
                ==================================================*/

                const newBannerRef =
                    push(
                        bannersRef
                    );


                /*==================================================
                BANNER DATA
                ==================================================*/

                const bannerData = {

                    id:
                        newBannerRef.key,

                    imageURL:
                        imageURL,

                    title:
                        title,

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


                /*==================================================
                SAVE TO FIREBASE
                ==================================================*/

                await set(
                    newBannerRef,
                    bannerData
                );


                /*==================================================
                SUCCESS
                ==================================================*/

                showMessage(
                    "Banner uploaded and saved successfully.",
                    "success"
                );


                /*==================================================
                RESET
                ==================================================*/

                bannerForm.reset();

                selectedBannerFile = null;

                imagePreview.innerHTML = "";

                imagePreview.classList.remove(
                    "active"
                );

            }


            catch (error) {

                console.error(
                    "Banner Save Error:",
                    error
                );


                showMessage(
                    error?.message ||
                    "Failed to upload and save banner.",
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

}


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


        /*==============================
        NO BANNERS
        ==============================*/

        if (!data) {

            bannerList.innerHTML = `

                <p class="empty-message">

                    No banners added yet.

                </p>

            `;

            return;

        }


        /*==============================
        CONVERT OBJECT TO ARRAY
        ==============================*/

        const banners =
            Object.values(data);


        /*==============================
        NEWEST FIRST
        ==============================*/

        banners.sort(
            (a, b) =>
                (b.createdAt || 0) -
                (a.createdAt || 0)
        );


        /*==============================
        DISPLAY
        ==============================*/

        bannerList.innerHTML =
            banners
                .map(createBannerItem)
                .join("");


        attachBannerActions();

    },

    function (error) {

        console.error(
            "Banner Load Error:",
            error
        );


        bannerList.innerHTML = `

            <p class="empty-message">

                Failed to load banners.

            </p>

        `;

    }
);


/*==================================================
FEATURE — BANNER MANAGEMENT
CREATE SAVED BANNER ITEM
==================================================*/

function createBannerItem(
    banner
) {

    const safeId =
        escapeHTML(
            banner.id || ""
        );


    const safeTitle =
        escapeHTML(
            banner.title || ""
        );


    const safeDescription =
        escapeHTML(
            banner.description || ""
        );


    const safeImageURL =
        escapeHTML(
            banner.imageURL || ""
        );


    const safeStatus =
        banner.status === "active"
            ? "active"
            : "inactive";


    const statusText =
        safeStatus === "active"
            ? "Active"
            : "Inactive";


    return `

        <article
            class="banner-item"
            data-banner-id="${safeId}"
        >


            <div class="banner-item-image">

                <img
                    src="${safeImageURL}"
                    alt="${safeTitle}"
                    loading="lazy"
                >

            </div>


            <div class="banner-item-info">

                <h3>
                    ${safeTitle}
                </h3>


                <p>
                    ${safeDescription}
                </p>


                <span
                    class="banner-status ${safeStatus}"
                >

                    ${statusText}

                </span>


                <div
                    class="banner-item-actions"
                >

                    <button
                        type="button"
                        class="banner-delete-btn"
                        data-action="delete"
                        data-id="${safeId}"
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
DELETE BANNER
==================================================*/

function attachBannerActions() {

    const deleteButtons =
        bannerList.querySelectorAll(
            '[data-action="delete"]'
        );


    deleteButtons.forEach(
        function (button) {

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

    if (!bannerMessage) {

        return;

    }


    bannerMessage.textContent =
        message;


    bannerMessage.className =
        `banner-message ${type}`;

}


function clearMessage() {

    if (!bannerMessage) {

        return;

    }


    bannerMessage.textContent =
        "";


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

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/*==================================================
SMARTBAZAAR PRO
FEATURE — BANNER MANAGEMENT
INITIALIZED
==================================================*/

console.log(
    "SMARTBAZAAR PRO — Banner Manager initialized."
);
