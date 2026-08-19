/*==================================================
SMARTBAZAAR PRO
PRODUCT EDITOR
COMPLETE JAVASCRIPT
==================================================*/


/*==================================================
IMPORT FIREBASE
==================================================*/

import {
    database
} from "./firebase.js";


import {
    ref,
    push,
    set
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


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

const uploadImageBtn =
    document.getElementById(
        "uploadImageBtn"
    );


const mainProductImage =
    document.getElementById(
        "mainProductImage"
    );


const mainImagePreview =
    document.getElementById(
        "mainImagePreview"
    );


const productImageUrl =
    document.getElementById(
        "productImageUrl"
    );


const productGallery =
    document.getElementById(
        "productGallery"
    );


const galleryPreview =
    document.getElementById(
        "galleryPreview"
    );


const previewProductBtn =
    document.getElementById(
        "previewProductBtn"
    );


const saveProductBtn =
    document.getElementById(
        "saveProductBtn"
    );


const saveDraftBtn =
    document.getElementById(
        "saveDraftBtn"
    );


const finalSaveProductBtn =
    document.getElementById(
        "finalSaveProductBtn"
    );


const cancelProductBtn =
    document.getElementById(
        "cancelProductBtn"
    );


/*==================================================
IMAGE DATA
==================================================*/

let mainImageUrl = "";

let galleryImages = [];


/*==================================================
UPLOAD BUTTON
==================================================*/

if (uploadImageBtn) {

    uploadImageBtn.addEventListener(
        "click",
        function () {

            if (mainProductImage) {

                mainProductImage.click();

            }

        }
    );

}


/*==================================================
MAIN IMAGE FILE SELECT
==================================================*/

if (mainProductImage) {

    mainProductImage.addEventListener(
        "change",
        async function () {

            const file =
                this.files[0];


            if (!file) {

                return;

            }


            await handleMainImage(
                file
            );

        }
    );

}


/*==================================================
MAIN IMAGE URL
==================================================*/

if (productImageUrl) {

    productImageUrl.addEventListener(
        "input",
        function () {

            const url =
                this.value.trim();


            if (!url) {

                return;

            }


            mainImageUrl =
                url;


            showMainImage(
                url
            );

        }
    );

}


/*==================================================
SHOW MAIN IMAGE
==================================================*/

function showMainImage(url) {

    if (!mainImagePreview) {

        return;

    }


    mainImagePreview.innerHTML = `

        <img
            src="${escapeHtml(url)}"
            alt="Product Image"
            style="
                width:100%;
                height:100%;
                object-fit:cover;
                border-radius:inherit;
            "
        >

    `;

}


/*==================================================
HANDLE MAIN IMAGE
==================================================*/

async function handleMainImage(file) {

    if (!file.type.startsWith("image/")) {

        alert(
            "Please select an image file."
        );

        return;

    }


    try {

        setUploadStatus(
            "Uploading image..."
        );


        const url =
            await uploadToCloudinary(
                file
            );


        mainImageUrl =
            url;


        if (productImageUrl) {

            productImageUrl.value =
                url;

        }


        showMainImage(
            url
        );


        setUploadStatus(
            "Image uploaded successfully ✓"
        );

    }

    catch (error) {

        console.error(
            "MAIN IMAGE ERROR:",
            error
        );


        alert(
            "Image upload failed."
        );


        setUploadStatus("");

    }

}


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


    const response =
        await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: "POST",
                body: formData
            }
        );


    if (!response.ok) {

        throw new Error(
            "Cloudinary upload failed"
        );

    }


    const data =
        await response.json();


    if (!data.secure_url) {

        throw new Error(
            "Cloudinary did not return image URL"
        );

    }


    return data.secure_url;

}


/*==================================================
DRAG & DROP
==================================================*/

if (mainImagePreview) {

    mainImagePreview.addEventListener(
        "dragover",
        function (event) {

            event.preventDefault();

            this.classList.add(
                "drag-over"
            );

        }
    );


    mainImagePreview.addEventListener(
        "dragleave",
        function () {

            this.classList.remove(
                "drag-over"
            );

        }
    );


    mainImagePreview.addEventListener(
        "drop",
        async function (event) {

            event.preventDefault();


            this.classList.remove(
                "drag-over"
            );


            const file =
                event.dataTransfer.files[0];


            if (!file) {

                return;

            }


            await handleMainImage(
                file
            );

        }
    );

}


/*==================================================
GALLERY FILES
==================================================*/

