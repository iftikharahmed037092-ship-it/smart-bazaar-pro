/*==================================================
SMARTBAZAAR PRO
PART 19.3
PRODUCT EDITOR ENGINE
FIREBASE REALTIME DATABASE + CLOUDINARY
==================================================*/


/*==================================================
IMPORT FIREBASE DATABASE
==================================================*/

import {
    getDatabase,
    ref,
    push,
    set,
    get,
    update,
    remove
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


/*==================================================
FIREBASE APP
==================================================*/

import {
    app
} from "./firebase-config.js";


/*==================================================
CLOUDINARY
==================================================*/

import {
    uploadImage,
    cloudName,
    uploadPreset
} from "./cloudinary-config.js";


/*==================================================
DATABASE
==================================================*/

const database =
    getDatabase(app);


/*==================================================
PRODUCTS REFERENCE
==================================================*/

const productsRef =
    ref(
        database,
        "products"
    );


/*==================================================
DOM
==================================================*/

const form =
    document.getElementById(
        "product-editor-form"
    );


const mainImageInput =
    document.getElementById(
        "main-product-image"
    );


const mainImagePreview =
    document.getElementById(
        "main-image-preview"
    );


const mainImageBox =
    document.getElementById(
        "main-image-upload-box"
    );


const galleryInput =
    document.getElementById(
        "product-gallery-images"
    );


const galleryGrid =
    document.getElementById(
        "gallery-upload-grid"
    );


const videoInput =
    document.getElementById(
        "product-video"
    );


const videoPreviewContainer =
    document.getElementById(
        "video-preview-container"
    );


/*==================================================
STATE
==================================================*/

let mainImageFile = null;

let galleryFiles = [];

let productVideoFile = null;

let currentProductId = null;

let existingMainImage = "";

let existingGallery = [];

let existingVideo = "";


/*==================================================
HELPERS
==================================================*/

function getValue(id) {

    return (
        document.getElementById(id)?.value ||
        ""
    );

}


function isChecked(id) {

    return (
        document.getElementById(id)?.checked ||
        false
    );

}


/*==================================================
PRODUCT ID
==================================================*/

function generateProductId() {

    return (
        "SB-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase()
    );

}


/*==================================================
MAIN IMAGE PREVIEW
==================================================*/

if (mainImageInput) {

    mainImageInput.addEventListener(
        "change",
        function () {

            const file =
                this.files?.[0];


            if (!file) {

                return;

            }


            if (
                !file.type ||
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Please select a valid image."
                );

                this.value = "";

                return;

            }


            if (
                file.size >
                10 * 1024 * 1024
            ) {

                alert(
                    "Main image must be smaller than 10MB."
                );

                this.value = "";

                return;

            }


            mainImageFile =
                file;


            const imageURL =
                URL.createObjectURL(
                    file
                );


            if (mainImagePreview) {

                mainImagePreview.src =
                    imageURL;

                mainImagePreview.style.display =
                    "block";

            }


            if (mainImageBox) {

                const placeholder =
                    mainImageBox.querySelector(
                        ".upload-placeholder"
                    );


                if (placeholder) {

                    placeholder.style.display =
                        "none";

                }

            }


            setImage(
                "card-preview-image",
                imageURL
            );


            setImage(
                "detail-preview-image",
                imageURL
            );


            updateLivePreview();

        }
    );

}


/*==================================================
GALLERY IMAGE SELECT
==================================================*/

