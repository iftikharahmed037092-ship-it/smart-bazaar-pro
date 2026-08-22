/* ==================================================
SMARTBAZAAR PRO — EDITOR ENGINE
================================================== */


/* ==================================================
STATE
================================================== */

const preview =
    document.getElementById("preview");

const dropMessage =
    document.getElementById("dropMessage");

let selectedElement = null;

let copiedStyle = null;

let undoStack = [];

let redoStack = [];

let zoom = 1;


/* ==================================================
ELEMENTS
FEATURE 11 — Add Elements
FEATURE 30 — Drag & Drop
================================================== */

document
.querySelectorAll(".element")
.forEach(function(item){

    item.addEventListener(
        "dragstart",
        function(event){

            event.dataTransfer.setData(
                "type",
                this.dataset.type
            );

        }
    );


    item.addEventListener(
        "click",
        function(){

            createElement(
                this.dataset.type
            );

        }
    );

});


/* ==================================================
CREATE ELEMENT
================================================== */

function createElement(type){

    saveHistory();

    let element;


    if(type === "heading"){

        element =
            document.createElement("h1");

        element.textContent =
            "New Heading";

        element.className =
            "created heading";

    }


    if(type === "text"){

        element =
            document.createElement("p");

        element.textContent =
            "New text content";

        element.className =
            "created text";

    }


    if(type === "image"){

        element =
            document.createElement("img");

        element.src =
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80";

        element.alt =
            "Image";

        element.className =
            "created image";

    }


    if(type === "button"){

        element =
            document.createElement("button");

        element.textContent =
            "New Button";

        element.className =
            "created button";

    }


    if(type === "icon"){

        element =
            document.createElement("div");

        element.textContent =
            "★";

        element.className =
            "created icon";

    }


    if(type === "container"){

        element =
            document.createElement("div");

        element.textContent =
            "Container";

        element.className =
            "created container";

    }


    if(type === "flex"){

        element =
            document.createElement("div");

        element.textContent =
            "Flex Container";

        element.className =
            "created flex-container";

    }


    if(type === "grid"){

        element =
            document.createElement("div");

        element.textContent =
            "Grid Container";

        element.className =
            "created grid-container";

    }


    if(type === "divider"){

        element =
            document.createElement("hr");

        element.className =
            "created divider";

    }


    if(type === "spacer"){

        element =
            document.createElement("div");

        element.className =
            "created spacer";

    }


    if(!element){

        return;

    }


    element.dataset.name =
        type;


    element.dataset.locked =
        "false";


    element.dataset.hidden =
        "false";


    preview
        .querySelector("#dropMessage")
        ?.remove();


    preview.appendChild(
        element
    );


    selectElement(
        element
    );


    refreshLayers();

    updateCode();

}


/* ==================================================
DROP
================================================== */

preview.addEventListener(
    "dragover",
    function(event){

        event.preventDefault();

    }
);


preview.addEventListener(
    "drop",
    function(event){

        event.preventDefault();

        const type =
            event.dataTransfer.getData(
                "type"
            );


        if(type){

            createElement(type);

        }

    }
);


/* ==================================================
SELECT
================================================== */

preview.addEventListener(
    "click",
    function(event){

        const element =
            event.target.closest(
                ".created"
            );


        if(!element){

            return;

        }


        event.stopPropagation();


        if(
            element.dataset.locked ===
            "true"
        ){

            return;

        }


        selectElement(
            element
        );

    }
);


function selectElement(element){

    if(selectedElement){

        selectedElement
        .classList
        .remove("selected");

    }


    selectedElement =
        element;


    selectedElement
    .classList
    .add("selected");


    loadEditor();

    refreshLayers();

}


/* ==================================================
CONTENT TAB
FEATURE 34
================================================== */

const contentInput =
    document.getElementById(
        "contentInput"
    );


contentInput.addEventListener(
    "input",
    function(){

        if(!selectedElement)
            return;


        selectedElement.textContent =
            this.value;


        saveEditorState();

    }
);


/* ==================================================
ID / CLASS
FEATURE 48
================================================== */

document
.getElementById("elementId")
.addEventListener(
    "input",
    function(){

        if(!selectedElement)
            return;

        selectedElement.id =
            this.value;

        updateCode();

    }
);


