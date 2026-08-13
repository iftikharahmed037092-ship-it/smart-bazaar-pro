/*==================================================
SMARTBAZAAR PRO
PART 14
HERO BANNER SLIDER
FIREBASE DYNAMIC BANNERS
==================================================*/

import {
    getBanners
} from "./firebase-banner.js";


/*==================================================
BANNER SLIDER
==================================================*/

document.addEventListener("DOMContentLoaded", async () => {

    const slides =
        document.querySelector(".slides");

    const prev =
        document.querySelector(".prev-btn");

    const next =
        document.querySelector(".next-btn");

    const dotsContainer =
        document.querySelector(".dots") ||
        document.querySelector(".slider-dots");


    /*==============================
    CHECK SLIDER
    ==============================*/

    if (!slides) {

        console.log(
            "Hero slider not found."
        );

        return;

    }


    /*==============================
    LOAD BANNERS FROM FIREBASE
    ==============================*/

    let banners = {};

    try {

        banners =
            await getBanners();

    }

    catch(error) {

        console.error(
            "Could not load banners:",
            error
        );

        return;

    }


    /*==============================
    GET ACTIVE BANNERS ONLY
    ==============================*/

    const activeBanners =
        Object.values(
            banners || {}
        ).filter(
            banner =>
                banner &&
                banner.status === "active" &&
                banner.image
        );


    /*==============================
    NO ACTIVE BANNERS
    ==============================*/

    if (
        activeBanners.length === 0
    ) {

        console.log(
            "No active banners found."
        );

        return;

    }


    /*==============================
    CREATE SLIDES
    ==============================*/

    slides.innerHTML = "";


    activeBanners.forEach(
        (banner, i) => {

            const slide =
                document.createElement(
                    "div"
                );


            slide.className =
                "slide";


            slide.innerHTML = `

                <img
                    src="${escapeBannerHTML(
                        banner.image
                    )}"
                    alt="${escapeBannerHTML(
                        banner.title ||
                        "SmartBazaar Banner"
                    )}"
                >

                <div class="slide-content">

                    ${
                        banner.badge
                            ? `
                                <span class="slide-badge">
                                    ${escapeBannerHTML(
                                        banner.badge
                                    )}
                                </span>
                              `
                            : ""
                    }

                    <h2>
                        ${escapeBannerHTML(
                            banner.title ||
                            ""
                        )}
                    </h2>

                    ${
                        banner.description
                            ? `
                                <p>
                                    ${escapeBannerHTML(
                                        banner.description
                                    )}
                                </p>
                              `
                            : ""
                    }

                    ${
                        banner.buttonText
                            ? `
                                <a
                                    href="${escapeBannerHTML(
                                        banner.buttonLink ||
                                        "#"
                                    )}"
                                    class="slide-btn"
                                >
                                    ${escapeBannerHTML(
                                        banner.buttonText
                                    )}
                                </a>
                              `
                            : ""
                    }

                </div>

            `;


            slides.appendChild(
                slide
            );

        }
    );


    /*==================================================
    CREATE DOTS
    ==================================================*/

    if (dotsContainer) {

        dotsContainer.innerHTML = "";


        activeBanners.forEach(
            (banner, i) => {

                const dot =
                    document.createElement(
                        "button"
                    );


                dot.type =
                    "button";


                dot.className =
                    "dot";


                dot.setAttribute(
                    "aria-label",
                    `Go to banner ${i + 1}`
                );


                dotsContainer.appendChild(
                    dot
                );

            }
        );

    }


    /*==================================================
    SLIDER ELEMENTS
    ==================================================*/

    const slideItems =
        slides.querySelectorAll(
            ".slide"
        );


    const dots =
        dotsContainer
            ? dotsContainer.querySelectorAll(
                ".dot"
            )
            : [];


    let index = 0;


    /*==================================================
    UPDATE SLIDER
    ==================================================*/

    function updateSlider(){

        slides.style.transform =
            `translateX(-${index * 100}%)`;


        dots.forEach(
            dot =>
                dot.classList.remove(
                    "active"
                )
        );


        if(dots[index]){

            dots[index].classList.add(
                "active"
            );

        }

    }


    /*==================================================
    NEXT BUTTON
    ==================================================*/

    if(next){

        next.addEventListener(
            "click",
            () => {

                index++;


                if(
                    index >=
                    slideItems.length
                ){

                    index = 0;

                }


                updateSlider();

            }
        );

    }


    /*==================================================
    PREVIOUS BUTTON
    ==================================================*/

    if(prev){

        prev.addEventListener(
            "click",
            () => {

                index--;


                if(index < 0){

                    index =
                        slideItems.length - 1;

                }


                updateSlider();

            }
        );

    }


    /*==================================================
    DOT BUTTONS
    ==================================================*/

    dots.forEach(
        (dot, i) => {

            dot.addEventListener(
                "click",
                () => {

                    index = i;

                    updateSlider();

                }
            );

        }
    );


    /*==================================================
    AUTO SLIDE
    ==================================================*/

    if(
        slideItems.length > 1
    ){

        setInterval(
            () => {

                index++;


                if(
                    index >=
                    slideItems.length
                ){

                    index = 0;

                }


                updateSlider();

            },
            5000
        );

    }


    /*==================================================
    INITIAL SLIDE
    ==================================================*/

    updateSlider();


});


/*==================================================
ESCAPE BANNER HTML
==================================================*/

function escapeBannerHTML(
    value
){

    return String(
        value || ""
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