if (galleryInput) {

    galleryInput.addEventListener(
        "change",
        function () {

            const files =
                Array.from(
                    this.files || []
                );


            if (!files.length) {

                return;

            }


            files.forEach(
                file => {

                    if (
                        !file.type ||
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {

                        return;

                    }


                    if (
                        file.size >
                        10 * 1024 * 1024
                    ) {

                        return;

                    }


                    galleryFiles.push(
                        file
                    );

                }
            );


            renderGallery();


            this.value = "";

        }
    );

}


/*==================================================
RENDER GALLERY
==================================================*/

function renderGallery() {

    if (!galleryGrid) {

        return;

    }


    const uploadButton =
        galleryGrid.querySelector(
            ".gallery-upload-button"
        );


    galleryGrid
        .querySelectorAll(
            ".gallery-preview-item"
        )
        .forEach(
            item =>
                item.remove()
        );


    galleryFiles.forEach(
        (
            file,
            index
        ) => {

            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "gallery-preview-item";


            const image =
                document.createElement(
                    "img"
                );


            image.src =
                URL.createObjectURL(
                    file
                );


            image.alt =
                "Gallery image";


            const removeButton =
                document.createElement(
                    "button"
                );


            removeButton.type =
                "button";


            removeButton.innerHTML =
                '<i class="fa-solid fa-xmark"></i>';


            removeButton.addEventListener(
                "click",
                function () {

                    galleryFiles.splice(
                        index,
                        1
                    );


                    renderGallery();

                }
            );


            wrapper.appendChild(
                image
            );


            wrapper.appendChild(
                removeButton
            );


            if (uploadButton) {

                galleryGrid.insertBefore(
                    wrapper,
                    uploadButton
                );

            }
            else {

                galleryGrid.appendChild(
                    wrapper
                );

            }

        }
    );

}


/*==================================================
VIDEO SELECT
==================================================*/

if (videoInput) {

    videoInput.addEventListener(
        "change",
        function () {

            const file =
                this.files?.[0];


            if (!file) {

                return;

            }


            if (
                !file.type ||
                !file.type.startsWith(
                    "video/"
                )
            ) {

                alert(
                    "Please select a valid video."
                );

                this.value = "";

                return;

            }


            productVideoFile =
                file;


            renderVideo();

        }
    );

}


/*==================================================
VIDEO PREVIEW
==================================================*/

function renderVideo() {

    if (!videoPreviewContainer) {

        return;

    }


    videoPreviewContainer.innerHTML =
        "";


    if (!productVideoFile) {

        return;

    }


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "product-video-preview";


    const video =
        document.createElement(
            "video"
        );


    video.controls =
        true;

    video.preload =
        "metadata";

    video.playsInline =
        true;


    video.src =
        URL.createObjectURL(
            productVideoFile
        );


    video.style.width =
        "100%";


    video.style.maxWidth =
        "700px";


    video.style.display =
        "block";


    wrapper.appendChild(
        video
    );


    videoPreviewContainer.appendChild(
        wrapper
    );

}


/*==================================================
CLOUDINARY VIDEO UPLOAD
==================================================*/

async function uploadVideoToCloudinary(
    file
) {

    if (!file) {

        return null;

    }


    if (
        !file.type ||
        !file.type.startsWith(
            "video/"
        )
    ) {

        throw new Error(
            "Invalid video file."
        );

    }


    const maxSize =
        100 * 1024 * 1024;


    if (file.size > maxSize) {

        throw new Error(
            "Video must be smaller than 100MB."
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
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;


    const response =
        await fetch(
            uploadURL,
            {
                method: "POST",
                body: formData
            }
        );


    let data = {};


    try {

        data =
            await response.json();

    }
    catch (error) {

        throw new Error(
            "Cloudinary video response could not be read."
        );

    }


    if (!response.ok) {

        throw new Error(
            data?.error?.message ||
            "Video upload failed."
        );

    }


    if (!data.secure_url) {

        throw new Error(
            "Cloudinary did not return video URL."
        );

    }


    return data.secure_url;

}


/*==================================================
GET PRODUCT DATA
==================================================*/

function getProductData() {

    if (!form) {

        return {};

    }


    const formData =
        new FormData(
            form
        );


    return {

        productName:
            formData.get(
                "productName"
            ) || "",


        brand:
            formData.get(
                "brand"
            ) || "",


        category:
            formData.get(
                "category"
            ) || "",


        subcategory:
            formData.get(
                "subcategory"
            ) || "",


        condition:
            formData.get(
                "condition"
            ) || "new",


        shortDescription:
            formData.get(
                "shortDescription"
            ) || "",


        regularPrice:
            Number(
                formData.get(
                    "regularPrice"
                ) || 0
            ),


        salePrice:
            Number(
                formData.get(
                    "salePrice"
                ) || 0
            ),


        discountType:
            formData.get(
                "discountType"
            ) || "none",


        discountValue:
            Number(
                formData.get(
                    "discountValue"
                ) || 0
            ),


        featuredProduct:
            isChecked(
                "featured-product"
            ),


        sku:
            formData.get(
                "sku"
            ) || "",


        stockQuantity:
            Number(
                formData.get(
                    "stockQuantity"
                ) || 0
            ),


        lowStockLimit:
            Number(
                formData.get(
                    "lowStockLimit"
                ) || 0
            ),


        stockStatus:
            formData.get(
                "stockStatus"
            ) || "in-stock",


        manageStock:
            isChecked(
                "manage-stock"
            ),


        description:
            formData.get(
                "description"
            ) || "",


        features:
            formData.get(
                "features"
            ) || "",


        tags:
            formData.get(
                "tags"
            ) || "",


        shippingMethod:
            formData.get(
                "shippingMethod"
            ) || "standard",


        shippingCost:
            Number(
                formData.get(
                    "shippingCost"
                ) || 0
            ),


        deliveryTime:
            formData.get(
                "deliveryTime"
            ) || "",


        returnDays:
            Number(
                formData.get(
                    "returnDays"
                ) || 0
            ),


        shippingDescription:
            formData.get(
                "shippingDescription"
            ) || "",


        returnDescription:
            formData.get(
                "returnDescription"
            ) || "",


        seoTitle:
            formData.get(
                "seoTitle"
            ) || "",


        seoDescription:
            formData.get(
                "seoDescription"
            ) || "",


        seoKeywords:
            formData.get(
                "seoKeywords"
            ) || "",


        slug:
            formData.get(
                "slug"
            ) || "",


        productVisible:
            isChecked(
                "product-visible"
            ),


        allowReviews:
            isChecked(
                "allow-reviews"
            ),


        allowQuestions:
            isChecked(
                "allow-questions"
            ),


        showRelatedProducts:
            isChecked(
                "show-related-products"
            ),


        enableWishlist:
            isChecked(
                "enable-wishlist"
            )

    };

}


/*==================================================
VARIANTS
==================================================*/

function getVariants() {

    const rows =
        document.querySelectorAll(
            ".variant-editor-row"
        );


    return Array.from(
        rows
    )
    .map(
        row => {

            const name =
                row.querySelector(
                    '[name="variantName[]"]'
                )?.value
                    ?.trim() ||
                "";


            const options =
                row.querySelector(
                    '[name="variantOptions[]"]'
                )?.value ||
                "";


            return {

                name,

                options:
                    options
                        .split(",")
                        .map(
                            item =>
                                item.trim()
                        )
                        .filter(
                            Boolean
                        )

            };

        }
    )
    .filter(
        item =>
            item.name
    );

}


/*==================================================
SPECIFICATIONS
==================================================*/

function getSpecifications() {

    const rows =
        document.querySelectorAll(
            ".specification-row"
        );


    return Array.from(
        rows
    )
    .map(
        row => {

            const name =
                row.querySelector(
                    '[name="specificationName[]"]'
                )?.value
                    ?.trim() ||
                "";


            const value =
                row.querySelector(
                    '[name="specificationValue[]"]'
                )?.value
                    ?.trim() ||
                "";


            return {

                name,

                value

            };

        }
    )
    .filter(
        item =>
            item.name ||
            item.value
    );

}


/*==================================================
RELATED PRODUCTS
==================================================*/

function getRelatedProducts() {

    const container =
        document.getElementById(
            "selected-related-products"
        );


    if (!container) {

        return [];

    }


    const products =
        container.querySelectorAll(
            "[data-product-id]"
        );


    return Array.from(
        products
    )
    .map(
        item =>
            item.dataset.productId
    )
    .filter(
        Boolean
    );

}


/*==================================================
UPLOAD MAIN IMAGE
==================================================*/

async function uploadMainImage() {

    if (!mainImageFile) {

        return existingMainImage ||
            "";

    }


    return await uploadImage(
        mainImageFile
    );

}


/*==================================================
UPLOAD GALLERY
==================================================*/

async function uploadGallery() {

    const uploadedGallery =
        [
            ...existingGallery
        ];


    for (
        const file
        of galleryFiles
    ) {

        const url =
            await uploadImage(
                file
            );


        if (url) {

            uploadedGallery.push(
                url
            );

        }

    }


    return uploadedGallery;

}


/*==================================================
SAVE PRODUCT
==================================================*/

async function saveProduct(
    publish = false
) {

    if (!form) {

        return;

    }


    if (!form.checkValidity()) {

        form.reportValidity();

        return;

    }


    showLoading(
        publish
            ? "Publishing product..."
            : "Saving product..."
    );


    try {

        /*========================================
        PRODUCT ID
        ========================================*/

        if (!currentProductId) {

            currentProductId =
                generateProductId();

        }


        /*========================================
        BASIC DATA
        ========================================*/

        const product =
            getProductData();


        product.productId =
            currentProductId;


        /*========================================
        VARIANTS
        ========================================*/

        product.variants =
            getVariants();


        /*========================================
        SPECIFICATIONS
        ========================================*/

        product.specifications =
            getSpecifications();


        /*========================================
        RELATED PRODUCTS
        ========================================*/

        product.relatedProducts =
            getRelatedProducts();


        /*========================================
        MAIN IMAGE
        ========================================*/

        product.mainImage =
            await uploadMainImage();


        /*========================================
        GALLERY
        ========================================*/

        product.gallery =
            await uploadGallery();


        /*========================================
        VIDEO
        ========================================*/

        product.video =
            existingVideo ||
            "";


        if (productVideoFile) {

            product.video =
                await uploadVideoToCloudinary(
                    productVideoFile
                );

        }


        /*========================================
        STATUS
        ========================================*/

        product.status =
            publish
                ? "published"
                : "draft";


        product.updatedAt =
            new Date().toISOString();


        /*========================================
        CREATED AT
        ========================================*/

        let productRef;


        const existingRef =
            ref(
                database,
                `products/${currentProductId}`
            );


        const existingSnapshot =
            await get(
                existingRef
            );


        if (existingSnapshot.exists()) {

            const oldProduct =
                existingSnapshot.val();


            product.createdAt =
                oldProduct.createdAt ||
                new Date().toISOString();


            await update(
                existingRef,
                product
            );


            productRef =
                existingRef;

        }
        else {

            product.createdAt =
                new Date().toISOString();


            await set(
                existingRef,
                product
            );


            productRef =
                existingRef;

        }


        /*========================================
        PRODUCT ID UI
        ========================================*/

        const productIdElement =
            document.getElementById(
                "product-id"
            );


        if (productIdElement) {

            productIdElement.textContent =
                currentProductId;

        }


        /*========================================
        STATUS UI
        ========================================*/

        updateProductStatus(
            publish
                ? "Published"
                : "Draft"
        );


        /*========================================
        CLEAR NEW FILES
        ========================================*/

        mainImageFile =
            null;


        galleryFiles =
            [];


        productVideoFile =
            null;


        existingMainImage =
            product.mainImage ||
            "";


        existingGallery =
            Array.isArray(
                product.gallery
            )
                ? product.gallery
                : [];


        existingVideo =
            product.video ||
            "";


        /*========================================
        TOAST
        ========================================*/

        showToast(
            publish
                ? "Product Published"
                : "Product Saved"
        );


        console.log(
            "PRODUCT SAVED:",
            currentProductId
        );


        return currentProductId;

    }
    catch (error) {

        console.error(
            "PRODUCT SAVE ERROR:",
            error
        );


        alert(
            "Product save failed.\n\n" +
            (
                error?.message ||
                "Unknown error"
            )
        );

    }
    finally {

        hideLoading();

    }

}


/*==================================================
SAVE DRAFT BUTTON
==================================================*/

document
    .getElementById(
        "save-draft-button"
    )
    ?.addEventListener(
        "click",
        () => {

            saveProduct(
                false
            );

        }
    );


/*==================================================
LARGE SAVE DRAFT BUTTON
==================================================*/

document
    .getElementById(
        "save-draft-large-button"
    )
    ?.addEventListener(
        "click",
        () => {

            saveProduct(
                false
            );

        }
    );


/*==================================================
HEADER PUBLISH
==================================================*/

document
    .getElementById(
        "publish-product-button"
    )
    ?.addEventListener(
        "click",
        () => {

            saveProduct(
                true
            );

        }
    );


/*==================================================
LARGE PUBLISH
==================================================*/

document
    .getElementById(
        "publish-large-button"
    )
    ?.addEventListener(
        "click",
        event => {

            event.preventDefault();


            saveProduct(
                true
            );

        }
    );


/*==================================================
FORM SUBMIT
==================================================*/

form?.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        saveProduct(
            true
        );

    }
);


/*==================================================
LIVE PREVIEW
==================================================*/

function updateLivePreview() {

    const name =
        getValue(
            "product-name"
        )
        .trim() ||
        "Product Name";


    const brand =
        getValue(
            "product-brand"
        )
        .trim() ||
        "BRAND";


    const regularPrice =
        Number(
            getValue(
                "regular-price"
            ) ||
            0
        );


    const salePriceInput =
        getValue(
            "sale-price"
        );


    const salePrice =
        salePriceInput
            ? Number(
                salePriceInput
            )
            : regularPrice;


    const description =
        getValue(
            "product-description"
        )
        .trim() ||
        "Product description will appear here.";


    const stockStatus =
        getValue(
            "stock-status"
        ) ||
        "in-stock";


    setText(
        "card-preview-name",
        name
    );


    setText(
        "detail-preview-name",
        name
    );


    setText(
        "card-preview-brand",
        brand
    );


    setText(
        "detail-preview-brand",
        brand
    );


    setText(
        "card-preview-price",
        `PKR ${salePrice.toLocaleString()}`
    );


    setText(
        "detail-preview-price",
        `PKR ${salePrice.toLocaleString()}`
    );


    setText(
        "detail-preview-description",
        description
    );


    updatePreviewStock(
        stockStatus
    );


    if (
        mainImagePreview?.src &&
        mainImagePreview.style.display !==
            "none"
    ) {

        setImage(
            "card-preview-image",
            mainImagePreview.src
        );


        setImage(
            "detail-preview-image",
            mainImagePreview.src
        );

    }

}


/*==================================================
PREVIEW STOCK
==================================================*/

function updatePreviewStock(
    status
) {

    const stockElement =
        document.querySelector(
            ".detail-preview-stock"
        );


    if (!stockElement) {

        return;

    }


    if (
        status ===
        "out-of-stock"
    ) {

        stockElement.innerHTML = `
            <i class="fa-solid fa-circle"></i>
            Out of Stock
        `;

    }
    else if (
        status ===
        "pre-order"
    ) {

        stockElement.innerHTML = `
            <i class="fa-solid fa-circle"></i>
            Pre Order
        `;

    }
    else {

        stockElement.innerHTML = `
            <i class="fa-solid fa-circle"></i>
            In Stock
        `;

    }

}


/*==================================================
TEXT HELPER
==================================================*/

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


/*==================================================
IMAGE HELPER
==================================================*/

function setImage(
    id,
    src
) {

    const image =
        document.getElementById(
            id
        );


    if (
        !image ||
        !src
    ) {

        return;

    }


    image.src =
        src;


    image.style.display =
        "block";


    const placeholder =
        image.parentElement
            ?.querySelector(
                ".preview-image-placeholder"
            );


    if (placeholder) {

        placeholder.style.display =
            "none";

    }

}


/*==================================================
LIVE INPUT
==================================================*/

form?.addEventListener(
    "input",
    () => {

        updateLivePreview();

    }
);


/*==================================================
PREVIEW BUTTON
==================================================*/

function openPreview() {

    updateLivePreview();


    document
        .getElementById(
            "live-preview-panel"
        )
        ?.classList.add(
            "active"
        );

}


document
    .getElementById(
        "preview-button"
    )
    ?.addEventListener(
        "click",
        openPreview
    );


document
    .getElementById(
        "mobile-preview-floating-button"
    )
    ?.addEventListener(
        "click",
        openPreview
    );


/*==================================================
CLOSE PREVIEW
==================================================*/

document
    .getElementById(
        "close-preview-button"
    )
    ?.addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "live-preview-panel"
                )
                ?.classList.remove(
                    "active"
                );

        }
    );


