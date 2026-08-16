/* ==========================================================
SMARTBAZAAR PRO
EDITOR HEADER JAVASCRIPT
FEATURES 1 - 10
========================================================== */

document.addEventListener("DOMContentLoaded", function(){


    /* ======================================================
    ELEMENT REFERENCES
    ====================================================== */

    const desktopMode =
        document.getElementById("desktopMode");

    const tabletMode =
        document.getElementById("tabletMode");

    const mobileMode =
        document.getElementById("mobileMode");

    const deviceButtons =
        document.querySelectorAll(".sb-device-btn");


    const undoButton =
        document.getElementById("undoButton");

    const redoButton =
        document.getElementById("redoButton");

    const previewButton =
        document.getElementById("previewButton");

    const saveButton =
        document.getElementById("saveButton");

    const exportButton =
        document.getElementById("exportButton");

    const settingsButton =
        document.getElementById("settingsButton");


    const statusText =
        document.getElementById("sbStatusText");


    const previewOverlay =
        document.getElementById("sbPreviewOverlay");

    const closePreviewButton =
        document.getElementById("closePreviewButton");


    const settingsOverlay =
        document.getElementById("sbSettingsOverlay");

    const closeSettingsButton =
        document.getElementById("closeSettingsButton");


    /* ======================================================
    STATUS
    ====================================================== */

    function setStatus(message){

        if(statusText){

            statusText.textContent = message;

        }

    }


    /* ======================================================
    FEATURES 2 - 4
    DEVICE PREVIEW

    IMPORTANT:
    یہ صرف CANVAS کو device mode بتاتا ہے۔
    پورا editor desktop/tablet/mobile نہیں بنتا۔
    ====================================================== */

    function setDeviceMode(device){

        /* Active button */

        deviceButtons.forEach(function(button){

            button.classList.toggle(
                "active",
                button.dataset.device === device
            );

        });


        /* Canvas */

        const canvas =
            document.getElementById("sbWebsiteCanvas");


        if(canvas){

            canvas.classList.remove(
                "sb-canvas-desktop",
                "sb-canvas-tablet",
                "sb-canvas-mobile"
            );


            canvas.classList.add(
                "sb-canvas-" + device
            );


            canvas.dataset.device = device;

        }


        /* Custom event */

        document.dispatchEvent(

            new CustomEvent(
                "sb:deviceChange",
                {
                    detail:{
                        device:device
                    }
                }
            )

        );


        setStatus(
            device.charAt(0).toUpperCase() +
            device.slice(1) +
            " Preview"
        );

    }


    deviceButtons.forEach(function(button){

        button.addEventListener(
            "click",
            function(){

                setDeviceMode(
                    this.dataset.device
                );

            }
        );

    });


    /* Default */

    setDeviceMode("desktop");


    /* ======================================================
    FEATURE 5
    UNDO
    ====================================================== */

    undoButton.addEventListener(
        "click",
        function(){

            document.dispatchEvent(
                new CustomEvent(
                    "sb:undo"
                )
            );

            setStatus("Undo");

        }
    );


    /* ======================================================
    FEATURE 6
    REDO
    ====================================================== */

    redoButton.addEventListener(
        "click",
        function(){

            document.dispatchEvent(
                new CustomEvent(
                    "sb:redo"
                )
            );

            setStatus("Redo");

        }
    );


    /* ======================================================
    FEATURE 7
    PREVIEW
    ====================================================== */

    previewButton.addEventListener(
        "click",
        function(){

            if(previewOverlay){

                previewOverlay.hidden = false;

            }

            setStatus("Preview");

        }
    );


    if(closePreviewButton){

        closePreviewButton.addEventListener(
            "click",
            function(){

                previewOverlay.hidden = true;

                setStatus("Ready");

            }
        );

    }


    /* ======================================================
    FEATURE 8
    SAVE
    ====================================================== */

    saveButton.addEventListener(
        "click",
        function(){

            /*
            ابھی اصل Firebase Save نہیں۔
            آگے Feature 124 کے ساتھ یہی event connect ہوگا۔
            */

            document.dispatchEvent(
                new CustomEvent(
                    "sb:save"
                )
            );


            setStatus("Saved");


            setTimeout(
                function(){

                    setStatus("Ready");

                },
                1500
            );

        }
    );


    /* ======================================================
    FEATURE 9
    EXPORT
    ====================================================== */

    exportButton.addEventListener(
        "click",
        function(){

            /*
            آگے Export Engine کے ساتھ connect ہوگا۔
            */

            document.dispatchEvent(
                new CustomEvent(
                    "sb:export"
                )
            );


            setStatus("Preparing Export...");


            setTimeout(
                function(){

                    setStatus("Ready");

                },
                1500
            );

        }
    );


    /* ======================================================
    FEATURE 10
    SETTINGS
    ====================================================== */

    settingsButton.addEventListener(
        "click",
        function(){

            if(settingsOverlay){

                settingsOverlay.hidden = false;

            }

            setStatus("Settings");

        }
    );


    if(closeSettingsButton){

        closeSettingsButton.addEventListener(
            "click",
            function(){

                settingsOverlay.hidden = true;

                setStatus("Ready");

            }
        );

    }


    /* ======================================================
    CLOSE OVERLAYS BY CLICKING OUTSIDE
    ====================================================== */

    if(previewOverlay){

        previewOverlay.addEventListener(
            "click",
            function(event){

                if(
                    event.target ===
                    previewOverlay
                ){

                    previewOverlay.hidden = true;

                    setStatus("Ready");

                }

            }
        );

    }


    if(settingsOverlay){

        settingsOverlay.addEventListener(
            "click",
            function(event){

                if(
                    event.target ===
                    settingsOverlay
                ){

                    settingsOverlay.hidden = true;

                    setStatus("Ready");

                }

            }
        );

    }


    /* ======================================================
    KEYBOARD ESC
    ====================================================== */

    document.addEventListener(
        "keydown",
        function(event){

            if(event.key === "Escape"){

                if(previewOverlay){

                    previewOverlay.hidden = true;

                }

                if(settingsOverlay){

                    settingsOverlay.hidden = true;

                }

                setStatus("Ready");

            }

        }
    );


});












