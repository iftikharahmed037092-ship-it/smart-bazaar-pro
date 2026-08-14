/* ==========================================
SMARTBAZAAR PRO
NO CODE WEBSITE BUILDER
HEADER + LEFT PANEL JS
FEATURE 1 - 20
========================================== */


/* ==========================
FEATURE 2,3,4
DEVICE PREVIEW
========================== */


const desktopMode =
document.getElementById("desktopMode");


const tabletMode =
document.getElementById("tabletMode");


const mobileMode =
document.getElementById("mobileMode");



const deviceButtons =
document.querySelectorAll(".sb-device-btn");



deviceButtons.forEach(button=>{


    button.addEventListener("click",()=>{


        deviceButtons.forEach(btn=>{

            btn.classList.remove("active");

        });



        button.classList.add("active");



        let device =
        button.dataset.device;



        console.log(
        "Preview Mode:",
        device
        );


    });


});






/* ==========================
FEATURE 5
UNDO BUTTON
========================== */


const undoButton =
document.getElementById("undoButton");



undoButton.addEventListener("click",()=>{


    console.log(
    "Undo Action"
    );


});







/* ==========================
FEATURE 6
REDO BUTTON
========================== */


const redoButton =
document.getElementById("redoButton");



redoButton.addEventListener("click",()=>{


    console.log(
    "Redo Action"
    );


});







/* ==========================
FEATURE 7
PREVIEW BUTTON
========================== */


const previewButton =
document.getElementById("previewButton");



previewButton.addEventListener("click",()=>{


    console.log(
    "Website Preview Open"
    );


});







/* ==========================
FEATURE 8
SAVE BUTTON
========================== */


const saveButton =
document.getElementById("saveButton");



saveButton.addEventListener("click",()=>{


    console.log(
    "Project Saved"
    );


});







/* ==========================
FEATURE 9
EXPORT BUTTON
========================== */


const exportButton =
document.getElementById("exportButton");



exportButton.addEventListener("click",()=>{


    console.log(
    "Export Website Code"
    );


});







/* ==========================
FEATURE 10
SETTINGS BUTTON
========================== */


const settingsButton =
document.getElementById("settingsButton");



settingsButton.addEventListener("click",()=>{


    console.log(
    "Open Settings"
    );


});








/* ==================================
LEFT PANEL
FEATURE 11 - 20
ELEMENT SELECT SYSTEM
================================== */



const elements =
document.querySelectorAll(
".sb-element-item"
);




elements.forEach(element=>{


    element.addEventListener(
    "click",
    ()=>{


        let type =
        element.dataset.element;



        console.log(
        "Selected Element:",
        type
        );


    });


});
