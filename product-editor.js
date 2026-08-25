/*==================================================
SMARTBAZAAR PRO
PRODUCT EDITOR
FEATURE: COMPLETE PRODUCT MANAGEMENT SYSTEM
==================================================*/

import {
    db,
    auth
} from "./firebase-config.js";

import {
    collection,
    addDoc,
    doc,
    setDoc,
    getDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


/*==================================================
DOM
==================================================*/

const form =
    document.getElementById("product-editor-form");

const productName =
    document.getElementById("product-name");

const brand =
    document.getElementById("product-brand");

const category =
    document.getElementById("product-category");

const subcategory =
    document.getElementById("product-subcategory");

const condition =
    document.getElementById("product-condition");

const shortDescription =
    document.getElementById("short-description");

const regularPrice =
    document.getElementById("regular-price");

const salePrice =
    document.getElementById("sale-price");

const discountType =
    document.getElementById("discount-type");

const discountValue =
    document.getElementById("discount-value");

const featuredProduct =
    document.getElementById("featured-product");

const sku =
    document.getElementById("sku");

const stockQuantity =
    document.getElementById("stock-quantity");

const lowStockLimit =
    document.getElementById("low-stock-limit");

const stockStatus =
    document.getElementById("stock-status");

const manageStock =
    document.getElementById("manage-stock");

const description =
    document.getElementById("product-description");

const features =
    document.getElementById("product-features");

const tags =
    document.getElementById("product-tags");

const shippingMethod =
    document.getElementById("shipping-method");

const shippingCost =
    document.getElementById("shipping-cost");

const deliveryTime =
    document.getElementById("delivery-time");

const returnDays =
    document.getElementById("return-days");

const shippingDescription =
    document.getElementById("shipping-description");

const returnDescription =
    document.getElementById("return-description");

const seoTitle =
    document.getElementById("seo-title");

const seoDescription =
    document.getElementById("seo-description");

const seoKeywords =
    document.getElementById("seo-keywords");

const productSlug =
    document.getElementById("product-slug");

const productVisible =
    document.getElementById("product-visible");

const allowReviews =
    document.getElementById("allow-reviews");

const allowQuestions =
    document.getElementById("allow-questions");

const showRelatedProducts =
    document.getElementById("show-related-products");

const enableWishlist =
    document.getElementById("enable-wishlist");


/*==================================================
MEDIA
==================================================*/

const mainImageInput =
    document.getElementById("main-product-image");

const mainImagePreview =
    document.getElementById("main-image-preview");

const galleryInput =
    document.getElementById("product-gallery-images");

const galleryGrid =
    document.getElementById("gallery-upload-grid");

const videoInput =
    document.getElementById("product-video");

const videoPreviewContainer =
    document.getElementById(
        "video-preview-container"
    );


/*==================================================
BUTTONS
==================================================*/

const saveDraftButton =
    document.getElementById(
        "save-draft-button"
    );

const saveDraftLargeButton =
    document.getElementById(
        "save-draft-large-button"
    );

const publishButton =
    document.getElementById(
        "publish-product-button"
    );

const publishLargeButton =
    document.getElementById(
        "publish-large-button"
    );

const previewButton =
    document.getElementById(
        "preview-button"
    );

const mobilePreviewButton =
    document.getElementById(
        "mobile-preview-floating-button"
    );

const closePreviewButton =
    document.getElementById(
        "close-preview-button"
    );

const duplicateButton =
    document.getElementById(
        "duplicate-product-button"
    );

const deleteButton =
    document.getElementById(
        "delete-product-button"
    );

const cancelButton =
    document.getElementById(
        "cancel-editor-button"
    );


/*==================================================
STATE
==================================================*/

let currentProductId = null;

let currentUser = null;

let mainImageData = "";

let galleryImagesData = [];

let videoData = "";

let isSaving = false;


/*==================================================
SUBCATEGORIES
==================================================*/

const subcategories = {

    electronics: [
        "Mobiles",
        "Laptops",
        "Televisions",
        "Cameras",
        "Headphones",
        "Accessories"
    ],

    fashion: [
        "Men",
        "Women",
        "Kids",
        "Shoes",
        "Bags",
        "Watches"
    ],

    beauty: [
        "Skincare",
        "Makeup",
        "Hair Care",
        "Perfumes"
    ],

    home: [
        "Furniture",
        "Kitchen",
        "Decor",
        "Lighting",
        "Appliances"
    ],

    grocery: [
        "Food",
        "Beverages",
        "Snacks",
        "Household"
    ],

    sports: [
        "Fitness",
        "Football",
        "Cricket",
        "Outdoor"
    ],

    automotive: [
        "Car Accessories",
        "Bike Accessories",
        "Tools"
    ],

    other: [
        "Other"
    ]

};


/*==================================================
AUTH
==================================================*/

onAuthStateChanged(
    auth,
    user => {

        currentUser = user;

        console.log(
            "SmartBazaar User:",
            user
        );

    }
);


/*==================================================
GENERATE PRODUCT ID
==================================================*/

function generateProductId() {

    const time =
        Date.now().toString(36)
            .toUpperCase();

    const random =
        Math.random()
            .toString(36)
            .substring(2, 7)
            .toUpperCase();

    return `SB-${time}-${random}`;

}


/*==================================================
CATEGORY
==================================================*/

if (category) {

    category.addEventListener(
        "change",
        function () {

            const selected =
                this.value;

            subcategory.innerHTML = `
                <option value="">
                    Select Subcategory
                </option>
            `;

            if (
                !subcategories[selected]
            ) {
                return;
            }

            subcategories[selected]
                .forEach(
                    item => {

                        const option =
                            document.createElement(
                                "option"
                            );

                        option.value =
                            item
                                .toLowerCase()
                                .replace(
                                    /\s+/g,
                                    "-"
                                );

                        option.textContent =
                            item;

                        subcategory
                            .appendChild(
                                option
                            );

                    }
                );

        }
    );

}


/*==================================================
IMAGE TO DATA URL
==================================================*/

function fileToDataURL(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();

            reader.onload =
                () => resolve(
                    reader.result
                );

            reader.onerror =
                reject;

            reader.readAsDataURL(
                file
            );

        }
    );

}


