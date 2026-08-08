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


/*================================
MOBILE MENU TOGGLE
================================*/

const menuBtn = document.querySelector(".menu-btn");

const navbar = document.querySelector(".mobile-nav");


if(menuBtn && navbar){


menuBtn.addEventListener("click",()=>{


    navbar.classList.toggle("active");


});


}
