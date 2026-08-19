/*==================================================
SMARTBAZAAR PRO
PART 24.2
PRODUCT EDITOR JAVASCRIPT
==================================================*/


/*==================================================
CLOUDINARY CONFIG
==================================================*/

const cloudName =
    "jlrjn7lu";

const uploadPreset =
    "smartbazaar_uploads";


/*==================================================
FIREBASE PRODUCT FUNCTIONS
==================================================*/

import {
    addProduct,
    getProducts,
    deleteProduct
} from "./firebase-product.js";


/*==================================================
DOM ELEMENTS
==================================================*/

const productForm =
    document.querySelector(
        ".product-editor"
    );

const mainProductImage =
    document.getElementById(
        "mainProductImage"
    );

const uploadImageBtn =
    document.getElementById(
        "uploadImageBtn"
    );

const mainImagePreview =
    document.getElementById(
        "mainImagePreview"
    );

const productGallery =
    document.getElementById(
        "productGallery"
    );

const galleryPreview =
    document.getElementById(
        "galleryPreview"
    );

const saveProductBtn =
    document.getElementById(
        "saveProductBtn"
    );

const previewProductBtn =
    document.getElementById(
        "previewProductBtn"
    );

const cancelProductBtn =
    document.getElementById(
        "cancelProductBtn"
    );

const saveDraftBtn =
    document.getElementById(
        "saveDraftBtn"
    );

const finalSaveProductBtn =
    document.getElementById(
        "finalSaveProductBtn"
    );


/*==================================================
SELECTED FILES
==================================================*/

let selectedMainFile =
    null;

let selectedGalleryFiles =
    [];


/*==================================================
MESSAGE
==================================================*/

function showMessage(
    message,
    type = ""
) {

    let messageBox =
        document.getElementById(
            "productMessage"
        );


    if (!messageBox) {

        messageBox =
            document.createElement(
                "div"
            );

        messageBox.id =
            "productMessage";

        messageBox.style.cssText = `
            position:fixed;
            top:20px;
            right:20px;
            z-index:99999;
            padding:14px 20px;
            border-radius:12px;
            background:#222;
            color:#fff;
            font-size:14px;
            box-shadow:0 10px 30px rgba(0,0,0,.2);
        `;

        document.body.appendChild(
            messageBox
        );

    }


    messageBox.textContent =
        message;


    if (type === "success") {

        messageBox.style.background =
            "#16803c";

    }

    else if (type === "error") {

        messageBox.style.background =
            "#dc2626";

    }

    else {

        messageBox.style.background =
            "#222";

    }


    clearTimeout(
        messageBox._timer
    );


    messageBox._timer =
        setTimeout(
            function() {

                messageBox.remove();

            },
            4000
        );

}


/*==================================================
GET VALUE
==================================================*/

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {

        return "";

    }


    return String(
        element.value || ""
    ).trim();

}


/*==================================================
UPLOAD MAIN IMAGE BUTTON
==================================================*/

if (uploadImageBtn && mainProductImage) {

    uploadImageBtn.addEventListener(
        "click",
        function() {

            mainProductImage.click();

        }
    );

}


/*==================================================
MAIN IMAGE SELECT
==================================================*/

