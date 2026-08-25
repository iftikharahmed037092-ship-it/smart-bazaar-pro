/*==================================================
SMARTBAZAAR PRO
PRODUCT EDITOR SYSTEM JAVASCRIPT
==================================================*/

/*==================================================
FEATURE: PRODUCT EDITOR
==================================================*/

/*
    Product Card + Product Detail
    دونوں اسی Editor سے manage ہوں گے.

    STORAGE:
    -----------------------------------------------
    Firebase Realtime Database
    → Product information
    → Prices
    → Description
    → Specifications
    → Variants
    → Shipping
    → Seller ID
    → Cloudinary image/video URLs

    Cloudinary
    → Product images
    → Product video
*/


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
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


/*==================================================
FIREBASE REALTIME DATABASE
==================================================*/

import {
    ref,
    get,
    set,
    update,
    push
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

let editingProductId = null;

let saving = false;


/*==================================================
MEDIA ARRAYS
==================================================*/

let productImages = [];

let productVideo = null;


/*==================================================
MAIN IMAGE
==================================================*/

let mainImageIndex = 0;


/*==================================================
UTILITY
==================================================*/

function $(selectors) {

    if (!Array.isArray(selectors)) {

        selectors = [selectors];

    }


    for (const selector of selectors) {

        const element =
            document.querySelector(selector);

        if (element) {

            return element;

        }

    }


    return null;

}


function $all(selectors) {

    if (!Array.isArray(selectors)) {

        selectors = [selectors];

    }


    for (const selector of selectors) {

        const elements =
            document.querySelectorAll(selector);

        if (elements.length) {

            return elements;

        }

    }


    return [];

}


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
DOM ELEMENTS
==================================================*/

const productForm =
    $("#productForm");


const productName =
    $("#productName");


const productTitle =
    $("#productTitle");


const shortDescription =
    $("#shortDescription");


const description =
    $("#description");


const category =
    $("#category");


const subCategory =
    $("#subCategory");


const brand =
    $("#brand");


const sku =
    $("#sku");


const price =
    $("#price");


const oldPrice =
    $("#oldPrice");


const discount =
    $("#discount");


const stock =
    $("#stock");


const condition =
    $("#condition");


const status =
    $("#status");


/*==================================================
MEDIA INPUTS
==================================================*/

const imageInput =
    $("#productImages");


const mainImageInput =
    $("#mainImage");


const videoInput =
    $("#productVideo");


const imageGallery =
    $("#imageGallery");


const videoPreview =
    $("#videoPreview");


const mainImagePreview =
    $("#mainImagePreview");


/*==================================================
SPECIFICATIONS
==================================================*/

const specificationsContainer =
    $("#specifications");


const addSpecificationBtn =
    $("#addSpecification");


/*==================================================
VARIANTS
==================================================*/

const variantsContainer =
    $("#variants");


const addVariantBtn =
    $("#addVariant");


/*==================================================
SHIPPING
==================================================*/

const shippingMethod =
    $("#shippingMethod");


const shippingCharges =
    $("#shippingCharges");


const deliveryTime =
    $("#deliveryTime");


const returnPolicy =
    $("#returnPolicy");


/*==================================================
CARD OPTIONS
==================================================*/

const productBadge =
    $("#productBadge");


const featuredProduct =
    $("#featuredProduct");


/*==================================================
BUTTONS
==================================================*/

const saveProductBtn =
    $([
        "#saveProductBtn",
        "#saveBtn",
        ".save-product-btn"
    ]);


const updateProductBtn =
    $([
        "#updateProductBtn",
        ".update-product-btn"
    ]);


const cancelBtn =
    $([
        "#cancelProductBtn",
        "#cancelBtn",
        ".cancel-product-btn"
    ]);


/*==================================================
MESSAGE
==================================================*/

const productMessage =
    $([
        "#productMessage",
        "#productEditorMessage",
        ".product-message"
    ]);


/*==================================================
MESSAGE SYSTEM
==================================================*/

function showMessage(
    message,
    type = "success"
) {

    if (!productMessage) {

        alert(message);

        return;

    }


    productMessage.textContent =
        message;


    productMessage.classList.add(
        "show"
    );


    productMessage.classList.remove(
        "success",
        "error",
        "warning"
    );


    productMessage.classList.add(
        type
    );


    clearTimeout(
        showMessage.timer
    );


    showMessage.timer =
        setTimeout(
            function() {

                productMessage.classList.remove(
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
    text = "Saving..."
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
            `
            <i class="fa-solid fa-spinner fa-spin"></i>
            ${text}
            `;

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
GENERATE PRODUCT ID
==================================================*/

function generateProductId() {

    return push(
        ref(
            database,
            "products"
        )
    ).key;

}


/*==================================================
CLOUDINARY UPLOAD
==================================================*/

async function uploadToCloudinary(
    file,
    resourceType = "image"
) {

    if (!file) {

        throw new Error(
            "No file selected."
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
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;


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
            "Cloudinary did not return a URL."
        );

    }


    return {

        url:
            data.secure_url,

        publicId:
            data.public_id || "",

        resourceType:
            data.resource_type || resourceType

    };

}


/*==================================================
IMAGE VALIDATION
==================================================*/

function validateImage(
    file
) {

    if (
        !file.type ||
        !file.type.startsWith(
            "image/"
        )
    ) {

        throw new Error(
            "Please select a valid image."
        );

    }


    const maxSize =
        10 * 1024 * 1024;


    if (
        file.size >
        maxSize
    ) {

        throw new Error(
            "Each image must be smaller than 10MB."
        );

    }

}


/*==================================================
VIDEO VALIDATION
==================================================*/

function validateVideo(
    file
) {

    if (
        !file.type ||
        !file.type.startsWith(
            "video/"
        )
    ) {

        throw new Error(
            "Please select a valid video."
        );

    }


    const maxSize =
        100 * 1024 * 1024;


    if (
        file.size >
        maxSize
    ) {

        throw new Error(
            "Video must be smaller than 100MB."
        );

    }

}


/*==================================================
IMAGE PREVIEW
==================================================*/

function renderImageGallery() {

    if (!imageGallery) {

        return;

    }


    imageGallery.innerHTML =
        "";


    productImages.forEach(
        function(image, index) {

            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "product-editor-image";


            wrapper.dataset.index =
                index;


            wrapper.innerHTML =
                `
                <img
                    src="${safeText(image.url)}"
                    alt="Product Image"
                >

                <button
                    type="button"
                    class="image-main-btn"
                    data-index="${index}"
                >
                    ${index === mainImageIndex
                        ? "Main"
                        : "Set Main"}
                </button>

                <button
                    type="button"
                    class="image-remove-btn"
                    data-index="${index}"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>
                `;


            imageGallery.appendChild(
                wrapper
            );

        }
    );


    imageGallery
        .querySelectorAll(
            ".image-main-btn"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        mainImageIndex =
                            Number(
                                this.dataset.index
                            );


                        renderImageGallery();

                    }
                );

            }
        );


    imageGallery
        .querySelectorAll(
            ".image-remove-btn"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        const index =
                            Number(
                                this.dataset.index
                            );


                        productImages.splice(
                            index,
                            1
                        );


                        if (
                            mainImageIndex >=
                            productImages.length
                        ) {

                            mainImageIndex =
                                Math.max(
                                    0,
                                    productImages.length - 1
                                );

                        }


                        renderImageGallery();

                    }
                );

            }
        );


    updateMainImagePreview();

}