document
.getElementById("elementClass")
.addEventListener(
    "input",
    function(){

        if(!selectedElement)
            return;


        const base =
            selectedElement.className
            .split(" ")
            .filter(function(item){

                return item === "created" ||
                       item === "heading" ||
                       item === "text" ||
                       item === "button" ||
                       item === "image" ||
                       item === "icon" ||
                       item === "container" ||
                       item === "flex-container" ||
                       item === "grid-container" ||
                       item === "divider" ||
                       item === "spacer";

            })
            .join(" ");


        selectedElement.className =
            base +
            " " +
            this.value;


        updateCode();

    }
);


/* ==================================================
RENAME
FEATURE 92
================================================== */

document
.getElementById("elementName")
.addEventListener(
    "input",
    function(){

        if(!selectedElement)
            return;


        selectedElement.dataset.name =
            this.value;


        refreshLayers();

    }
);


/* ==================================================
STYLE TAB
FEATURE 35
================================================== */

function styleInput(id, property){

    document
    .getElementById(id)
    .addEventListener(
        "input",
        function(){

            if(!selectedElement)
                return;


            selectedElement.style[property] =
                this.value +
                (
                    property ===
                    "backgroundColor" ||
                    property ===
                    "color"
                    ? ""
                    : "px"
                );


            saveEditorState();

        }
    );

}


styleInput(
    "fontSize",
    "fontSize"
);


styleInput(
    "padding",
    "padding"
);


styleInput(
    "margin",
    "margin"
);


styleInput(
    "borderWidth",
    "borderWidth"
);


styleInput(
    "radius",
    "borderRadius"
);


styleInput(
    "textColor",
    "color"
);


styleInput(
    "background",
    "backgroundColor"
);


/* ==================================================
WIDTH / HEIGHT
================================================== */

["width","height"]
.forEach(function(id){

    document
    .getElementById(id)
    .addEventListener(
        "input",
        function(){

            if(!selectedElement)
                return;


            selectedElement.style[id] =
                this.value;


            saveEditorState();

        }
    );

});


/* ==================================================
SELECT CONTROLS
================================================== */

document
.getElementById("shadow")
.addEventListener(
    "change",
    function(){

        if(!selectedElement)
            return;


        const shadows = {

            none:
                "none",

            small:
                "0 3px 10px rgba(0,0,0,.12)",

            medium:
                "0 8px 25px rgba(0,0,0,.18)",

            large:
                "0 15px 45px rgba(0,0,0,.25)"

        };


        selectedElement.style.boxShadow =
            shadows[this.value];


        saveEditorState();

    }
);


["position","display","overflow"]
.forEach(function(id){

    document
    .getElementById(id)
    .addEventListener(
        "change",
        function(){

            if(!selectedElement)
                return;


            selectedElement.style[id] =
                this.value;


            saveEditorState();

        }
    );

});


/* ==================================================
LOAD EDITOR
================================================== */

function loadEditor(){

    if(!selectedElement)
        return;


    document
    .getElementById("emptyEditor")
    .classList
    .add("hidden");


    document
    .getElementById("contentPanel")
    .classList
    .remove("hidden");


    document
    .getElementById("elementName")
    .value =
        selectedElement.dataset.name ||
        selectedElement.tagName;


    document
    .getElementById("elementId")
    .value =
        selectedElement.id;


    document
    .getElementById("elementClass")
    .value =
        selectedElement.className;


    document
    .getElementById("contentInput")
    .value =
        selectedElement.textContent;


    const style =
        getComputedStyle(
            selectedElement
        );


    document
    .getElementById("fontSize")
    .value =
        parseInt(style.fontSize) || 20;


    document
    .getElementById("padding")
    .value =
        parseInt(style.padding) || 0;


    document
    .getElementById("margin")
    .value =
        parseInt(style.margin) || 0;


    document
    .getElementById("borderWidth")
    .value =
        parseInt(style.borderWidth) || 0;


    document
    .getElementById("radius")
    .value =
        parseInt(style.borderRadius) || 0;


    document
    .getElementById("width")
    .value =
        style.width;


    document
    .getElementById("height")
    .value =
        style.height;


    document
    .getElementById("position")
    .value =
        style.position;


    document
    .getElementById("display")
    .value =
        style.display;


    document
    .getElementById("overflow")
    .value =
        style.overflow;


    document
    .getElementById("textColor")
    .value =
        rgbToHex(style.color);


    document
    .getElementById("background")
    .value =
        rgbToHex(
            style.backgroundColor
        );

}


