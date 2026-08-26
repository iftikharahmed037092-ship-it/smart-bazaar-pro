/*==================================================
SMARTBAZAAR PRO
FEATURE 24.3
HOME PRODUCTS SYSTEM
FIRESTORE → PUBLISHED PRODUCTS
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
PRICE
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
PRODUCT IMAGE
==================================================*/

function getProductImage(
    product
) {

    /* MAIN IMAGE */

    if (
        product.mainImage
    ) {

        return product.mainImage;

    }


    /* OLD IMAGE FIELD */

    if (
        product.image
    ) {

        return product.image;

    }


    /* GALLERY */

    if (
        Array.isArray(
            product.gallery
        ) &&
        product.gallery.length
    ) {

        return product.gallery[0];

    }


    /* OLD IMAGES */

    if (
        Array.isArray(
            product.images
        ) &&
        product.images.length
    ) {

        return product.images[0];

    }


    return "";

}


/*==================================================
DISCOUNT
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
BADGE
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
RATING
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
        Math.round(
            value
        );


    let stars = "";


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        stars +=
            i <= rounded

                ? `<i class="fa-solid fa-star"></i>`

                : `<i class="fa-regular fa-star"></i>`;

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
        product.productName ||
        product.name ||
        "Unnamed Product";


    const category =
        product.category ||
        "Product";


    const price =
        Number(
            product.salePrice ||
            product.regularPrice ||
            product.price ||
            0
        );


    const oldPrice =
        Number(
            product.regularPrice ||
            product.oldPrice ||
            0
        );


    const discount =
        calculateDiscount(
            price,
            oldPrice
        );


    const rating =
        Number(
            product.rating ||
            0
        );


    const reviewCount =
        Number(
            product.reviewCount ||
            0
        );


    const safeId =
        encodeURIComponent(
            productId
        );


    return `

        <article
            class="product-card"
            data-product-id="${safeId}">


            <!-- IMAGE -->

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


                <button
                    type="button"
                    class="product-wishlist"
                    data-wishlist-id="${safeId}"
                    aria-label="Add to wishlist">

                    <i class="fa-regular fa-heart"></i>

                </button>


            </div>


            <!-- INFORMATION -->

            <div class="product-info">


                <span class="product-category">

                    ${escapeHTML(category)}

                </span>


                <h3 class="product-name">

                    ${escapeHTML(name)}

                </h3>


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


                <!-- PRICE -->

                <div class="product-price-row">

                    <span class="product-price">

                        ${formatPrice(price)}

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


                <!-- DELIVERY -->

                ${
                    product.deliveryTime

                    ? `

                    <div class="product-delivery">

                        <i class="fa-solid fa-truck"></i>

                        <span>

                            ${escapeHTML(
                                product.deliveryTime
                            )}

                        </span>

                    </div>

                    `

                    : ""
                }


                <!-- VIEW -->

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
LOADING
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
EMPTY
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

    return products.sort(
        (
            a,
            b
        ) => {

            const aTime =
                a.createdAt?.seconds
                ? a.createdAt.seconds
                : Number(
                    a.createdAt || 0
                );


            const bTime =
                b.createdAt?.seconds
                ? b.createdAt.seconds
                : Number(
                    b.createdAt || 0
                );


            return (
                bTime -
                aTime
            );

        }
    );

}


/*==================================================
RENDER
==================================================*/

function renderProducts(
    products
) {

    if (!productsContainer) {

        return;

    }


    if (
        !products ||
        !products.length
    ) {

        showProductsEmpty();

        return;

    }


    const featured =
        sortProducts(
            products
        ).slice(
            0,
            FEATURED_PRODUCT_LIMIT
        );


    productsContainer.innerHTML =
        featured
            .map(
                product =>
                    createProductCard(
                        product,
                        product.id
                    )
            )
            .join("");


    attachProductEvents();

}


/*==================================================
EVENTS
==================================================*/

function attachProductEvents() {

    document
        .querySelectorAll(
            ".view-product-btn"
        )
        .forEach(
            button => {

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


    document
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


                        icon?.classList.toggle(
                            "fa-regular"
                        );


                        icon?.classList.toggle(
                            "fa-solid"
                        );

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


    localStorage.setItem(
        "selectedProductId",
        productId
    );


    window.location.href =
        `product-detail.html?id=${encodeURIComponent(
            productId
        )}`;

}


/*==================================================
VIEW ALL
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
LOAD PRODUCTS
==================================================*/

async function loadFeaturedProducts() {

    if (!productsContainer) {

        return;

    }


    showProductsLoading();


    try {

        const products =
            await getPublishedProducts();


        console.log(
            "PUBLISHED PRODUCTS:",
            products
        );


        renderProducts(
            products
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

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        loadFeaturedProducts
    );

}
else {

    loadFeaturedProducts();

}


console.log(
    "SmartBazaar Pro Home Products loaded successfully."
);
