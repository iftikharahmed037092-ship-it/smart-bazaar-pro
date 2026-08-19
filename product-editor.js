/*==================================================
 SMARTBAZAAR PRO
 PRODUCT EDITOR JAVASCRIPT
==================================================

 FEATURES USED:

 (24) Product Card Element
 (28) Media Library Tab
 (29) Live Preview Canvas
 (8) Save Button
 (14) Image Element
 (167) Product Grid Builder
 (173) Product Gallery
 (174) Product Reviews
 (175) Sale Badge
 (176) Stock Counter
 (279) Wishlist Button

 STORAGE:

 Cloudinary  → Product Images
 Firebase    → Product Data

 IMAGE METHODS:

 1. File Upload
 2. Image URL
 3. Drag & Drop

==================================================*/


/*==================================================
 FIREBASE
==================================================*/

import {

    database

} from "./firebase.js";


import {

    ref,
    push,
    set

} from
"https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";



/*==================================================
 CLOUDINARY
==================================================*/

import {

    uploadImage

} from "./cloudinary.js";



/*==================================================
 DOM ELEMENTS
==================================================*/

const productName =
document.getElementById("productName");


const productSKU =
document.getElementById("productSKU");


const productCategory =
document.getElementById("productCategory");


const productBrand =
document.getElementById("productBrand");


const productDescription =
document.getElementById("productDescription");


const productPrice =
document.getElementById("productPrice");


const productOldPrice =
document.getElementById("productOldPrice");


const productDiscount =
document.getElementById("productDiscount");


const productCurrency =
document.getElementById("productCurrency");


const stockStatus =
document.getElementById("stockStatus");


const stockQuantity =
document.getElementById("stockQuantity");


const productStatus =
document.getElementById("productStatus");


const productRating =
document.getElementById("productRating");


const reviewCount =
document.getElementById("reviewCount");


const productColors =
document.getElementById("productColors");


const productSizes =
document.getElementById("productSizes");


const deliveryStatus =
document.getElementById("deliveryStatus");


const deliveryText =
document.getElementById("deliveryText");


const productImageUrl =
document.getElementById("productImageUrl");


const mainImagePreview =
document.getElementById("mainImagePreview");


const mainProductImage =
document.getElementById("mainProductImage");


const uploadImageBtn =
document.getElementById("uploadImageBtn");


const productGallery =
document.getElementById("productGallery");


const galleryPreview =
document.getElementById("galleryPreview");


const previewProductBtn =
document.getElementById("previewProductBtn");


const saveProductBtn =
document.getElementById("saveProductBtn");


const saveDraftBtn =
document.getElementById("saveDraftBtn");


const finalSaveProductBtn =
document.getElementById("finalSaveProductBtn");


const cancelProductBtn =
document.getElementById("cancelProductBtn");



/*==================================================
 IMAGE STATE
==================================================*/

let mainImageFile = null;

let mainImageFinalURL = "";

let galleryFiles = [];

let galleryURLs = [];



/*==================================================
 HELPERS
==================================================*/


function showMessage(message){

    alert(message);

}