/*==================================================
MAIN IMAGE
==================================================*/

if (mainImageInput) {

    mainImageInput.addEventListener(
        "change",
        async function () {

            const file =
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

                return;

            }

            mainImageData =
                await fileToDataURL(
                    file
                );

            if (mainImagePreview) {

                mainImagePreview.src =
                    mainImageData;

                mainImagePreview.style
                    .display =
                    "block";

            }

            updatePreview();

        }
    );

}


/*==================================================
GALLERY
==================================================*/

if (galleryInput) {

    galleryInput.addEventListener(
        "change",
        async function () {

            const files =
                Array.from(
                    this.files
                );

            galleryImagesData = [];

            for (
                const file of files
            ) {

                if (
                    file.type.startsWith(
                        "image/"
                    )
                ) {

                    const data =
                        await fileToDataURL(
                            file
                        );

                    galleryImagesData
                        .push(data);

                }

            }

            renderGallery();

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

    galleryGrid
        .querySelectorAll(
            ".dynamic-gallery-image"
        )
        .forEach(
            element =>
                element.remove()
        );


    galleryImagesData.forEach(
        (image, index) => {

            const wrapper =
                document.createElement(
                    "div"
                );

            wrapper.className =
                "dynamic-gallery-image";

            wrapper.style.position =
                "relative";

            const img =
                document.createElement(
                    "img"
                );

            img.src =
                image;

            img.style.width =
                "100%";

            img.style.height =
                "100%";

            img.style.objectFit =
                "cover";

            const remove =
                document.createElement(
                    "button"
                );

            remove.type =
                "button";

            remove.innerHTML =
                "×";

            remove.style.position =
                "absolute";

            remove.style.top =
                "5px";

            remove.style.right =
                "5px";

            remove.style.zIndex =
                "5";

            remove.addEventListener(
                "click",
                () => {

                    galleryImagesData
                        .splice(
                            index,
                            1
                        );

                    renderGallery();

                }
            );

            wrapper.appendChild(img);

            wrapper.appendChild(remove);

            galleryGrid.appendChild(
                wrapper
            );

        }
    );

}


/*==================================================
VIDEO
==================================================*/

if (videoInput) {

    videoInput.addEventListener(
        "change",
        async function () {

            const file =
                this.files[0];

            if (!file) {
                return;
            }

            if (
                !file.type.startsWith(
                    "video/"
                )
            ) {

                alert(
                    "Please select a video."
                );

                return;

            }

            videoData =
                await fileToDataURL(
                    file
                );

            if (
                videoPreviewContainer
            ) {

                videoPreviewContainer
                    .innerHTML = `
                        <video
                            controls
                            style="
                                width:100%;
                                max-height:300px;
                            "
                        >
                            <source
                                src="${videoData}"
                                type="${file.type}"
                            >
                        </video>
                    `;

            }

        }
    );

}


/*==================================================
VARIANTS
==================================================*/

const variantsContainer =
    document.getElementById(
        "variants-container"
    );

const addVariantButton =
    document.getElementById(
        "add-variant-button"
    );


if (addVariantButton) {

    addVariantButton.addEventListener(
        "click",
        () => {

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

            variantsContainer
                .appendChild(row);

        }
    );

}


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
            variantsContainer
                .querySelectorAll(
                    ".variant-editor-row"
                );

        if (rows.length <= 1) {

            alert(
                "At least one variant row is required."
            );

            return;

        }

        button
            .closest(
                ".variant-editor-row"
            )
            .remove();

    }
);