/*==================================================
PREVIEW TABS
==================================================*/

document
    .querySelectorAll(
        ".preview-tab"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".preview-tab"
                        )
                        .forEach(
                            btn =>
                                btn.classList.remove(
                                    "active"
                                )
                        );


                    document
                        .querySelectorAll(
                            ".preview-content"
                        )
                        .forEach(
                            content =>
                                content.classList.remove(
                                    "active"
                                )
                        );


                    this.classList.add(
                        "active"
                    );


                    const type =
                        this.dataset.preview;


                    document
                        .getElementById(
                            `${type}-preview`
                        )
                        ?.classList.add(
                            "active"
                        );

                }
            );

        }
    );


/*==================================================
ADD VARIANT
==================================================*/

document
    .getElementById(
        "add-variant-button"
    )
    ?.addEventListener(
        "click",
        () => {

            const container =
                document.getElementById(
                    "variants-container"
                );


            if (!container) {

                return;

            }


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "variant-editor-row";


            row.innerHTML = `

                <div class="form-group">

                    <label>
                        Option Name
                    </label>

                    <input
                        type="text"
                        name="variantName[]"
                        placeholder="e.g. Size"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Options
                    </label>

                    <input
                        type="text"
                        name="variantOptions[]"
                        placeholder="Small, Medium, Large"
                    >

                </div>


                <button
                    type="button"
                    class="remove-variant-button"
                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            `;


            container.appendChild(
                row
            );

        }
    );


