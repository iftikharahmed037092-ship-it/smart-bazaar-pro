/*==================================================
SMARTBAZAAR PRO
PART 20.2
BANNER MANAGER JAVASCRIPT
==================================================*/


/*==================================================
CLOUDINARY CONFIG
==================================================*/

const cloudName = "jlrjn7lu";

const uploadPreset = "smartbazaar_uploads";


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
CHECK REQUIRED ELEMENTS
==================================================*/

if (!bannerForm) {

    console.error(
        "ERROR: #bannerForm not found."
    );

}


if (!bannerImage) {

    console.error(
        "ERROR: #bannerImage not found."
    );

}


if (!imagePreview) {

    console.error(
        "ERROR: #imagePreview not found."
    );

}


if (!saveBannerBtn) {

    console.error(
        "ERROR: #saveBannerBtn not found."
    );

}


if (!bannerMessage) {

    console.error(
        "ERROR: #bannerMessage not found."
    );

}


if (!bannerList) {

    console.error(
        "ERROR: #bannerList not found."
    );

}


/*==================================================
SELECTED IMAGE
==================================================*/

let selectedFile = null;


/*==================================================
SHOW MESSAGE
==================================================*/

function showMessage(
    message,
    type = ""
) {

    if (!bannerMessage) {

        return;

    }


    bannerMessage.textContent =
        message;


    bannerMessage.className =
        "banner-message";


    if (type) {

        bannerMessage.classList.add(
            type
        );

    }

}


/*==================================================
IMAGE PREVIEW
==================================================*/

