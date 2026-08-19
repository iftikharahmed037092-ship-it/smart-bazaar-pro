/*==================================================
SMARTBAZAAR PRO
FEATURE 24.3
HOME PRODUCTS SYSTEM
FIREBASE → FEATURED PRODUCTS
==================================================*/


/*==================================================
IMPORT FIREBASE PRODUCT FUNCTIONS
==================================================*/

import {
    getProducts
} from "./firebase-product.js";


/*==================================================
DOM ELEMENTS
==================================================*/

const productsContainer =
    document.getElementById(
        "products-container"
    );


const viewAllProducts =
    document.getElementById(
        "view-all-products"
    );


/*==================================================
PRODUCT LIMIT
==================================================*/

const FEATURED_PRODUCT_LIMIT = 8;


/*==================================================
ESCAPE HTML
==================================================*/

function escapeHTML(value) {

    return String(
        value ?? ""
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
FORMAT PRICE
==================================================*/

function formatPrice(price) {

    const number =
        Number(price || 0);


    if (!number) {

        return "Rs. 0";

    }


    return (
        "Rs. " +
        number.toLocaleString(
            "en-PK"
        )
    );

}


/*==================================================
GET DISCOUNT
==================================================*/

function calculateDiscount(
    price,
    oldPrice
) {

    const currentPrice =
        Number(price || 0);

    const previousPrice =
        Number(oldPrice || 0);


    if (
        previousPrice <= 0 ||
        currentPrice <= 0 ||
        previousPrice <= currentPrice
    ) {

        return "";

    }


    const discount =
        Math.round(
            (
                (
                    previousPrice -
                    currentPrice
                ) /
                previousPrice
            ) * 100
        );


    return discount > 0
        ? `${discount}% OFF`
        : "";

}


/*==================================================
GET PRODUCT IMAGE
==================================================*/

function getProductImage(
    product
) {

    /*==============================
    MAIN IMAGE
    ==============================*/

    if (
        product &&
        product.image
    ) {

        return product.image;

    }


    /*==============================
    IMAGE ARRAY
    ==============================*/

    if (
        product &&
        Array.isArray(
            product.images
        ) &&
        product.images.length > 0
    ) {

        return product.images[0];

    }


    /*==============================
    NO IMAGE
    ==============================*/

    return "";

}


/*==================================================
PRODUCT BADGE
==================================================*/

function getBadge(
    product
) {

    const badge =
        String(
            product.badge || ""
        ).trim();


    if (
        !badge ||
        badge.toLowerCase() === "none"
    ) {

        return "";

    }


    return `
        <span class="product-badge">
            ${escapeHTML(badge)}
        </span>
    `;

}


/*==================================================
RATING STARS
==================================================*/

function getRatingStars(
    rating
) {

    const value =
        Number(rating || 0);


    if (value <= 0) {

        return `
            <div class="product-rating">
                <span class="no-rating">
                    No Rating
                </span>
            </div>
        `;

    }


    const roundedRating =
        Math.round(value);


    let stars = "";


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        if (
            i <= roundedRating
        ) {

            stars +=
                `<i class="fa-solid fa-star"></i>`;

        }

        else {

            stars +=
                `<i class="fa-regular fa-star"></i>`;

        }

    }


    return `
        <div class="product-rating">

            <span class="rating-stars">
                ${stars}
            </span>

            <span class="rating-number">
                ${value.toFixed(1)}
            </span>

        </div>
    `;

}


/*==================================================
PRODUCT CARD
==================================================*/

function createProductCard(
    product,
    productId
) {

    const image =
        getProductImage(
            product
        );


    const name =
        product.name ||
        "Unnamed Product";


    const price =
        Number(
            product.price || 0
        );


    const oldPrice =
        Number(
            product.oldPrice || 0
        );


    const discount =
        product.discount ||
        calculateDiscount(
            price,
            oldPrice
        );


    const rating =
        product.rating || 0;


    const reviewCount =
        Number(
            product.reviewCount || 0
        );


    const category =
        product.category ||
        "Product";


    const badge =
        getBadge(
            product
        );


    const safeId =
        encodeURIComponent(
            productId
        );


    return `

        <!--==================================
        FEATURED PRODUCT CARD
        FEATURE 24.3
        ==================================-->

        <article
            class="product-card"
            data-product-id="${safeId}">


            <!--==============================
            PRODUCT IMAGE
            ==============================-->

            <div class="product-image-box">

                ${
                    image

                    ? `

                    <img
                        class="product-image"
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(name)}"
                        loading="lazy">

                    `

                    : `

                    <div class="product-no-image">

                        <i class="fa-regular fa-image"></i>

                        <span>
                            No Image
                        </span>

                    </div>

                    `
                }


                <!-- BADGE -->

                ${badge}


                <!-- DISCOUNT -->

                ${
                    discount

                    ? `

                    <span class="product-discount">
                        ${escapeHTML(discount)}
                    </span>

                    `

                    : ""
                }


                <!-- WISHLIST -->

                <button
                    type="button"
                    class="product-wishlist"
                    data-wishlist-id="${safeId}"
                    aria-label="Add to wishlist">

                    <i class="fa-regular fa-heart"></i>

                </button>


            </div>


            <!--==============================
            PRODUCT INFORMATION
            ==============================-->

            <div class="product-info">


                <!-- CATEGORY -->

                <span class="product-category">

                    ${escapeHTML(category)}

                </span>


                <!-- NAME -->

                <h3 class="product-name">

                    ${escapeHTML(name)}

                </h3>


                <!-- RATING -->

                ${getRatingStars(rating)}


                ${
                    reviewCount > 0

                    ? `

                    <span class="product-reviews">

                        (${reviewCount})

                    </span>

                    `

                    : ""
                }


                <!--==============================
                PRICE
                ==============================-->

                <div class="product-price-row">


                    <span class="product-price">

                        ${formatPrice(price)}

                    </span>


                    ${
                        oldPrice > price

                        ? `

                        <span class="product-old-price">

                            ${formatPrice(oldPrice)}

                        </span>

                        `

                        : ""
                    }


                </div>


                <!--==============================
                DELIVERY
                ==============================-->

                ${
                    product.deliveryText

                    ? `

                    <div class="product-delivery">

                        <i class="fa-solid fa-truck"></i>

                        <span>
                            ${escapeHTML(
                                product.deliveryText
                            )}
                        </span>

                    </div>

                    `

                    : ""
                }


                <!--==============================
                VIEW PRODUCT
                ==============================-->

                <button
                    type="button"
                    class="view-product-btn"
                    data-product-id="${safeId}">

                    <i class="fa-regular fa-eye"></i>

                    View Product

                </button>


            </div>


        </article>

    `;

}


