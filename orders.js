/*==================================================
SMARTBAZAAR PRO
ORDERS SYSTEM JAVASCRIPT
FILE: orders.js
==================================================*/


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
REALTIME DATABASE
==================================================*/

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


/*==================================================
CURRENT USER
==================================================*/

let currentUser = null;

let allOrders = [];


/*==================================================
DOM
==================================================*/

const ordersList =
    document.getElementById("orders-list");


const searchInput =
    document.getElementById("order-search");


const emptyOrders =
    document.getElementById("empty-orders");


const loadingOrders =
    document.getElementById("loading-orders");


const ordersCount =
    document.getElementById("orders-count");


const pendingCount =
    document.getElementById("pending-count");


const processingCount =
    document.getElementById("processing-count");


const completedCount =
    document.getElementById("completed-count");


const filterButtons =
    document.querySelectorAll(
        "[data-order-filter]"
    );


/*==================================================
SAFE TEXT
==================================================*/

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
ESCAPE HTML
==================================================*/

function escapeHTML(value) {

    return safeText(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/*==================================================
FORMAT PRICE
==================================================*/

function formatPrice(value) {

    const amount =
        Number(value || 0);

    return (
        "Rs. " +
        amount.toLocaleString(
            "en-PK"
        )
    );

}


/*==================================================
FORMAT DATE
==================================================*/

function formatDate(value) {

    if (!value) {

        return "Date unavailable";

    }


    let date;


    if (
        typeof value === "number"
    ) {

        date =
            new Date(value);

    }
    else {

        date =
            new Date(value);

    }


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return safeText(value);

    }


    return date.toLocaleDateString(
        "en-PK",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/*==================================================
NORMALIZE STATUS
==================================================*/

function normalizeStatus(status) {

    return safeText(status)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");

}


/*==================================================
STATUS LABEL
==================================================*/

function statusLabel(status) {

    const normalized =
        normalizeStatus(status);


    const labels = {

        pending:
            "Pending",

        processing:
            "Processing",

        shipped:
            "Shipped",

        delivered:
            "Delivered",

        completed:
            "Completed",

        cancelled:
            "Cancelled",

        canceled:
            "Cancelled",

        failed:
            "Failed"

    };


    return (
        labels[normalized] ||
        (
            normalized
                .replace(/_/g, " ")
                .replace(/\b\w/g, c =>
                    c.toUpperCase()
                )
        ) ||
        "Pending"
    );

}


/*==================================================
STATUS CLASS
==================================================*/

function statusClass(status) {

    const normalized =
        normalizeStatus(status);


    if (
        normalized === "completed" ||
        normalized === "delivered"
    ) {

        return "completed";

    }


    if (
        normalized === "cancelled" ||
        normalized === "canceled" ||
        normalized === "failed"
    ) {

        return "cancelled";

    }


    if (
        normalized === "processing"
    ) {

        return "processing";

    }


    if (
        normalized === "shipped"
    ) {

        return "shipped";

    }


    return "pending";

}


/*==================================================
GET ORDER DATE
==================================================*/

function getOrderDate(order) {

    return (
        order.createdAt ||
        order.date ||
        order.orderDate ||
        order.timestamp ||
        order.created ||
        ""
    );

}


/*==================================================
GET ORDER ID
==================================================*/

function getOrderId(order, key) {

    return (
        order.orderId ||
        order.id ||
        order.orderNumber ||
        key ||
        "ORDER"
    );

}


/*==================================================
GET PRODUCT NAME
==================================================*/

function getProductName(order) {

    return (
        order.productName ||
        order.productTitle ||
        order.title ||
        order.name ||
        "SmartBazaar Product"
    );

}


/*==================================================
GET PRODUCT IMAGE
==================================================*/

function getProductImage(order) {

    return (
        order.productImage ||
        order.image ||
        order.imageURL ||
        order.photoURL ||
        order.thumbnail ||
        "https://via.placeholder.com/120"
    );

}


/*==================================================
GET TOTAL
==================================================*/

function getOrderTotal(order) {

    return Number(
        order.total ||
        order.amount ||
        order.price ||
        order.totalAmount ||
        0
    );

}


/*==================================================
GET PAYMENT METHOD
==================================================*/

function getPaymentMethod(order) {

    return (
        order.paymentMethod ||
        order.payment ||
        "Not specified"
    );

}


/*==================================================
LOADING
==================================================*/

function showLoading() {

    if (loadingOrders) {

        loadingOrders.style.display =
            "block";

    }


    if (emptyOrders) {

        emptyOrders.style.display =
            "none";

    }

}


/*==================================================
HIDE LOADING
==================================================*/

function hideLoading() {

    if (loadingOrders) {

        loadingOrders.style.display =
            "none";

    }

}


/*==================================================
EMPTY STATE
==================================================*/

function showEmpty() {

    if (ordersList) {

        ordersList.innerHTML =
            "";

    }


    if (emptyOrders) {

        emptyOrders.style.display =
            "block";

    }

}


/*==================================================
UPDATE COUNTS
==================================================*/

function updateCounts() {

    let pending = 0;

    let processing = 0;

    let completed = 0;


    allOrders.forEach(
        function(order) {

            const status =
                normalizeStatus(
                    order.status
                );


            if (
                status === "pending"
            ) {

                pending++;

            }


            if (
                status === "processing"
            ) {

                processing++;

            }


            if (
                status === "completed" ||
                status === "delivered"
            ) {

                completed++;

            }

        }
    );


    if (ordersCount) {

        ordersCount.textContent =
            allOrders.length;

    }


    if (pendingCount) {

        pendingCount.textContent =
            pending;

    }


    if (processingCount) {

        processingCount.textContent =
            processing;

    }


    if (completedCount) {

        completedCount.textContent =
            completed;

    }

}


/*==================================================
RENDER ORDERS
==================================================*/

function renderOrders(
    orders
) {

    hideLoading();


    if (!orders.length) {

        showEmpty();

        return;

    }


    if (emptyOrders) {

        emptyOrders.style.display =
            "none";

    }


    if (!ordersList) {

        return;

    }


    ordersList.innerHTML =
        orders.map(
            function(order) {

                const orderId =
                    escapeHTML(
                        order._key ||
                        getOrderId(
                            order
                        )
                    );


                const productName =
                    escapeHTML(
                        getProductName(
                            order
                        )
                    );


                const image =
                    escapeHTML(
                        getProductImage(
                            order
                        )
                    );


                const status =
                    statusLabel(
                        order.status
                    );


                const statusCSS =
                    statusClass(
                        order.status
                    );


                const total =
                    formatPrice(
                        getOrderTotal(
                            order
                        )
                    );


                const date =
                    formatDate(
                        getOrderDate(
                            order
                        )
                    );


                const payment =
                    escapeHTML(
                        getPaymentMethod(
                            order
                        )
                    );


                return `

                    <article
                        class="order-card"
                        data-order-key="${orderId}"
                    >

                        <div
                            class="order-card-image"
                        >

                            <img
                                src="${image}"
                                alt="${productName}"
                                loading="lazy"
                                onerror="
                                    this.src='https://via.placeholder.com/120';
                                "
                            >

                        </div>


                        <div
                            class="order-card-content"
                        >

                            <div
                                class="order-card-top"
                            >

                                <span
                                    class="order-id"
                                >
                                    #${orderId}
                                </span>

                                <span
                                    class="order-status ${statusCSS}"
                                >
                                    ${escapeHTML(status)}
                                </span>

                            </div>


                            <h3>
                                ${productName}
                            </h3>


                            <div
                                class="order-meta"
                            >

                                <span>
                                    ${escapeHTML(date)}
                                </span>

                                <span>
                                    ${payment}
                                </span>

                            </div>


                            <div
                                class="order-card-bottom"
                            >

                                <strong>
                                    ${total}
                                </strong>


                                <button
                                    type="button"
                                    class="order-details-btn"
                                    data-order-key="${orderId}"
                                >
                                    View Details
                                </button>

                            </div>

                        </div>

                    </article>

                `;

            }
        )
        .join("");


    attachOrderButtons();

}


/*==================================================
ORDER BUTTONS
==================================================*/

function attachOrderButtons() {

    const buttons =
        document.querySelectorAll(
            ".order-details-btn"
        );


    buttons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const key =
                        this.dataset.orderKey;


                    openOrderDetails(
                        key
                    );

                }
            );

        }
    );

}