/*==================================================
SPECIFICATIONS
==================================================*/

const specificationsEditor =
    document.getElementById(
        "specifications-editor"
    );

const addSpecificationButton =
    document.getElementById(
        "add-specification-button"
    );


if (addSpecificationButton) {

    addSpecificationButton.addEventListener(
        "click",
        () => {

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

            specificationsEditor
                .appendChild(row);

        }
    );

}


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

        button
            .closest(
                ".specification-row"
            )
            .remove();

    }
);


/*==================================================
COLLECT VARIANTS
==================================================*/

function collectVariants() {

    const names =
        Array.from(
            document.querySelectorAll(
                'input[name="variantName[]"]'
            )
        );

    const options =
        Array.from(
            document.querySelectorAll(
                'input[name="variantOptions[]"]'
            )
        );

    return names.map(
        (input, index) => {

            return {

                name:
                    input.value.trim(),

                options:
                    options[index]
                        ?.value
                        .split(",")
                        .map(
                            item =>
                                item.trim()
                        )
                        .filter(Boolean) || []

            };

        }
    ).filter(
        item =>
            item.name ||
            item.options.length
    );

}


/*==================================================
COLLECT SPECIFICATIONS
==================================================*/

function collectSpecifications() {

    const rows =
        Array.from(
            document.querySelectorAll(
                ".specification-row"
            )
        );

    return rows.map(
        row => {

            const inputs =
                row.querySelectorAll(
                    "input"
                );

            return {

                name:
                    inputs[0]
                        ?.value
                        .trim() || "",

                value:
                    inputs[1]
                        ?.value
                        .trim() || ""

            };

        }
    ).filter(
        item =>
            item.name ||
            item.value
    );

}


/*==================================================
SLUG
==================================================*/

function createSlug(text) {

    return text
        .toLowerCase()
        .trim()
        .replace(
            /[^a-z0-9\s-]/g,
            ""
        )
        .replace(
            /\s+/g,
            "-"
        )
        .replace(
            /-+/g,
            "-"
        );

}


if (productName && productSlug) {

    productName.addEventListener(
        "input",
        () => {

            if (
                !productSlug.dataset.manual
            ) {

                productSlug.value =
                    createSlug(
                        productName.value
                    );

            }

            updatePreview();

        }
    );

}


