/*==================================================
SMARTBAZAAR PRO
FEATURE — BANNER MANAGEMENT
HOME BANNER JAVASCRIPT
==================================================*/

/*==================================================
IMPORT FIREBASE
==================================================*/

import {
    database
} from "./firebase-config.js";


/*==================================================
IMPORT FIREBASE REALTIME DATABASE
==================================================*/

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


/*==================================================
DOM ELEMENTS
==================================================*/

const slidesContainer =
    document.querySelector(".slides");

const sliderDots =
    document.querySelector(".slider-dots");

const bannerBadge =
    document.getElementById("homeBannerBadge");

const bannerTitle =
    document.getElementById("homeBannerTitle");

const bannerDescription =
    document.getElementById("homeBannerDescription");

const bannerButton =
    document.getElementById("homeBannerButton");


/*==================================================
FEATURE — BANNER MANAGEMENT
FIREBASE BANNERS REFERENCE
==================================================*/

const bannersRef =
    ref(
        database,
        "banners"
    );


/*==================================================
SLIDER STATE
==================================================*/

let banners = [];

let currentSlide = 0;

let sliderTimer = null;


/*==================================================
FEATURE — BANNER MANAGEMENT
LOAD ACTIVE BANNERS
==================================================*/

onValue(
    bannersRef,
    function(snapshot) {

        const data =
            snapshot.val();


        /*========================================
        NO BANNERS
        ========================================*/

        if (!data) {

            showDefaultBanner();

            return;

        }


        /*========================================
        GET ONLY ACTIVE BANNERS
        ========================================*/

        banners =
            Object.values(data)
                .filter(
                    banner =>
                        banner &&
                        banner.status === "active" &&
                        banner.imageURL
                );


        /*========================================
        SORT BY CREATED DATE
        ========================================*/

        banners.sort(
            (a, b) =>
                (a.createdAt || 0) -
                (b.createdAt || 0)
        );


        /*========================================
        NO ACTIVE BANNERS
        ========================================*/

        if (!banners.length) {

            showDefaultBanner();

            return;

        }


        /*========================================
        RENDER BANNERS
        ========================================*/

        currentSlide = 0;

        renderBanners();

        renderDots();

        showSlide(0);

        startSlider();

    },
    function(error) {

        console.error(
            "Home Banner Firebase Error:",
            error
        );

        showDefaultBanner();

    }
);


/*==================================================
FEATURE — BANNER MANAGEMENT
RENDER BANNERS
==================================================*/

function renderBanners() {

    if (!slidesContainer) {

        return;

    }


    slidesContainer.innerHTML =
        banners
            .map(
                function(banner) {

                    return `

                        <div
                            class="slide"
                            data-banner-id="${escapeHTML(
                                banner.id || ""
                            )}"
                        >

                            <img
                                src="${escapeHTML(
                                    banner.imageURL
                                )}"
                                alt="${escapeHTML(
                                    banner.title ||
                                    "SmartBazaar Banner"
                                )}"
                            >

                        </div>

                    `;

                }
            )
            .join("");

}


/*==================================================
FEATURE — BANNER MANAGEMENT
RENDER DOTS
==================================================*/

function renderDots() {

    if (!sliderDots) {

        return;

    }


    sliderDots.innerHTML =
        banners
            .map(
                function(_, index) {

                    return `

                        <button
                            type="button"
                            class="dot ${
                                index === 0
                                    ? "active"
                                    : ""
                            }"
                            data-slide="${index}"
                            aria-label="Go to banner ${
                                index + 1
                            }"
                        ></button>

                    `;

                }
            )
            .join("");


    /*========================================
    DOT CLICK
    ========================================*/

    sliderDots
        .querySelectorAll(".dot")
        .forEach(
            function(dot) {

                dot.addEventListener(
                    "click",
                    function() {

                        const index =
                            Number(
                                this.dataset.slide
                            );


                        currentSlide =
                            index;


                        showSlide(
                            currentSlide
                        );


                        restartSlider();

                    }
                );

            }
        );

}


/*==================================================
FEATURE — BANNER MANAGEMENT
SHOW SLIDE
==================================================*/

function showSlide(index) {

    if (!banners.length) {

        return;

    }


    if (
        index < 0 ||
        index >= banners.length
    ) {

        index = 0;

    }


    currentSlide = index;


    /*========================================
    MOVE SLIDES
    ========================================*/

    if (slidesContainer) {

        slidesContainer.style.transform =
            `translateX(-${index * 100}%)`;

    }


    /*========================================
    UPDATE CONTENT
    ========================================*/

    const banner =
        banners[index];


    if (!banner) {

        return;

    }


    if (bannerBadge) {

        bannerBadge.textContent =
            banner.badge ||
            "SPECIAL OFFER";

    }


    if (bannerTitle) {

        bannerTitle.textContent =
            banner.title ||
            "Welcome To SmartBazaar Pro";

    }


    if (bannerDescription) {

        bannerDescription.textContent =
            banner.description ||
            "Shop Electronics, Fashion, Mobiles and Thousands of Products at Amazing Prices.";

    }


    if (bannerButton) {

        bannerButton.textContent =
            banner.buttonText ||
            "Shop Now";


        bannerButton.href =
            banner.buttonLink ||
            "#";

    }


    /*========================================
    UPDATE DOTS
    ========================================*/

    if (sliderDots) {

        sliderDots
            .querySelectorAll(".dot")
            .forEach(
                function(dot, dotIndex) {

                    dot.classList.toggle(
                        "active",
                        dotIndex === index
                    );

                }
            );

    }

}


/*==================================================
FEATURE — BANNER MANAGEMENT
AUTO SLIDER
==================================================*/

function startSlider() {

    stopSlider();


    /*========================================
    ONLY START IF MULTIPLE BANNERS
    ========================================*/

    if (banners.length <= 1) {

        return;

    }


    sliderTimer =
        setInterval(
            function() {

                currentSlide =
                    (currentSlide + 1) %
                    banners.length;


                showSlide(
                    currentSlide
                );

            },
            5000
        );

}


/*==================================================
RESTART SLIDER
==================================================*/

function restartSlider() {

    stopSlider();

    startSlider();

}


/*==================================================
STOP SLIDER
==================================================*/

function stopSlider() {

    if (sliderTimer) {

        clearInterval(
            sliderTimer
        );

        sliderTimer = null;

    }

}


/*==================================================
FEATURE — BANNER MANAGEMENT
DEFAULT BANNER
==================================================*/

function showDefaultBanner() {

    banners = [];

    stopSlider();


    if (slidesContainer) {

        slidesContainer.innerHTML = "";

        slidesContainer.style.transform =
            "translateX(0)";

    }


    if (sliderDots) {

        sliderDots.innerHTML = "";

    }


    if (bannerBadge) {

        bannerBadge.textContent =
            "SPECIAL OFFER";

    }


    if (bannerTitle) {

        bannerTitle.textContent =
            "Welcome To SmartBazaar Pro";

    }


    if (bannerDescription) {

        bannerDescription.textContent =
            "Shop Electronics, Fashion, Mobiles and Thousands of Products at Amazing Prices.";

    }


    if (bannerButton) {

        bannerButton.textContent =
            "Shop Now";

        bannerButton.href =
            "#";

    }

}


/*==================================================
FEATURE — BANNER MANAGEMENT
ESCAPE HTML
==================================================*/

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/*==================================================
SMARTBAZAAR PRO
HOME BANNER INITIALIZED
==================================================*/

console.log(
    "SMARTBAZAAR PRO — Home Banner initialized."
);
