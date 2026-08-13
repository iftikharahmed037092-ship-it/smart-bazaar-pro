/*==================================================
SMARTBAZAAR PRO
HOME CATEGORIES
FIREBASE DYNAMIC CATEGORY LOADER
==================================================*/

import {
    getCategories
} from "./firebase-category.js";


/*==================================================
CATEGORY LIST
==================================================*/

const categoryList =
    document.querySelector(".category-list");


if (categoryList) {


    /*==================================================
    LOAD CATEGORIES
    ==================================================*/

    async function loadCategories() {

        try {

            const categories =
                await getCategories();


            /*==========================================
            EMPTY CHECK
            ==========================================*/

            if (
                !categories ||
                Object.keys(categories).length === 0
            ) {

                categoryList.innerHTML = "";

                return;

            }


            /*==========================================
            SORT CATEGORIES
            ==========================================*/

            const categoryArray =
                Object.entries(categories)
                    .map(([id, category]) => ({
                        id,
                        ...category
                    }))
                    .filter(category =>
                        category.status !== "inactive"
                    )
                    .sort((a, b) =>
                        (a.createdAt || 0) -
                        (b.createdAt || 0)
                    );


            /*==========================================
            CREATE CATEGORY HTML
            ==========================================*/

            categoryList.innerHTML =
                categoryArray.map(category => {

                    const name =
                        escapeHTML(
                            category.name || "Category"
                        );

                    const icon =
                        escapeHTML(
                            category.icon ||
                            "fa-solid fa-tag"
                        );

                    const color =
                        escapeHTML(
                            category.color ||
                            "#e8f5e9"
                        );

                    const link =
                        escapeHTML(
                            category.link || "#"
                        );


                    return `

                        <li>

                            <a
                                href="${link}"
                                style="background-color:${color};">

                                <i class="${icon}"></i>

                                ${name}

                            </a>

                        </li>

                    `;

                }).join("");


            /*==========================================
            START CATEGORY SCROLL
            ==========================================*/

            startCategoryScroll();


        } catch (error) {

            console.error(
                "Category loading error:",
                error
            );

        }

    }


    /*==================================================
    SAFE HTML
    ==================================================*/

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /*==================================================
    CATEGORY AUTO + MANUAL SCROLL
    ==================================================*/

    function startCategoryScroll() {


        /*==========================================
        DUPLICATE CATEGORIES
        ==========================================*/

        const originalHTML =
            categoryList.innerHTML;


        categoryList.innerHTML +=
            originalHTML;


        let autoSpeed = 0.5;

        let animationFrame;

        let isDragging = false;

        let startX = 0;

        let startScrollLeft = 0;


        /*==========================================
        AUTO SCROLL
        ==========================================*/

        function autoScroll() {

            if (!isDragging) {

                categoryList.scrollLeft +=
                    autoSpeed;


                const halfWidth =
                    categoryList.scrollWidth / 2;


                if (
                    categoryList.scrollLeft >=
                    halfWidth
                ) {

                    categoryList.scrollLeft = 0;

                }


                if (
                    categoryList.scrollLeft <= 0 &&
                    autoSpeed < 0
                ) {

                    categoryList.scrollLeft =
                        halfWidth;

                }

            }


            animationFrame =
                requestAnimationFrame(
                    autoScroll
                );

        }


        autoScroll();


        /*==========================================
        TOUCH START
        ==========================================*/

        categoryList.addEventListener(
            "touchstart",
            event => {

                isDragging = true;

                startX =
                    event.touches[0].pageX;

                startScrollLeft =
                    categoryList.scrollLeft;

            },
            {
                passive: true
            }
        );


        /*==========================================
        TOUCH MOVE
        ==========================================*/

        categoryList.addEventListener(
            "touchmove",
            event => {

                if (!isDragging) {
                    return;
                }


                const currentX =
                    event.touches[0].pageX;


                const distance =
                    currentX - startX;


                categoryList.scrollLeft =
                    startScrollLeft - distance;

            },
            {
                passive: true
            }
        );


        /*==========================================
        TOUCH END
        ==========================================*/

        categoryList.addEventListener(
            "touchend",
            () => {

                isDragging = false;

                normalizeCategoryPosition();

            }
        );


        /*==========================================
        MOUSE DRAG
        ==========================================*/

        categoryList.addEventListener(
            "mousedown",
            event => {

                isDragging = true;

                startX =
                    event.pageX;

                startScrollLeft =
                    categoryList.scrollLeft;

                categoryList.style.cursor =
                    "grabbing";

            }
        );


        categoryList.addEventListener(
            "mousemove",
            event => {

                if (!isDragging) {
                    return;
                }


                const distance =
                    event.pageX - startX;


                categoryList.scrollLeft =
                    startScrollLeft - distance;

            }
        );


        categoryList.addEventListener(
            "mouseup",
            () => {

                isDragging = false;

                categoryList.style.cursor =
                    "";

                normalizeCategoryPosition();

            }
        );


        categoryList.addEventListener(
            "mouseleave",
            () => {

                if (isDragging) {

                    isDragging = false;

                    categoryList.style.cursor =
                        "";

                    normalizeCategoryPosition();

                }

            }
        );


        /*==========================================
        NORMALIZE INFINITE SCROLL
        ==========================================*/

        function normalizeCategoryPosition() {

            const halfWidth =
                categoryList.scrollWidth / 2;


            if (
                categoryList.scrollLeft >=
                halfWidth
            ) {

                categoryList.scrollLeft -=
                    halfWidth;

            }


            if (
                categoryList.scrollLeft < 0
            ) {

                categoryList.scrollLeft +=
                    halfWidth;

            }

        }

    }


    /*==================================================
    START
    ==================================================*/

    loadCategories();

}