/* ==================================================
DUPLICATE
FEATURE 95
================================================== */

document
.getElementById("duplicateBtn")
.addEventListener(
    "click",
    function(){

        if(!selectedElement)
            return;


        saveHistory();


        const clone =
            selectedElement.cloneNode(
                true
            );


        clone.classList
            .remove("selected");


        preview.appendChild(
            clone
        );


        selectElement(
            clone
        );


        refreshLayers();

        updateCode();

    }
);


/* ==================================================
DELETE
FEATURE 96
================================================== */

document
.getElementById("deleteBtn")
.addEventListener(
    "click",
    deleteSelected
);


function deleteSelected(){

    if(!selectedElement)
        return;


    saveHistory();


    selectedElement.remove();

    selectedElement =
        null;


    document
    .getElementById("emptyEditor")
    .classList
    .remove("hidden");


    document
    .getElementById("editor")
    ?.classList
    .add("hidden");


    refreshLayers();

    updateCode();

}


/* ==================================================
LOCK
FEATURE 90
================================================== */

document
.getElementById("lockBtn")
.addEventListener(
    "click",
    function(){

        if(!selectedElement)
            return;


        const locked =
            selectedElement.dataset.locked ===
            "true";


        selectedElement.dataset.locked =
            String(!locked);


        this.textContent =
            locked
            ? "Lock"
            : "Unlock";


        refreshLayers();

    }
);


/* ==================================================
HIDE
FEATURE 91
================================================== */

document
.getElementById("hideBtn")
.addEventListener(
    "click",
    function(){

        if(!selectedElement)
            return;


        const hidden =
            selectedElement.dataset.hidden ===
            "true";


        selectedElement.dataset.hidden =
            String(!hidden);


        selectedElement.classList.toggle(
            "hidden-element",
            !hidden
        );


        this.textContent =
            hidden
            ? "Hide"
            : "Show";


        refreshLayers();

    }
);


/* ==================================================
LAYERS
FEATURE 50
================================================== */

function refreshLayers(){

    const list =
        document.getElementById(
            "layersList"
        );


    list.innerHTML = "";


    preview
    .querySelectorAll(".created")
    .forEach(function(element,index){

        const layer =
            document.createElement(
                "div"
            );


        layer.className =
            "layer";


        if(element ===
           selectedElement){

            layer.classList.add(
                "active"
            );

        }


        if(
            element.dataset.locked ===
            "true"
        ){

            layer.classList.add(
                "locked"
            );

        }


        if(
            element.dataset.hidden ===
            "true"
        ){

            layer.classList.add(
                "hidden-layer"
            );

        }


        layer.textContent =
            (
                index + 1
            ) +
            ". " +
            (
                element.dataset.name ||
                element.tagName
            );


        layer.addEventListener(
            "click",
            function(){

                selectElement(
                    element
                );

            }
        );


        list.appendChild(
            layer
        );

    });

}


document
.getElementById("refreshLayers")
.addEventListener(
    "click",
    refreshLayers
);


/* ==================================================
COPY / PASTE STYLE
FEATURE 94
================================================== */

document
.getElementById("copyStyleBtn")
.addEventListener(
    "click",
    function(){

        if(!selectedElement)
            return;


        copiedStyle = {

            cssText:
                selectedElement.style.cssText

        };

    }
);


document
.getElementById("pasteStyleBtn")
.addEventListener(
    "click",
    function(){

        if(
            !selectedElement ||
            !copiedStyle
        ){

            return;

        }


        saveHistory();


        selectedElement.style.cssText =
            copiedStyle.cssText;


        loadEditor();

        updateCode();

    }
);


/* ==================================================
UNDO / REDO
FEATURE 5
FEATURE 6
================================================== */