if (productSlug) {

    productSlug.addEventListener(
        "input",
        () => {

            productSlug.dataset.manual =
                "true";

        }
    );

}


/*==================================================
PRICE
==================================================*/

function getFinalPrice() {

    const regular =
        Number(
            regularPrice?.value || 0
        );

    const sale =
        Number(
            salePrice?.value || 0
        );

    const discount =
        Number(
            discountValue?.value || 0
        );

    if (
        sale > 0 &&
        sale < regular
    ) {

        return sale;

    }

    if (
        discountType?.value ===
        "percentage"
    ) {

        return Math.max(
            0,
            regular -
            (
                regular *
                discount /
                100
            )
        );

    }

    if (
        discountType?.value ===
        "fixed"
    ) {

        return Math.max(
            0,
            regular - discount
        );

    }

    return regular;

}


/*==================================================
LIVE PREVIEW
==================================================*/

function formatPrice(price) {

    return Number(price || 0)
        .toLocaleString(
            "en-PK"
        );

}


function updatePreview() {

    const name =
        productName?.value ||
        "Product Name";

    const brandText =
        brand?.value ||
        "BRAND";

    const finalPrice =
        getFinalPrice();

    const regular =
        Number(
            regularPrice?.value || 0
        );


    const cardName =
        document.getElementById(
            "card-preview-name"
        );

    const cardBrand =
        document.getElementById(
            "card-preview-brand"
        );

    const cardPrice =
        document.getElementById(
            "card-preview-price"
        );

    const detailName =
        document.getElementById(
            "detail-preview-name"
        );

    const detailBrand =
        document.getElementById(
            "detail-preview-brand"
        );

    const detailPrice =
        document.getElementById(
            "detail-preview-price"
        );

    const detailDescription =
        document.getElementById(
            "detail-preview-description"
        );


    if (cardName) {
        cardName.textContent = name;
    }

    if (cardBrand) {
        cardBrand.textContent =
            brandText;
    }

    if (cardPrice) {

        cardPrice.textContent =
            `PKR ${formatPrice(finalPrice)}`;

    }


    if (detailName) {
        detailName.textContent =
            name;
    }

    if (detailBrand) {
        detailBrand.textContent =
            brandText;
    }

    if (detailPrice) {

        detailPrice.textContent =
            `PKR ${formatPrice(finalPrice)}`;

    }


    if (detailDescription) {

        detailDescription.textContent =
            description?.value ||
            "Product description will appear here.";

    }


    const cardImage =
        document.getElementById(
            "card-preview-image"
        );

    const detailImage =
        document.getElementById(
            "detail-preview-image"
        );


    if (mainImageData) {

        if (cardImage) {

            cardImage.src =
                mainImageData;

            cardImage.style.display =
                "block";

        }

        if (detailImage) {

            detailImage.src =
                mainImageData;

            detailImage.style.display =
                "block";

        }

    }


    /*
    DISCOUNT
    */

    const discountBadge =
        document.querySelector(
            ".preview-discount"
        );

    if (discountBadge) {

        if (
            regular > finalPrice &&
            regular > 0
        ) {

            const percent =
                Math.round(
                    (
                        (
                            regular -
                            finalPrice
                        ) /
                        regular
                    ) * 100
                );

            discountBadge.textContent =
                `-${percent}%`;

            discountBadge.style.display =
                "inline-flex";

        }

        else {

            discountBadge.style.display =
                "none";

        }

    }

}


document.addEventListener(
    "input",
    event => {

        if (
            event.target.closest(
                "#product-editor-form"
            )
        ) {

            updatePreview();

        }

    }
);


/*==================================================
NAVIGATION
==================================================*/

const navItems =
    document.querySelectorAll(
        ".editor-nav-item"
    );


