/*==================================================
SMARTBAZAAR PRO
PART 14
HERO BANNER SLIDER
==================================================*/

const slides = document.querySelector(".slides");
const slide = document.querySelectorAll(".slide");
const prev = document.querySelector(".prev-btn");
const next = document.querySelector(".next-btn");
const dots = document.querySelectorAll(".dot");

let index = 0;

function updateSlider(){

    slides.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach(dot => dot.classList.remove("active"));

    if(dots[index]){
        dots[index].classList.add("active");
    }

}

next.addEventListener("click",()=>{

    index++;

    if(index >= slide.length){
        index = 0;
    }

    updateSlider();

});

prev.addEventListener("click",()=>{

    index--;

    if(index < 0){
        index = slide.length - 1;
    }

    updateSlider();

});

dots.forEach((dot,i)=>{

    dot.addEventListener("click",()=>{

        index = i;

        updateSlider();

    });

});

setInterval(()=>{

    index++;

    if(index >= slide.length){
        index = 0;
    }

    updateSlider();

},5000);

updateSlider();


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
