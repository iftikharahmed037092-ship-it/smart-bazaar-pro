/*==================================================
SMARTBAZAAR PRO
PART 19.2
PRODUCT EDITOR ENGINE
==================================================*/

import {
    db,
    storage
} from "./firebase-config.js";

import {
    collection,
    addDoc,
    updateDoc,
    doc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-storage.js";


/*==================================================
DOM
==================================================*/

const form =
    document.getElementById("product-editor-form");

const mainImageInput =
    document.getElementById("main-product-image");

const mainImagePreview =
    document.getElementById("main-image-preview");

const mainImageBox =
    document.getElementById("main-image-upload-box");

const galleryInput =
    document.getElementById("product-gallery-images");

const galleryGrid =
    document.getElementById("gallery-upload-grid");

const videoInput =
    document.getElementById("product-video");

const videoPreviewContainer =
    document.getElementById("video-preview-container");


/*==================================================
STATE
==================================================*/

let mainImageFile = null;

let galleryFiles = [];

let productVideoFile = null;

let currentProductId = null;


/*==================================================
UTILITY
==================================================*/

function generateProductId() {

    return (
        "SB-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 7)
            .toUpperCase()
    );

}


/*==================================================
MAIN IMAGE
==================================================*/

if (mainImageInput) {

    mainImageInput.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (!file) {
                return;
            }

            if (!file.type.startsWith("image/")) {

                alert(
                    "Please select a valid image."
                );

                return;
            }

            mainImageFile = file;

            const imageURL =
                URL.createObjectURL(file);

            mainImagePreview.src =
                imageURL;

            mainImagePreview.style.display =
                "block";

            const placeholder =
                mainImageBox.querySelector(
                    ".upload-placeholder"
                );

            if (placeholder) {

                placeholder.style.display =
                    "none";

            }

        }
    );

}


/*==================================================
GALLERY
==================================================*/