/*==================================================
FILTER + SEARCH
==================================================*/

let activeFilter =
    "all";


function applyFilters() {

    const query =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const filtered =
        allOrders.filter(
            function(order) {

                const status =
                    normalizeStatus(
                        order.status
                    );


                /*================================
                STATUS FILTER
                =================================*/

                let matchesFilter =
                    true;


                if (
                    activeFilter !==
                    "all"
                ) {

                    if (
                        activeFilter ===
                        "completed"
                    ) {

                        matchesFilter =
                            status ===
                                "completed" ||
                            status ===
                                "delivered";

                    }
                    else {

                        matchesFilter =
                            status ===
                            normalizeStatus(
                                activeFilter
                            );

                    }

                }


                /*================================
                SEARCH
                =================================*/

                const searchable =
                    (

                        getOrderId(
                            order
                        ) +

                        " " +

                        getProductName(
                            order
                        ) +

                        " " +

                        getPaymentMethod(
                            order
                        ) +

                        " " +

                        statusLabel(
                            order.status
                        )

                    )
                    .toLowerCase();


                const matchesSearch =
                    !query ||
                    searchable.includes(
                        query
                    );


                return (
                    matchesFilter &&
                    matchesSearch
                );

            }
        );


    renderOrders(
        filtered
    );

}


