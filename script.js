/*==================================================
SMARTBAZAAR PRO
PART 14
DYNAMIC FIREBASE HERO BANNER SLIDER
==================================================*/


/*==================================================
FIREBASE BANNER FUNCTIONS
==================================================*/

import {
    getBanners
} from "./firebase-banner.js";


/*==================================================
DOM ELEMENTS
==================================================*/

const heroBanner =
    document.querySelector(".hero-banner");

const slides =
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
BANNER DATA
==================================================*/

let banners = [];

let currentIndex = 0;

let autoSlideTimer = null;


/*==================================================
TOUCH / MOUSE
==================================================*/

let startX = 0;

let currentX = 0;

let isDragging = false;


/*==================================================
LOAD FIREBASE BANNERS
==================================================*/

async function loadHeroBanners() {

    try {

        const data =
            await getBanners();


        if (!data) {

            showNoBanners();

            return;

        }


        /*
        ONLY ACTIVE BANNERS
        */

        banners =
            Object.entries(data)

            .map(
                ([id, banner]) => ({
                    id,
                    ...banner
                })
            )

            .filter(
                banner =>
                    banner.status === "active"
            );


        /*
        SORT BY CREATED TIME
        */

        banners.sort(
            (a, b) =>
                (a.createdAt || 0) -
                (b.createdAt || 0)
        );


        if (banners.length === 0) {

            showNoBanners();

            return;

        }


        /*
        CREATE SLIDES
        */

        createSlides();


        /*
        CREATE DOTS
        */

        createDots();


        /*
        SHOW FIRST BANNER
        */

        currentIndex = 0;

        updateSlider();


        /*
        START AUTO SLIDER
        */

        startAutoSlide();

    }


    catch (error) {

        console.error(
            "HERO BANNER ERROR:",
            error
        );


        showNoBanners();

    }

}


/*==================================================
CREATE SLIDES
==================================================*/

function createSlides() {

    if (!slides) {

        return;

    }


    slides.innerHTML = "";


    banners.forEach(
        function(banner, index) {

            const slide =
                document.createElement("div");


            slide.className =
                "slide";


            if (index === 0) {

                slide.classList.add(
                    "active"
                );

            }


            const image =
                document.createElement("img");


            image.src =
                banner.image || "";


            image.alt =
                banner.title ||
                "SmartBazaar Banner";


            image.draggable =
                false;


            slide.appendChild(
                image
            );


            slides.appendChild(
                slide
            );

        }
    );

}


/*==================================================
CREATE DOTS
==================================================*/

function createDots() {

    if (!sliderDots) {

        return;

    }


    sliderDots.innerHTML = "";


    banners.forEach(
        function(banner, index) {

            const dot =
                document.createElement("span");


            dot.className =
                "dot";


            if (index === 0) {

                dot.classList.add(
                    "active"
                );

            }


            dot.dataset.index =
                index;


            dot.setAttribute(
                "aria-label",
                `Go to banner ${index + 1}`
            );


            dot.addEventListener(
                "click",
                function() {

                    currentIndex =
                        Number(
                            this.dataset.index
                        );


                    updateSlider();


                    restartAutoSlide();

                }
            );


            sliderDots.appendChild(
                dot
            );

        }
    );

}


/*==================================================
UPDATE SLIDER
==================================================*/

function updateSlider() {

    if (
        !slides ||
        banners.length === 0
    ) {

        return;

    }


    slides.style.transform =
        `translateX(-${currentIndex * 100}%)`;


    /*
    ACTIVE SLIDE
    */

    const allSlides =
        slides.querySelectorAll(
            ".slide"
        );


    allSlides.forEach(
        slide => {

            slide.classList.remove(
                "active"
            );

        }
    );


    if (allSlides[currentIndex]) {

        allSlides[currentIndex]
            .classList.add(
                "active"
            );

    }


    /*
    ACTIVE DOT
    */

    if (sliderDots) {

        const dots =
            sliderDots.querySelectorAll(
                ".dot"
            );


        dots.forEach(
            dot => {

                dot.classList.remove(
                    "active"
                );

            }
        );


        if (dots[currentIndex]) {

            dots[currentIndex]
                .classList.add(
                    "active"
                );

        }

    }


    /*
    UPDATE TEXT
    */

    updateBannerContent();

}