if (galleryInput) {

    galleryInput.addEventListener(
        "change",
        function () {

            const files =
                Array.from(this.files);

            if (!files.length) {
                return;
            }

            files.forEach(file => {

                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    return;

                }

                galleryFiles.push(file);

            });

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
            item => item.remove()
        );


    galleryFiles.forEach(
        function (file, index) {

            const wrapper =
                document.createElement("div");

            wrapper.className =
                "gallery-preview-item";


            const image =
                document.createElement("img");

            image.src =
                URL.createObjectURL(file);

            image.alt =
                "Gallery image";


            const removeButton =
                document.createElement("button");

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


            galleryGrid.insertBefore(
                wrapper,
                uploadButton
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
        function () {

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
                    "Please select a valid video."
                );

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


    const video =
        document.createElement("video");

    video.controls =
        true;

    video.preload =
        "metadata";

    video.src =
        URL.createObjectURL(
            productVideoFile
        );


    video.style.width =
        "100%";


    videoPreviewContainer.appendChild(
        video
    );

}


/*==================================================
UPLOAD FILE
==================================================*/

async function uploadFile(
    file,
    folder
) {

    if (!file) {
        return null;
    }


    const fileName =
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 10) +
        "_" +
        file.name;


    const storageRef =
        ref(
            storage,
            `${folder}/${fileName}`
        );


    await uploadBytes(
        storageRef,
        file
    );


    const url =
        await getDownloadURL(
            storageRef
        );


    return url;

}


/*==================================================
FORM DATA
==================================================*/

function getProductData() {

    const data =
        new FormData(form);


    return {

        productName:
            data.get("productName") || "",

        brand:
            data.get("brand") || "",

        category:
            data.get("category") || "",

        subcategory:
            data.get("subcategory") || "",

        condition:
            data.get("condition") || "new",

        shortDescription:
            data.get("shortDescription") || "",


        regularPrice:
            Number(
                data.get("regularPrice") || 0
            ),

        salePrice:
            Number(
                data.get("salePrice") || 0
            ),

        discountType:
            data.get("discountType") || "none",

        discountValue:
            Number(
                data.get("discountValue") || 0
            ),

        featuredProduct:
            document.getElementById(
                "featured-product"
            )?.checked || false,


        sku:
            data.get("sku") || "",

        stockQuantity:
            Number(
                data.get("stockQuantity") || 0
            ),

        lowStockLimit:
            Number(
                data.get("lowStockLimit") || 0
            ),

        stockStatus:
            data.get("stockStatus") ||
            "in-stock",

        manageStock:
            document.getElementById(
                "manage-stock"
            )?.checked || false,


        description:
            data.get("description") || "",

        features:
            data.get("features") || "",

        tags:
            data.get("tags") || "",


        shippingMethod:
            data.get("shippingMethod") ||
            "standard",

        shippingCost:
            Number(
                data.get("shippingCost") || 0
            ),

        deliveryTime:
            data.get("deliveryTime") || "",

        returnDays:
            Number(
                data.get("returnDays") || 0
            ),

        shippingDescription:
            data.get(
                "shippingDescription"
            ) || "",

        returnDescription:
            data.get(
                "returnDescription"
            ) || "",


        seoTitle:
            data.get("seoTitle") || "",

        seoDescription:
            data.get(
                "seoDescription"
            ) || "",

        seoKeywords:
            data.get("seoKeywords") || "",

        slug:
            data.get("slug") || "",


        productVisible:
            document.getElementById(
                "product-visible"
            )?.checked || false,

        allowReviews:
            document.getElementById(
                "allow-reviews"
            )?.checked || false,

        allowQuestions:
            document.getElementById(
                "allow-questions"
            )?.checked || false,

        showRelatedProducts:
            document.getElementById(
                "show-related-products"
            )?.checked || false,

        enableWishlist:
            document.getElementById(
                "enable-wishlist"
            )?.checked || false

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


    return Array.from(rows)
        .map(row => {

            const name =
                row.querySelector(
                    '[name="variantName[]"]'
                )?.value || "";


            const options =
                row.querySelector(
                    '[name="variantOptions[]"]'
                )?.value || "";


            return {

                name,

                options:
                    options
                        .split(",")
                        .map(
                            item =>
                                item.trim()
                        )
                        .filter(Boolean)

            };

        })
        .filter(
            item => item.name
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


    return Array.from(rows)
        .map(row => {

            const name =
                row.querySelector(
                    '[name="specificationName[]"]'
                )?.value || "";


            const value =
                row.querySelector(
                    '[name="specificationValue[]"]'
                )?.value || "";


            return {

                name,
                value

            };

        })
        .filter(
            item =>
                item.name ||
                item.value
        );

}


/*==================================================
SAVE PRODUCT
==================================================*/

async function saveProduct(
    publish = false
) {

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

        const product =
            getProductData();


        /*========================================
        PRODUCT ID
        ========================================*/

        if (!currentProductId) {

            currentProductId =
                generateProductId();

        }


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
        MAIN IMAGE
        ========================================*/

        if (mainImageFile) {

            product.mainImage =
                await uploadFile(
                    mainImageFile,
                    "smartbazaar/products"
                );

        }


        /*========================================
        GALLERY
        ========================================*/

        product.gallery =
            [];


        for (
            const file
            of galleryFiles
        ) {

            const url =
                await uploadFile(
                    file,
                    "smartbazaar/products/gallery"
                );


            if (url) {

                product.gallery.push(
                    url
                );

            }

        }


        /*========================================
        VIDEO
        ========================================*/

        if (productVideoFile) {

            product.video =
                await uploadFile(
                    productVideoFile,
                    "smartbazaar/products/videos"
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
            serverTimestamp();


        /*========================================
        CREATE DOCUMENT
        ========================================*/

        const docRef =
            await addDoc(
                collection(
                    db,
                    "products"
                ),
                {

                    ...product,

                    createdAt:
                        serverTimestamp()

                }
            );


        currentProductId =
            docRef.id;


        const productIdElement =
            document.getElementById(
                "product-id"
            );


        if (productIdElement) {

            productIdElement.textContent =
                docRef.id;

        }


        updateProductStatus(
            publish
                ? "Published"
                : "Draft"
        );


        showToast(
            publish
                ? "Product Published"
                : "Product Saved"
        );


    }
    catch (error) {

        console.error(
            "PRODUCT SAVE ERROR:",
            error
        );


        alert(
            "Product save failed.\n\n" +
            error.message
        );

    }
    finally {

        hideLoading();

    }

}


/*==================================================
SAVE BUTTONS
==================================================*/

document
    .getElementById(
        "save-draft-button"
    )
    ?.addEventListener(
        "click",
        () => {

            saveProduct(false);

        }
    );


document
    .getElementById(
        "save-draft-large-button"
    )
    ?.addEventListener(
        "click",
        () => {

            saveProduct(false);

        }
    );


document
    .getElementById(
        "publish-product-button"
    )
    ?.addEventListener(
        "click",
        () => {

            saveProduct(true);

        }
    );


document
    .getElementById(
        "publish-large-button"
    )
    ?.addEventListener(
        "click",
        event => {

            event.preventDefault();

            saveProduct(true);

        }
    );


/*==================================================
FORM SUBMIT
==================================================*/

form?.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        saveProduct(true);

    }
);


/*==================================================
LIVE PREVIEW
==================================================*/

function updateLivePreview() {

    const name =
        document.getElementById(
            "product-name"
        )?.value ||
        "Product Name";


    const brand =
        document.getElementById(
            "product-brand"
        )?.value ||
        "BRAND";


    const regularPrice =
        document.getElementById(
            "regular-price"
        )?.value ||
        0;


    const salePrice =
        document.getElementById(
            "sale-price"
        )?.value ||
        regularPrice;


    const description =
        document.getElementById(
            "product-description"
        )?.value ||
        "Product description will appear here.";


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
        `PKR ${Number(salePrice).toLocaleString()}`
    );

    setText(
        "detail-preview-price",
        `PKR ${Number(salePrice).toLocaleString()}`
    );


    setText(
        "detail-preview-description",
        description
    );


    if (mainImagePreview?.src) {

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
TEXT HELPER
==================================================*/

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);

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
        document.getElementById(id);

    if (!image) {
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
    function () {

        updateLivePreview();

    }
);


/*==================================================
PREVIEW BUTTON
==================================================*/

document
    .getElementById(
        "preview-button"
    )
    ?.addEventListener(
        "click",
        () => {

            updateLivePreview();

            document
                .getElementById(
                    "live-preview-panel"
                )
                ?.classList.add(
                    "active"
                );

        }
    );


document
    .getElementById(
        "mobile-preview-floating-button"
    )
    ?.addEventListener(
        "click",
        () => {

            updateLivePreview();

            document
                .getElementById(
                    "live-preview-panel"
                )
                ?.classList.add(
                    "active"
                );

        }
    );


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
    function (event) {

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


        if (rows.length <= 1) {

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
    function (event) {

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

                return;

            }


            try {

                await deleteDoc(
                    doc(
                        db,
                        "products",
                        currentProductId
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
                    error
                );

                alert(
                    error.message
                );

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
INITIALIZE
==================================================*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateLivePreview();

    }
);