/*==================================================
REMOVE VARIANT
==================================================*/

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".remove-variant-button"
            );


        if (!button) {

            return;

        }


        const rows =
            document.querySelectorAll(
                ".variant-editor-row"
            );


        if (
            rows.length <= 1
        ) {

            const inputs =
                button.closest(
                    ".variant-editor-row"
                )
                ?.querySelectorAll(
                    "input"
                );


            inputs?.forEach(
                input => {
                    input.value = "";
                }
            );


            return;

        }


        button
            .closest(
                ".variant-editor-row"
            )
            ?.remove();

    }
);


/*==================================================
ADD SPECIFICATION
==================================================*/

document
    .getElementById(
        "add-specification-button"
    )
    ?.addEventListener(
        "click",
        () => {

            const container =
                document.getElementById(
                    "specifications-editor"
                );


            if (!container) {

                return;

            }


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "specification-row";


            row.innerHTML = `

                <input
                    type="text"
                    name="specificationName[]"
                    placeholder="Specification"
                >


                <input
                    type="text"
                    name="specificationValue[]"
                    placeholder="Value"
                >


                <button
                    type="button"
                    class="remove-specification-button"
                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            `;


            container.appendChild(
                row
            );

        }
    );


/*==================================================
REMOVE SPECIFICATION
==================================================*/

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".remove-specification-button"
            );


        if (!button) {

            return;

        }


        const rows =
            document.querySelectorAll(
                ".specification-row"
            );


        if (
            rows.length <= 1
        ) {

            const inputs =
                button.closest(
                    ".specification-row"
                )
                ?.querySelectorAll(
                    "input"
                );


            inputs?.forEach(
                input => {
                    input.value = "";
                }
            );


            return;

        }


        button
            .closest(
                ".specification-row"
            )
            ?.remove();

    }
);