if (productGallery) {

    productGallery.addEventListener(
        "change",
        async function () {

            const files =
                Array.from(
                    this.files
                );


            if (
                files.length === 0
            ) {

                return;

            }


            galleryImages = [];


            renderGalleryLoading(
                files.length
            );


            try {

                for (
                    const file
                    of files
                ) {

                    if (
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {

                        continue;

                    }


                    const url =
                        await uploadToCloudinary(
                            file
                        );


                    galleryImages.push(
                        url
                    );

                }


                renderGallery();


            }

            catch (error) {

                console.error(
                    "GALLERY ERROR:",
                    error
                );


                alert(
                    "One or more gallery images failed to upload."
                );


                renderGallery();

            }

        }
    );

}


/*==================================================
GALLERY PREVIEW
==================================================*/

function renderGallery() {

    if (!galleryPreview) {

        return;

    }


    galleryPreview.innerHTML = "";


    galleryImages.forEach(
        function (url, index) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "gallery-item";


            item.innerHTML = `

                <img
                    src="${escapeHtml(url)}"
                    alt="Gallery Image ${index + 1}"
                >

                <button
                    type="button"
                    class="remove-gallery-image"
                    data-index="${index}"
                >
                    ×
                </button>

            `;


            galleryPreview.appendChild(
                item
            );

        }
    );


    galleryPreview
        .querySelectorAll(
            ".remove-gallery-image"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(
                                this.dataset.index
                            );


                        galleryImages.splice(
                            index,
                            1
                        );


                        renderGallery();

                    }
                );

            }
        );

}


/*==================================================
GALLERY LOADING
==================================================*/

function renderGalleryLoading(count) {

    if (!galleryPreview) {

        return;

    }


    galleryPreview.innerHTML = `

        <div style="
            padding:20px;
            text-align:center;
        ">

            Uploading
            ${count}
            image(s)...

        </div>

    `;

}


/*==================================================
GET PRODUCT VALUE
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
GET SELECTED BADGE
==================================================*/

function getBadge() {

    const badge =
        document.querySelector(
            'input[name="productBadge"]:checked'
        );


    return badge
        ? badge.value
        : "none";

}


/*==================================================
GET PRODUCT DATA
==================================================*/

function getProductData(status) {

    const productName =
        getValue(
            "productName"
        );


    const price =
        getValue(
            "productPrice"
        );


    if (!productName) {

        alert(
            "Please enter Product Name."
        );

        return null;

    }


    if (!mainImageUrl) {

        alert(
            "Please upload a product image or add an Image URL."
        );

        return null;

    }


    const product = {

        title:
            productName,


        sku:
            getValue(
                "productSKU"
            ),


        category:
            getValue(
                "productCategory"
            ),


        brand:
            getValue(
                "productBrand"
            ),


        description:
            getValue(
                "productDescription"
            ),


        price:
            price,


        oldPrice:
            getValue(
                "productOldPrice"
            ),


        discount:
            getValue(
                "productDiscount"
            ),


        currency:
            getValue(
                "productCurrency"
            ) || "PKR",


        image:
            mainImageUrl,


        gallery:
            galleryImages,


        stockStatus:
            getValue(
                "stockStatus"
            ),


        stockQuantity:
            getValue(
                "stockQuantity"
            ),


        status:
            status,


        badge:
            getBadge(),


        rating:
            getValue(
                "productRating"
            ) || "5",


        reviewCount:
            getValue(
                "reviewCount"
            ) || "0",


        colors:
            getValue(
                "productColors"
            ),


        sizes:
            getValue(
                "productSizes"
            ),


        deliveryStatus:
            getValue(
                "deliveryStatus"
            ),


        deliveryText:
            getValue(
                "deliveryText"
            ),


        createdAt:
            Date.now(),


        updatedAt:
            Date.now()

    };


    return product;

}


/*==================================================
PUBLISH PRODUCT
==================================================*/

if (finalSaveProductBtn) {

    finalSaveProductBtn.addEventListener(
        "click",
        async function () {

            await saveProduct(
                "active"
            );

        }
    );

}


/*==================================================
SAVE DRAFT
==================================================*/

if (saveDraftBtn) {

    saveDraftBtn.addEventListener(
        "click",
        async function () {

            await saveProduct(
                "draft"
            );

        }
    );

}


/*==================================================
TOP SAVE BUTTON
==================================================*/

if (saveProductBtn) {

    saveProductBtn.addEventListener(
        "click",
        async function () {

            await saveProduct(
                "draft"
            );

        }
    );

}


/*==================================================
SAVE PRODUCT TO FIREBASE
==================================================*/

async function saveProduct(status) {

    const product =
        getProductData(
            status
        );


    if (!product) {

        return;

    }


    try {

        setButtonLoading(
            true,
            status
        );


        /*
        CREATE NEW PRODUCT ID
        */

        const productRef =
            push(
                ref(
                    database,
                    "products"
                )
            );


        /*
        SAVE PRODUCT
        */

        await set(
            productRef,
            product
        );


        /*
        SUCCESS
        */

        alert(
            status === "active"
                ? "Product Published Successfully ✅"
                : "Product Draft Saved Successfully ✅"
        );


        /*
        SAVE PRODUCT ID
        */

        localStorage.setItem(
            "lastProductId",
            productRef.key
        );


        /*
        SAVE LOCAL COPY
        */

        localStorage.setItem(
            "lastProduct",
            JSON.stringify({
                id:
                    productRef.key,
                ...product
            })
        );


        /*
        IF PUBLISHED
        */

        if (
            status === "active"
        ) {

            /*
            Go to Home Page
            */

            window.location.href =
                "index.html";

        }

    }

    catch (error) {

        console.error(
            "PRODUCT SAVE ERROR:",
            error
        );


        alert(
            "Product save failed:\n" +
            error.message
        );

    }

    finally {

        setButtonLoading(
            false,
            status
        );

    }

}