/*==================================================
LOADING STATE
==================================================*/

function showProductsLoading() {

    if (!productsContainer) {

        return;

    }


    productsContainer.innerHTML = `

        <div class="products-loading">

            <i class="fa-solid fa-spinner fa-spin"></i>

            <span>
                Loading products...
            </span>

        </div>

    `;

}


/*==================================================
EMPTY STATE
==================================================*/

function showProductsEmpty() {

    if (!productsContainer) {

        return;

    }


    productsContainer.innerHTML = `

        <div class="products-empty">

            <i class="fa-solid fa-box-open"></i>

            <h3>
                No Featured Products
            </h3>

            <p>
                Products will appear here after publishing.
            </p>

        </div>

    `;

}


/*==================================================
ERROR STATE
==================================================*/

function showProductsError(
    error
) {

    console.error(
        "HOME PRODUCTS ERROR:",
        error
    );


    if (!productsContainer) {

        return;

    }


    productsContainer.innerHTML = `

        <div class="products-error">

            <i class="fa-solid fa-triangle-exclamation"></i>

            <h3>
                Products could not be loaded
            </h3>

            <p>
                Please check your Firebase connection.
            </p>

            <button
                type="button"
                id="retryProductsBtn">

                Try Again

            </button>

        </div>

    `;


    const retryButton =
        document.getElementById(
            "retryProductsBtn"
        );


    if (retryButton) {

        retryButton.addEventListener(
            "click",
            loadFeaturedProducts
        );

    }

}