/*==================================================
NAVIGATION
==================================================*/

document
    .querySelectorAll(
        ".editor-nav-item"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".editor-nav-item"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    this.classList.add(
                        "active"
                    );


                    const section =
                        document.getElementById(
                            this.dataset.section
                        );


                    if (section) {

                        section.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }

                }
            );

        }
    );


/*==================================================
DELETE MODAL
==================================================*/

const deleteModal =
    document.getElementById(
        "delete-product-modal"
    );


document
    .getElementById(
        "delete-product-button"
    )
    ?.addEventListener(
        "click",
        () => {

            deleteModal?.classList.add(
                "active"
            );

        }
    );


document
    .querySelectorAll(
        "[data-close-modal]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    deleteModal?.classList.remove(
                        "active"
                    );

                }
            );

        }
    );


/*==================================================
CONFIRM DELETE
==================================================*/

document
    .getElementById(
        "confirm-delete-button"
    )
    ?.addEventListener(
        "click",
        async () => {

            if (!currentProductId) {

                deleteModal?.classList.remove(
                    "active"
                );


                alert(
                    "No product selected."
                );


                return;

            }


            showLoading(
                "Deleting product..."
            );


            try {

                await remove(
                    ref(
                        database,
                        `products/${currentProductId}`
                    )
                );


                deleteModal?.classList.remove(
                    "active"
                );


                showToast(
                    "Product Deleted"
                );


                setTimeout(
                    () => {

                        window.location.href =
                            "admin-dashboard.html";

                    },
                    1000
                );

            }
            catch (error) {

                console.error(
                    "DELETE ERROR:",
                    error
                );


                alert(
                    "Delete failed.\n\n" +
                    (
                        error?.message ||
                        "Unknown error"
                    )
                );

            }
            finally {

                hideLoading();

            }

        }
    );


