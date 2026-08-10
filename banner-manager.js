/*==================================================
SMARTBAZAAR PRO
PART 20.2
BANNER MANAGER JAVASCRIPT
==================================================*/


/*==================================================
CLOUDINARY CONFIG
==================================================*/

const cloudName = "tmdzy5c0";

const uploadPreset = "ml_default";


/*==================================================
FIREBASE BANNER FUNCTIONS
==================================================*/

import {
    addBanner,
    getBanners,
    deleteBanner
} from "./firebase-banner.js";


/*==================================================
DOM ELEMENTS
==================================================*/

const bannerForm =
    document.getElementById("bannerForm");

const bannerImage =
    document.getElementById("bannerImage");

const imagePreview =
    document.getElementById("imagePreview");

const saveBannerBtn =
    document.getElementById("saveBannerBtn");

const bannerMessage =
    document.getElementById("bannerMessage");

const bannerList =
    document.getElementById("bannerList");


/*==================================================
SELECTED IMAGE
==================================================*/

let selectedFile = null;


/*==================================================
MESSAGE
==================================================*/

function showMessage(message, type = "") {

    bannerMessage.textContent = message;

    bannerMessage.className =
        "banner-message " + type;

}


/*==================================================
IMAGE SELECT
==================================================*/

bannerImage.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {

        selectedFile = null;

        imagePreview.innerHTML = "";

        imagePreview.classList.remove("active");

        return;

    }


    /* CHECK IMAGE */

    if (!file.type.startsWith("image/")) {

        showMessage(
            "Please select an image file.",
            "error"
        );

        this.value = "";

        return;

    }


    /* CHECK SIZE */

    if (file.size > 10 * 1024 * 1024) {

        showMessage(
            "Image must be smaller than 10MB.",
            "error"
        );

        this.value = "";

        return;

    }


    selectedFile = file;


    /* PREVIEW */

    const reader = new FileReader();


    reader.onload = function (event) {

        imagePreview.innerHTML = `
            <img
                src="${event.target.result}"
                alt="Banner Preview">
        `;

        imagePreview.classList.add("active");

    };


    reader.readAsDataURL(file);


    showMessage("");

});


/*==================================================
CLOUDINARY UPLOAD
==================================================*/

async function uploadToCloudinary(file) {

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
                method: "POST",
                body: formData
            }
        );


    if (!response.ok) {

        throw new Error(
            "Cloudinary upload failed."
        );

    }


    const data =
        await response.json();


    if (!data.secure_url) {

        throw new Error(
            "Cloudinary did not return image URL."
        );

    }


    return data.secure_url;

}


/*==================================================
SAVE BANNER
==================================================*/

bannerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        /* CHECK IMAGE */

        if (!selectedFile) {

            showMessage(
                "Please select a banner image first.",
                "error"
            );

            return;

        }


        /* GET FORM DATA */

        const title =
            document
            .getElementById("bannerTitle")
            .value
            .trim();


        const description =
            document
            .getElementById("bannerDescription")
            .value
            .trim();


        const badge =
            document
            .getElementById("bannerBadge")
            .value
            .trim();


        const buttonText =
            document
            .getElementById("bannerButtonText")
            .value
            .trim();


        const buttonLink =
            document
            .getElementById("bannerButtonLink")
            .value
            .trim();


        const status =
            document
            .getElementById("bannerStatus")
            .value;


        if (!title) {

            showMessage(
                "Please enter banner title.",
                "error"
            );

            return;

        }


        try {

            /* DISABLE BUTTON */

            saveBannerBtn.disabled = true;

            saveBannerBtn.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Uploading...
            `;


            showMessage(
                "Uploading image..."
            );


            /* CLOUDINARY */

            const imageURL =
                await uploadToCloudinary(
                    selectedFile
                );


            showMessage(
                "Image uploaded. Saving banner..."
            );


            /* FIREBASE DATA */

            const bannerData = {

                image: imageURL,

                title: title,

                description: description,

                badge: badge,

                buttonText:
                    buttonText || "Shop Now",

                buttonLink:
                    buttonLink || "#",

                status: status,

                createdAt:
                    Date.now()

            };


            /* SAVE FIREBASE */

            await addBanner(
                bannerData
            );


            /* SUCCESS */

            showMessage(
                "Banner added successfully!",
                "success"
            );


            /* RESET */

            bannerForm.reset();

            selectedFile = null;

            imagePreview.innerHTML = "";

            imagePreview.classList.remove(
                "active"
            );


            /* LOAD BANNERS */

            await loadBanners();


        }

        catch (error) {

            console.error(
                "Banner Error:",
                error
            );


            showMessage(
                "Banner upload failed. Please check Cloudinary settings.",
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
LOAD BANNERS
==================================================*/

async function loadBanners() {

    try {

        const banners =
            await getBanners();


        bannerList.innerHTML = "";


        if (
            !banners ||
            Object.keys(banners).length === 0
        ) {

            bannerList.innerHTML = `
                <p class="empty-message">
                    No banners added yet.
                </p>
            `;

            return;

        }


        Object.entries(banners)
        .forEach(
            ([id, banner]) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "banner-item";


                item.innerHTML = `

                    <div class="banner-item-image">

                        <img
                            src="${banner.image || ""}"
                            alt="${escapeHTML(
                                banner.title || "Banner"
                            )}">

                    </div>


                    <div class="banner-item-info">

                        <h3>
                            ${escapeHTML(
                                banner.title || "Untitled Banner"
                            )}
                        </h3>


                        <p>
                            ${escapeHTML(
                                banner.description || ""
                            )}
                        </p>


                        <div class="banner-item-actions">

                            <button
                                type="button"
                                class="banner-delete-btn"
                                data-id="${id}">

                                <i class="fa-solid fa-trash"></i>

                                Delete

                            </button>

                        </div>

                    </div>

                `;


                bannerList.appendChild(
                    item
                );

            }
        );


        /* DELETE BUTTONS */

        document
        .querySelectorAll(
            ".banner-delete-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async function () {

                        const id =
                            this.dataset.id;


                        const confirmed =
                            confirm(
                                "Delete this banner?"
                            );


                        if (!confirmed) {

                            return;

                        }


                        try {

                            this.disabled = true;


                            await deleteBanner(
                                id
                            );


                            await loadBanners();


                            showMessage(
                                "Banner deleted successfully.",
                                "success"
                            );

                        }

                        catch (error) {

                            console.error(
                                error
                            );


                            showMessage(
                                "Could not delete banner.",
                                "error"
                            );


                            this.disabled = false;

                        }

                    }
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Loading banners failed:",
            error
        );


        bannerList.innerHTML = `
            <p class="empty-message">
                Unable to load banners.
            </p>
        `;

    }

}


/*==================================================
ESCAPE HTML
==================================================*/

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


/*==================================================
INITIAL LOAD
==================================================*/

loadBanners();
