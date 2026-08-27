/*==================================================
SMARTBAZAAR PRO
FEATURE 24.3
HOME PRODUCTS SYSTEM
PUBLISHED PRODUCTS
PRODUCT CARD + PRODUCT DETAIL NAVIGATION
==================================================*/


/*==================================================
IMPORT PRODUCTS
==================================================*/

import {
    getPublishedProducts
} from "./firebase-product.js";


/*==================================================
DOM
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
LIMIT
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
        Number(
            price || 0
        );


    return (
        "Rs. " +
        number.toLocaleString(
            "en-PK"
        )
    );

}


/*==================================================
GET PRODUCT ID
==================================================*/

function getProductId(
    product,
    fallbackId = ""
) {

    return String(
        product?.productId ||
        product?.id ||
        fallbackId ||
        ""
    ).trim();

}


/*==================================================
GET PRODUCT IMAGE
==================================================*/

function getProductImage(
    product
) {

    /*----------------------------------------------
    MAIN IMAGE
    ----------------------------------------------*/

    if (
        typeof product?.mainImage ===
        "string" &&
        product.mainImage.trim()
    ) {

        return product.mainImage.trim();

    }


    /*----------------------------------------------
    OLD IMAGE FIELD
    ----------------------------------------------*/

    if (
        typeof product?.image ===
        "string" &&
        product.image.trim()
    ) {

        return product.image.trim();

    }


    /*----------------------------------------------
    GALLERY
    ----------------------------------------------*/

    if (
        Array.isArray(
            product?.gallery
        ) &&
        product.gallery.length
    ) {

        const image =
            product.gallery.find(
                item =>
                    typeof item === "string" &&
                    item.trim()
            );


        if (image) {

            return image.trim();

        }

    }


    /*----------------------------------------------
    OLD IMAGES FIELD
    ----------------------------------------------*/

    if (
        Array.isArray(
            product?.images
        ) &&
        product.images.length
    ) {

        const image =
            product.images.find(
                item =>
                    typeof item === "string" &&
                    item.trim()
            );


        if (image) {

            return image.trim();

        }

    }


    return "";

}


/*==================================================
CALCULATE DISCOUNT
==================================================*/

function calculateDiscount(
    price,
    oldPrice
) {

    const current =
        Number(
            price || 0
        );


    const old =
        Number(
            oldPrice || 0
        );


    if (
        old <= current ||
        old <= 0
    ) {

        return "";

    }


    const discount =
        Math.round(
            (
                (
                    old -
                    current
                ) /
                old
            ) * 100
        );


    return (
        discount > 0
            ? `${discount}% OFF`
            : ""
    );

}


/*==================================================
GET BADGE
==================================================*/

