/*==================================================
SMARTBAZAAR PRO
HERO JS - PART 14.9
SLIDER CONTROLS
==================================================*/

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");

let currentSlide = 0;

function showSlide(index){

    const slidesContainer = document.querySelector(".slides");

    slidesContainer.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach(dot=>{
        dot.classList.remove("active");
    });

    dots[index].classList.add("active");

}

nextBtn.addEventListener("click",()=>{

    currentSlide++;

    if(currentSlide>=slides.length){
        currentSlide=0;
    }

    showSlide(currentSlide);

});

prevBtn.addEventListener("click",()=>{

    currentSlide--;

    if(currentSlide<0){
        currentSlide=slides.length-1;
    }

    showSlide(currentSlide);

});

dots.forEach((dot,index)=>{

    dot.addEventListener("click",()=>{

        currentSlide=index;

        showSlide(currentSlide);

    });

});


/*==============================
AUTO SLIDER
==============================*/

setInterval(()=>{

    currentSlide++;

    if(currentSlide>=slides.length){
        currentSlide=0;
    }

    showSlide(currentSlide);

},5000);


/*==============================
AUTO SLIDER
==============================*/

setInterval(()=>{

    currentSlide++;

    if(currentSlide >= slides.length){
        currentSlide = 0;
    }

    showSlide(currentSlide);

},5000);

/*==============================
PAUSE ON HOVER
==============================*/

const heroBanner = document.querySelector(".hero-banner");

let autoSlide = setInterval(nextSlide,5000);

function startSlider(){

    autoSlide = setInterval(nextSlide,5000);

}

function stopSlider(){

    clearInterval(autoSlide);

}

heroBanner.addEventListener("mouseenter",stopSlider);

heroBanner.addEventListener("mouseleave",startSlider);