/*==================================================
MAIN IMAGE PREVIEW
==================================================*/

function updateMainImagePreview() {

    if (
        !mainImagePreview
    ) {

        return;

    }


    const image =
        productImages[
            mainImageIndex
        ];


    if (!image) {

        mainImagePreview.style.display =
            "none";


        return;

    }


    mainImagePreview.src =
        image.url;


    mainImagePreview.style.display =
        "block";

}


/*==================================================
SELECT PRODUCT IMAGES
==================================================*/

if (imageInput) {

    imageInput.addEventListener(
        "change",
        async function() {

            const files =
                Array.from(
                    this.files || []
                );


            if (!files.length) {

                return;

            }


            try {

                showMessage(
                    "Uploading product images...",
                    "warning"
                );


                for (
                    const file of files
                ) {

                    validateImage(
                        file
                    );


                    const uploaded =
                        await uploadToCloudinary(
                            file,
                            "image"
                        );


                    productImages.push(
                        {

                            url:
                                uploaded.url,

                            publicId:
                                uploaded.publicId

                        }
                    );

                }


                if (
                    productImages.length ===
                    1
                ) {

                    mainImageIndex =
                        0;

                }


                renderImageGallery();


                showMessage(
                    "Product images uploaded successfully."
                );

            }
            catch(error) {

                console.error(
                    "IMAGE UPLOAD ERROR:",
                    error
                );


                showMessage(
                    error.message ||
                    "Image upload failed.",
                    "error"
                );

            }


            this.value =
                "";

        }
    );

}