/*==================================================
STATUS
==================================================*/

function updateProductStatus(
    status
) {

    const element =
        document.querySelector(
            ".product-status"
        );


    if (!element) {

        return;

    }


    element.textContent =
        status;


    element.classList.remove(
        "draft"
    );


    if (
        status.toLowerCase() ===
        "draft"
    ) {

        element.classList.add(
            "draft"
        );

    }

}


/*==================================================
TOAST
==================================================*/

function showToast(
    title
) {

    const toast =
        document.getElementById(
            "editor-toast"
        );


    if (!toast) {

        return;

    }


    const strong =
        toast.querySelector(
            "strong"
        );


    if (strong) {

        strong.textContent =
            title;

    }


    toast.classList.add(
        "active"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "active"
            );

        },
        3000
    );

}


/*==================================================
LOADING
==================================================*/

function showLoading(
    text
) {

    const loading =
        document.getElementById(
            "editor-loading"
        );


    if (!loading) {

        return;

    }


    const paragraph =
        loading.querySelector(
            "p"
        );


    if (paragraph) {

        paragraph.textContent =
            text;

    }


    loading.classList.add(
        "active"
    );

}


function hideLoading() {

    document
        .getElementById(
            "editor-loading"
        )
        ?.classList.remove(
            "active"
        );

}


/*==================================================
LOAD PRODUCT FOR EDIT
==================================================*/

async function loadProduct(
    productId
) {

    if (!productId) {

        return;

    }


    showLoading(
        "Loading product..."
    );


    try {

        const productSnapshot =
            await get(
                ref(
                    database,
                    `products/${productId}`
                )
            );


        if (!productSnapshot.exists()) {

            alert(
                "Product not found."
            );


            return;

        }


        const product =
            productSnapshot.val();


        currentProductId =
            productId;


        existingMainImage =
            product.mainImage ||
            "";


        existingGallery =
            Array.isArray(
                product.gallery
            )
                ? product.gallery
                : [];


        existingVideo =
            product.video ||
            "";


        fillProductForm(
            product
        );


        renderExistingMedia(
            product
        );


        updateProductStatus(
            product.status ===
                "published"
                ? "Published"
                : "Draft"
        );


        const productIdElement =
            document.getElementById(
                "product-id"
            );


        if (productIdElement) {

            productIdElement.textContent =
                productId;

        }


        updateLivePreview();

    }
    catch (error) {

        console.error(
            "LOAD PRODUCT ERROR:",
            error
        );


        alert(
            "Product loading failed.\n\n" +
            (
                error?.message ||
                "Unknown error"
            )
        );

    }
    finally {

        hideLoading();

    }

}


/*==================================================
FILL PRODUCT FORM
==================================================*/

function fillProductForm(
    product
) {

    const fieldMap = {

        "product-name":
            product.productName,

        "product-brand":
            product.brand,

        "product-category":
            product.category,

        "product-subcategory":
            product.subcategory,

        "product-condition":
            product.condition,

        "short-description":
            product.shortDescription,

        "regular-price":
            product.regularPrice,

        "sale-price":
            product.salePrice,

        "discount-type":
            product.discountType,

        "discount-value":
            product.discountValue,

        "sku":
            product.sku,

        "stock-quantity":
            product.stockQuantity,

        "low-stock-limit":
            product.lowStockLimit,

        "stock-status":
            product.stockStatus,

        "product-description":
            product.description,

        "product-features":
            product.features,

        "product-tags":
            product.tags,

        "shipping-method":
            product.shippingMethod,

        "shipping-cost":
            product.shippingCost,

        "delivery-time":
            product.deliveryTime,

        "return-days":
            product.returnDays,

        "shipping-description":
            product.shippingDescription,

        "return-description":
            product.returnDescription,

        "seo-title":
            product.seoTitle,

        "seo-description":
            product.seoDescription,

        "seo-keywords":
            product.seoKeywords,

        "product-slug":
            product.slug

    };


    Object.entries(
        fieldMap
    )
    .forEach(
        (
            [
                id,
                value
            ]
        ) => {

            const element =
                document.getElementById(
                    id
                );


            if (
                element &&
                value !== undefined &&
                value !== null
            ) {

                element.value =
                    value;

            }

        }
    );


    setChecked(
        "featured-product",
        product.featuredProduct
    );


    setChecked(
        "manage-stock",
        product.manageStock
    );


    setChecked(
        "product-visible",
        product.productVisible
    );


    setChecked(
        "allow-reviews",
        product.allowReviews
    );


    setChecked(
        "allow-questions",
        product.allowQuestions
    );


    setChecked(
        "show-related-products",
        product.showRelatedProducts
    );


    setChecked(
        "enable-wishlist",
        product.enableWishlist
    );


    loadVariants(
        product.variants
    );


    loadSpecifications(
        product.specifications
    );

}