/* ==========================================================
SMARTBAZAAR PRO
CENTER CANVAS JAVASCRIPT
FEATURES 29 - 33
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){


        /* ==================================================
        ELEMENTS
        ================================================== */

        const canvas =
            document.getElementById(
                "sbWebsiteCanvas"
            );


        const workspace =
            document.getElementById(
                "sbCanvasWorkspace"
            );


        const canvasSize =
            document.getElementById(
                "sbCanvasSize"
            );


        const dropIndicator =
            document.getElementById(
                "sbDropIndicator"
            );


        const resizeBox =
            document.getElementById(
                "sbResizeBox"
            );


        const multiSelectionBox =
            document.getElementById(
                "sbMultiSelectionBox"
            );


        const horizontalGuide =
            document.getElementById(
                "sbHorizontalGuide"
            );


        const verticalGuide =
            document.getElementById(
                "sbVerticalGuide"
            );


        /* ==================================================
        FEATURE 29
        LIVE PREVIEW CANVAS
        ================================================== */

        if(!canvas){

            return;

        }


        /* ==================================================
        DEVICE CHANGE
        Header کے buttons سے event آئے گا
        ================================================== */

        document.addEventListener(
            "sb:deviceChange",
            function(event){

                const device =
                    event.detail.device;


                canvas.classList.remove(
                    "sb-canvas-desktop",
                    "sb-canvas-tablet",
                    "sb-canvas-mobile"
                );


                canvas.classList.add(
                    "sb-canvas-" + device
                );


                canvas.dataset.device =
                    device;


                if(canvasSize){

                    canvasSize.textContent =
                        device.charAt(0)
                            .toUpperCase() +
                        device.slice(1);

                }


                hideEditorHelpers();

            }
        );


        /* ==================================================
        FEATURE 30
        DRAG & DROP
        ================================================== */

        document.addEventListener(
            "dragover",
            function(event){

                const element =
                    event.target.closest(
                        ".sb-element-item"
                    );


                if(!element){

                    return;

                }


                event.preventDefault();

            }
        );


        canvas.addEventListener(
            "dragover",
            function(event){

                event.preventDefault();

                showDropIndicator(
                    event.clientY
                );

            }
        );


        canvas.addEventListener(
            "dragleave",
            function(event){

                if(
                    event.relatedTarget &&
                    canvas.contains(
                        event.relatedTarget
                    )
                ){

                    return;

                }


                hideDropIndicator();

            }
        );


        canvas.addEventListener(
            "drop",
            function(event){

                event.preventDefault();

                hideDropIndicator();


                const elementType =
                    event.dataTransfer
                        .getData(
                            "text/plain"
                        );


                if(!elementType){

                    return;

                }


                createCanvasElement(
                    elementType,
                    event.clientX,
                    event.clientY
                );

            }
        );


        /* ==================================================
        FEATURE 31
        RESIZE HANDLES
        ================================================== */

        document.addEventListener(
            "click",
            function(event){

                const element =
                    event.target.closest(
                        ".sb-canvas-element"
                    );


                if(!element){

                    return;

                }


                selectElement(
                    element
                );

            }
        );


        /* ==================================================
        FEATURE 32
        MULTI SELECT
        ================================================== */

        let selectionStart = null;


        workspace.addEventListener(
            "mousedown",
            function(event){

                if(
                    event.target !== workspace
                ){

                    return;

                }


                selectionStart = {

                    x:event.clientX,

                    y:event.clientY

                };


                multiSelectionBox.hidden =
                    false;

            }
        );


        workspace.addEventListener(
            "mousemove",
            function(event){

                if(!selectionStart){

                    return;

                }


                updateMultiSelection(
                    selectionStart.x,
                    selectionStart.y,
                    event.clientX,
                    event.clientY
                );

            }
        );


        workspace.addEventListener(
            "mouseup",
            function(){

                if(!selectionStart){

                    return;

                }


                selectionStart = null;

            }
        );


        /* ==================================================
        FEATURE 33
        ALIGNMENT GUIDES
        ================================================== */

        document.addEventListener(
            "sb:showAlignment",
            function(event){

                const data =
                    event.detail;


                if(
                    data.horizontal !== undefined
                ){

                    horizontalGuide.hidden =
                        false;

                    horizontalGuide.style.top =
                        data.horizontal + "px";

                }


                if(
                    data.vertical !== undefined
                ){

                    verticalGuide.hidden =
                        false;

                    verticalGuide.style.left =
                        data.vertical + "px";

                }

            }
        );


        /* ==================================================
        DROP INDICATOR
        ================================================== */

        function showDropIndicator(y){

            if(!dropIndicator){

                return;

            }


            const rect =
                canvas.getBoundingClientRect();


            dropIndicator.style.display =
                "block";


            dropIndicator.style.left =
                "0px";


            dropIndicator.style.width =
                "100%";


            dropIndicator.style.top =
                (y - rect.top) + "px";

        }


        function hideDropIndicator(){

            if(dropIndicator){

                dropIndicator.style.display =
                    "none";

            }

        }


        /* ==================================================
        CREATE CANVAS ELEMENT
        ================================================== */

        function createCanvasElement(
            type,
            x,
            y
        ){

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "sb-canvas-element";


            element.dataset.element =
                type;


            element.textContent =
                type.charAt(0)
                    .toUpperCase() +
                type.slice(1);


            element.style.position =
                "absolute";


            const rect =
                canvas.getBoundingClientRect();


            element.style.left =
                (
                    x -
                    rect.left -
                    60
                ) + "px";


            element.style.top =
                (
                    y -
                    rect.top -
                    20
                ) + "px";


            canvas.appendChild(
                element
            );


            selectElement(
                element
            );


            return element;

        }


        /* ==================================================
        SELECT ELEMENT
        ================================================== */

        function selectElement(
            element
        ){

            document
                .querySelectorAll(
                    ".sb-canvas-element.selected"
                )
                .forEach(
                    function(item){

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


            element.classList.add(
                "selected"
            );


            updateResizeBox(
                element
            );


            showAlignmentGuides(
                element
            );

        }


        /* ==================================================
        RESIZE BOX
        ================================================== */

        function updateResizeBox(
            element
        ){

            if(!resizeBox){

                return;

            }


            const elementRect =
                element.getBoundingClientRect();


            const canvasRect =
                canvas.getBoundingClientRect();


            resizeBox.hidden =
                false;


            resizeBox.style.left =
                (
                    elementRect.left -
                    canvasRect.left
                ) + "px";


            resizeBox.style.top =
                (
                    elementRect.top -
                    canvasRect.top
                ) + "px";


            resizeBox.style.width =
                elementRect.width + "px";


            resizeBox.style.height =
                elementRect.height + "px";

        }


        /* ==================================================
        MULTI SELECT
        ================================================== */

        function updateMultiSelection(
            x1,
            y1,
            x2,
            y2
        ){

            const left =
                Math.min(x1,x2);

            const top =
                Math.min(y1,y2);

            const width =
                Math.abs(x2-x1);

            const height =
                Math.abs(y2-y1);


            const workspaceRect =
                workspace.getBoundingClientRect();


            multiSelectionBox.style.left =
                (
                    left -
                    workspaceRect.left
                ) + "px";


            multiSelectionBox.style.top =
                (
                    top -
                    workspaceRect.top
                ) + "px";


            multiSelectionBox.style.width =
                width + "px";


            multiSelectionBox.style.height =
                height + "px";

        }


        /* ==================================================
        ALIGNMENT GUIDES
        ================================================== */

        function showAlignmentGuides(
            element
        ){

            if(
                !horizontalGuide ||
                !verticalGuide
            ){

                return;

            }


            const elementRect =
                element.getBoundingClientRect();


            const canvasRect =
                canvas.getBoundingClientRect();


            horizontalGuide.hidden =
                false;


            verticalGuide.hidden =
                false;


            horizontalGuide.style.top =
                (
                    elementRect.top -
                    canvasRect.top
                ) + "px";


            verticalGuide.style.left =
                (
                    elementRect.left -
                    canvasRect.left
                ) + "px";

        }


        /* ==================================================
        HIDE HELPERS
        ================================================== */

        function hideEditorHelpers(){

            if(resizeBox){

                resizeBox.hidden =
                    true;

            }


            if(multiSelectionBox){

                multiSelectionBox.hidden =
                    true;

            }


            if(horizontalGuide){

                horizontalGuide.hidden =
                    true;

            }


            if(verticalGuide){

                verticalGuide.hidden =
                    true;

            }


            hideDropIndicator();

        }


        /* ==================================================
        INITIAL STATE
        ================================================== */

        hideEditorHelpers();


    }
);