/*==================================================
MAIN IMAGE DIRECT INPUT
==================================================*/

if (mainImageInput) {

    mainImageInput.addEventListener(
        "change",
        async function() {

            const file =
                this.files &&
                this.files[0];


            if (!file) {

                return;

            }


            try {

                validateImage(
                    file
                );


                showMessage(
                    "Uploading main image...",
                    "warning"
                );


                const uploaded =
                    await uploadToCloudinary(
                        file,
                        "image"
                    );


                productImages.unshift(
                    {

                        url:
                            uploaded.url,

                        publicId:
                            uploaded.publicId

                    }
                );


                mainImageIndex =
                    0;


                renderImageGallery();


                showMessage(
                    "Main image uploaded successfully."
                );

            }
            catch(error) {

                console.error(
                    error
                );


                showMessage(
                    error.message ||
                    "Main image upload failed.",
                    "error"
                );

            }


            this.value =
                "";

        }
    );

}


/*==================================================
PRODUCT VIDEO
==================================================*/

if (videoInput) {

    videoInput.addEventListener(
        "change",
        async function() {

            const file =
                this.files &&
                this.files[0];


            if (!file) {

                return;

            }


            try {

                validateVideo(
                    file
                );


                showMessage(
                    "Uploading product video...",
                    "warning"
                );


                const uploaded =
                    await uploadToCloudinary(
                        file,
                        "video"
                    );


                productVideo =
                    {

                        url:
                            uploaded.url,

                        publicId:
                            uploaded.publicId

                    };


                renderVideoPreview();


                showMessage(
                    "Product video uploaded successfully."
                );

            }
            catch(error) {

                console.error(
                    "VIDEO UPLOAD ERROR:",
                    error
                );


                showMessage(
                    error.message ||
                    "Video upload failed.",
                    "error"
                );

            }


            this.value =
                "";

        }
    );

}


/*==================================================
VIDEO PREVIEW
==================================================*/

function renderVideoPreview() {

    if (!videoPreview) {

        return;

    }


    if (
        !productVideo ||
        !productVideo.url
    ) {

        videoPreview.innerHTML =
            "";


        return;

    }


    videoPreview.innerHTML =
        `
        <video
            controls
            playsinline
            src="${productVideo.url}"
        ></video>

        <button
            type="button"
            id="removeProductVideo"
        >
            <i class="fa-solid fa-trash"></i>
            Remove Video
        </button>
        `;


    const removeButton =
        document.getElementById(
            "removeProductVideo"
        );


    if (removeButton) {

        removeButton.addEventListener(
            "click",
            function() {

                productVideo =
                    null;


                renderVideoPreview();

            }
        );

    }

}


/*==================================================
SPECIFICATIONS
==================================================*/

function getSpecifications() {

    if (!specificationsContainer) {

        return [];

    }


    const rows =
        specificationsContainer
            .querySelectorAll(
                ".specification-row"
            );


    const specifications =
        [];


    rows.forEach(
        function(row) {

            const key =
                row.querySelector(
                    ".spec-key"
                )?.value;


            const value =
                row.querySelector(
                    ".spec-value"
                )?.value;


            if (
                safeText(key).trim() ||
                safeText(value).trim()
            ) {

                specifications.push(
                    {

                        key:
                            safeText(
                                key
                            ).trim(),

                        value:
                            safeText(
                                value
                            ).trim()

                    }
                );

            }

        }
    );


    return specifications;

}


/*==================================================
ADD SPECIFICATION
==================================================*/

function addSpecification(
    key = "",
    value = ""
) {

    if (!specificationsContainer) {

        return;

    }


    const row =
        document.createElement(
            "div"
        );


    row.className =
        "specification-row";


    row.innerHTML =
        `
        <input
            type="text"
            class="spec-key"
            placeholder="Specification"
            value="${safeText(key)}"
        >

        <input
            type="text"
            class="spec-value"
            placeholder="Value"
            value="${safeText(value)}"
        >

        <button
            type="button"
            class="remove-specification"
        >
            <i class="fa-solid fa-trash"></i>
        </button>
        `;


    specificationsContainer.appendChild(
        row
    );


    row.querySelector(
        ".remove-specification"
    )?.addEventListener(
        "click",
        function() {

            row.remove();

        }
    );

}


if (addSpecificationBtn) {

    addSpecificationBtn.addEventListener(
        "click",
        function() {

            addSpecification();

        }
    );

}