/*==================================================
CHECKBOX HELPER
==================================================*/

function setChecked(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.checked =
            Boolean(
                value
            );

    }

}


/*==================================================
LOAD VARIANTS
==================================================*/

function loadVariants(
    variants
) {

    const container =
        document.getElementById(
            "variants-container"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    const list =
        Array.isArray(
            variants
        )
            ? variants
            : [];


    if (!list.length) {

        addEmptyVariantRow();

        return;

    }


    list.forEach(
        variant => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "variant-editor-row";


            row.innerHTML = `

                <div class="form-group">

                    <label>
                        Option Name
                    </label>

                    <input
                        type="text"
                        name="variantName[]"
                        placeholder="e.g. Color"
                        value="${escapeAttribute(
                            variant.name || ""
                        )}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        Options
                    </label>

                    <input
                        type="text"
                        name="variantOptions[]"
                        placeholder="Black, White, Blue"
                        value="${escapeAttribute(
                            (
                                variant.options ||
                                []
                            ).join(", ")
                        )}"
                    >

                </div>


                <button
                    type="button"
                    class="remove-variant-button"
                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            `;


            container.appendChild(
                row
            );

        }
    );

}


/*==================================================
EMPTY VARIANT
==================================================*/

function addEmptyVariantRow() {

    const container =
        document.getElementById(
            "variants-container"
        );


    if (!container) {

        return;

    }


    const row =
        document.createElement(
            "div"
        );


    row.className =
        "variant-editor-row";


    row.innerHTML = `

        <div class="form-group">

            <label>
                Option Name
            </label>

            <input
                type="text"
                name="variantName[]"
                placeholder="e.g. Color"
            >

        </div>


        <div class="form-group">

            <label>
                Options
            </label>

            <input
                type="text"
                name="variantOptions[]"
                placeholder="Black, White, Blue"
            >

        </div>


        <button
            type="button"
            class="remove-variant-button"
        >

            <i class="fa-solid fa-trash"></i>

        </button>

    `;


    container.appendChild(
        row
    );

}


/*==================================================
LOAD SPECIFICATIONS
==================================================*/

function loadSpecifications(
    specifications
) {

    const container =
        document.getElementById(
            "specifications-editor"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    const list =
        Array.isArray(
            specifications
        )
            ? specifications
            : [];


    if (!list.length) {

        addEmptySpecificationRow();

        return;

    }


    list.forEach(
        specification => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "specification-row";


            row.innerHTML = `

                <input
                    type="text"
                    name="specificationName[]"
                    placeholder="Specification"
                    value="${escapeAttribute(
                        specification.name || ""
                    )}"
                >


                <input
                    type="text"
                    name="specificationValue[]"
                    placeholder="Value"
                    value="${escapeAttribute(
                        specification.value || ""
                    )}"
                >


                <button
                    type="button"
                    class="remove-specification-button"
                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            `;


            container.appendChild(
                row
            );

        }
    );

}


/*==================================================
EMPTY SPECIFICATION
==================================================*/

function addEmptySpecificationRow() {

    const container =
        document.getElementById(
            "specifications-editor"
        );


    if (!container) {

        return;

    }


    const row =
        document.createElement(
            "div"
        );


    row.className =
        "specification-row";


    row.innerHTML = `

        <input
            type="text"
            name="specificationName[]"
            placeholder="Specification"
        >


        <input
            type="text"
            name="specificationValue[]"
            placeholder="Value"
        >


        <button
            type="button"
            class="remove-specification-button"
        >

            <i class="fa-solid fa-trash"></i>

        </button>

    `;


    container.appendChild(
        row
    );

}


/*==================================================
RENDER EXISTING MEDIA
==================================================*/

function renderExistingMedia(
    product
) {

    if (
        product.mainImage
    ) {

        if (mainImagePreview) {

            mainImagePreview.src =
                product.mainImage;

            mainImagePreview.style.display =
                "block";

        }


        const placeholder =
            mainImageBox?.querySelector(
                ".upload-placeholder"
            );


        if (placeholder) {

            placeholder.style.display =
                "none";

        }

    }


    if (
        Array.isArray(
            product.gallery
        )
    ) {

        renderExistingGallery(
            product.gallery
        );

    }


    if (
        product.video
    ) {

        renderExistingVideo(
            product.video
        );

    }

}


