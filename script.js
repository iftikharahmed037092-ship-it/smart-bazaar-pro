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
    
/*==================================================
SMARTBAZAAR PRO
PART 17.3
PROMOTION STACK SLIDER
==================================================*/

const promoCards = document.querySelectorAll(".promo-card");

if (promoCards.length === 3) {

    let current = 1;

    function updatePromoCards() {

        promoCards.forEach(card => {

            card.style.left = "";
            card.style.right = "";
            card.style.transform = "";
            card.style.zIndex = "";
            card.style.opacity = "";

        });

        const left = (current + 2) % 3;
        const center = current;
        const right = (current + 1) % 3;

        /* LEFT */

        promoCards[left].style.left = "2%";
        promoCards[left].style.transform = "scale(.88)";
        promoCards[left].style.zIndex = "1";
        promoCards[left].style.opacity = ".85";

        /* CENTER */

        promoCards[center].style.left = "50%";
        promoCards[center].style.transform =
        "translateX(-50%) scale(1)";
        promoCards[center].style.zIndex = "3";
        promoCards[center].style.opacity = "1";

        /* RIGHT */

        promoCards[right].style.right = "2%";
        promoCards[right].style.transform = "scale(.88)";
        promoCards[right].style.zIndex = "2";
        promoCards[right].style.opacity = ".85";

    }

    updatePromoCards();

    setInterval(() => {

        current++;

        if(current > 2){
            current = 0;
        }

        updatePromoCards();

    }, 4000);

}