/*==================================================
FILTER BUTTONS
==================================================*/

filterButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                filterButtons.forEach(
                    function(item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                this.classList.add(
                    "active"
                );


                activeFilter =
                    this.dataset.orderFilter ||
                    "all";


                applyFilters();

            }
        );

    }
);


/*==================================================
SEARCH
==================================================*/

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function() {

            applyFilters();

        }
    );

}


/*==================================================
ORDER DETAILS MODAL
==================================================*/

function createOrderModal() {

    if (
        document.getElementById(
            "order-details-modal"
        )
    ) {

        return;

    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "order-details-modal";


    modal.className =
        "order-details-modal";


    modal.innerHTML = `

        <div
            class="order-modal-overlay"
            data-close-order-modal
        ></div>


        <div
            class="order-modal-box"
        >

            <button
                type="button"
                class="order-modal-close"
                data-close-order-modal
                aria-label="Close"
            >
                ×
            </button>


            <div
                id="order-modal-content"
            ></div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target
                    .matches(
                        "[data-close-order-modal]"
                    )
            ) {

                closeOrderDetails();

            }

        }
    );

}


/*==================================================
OPEN ORDER DETAILS
==================================================*/

function openOrderDetails(
    key
) {

    const order =
        allOrders.find(
            function(item) {

                return (
                    item._key ===
                    key
                );

            }
        );


    if (!order) {

        return;

    }


    createOrderModal();


    const modal =
        document.getElementById(
            "order-details-modal"
        );


    const content =
        document.getElementById(
            "order-modal-content"
        );


    if (!modal || !content) {

        return;

    }


    const orderId =
        escapeHTML(
            getOrderId(
                order,
                key
            )
        );


    const productName =
        escapeHTML(
            getProductName(
                order
            )
        );


    const image =
        escapeHTML(
            getProductImage(
                order
            )
        );


    const status =
        statusLabel(
            order.status
        );


    const total =
        formatPrice(
            getOrderTotal(
                order
            )
        );


    const date =
        formatDate(
            getOrderDate(
                order
            )
        );


    const payment =
        escapeHTML(
            getPaymentMethod(
                order
            )
        );


    content.innerHTML = `

        <div class="order-modal-header">

            <span>
                ORDER DETAILS
            </span>

            <h2>
                #${orderId}
            </h2>

        </div>


        <div
            class="order-modal-product"
        >

            <img
                src="${image}"
                alt="${productName}"
                onerror="
                    this.src='https://via.placeholder.com/120';
                "
            >


            <div>

                <h3>
                    ${productName}
                </h3>

                <span
                    class="order-status ${statusClass(order.status)}"
                >
                    ${escapeHTML(status)}
                </span>

            </div>

        </div>


        <div
            class="order-modal-info"
        >

            <div>

                <span>
                    Order Date
                </span>

                <strong>
                    ${escapeHTML(date)}
                </strong>

            </div>


            <div>

                <span>
                    Payment
                </span>

                <strong>
                    ${payment}
                </strong>

            </div>


            <div>

                <span>
                    Total
                </span>

                <strong>
                    ${total}
                </strong>

            </div>

        </div>

    `;


    modal.classList.add(
        "show"
    );


    document.body.classList.add(
        "order-modal-open"
    );

}


/*==================================================
CLOSE ORDER DETAILS
==================================================*/

function closeOrderDetails() {

    const modal =
        document.getElementById(
            "order-details-modal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }


    document.body.classList.remove(
        "order-modal-open"
    );

}


/*==================================================
ESC CLOSE
==================================================*/

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key ===
            "Escape"
        ) {

            closeOrderDetails();

        }

    }
);


/*==================================================
LOAD USER ORDERS
==================================================*/

async function loadUserOrders(
    user
) {

    if (!user) {

        return;

    }


    showLoading();


    try {

        /*
         * Orders path:
         *
         * users/{uid}/orders
         *
         */


        const ordersRef =
            ref(
                database,
                "users/" +
                user.uid +
                "/orders"
            );


        const snapshot =
            await get(
                ordersRef
            );


        allOrders =
            [];


        if (
            snapshot.exists()
        ) {

            const data =
                snapshot.val();


            Object.entries(
                data
            ).forEach(
                function([
                    key,
                    order
                ]) {

                    if (
                        order &&
                        typeof order ===
                        "object"
                    ) {

                        allOrders.push({

                            ...order,

                            _key:
                                key

                        });

                    }

                }
            );

        }


        /*================================
        NEWEST FIRST
        =================================*/

        allOrders.sort(
            function(a, b) {

                const dateA =
                    Number(
                        getOrderDate(
                            a
                        )
                    ) || 0;


                const dateB =
                    Number(
                        getOrderDate(
                            b
                        )
                    ) || 0;


                return dateB -
                    dateA;

            }
        );


        updateCounts();


        applyFilters();

    }
    catch(error) {

        console.error(
            "ORDERS LOAD ERROR:",
            error
        );


        hideLoading();


        if (ordersList) {

            ordersList.innerHTML = `

                <div
                    class="orders-error"
                >

                    <strong>
                        Unable to load orders
                    </strong>

                    <p>
                        Please check your internet connection and try again.
                    </p>

                    <button
                        type="button"
                        id="retry-orders-button"
                    >
                        Try Again
                    </button>

                </div>

            `;


            const retry =
                document.getElementById(
                    "retry-orders-button"
                );


            if (retry) {

                retry.addEventListener(
                    "click",
                    function() {

                        loadUserOrders(
                            currentUser
                        );

                    }
                );

            }

        }

    }

}


/*==================================================
MOBILE NAVIGATION
==================================================*/

function setupNavigation() {

    const home =
        document.getElementById(
            "bottom-home"
        );


    const products =
        document.getElementById(
            "bottom-products"
        );


    const create =
        document.getElementById(
            "bottom-create"
        );


    const orders =
        document.getElementById(
            "bottom-orders"
        );


    const account =
        document.getElementById(
            "bottom-account"
        );


    if (home) {

        home.addEventListener(
            "click",
            function() {

                window.location.href =
                    "index.html";

            }
        );

    }


    if (products) {

        products.addEventListener(
            "click",
            function() {

                window.location.href =
                    "products.html";

            }
        );

    }


    if (create) {

        create.addEventListener(
            "click",
            function() {

                window.location.href =
                    "smartbazaar-editor.html";

            }
        );

    }


    if (orders) {

        orders.addEventListener(
            "click",
            function() {

                window.location.href =
                    "orders.html";

            }
        );

    }


    if (account) {

        account.addEventListener(
            "click",
            function() {

                window.location.href =
                    "account.html";

            }
        );

    }

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


        await loadUserOrders(
            user
        );

    }
);


/*==================================================
INITIALIZE
==================================================*/

createOrderModal();

setupNavigation();


/*==================================================
SMARTBAZAAR PRO
ORDERS JS END
==================================================*/