function showImagePreview(file) {

    if (!imagePreview) {

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function(event) {

            imagePreview.innerHTML = `

                <img
                    src="${event.target.result}"
                    alt="Banner Preview">

            `;


            imagePreview.classList.add(
                "active"
            );

        };


    reader.onerror =
        function() {

            showMessage(
                "Could not preview image.",
                "error"
            );

        };


    reader.readAsDataURL(file);

}


/*==================================================
IMAGE SELECT
==================================================*/

if (bannerImage) {

    bannerImage.addEventListener(
        "change",
        function() {

            const file =
                this.files &&
                this.files[0];


            if (!file) {

                selectedFile = null;

                if (imagePreview) {

                    imagePreview.innerHTML =
                        "";

                    imagePreview.classList.remove(
                        "active"
                    );

                }

                return;

            }


            /*==============================
            CHECK IMAGE TYPE
            ==============================*/

            if (
                !file.type ||
                !file.type.startsWith(
                    "image/"
                )
            ) {

                showMessage(
                    "Please select an image file.",
                    "error"
                );

                this.value = "";

                selectedFile = null;

                return;

            }


            /*==============================
            CHECK IMAGE SIZE
            ==============================*/

            const maxSize =
                10 * 1024 * 1024;


            if (
                file.size > maxSize
            ) {

                showMessage(
                    "Image must be smaller than 10MB.",
                    "error"
                );

                this.value = "";

                selectedFile = null;

                return;

            }


            /*==============================
            SAVE FILE
            ==============================*/

            selectedFile =
                file;


            /*==============================
            SHOW PREVIEW
            ==============================*/

            showImagePreview(
                file
            );


            showMessage(
                "Image selected successfully.",
                "success"
            );

        }
    );

}


/*==================================================
CLOUDINARY UPLOAD
==================================================*/

async function uploadToCloudinary(
    file
) {

    if (!file) {

        throw new Error(
            "No image selected."
        );

    }


    if (
        !cloudName ||
        cloudName === "YOUR_CLOUD_NAME"
    ) {

        throw new Error(
            "Cloudinary Cloud Name is missing."
        );

    }


    if (
        !uploadPreset ||
        uploadPreset === "YOUR_UPLOAD_PRESET"
    ) {

        throw new Error(
            "Cloudinary Upload Preset is missing."
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


    console.log(
        "Cloudinary upload started..."
    );


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


    console.log(
        "Cloudinary response:",
        data
    );


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
GET FORM VALUE
==================================================*/

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {

        return "";

    }


    return element.value.trim();

}


/*==================================================
SAVE BANNER
==================================================*/

if (bannerForm) {

    bannerForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            /*==============================
            CHECK IMAGE
            ==============================*/

            if (!selectedFile) {

                showMessage(
                    "Please select a banner image first.",
                    "error"
                );

                return;

            }


            /*==============================
            GET FORM DATA
            ==============================*/

            const title =
                getValue(
                    "bannerTitle"
                );


            const description =
                getValue(
                    "bannerDescription"
                );


            const badge =
                getValue(
                    "bannerBadge"
                );


            const buttonText =
                getValue(
                    "bannerButtonText"
                );


            const buttonLink =
                getValue(
                    "bannerButtonLink"
                );


            const statusElement =
                document.getElementById(
                    "bannerStatus"
                );


            const status =
                statusElement
                    ? statusElement.value
                    : "active";


            /*==============================
            TITLE REQUIRED
            ==============================*/

            if (!title) {

                showMessage(
                    "Please enter banner title.",
                    "error"
                );

                return;

            }


            try {

                /*==========================
                DISABLE BUTTON
                ==========================*/

                if (saveBannerBtn) {

                    saveBannerBtn.disabled =
                        true;


                    saveBannerBtn.innerHTML = `

                        <i class="fa-solid fa-spinner fa-spin"></i>

                        Uploading...

                    `;

                }


                showMessage(
                    "Uploading image..."
                );


                /*==========================
                CLOUDINARY
                ==========================*/

                const imageURL =
                    await uploadToCloudinary(
                        selectedFile
                    );


                console.log(
                    "Image URL received:",
                    imageURL
                );


                showMessage(
                    "Image uploaded. Saving banner..."
                );


                /*==========================
                FIREBASE DATA
                ==========================*/

                const bannerData = {

                    image:
                        imageURL,

                    title:
                        title,

                    description:
                        description,

                    badge:
                        badge,

                    buttonText:
                        buttonText ||
                        "Shop Now",

                    buttonLink:
                        buttonLink ||
                        "#",

                    status:
                        status,

                    createdAt:
                        Date.now()

                };


                /*==========================
                SAVE FIREBASE
                ==========================*/

                const bannerId =
                    await addBanner(
                        bannerData
                    );


                console.log(
                    "Banner saved:",
                    bannerId
                );


                /*==========================
                SUCCESS
                ==========================*/

                showMessage(
                    "Banner added successfully!",
                    "success"
                );


                /*==========================
                RESET FORM
                ==========================*/

                bannerForm.reset();


                selectedFile =
                    null;


                if (imagePreview) {

                    imagePreview.innerHTML =
                        "";

                    imagePreview.classList.remove(
                        "active"
                    );

                }


                /*==========================
                LOAD BANNERS
                ==========================*/

                await loadBanners();

            }


            catch(error) {

                console.error(
                    "BANNER ERROR:",
                    error
                );


                showMessage(
                    error.message ||
                    "Banner upload failed.",
                    "error"
                );

            }


            finally {

                if (saveBannerBtn) {

                    saveBannerBtn.disabled =
                        false;


                    saveBannerBtn.innerHTML = `

                        <i class="fa-solid fa-cloud-arrow-up"></i>

                        Upload & Save Banner

                    `;

                }

            }

        }
    );

}


/*==================================================
LOAD BANNERS
==================================================*/

async function loadBanners() {

    if (!bannerList) {

        return;

    }


    try {

        bannerList.innerHTML = `

            <p class="empty-message">
                Loading banners...
            </p>

        `;


        const banners =
            await getBanners();


        bannerList.innerHTML =
            "";


        /*==============================
        NO BANNERS
        ==============================*/

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


        /*==============================
        CREATE BANNERS
        ==============================*/

        Object.entries(
            banners
        )
        .forEach(
            function([
                id,
                banner
            ]) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "banner-item";


                item.innerHTML = `

                    <div class="banner-item-image">

                        <img
                            src="${escapeAttribute(
                                banner.image || ""
                            )}"
                            alt="${escapeAttribute(
                                banner.title ||
                                "Banner"
                            )}">

                    </div>


                    <div class="banner-item-info">

                        <h3>
                            ${escapeHTML(
                                banner.title ||
                                "Untitled Banner"
                            )}
                        </h3>


                        <p>
                            ${escapeHTML(
                                banner.description ||
                                ""
                            )}
                        </p>


                        <div class="banner-item-actions">

                            <button
                                type="button"
                                class="banner-delete-btn"
                                data-id="${escapeAttribute(id)}">

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


        /*==============================
        DELETE BUTTONS
        ==============================*/

        bannerList
        .querySelectorAll(
            ".banner-delete-btn"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    async function() {

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

                            this.disabled =
                                true;


                            this.innerHTML = `

                                <i class="fa-solid fa-spinner fa-spin"></i>

                                Deleting...

                            `;


                            await deleteBanner(
                                id
                            );


                            await loadBanners();


                            showMessage(
                                "Banner deleted successfully.",
                                "success"
                            );

                        }


                        catch(error) {

                            console.error(
                                "DELETE ERROR:",
                                error
                            );


                            showMessage(
                                error.message ||
                                "Could not delete banner.",
                                "error"
                            );


                            this.disabled =
                                false;

                        }

                    }
                );

            }
        );

    }


    catch(error) {

        console.error(
            "LOAD BANNERS ERROR:",
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
ESCAPE ATTRIBUTE
==================================================*/

function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );

}


/*==================================================
INITIAL LOAD
==================================================*/

loadBanners();
