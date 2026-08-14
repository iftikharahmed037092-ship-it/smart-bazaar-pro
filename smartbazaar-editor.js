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


/*==================================================
SMARTBAZAAR PRO
NO CODE WEBSITE BUILDER
JAVASCRIPT
FEATURE 21 - 30
==================================================*/


document.addEventListener("DOMContentLoaded", function(){


    /*==================================================
    FEATURE 21 - DIVIDER
    ==================================================*/

    const dividerElements =
    document.querySelectorAll('[data-element="divider"]');


    dividerElements.forEach(function(button){

        button.addEventListener("click", function(){

            createCanvasElement(`
                <div class="sb-canvas-divider"></div>
            `);

        });

    });



    /*==================================================
    FEATURE 22 - SPACER
    ==================================================*/

    const spacerElements =
    document.querySelectorAll('[data-element="spacer"]');


    spacerElements.forEach(function(button){

        button.addEventListener("click", function(){

            createCanvasElement(`
                <div class="sb-canvas-spacer"></div>
            `);

        });

    });



    /*==================================================
    FEATURE 23 - FORM
    ==================================================*/

    const formElements =
    document.querySelectorAll('[data-element="form"]');


    formElements.forEach(function(button){

        button.addEventListener("click", function(){

            createCanvasElement(`

                <form class="sb-canvas-form">

                    <input 
                    type="text"
                    placeholder="Your Name">

                    <input 
                    type="email"
                    placeholder="Your Email">

                    <textarea
                    placeholder="Your Message"></textarea>

                    <button type="submit">
                        Send Message
                    </button>

                </form>

            `);

        });

    });



    /*==================================================
    FEATURE 24 - PRODUCT CARD
    ==================================================*/

    const productElements =
    document.querySelectorAll('[data-element="product-card"]');


    productElements.forEach(function(button){

        button.addEventListener("click", function(){

            createCanvasElement(`

                <div class="sb-canvas-product-card">

                    <div class="product-image">
                        Product Image
                    </div>

                    <h3>
                        Product Name
                    </h3>

                    <p>
                        Product Description
                    </p>

                    <strong>
                        Rs. 1,999
                    </strong>

                    <button>
                        Add to Cart
                    </button>

                </div>

            `);

        });

    });



    /*==================================================
    FEATURE 25 - NEWS GRID
    ==================================================*/

    const newsElements =
    document.querySelectorAll('[data-element="news-grid"]');


    newsElements.forEach(function(button){

        button.addEventListener("click", function(){

            createCanvasElement(`

                <section class="sb-canvas-news-grid">

                    <article>
                        <div class="news-image">
                            News Image
                        </div>

                        <h3>
                            News Title
                        </h3>

                        <p>
                            News description goes here.
                        </p>
                    </article>


                    <article>
                        <div class="news-image">
                            News Image
                        </div>

                        <h3>
                            News Title
                        </h3>

                        <p>
                            News description goes here.
                        </p>
                    </article>


                    <article>
                        <div class="news-image">
                            News Image
                        </div>

                        <h3>
                            News Title
                        </h3>

                        <p>
                            News description goes here.
                        </p>
                    </article>

                </section>

            `);

        });

    });



    /*==================================================
    FEATURE 26 - PAGES TAB
    ==================================================*/

    const panelTabs =
    document.querySelectorAll(".sb-panel-tab");


    panelTabs.forEach(function(tab){

        const text =
        tab.textContent.trim().toLowerCase();


        if(text.includes("pages")){

            tab.addEventListener("click", function(){

                openEditorPanel("pages");

            });

        }


    });



    /*==================================================
    FEATURE 27 - TEMPLATES TAB
    ==================================================*/

    panelTabs.forEach(function(tab){

        const text =
        tab.textContent.trim().toLowerCase();


        if(text.includes("templates")){

            tab.addEventListener("click", function(){

                openEditorPanel("templates");

            });

        }

    });



    /*==================================================
    FEATURE 28 - MEDIA LIBRARY
    ==================================================*/

    panelTabs.forEach(function(tab){

        const text =
        tab.textContent.trim().toLowerCase();


        if(text.includes("media library")){

            tab.addEventListener("click", function(){

                openEditorPanel("media");

            });

        }

    });



    /*==================================================
    FEATURE 29 - LIVE PREVIEW CANVAS
    ==================================================*/

    let editorCanvas =
    document.querySelector(
        ".sb-editor-canvas"
    );


    if(!editorCanvas){

        editorCanvas =
        document.querySelector(
            ".sb-canvas"
        );

    }


    if(!editorCanvas){

        editorCanvas =
        document.querySelector(
            "#editorCanvas"
        );

    }



    /*==================================================
    FEATURE 30 - DRAG & DROP
    ==================================================*/

    let draggedElement = null;


    document.addEventListener(
        "dragstart",
        function(event){

            if(
                event.target.classList.contains(
                    "sb-canvas-element"
                )
            ){

                draggedElement =
                event.target;

                event.dataTransfer.effectAllowed =
                "move";

            }

        }
    );



    if(editorCanvas){

        editorCanvas.addEventListener(
            "dragover",
            function(event){

                event.preventDefault();

                editorCanvas.classList.add(
                    "sb-drag-over"
                );

            }
        );


        editorCanvas.addEventListener(
            "dragleave",
            function(){

                editorCanvas.classList.remove(
                    "sb-drag-over"
                );

            }
        );


        editorCanvas.addEventListener(
            "drop",
            function(event){

                event.preventDefault();

                editorCanvas.classList.remove(
                    "sb-drag-over"
                );


                if(draggedElement){

                    editorCanvas.appendChild(
                        draggedElement
                    );

                    draggedElement = null;

                }

            }
        );

    }



    /*==================================================
    CREATE CANVAS ELEMENT
    ==================================================*/

    function createCanvasElement(html){

        if(!editorCanvas){

            console.warn(
                "SmartBazaar Pro: Editor Canvas not found."
            );

            return;

        }


        const wrapper =
        document.createElement("div");


        wrapper.className =
        "sb-canvas-element";


        wrapper.setAttribute(
            "draggable",
            "true"
        );


        wrapper.innerHTML = html;


        editorCanvas.appendChild(
            wrapper
        );


        makeElementSelectable(
            wrapper
        );

    }



    /*==================================================
    ELEMENT SELECTION
    ==================================================*/

    function makeElementSelectable(element){

        element.addEventListener(
            "click",
            function(event){

                event.stopPropagation();


                document
                .querySelectorAll(
                    ".sb-canvas-element.sb-selected"
                )
                .forEach(function(item){

                    item.classList.remove(
                        "sb-selected"
                    );

                });


                element.classList.add(
                    "sb-selected"
                );

            }
        );

    }



    /*==================================================
    EDITOR PANEL SYSTEM
    ==================================================*/

    function openEditorPanel(panelName){

        console.log(
            "SmartBazaar Pro Panel:",
            panelName
        );


        document.dispatchEvent(
            new CustomEvent(
                "sbEditorPanelOpen",
                {
                    detail:{
                        panel:panelName
                    }
                }
            )
        );

    }



    /*==================================================
    CANVAS CLICK
    ==================================================*/

    if(editorCanvas){

        editorCanvas.addEventListener(
            "click",
            function(){

                document
                .querySelectorAll(
                    ".sb-canvas-element.sb-selected"
                )
                .forEach(function(element){

                    element.classList.remove(
                        "sb-selected"
                    );

                });

            }
        );

    }



    /*==================================================
    FORM PREVENT DEFAULT
    ==================================================*/

    document.addEventListener(
        "submit",
        function(event){

            if(
                event.target.classList.contains(
                    "sb-canvas-form"
                )
            ){

                event.preventDefault();

                console.log(
                    "SmartBazaar Pro: Form submitted."
                );

            }

        }
    );


});