function getBadge(
    product
) {

    const badge =
        String(
            product?.badge || ""
        ).trim();


    if (
        !badge ||
        badge.toLowerCase() === "none"
    ) {

        return "";

    }


    return `

        <span class="product-badge">

            ${escapeHTML(
                badge
            )}

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
        Number(
            rating || 0
        );


    if (value <= 0) {

        return `

            <div class="product-rating">

                <span class="no-rating">
                    No Rating
                </span>

            </div>

        `;

    }


    const rounded =
        Math.max(
            0,
            Math.min(
                5,
                Math.round(
                    value
                )
            )
        );


    let stars = "";


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        stars +=
            i <= rounded

                ? `
                    <i
                        class="fa-solid fa-star"
                        aria-hidden="true">
                    </i>
                `

                : `
                    <i
                        class="fa-regular fa-star"
                        aria-hidden="true">
                    </i>
                `;

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
CREATE PRODUCT CARD
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
        product?.productName ||
        product?.name ||
        "Unnamed Product";


    const category =
        product?.category ||
        "Product";


    const price =
        Number(
            product?.salePrice ||
            product?.regularPrice ||
            product?.price ||
            0
        );


    const oldPrice =
        Number(
            product?.regularPrice ||
            product?.oldPrice ||
            0
        );


    const discount =
        calculateDiscount(
            price,
            oldPrice
        );


    const rating =
        Number(
            product?.rating ||
            0
        );


    const reviewCount =
        Number(
            product?.reviewCount ||
            0
        );


    const safeId =
        encodeURIComponent(
            getProductId(
                product,
                productId
            )
        );


    /*----------------------------------------------
    PRODUCT CARD
    IMPORTANT:
    WHOLE CARD IS CLICKABLE
    ----------------------------------------------*/

    return `

        <article
            class="product-card"
            data-product-id="${escapeHTML(
                safeId
            )}"
            data-product-url="product-detail.html?id=${safeId}"
            role="button"
            tabindex="0"
            aria-label="View ${escapeHTML(
                name
            )}">


            <!--====================================
            PRODUCT IMAGE
            ====================================-->

            <div class="product-image-box">

                ${
                    image

                    ? `

                    <img
                        class="product-image"
                        src="${escapeHTML(
                            image
                        )}"
                        alt="${escapeHTML(
                            name
                        )}"
                        loading="lazy"
                        decoding="async">

                    `

                    : `

                    <div class="product-no-image">

                        <i
                            class="fa-regular fa-image"
                            aria-hidden="true">
                        </i>

                        <span>
                            No Image
                        </span>

                    </div>

                    `
                }


                ${getBadge(product)}


                ${
                    discount

                    ? `

                    <span class="product-discount">

                        ${escapeHTML(
                            discount
                        )}

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

                    <i
                        class="fa-regular fa-heart"
                        aria-hidden="true">
                    </i>

                </button>


            </div>


            <!--====================================
            PRODUCT INFORMATION
            ====================================-->

            <div class="product-info">


                <span class="product-category">

                    ${escapeHTML(
                        category
                    )}

                </span>


                <h3 class="product-name">

                    ${escapeHTML(
                        name
                    )}

                </h3>


                ${getRatingStars(
                    rating
                )}


                ${
                    reviewCount > 0

                    ? `

                    <span class="product-reviews">

                        (${escapeHTML(
                            reviewCount
                        )})

                    </span>

                    `

                    : ""
                }


                <!--================================
                PRICE
                =================================-->

                <div class="product-price-row">

                    <span class="product-price">

                        ${formatPrice(
                            price
                        )}

                    </span>


                    ${
                        oldPrice > price

                        ? `

                        <span class="product-old-price">

                            ${formatPrice(
                                oldPrice
                            )}

                        </span>

                        `

                        : ""
                    }

                </div>


                <!--================================
                DELIVERY
                =================================-->

                ${
                    product?.deliveryTime

                    ? `

                    <div class="product-delivery">

                        <i
                            class="fa-solid fa-truck"
                            aria-hidden="true">
                        </i>

                        <span>

                            ${escapeHTML(
                                product.deliveryTime
                            )}

                        </span>

                    </div>

                    `

                    : ""
                }


                <!--================================
                VIEW PRODUCT BUTTON
                =================================-->

                <button
                    type="button"
                    class="view-product-btn"
                    data-product-id="${safeId}">

                    <i
                        class="fa-regular fa-eye"
                        aria-hidden="true">
                    </i>

                    View Product

                </button>


            </div>


        </article>

    `;

}


/*==================================================
LOADING
==================================================*/

function showProductsLoading() {

    if (!productsContainer) {

        return;

    }


    productsContainer.innerHTML = `

        <div class="products-loading">

            <i
                class="fa-solid fa-spinner fa-spin"
                aria-hidden="true">
            </i>

            <span>
                Loading products...
            </span>

        </div>

    `;

}


/*==================================================
EMPTY
==================================================*/

