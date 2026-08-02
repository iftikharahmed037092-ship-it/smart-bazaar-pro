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
