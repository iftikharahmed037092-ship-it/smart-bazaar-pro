/*==================================================
SMARTBAZAAR PRO
PART 14
FIREBASE BANNER SLIDER
==================================================*/

import { getBanners } from "./firebase-banner.js";


const slidesContainer =
    document.querySelector(".slides");

const dotsContainer =
    document.querySelector(".slider-dots");

const prevBtn =
    document.querySelector(".prev-btn");

const nextBtn =
    document.querySelector(".next-btn");


let banners = [];

let currentIndex = 0;

let autoSlide;


/*==================================================
LOAD BANNERS
==================================================*/

async function loadHomeBanners(){

    if(!slidesContainer){

        console.error(
            "ERROR: .slides not found."
        );

        return;

    }


    try{

        const data =
            await getBanners();


        banners =
            Object.values(data || {})
            .filter(
                banner =>
                    banner &&
                    banner.status === "active"
            );


        /*========================================
        NO ACTIVE BANNERS
        ========================================*/

        if(banners.length === 0){

            console.warn(
                "No active banners found."
            );

            return;

        }


        /*========================================
        CREATE SLIDES
        ========================================*/

        slidesContainer.innerHTML = "";


        banners.forEach(
            (banner, index) => {

                const slide =
                    document.createElement("div");


                slide.className =
                    "slide";


                if(index === 0){

                    slide.classList.add(
                        "active"
                    );

                }


                slide.innerHTML = `

                    <img
                        src="${banner.image || ""}"
                        alt="${banner.title || "Banner"}"
                    >

                    <div class="banner-content">

                        ${
                            banner.badge
                            ? `
                                <span class="banner-badge">
                                    ${banner.badge}
                                </span>
                            `
                            : ""
                        }

                        <h2>
                            ${banner.title || ""}
                        </h2>

                        ${
                            banner.description
                            ? `
                                <p>
                                    ${banner.description}
                                </p>
                            `
                            : ""
                        }

                        ${
                            banner.buttonText
                            ? `
                                <a
                                    href="${banner.buttonLink || "#"}"
                                    class="banner-btn"
                                >
                                    ${banner.buttonText}
                                </a>
                            `
                            : ""
                        }

                    </div>

                `;


                slidesContainer.appendChild(
                    slide
                );

            }
        );


        /*========================================
        CREATE DOTS
        ========================================*/

        if(dotsContainer){

            dotsContainer.innerHTML = "";


            banners.forEach(
                (_, index) => {

                    const dot =
                        document.createElement("span");


                    dot.className =
                        "dot";


                    if(index === 0){

                        dot.classList.add(
                            "active"
                        );

                    }


                    dot.addEventListener(
                        "click",
                        () => {

                            currentIndex =
                                index;

                            updateBanner();

                            restartAutoSlide();

                        }
                    );


                    dotsContainer.appendChild(
                        dot
                    );

                }
            );

        }


        /*========================================
        BUTTONS
        ========================================*/

        if(nextBtn){

            nextBtn.onclick =
                () => {

                    currentIndex++;

                    if(
                        currentIndex >=
                        banners.length
                    ){

                        currentIndex = 0;

                    }

                    updateBanner();

                    restartAutoSlide();

                };

        }


        if(prevBtn){

            prevBtn.onclick =
                () => {

                    currentIndex--;

                    if(currentIndex < 0){

                        currentIndex =
                            banners.length - 1;

                    }

                    updateBanner();

                    restartAutoSlide();

                };

        }


        /*========================================
        START AUTO SLIDER
        ========================================*/

        startAutoSlide();


        updateBanner();

    }


    catch(error){

        console.error(
            "HOME BANNER ERROR:",
            error
        );

    }

}


/*==================================================
UPDATE BANNER
==================================================*/

function updateBanner(){

    const slides =
        slidesContainer.querySelectorAll(
            ".slide"
        );


    const dots =
        dotsContainer
        ? dotsContainer.querySelectorAll(
            ".dot"
        )
        : [];


    slides.forEach(
        (slide, index) => {

            slide.classList.toggle(
                "active",
                index === currentIndex
            );

        }
    );


    dots.forEach(
        (dot, index) => {

            dot.classList.toggle(
                "active",
                index === currentIndex
            );

        }
    );


    slidesContainer.style.transform =
        `translateX(-${currentIndex * 100}%)`;

}


/*==================================================
AUTO SLIDE
==================================================*/

function startAutoSlide(){

    clearInterval(
        autoSlide
    );


    autoSlide =
        setInterval(
            () => {

                if(
                    banners.length <= 1
                ){

                    return;

                }


                currentIndex++;


                if(
                    currentIndex >=
                    banners.length
                ){

                    currentIndex = 0;

                }


                updateBanner();

            },
            5000
        );

}


/*==================================================
RESTART AUTO SLIDE
==================================================*/

function restartAutoSlide(){

    startAutoSlide();

}


/*==================================================
INITIAL LOAD
==================================================*/

loadHomeBanners();

/*==================================================
SMARTBAZAAR PRO
PART 15
CATEGORY AUTO INFINITE SCROLL
==================================================*/

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

}

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