if (mainProductImage) {

    mainProductImage.addEventListener(
        "change",
        function() {

            const file =
                this.files &&
                this.files[0];


            if (!file) {

                selectedMainFile =
                    null;

                return;

            }


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                showMessage(
                    "Please select a valid image.",
                    "error"
                );

                this.value = "";

                return;

            }


            if (
                file.size >
                10 * 1024 * 1024
            ) {

                showMessage(
                    "Main image must be smaller than 10MB.",
                    "error"
                );

                this.value = "";

                return;

            }


            selectedMainFile =
                file;


            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    if (!mainImagePreview) {

                        return;

                    }


                    mainImagePreview.innerHTML = `

                        <img
                            src="${event.target.result}"
                            alt="Product Image">

                    `;

                    mainImagePreview.classList.add(
                        "active"
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/*==================================================
GALLERY SELECT
==================================================*/

if (productGallery) {

    productGallery.addEventListener(
        "change",
        function() {

            selectedGalleryFiles =
                Array.from(
                    this.files || []
                );


            if (
                selectedGalleryFiles.length === 0
            ) {

                if (galleryPreview) {

                    galleryPreview.innerHTML =
                        "";

                }

                return;

            }


            if (galleryPreview) {

                galleryPreview.innerHTML =
                    "";

            }


            selectedGalleryFiles.forEach(
                function(file) {

                    if (
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {

                        return;

                    }


                    const reader =
                        new FileReader();


                    reader.onload =
                        function(event) {

                            const img =
                                document.createElement(
                                    "img"
                                );

                            img.src =
                                event.target.result;

                            img.alt =
                                "Gallery Image";

                            if (galleryPreview) {

                                galleryPreview.appendChild(
                                    img
                                );

                            }

                        };


                    reader.readAsDataURL(
                        file
                    );

                }
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
            "Image file is missing."
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
            "Cloudinary image URL was not returned."
        );

    }


    return data.secure_url;

}


/*==================================================
UPLOAD ALL IMAGES
==================================================*/

async function uploadProductImages() {

    const imageURLs = [];


    /*==============================
    MAIN IMAGE
    ==============================*/

    if (selectedMainFile) {

        showMessage(
            "Uploading main product image..."
        );


        const mainURL =
            await uploadToCloudinary(
                selectedMainFile
            );


        imageURLs.push(
            mainURL
        );

    }


    /*==============================
    IMAGE URL
    ==============================*/

    const manualURL =
        getValue(
            "productImageUrl"
        );


    /*
    If user provides URL and
    no main file exists, use URL.
    */

    if (
        !selectedMainFile &&
        manualURL
    ) {

        imageURLs.push(
            manualURL
        );

    }


    /*==============================
    GALLERY
    ==============================*/

    for (
        const file
        of selectedGalleryFiles
    ) {

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            continue;

        }


        showMessage(
            "Uploading gallery images..."
        );


        const galleryURL =
            await uploadToCloudinary(
                file
            );


        imageURLs.push(
            galleryURL
        );

    }


    return imageURLs;

}


/*==================================================
GET BADGE
==================================================*/

function getSelectedBadge() {

    const selected =
        document.querySelector(
            'input[name="productBadge"]:checked'
        );


    return selected
        ? selected.value
        : "none";

}


/*==================================================
GET PRODUCT DATA
==================================================*/

function collectProductData(
    imageURLs,
    status
) {

    const price =
        Number(
            getValue(
                "productPrice"
            ) || 0
        );


    const oldPrice =
        Number(
            getValue(
                "productOldPrice"
            ) || 0
        );


    const rating =
        Number(
            getValue(
                "productRating"
            ) || 0
        );


    const reviewCount =
        Number(
            getValue(
                "reviewCount"
            ) || 0
        );


    const stockQuantity =
        Number(
            getValue(
                "stockQuantity"
            ) || 0
        );


    return {

        /*==============================
        BASIC
        ==============================*/

        name:
            getValue(
                "productName"
            ),

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


        /*==============================
        IMAGES
        ==============================*/

        image:
            imageURLs[0] || "",

        images:
            imageURLs,


        /*==============================
        PRICING
        ==============================*/

        price:
            price,

        oldPrice:
            oldPrice,

        discount:
            getValue(
                "productDiscount"
            ),

        currency:
            getValue(
                "productCurrency"
            ) || "PKR",


        /*==============================
        STOCK
        ==============================*/

        stockStatus:
            getValue(
                "stockStatus"
            ),

        stockQuantity:
            stockQuantity,


        /*==============================
        PRODUCT STATUS
        ==============================*/

        status:
            status,


        /*==============================
        BADGE
        ==============================*/

        badge:
            getSelectedBadge(),


        /*==============================
        RATING
        ==============================*/

        rating:
            rating,

        reviewCount:
            reviewCount,


        /*==============================
        OPTIONS
        ==============================*/

        colors:
            getValue(
                "productColors"
            ),

        sizes:
            getValue(
                "productSizes"
            ),


        /*==============================
        DELIVERY
        ==============================*/

        deliveryStatus:
            getValue(
                "deliveryStatus"
            ),

        deliveryText:
            getValue(
                "deliveryText"
            ),


        /*==============================
        TIMESTAMP
        ==============================*/

        createdAt:
            Date.now(),

        updatedAt:
            Date.now()

    };

}


/*==================================================
VALIDATE PRODUCT
==================================================*/

function validateProduct() {

    const name =
        getValue(
            "productName"
        );


    if (!name) {

        showMessage(
            "Please enter product name.",
            "error"
        );

        return false;

    }


    const price =
        Number(
            getValue(
                "productPrice"
            ) || 0
        );


    if (price <= 0) {

        showMessage(
            "Please enter a valid product price.",
            "error"
        );

        return false;

    }


    const manualURL =
        getValue(
            "productImageUrl"
        );


    if (
        !selectedMainFile &&
        !manualURL
    ) {

        showMessage(
            "Please upload a product image or enter an image URL.",
            "error"
        );

        return false;

    }


    return true;

}


/*==================================================
SAVE PRODUCT
==================================================*/

async function saveProduct(
    productStatus
) {

    if (!validateProduct()) {

        return;

    }


    try {

        showMessage(
            "Preparing product..."
        );


        /*==============================
        DISABLE BUTTONS
        ==============================*/

        setButtonsDisabled(
            true
        );


        /*==============================
        UPLOAD IMAGES
        ==============================*/

        const imageURLs =
            await uploadProductImages();


        if (
            imageURLs.length === 0
        ) {

            throw new Error(
                "No product image available."
            );

        }


        /*==============================
        PRODUCT DATA
        ==============================*/

        const productData =
            collectProductData(
                imageURLs,
                productStatus
            );


        /*==============================
        SAVE FIREBASE
        ==============================*/

        showMessage(
            "Saving product to Firebase..."
        );


        const productId =
            await addProduct(
                productData
            );


        console.log(
            "PRODUCT SAVED:",
            productId
        );


        /*==============================
        SUCCESS
        ==============================*/

        if (
            productStatus === "active"
        ) {

            showMessage(
                "Product published successfully!",
                "success"
            );

        }

        else {

            showMessage(
                "Product saved as draft.",
                "success"
            );

        }


        /*==============================
        RESET
        ==============================*/

        resetProductForm();

    }


    catch(error) {

        console.error(
            "PRODUCT SAVE ERROR:",
            error
        );


        showMessage(
            error.message ||
            "Product could not be saved.",
            "error"
        );

    }


    finally {

        setButtonsDisabled(
            false
        );

    }

}


/*==================================================
BUTTON STATE
==================================================*/

function setButtonsDisabled(
    disabled
) {

    [
        saveProductBtn,
        previewProductBtn,
        cancelProductBtn,
        saveDraftBtn,
        finalSaveProductBtn
    ]
    .forEach(
        function(button) {

            if (button) {

                button.disabled =
                    disabled;

            }

        }
    );

}


/*==================================================
SAVE PRODUCT BUTTON
==================================================*/

if (saveProductBtn) {

    saveProductBtn.addEventListener(
        "click",
        function() {

            saveProduct(
                "active"
            );

        }
    );

}


/*==================================================
PUBLISH PRODUCT
==================================================*/

if (finalSaveProductBtn) {

    finalSaveProductBtn.addEventListener(
        "click",
        function() {

            saveProduct(
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
        function() {

            saveProduct(
                "draft"
            );

        }
    );

}


/*==================================================
PREVIEW PRODUCT
==================================================*/

if (previewProductBtn) {

    previewProductBtn.addEventListener(
        "click",
        function() {

            if (!validateProduct()) {

                return;

            }


            const name =
                getValue(
                    "productName"
                );


            const price =
                getValue(
                    "productPrice"
                );


            const image =
                getValue(
                    "productImageUrl"
                );


            const previewWindow =
                window.open(
                    "",
                    "_blank"
                );


            if (!previewWindow) {

                showMessage(
                    "Please allow pop-ups to preview the product.",
                    "error"
                );

                return;

            }


            previewWindow.document.write(`

                <!DOCTYPE html>

                <html>

                <head>

                    <title>
                        Product Preview
                    </title>

                    <style>

                        body{
                            margin:0;
                            padding:40px;
                            font-family:Arial,sans-serif;
                            background:#f5f7fb;
                        }

                        .product{
                            max-width:360px;
                            margin:auto;
                            background:#fff;
                            border-radius:20px;
                            padding:20px;
                            box-shadow:0 10px 40px rgba(0,0,0,.12);
                        }

                        img{
                            width:100%;
                            height:280px;
                            object-fit:contain;
                            border-radius:15px;
                            background:#f4f4f4;
                        }

                        h2{
                            margin:20px 0 10px;
                        }

                        .price{
                            font-size:24px;
                            font-weight:bold;
                        }

                    </style>

                </head>

                <body>

                    <div class="product">

                        ${
                            image
                            ? `<img src="${image}">`
                            : `<p>No image URL entered.</p>`
                        }

                        <h2>
                            ${escapeHTML(name)}
                        </h2>

                        <div class="price">
                            Rs. ${escapeHTML(price)}
                        </div>

                    </div>

                </body>

                </html>

            `);


            previewWindow.document.close();

        }
    );

}


/*==================================================
CANCEL
==================================================*/

if (cancelProductBtn) {

    cancelProductBtn.addEventListener(
        "click",
        function() {

            const confirmed =
                confirm(
                    "Cancel product editing?"
                );


            if (
                confirmed
            ) {

                resetProductForm();

            }

        }
    );

}


/*==================================================
RESET FORM
==================================================*/

function resetProductForm() {

    const inputs =
        document.querySelectorAll(
            ".product-editor input, .product-editor textarea"
        );


    inputs.forEach(
        function(element) {

            if (
                element.type ===
                "file"
            ) {

                element.value =
                    "";

            }

            else {

                element.value =
                    "";

            }

        }
    );


    const selects =
        document.querySelectorAll(
            ".product-editor select"
        );


    selects.forEach(
        function(select) {

            select.selectedIndex =
                0;

        }
    );


    const noneBadge =
        document.querySelector(
            'input[name="productBadge"][value="none"]'
        );


    if (noneBadge) {

        noneBadge.checked =
            true;

    }


    if (mainImagePreview) {

        mainImagePreview.innerHTML = `

            <i class="fa-regular fa-image"></i>

            <span>
                Product Image
            </span>

        `;

        mainImagePreview.classList.remove(
            "active"
        );

    }


    if (galleryPreview) {

        galleryPreview.innerHTML =
            "";

    }


    selectedMainFile =
        null;


    selectedGalleryFiles =
        [];

}


/*==================================================
ESCAPE HTML
==================================================*/

function escapeHTML(
    value
) {

    return String(
        value
    )

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
INITIAL TEST
==================================================*/

console.log(
    "SmartBazaar Product Editor loaded successfully."
);