/*==================================================
EXISTING GALLERY
==================================================*/

function renderExistingGallery(
    gallery
) {

    if (!galleryGrid) {

        return;

    }


    const uploadButton =
        galleryGrid.querySelector(
            ".gallery-upload-button"
        );


    galleryGrid
        .querySelectorAll(
            ".gallery-existing-item"
        )
        .forEach(
            item =>
                item.remove()
        );


    gallery.forEach(
        (
            url,
            index
        ) => {

            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "gallery-preview-item gallery-existing-item";


            const image =
                document.createElement(
                    "img"
                );


            image.src =
                url;


            image.alt =
                "Product gallery";


            const removeButton =
                document.createElement(
                    "button"
                );


            removeButton.type =
                "button";


            removeButton.innerHTML =
                '<i class="fa-solid fa-xmark"></i>';


            removeButton.addEventListener(
                "click",
                () => {

                    existingGallery.splice(
                        index,
                        1
                    );


                    wrapper.remove();

                }
            );


            wrapper.appendChild(
                image
            );


            wrapper.appendChild(
                removeButton
            );


            if (uploadButton) {

                galleryGrid.insertBefore(
                    wrapper,
                    uploadButton
                );

            }
            else {

                galleryGrid.appendChild(
                    wrapper
                );

            }

        }
    );

}


/*==================================================
EXISTING VIDEO
==================================================*/

function renderExistingVideo(
    url
) {

    if (!videoPreviewContainer) {

        return;

    }


    videoPreviewContainer.innerHTML =
        "";


    const video =
        document.createElement(
            "video"
        );


    video.controls =
        true;


    video.preload =
        "metadata";


    video.playsInline =
        true;


    video.src =
        url;


    video.style.width =
        "100%";


    video.style.maxWidth =
        "700px";


    videoPreviewContainer.appendChild(
        video
    );

}


/*==================================================
ESCAPE ATTRIBUTE
==================================================*/

function escapeAttribute(
    value
) {

    return String(
        value
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    );

}


/*==================================================
DUPLICATE PRODUCT
==================================================*/

document
    .getElementById(
        "duplicate-product-button"
    )
    ?.addEventListener(
        "click",
        async () => {

            try {

                const product =
                    getProductData();


                product.productId =
                    generateProductId();


                product.variants =
                    getVariants();


                product.specifications =
                    getSpecifications();


                product.relatedProducts =
                    getRelatedProducts();


                product.mainImage =
                    existingMainImage ||
                    "";


                product.gallery =
                    [
                        ...existingGallery
                    ];


                product.video =
                    existingVideo ||
                    "";


                product.status =
                    "draft";


                product.createdAt =
                    new Date().toISOString();


                product.updatedAt =
                    new Date().toISOString();


                await set(
                    ref(
                        database,
                        `products/${product.productId}`
                    ),
                    product
                );


                showToast(
                    "Product Duplicated"
                );


                currentProductId =
                    product.productId;


                const productIdElement =
                    document.getElementById(
                        "product-id"
                    );


                if (productIdElement) {

                    productIdElement.textContent =
                        currentProductId;

                }

            }
            catch (error) {

                console.error(
                    "DUPLICATE ERROR:",
                    error
                );


                alert(
                    "Duplicate failed.\n\n" +
                    (
                        error?.message ||
                        "Unknown error"
                    )
                );

            }

        }
    );


/*==================================================
CANCEL
==================================================*/

document
    .getElementById(
        "cancel-editor-button"
    )
    ?.addEventListener(
        "click",
        () => {

            if (
                confirm(
                    "Are you sure you want to cancel?"
                )
            ) {

                window.location.href =
                    "admin-dashboard.html";

            }

        }
    );


/*==================================================
MENU BUTTON
==================================================*/

document
    .getElementById(
        "editor-menu-button"
    )
    ?.addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "editor-sidebar"
                )
                ?.classList.toggle(
                    "active"
                );

        }
    );


/*==================================================
CLOSE SIDEBAR AFTER NAVIGATION
==================================================*/

document
    .querySelectorAll(
        ".editor-nav-item"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    if (
                        window.innerWidth <=
                        900
                    ) {

                        document
                            .getElementById(
                                "editor-sidebar"
                            )
                            ?.classList.remove(
                                "active"
                            );

                    }

                }
            );

        }
    );


/*==================================================
LOAD PRODUCT FROM URL
==================================================*/

function getProductIdFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return (
        params.get(
            "id"
        ) ||
        params.get(
            "productId"
        )
    );

}


/*==================================================
INITIALIZE
==================================================*/

const urlProductId =
    getProductIdFromURL();


if (urlProductId) {

    loadProduct(
        urlProductId
    );

}
else {

    currentProductId =
        null;


    updateProductStatus(
        "Draft"
    );


    updateLivePreview();

}


console.log(
    "SmartBazaar Pro Product Editor loaded successfully."
);