function showProductsEmpty() {

    if (!productsContainer) {

        return;

    }


    productsContainer.innerHTML = `

        <div class="products-empty">

            <i
                class="fa-solid fa-box-open"
                aria-hidden="true">
            </i>

            <h3>
                No Featured Products
            </h3>

            <p>
                Published products will appear here.
            </p>

        </div>

    `;

}


/*==================================================
ERROR
==================================================*/

function showProductsError(
    error
) {

    console.error(
        "SMARTBAZAAR PRO FEATURE 24.3 ERROR:",
        error
    );


    if (!productsContainer) {

        return;

    }


    productsContainer.innerHTML = `

        <div class="products-error">

            <i
                class="fa-solid fa-triangle-exclamation"
                aria-hidden="true">
            </i>

            <h3>
                Products could not be loaded
            </h3>

            <p>
                Please check your Firebase connection.
            </p>

            <button
                type="button"
                id="retryProductsBtn">

                <i
                    class="fa-solid fa-rotate-right"
                    aria-hidden="true">
                </i>

                Try Again

            </button>

        </div>

    `;


    document
        .getElementById(
            "retryProductsBtn"
        )
        ?.addEventListener(
            "click",
            loadFeaturedProducts
        );

}


/*==================================================
SORT PRODUCTS
==================================================*/

function sortProducts(
    products
) {

    return [
        ...(Array.isArray(
            products
        )
            ? products
            : [])
    ]
        .sort(
            (
                a,
                b
            ) => {

                const aCreated =
                    a?.createdAt;


                const bCreated =
                    b?.createdAt;


                const aTime =
                    aCreated?.seconds
                        ? Number(
                            aCreated.seconds
                        ) * 1000

                        : (
                            typeof aCreated ===
                            "string"

                                ? Date.parse(
                                    aCreated
                                ) || 0

                                : Number(
                                    aCreated || 0
                                )
                        );


                const bTime =
                    bCreated?.seconds
                        ? Number(
                            bCreated.seconds
                        ) * 1000

                        : (
                            typeof bCreated ===
                            "string"

                                ? Date.parse(
                                    bCreated
                                ) || 0

                                : Number(
                                    bCreated || 0
                                )
                        );


                return (
                    bTime -
                    aTime
                );

            }
        );

}


/*==================================================
RENDER PRODUCTS
==================================================*/

function renderProducts(
    products
) {

    if (!productsContainer) {

        return;

    }


    if (
        !Array.isArray(
            products
        ) ||
        !products.length
    ) {

        showProductsEmpty();

        return;

    }


    const sortedProducts =
        sortProducts(
            products
        );


    const featured =
        sortedProducts.slice(
            0,
            FEATURED_PRODUCT_LIMIT
        );


    const validProducts =
        featured.filter(
            product =>
                getProductId(
                    product
                )
        );


    if (!validProducts.length) {

        showProductsEmpty();

        return;

    }


    productsContainer.innerHTML =
        validProducts
            .map(
                product => {

                    const id =
                        getProductId(
                            product
                        );


                    return createProductCard(
                        product,
                        id
                    );

                }
            )
            .join("");


    attachProductEvents();

}


/*==================================================
OPEN PRODUCT DETAIL
==================================================*/

function openProduct(
    productId
) {

    const id =
        String(
            productId || ""
        ).trim();


    if (!id) {

        console.error(
            "PRODUCT DETAIL ERROR: Product ID is missing."
        );

        return;

    }


    /*----------------------------------------------
    SAVE SELECTED PRODUCT
    ----------------------------------------------*/

    try {

        localStorage.setItem(
            "selectedProductId",
            id
        );

    }
    catch (error) {

        console.warn(
            "Could not save selectedProductId:",
            error
        );

    }


    /*----------------------------------------------
    OPEN DETAIL PAGE
    ----------------------------------------------*/

    window.location.href =
        `product-detail.html?id=${encodeURIComponent(
            id
        )}`;

}


/*==================================================
PRODUCT CARD EVENTS
==================================================*/