navItems.forEach(
    item => {

        item.addEventListener(
            "click",
            () => {

                navItems.forEach(
                    nav =>
                        nav.classList.remove(
                            "active"
                        )
                );

                item.classList.add(
                    "active"
                );


                const sectionId =
                    item.dataset.section;

                const section =
                    document.getElementById(
                        sectionId
                    );

                if (section) {

                    section.scrollIntoView({
                        behavior:
                            "smooth",
                        block:
                            "start"
                    });

                }

            }
        );

    }
);


/*==================================================
PREVIEW PANEL
==================================================*/

const previewPanel =
    document.getElementById(
        "live-preview-panel"
    );


function openPreview() {

    if (previewPanel) {

        previewPanel.classList.add(
            "active"
        );

    }

    updatePreview();

}


function closePreview() {

    if (previewPanel) {

        previewPanel.classList.remove(
            "active"
        );

    }

}


previewButton?.addEventListener(
    "click",
    openPreview
);

mobilePreviewButton?.addEventListener(
    "click",
    openPreview
);

closePreviewButton?.addEventListener(
    "click",
    closePreview
);


/*==================================================
PREVIEW TABS
==================================================*/

const previewTabs =
    document.querySelectorAll(
        ".preview-tab"
    );

const previewContents =
    document.querySelectorAll(
        ".preview-content"
    );


previewTabs.forEach(
    tab => {

        tab.addEventListener(
            "click",
            () => {

                const target =
                    tab.dataset.preview;

                previewTabs.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );

                previewContents.forEach(
                    content =>
                        content.classList.remove(
                            "active"
                        )
                );

                tab.classList.add(
                    "active"
                );

                const content =
                    document.getElementById(
                        `${target}-preview`
                    );

                content?.classList.add(
                    "active"
                );

            }
        );

    }
);


/*==================================================
TOAST
==================================================*/

function showToast(
    title = "Product Saved",
    message =
        "Your product has been saved successfully."
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

    const small =
        toast.querySelector(
            "small"
        );

    if (strong) {
        strong.textContent =
            title;
    }

    if (small) {
        small.textContent =
            message;
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
        3500
    );

}


/*==================================================
LOADING
==================================================*/

function setLoading(
    state,
    message = "Saving product..."
) {

    const loading =
        document.getElementById(
            "editor-loading"
        );

    if (!loading) {
        return;
    }

    const text =
        loading.querySelector(
            "p"
        );

    if (text) {
        text.textContent =
            message;
    }

    loading.classList.toggle(
        "active",
        state
    );

}


/*==================================================
COLLECT FORM DATA
==================================================*/

function collectProductData(
    status
) {

    return {

        productId:
            currentProductId ||
            generateProductId(),

        productName:
            productName.value.trim(),

        brand:
            brand.value.trim(),

        category:
            category.value,

        subcategory:
            subcategory.value,

        condition:
            condition.value,

        shortDescription:
            shortDescription.value.trim(),

        mainImage:
            mainImageData,

        galleryImages:
            galleryImagesData,

        video:
            videoData,

        pricing: {

            regularPrice:
                Number(
                    regularPrice.value || 0
                ),

            salePrice:
                Number(
                    salePrice.value || 0
                ),

            discountType:
                discountType.value,

            discountValue:
                Number(
                    discountValue.value || 0
                ),

            finalPrice:
                getFinalPrice(),

            featured:
                featuredProduct.checked

        },

        inventory: {

            sku:
                sku.value.trim(),

            stockQuantity:
                Number(
                    stockQuantity.value || 0
                ),

            lowStockLimit:
                Number(
                    lowStockLimit.value || 0
                ),

            stockStatus:
                stockStatus.value,

            manageStock:
                manageStock.checked

        },

        variants:
            collectVariants(),

        description:
            description.value.trim(),

        features:
            features.value
                .split("\n")
                .map(
                    item =>
                        item.trim()
                )
                .filter(Boolean),

        tags:
            tags.value
                .split(",")
                .map(
                    item =>
                        item.trim()
                )
                .filter(Boolean),

        specifications:
            collectSpecifications(),

        shipping: {

            method:
                shippingMethod.value,

            cost:
                Number(
                    shippingCost.value || 0
                ),

            deliveryTime:
                deliveryTime.value.trim(),

            returnDays:
                returnDays.value,

            description:
                shippingDescription
                    .value
                    .trim(),

            returnDescription:
                returnDescription
                    .value
                    .trim()

        },

        seo: {

            title:
                seoTitle.value.trim(),

            description:
                seoDescription
                    .value
                    .trim(),

            keywords:
                seoKeywords.value
                    .split(",")
                    .map(
                        item =>
                            item.trim()
                    )
                    .filter(Boolean),

            slug:
                productSlug.value.trim()

        },

        advanced: {

            visible:
                productVisible.checked,

            allowReviews:
                allowReviews.checked,

            allowQuestions:
                allowQuestions.checked,

            showRelatedProducts:
                showRelatedProducts.checked,

            enableWishlist:
                enableWishlist.checked

        },

        status,

        sellerId:
            currentUser?.uid ||
            null,

        updatedAt:
            serverTimestamp(),

        createdAt:
            serverTimestamp()

    };

}


