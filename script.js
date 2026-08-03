const slides = document.querySelector(".slides");
const slide = document.querySelectorAll(".slide");

const prev = document.querySelector(".prev-btn");
const next = document.querySelector(".next-btn");

const dots = document.querySelectorAll(".dot");

let index = 0;

function updateSlider(){

    slides.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach(dot=>dot.classList.remove("active"));

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
PART 15.3
MOBILE CATEGORY AUTO SCROLL
==================================================*/

const heroLeft = document.querySelector(".hero-left");

if(heroLeft && window.innerWidth <= 768){

    let scrollSpeed = 1;

    setInterval(()=>{

        heroLeft.scrollLeft += scrollSpeed;

        if(
            heroLeft.scrollLeft >=
            heroLeft.scrollWidth - heroLeft.clientWidth
        ){

            heroLeft.scrollLeft = 0;

        }

    },30);

}
/*==================================================
SMARTBAZAAR PRO
PART 15.3
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
PART 16.3
PROMOTION CARD AUTO SLIDER
==================================================*/

const promoTrack = document.querySelector(".promo-track");

if(promoTrack){

    const promoCards = document.querySelectorAll(".promo-track .offer-card");

    let promoIndex = 0;

    function promoSlider(){

        if(window.innerWidth > 768){

            promoTrack.style.transform = "translateY(0)";
            return;

        }

        promoIndex++;

        if(promoIndex >= promoCards.length){

            promoIndex = 0;

        }

        promoTrack.style.transform =
        `translateY(-${promoIndex * 100}%)`;

    }

    setInterval(promoSlider,5000);

}
    