/*==================================================
FILTER ACTIVE PRODUCTS
==================================================*/

function getActiveProducts(
    products
) {

    if (!products) {

        return [];

    }


    const productArray =
        Object.entries(
            products
        )


        .map(
            function([
                id,
                product
            ]) {

                return {

                    id: id,

                    ...product

                };

            }
        )


        .filter(
            function(product) {

                return (
                    String(
                        product.status || ""
                    ).toLowerCase()
                    ===
                    "active"
                );

            }
        );


    /*==============================
    NEWEST PRODUCTS FIRST
    ==============================*/

    productArray.sort(
        function(a, b) {

            return (
                Number(
                    b.createdAt || 0
                )
                -
                Number(
                    a.createdAt || 0
                )
            );

        }
    );


    return productArray;

}


/*==================================================
RENDER PRODUCTS
==================================================*/

function renderProducts(
    products
) {

    if (!productsContainer) {

        console.warn(
            "products-container not found."
        );

        return;

    }


    if (
        !products ||
        products.length === 0
    ) {

        showProductsEmpty();

        return;

    }


    const featuredProducts =
        products.slice(
            0,
            FEATURED_PRODUCT_LIMIT
        );


    productsContainer.innerHTML =
        featuredProducts
        .map(
            function(product) {

                return createProductCard(
                    product,
                    product.id
                );

            }
        )
        .join("");


    attachProductEvents();

}


/*==================================================
PRODUCT EVENTS
==================================================*/

function attachProductEvents() {


    /*==============================
    VIEW PRODUCT
    ==============================*/

    const viewButtons =
        document.querySelectorAll(
            ".view-product-btn"
        );


    viewButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const productId =
                        decodeURIComponent(
                            this.dataset.productId
                        );


                    openProduct(
                        productId
                    );

                }
            );

        }
    );


    /*==============================
    WISHLIST
    ==============================*/

    const wishlistButtons =
        document.querySelectorAll(
            ".product-wishlist"
        );


    wishlistButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    event.stopPropagation();


                    this.classList.toggle(
                        "active"
                    );


                    const icon =
                        this.querySelector(
                            "i"
                        );


                    if (
                        icon
                    ) {

                        icon.classList.toggle(
                            "fa-regular"
                        );

                        icon.classList.toggle(
                            "fa-solid"
                        );

                    }

                }
            );

        }
    );

}


/*==================================================
OPEN PRODUCT
==================================================*/

function openProduct(
    productId
) {

    if (!productId) {

        return;

    }


    /*
    Product detail page can be
    connected later.

    For now we store the ID
    for the next page.
    */


    localStorage.setItem(
        "selectedProductId",
        productId
    );


    /*
    If product-detail.html
    exists, open it.
    */

    window.location.href =
        `product-detail.html?id=${encodeURIComponent(
            productId
        )}`;

}


/*==================================================
VIEW ALL PRODUCTS
==================================================*/

if (viewAllProducts) {

    viewAllProducts.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


            /*
            Product listing page
            can be connected here.
            */


            window.location.href =
                "products.html";

        }
    );

}


/*==================================================
LOAD FEATURED PRODUCTS
==================================================*/

async function loadFeaturedProducts() {

    if (!productsContainer) {

        console.warn(
            "products-container not found."
        );

        return;

    }


    showProductsLoading();


    try {

        /*==============================
        GET FIREBASE PRODUCTS
        ==============================*/

        const products =
            await getProducts();


        console.log(
            "FIREBASE PRODUCTS:",
            products
        );


        /*==============================
        FILTER ACTIVE
        ==============================*/

        const activeProducts =
            getActiveProducts(
                products
            );


        console.log(
            "ACTIVE PRODUCTS:",
            activeProducts
        );


        /*==============================
        RENDER
        ==============================*/

        renderProducts(
            activeProducts
        );

    }


    catch(error) {

        showProductsError(
            error
        );

    }

}


/*==================================================
START
==================================================*/

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadFeaturedProducts();

    }
);


/*==================================================
INITIAL TEST
==================================================*/

console.log(
    "SmartBazaar Pro Home Products loaded successfully."
);