/*==================================================
SAVE PRODUCT
==================================================*/

async function saveProduct(
    status
) {

    if (isSaving) {
        return;
    }


    if (!form.checkValidity()) {

        form.reportValidity();

        return;

    }


    isSaving = true;

    setLoading(
        true,
        status === "published"
            ? "Publishing product..."
            : "Saving draft..."
    );


    try {

        if (!currentProductId) {

            currentProductId =
                generateProductId();

        }


        const data =
            collectProductData(
                status
            );


        data.productId =
            currentProductId;


        await setDoc(
            doc(
                db,
                "products",
                currentProductId
            ),
            data,
            {
                merge: true
            }
        );


        const productIdElement =
            document.getElementById(
                "product-id"
            );

        if (productIdElement) {

            productIdElement.textContent =
                currentProductId;

        }


        updateStatus(status);


        showToast(
            status === "published"
                ? "Product Published"
                : "Product Saved",
            status === "published"
                ? "Product published successfully."
                : "Product draft saved successfully."
        );


    }

    catch (error) {

        console.error(
            "PRODUCT SAVE ERROR:",
            error
        );

        alert(
            "Unable to save product.\n\n" +
            error.message
        );

    }

    finally {

        isSaving = false;

        setLoading(
            false
        );

    }

}


/*==================================================
STATUS
==================================================*/

function updateStatus(
    status
) {

    const statusElement =
        document.querySelector(
            ".product-status"
        );

    if (!statusElement) {
        return;
    }

    statusElement.textContent =
        status === "published"
            ? "Published"
            : "Draft";

    statusElement.classList.remove(
        "draft",
        "published"
    );

    statusElement.classList.add(
        status === "published"
            ? "published"
            : "draft"
    );

}


/*==================================================
SAVE BUTTONS
==================================================*/

saveDraftButton?.addEventListener(
    "click",
    () =>
        saveProduct(
            "draft"
        )
);

saveDraftLargeButton?.addEventListener(
    "click",
    () =>
        saveProduct(
            "draft"
        )
);

publishButton?.addEventListener(
    "click",
    () =>
        saveProduct(
            "published"
        )
);


/*==================================================
FORM SUBMIT
==================================================*/

form?.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        saveProduct(
            "published"
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

const confirmDeleteButton =
    document.getElementById(
        "confirm-delete-button"
    );


function openDeleteModal() {

    deleteModal?.classList.add(
        "active"
    );

}


function closeDeleteModal() {

    deleteModal?.classList.remove(
        "active"
    );

}


deleteButton?.addEventListener(
    "click",
    openDeleteModal
);


document
    .querySelectorAll(
        "[data-close-modal]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                closeDeleteModal
            );

        }
    );


deleteModal
    ?.querySelector(
        ".editor-modal-overlay"
    )
    ?.addEventListener(
        "click",
        closeDeleteModal
    );