/*==================================================
VARIANTS
==================================================*/

function getVariants() {

    if (!variantsContainer) {

        return [];

    }


    const rows =
        variantsContainer
            .querySelectorAll(
                ".variant-row"
            );


    const variants =
        [];


    rows.forEach(
        function(row) {

            const name =
                row.querySelector(
                    ".variant-name"
                )?.value;


            const value =
                row.querySelector(
                    ".variant-value"
                )?.value;


            const variantPrice =
                row.querySelector(
                    ".variant-price"
                )?.value;


            if (
                safeText(name).trim() ||
                safeText(value).trim()
            ) {

                variants.push(
                    {

                        name:
                            safeText(
                                name
                            ).trim(),

                        value:
                            safeText(
                                value
                            ).trim(),

                        price:
                            Number(
                                variantPrice
                            ) || 0

                    }
                );

            }

        }
    );


    return variants;

}


/*==================================================
ADD VARIANT
==================================================*/

function addVariant(
    name = "",
    value = "",
    variantPrice = ""
) {

    if (!variantsContainer) {

        return;

    }


    const row =
        document.createElement(
            "div"
        );


    row.className =
        "variant-row";


    row.innerHTML =
        `
        <input
            type="text"
            class="variant-name"
            placeholder="Variant name"
            value="${safeText(name)}"
        >

        <input
            type="text"
            class="variant-value"
            placeholder="Value"
            value="${safeText(value)}"
        >

        <input
            type="number"
            class="variant-price"
            placeholder="Price"
            value="${safeText(variantPrice)}"
        >

        <button
            type="button"
            class="remove-variant"
        >
            <i class="fa-solid fa-trash"></i>
        </button>
        `;


    variantsContainer.appendChild(
        row
    );


    row.querySelector(
        ".remove-variant"
    )?.addEventListener(
        "click",
        function() {

            row.remove();

        }
    );

}


if (addVariantBtn) {

    addVariantBtn.addEventListener(
        "click",
        function() {

            addVariant();

        }
    );

}


/*==================================================
COLLECT PRODUCT DATA
==================================================*/

function collectProductData() {

    const mainImage =
        productImages[
            mainImageIndex
        ] || null;


    return {

        sellerId:
            currentUser?.uid || "",


        title:
            safeText(
                productName?.value ||
                productTitle?.value
            ).trim(),


        shortDescription:
            safeText(
                shortDescription?.value
            ).trim(),


        description:
            safeText(
                description?.value
            ).trim(),


        category:
            safeText(
                category?.value
            ).trim(),


        subCategory:
            safeText(
                subCategory?.value
            ).trim(),


        brand:
            safeText(
                brand?.value
            ).trim(),


        sku:
            safeText(
                sku?.value
            ).trim(),


        price:
            Number(
                price?.value
            ) || 0,


        oldPrice:
            Number(
                oldPrice?.value
            ) || 0,


        discount:
            Number(
                discount?.value
            ) || 0,


        stock:
            Number(
                stock?.value
            ) || 0,


        condition:
            safeText(
                condition?.value
            ).trim(),


        status:
            safeText(
                status?.value
            ).trim() ||
            "active",


        mainImage:
            mainImage?.url ||
            "",


        images:
            productImages,


        video:
            productVideo || null,


        specifications:
            getSpecifications(),


        variants:
            getVariants(),


        shipping: {

            method:
                safeText(
                    shippingMethod?.value
                ).trim(),

            charges:
                Number(
                    shippingCharges?.value
                ) || 0,

            deliveryTime:
                safeText(
                    deliveryTime?.value
                ).trim(),

            returnPolicy:
                safeText(
                    returnPolicy?.value
                ).trim()

        },


        card: {

            badge:
                safeText(
                    productBadge?.value
                ).trim(),

            featured:
                Boolean(
                    featuredProduct?.checked
                )

        },


        updatedAt:
            Date.now()

    };

}


/*==================================================
VALIDATE PRODUCT
==================================================*/

function validateProduct(
    data
) {

    if (!data.title) {

        return "Please enter product name.";

    }


    if (
        !data.category
    ) {

        return "Please select a product category.";

    }


    if (
        data.price <= 0
    ) {

        return "Please enter a valid product price.";

    }


    if (
        data.stock < 0
    ) {

        return "Stock cannot be negative.";

    }


    if (
        !data.mainImage
    ) {

        return "Please upload at least one product image.";

    }


    return null;

}


/*==================================================
SAVE NEW PRODUCT
==================================================*/