function attachProductEvents() {

    if (!productsContainer) {

        return;

    }


    /*==============================================
    WHOLE PRODUCT CARD CLICK
    ==============================================*/

    productsContainer
        .querySelectorAll(
            ".product-card"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "click",
                    function(event) {

                        /*--------------------------------
                        IGNORE BUTTONS / LINKS / INPUTS
                        --------------------------------*/

                        if (
                            event.target.closest(
                                "button, a, input, select, textarea"
                            )
                        ) {

                            return;

                        }


                        const encodedId =
                            this.dataset.productId;


                        if (!encodedId) {

                            return;

                        }


                        const productId =
                            decodeURIComponent(
                                encodedId
                            );


                        openProduct(
                            productId
                        );

                    }
                );


                /*--------------------------------------
                KEYBOARD SUPPORT
                --------------------------------------*/

                card.addEventListener(
                    "keydown",
                    function(event) {

                        if (
                            event.key !== "Enter" &&
                            event.key !== " "
                        ) {

                            return;

                        }


                        event.preventDefault();


                        const encodedId =
                            this.dataset.productId;


                        if (!encodedId) {

                            return;

                        }


                        const productId =
                            decodeURIComponent(
                                encodedId
                            );


                        openProduct(
                            productId
                        );

                    }
                );

            }
        );


    /*==============================================
    VIEW PRODUCT BUTTON
    ==============================================*/

    productsContainer
        .querySelectorAll(
            ".view-product-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();

                        event.stopPropagation();


                        const encodedId =
                            this.dataset.productId;


                        if (!encodedId) {

                            return;

                        }


                        const productId =
                            decodeURIComponent(
                                encodedId
                            );


                        openProduct(
                            productId
                        );

                    }
                );

            }
        );


    /*==============================================
    PRODUCT IMAGE CLICK
    ==============================================*/

    productsContainer
        .querySelectorAll(
            ".product-image"
        )
        .forEach(
            image => {

                image.addEventListener(
                    "click",
                    function(event) {

                        event.preventDefault();

                        event.stopPropagation();


                        const card =
                            this.closest(
                                ".product-card"
                            );


                        const encodedId =
                            card?.dataset.productId;


                        if (!encodedId) {

                            return;

                        }


                        const productId =
                            decodeURIComponent(
                                encodedId
                            );


                        openProduct(
                            productId
                        );

                    }
                );

            }
        );


    /*==============================================
    WISHLIST
    ==============================================*/

    productsContainer
        .querySelectorAll(
            ".product-wishlist"
        )
        .forEach(
            button => {

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


                        if (!icon) {

                            return;

                        }


                        const isActive =
                            this.classList.contains(
                                "active"
                            );


                        icon.classList.toggle(
                            "fa-regular",
                            !isActive
                        );


                        icon.classList.toggle(
                            "fa-solid",
                            isActive
                        );


                        this.setAttribute(
                            "aria-label",
                            isActive
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                        );

                    }
                );

            }
        );

}


/*==================================================
VIEW ALL PRODUCTS
==================================================*/

if (viewAllProducts) {

    viewAllProducts.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


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
            "FEATURE 24.3: #products-container not found."
        );

        return;

    }


    showProductsLoading();


    try {

        const products =
            await getPublishedProducts();


        console.log(
            "SMARTBAZAAR PRO FEATURE 24.3 — PUBLISHED PRODUCTS:",
            products
        );


        renderProducts(
            products
        );

    }
    catch (error) {

        showProductsError(
            error
        );

    }

}


/*==================================================
START SYSTEM
==================================================*/

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        loadFeaturedProducts,
        {
            once: true
        }
    );

}
else {

    loadFeaturedProducts();

}


/*==================================================
SYSTEM READY
==================================================*/

console.log(
    "SMARTBAZAAR PRO FEATURE 24.3 — HOME PRODUCTS SYSTEM LOADED."
);