/*==================================================
CONFIRM DELETE
==================================================*/

confirmDeleteButton?.addEventListener(
    "click",
    async () => {

        if (!currentProductId) {

            alert(
                "No saved product found."
            );

            closeDeleteModal();

            return;

        }


        setLoading(
            true,
            "Deleting product..."
        );


        try {

            await deleteDoc(
                doc(
                    db,
                    "products",
                    currentProductId
                )
            );


            closeDeleteModal();


            showToast(
                "Product Deleted",
                "Product has been deleted successfully."
            );


            setTimeout(
                () => {

                    window.location.href =
                        "admin-dashboard.html";

                },
                1200
            );

        }

        catch (error) {

            console.error(
                "DELETE ERROR:",
                error
            );

            alert(
                "Unable to delete product.\n\n" +
                error.message
            );

        }

        finally {

            setLoading(
                false
            );

        }

    }
);


/*==================================================
DUPLICATE
==================================================*/

duplicateButton?.addEventListener(
    "click",
    async () => {

        const newId =
            generateProductId();

        const data =
            collectProductData(
                "draft"
            );

        data.productId =
            newId;

        data.productName =
            `${data.productName} Copy`;

        try {

            setLoading(
                true,
                "Duplicating product..."
            );

            await setDoc(
                doc(
                    db,
                    "products",
                    newId
                ),
                data
            );

            currentProductId =
                newId;

            const idElement =
                document.getElementById(
                    "product-id"
                );

            if (idElement) {

                idElement.textContent =
                    newId;

            }

            showToast(
                "Product Duplicated",
                "A new draft copy has been created."
            );

        }

        catch (error) {

            console.error(
                "DUPLICATE ERROR:",
                error
            );

            alert(
                error.message
            );

        }

        finally {

            setLoading(
                false
            );

        }

    }
);


/*==================================================
CANCEL
==================================================*/

cancelButton?.addEventListener(
    "click",
    () => {

        const confirmed =
            confirm(
                "Discard your changes?"
            );

        if (!confirmed) {
            return;
        }

        window.location.href =
            "admin-dashboard.html";

    }
);


/*==================================================
HELP
==================================================*/

document
    .querySelector(
        ".sidebar-help-button"
    )
    ?.addEventListener(
        "click",
        () => {

            alert(
                "SmartBazaar Pro Product Editor\n\n" +
                "Fill product information, upload images, " +
                "set pricing and inventory, then save draft " +
                "or publish your product."
            );

        }
    );


/*==================================================
MOBILE SIDEBAR
==================================================*/

const editorMenuButton =
    document.getElementById(
        "editor-menu-button"
    );

const editorSidebar =
    document.getElementById(
        "editor-sidebar"
    );


editorMenuButton?.addEventListener(
    "click",
    () => {

        editorSidebar?.classList.toggle(
            "active"
        );

    }
);


/*==================================================
INITIAL PRODUCT ID
==================================================*/

function initializeProduct() {

    currentProductId =
        generateProductId();


    const idElement =
        document.getElementById(
            "product-id"
        );

    if (idElement) {

        idElement.textContent =
            currentProductId;

    }

}


/*==================================================
LOAD EXISTING PRODUCT
==================================================*/

async function loadExistingProduct() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const id =
        params.get(
            "id"
        );

    if (!id) {

        initializeProduct();

        updatePreview();

        return;

    }


    try {

        setLoading(
            true,
            "Loading product..."
        );


        const snapshot =
            await getDoc(
                doc(
                    db,
                    "products",
                    id
                )
            );


        if (!snapshot.exists()) {

            alert(
                "Product not found."
            );

            initializeProduct();

            return;

        }


        currentProductId =
            id;


        const data =
            snapshot.data();


        fillProductForm(
            data
        );


        const idElement =
            document.getElementById(
                "product-id"
            );

        if (idElement) {

            idElement.textContent =
                id;

        }


        updatePreview();


    }

    catch (error) {

        console.error(
            "LOAD PRODUCT ERROR:",
            error
        );

        alert(
            "Unable to load product.\n\n" +
            error.message
        );

    }

    finally {

        setLoading(
            false
        );

    }

}