async function createProduct() {

    if (
        !currentUser
    ) {

        throw new Error(
            "Please login first."
        );

    }


    const data =
        collectProductData();


    const validation =
        validateProduct(
            data
        );


    if (validation) {

        throw new Error(
            validation
        );

    }


    const productId =
        generateProductId();


    data.productId =
        productId;


    data.createdAt =
        Date.now();


    data.updatedAt =
        Date.now();


    const productRef =
        ref(
            database,
            "products/" +
            productId
        );


    await set(
        productRef,
        data
    );


    return productId;

}


/*==================================================
UPDATE EXISTING PRODUCT
==================================================*/

async function updateProductData() {

    if (
        !currentUser
    ) {

        throw new Error(
            "Please login first."
        );

    }


    if (
        !editingProductId
    ) {

        throw new Error(
            "Product ID not found."
        );

    }


    const productRef =
        ref(
            database,
            "products/" +
            editingProductId
        );


    const snapshot =
        await get(
            productRef
        );


    if (!snapshot.exists()) {

        throw new Error(
            "Product not found."
        );

    }


    const existing =
        snapshot.val();


    if (
        existing.sellerId !==
        currentUser.uid
    ) {

        throw new Error(
            "You are not allowed to edit this product."
        );

    }


    const data =
        collectProductData();


    const validation =
        validateProduct(
            data
        );


    if (validation) {

        throw new Error(
            validation
        );

    }


    data.productId =
        editingProductId;


    data.sellerId =
        existing.sellerId;


    data.createdAt =
        existing.createdAt ||
        Date.now();


    data.updatedAt =
        Date.now();


    await update(
        productRef,
        data
    );


    return editingProductId;

}


/*==================================================
SAVE BUTTON
==================================================*/

async function saveProduct() {

    if (
        saving
    ) {

        return;

    }


    saving =
        true;


    buttonLoading(
        saveProductBtn,
        true,
        editingProductId
            ? "Updating..."
            : "Saving..."
    );


    if (
        updateProductBtn &&
        updateProductBtn !==
        saveProductBtn
    ) {

        buttonLoading(
            updateProductBtn,
            true,
            "Updating..."
        );

    }


    try {

        let productId;


        if (
            editingProductId
        ) {

            productId =
                await updateProductData();

        }
        else {

            productId =
                await createProduct();

        }


        showMessage(
            "Product saved successfully."
        );


        /*
            Product Detail Page
            --------------------------------
            product-detail.html?id=PRODUCT_ID
        */

        setTimeout(
            function() {

                window.location.href =
                    `product-detail.html?id=${encodeURIComponent(productId)}`;

            },
            1000
        );

    }
    catch(error) {

        console.error(
            "PRODUCT SAVE ERROR:",
            error
        );


        showMessage(
            error?.message ||
            "Could not save product.",
            "error"
        );

    }
    finally {

        saving =
            false;


        buttonLoading(
            saveProductBtn,
            false
        );


        if (
            updateProductBtn &&
            updateProductBtn !==
            saveProductBtn
        ) {

            buttonLoading(
                updateProductBtn,
                false
            );

        }

    }

}


if (saveProductBtn) {

    saveProductBtn.addEventListener(
        "click",
        saveProduct
    );

}


if (updateProductBtn) {

    updateProductBtn.addEventListener(
        "click",
        saveProduct
    );

}


/*==================================================
LOAD EXISTING PRODUCT
==================================================*/