function setButtonLoading(button, loading){

    if(!button) return;


    if(loading){

        button.dataset.originalText =
        button.innerHTML;

        button.disabled = true;

        button.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Saving...
        `;

    }else{

        button.disabled = false;

        if(button.dataset.originalText){

            button.innerHTML =
            button.dataset.originalText;

        }

    }

}



/*==================================================
 IMAGE PREVIEW
==================================================*/

function showMainImage(url){

    if(!mainImagePreview) return;


    mainImagePreview.innerHTML = `
        
        <img
            src="${url}"
            alt="Product Image"
            style="
                width:100%;
                height:100%;
                min-height:310px;
                object-fit:cover;
                border-radius:18px;
                display:block;
            "
        >

    `;

}



/*==================================================
 FILE PREVIEW
==================================================*/

function previewMainFile(file){

    if(!file) return;


    if(!file.type.startsWith("image/")){

        showMessage(
            "Please select a valid image file."
        );

        return;

    }


    mainImageFile = file;


    const reader =
    new FileReader();


    reader.onload = function(event){

        showMainImage(
            event.target.result
        );

    };


    reader.readAsDataURL(file);

}



/*==================================================
 FILE INPUT
==================================================*/

if(mainProductImage){

    mainProductImage.addEventListener(
        "change",
        function(){

            const file =
            this.files[0];


            previewMainFile(file);

        }
    );

}



/*==================================================
 UPLOAD BUTTON
==================================================*/

if(uploadImageBtn){

    uploadImageBtn.addEventListener(
        "click",
        function(){

            if(mainProductImage){

                mainProductImage.click();

            }

        }
    );

}



/*==================================================
 IMAGE URL
==================================================*/

if(productImageUrl){

    productImageUrl.addEventListener(
        "input",
        function(){

            const url =
            this.value.trim();


            if(!url) return;


            mainImageFile = null;

            mainImageFinalURL = url;


            showMainImage(url);

        }
    );

}



/*==================================================
 DRAG & DROP
==================================================*/

if(mainImagePreview){

    mainImagePreview.addEventListener(
        "dragover",
        function(event){

            event.preventDefault();

            event.stopPropagation();

            this.style.outline =
            "3px dashed #15803d";

            this.style.outlineOffset =
            "-6px";

        }
    );


    mainImagePreview.addEventListener(
        "dragleave",
        function(event){

            event.preventDefault();

            event.stopPropagation();

            this.style.outline = "none";

        }
    );


    mainImagePreview.addEventListener(
        "drop",
        function(event){

            event.preventDefault();

            event.stopPropagation();

            this.style.outline = "none";


            const files =
            event.dataTransfer.files;


            if(!files || !files.length){

                return;

            }


            const file =
            files[0];


            previewMainFile(file);

        }
    );

}



/*==================================================
 GALLERY FILES
==================================================*/

if(productGallery){

    productGallery.addEventListener(
        "change",
        function(){

            galleryFiles =
            Array.from(this.files || []);


            previewGallery();

        }
    );

}



/*==================================================
 GALLERY PREVIEW
==================================================*/

function previewGallery(){

    if(!galleryPreview) return;


    galleryPreview.innerHTML = "";


    galleryFiles.forEach(
        function(file){

            if(!file.type.startsWith("image/")){

                return;

            }


            const reader =
            new FileReader();


            reader.onload =
            function(event){

                const image =
                document.createElement("img");


                image.src =
                event.target.result;


                image.alt =
                "Product Gallery";


                galleryPreview.appendChild(
                    image
                );

            };


            reader.readAsDataURL(file);

        }
    );

}



/*==================================================
 UPLOAD MAIN IMAGE TO CLOUDINARY
==================================================*/

async function uploadMainImage(){

    /*
    URL already provided
    */

    if(
        !mainImageFile &&
        productImageUrl &&
        productImageUrl.value.trim()
    ){

        return productImageUrl.value.trim();

    }


    /*
    No image
    */

    if(!mainImageFile){

        return "";

    }


    /*
    Upload to Cloudinary
    */

    const url =
    await uploadImage(
        mainImageFile
    );


    return url;

}



/*==================================================
 UPLOAD GALLERY TO CLOUDINARY
==================================================*/

async function uploadGalleryImages(){

    if(!galleryFiles.length){

        return [];

    }


    const uploadedURLs = [];


    for(
        const file
        of galleryFiles
    ){

        try{

            const url =
            await uploadImage(file);


            if(url){

                uploadedURLs.push(url);

            }

        }catch(error){

            console.error(
                "Gallery upload error:",
                error
            );

        }

    }


    return uploadedURLs;

}



/*==================================================
 GET SELECTED BADGE
==================================================*/

function getSelectedBadge(){

    const badge =
    document.querySelector(
        'input[name="productBadge"]:checked'
    );


    return badge
        ? badge.value
        : "none";

}



/*==================================================
 CONVERT COMMA TEXT TO ARRAY
==================================================*/

function convertToArray(value){

    if(!value){

        return [];

    }


    return value
        .split(",")
        .map(item => item.trim())
        .filter(item => item !== "");

}



/*==================================================
 COLLECT PRODUCT DATA
==================================================*/

function collectProductData(){

    return {

        title:
        productName?.value.trim() || "",


        sku:
        productSKU?.value.trim() || "",


        category:
        productCategory?.value || "",


        brand:
        productBrand?.value.trim() || "",


        description:
        productDescription?.value.trim() || "",


        price:
        Number(productPrice?.value || 0),


        oldPrice:
        Number(productOldPrice?.value || 0),


        discount:
        productDiscount?.value.trim() || "",


        currency:
        productCurrency?.value || "PKR",


        image:
        mainImageFinalURL || "",


        gallery:
        galleryURLs || [],


        badge:
        getSelectedBadge(),


        stockStatus:
        stockStatus?.value || "in-stock",


        stockQuantity:
        Number(stockQuantity?.value || 0),


        status:
        productStatus?.value || "draft",


        rating:
        Number(productRating?.value || 0),


        reviewCount:
        Number(reviewCount?.value || 0),


        colors:
        convertToArray(
            productColors?.value
        ),


        sizes:
        convertToArray(
            productSizes?.value
        ),


        delivery:{

            status:
            deliveryStatus?.value || "free",

            text:
            deliveryText?.value.trim() || ""

        },


        wishlistEnabled:
        true,


        createdAt:
        Date.now(),


        updatedAt:
        Date.now()

    };

}



/*==================================================
 VALIDATION
==================================================*/

function validateProduct(product){

    if(!product.title){

        showMessage(
            "Please enter Product Name."
        );

        productName?.focus();

        return false;

    }


    if(!product.category){

        showMessage(
            "Please select Product Category."
        );

        productCategory?.focus();

        return false;

    }


    if(product.price <= 0){

        showMessage(
            "Please enter a valid Product Price."
        );

        productPrice?.focus();

        return false;

    }


    return true;

}



/*==================================================
 SAVE PRODUCT TO FIREBASE
==================================================*/

async function saveProduct(mode){

    try{

        /*
        Loading
        */

        setButtonLoading(
            finalSaveProductBtn,
            true
        );


        setButtonLoading(
            saveDraftBtn,
            true
        );


        /*
        Upload Main Image
        */

        mainImageFinalURL =
        await uploadMainImage();


        /*
        Upload Gallery
        */

        galleryURLs =
        await uploadGalleryImages();


        /*
        Collect data
        */

        const product =
        collectProductData();


        /*
        Set status
        */

        if(mode === "draft"){

            product.status =
            "draft";

        }else{

            product.status =
            "active";

        }


        /*
        Validation
        */

        if(!validateProduct(product)){

            setButtonLoading(
                finalSaveProductBtn,
                false
            );


            setButtonLoading(
                saveDraftBtn,
                false
            );


            return;

        }


        /*
        Firebase Realtime Database
        */

        const productsRef =
        ref(
            database,
            "products"
        );


        const newProductRef =
        push(productsRef);


        /*
        Product ID
        */

        product.id =
        newProductRef.key;


        /*
        Save
        */

        await set(
            newProductRef,
            product
        );


        /*
        Success
        */

        showMessage(

            mode === "draft"

            ? "Product Draft Saved Successfully ✅"

            : "Product Published Successfully ✅"

        );


        /*
        Reset state
        */

        mainImageFile = null;

        mainImageFinalURL =
        product.image;

        galleryFiles = [];


        /*
        Keep image URL
        */

        if(productImageUrl){

            productImageUrl.value =
            product.image;

        }


    }catch(error){

        console.error(
            "Product Save Error:",
            error
        );


        showMessage(
            "Product Save Failed: " +
            error.message
        );


    }finally{

        setButtonLoading(
            finalSaveProductBtn,
            false
        );


        setButtonLoading(
            saveDraftBtn,
            false
        );

    }

}



/*==================================================
 SAVE PRODUCT BUTTON
==================================================*/

if(saveProductBtn){

    saveProductBtn.addEventListener(
        "click",
        function(){

            saveProduct("active");

        }
    );

}



/*==================================================
 SAVE DRAFT
==================================================*/

if(saveDraftBtn){

    saveDraftBtn.addEventListener(
        "click",
        function(){

            saveProduct("draft");

        }
    );

}



/*==================================================
 PUBLISH PRODUCT
==================================================*/

if(finalSaveProductBtn){

    finalSaveProductBtn.addEventListener(
        "click",
        function(){

            saveProduct("active");

        }
    );

}



/*==================================================
 PREVIEW PRODUCT
==================================================*/

if(previewProductBtn){

    previewProductBtn.addEventListener(
        "click",
        function(){

            const product =
            collectProductData();


            if(!validateProduct(product)){

                return;

            }


            /*
            Save temporary preview
            */

            sessionStorage.setItem(

                "smartbazaar_product_preview",

                JSON.stringify(product)

            );


            showMessage(
                "Product Preview Data Ready ✅"
            );

        }
    );

}



/*==================================================
 CANCEL
==================================================*/

if(cancelProductBtn){

    cancelProductBtn.addEventListener(
        "click",
        function(){

            const confirmCancel =
            confirm(
                "Are you sure you want to cancel?"
            );


            if(confirmCancel){

                window.history.back();

            }

        }
    );

}



/*==================================================
 INITIAL STATE
==================================================*/

console.log(
    "SMARTBAZAAR PRO Product Editor Loaded ✅"
);