/*==================================================
FILL EXISTING PRODUCT
==================================================*/

function fillProductForm(
    data
) {

    productName.value =
        data.productName || "";

    brand.value =
        data.brand || "";

    category.value =
        data.category || "";

    category.dispatchEvent(
        new Event(
            "change"
        )
    );

    setTimeout(
        () => {

            subcategory.value =
                data.subcategory || "";

        },
        0
    );


    condition.value =
        data.condition || "new";

    shortDescription.value =
        data.shortDescription || "";


    mainImageData =
        data.mainImage || "";


    if (
        mainImageData &&
        mainImagePreview
    ) {

        mainImagePreview.src =
            mainImageData;

        mainImagePreview.style.display =
            "block";

    }


    galleryImagesData =
        Array.isArray(
            data.galleryImages
        )
            ? data.galleryImages
            : [];


    renderGallery();


    videoData =
        data.video || "";


    if (
        videoData &&
        videoPreviewContainer
    ) {

        videoPreviewContainer.innerHTML = `
            <video
                controls
                style="width:100%;max-height:300px;"
                src="${videoData}"
            ></video>
        `;

    }


    if (data.pricing) {

        regularPrice.value =
            data.pricing.regularPrice || "";

        salePrice.value =
            data.pricing.salePrice || "";

        discountType.value =
            data.pricing.discountType ||
            "none";

        discountValue.value =
            data.pricing.discountValue ||
            "";

        featuredProduct.checked =
            Boolean(
                data.pricing.featured
            );

    }


    if (data.inventory) {

        sku.value =
            data.inventory.sku || "";

        stockQuantity.value =
            data.inventory.stockQuantity ||
            "";

        lowStockLimit.value =
            data.inventory.lowStockLimit ||
            "";

        stockStatus.value =
            data.inventory.stockStatus ||
            "in-stock";

        manageStock.checked =
            data.inventory.manageStock !==
            false;

    }


    description.value =
        data.description || "";


    features.value =
        Array.isArray(
            data.features
        )
            ? data.features.join("\n")
            : "";


    tags.value =
        Array.isArray(
            data.tags
        )
            ? data.tags.join(", ")
            : "";


    /*
    ADVANCED
    */

    if (data.advanced) {

        productVisible.checked =
            data.advanced.visible !==
            false;

        allowReviews.checked =
            data.advanced.allowReviews !==
            false;

        allowQuestions.checked =
            data.advanced.allowQuestions !==
            false;

        showRelatedProducts.checked =
            data.advanced.showRelatedProducts !==
            false;

        enableWishlist.checked =
            data.advanced.enableWishlist !==
            false;

    }


    /*
    SEO
    */

    if (data.seo) {

        seoTitle.value =
            data.seo.title || "";

        seoDescription.value =
            data.seo.description || "";

        seoKeywords.value =
            Array.isArray(
                data.seo.keywords
            )
                ? data.seo.keywords.join(", ")
                : "";

        productSlug.value =
            data.seo.slug || "";

    }


    /*
    SHIPPING
    */

    if (data.shipping) {

        shippingMethod.value =
            data.shipping.method ||
            "standard";

        shippingCost.value =
            data.shipping.cost || "";

        deliveryTime.value =
            data.shipping.deliveryTime ||
            "";

        returnDays.value =
            data.shipping.returnDays ||
            "0";

        shippingDescription.value =
            data.shipping.description ||
            "";

        returnDescription.value =
            data.shipping.returnDescription ||
            "";

    }


    updateStatus(
        data.status ||
        "draft"
    );

}


/*==================================================
START
==================================================*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadExistingProduct();

        updatePreview();

    }
);


/*==================================================
SMARTBAZAAR PRO
PRODUCT EDITOR READY
==================================================*/

console.log(
    "SmartBazaar Pro Product Editor Ready."
);