async function loadProduct(
    productId
) {

    if (
        !currentUser
    ) {

        return;

    }


    const productRef =
        ref(
            database,
            "products/" +
            productId
        );


    const snapshot =
        await get(
            productRef
        );


    if (!snapshot.exists()) {

        showMessage(
            "Product not found.",
            "error"
        );


        return;

    }


    const data =
        snapshot.val();


    if (
        data.sellerId !==
        currentUser.uid
    ) {

        showMessage(
            "You are not allowed to edit this product.",
            "error"
        );


        return;

    }


    editingProductId =
        productId;


    /*========================================
    BASIC DATA
    ========================================*/

    if (productName) {

        productName.value =
            safeText(
                data.title
            );

    }


    if (productTitle) {

        productTitle.value =
            safeText(
                data.title
            );

    }


    if (shortDescription) {

        shortDescription.value =
            safeText(
                data.shortDescription
            );

    }


    if (description) {

        description.value =
            safeText(
                data.description
            );

    }


    if (category) {

        category.value =
            safeText(
                data.category
            );

    }


    if (subCategory) {

        subCategory.value =
            safeText(
                data.subCategory
            );

    }


    if (brand) {

        brand.value =
            safeText(
                data.brand
            );

    }


    if (sku) {

        sku.value =
            safeText(
                data.sku
            );

    }


    if (price) {

        price.value =
            data.price ??
            "";

    }


    if (oldPrice) {

        oldPrice.value =
            data.oldPrice ??
            "";

    }


    if (discount) {

        discount.value =
            data.discount ??
            "";

    }


    if (stock) {

        stock.value =
            data.stock ??
            "";

    }


    if (condition) {

        condition.value =
            safeText(
                data.condition
            );

    }


    if (status) {

        status.value =
            safeText(
                data.status ||
                "active"
            );

    }


    /*========================================
    IMAGES
    ========================================*/

    productImages =
        Array.isArray(
            data.images
        )
            ? data.images
            : Object.values(
                data.images ||
                {}
            );


    mainImageIndex =
        productImages.findIndex(
            function(image) {

                return (
                    image?.url ===
                    data.mainImage
                );

            }
        );


    if (
        mainImageIndex < 0
    ) {

        mainImageIndex =
            0;

    }


    renderImageGallery();


    /*========================================
    VIDEO
    ========================================*/

    productVideo =
        data.video ||
        null;


    renderVideoPreview();


    /*========================================
    SPECIFICATIONS
    ========================================*/

    if (
        specificationsContainer
    ) {

        specificationsContainer.innerHTML =
            "";


        const specifications =
            data.specifications ||
            [];


        Object.values(
            specifications
        ).forEach(
            function(item) {

                addSpecification(
                    item.key,
                    item.value
                );

            }
        );

    }


    /*========================================
    VARIANTS
    ========================================*/

    if (
        variantsContainer
    ) {

        variantsContainer.innerHTML =
            "";


        const variants =
            data.variants ||
            [];


        Object.values(
            variants
        ).forEach(
            function(item) {

                addVariant(
                    item.name,
                    item.value,
                    item.price
                );

            }
        );

    }


    /*========================================
    SHIPPING
    ========================================*/

    const shipping =
        data.shipping ||
        {};


    if (shippingMethod) {

        shippingMethod.value =
            safeText(
                shipping.method
            );

    }


    if (shippingCharges) {

        shippingCharges.value =
            shipping.charges ??
            "";

    }


    if (deliveryTime) {

        deliveryTime.value =
            safeText(
                shipping.deliveryTime
            );

    }


    if (returnPolicy) {

        returnPolicy.value =
            safeText(
                shipping.returnPolicy
            );

    }


    /*========================================
    CARD
    ========================================*/

    const card =
        data.card ||
        {};


    if (productBadge) {

        productBadge.value =
            safeText(
                card.badge
            );

    }


    if (featuredProduct) {

        featuredProduct.checked =
            Boolean(
                card.featured
            );

    }


    /*========================================
    BUTTON TEXT
    ========================================*/

    if (saveProductBtn) {

        saveProductBtn.innerHTML =
            `
            <i class="fa-solid fa-floppy-disk"></i>
            Update Product
            `;

    }


    console.log(
        "Product loaded:",
        productId
    );

}


/*==================================================
READ PRODUCT ID FROM URL
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
CANCEL BUTTON
==================================================*/

if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        function() {

            window.location.href =
                "products.html";

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


        /*====================================
        EDIT MODE
        ====================================*/

        const productId =
            getProductIdFromURL();


        if (productId) {

            await loadProduct(
                productId
            );

        }

    }
);


/*==================================================
AUTO DISCOUNT
==================================================*/

function calculateDiscount() {

    if (
        !price ||
        !oldPrice ||
        !discount
    ) {

        return;

    }


    const currentPrice =
        Number(
            price.value
        );


    const previousPrice =
        Number(
            oldPrice.value
        );


    if (
        previousPrice > 0 &&
        currentPrice > 0 &&
        previousPrice > currentPrice
    ) {

        const result =
            (
                (
                    previousPrice -
                    currentPrice
                ) /
                previousPrice
            ) *
            100;


        discount.value =
            Math.round(
                result
            );

    }

}


price?.addEventListener(
    "input",
    calculateDiscount
);


oldPrice?.addEventListener(
    "input",
    calculateDiscount
);


/*==================================================
PRODUCT FORM PREVENT DEFAULT
==================================================*/

if (productForm) {

    productForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            saveProduct();

        }
    );

}


/*==================================================
END
==================================================*/