function getSnapshot(){

    return preview.innerHTML;

}


function saveHistory(){

    undoStack.push(
        getSnapshot()
    );


    if(
        undoStack.length >
        30
    ){

        undoStack.shift();

    }


    redoStack = [];

}


document
.getElementById("undoBtn")
.addEventListener(
    "click",
    function(){

        if(!undoStack.length)
            return;


        redoStack.push(
            getSnapshot()
        );


        preview.innerHTML =
            undoStack.pop();


        selectedElement =
            null;


        refreshLayers();

        updateCode();

    }
);


document
.getElementById("redoBtn")
.addEventListener(
    "click",
    function(){

        if(!redoStack.length)
            return;


        undoStack.push(
            getSnapshot()
        );


        preview.innerHTML =
            redoStack.pop();


        selectedElement =
            null;


        refreshLayers();

        updateCode();

    }
);


/* ==================================================
SAVE STATE
FEATURE 8
================================================== */

function saveEditorState(){

    updateCode();

    refreshLayers();

}


document
.getElementById("saveBtn")
.addEventListener(
    "click",
    function(){

        localStorage.setItem(
            "smartbazaar-project",
            JSON.stringify({

                html:
                    preview.innerHTML,

                css:
                    document
                    .getElementById(
                        "cssCode"
                    ).value,

                js:
                    document
                    .getElementById(
                        "jsCode"
                    ).value

            })
        );


        document
        .getElementById("saveStatus")
        .textContent =
            "Saved ✓";

    }
);


/* ==================================================
LOAD SAVED PROJECT
================================================== */

function loadSavedProject(){

    const data =
        localStorage.getItem(
            "smartbazaar-project"
        );


    if(!data)
        return;


    try{

        const project =
            JSON.parse(data);


        preview.innerHTML =
            project.html || "";


        document
        .getElementById("cssCode")
        .value =
            project.css || "";


        document
        .getElementById("jsCode")
        .value =
            project.js || "";


        refreshLayers();


    }catch(error){

        console.error(error);

    }

}



/*==================================================
SMARTBAZAAR PRO
CLEAN CODE GENERATOR
FEATURE 187 — Code Editor
FEATURE 47 — Custom CSS
==================================================*/

function updateCode(){

    const elements =
        preview.querySelectorAll(
            ".created"
        );


    let cssOutput = "";


    /*==============================================
    GENERATE CLEAN CSS
    ==============================================*/

    elements.forEach(
        function(element,index){

            let className =
                element.dataset.codeClass;


            if(!className){

                className =
                    "sb-element-" +
                    (index + 1);

                element.dataset.codeClass =
                    className;

            }


            const style =
                element.style;


            if(style.length){

                cssOutput +=
                    "." +
                    className +
                    " {\n";


                for(
                    let i = 0;
                    i < style.length;
                    i++
                ){

                    const property =
                        style[i];


                    const value =
                        style.getPropertyValue(
                            property
                        );


                    if(value){

                        cssOutput +=
                            "    " +
                            property +
                            ": " +
                            value +
                            ";\n";

                    }

                }


                cssOutput +=
                    "}\n\n";

            }

        }
    );


    /*==============================================
    CREATE CLEAN HTML CLONE
    ==============================================*/

    const clone =
        preview.cloneNode(true);


    /* REMOVE DROP MESSAGE */

    clone
    .querySelectorAll(
        "#dropMessage"
    )
    .forEach(
        function(element){

            element.remove();

        }
    );


    /* REMOVE SELECTION */

    clone
    .querySelectorAll(
        ".selected"
    )
    .forEach(
        function(element){

            element.classList.remove(
                "selected"
            );

        }
    );


    /* REMOVE EDITOR DATA */

    clone
    .querySelectorAll(
        "[data-name]"
    )
    .forEach(
        function(element){

            element.removeAttribute(
                "data-name"
            );

        }
    );


    clone
    .querySelectorAll(
        "[data-locked]"
    )
    .forEach(
        function(element){

            element.removeAttribute(
                "data-locked"
            );

        }
    );


    clone
    .querySelectorAll(
        "[data-hidden]"
    )
    .forEach(
        function(element){

            element.removeAttribute(
                "data-hidden"
            );

        }
    );


    clone
    .querySelectorAll(
        "[data-code-class]"
    )
    .forEach(
        function(element){

            element.removeAttribute(
                "data-code-class"
            );

        }
    );


    /* REMOVE INLINE CSS */

    clone
    .querySelectorAll(
        "[style]"
    )
    .forEach(
        function(element){

            element.removeAttribute(
                "style"
            );

        }
    );


    /* REMOVE EDITOR CLASS */

    clone
    .querySelectorAll(
        ".created"
    )
    .forEach(
        function(element){

            element.classList.remove(
                "created"
            );

        }
    );


    /*==============================================
    CLEAN BODY
    ==============================================*/

    const cleanBody =
        clone.innerHTML.trim();


    /*==============================================
    COMPLETE HTML DOCUMENT
    ==============================================*/

    const htmlOutput =

`<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>SMARTBAZAAR PRO Website</title>

    <link
        rel="stylesheet"
        href="style.css">

</head>

<body>

${cleanBody}

<script src="script.js"><\/script>

</body>

</html>`;


    /*==============================================
    HTML CODE
    ==============================================*/

    document
    .getElementById(
        "htmlCode"
    )
    .value =
        htmlOutput;


    /*==============================================
    CSS CODE
    ==============================================*/

    document
    .getElementById(
        "cssCode"
    )
    .value =
        cssOutput.trim();

}


