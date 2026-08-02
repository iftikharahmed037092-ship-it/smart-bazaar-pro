/*==================================================
SMARTBAZAAR PRO
HERO JS - PART 14.9
COMPLETE SLIDER
==================================================*/

const slidesContainer = document.querySelector(".slides");
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");

let currentSlide = 0;
let autoSlide;

/*==============================
SHOW SLIDE
==============================*/

function showSlide(index){

    slidesContainer.style.transform =
    `translateX(-${index * 100}%)`;

    dots.forEach(dot=>{
        dot.classList.remove("active");
    });

    dots[index].classList.add("active");

}

/*==============================
NEXT
==============================*/

function nextSlide(){

    currentSlide++;

    if(currentSlide >= slides.length){
        currentSlide = 0;
    }

    showSlide(currentSlide);

}

/*==============================
PREVIOUS
==============================*/

function prevSlide(){

    currentSlide--;

    if(currentSlide < 0){
        currentSlide = slides.length - 1;
    }

    showSlide(currentSlide);

}

/*==============================
BUTTON EVENTS
==============================*/

nextBtn.addEventListener("click",nextSlide);

prevBtn.addEventListener("click",prevSlide);

/*==============================
DOT EVENTS
==============================*/

dots.forEach((dot,index)=>{

    dot.addEventListener("click",()=>{

        currentSlide = index;

        showSlide(currentSlide);

    });

});

/*==============================
AUTO SLIDER
==============================*/

function startSlider(){

    autoSlide = setInterval(nextSlide,5000);

}

function stopSlider(){

    clearInterval(autoSlide);

}

const heroBanner = document.querySelector(".hero-banner");

heroBanner.addEventListener("mouseenter",stopSlider);

heroBanner.addEventListener("mouseleave",startSlider);

startSlider();

showSlide(currentSlide);