/* ==========================================================
SMARTBAZAAR PRO
EDITOR SHELL JAVASCRIPT
PART 1
FEATURES:
29, 11, 34, 35, 50, 48, 92, 90, 91, 93, 100, 99
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){


        /* ==================================================
        FEATURE 34 + 35
        CONTENT / STYLE TABS
        ================================================== */

        const rightTabs =
            document.querySelectorAll(
                ".sb-right-tab"
            );


        const rightPanels =
            document.querySelectorAll(
                ".sb-right-section"
            );


        rightTabs.forEach(
            function(tab){

                tab.addEventListener(
                    "click",
                    function(){

                        const target =
                            this.dataset.rightTab;


                        rightTabs.forEach(
                            function(item){

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        rightPanels.forEach(
                            function(panel){

                                panel.classList.remove(
                                    "active"
                                );

                            }
                        );


                        this.classList.add(
                            "active"
                        );


                        const panel =
                            document.getElementById(
                                "sb" +
                                target
                                    .charAt(0)
                                    .toUpperCase() +
                                target.slice(1) +
                                "Panel"
                            );


                        if(panel){

                            panel.classList.add(
                                "active"
                            );

                        }

                    }
                );

            }
        );



        /* ==================================================
        FEATURE 50
        LAYERS PANEL
        ================================================== */

        const layersList =
            document.getElementById(
                "sbLayersList"
            );


        const layerCount =
            document.getElementById(
                "sbLayerCount"
            );


        const refreshLayers =
            document.getElementById(
                "sbRefreshLayers"
            );


        function updateLayers(){

            if(!layersList){

                return;

            }


            const canvas =
                document.getElementById(
                    "sbWebsiteCanvas"
                );


            if(!canvas){

                return;

            }


            const elements =
                canvas.querySelectorAll(
                    ".sb-canvas-element"
                );


            layersList.innerHTML = "";


            if(layerCount){

                layerCount.textContent =
                    elements.length +
                    (
                        elements.length === 1
                            ? " element"
                            : " elements"
                    );

            }


            if(!elements.length){

                layersList.innerHTML = `

                    <div class="sb-no-layers">

                        <span>◇</span>

                        <p>No elements yet</p>

                    </div>

                `;

                return;

            }


            elements.forEach(
                function(element,index){

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "sb-layer-item";


                    item.dataset.layerIndex =
                        index;


                    const name =
                        element.dataset.name ||
                        element.dataset.element ||
                        "Element " +
                        (index + 1);


                    item.innerHTML = `

                        <span class="sb-layer-icon">
                            ◇
                        </span>

                        <span class="sb-layer-name">
                            ${name}
                        </span>

                    `;


                    item.addEventListener(
                        "click",
                        function(){

                            selectCanvasElement(
                                element
                            );

                        }
                    );


                    layersList.appendChild(
                        item
                    );

                }
            );

        }


        if(refreshLayers){

            refreshLayers.addEventListener(
                "click",
                updateLayers
            );

        }


        window.sbRefreshLayers =
            updateLayers;



        /* ==================================================
        FEATURE 48
        ELEMENT ID / CLASS
        ================================================== */

        const elementId =
            document.getElementById(
                "sbElementId"
            );


        const elementClass =
            document.getElementById(
                "sbElementClass"
            );


        const applyIdentity =
            document.getElementById(
                "sbApplyIdentity"
            );


        if(applyIdentity){

            applyIdentity.addEventListener(
                "click",
                function(){

                    const element =
                        window.sbSelectedElement;


                    if(!element){

                        return;

                    }


                    const idValue =
                        elementId.value.trim();


                    const classValue =
                        elementClass.value.trim();


                    if(idValue){

                        element.id =
                            idValue;

                    }
                    else{

                        element.removeAttribute(
                            "id"
                        );

                    }


                    const oldEditorClass =
                        element.className;


                    if(classValue){

                        classValue
                            .split(/\s+/)
                            .forEach(
                                function(className){

                                    if(
                                        className &&
                                        !element.classList.contains(
                                            className
                                        )
                                    ){

                                        element.classList.add(
                                            className
                                        );

                                    }

                                }
                            );

                    }


                    element.dispatchEvent(
                        new CustomEvent(
                            "sb:identityChanged",
                            {
                                detail:{
                                    element:element
                                }
                            }
                        )
                    );

                }
            );

        }



        /* ==================================================
        FEATURE 92
        ELEMENT RENAME
        ================================================== */

        const elementName =
            document.getElementById(
                "sbElementName"
            );


        const renameElement =
            document.getElementById(
                "sbRenameElement"
            );


        if(renameElement){

            renameElement.addEventListener(
                "click",
                function(){

                    const element =
                        window.sbSelectedElement;


                    if(!element){

                        return;

                    }


                    const name =
                        elementName.value.trim();


                    if(name){

                        element.dataset.name =
                            name;

                    }


                    updateLayers();

                }
            );

        }



        /* ==================================================
        FEATURE 90
        ELEMENT LOCK
        ================================================== */

        const lockElement =
            document.getElementById(
                "sbLockElement"
            );


        if(lockElement){

            lockElement.addEventListener(
                "click",
                function(){

                    const element =
                        window.sbSelectedElement;


                    if(!element){

                        return;

                    }


                    const locked =
                        element.classList.toggle(
                            "sb-element-locked"
                        );


                    element.dataset.locked =
                        locked
                            ? "true"
                            : "false";


                    this.dataset.state =
                        locked
                            ? "locked"
                            : "unlocked";


                    this.innerHTML =
                        locked
                            ? "<span>🔒</span> Unlock"
                            : "<span>🔓</span> Lock";

                }
            );

        }



        /* ==================================================
        FEATURE 91
        ELEMENT HIDE
        ================================================== */

        const hideElement =
            document.getElementById(
                "sbHideElement"
            );


        if(hideElement){

            hideElement.addEventListener(
                "click",
                function(){

                    const element =
                        window.sbSelectedElement;


                    if(!element){

                        return;

                    }


                    const hidden =
                        element.classList.toggle(
                            "sb-element-hidden"
                        );


                    element.dataset.hidden =
                        hidden
                            ? "true"
                            : "false";


                    this.dataset.state =
                        hidden
                            ? "hidden"
                            : "visible";


                    this.innerHTML =
                        hidden
                            ? "<span>🚫</span> Show"
                            : "<span>👁</span> Hide";

                }
            );

        }



        /* ==================================================
        FEATURE 93
        ELEMENT SEARCH
        ================================================== */

        const searchInput =
            document.getElementById(
                "sbSearchElements"
            );


        if(searchInput){

            searchInput.addEventListener(
                "input",
                function(){

                    const query =
                        this.value
                            .trim()
                            .toLowerCase();


                    document
                        .querySelectorAll(
                            ".sb-layer-item"
                        )
                        .forEach(
                            function(item){

                                const text =
                                    item.textContent
                                        .toLowerCase();


                                item.style.display =
                                    !query ||
                                    text.includes(
                                        query
                                    )
                                        ? ""
                                        : "none";

                            }
                        );

                }
            );

        }



        /* ==================================================
        FEATURE 100
        GRID / GUIDES
        ================================================== */

        const showGrid =
            document.getElementById(
                "sbShowGrid"
            );


        const showGuides =
            document.getElementById(
                "sbShowGuides"
            );


        const canvasWorkspace =
            document.getElementById(
                "sbCanvasWorkspace"
            );


        if(showGrid){

            showGrid.addEventListener(
                "change",
                function(){

                    if(canvasWorkspace){

                        canvasWorkspace.classList.toggle(
                            "sb-grid-visible",
                            this.checked
                        );

                    }

                }
            );

        }


        if(showGuides){

            showGuides.addEventListener(
                "change",
                function(){

                    document.body.classList.toggle(
                        "sb-guides-visible",
                        this.checked
                    );

                }
            );

        }



        /* ==================================================
        FEATURE 99
        RULERS
        ================================================== */

        const rulerHorizontal =
            document.getElementById(
                "sbRulerHorizontal"
            );


        const rulerVertical =
            document.getElementById(
                "sbRulerVertical"
            );


        if(
            rulerHorizontal &&
            rulerVertical
        ){

            const rulerToggle =
                document.createElement(
                    "button"
                );


            rulerToggle.type =
                "button";


            rulerToggle.className =
                "sb-ruler-toggle";


            rulerToggle.textContent =
                "Rulers";


            rulerToggle.style.cssText = `

                position:fixed;
                right:15px;
                bottom:15px;
                z-index:9000;
                border:0;
                border-radius:9px;
                padding:9px 13px;
                color:#ffffff;
                background:#6366f1;
                font-size:11px;
                font-weight:700;
                cursor:pointer;

            `;


            document.body.appendChild(
                rulerToggle
            );


            rulerToggle.addEventListener(
                "click",
                function(){

                    document.body.classList.toggle(
                        "sb-rulers-active"
                    );

                }
            );

        }



        /* ==================================================
        FEATURE 29
        LIVE CANVAS SELECTION
        ================================================== */

        function selectCanvasElement(
            element
        ){

            if(!element){

                return;

            }


            if(
                element.classList.contains(
                    "sb-element-locked"
                )
            ){

                return;

            }


            document
                .querySelectorAll(
                    ".sb-canvas-element.selected"
                )
                .forEach(
                    function(item){

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


            element.classList.add(
                "selected"
            );


            window.sbSelectedElement =
                element;


            loadElementData(
                element
            );


            updateLayers();

        }


        window.sbSelectCanvasElement =
            selectCanvasElement;



        /* ==================================================
        LOAD SELECTED ELEMENT DATA
        ================================================== */

        function loadElementData(
            element
        ){

            if(elementId){

                elementId.value =
                    element.id || "";

            }


            if(elementClass){

                const classes =
                    Array.from(
                        element.classList
                    )
                    .filter(
                        function(className){

                            return (
                                className !==
                                "sb-canvas-element"
                            );

                        }
                    )
                    .join(" ");


                elementClass.value =
                    classes;

            }


            if(elementName){

                elementName.value =
                    element.dataset.name ||
                    element.dataset.element ||
                    "";

            }

        }



        /* ==================================================
        CANVAS CLICK CONNECTION
        ================================================== */

        document.addEventListener(
            "click",
            function(event){

                const element =
                    event.target.closest(
                        ".sb-canvas-element"
                    );


                if(!element){

                    return;

                }


                event.stopPropagation();


                selectCanvasElement(
                    element
                );

            }
        );



        /* ==================================================
        INITIALIZE
        ================================================== */

        updateLayers();


    }
);




/* ==========================================================
SMARTBAZAAR PRO
ELEMENTS SYSTEM
FEATURE 12–25 + 141–144
JAVASCRIPT
========================================================== */


/* ==========================================================
FEATURE 12–25 + 141–144
ELEMENT DEFINITIONS
========================================================== */

const SB_ELEMENT_DEFINITIONS = {

    /* ======================================================
    FEATURE 12 — TEXT
    ====================================================== */

    text: function(){

        return `
            <div
                class="sb-canvas-element sb-el-text"
                contenteditable="true">

                Double click to edit this text

            </div>
        `;
    },


    /* ======================================================
    FEATURE 13 — HEADING
    ====================================================== */

    heading: function(){

        return `
            <h2
                class="sb-canvas-element sb-el-heading">

                Your Heading

            </h2>
        `;
    },


    /* ======================================================
    FEATURE 14 — IMAGE
    ====================================================== */

    image: function(){

        return `
            <img
                class="sb-canvas-element sb-el-image"
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80"
                alt="Image">
        `;
    },


    /* ======================================================
    FEATURE 15 — BUTTON
    ====================================================== */

    button: function(){

        return `
            <button
                class="sb-canvas-element sb-el-button">

                Click Me

            </button>
        `;
    },


    /* ======================================================
    FEATURE 16 — ICON
    ====================================================== */

    icon: function(){

        return `
            <div
                class="sb-canvas-element sb-el-icon">

                ★

            </div>
        `;
    },


    /* ======================================================
    FEATURE 17 — VIDEO
    ====================================================== */

    video: function(){

        return `
            <video
                class="sb-canvas-element sb-el-video"
                controls>

                <source
                    src=""
                    type="video/mp4">

            </video>
        `;
    },


    /* ======================================================
    FEATURE 18 — CONTAINER
    ====================================================== */

    container: function(){

        return `
            <div
                class="sb-canvas-element sb-el-container">

                Container

            </div>
        `;
    },


    /* ======================================================
    FEATURE 19 — FLEX
    ====================================================== */

    flex: function(){

        return `
            <div
                class="sb-canvas-element sb-el-flex">

                <div>Flex Item 1</div>

                <div>Flex Item 2</div>

            </div>
        `;
    },


    /* ======================================================
    FEATURE 20 — GRID
    ====================================================== */

    grid: function(){

        return `
            <div
                class="sb-canvas-element sb-el-grid">

                <div>Grid Item 1</div>

                <div>Grid Item 2</div>

                <div>Grid Item 3</div>

                <div>Grid Item 4</div>

            </div>
        `;
    },


    /* ======================================================
    FEATURE 21 — DIVIDER
    ====================================================== */

    divider: function(){

        return `
            <div
                class="sb-canvas-element sb-el-divider">
            </div>
        `;
    },


    /* ======================================================
    FEATURE 22 — SPACER
    ====================================================== */

    spacer: function(){

        return `
            <div
                class="sb-canvas-element sb-el-spacer">
            </div>
        `;
    },


    /* ======================================================
    FEATURE 23 — FORM
    ====================================================== */

    form: function(){

        return `
            <form
                class="sb-canvas-element sb-el-form"
                onsubmit="return false">

                <input
                    type="text"
                    placeholder="Your Name">

                <input
                    type="email"
                    placeholder="Your Email">

                <textarea
                    placeholder="Your Message">
                </textarea>

                <button type="submit">
                    Send Message
                </button>

            </form>
        `;
    },


    /* ======================================================
    FEATURE 24 — PRODUCT CARD
    ====================================================== */

    "product-card": function(){

        return `
            <div
                class="sb-canvas-element sb-el-product-card">

                <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"
                    alt="Product">

                <div class="sb-product-info">

                    <h3 class="sb-product-title">
                        Product Name
                    </h3>

                    <div class="sb-product-price">
                        $49.99
                    </div>

                </div>

            </div>
        `;
    },


    /* ======================================================
    FEATURE 25 — NEWS GRID
    ====================================================== */

    "news-grid": function(){

        return `
            <div
                class="sb-canvas-element sb-el-news-grid">

                <article class="sb-news-card">

                    <img
                        src="https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=700&q=80">

                    <div class="sb-news-content">

                        <h4>
                            Latest News
                        </h4>

                        <p>
                            News article description.
                        </p>

                    </div>

                </article>


                <article class="sb-news-card">

                    <img
                        src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=700&q=80">

                    <div class="sb-news-content">

                        <h4>
                            Business Update
                        </h4>

                        <p>
                            Latest business information.
                        </p>

                    </div>

                </article>


                <article class="sb-news-card">

                    <img
                        src="https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=700&q=80">

                    <div class="sb-news-content">

                        <h4>
                            Technology
                        </h4>

                        <p>
                            New technology news.
                        </p>

                    </div>

                </article>

            </div>
        `;
    },


    /* ======================================================
    FEATURE 141 — TABLE
    ====================================================== */

    table: function(){

        return `
            <div
                class="sb-canvas-element sb-el-table">

                <table>

                    <thead>

                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                        </tr>

                    </thead>

                    <tbody>

                        <tr>
                            <td>Product A</td>
                            <td>Electronics</td>
                            <td>$50</td>
                        </tr>

                        <tr>
                            <td>Product B</td>
                            <td>Fashion</td>
                            <td>$70</td>
                        </tr>

                    </tbody>

                </table>

            </div>
        `;
    },


    /* ======================================================
    FEATURE 142 — TABS
    ====================================================== */

    tabs: function(){

        return `
            <div
                class="sb-canvas-element sb-el-tabs">

                <div class="sb-tabs-nav">

                    <button
                        class="sb-tab-button active"
                        data-tab="1">

                        Tab 1

                    </button>

                    <button
                        class="sb-tab-button"
                        data-tab="2">

                        Tab 2

                    </button>

                    <button
                        class="sb-tab-button"
                        data-tab="3">

                        Tab 3

                    </button>

                </div>


                <div
                    class="sb-tab-content">

                    Tab 1 Content

                </div>

            </div>
        `;
    },


    /* ======================================================
    FEATURE 143 — ACCORDION
    ====================================================== */

    accordion: function(){

        return `
            <div
                class="sb-canvas-element sb-el-accordion">

                <div class="sb-accordion-item">

                    <button
                        class="sb-accordion-title">

                        Question 1

                    </button>

                    <div
                        class="sb-accordion-answer">

                        Answer 1

                    </div>

                </div>


                <div class="sb-accordion-item">

                    <button
                        class="sb-accordion-title">

                        Question 2

                    </button>

                    <div
                        class="sb-accordion-answer">

                        Answer 2

                    </div>

                </div>

            </div>
        `;
    },


    /* ======================================================
    FEATURE 144 — SLIDER
    ====================================================== */

    slider: function(){

        return `
            <div
                class="sb-canvas-element sb-el-slider">

                <div class="sb-slider-track">

                    <div class="sb-slide">
                        Slide 1
                    </div>

                    <div class="sb-slide">
                        Slide 2
                    </div>

                    <div class="sb-slide">
                        Slide 3
                    </div>

                </div>


                <div class="sb-slider-controls">

                    <button
                        data-slider-prev>
                        ‹
                    </button>

                    <button
                        data-slider-next>
                        ›
                    </button>

                </div>

            </div>
        `;
    }

};


/* ==========================================================
CANVAS FINDER
========================================================== */

function sbGetCanvas(){

    return (
        document.querySelector("#sbCanvas") ||
        document.querySelector(".sb-canvas") ||
        document.querySelector(".sb-preview-canvas") ||
        document.querySelector(".sb-preview-window") ||
        document.querySelector(".sb-canvas-inner")
    );

}


/* ==========================================================
FEATURE 12–25 + 141–144
ADD ELEMENT
========================================================== */

function sbAddElement(elementType){

    const canvas = sbGetCanvas();

    if(!canvas){

        console.warn(
            "SmartBazaar Pro: Canvas not found."
        );

        return;
    }


    if(!SB_ELEMENT_DEFINITIONS[elementType]){

        console.warn(
            "SmartBazaar Pro: Unknown element:",
            elementType
        );

        return;
    }


    const wrapper = document.createElement("div");

    wrapper.className =
        "sb-created-element";


    wrapper.dataset.elementType =
        elementType;


    wrapper.dataset.feature =
        getFeatureNumber(elementType);


    wrapper.innerHTML =
        SB_ELEMENT_DEFINITIONS[elementType]();


    canvas.appendChild(wrapper);


    sbSelectCreatedElement(wrapper);


    if(typeof updateLayers === "function"){

        updateLayers();

    }


    if(typeof setStatus === "function"){

        setStatus(
            "Added Feature " +
            getFeatureNumber(elementType)
        );

    }

}


/* ==========================================================
FEATURE NUMBER SYSTEM
========================================================== */

function getFeatureNumber(elementType){

    const numbers = {

        text:12,

        heading:13,

        image:14,

        button:15,

        icon:16,

        video:17,

        container:18,

        flex:19,

        grid:20,

        divider:21,

        spacer:22,

        form:23,

        "product-card":24,

        "news-grid":25,

        table:141,

        tabs:142,

        accordion:143,

        slider:144

    };


    return numbers[elementType] || "";
}


/* ==========================================================
SELECT CREATED ELEMENT
========================================================== */

function sbSelectCreatedElement(wrapper){

    document
        .querySelectorAll(
            ".sb-canvas-element"
        )
        .forEach(function(element){

            element.classList.remove(
                "sb-selected"
            );

        });


    const element =
        wrapper.querySelector(
            ".sb-canvas-element"
        );


    if(element){

        element.classList.add(
            "sb-selected"
        );

    }

}


/* ==========================================================
ELEMENT BUTTON EVENTS
========================================================== */

document.addEventListener(
    "click",
    function(event){

        const button =
            event.target.closest(
                ".sb-element-item"
            );


        if(!button){

            return;
        }


        const type =
            button.dataset.element;


        if(!type){

            return;
        }


        event.preventDefault();


        sbAddElement(type);

    }
);


/* ==========================================================
CANVAS ELEMENT SELECTION
========================================================== */

document.addEventListener(
    "click",
    function(event){

        const element =
            event.target.closest(
                ".sb-canvas-element"
            );


        if(!element){

            return;
        }


        event.stopPropagation();


        document
            .querySelectorAll(
                ".sb-canvas-element"
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


/* ==========================================================
FEATURE 142 — TABS FUNCTION
========================================================== */

document.addEventListener(
    "click",
    function(event){

        const tab =
            event.target.closest(
                ".sb-tab-button"
            );


        if(!tab){

            return;
        }


        const tabs =
            tab.closest(
                ".sb-el-tabs"
            );


        if(!tabs){

            return;
        }


        tabs
            .querySelectorAll(
                ".sb-tab-button"
            )
            .forEach(function(item){

                item.classList.remove(
                    "active"
                );

            });


        tab.classList.add(
            "active"
        );


        const content =
            tabs.querySelector(
                ".sb-tab-content"
            );


        if(content){

            content.textContent =
                "Content of " +
                tab.textContent.trim();

        }

    }
);


/* ==========================================================
FEATURE 143 — ACCORDION FUNCTION
========================================================== */

document.addEventListener(
    "click",
    function(event){

        const title =
            event.target.closest(
                ".sb-accordion-title"
            );


        if(!title){

            return;
        }


        const item =
            title.closest(
                ".sb-accordion-item"
            );


        if(item){

            item.classList.toggle(
                "open"
            );

        }

    }
);


/* ==========================================================
FEATURE 144 — SLIDER FUNCTION
========================================================== */

document.addEventListener(
    "click",
    function(event){

        const next =
            event.target.closest(
                "[data-slider-next]"
            );


        const prev =
            event.target.closest(
                "[data-slider-prev]"
            );


        if(!next && !prev){

            return;
        }


        const slider =
            event.target.closest(
                ".sb-el-slider"
            );


        if(!slider){

            return;
        }


        const track =
            slider.querySelector(
                ".sb-slider-track"
            );


        const slides =
            slider.querySelectorAll(
                ".sb-slide"
            );


        if(!track || !slides.length){

            return;
        }


        let index =
            Number(
                slider.dataset.slideIndex || 0
            );


        if(next){

            index++;

        }


        if(prev){

            index--;

        }


        if(index < 0){

            index =
                slides.length - 1;

        }


        if(index >= slides.length){

            index = 0;

        }


        slider.dataset.slideIndex =
            index;


        track.style.transform =
            "translateX(-" +
            (index * 100) +
            "%)";

    }
);