/*==================================================
UPDATE BANNER CONTENT
==================================================*/

function updateBannerContent() {

    const banner =
        banners[currentIndex];


    if (!banner) {

        return;

    }


    /*
    BADGE
    */

    if (bannerBadge) {

        bannerBadge.textContent =
            banner.badge ||
            "SPECIAL OFFER";

    }


    /*
    TITLE
    */

    if (bannerTitle) {

        bannerTitle.textContent =
            banner.title ||
            "Welcome To SmartBazaar Pro";

    }


    /*
    DESCRIPTION
    */

    if (bannerDescription) {

        bannerDescription.textContent =
            banner.description ||
            "";

    }


    /*
    BUTTON
    */

    if (bannerButton) {

        bannerButton.textContent =
            banner.buttonText ||
            "Shop Now";


        bannerButton.href =
            banner.buttonLink ||
            "#";

    }

}


/*==================================================
NEXT SLIDE
==================================================*/

function nextSlide() {

    if (banners.length <= 1) {

        return;

    }


    currentIndex++;


    if (
        currentIndex >=
        banners.length
    ) {

        currentIndex = 0;

    }


    updateSlider();

}


/*==================================================
PREVIOUS SLIDE
==================================================*/

function previousSlide() {

    if (banners.length <= 1) {

        return;

    }


    currentIndex--;


    if (currentIndex < 0) {

        currentIndex =
            banners.length - 1;

    }


    updateSlider();

}


/*==================================================
AUTO SLIDE
==================================================*/

function startAutoSlide() {

    stopAutoSlide();


    if (banners.length <= 1) {

        return;

    }


    autoSlideTimer =
        setInterval(
            function() {

                nextSlide();

            },
            5000
        );

}


/*==================================================
STOP AUTO SLIDE
==================================================*/

function stopAutoSlide() {

    if (autoSlideTimer) {

        clearInterval(
            autoSlideTimer
        );

        autoSlideTimer =
            null;

    }

}


/*==================================================
RESTART AUTO SLIDE
==================================================*/

function restartAutoSlide() {

    startAutoSlide();

}


/*==================================================
TOUCH SWIPE START
==================================================*/

if (heroBanner) {

    heroBanner.addEventListener(
        "touchstart",
        function(event) {

            startX =
                event.touches[0].clientX;

            currentX =
                startX;

            isDragging =
                true;


            stopAutoSlide();

        },
        {
            passive: true
        }
    );


    /*================================================
    TOUCH MOVE
    =================================================*/

    heroBanner.addEventListener(
        "touchmove",
        function(event) {

            if (!isDragging) {

                return;

            }


            currentX =
                event.touches[0].clientX;

        },
        {
            passive: true
        }
    );


    /*================================================
    TOUCH END
    =================================================*/

    heroBanner.addEventListener(
        "touchend",
        function() {

            if (!isDragging) {

                return;

            }


            const distance =
                currentX - startX;


            const minimumSwipe =
                50;


            if (
                Math.abs(distance) >=
                minimumSwipe
            ) {

                /*
                LEFT SWIPE
                */

                if (distance < 0) {

                    nextSlide();

                }


                /*
                RIGHT SWIPE
                */

                else {

                    previousSlide();

                }

            }


            isDragging =
                false;


            restartAutoSlide();

        }
    );


    /*================================================
    MOUSE DRAG START
    =================================================*/

    heroBanner.addEventListener(
        "mousedown",
        function(event) {

            startX =
                event.clientX;

            currentX =
                startX;

            isDragging =
                true;


            stopAutoSlide();


            heroBanner.classList.add(
                "dragging"
            );

        }
    );


    /*================================================
    MOUSE MOVE
    =================================================*/

    heroBanner.addEventListener(
        "mousemove",
        function(event) {

            if (!isDragging) {

                return;

            }


            currentX =
                event.clientX;

        }
    );


    /*================================================
    MOUSE END
    =================================================*/

    heroBanner.addEventListener(
        "mouseup",
        function() {

            finishMouseSwipe();

        }
    );


    heroBanner.addEventListener(
        "mouseleave",
        function() {

            if (isDragging) {

                finishMouseSwipe();

            }

        }
    );

}