/*==================================================
CODE TABS
یہ حصہ پہلے والا ہی رہے گا
==================================================*/

document
.querySelectorAll(".code-tab")
.forEach(function(tab){

    tab.addEventListener(
        "click",
        function(){

            document
            .querySelectorAll(
                ".code-tab"
            )
            .forEach(function(item){

                item.classList.remove(
                    "active"
                );

            });


            this.classList.add(
                "active"
            );


            document
            .querySelectorAll(
                ".code-input"
            )
            .forEach(function(input){

                input.classList.add(
                    "hidden"
                );

            });


            document
            .getElementById(
                this.dataset.code +
                "Code"
            )
            .classList
            .remove(
                "hidden"
            );

        }
    );

});

/* ==================================================
LIVE HTML
================================================== */

document
.getElementById("htmlCode")
.addEventListener(
    "input",
    function(){

        preview.innerHTML =
            this.value;

        refreshLayers();

    }
);


/* ==================================================
CUSTOM CSS
================================================== */

let customStyle =
    document.createElement(
        "style"
    );


document.head.appendChild(
    customStyle
);


document
.getElementById("cssCode")
.addEventListener(
    "input",
    function(){

        customStyle.textContent =
            this.value;

    }
);


/* ==================================================
RUN JAVASCRIPT
================================================== */

document
.getElementById("runCode")
.addEventListener(
    "click",
    function(){

        try{

            new Function(

                document
                .getElementById(
                    "jsCode"
                ).value

            )();


            document
            .getElementById("saveStatus")
            .textContent =
                "Code Executed ✓";


        }catch(error){

            document
            .getElementById("saveStatus")
            .textContent =
                "JS Error";

            console.error(error);

        }

    }
);


/* ==================================================
LEFT TABS
================================================== */

document
.querySelectorAll(".left-tab")
.forEach(function(tab){

    tab.addEventListener(
        "click",
        function(){

            document
            .querySelectorAll(
                ".left-tab"
            )
            .forEach(function(item){

                item.classList.remove(
                    "active"
                );

            });


            this.classList.add(
                "active"
            );


            document
            .getElementById(
                "elementsPanel"
            )
            .classList.add(
                "hidden"
            );


            document
            .getElementById(
                "layersPanel"
            )
            .classList.add(
                "hidden"
            );


            document
            .getElementById(
                this.dataset.left +
                "Panel"
            )
            .classList
            .remove(
                "hidden"
            );

        }
    );

});


/* ==================================================
RIGHT TABS
================================================== */