/*==================================================
PREVIEW PRODUCT
==================================================*/

if (previewProductBtn) {

    previewProductBtn.addEventListener(
        "click",
        function () {

            const product =
                getProductData(
                    "preview"
                );


            if (!product) {

                return;

            }


            localStorage.setItem(
                "productPreview",
                JSON.stringify(
                    product
                )
            );


            window.open(
                "product-preview.html",
                "_blank"
            );

        }
    );

}


/*==================================================
CANCEL
==================================================*/

if (cancelProductBtn) {

    cancelProductBtn.addEventListener(
        "click",
        function () {

            const confirmCancel =
                confirm(
                    "Are you sure you want to cancel?"
                );


            if (
                confirmCancel
            ) {

                window.history.back();

            }

        }
    );

}


/*==================================================
BUTTON LOADING
==================================================*/

function setButtonLoading(
    loading,
    status
) {

    if (
        !finalSaveProductBtn ||
        !saveDraftBtn
    ) {

        return;

    }


    if (loading) {

        finalSaveProductBtn.disabled =
            true;

        saveDraftBtn.disabled =
            true;


        if (status === "active") {

            finalSaveProductBtn.innerHTML =
                `<i class="fa-solid fa-spinner fa-spin"></i>
                 Publishing...`;

        }

        else {

            saveDraftBtn.innerHTML =
                `<i class="fa-solid fa-spinner fa-spin"></i>
                 Saving...`;

        }

    }

    else {

        finalSaveProductBtn.disabled =
            false;

        saveDraftBtn.disabled =
            false;


        finalSaveProductBtn.innerHTML =
            `<i class="fa-solid fa-check"></i>
             Publish Product`;


        saveDraftBtn.innerHTML =
            `<i class="fa-solid fa-file-pen"></i>
             Save Draft`;

    }

}


/*==================================================
UPLOAD STATUS
==================================================*/

function setUploadStatus(text) {

    if (!mainImagePreview) {

        return;

    }


    if (text) {

        const status =
            document.createElement(
                "div"
            );


        status.className =
            "image-upload-status";


        status.textContent =
            text;


        mainImagePreview.appendChild(
            status
        );

    }

}


/*==================================================
ESCAPE HTML
==================================================*/

function escapeHtml(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}


/*==================================================
INITIAL IMAGE URL
==================================================*/

if (productImageUrl) {

    productImageUrl.addEventListener(
        "change",
        function () {

            const url =
                this.value.trim();


            if (
                url.startsWith(
                    "http://"
                ) ||
                url.startsWith(
                    "https://"
                )
            ) {

                mainImageUrl =
                    url;


                showMainImage(
                    url
                );

            }

        }
    );

}


/*==================================================
DRAG & DROP — WHOLE MEDIA SECTION
==================================================*/

const mediaSection =
    document.querySelector(
        ".media-section"
    );


if (mediaSection) {

    mediaSection.addEventListener(
        "dragover",
        function (event) {

            event.preventDefault();

            this.classList.add(
                "drag-active"
            );

        }
    );


    mediaSection.addEventListener(
        "dragleave",
        function () {

            this.classList.remove(
                "drag-active"
            );

        }
    );


    mediaSection.addEventListener(
        "drop",
        async function (event) {

            event.preventDefault();


            this.classList.remove(
                "drag-active"
            );


            const files =
                Array.from(
                    event.dataTransfer.files
                );


            if (
                files.length === 0
            ) {

                return;

            }


            /*
            FIRST IMAGE = MAIN IMAGE
            */

            const firstImage =
                files.find(
                    file =>
                        file.type.startsWith(
                            "image/"
                        )
                );


            if (firstImage) {

                await handleMainImage(
                    firstImage
                );

            }


            /*
            REMAINING IMAGES = GALLERY
            */

            const remaining =
                files.filter(
                    file =>
                        file !==
                        firstImage &&
                        file.type.startsWith(
                            "image/"
                        )
                );


            if (
                remaining.length
            ) {

                for (
                    const file
                    of remaining
                ) {

                    try {

                        const url =
                            await uploadToCloudinary(
                                file
                            );


                        galleryImages.push(
                            url
                        );

                    }

                    catch (error) {

                        console.error(
                            error
                        );

                    }

                }


                renderGallery();

            }

        }
    );

}


/*==================================================
CONSOLE
==================================================*/

console.log(
    "SMARTBAZAAR PRO PRODUCT EDITOR READY ✓"
);