/*==================================================
FINISH MOUSE SWIPE
==================================================*/

function finishMouseSwipe() {

    if (!isDragging) {

        return;

    }


    const distance =
        currentX - startX;


    const minimumSwipe =
        50;


    if (
        Math.abs(distance) >=
        minimumSwipe
    ) {

        if (distance < 0) {

            nextSlide();

        }

        else {

            previousSlide();

        }

    }


    isDragging =
        false;


    if (heroBanner) {

        heroBanner.classList.remove(
            "dragging"
        );

    }


    restartAutoSlide();

}


/*==================================================
NO BANNERS
==================================================*/

function showNoBanners() {

    banners = [];

    currentIndex = 0;

    stopAutoSlide();


    if (slides) {

        slides.innerHTML = `

            <div class="slide active">

                <div class="banner-empty">

                    No active banners available.

                </div>

            </div>

        `;

    }


    if (sliderDots) {

        sliderDots.innerHTML = "";

    }


    if (bannerBadge) {

        bannerBadge.textContent =
            "SMARTBAZAAR PRO";

    }


    if (bannerTitle) {

        bannerTitle.textContent =
            "Welcome To SmartBazaar Pro";

    }


    if (bannerDescription) {

        bannerDescription.textContent =
            "Add banners from the Admin Dashboard.";

    }


    if (bannerButton) {

        bannerButton.textContent =
            "Shop Now";

        bannerButton.href =
            "#";

    }

}


/*==================================================
INITIAL LOAD
==================================================*/

loadHeroBanners();

/*==================================================
SMARTBAZAAR PRO
PART 15
CATEGORY AUTO INFINITE SCROLL
==================================================

const categoryList = document.querySelector(".category-list");

if(categoryList){

    categoryList.innerHTML += categoryList.innerHTML;

    let speed = 0.5;

    function autoScroll(){

        categoryList.scrollLeft += speed;

        if(categoryList.scrollLeft >= categoryList.scrollWidth / 2){

            categoryList.scrollLeft = 0;

        }

        requestAnimationFrame(autoScroll);

    }

    autoScroll();

}*/

/*==================================================
SMARTBAZAAR PRO
MOBILE SIDE MENU
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const menuBtn =
        document.querySelector(".menu-btn");

    const sideMenu =
        document.querySelector(".mobile-side-menu");

    const overlay =
        document.querySelector(".mobile-menu-overlay");

    const closeBtn =
        document.querySelector(".mobile-menu-close");


    if(
        !menuBtn ||
        !sideMenu ||
        !overlay ||
        !closeBtn
    ){

        return;

    }


    function openMenu(){

        sideMenu.classList.add("active");

        overlay.classList.add("active");

        document.body.style.overflow = "hidden";

    }


    function closeMenu(){

        sideMenu.classList.remove("active");

        overlay.classList.remove("active");

        document.body.style.overflow = "";

    }


    menuBtn.addEventListener(
        "click",
        openMenu
    );


    closeBtn.addEventListener(
        "click",
        closeMenu
    );


    overlay.addEventListener(
        "click",
        closeMenu
    );


    sideMenu
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                closeMenu
            );

        });

});