document
.querySelectorAll(".right-tab")
.forEach(function(tab){

    tab.addEventListener(
        "click",
        function(){

            document
            .querySelectorAll(
                ".right-tab"
            )
            .forEach(function(item){

                item.classList.remove(
                    "active"
                );

            });


            this.classList.add(
                "active"
            );


            document
            .getElementById(
                "contentPanel"
            )
            .classList.add(
                "hidden"
            );


            document
            .getElementById(
                "stylePanel"
            )
            .classList.add(
                "hidden"
            );


            document
            .getElementById(
                this.dataset.right +
                "Panel"
            )
            .classList
            .remove(
                "hidden"
            );

        }
    );

});


/* ==================================================
ELEMENT SEARCH
FEATURE 93
================================================== */

document
.getElementById("elementSearch")
.addEventListener(
    "input",
    function(){

        const query =
            this.value.toLowerCase();


        document
        .querySelectorAll(
            ".element"
        )
        .forEach(function(item){

            const name =
                item.dataset.name
                .toLowerCase();


            item.style.display =
                name.includes(query)
                ? "flex"
                : "none";

        });

    }
);


/* ==================================================
GRID / GUIDES
FEATURE 100
================================================== */

document
.getElementById("gridBtn")
.addEventListener(
    "click",
    function(){

        document
        .getElementById(
            "canvasArea"
        )
        .classList
        .toggle("grid");

    }
);


/* ==================================================
RULERS
FEATURE 99
================================================== */

document
.getElementById("rulerBtn")
.addEventListener(
    "click",
    function(){

        document
        .getElementById(
            "rulerTop"
        )
        .classList
        .toggle("active");


        document
        .getElementById(
            "rulerLeft"
        )
        .classList
        .toggle("active");

    }
);


/* ==================================================
ZOOM
FEATURE 102
FEATURE 103
================================================== */

document
.getElementById("zoomIn")
.addEventListener(
    "click",
    function(){

        zoom += .1;

        if(zoom > 2)
            zoom = 2;


        applyZoom();

    }
);


document
.getElementById("zoomOut")
.addEventListener(
    "click",
    function(){

        zoom -= .1;

        if(zoom < .5)
            zoom = .5;


        applyZoom();

    }
);


function applyZoom(){

    document
    .getElementById("preview")
    .style.transform =
        `scale(${zoom})`;


    document
    .getElementById("zoomValue")
    .textContent =
        Math.round(
            zoom * 100
        ) +
        "%";

}


/* ==================================================
DEVICE PREVIEW
FEATURE 2
FEATURE 3
FEATURE 4
================================================== */

document
.querySelectorAll(".device")
.forEach(function(button){

    button.addEventListener(
        "click",
        function(){

            document
            .querySelectorAll(
                ".device"
            )
            .forEach(function(item){

                item.classList.remove(
                    "active"
                );

            });


            this.classList.add(
                "active"
            );


            const type =
                this.dataset.device;


            if(type === "desktop"){

                preview.style.width =
                    "100%";

            }


            if(type === "tablet"){

                preview.style.width =
                    "768px";

            }


            if(type === "mobile"){

                preview.style.width =
                    "390px";

            }

        }
    );

});


/* ==================================================
PREVIEW BUTTON
FEATURE 7
================================================== */

document
.getElementById("previewBtn")
.addEventListener(
    "click",
    function(){

        document
        .querySelector(".left-sidebar")
        .classList
        .toggle("hidden");


        document
        .querySelector(".right-sidebar")
        .classList
        .toggle("hidden");

    }
);


/* ==================================================
SETTINGS
FEATURE 10
================================================== */

document
.getElementById("settingsBtn")
.addEventListener(
    "click",
    function(){

        alert(
            "SMARTBAZAAR PRO Settings\n\n" +
            "Advanced settings will be added later."
        );

    }
);


/* ==================================================
RGB TO HEX
================================================== */

function rgbToHex(rgb){

    if(
        !rgb ||
        rgb === "rgba(0, 0, 0, 0)"
    ){

        return "#ffffff";

    }


    const values =
        rgb.match(/\d+/g);


    if(!values)
        return "#ffffff";


    return "#" +

        values
        .slice(0,3)
        .map(function(value){

            return Number(value)
                .toString(16)
                .padStart(
                    2,
                    "0"
                );

        })
        .join("");

}


/* ==================================================
INITIALIZE
================================================== */

updateCode();

refreshLayers();

loadSavedProject();
