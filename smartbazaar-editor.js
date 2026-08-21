/*==================================================
SMARTBAZAAR PRO
EDITOR ENGINE
FEATURE: DRAG & DROP + LIVE HTML/CSS/JS EDITOR
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*==================================================
    BASIC ELEMENTS
    ==================================================*/

    const leftSidebar = document.getElementById("left-sidebar");
    const rightSidebar = document.getElementById("right-sidebar");
    const canvas = document.getElementById("live-canvas");
    const layersTreeView = document.getElementById("layers-tree-view");
    const projectTitleInput = document.getElementById("project-title-input");

    let selectedElement = null;
    let elementCounter = 0;

    let historyStack = [];
    let historyIndex = -1;

    let draggedType = null;
    let draggedPattern = null;

    /*==================================================
    CODING EDITOR ELEMENTS
    ==================================================*/

    const codingPanel =
        document.getElementById("coding-editor-panel");

    const htmlEditor =
        document.getElementById("html-code-editor");

    const cssEditor =
        document.getElementById("css-code-editor");

    const jsEditor =
        document.getElementById("javascript-code-editor");

    const codingStatus =
        document.getElementById("coding-status");

    const characterCount =
        document.getElementById("coding-character-count");

    const resizeHandle =
        document.getElementById("coding-resize-handle");

    const codeTabs =
        document.querySelectorAll(".coding-tab");

    const codePanes =
        document.querySelectorAll(".code-editor-pane");


    /*==================================================
    INITIAL PROJECT DATA
    ==================================================*/

    projectTitleInput.value =
        localStorage.getItem("smartbazaar_project_name")
        || "My_Awesome_Page";


    projectTitleInput.addEventListener("input", () => {

        localStorage.setItem(
            "smartbazaar_project_name",
            projectTitleInput.value
        );

    });


    /*==================================================
    HISTORY SYSTEM
    ==================================================*/

    function saveState() {

        const state = {

            canvasHTML: canvas.innerHTML,

            htmlCode: htmlEditor
                ? htmlEditor.value
                : "",

            cssCode: cssEditor
                ? cssEditor.value
                : "",

            jsCode: jsEditor
                ? jsEditor.value
                : "",

            title: projectTitleInput.value

        };

        if (
            historyIndex <
            historyStack.length - 1
        ) {

            historyStack =
                historyStack.slice(
                    0,
                    historyIndex + 1
                );

        }

        historyStack.push(
            JSON.stringify(state)
        );

        historyIndex++;

        if (historyStack.length > 50) {

            historyStack.shift();
            historyIndex--;

        }

    }


    function restoreState(stateString) {

        try {

            const state =
                JSON.parse(stateString);

            canvas.innerHTML =
                state.canvasHTML || "";

            if (htmlEditor) {
                htmlEditor.value =
                    state.htmlCode || "";
            }

            if (cssEditor) {
                cssEditor.value =
                    state.cssCode || "";
            }

            if (jsEditor) {
                jsEditor.value =
                    state.jsCode || "";
            }

            projectTitleInput.value =
                state.title ||
                "My_Awesome_Page";

            bindCanvasElements();

            updateLayers();

            updatePlaceholder();

            updateCharacterCount();

            updateCodingPreview();

        } catch (error) {

            console.error(
                "Restore Error:",
                error
            );

        }

    }


    /*==================================================
    UNDO
    ==================================================*/

    document
        .getElementById("btn-undo")
        ?.addEventListener("click", () => {

            if (historyIndex > 0) {

                historyIndex--;

                restoreState(
                    historyStack[
                        historyIndex
                    ]
                );

            }

        });


    /*==================================================
    REDO
    ==================================================*/

    document
        .getElementById("btn-redo")
        ?.addEventListener("click", () => {

            if (
                historyIndex <
                historyStack.length - 1
            ) {

                historyIndex++;

                restoreState(
                    historyStack[
                        historyIndex
                    ]
                );

            }

        });


    /*==================================================
    SIDEBAR SYSTEM
    ==================================================*/

    document
        .getElementById("close-left-sidebar")
        ?.addEventListener(
            "click",
            () => {

                leftSidebar
                    ?.classList
                    .add("hidden");

            }
        );


    document
        .getElementById("close-right-sidebar")
        ?.addEventListener(
            "click",
            () => {

                rightSidebar
                    ?.classList
                    .add("hidden");

            }
        );


    document
        .getElementById("btn-add-block")
        ?.addEventListener(
            "click",
            () => {

                leftSidebar
                    ?.classList
                    .toggle("hidden");

            }
        );


    /*==================================================
    CANVAS CLICK
    ==================================================*/

    canvas.addEventListener(
        "click",
        (event) => {

            const element =
                event.target.closest(
                    ".canvas-element"
                );

            if (element) {

                event.stopPropagation();

                selectElement(element);

                rightSidebar
                    ?.classList
                    .remove("hidden");

            } else {

                document
                    .querySelectorAll(
                        ".canvas-element"
                    )
                    .forEach(el => {

                        el.classList
                            .remove("selected");

                    });

                selectedElement = null;

            }

        }
    );


    /*==================================================
    DRAG START
    ==================================================*/

    document
        .querySelectorAll(
            ".draggable-item, .pattern-item"
        )
        .forEach(item => {

            item.addEventListener(
                "dragstart",
                event => {

                    draggedType =
                        item.getAttribute(
                            "data-type"
                        );

                    draggedPattern =
                        item.getAttribute(
                            "data-pattern"
                        );

                    event.dataTransfer
                        .setData(
                            "text/plain",
                            draggedType ||
                            draggedPattern ||
                            ""
                        );

                }
            );

        });


    /*==================================================
    CANVAS DRAG OVER
    ==================================================*/

    canvas.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            canvas.classList
                .add("drag-over");

        }
    );


    canvas.addEventListener(
        "dragleave",
        () => {

            canvas.classList
                .remove("drag-over");

        }
    );


    /*==================================================
    CANVAS DROP
    ==================================================*/

    canvas.addEventListener(
        "drop",
        event => {

            event.preventDefault();

            canvas.classList
                .remove("drag-over");

            if (draggedPattern) {

                createPattern(
                    draggedPattern
                );

            } else if (draggedType) {

                createElementByType(
                    draggedType
                );

            }

            draggedType = null;
            draggedPattern = null;

            rightSidebar
                ?.classList
                .remove("hidden");

            updatePlaceholder();

            generateCodeFromCanvas();

            saveState();

        }
    );


    /*==================================================
    SIDEBAR TABS
    ==================================================*/

    document
        .querySelectorAll(".sidebar")
        .forEach(sidebar => {

            const tabs =
                sidebar.querySelectorAll(
                    ".sub-tab-btn"
                );

            tabs.forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        tabs.forEach(btn => {

                            btn.classList
                                .remove("active");

                        });

                        button.classList
                            .add("active");

                        const target =
                            button.getAttribute(
                                "data-target"
                            );

                        sidebar
                            .querySelectorAll(
                                ".tab-pane"
                            )
                            .forEach(pane => {

                                pane.classList
                                    .remove("active");

                            });

                        sidebar
                            .querySelector(
                                "#" + target
                            )
                            ?.classList
                            .add("active");

                    }
                );

            });

        });


    /*==================================================
    ACCORDIONS
    ==================================================*/

    document
        .querySelectorAll(
            ".accordion-header"
        )
        .forEach(header => {

            header.addEventListener(
                "click",
                () => {

                    header.parentElement
                        .classList
                        .toggle("open");

                }
            );

        });


    /*==================================================
    ELEMENT SEARCH
    ==================================================*/

    const elementSearch =
        document.getElementById(
            "element-search"
        );

    elementSearch?.addEventListener(
        "input",
        () => {

            const query =
                elementSearch.value
                    .toLowerCase()
                    .trim();

            document
                .querySelectorAll(
                    ".draggable-item, .pattern-item"
                )
                .forEach(item => {

                    const text =
                        item.textContent
                            .toLowerCase();

                    item.style.display =
                        text.includes(query)
                            ? ""
                            : "none";

                });

        }
    );


    /*==================================================
    CREATE ELEMENT BY TYPE
    ==================================================*/

    function createElementByType(type) {

        if (type === "image") {

            createElement(
                "image",
                "",
                "",
                "",
                "#1e1e24",
                "#ffffff",
                16,
                12,
                6,
                "100%",
                "auto",
                "solid",
                1,
                "#3f3f46",
                6,
                "none",
                "left"
            );

        }

        else if (type === "video") {

            createElement(
                "video",
                "",
                "",
                "",
                "#14161b",
                "#ffffff",
                16,
                12,
                6,
                "100%",
                "auto",
                "solid",
                1,
                "#3f3f46",
                6,
                "none",
                "left"
            );

        }

        else if (type === "icon") {

            createElement(
                "icon",
                "⭐",
                "",
                "",
                "#27272a",
                "#38bdf8",
                28,
                12,
                6,
                "auto",
                "auto",
                "none",
                1,
                "#3f3f46",
                6,
                "none",
                "center"
            );

        }

        else if (type === "flex") {

            createElement(
                "flex",
                "Flexbox Container",
                "",
                "",
                "#252833",
                "#ffffff",
                16,
                16,
                8,
                "100%",
                "120px",
                "dashed",
                1,
                "#38bdf8",
                8,
                "0 4px 6px rgba(0,0,0,0.3)",
                "left",
                "flex",
                "row"
            );

        }

        else if (type === "grid") {

            createElement(
                "grid",
                "Grid Container",
                "",
                "",
                "#252833",
                "#ffffff",
                16,
                16,
                8,
                "100%",
                "120px",
                "solid",
                1,
                "#2563eb",
                8,
                "0 4px 6px rgba(0,0,0,0.3)",
                "left",
                "grid"
            );

        }

        else if (
            type === "container" ||
            type === "card"
        ) {

            createElement(
                type,
                "Sample " +
                type.toUpperCase() +
                " Box",
                "",
                "",
                "#27272a",
                "#ffffff",
                16,
                16,
                6,
                "100%",
                "100px",
                "solid",
                1,
                "#38bdf8",
                8,
                "0 4px 6px rgba(0,0,0,0.3)",
                "left"
            );

        }

        else {

            createElement(
                type,
                "Sample " +
                type.toUpperCase() +
                " Text",
                "",
                "",
                "#27272a",
                "#ffffff",
                16,
                12,
                6,
                "100%",
                "auto",
                "none",
                1,
                "#3f3f46",
                6,
                "none",
                "left"
            );

        }

    }


    /*==================================================
    CREATE PATTERNS
    ==================================================*/

    function createPattern(type) {

        if (type === "hero") {

            createElement(
                "heading",
                "Build Your Dream Website Today",
                "",
                "",
                "#1e1e24",
                "#38bdf8",
                26,
                14,
                6,
                "100%",
                "auto",
                "none",
                1,
                "#3f3f46",
                6,
                "none",
                "center"
            );

            createElement(
                "paragraph",
                "The ultimate live website builder with responsive grids and elements.",
                "",
                "",
                "#1e1e24",
                "#f1f5f9",
                14,
                10,
                4,
                "100%",
                "auto",
                "none",
                1,
                "#3f3f46",
                6,
                "none",
                "center"
            );

            createElement(
                "button",
                "Get Started Now",
                "",
                "",
                "#2563eb",
                "#ffffff",
                14,
                12,
                6,
                "100%",
                "auto",
                "none",
                1,
                "#3f3f46",
                6,
                "0 4px 10px rgba(37,99,235,0.4)",
                "center"
            );

        }

        else if (type === "image-box") {

            createElement(
                "image",
                "",
                "",
                "",
                "#181b22",
                "#ffffff",
                16,
                10,
                6,
                "100%",
                "180px",
                "solid",
                1,
                "#38bdf8",
                8,
                "0 6px 12px rgba(0,0,0,0.4)",
                "left"
            );

            createElement(
                "heading",
                "Professional Web Development",
                "",
                "",
                "#181b22",
                "#ffffff",
                18,
                8,
                4,
                "100%",
                "auto",
                "none",
                1,
                "#3f3f46",
                4,
                "none",
                "left"
            );

        }

        else if (type === "pricing") {

            createElement(
                "heading",
                "Pro Plan - $29/mo",
                "",
                "",
                "#181b22",
                "#ffffff",
                20,
                12,
                6,
                "100%",
                "auto",
                "solid",
                1,
                "#2563eb",
                8,
                "0 8px 16px rgba(0,0,0,0.4)",
                "center"
            );

            createElement(
                "paragraph",
                "Includes unlimited blocks, custom CSS dimensions, and instant export.",
                "",
                "",
                "#181b22",
                "#94a3b8",
                14,
                8,
                4,
                "100%",
                "auto",
                "none",
                1,
                "#2d3748",
                6,
                "none",
                "center"
            );

            createElement(
                "button",
                "Choose Plan",
                "",
                "",
                "#10b981",
                "#ffffff",
                14,
                10,
                6,
                "100%",
                "auto",
                "none",
                1,
                "#3f3f46",
                6,
                "none",
                "center"
            );

        }

        else if (type === "testimonial") {

            createElement(
                "paragraph",
                '"This builder completely changed how fast I launch client sites. Absolutely incredible!"',
                "",
                "",
                "#252833",
                "#e2e8f0",
                14,
                14,
                6,
                "100%",
                "auto",
                "dashed",
                1,
                "#38bdf8",
                8,
                "0 4px 12px rgba(0,0,0,0.3)",
                "left"
            );

            createElement(
                "heading",
                "- Alex Johnson, Developer",
                "",
                "",
                "#252833",
                "#38bdf8",
                12,
                6,
                4,
                "100%",
                "auto",
                "none",
                1,
                "#3f3f46",
                4,
                "none",
                "left"
            );

        }

    }


    /*==================================================
    CREATE ELEMENT
    ==================================================*/

    function createElement(
        type,
        text,
        imgSrc = "",
        videoSrc = "",
        bgColor = "#27272a",
        color = "#ffffff",
        fontSize = 16,
        padding = 12,
        margin = 6,
        width = "100%",
        height = "auto",
        borderStyle = "none",
        borderWidth = 1,
        borderColor = "#3f3f46",
        radius = 6,
        shadow = "none",
        align = "left",
        displayMode = "block",
        flexDirection = "row"
    ) {

        elementCounter++;

        const el =
            document.createElement("div");

        el.className =
            "canvas-element";

        el.id =
            "el-" + elementCounter;

        el.setAttribute(
            "data-type",
            type
        );


        if (type === "image") {

            const box =
                document.createElement("div");

            box.className =
                "empty-img-placeholder";

            box.innerHTML =
                "<span>🖼 No Image Selected</span>" +
                "<small>Paste image URL in right panel</small>";

            el.appendChild(box);

        }

        else if (type === "video") {

            const iframe =
                document.createElement("iframe");

            iframe.className =
                "canvas-video-box";

            iframe.src =
                videoSrc || text || "";

            iframe.setAttribute(
                "allowfullscreen",
                ""
            );

            el.appendChild(iframe);

        }

        else {

            el.textContent =
                text;

        }


        applyStylesToElement(
            el,
            {
                bgColor,
                color,
                fontSize,
                padding,
                margin,
                width,
                height,
                borderStyle,
                borderWidth,
                borderColor,
                radius,
                shadow,
                align,
                displayMode,
                flexDirection
            }
        );


        bindElementClick(el);

        canvas.appendChild(el);

        updateLayers();

        updatePlaceholder();

        selectElement(el);

        generateCodeFromCanvas();

    }


    /*==================================================
    APPLY STYLES
    ==================================================*/

    function applyStylesToElement(
        el,
        styles
    ) {

        el.style.backgroundColor =
            styles.bgColor;

        el.style.color =
            styles.color;

        el.style.fontSize =
            styles.fontSize + "px";

        el.style.padding =
            styles.padding + "px";

        el.style.margin =
            styles.margin + "px";

        el.style.width =
            styles.width;

        el.style.height =
            styles.height;

        el.style.borderStyle =
            styles.borderStyle;

        el.style.borderWidth =
            styles.borderWidth + "px";

        el.style.borderColor =
            styles.borderColor;

        el.style.borderRadius =
            styles.radius + "px";

        el.style.boxShadow =
            styles.shadow;

        el.style.textAlign =
            styles.align;

        el.style.display =
            styles.displayMode;


        if (
            styles.displayMode === "flex"
        ) {

            el.style.flexDirection =
                styles.flexDirection;

        }


        if (styles.align === "center") {

            el.style.marginLeft =
                "auto";

            el.style.marginRight =
                "auto";

        }

        else if (
            styles.align === "right"
        ) {

            el.style.marginLeft =
                "auto";

            el.style.marginRight =
                "0";

        }

        else {

            el.style.marginLeft =
                "0";

            el.style.marginRight =
                "0";

        }

    }


    /*==================================================
    BIND ELEMENT CLICK
    ==================================================*/

    function bindElementClick(el) {

        el.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                selectElement(el);

                rightSidebar
                    ?.classList
                    .remove("hidden");

            }
        );

    }


    /*==================================================
    REBIND AFTER UNDO / REDO
    ==================================================*/

    function bindCanvasElements() {

        canvas
            .querySelectorAll(
                ".canvas-element"
            )
            .forEach(el => {

                bindElementClick(el);

            });

    }


    /*==================================================
    SELECT ELEMENT
    ==================================================*/

    function selectElement(el) {

        document
            .querySelectorAll(
                ".canvas-element"
            )
            .forEach(item => {

                item.classList
                    .remove("selected");

            });

        selectedElement = el;

        if (el) {

            el.classList
                .add("selected");

            syncPropsToForm();

        }

    }


    /*==================================================
    UPDATE PLACEHOLDER
    ==================================================*/

    function updatePlaceholder() {

        const placeholder =
            canvas.querySelector(
                ".placeholder-text"
            );

        const count =
            canvas.querySelectorAll(
                ".canvas-element"
            ).length;

        if (placeholder) {

            placeholder.style.display =
                count === 0
                    ? "block"
                    : "none";

        }

    }


    /*==================================================
    UPDATE LAYERS
    ==================================================*/

    function updateLayers() {

        const elements =
            canvas.querySelectorAll(
                ".canvas-element"
            );

        if (elements.length === 0) {

            layersTreeView.innerHTML =
                '<p class="no-layers">' +
                "No layers added yet" +
                "</p>";

            return;

        }


        layersTreeView.innerHTML = "";


        elements.forEach(
            (el, index) => {

                const layer =
                    document.createElement(
                        "div"
                    );

                layer.className =
                    "layer-item";

                layer.textContent =
                    `${index + 1}. ` +
                    `${el.getAttribute(
                        "data-type"
                    ).toUpperCase()}`;


                layer.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        selectElement(el);

                        rightSidebar
                            ?.classList
                            .remove("hidden");

                    }
                );


                layersTreeView
                    .appendChild(layer);

            }
        );

    }


    /*==================================================
    INSPECTOR ELEMENTS
    ==================================================*/

    const textInput =
        document.getElementById(
            "prop-text-input"
        );

    const imageInput =
        document.getElementById(
            "prop-image-input"
        );

    const videoInput =
        document.getElementById(
            "prop-video-input"
        );

    const groupTextContent =
        document.getElementById(
            "group-text-content"
        );

    const groupImageContent =
        document.getElementById(
            "group-image-content"
        );

    const groupVideoContent =
        document.getElementById(
            "group-video-content"
        );

    const displayModeInput =
        document.getElementById(
            "prop-display-mode"
        );

    const flexDirectionInput =
        document.getElementById(
            "prop-flex-direction"
        );

    const gridColumnsInput =
        document.getElementById(
            "prop-grid-columns"
        );

    const bgColorInput =
        document.getElementById(
            "prop-bg-color"
        );

    const textColorInput =
        document.getElementById(
            "prop-text-color"
        );

    const fontSizeInput =
        document.getElementById(
            "prop-font-size"
        );

    const widthInput =
        document.getElementById(
            "prop-width"
        );

    const heightInput =
        document.getElementById(
            "prop-height"
        );

    const paddingInput =
        document.getElementById(
            "prop-padding"
        );

    const marginInput =
        document.getElementById(
            "prop-margin"
        );

    const borderStyleInput =
        document.getElementById(
            "prop-border-style"
        );

    const borderWidthInput =
        document.getElementById(
            "prop-border-width"
        );

    const borderColorInput =
        document.getElementById(
            "prop-border-color"
        );

    const radiusInput =
        document.getElementById(
            "prop-border-radius"
        );


    /*==================================================
    SYNC INSPECTOR
    ==================================================*/

    function syncPropsToForm() {

        if (!selectedElement) return;

        const comp =
            window.getComputedStyle(
                selectedElement
            );

        const type =
            selectedElement.getAttribute(
                "data-type"
            );


        groupTextContent.style.display =
            "none";

        groupImageContent.style.display =
            "none";

        groupVideoContent.style.display =
            "none";


        if (type === "image") {

            groupImageContent.style.display =
                "block";

            const image =
                selectedElement.querySelector(
                    "img"
                );

            imageInput.value =
                image ? image.src : "";

        }

        else if (type === "video") {

            groupVideoContent.style.display =
                "block";

            const iframe =
                selectedElement.querySelector(
                    "iframe"
                );

            videoInput.value =
                iframe ? iframe.src : "";

        }

        else {

            groupTextContent.style.display =
                "block";

            textInput.value =
                selectedElement.textContent;

        }


        displayModeInput.value =
            comp.display === "flex"
                ? "flex"
                : comp.display === "grid"
                    ? "grid"
                    : "block";


        flexDirectionInput.value =
            comp.flexDirection ||
            "row";


        bgColorInput.value =
            rgbToHex(
                comp.backgroundColor
            );

        textColorInput.value =
            rgbToHex(
                comp.color
            );

        fontSizeInput.value =
            parseInt(
                comp.fontSize
            ) || 16;

        widthInput.value =
            comp.width || "100%";

        heightInput.value =
            comp.height || "auto";

        paddingInput.value =
            parseInt(
                comp.paddingTop
            ) || 12;

        marginInput.value =
            parseInt(
                comp.marginTop
            ) || 6;

        borderStyleInput.value =
            comp.borderTopStyle ||
            "none";

        borderWidthInput.value =
            parseInt(
                comp.borderTopWidth
            ) || 1;

        borderColorInput.value =
            rgbToHex(
                comp.borderTopColor
            );

        radiusInput.value =
            parseInt(
                comp.borderRadius
            ) || 6;


        document
            .querySelectorAll(
                ".align-btn"
            )
            .forEach(btn => {

                btn.classList.toggle(
                    "active",
                    btn.getAttribute(
                        "data-align"
                    ) === comp.textAlign
                );

            });

    }


    /*==================================================
    INSPECTOR EVENTS
    ==================================================*/

    textInput?.addEventListener(
        "input",
        event => {

            if (!selectedElement)
                return;

            const type =
                selectedElement.getAttribute(
                    "data-type"
                );

            if (
                [
                    "heading",
                    "paragraph",
                    "button",
                    "container",
                    "card",
                    "flex",
                    "grid",
                    "icon"
                ].includes(type)
            ) {

                selectedElement.textContent =
                    event.target.value;

                updateLayers();

                generateCodeFromCanvas();

            }

        }
    );


    imageInput?.addEventListener(
        "input",
        event => {

            if (
                !selectedElement ||
                selectedElement.getAttribute(
                    "data-type"
                ) !== "image"
            ) return;

            const url =
                event.target.value.trim();

            selectedElement.innerHTML = "";


            if (url) {

                const img =
                    document.createElement(
                        "img"
                    );

                img.className =
                    "canvas-img-box";

                img.src = url;

                selectedElement
                    .appendChild(img);

            }

            else {

                const box =
                    document.createElement(
                        "div"
                    );

                box.className =
                    "empty-img-placeholder";

                box.innerHTML =
                    "<span>🖼 No Image Selected</span>" +
                    "<small>Paste image URL</small>";

                selectedElement
                    .appendChild(box);

            }


            generateCodeFromCanvas();

        }
    );


    videoInput?.addEventListener(
        "input",
        event => {

            if (
                !selectedElement ||
                selectedElement.getAttribute(
                    "data-type"
                ) !== "video"
            ) return;

            const url =
                event.target.value.trim();

            selectedElement.innerHTML = "";


            const iframe =
                document.createElement(
                    "iframe"
                );

            iframe.className =
                "canvas-video-box";

            iframe.src = url;

            iframe.setAttribute(
                "allowfullscreen",
                ""
            );

            selectedElement
                .appendChild(iframe);

            generateCodeFromCanvas();

        }
    );


    /*==================================================
    STYLE INPUT HELPER
    ==================================================*/

    function styleInput(
        input,
        callback
    ) {

        input?.addEventListener(
            "input",
            event => {

                if (!selectedElement)
                    return;

                callback(
                    event.target.value
                );

                generateCodeFromCanvas();

            }
        );

    }


    styleInput(
        bgColorInput,
        value => {
            selectedElement.style
                .backgroundColor =
                value;
        }
    );


    styleInput(
        textColorInput,
        value => {
            selectedElement.style
                .color =
                value;
        }
    );


    styleInput(
        fontSizeInput,
        value => {
            selectedElement.style
                .fontSize =
                value + "px";
        }
    );


    styleInput(
        widthInput,
        value => {
            selectedElement.style
                .width =
                value;
        }
    );


    styleInput(
        heightInput,
        value => {
            selectedElement.style
                .height =
                value;
        }
    );


    styleInput(
        paddingInput,
        value => {
            selectedElement.style
                .padding =
                value + "px";
        }
    );


    styleInput(
        marginInput,
        value => {
            selectedElement.style
                .margin =
                value + "px";
        }
    );


    styleInput(
        borderWidthInput,
        value => {
            selectedElement.style
                .borderWidth =
                value + "px";
        }
    );


    styleInput(
        borderColorInput,
        value => {
            selectedElement.style
                .borderColor =
                value;
        }
    );


    styleInput(
        radiusInput,
        value => {
            selectedElement.style
                .borderRadius =
                value + "px";
        }
    );


    borderStyleInput?.addEventListener(
        "change",
        event => {

            if (!selectedElement)
                return;

            selectedElement.style
                .borderStyle =
                event.target.value;

            generateCodeFromCanvas();

        }
    );


    /*==================================================
    ALIGNMENT
    ==================================================*/

    document
        .querySelectorAll(
            ".align-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    if (!selectedElement)
                        return;

                    const align =
                        button.getAttribute(
                            "data-align"
                        );


                    document
                        .querySelectorAll(
                            ".align-btn"
                        )
                        .forEach(btn => {

                            btn.classList
                                .remove(
                                    "active"
                                );

                        });


                    button.classList
                        .add("active");


                    selectedElement.style
                        .textAlign =
                        align;


                    generateCodeFromCanvas();

                }
            );

        });


    /*==================================================
    DISPLAY MODE
    ==================================================*/

    displayModeInput?.addEventListener(
        "change",
        event => {

            if (!selectedElement)
                return;

            selectedElement.style.display =
                event.target.value;

            generateCodeFromCanvas();

        }
    );


    flexDirectionInput?.addEventListener(
        "change",
        event => {

            if (!selectedElement)
                return;

            selectedElement.style
                .flexDirection =
                event.target.value;

            generateCodeFromCanvas();

        }
    );


    gridColumnsInput?.addEventListener(
        "change",
        event => {

            if (!selectedElement)
                return;

            selectedElement.style.display =
                "grid";

            selectedElement.style
                .gridTemplateColumns =
                event.target.value;

            generateCodeFromCanvas();

        }
    );


    /*==================================================
    DELETE ELEMENT
    ==================================================*/

    document
        .getElementById(
            "btn-delete-el"
        )
        ?.addEventListener(
            "click",
            () => {

                if (!selectedElement) {

                    alert(
                        "Please select an element first!"
                    );

                    return;

                }


                selectedElement.remove();

                selectedElement = null;

                updateLayers();

                updatePlaceholder();

                generateCodeFromCanvas();

                rightSidebar
                    ?.classList
                    .add("hidden");

            }
        );


    /*==================================================
    DUPLICATE ELEMENT
    ==================================================*/

    document
        .getElementById(
            "btn-duplicate-el"
        )
        ?.addEventListener(
            "click",
            () => {

                if (!selectedElement) {

                    alert(
                        "Please select an element first!"
                    );

                    return;

                }


                const clone =
                    selectedElement.cloneNode(
                        true
                    );


                elementCounter++;


                clone.id =
                    "el-" +
                    elementCounter;


                clone.classList
                    .remove(
                        "selected"
                    );


                canvas.appendChild(
                    clone
                );


                bindElementClick(
                    clone
                );

                updateLayers();

                selectElement(
                    clone
                );

                generateCodeFromCanvas();

            }
        );


    /*==================================================
    DEVICE SWITCHER
    ==================================================*/

    ["desktop", "tablet", "mobile"]
        .forEach(mode => {

            document
                .getElementById(
                    "btn-" + mode
                )
                ?.addEventListener(
                    "click",
                    event => {

                        document
                            .querySelectorAll(
                                ".device-switcher button"
                            )
                            .forEach(btn => {

                                btn.classList
                                    .remove(
                                        "active"
                                    );

                            });


                        event.currentTarget
                            .classList
                            .add("active");


                        canvas.className =
                            "mode-" +
                            mode;

                    }
                );

        });


    /*==================================================
    PREVIEW MODE
    ==================================================*/

    const previewBtn =
        document.getElementById(
            "btn-preview"
        );

    const floatingBackBtn =
        document.getElementById(
            "floating-back-btn"
        );


    function togglePreview() {

        document.body
            .classList
            .toggle(
                "preview-mode"
            );


        const active =
            document.body
                .classList
                .contains(
                    "preview-mode"
                );


        if (previewBtn) {

            previewBtn.textContent =
                active
                    ? "❌ Exit Preview"
                    : "👁 Preview";

        }

    }


    previewBtn?.addEventListener(
        "click",
        togglePreview
    );


    floatingBackBtn?.addEventListener(
        "click",
        togglePreview
    );


    /*==================================================
    BACK
    ==================================================*/

    document
        .getElementById("btn-back")
        ?.addEventListener(
            "click",
            () => {

                window.history.back();

            }
        );


    /*==================================================
    SAVE PROJECT
    ==================================================*/

    document
        .getElementById("btn-save")
        ?.addEventListener(
            "click",
            saveProject
        );


    function saveProject() {

        const project = {

            title:
                projectTitleInput.value,

            canvasHTML:
                canvas.innerHTML,

            html:
                htmlEditor
                    ? htmlEditor.value
                    : "",

            css:
                cssEditor
                    ? cssEditor.value
                    : "",

            javascript:
                jsEditor
                    ? jsEditor.value
                    : "",

            canvasBackground:
                canvas.style
                    .backgroundColor || ""

        };


        localStorage.setItem(
            "smartbazaar_project",
            JSON.stringify(project)
        );


        localStorage.setItem(
            "smartbazaar_page_content",
            canvas.innerHTML
        );


        showCodingStatus(
            "Project Saved ✓"
        );

    }


    /*==================================================
    LOAD PROJECT
    ==================================================*/

    function loadProject() {

        const saved =
            localStorage.getItem(
                "smartbazaar_project"
            );


        if (!saved) return;


        try {

            const project =
                JSON.parse(saved);


            projectTitleInput.value =
                project.title ||
                "My_Awesome_Page";


            canvas.innerHTML =
                project.canvasHTML || "";


            if (htmlEditor)
                htmlEditor.value =
                    project.html || "";


            if (cssEditor)
                cssEditor.value =
                    project.css || "";


            if (jsEditor)
                jsEditor.value =
                    project.javascript || "";


            if (
                project.canvasBackground
            ) {

                canvas.style
                    .backgroundColor =
                    project.canvasBackground;

            }


            bindCanvasElements();

            updateLayers();

            updatePlaceholder();

            updateCharacterCount();

        }

        catch(error) {

            console.error(
                "Project Load Error:",
                error
            );

        }

    }


    /*==================================================
    CODING EDITOR TABS
    ==================================================*/

    codeTabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                const target =
                    tab.getAttribute(
                        "data-code-tab"
                    );


                codeTabs.forEach(t => {

                    t.classList
                        .remove(
                            "active"
                        );

                });


                tab.classList
                    .add("active");


                codePanes.forEach(
                    pane => {

                        pane.classList
                            .remove(
                                "active"
                            );

                    }
                );


                document
                    .getElementById(
                        "code-pane-" +
                        target
                    )
                    ?.classList
                    .add("active");

            }
        );

    });


    /*==================================================
    OPEN CODE EDITOR
    ==================================================*/

    function openCodeEditor() {

        document.body
            .classList
            .add(
                "code-editor-open"
            );


        generateCodeFromCanvas();

    }


    /*==================================================
    CLOSE CODE EDITOR
    ==================================================*/

    document
        .getElementById(
            "btn-code-close"
        )
        ?.addEventListener(
            "click",
            () => {

                document.body
                    .classList
                    .remove(
                        "code-editor-open"
                    );

            }
        );


    /*==================================================
    CONNECT OPTIONS BUTTON TO CODE EDITOR
    ==================================================*/

    document
        .getElementById(
            "btn-options"
        )
        ?.addEventListener(
            "dblclick",
            openCodeEditor
        );


    /*==================================================
    KEYBOARD SHORTCUT
    CTRL + SHIFT + E
    ==================================================*/

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.ctrlKey &&
                event.shiftKey &&
                event.key.toLowerCase() === "e"
            ) {

                event.preventDefault();

                document.body
                    .classList
                    .toggle(
                        "code-editor-open"
                    );

                if (
                    document.body
                        .classList
                        .contains(
                            "code-editor-open"
                        )
                ) {

                    generateCodeFromCanvas();

                }

            }

        }
    );


    /*==================================================
    CODE EDITOR INPUT
    ==================================================*/

    htmlEditor?.addEventListener(
        "input",
        () => {

            updateCharacterCount();

            updateCodingPreview();

        }
    );


    cssEditor?.addEventListener(
        "input",
        () => {

            updateCharacterCount();

            updateCodingPreview();

        }
    );


    jsEditor?.addEventListener(
        "input",
        () => {

            updateCharacterCount();

            updateCodingPreview();

        }
    );


    /*==================================================
    RUN CODE BUTTON
    ==================================================*/

    document
        .getElementById(
            "btn-code-run"
        )
        ?.addEventListener(
            "click",
            () => {

                updateCodingPreview();

                showCodingStatus(
                    "Code Running ✓"
                );

            }
        );


    /*==================================================
    RESET CODE
    ==================================================*/

    document
        .getElementById(
            "btn-code-reset"
        )
        ?.addEventListener(
            "click",
            () => {

                if (
                    !confirm(
                        "Reset coding editor?"
                    )
                ) return;


                generateCodeFromCanvas();

                showCodingStatus(
                    "Code Reset"
                );

            }
        );


    /*==================================================
    LIVE CODE PREVIEW
    ==================================================*/

    let codeUpdateTimer = null;


    function updateCodingPreview() {

        clearTimeout(
            codeUpdateTimer
        );


        codeUpdateTimer =
            setTimeout(
                () => {

                    const html =
                        htmlEditor
                            ? htmlEditor.value
                            : "";

                    const css =
                        cssEditor
                            ? cssEditor.value
                            : "";

                    const js =
                        jsEditor
                            ? jsEditor.value
                            : "";


                    if (
                        !html.trim() &&
                        !css.trim() &&
                        !js.trim()
                    ) {

                        return;

                    }


                    renderCodeIntoCanvas(
                        html,
                        css,
                        js
                    );


                    showCodingStatus(
                        "Live Preview ✓"
                    );

                },
                250
            );

    }


    /*==================================================
    RENDER CODE INTO SAME CANVAS
    ==================================================*/

    function renderCodeIntoCanvas(
        html,
        css,
        js
    ) {

        canvas.innerHTML = "";


        const style =
            document.createElement(
                "style"
            );

        style.setAttribute(
            "data-live-code",
            "true"
        );

        style.textContent =
            css;


        canvas.appendChild(
            style
        );


        const content =
            document.createElement(
                "div"
            );

        content.className =
            "coding-live-content";


        content.innerHTML =
            html;


        canvas.appendChild(
            content
        );


        if (js.trim()) {

            try {

                const script =
                    document.createElement(
                        "script"
                    );

                script.textContent =
                    `
                    (() => {
                        ${js}
                    })();
                    `;


                content.appendChild(
                    script
                );

            }

            catch(error) {

                console.error(
                    "JavaScript Error:",
                    error
                );

                showCodingStatus(
                    "JavaScript Error"
                );

            }

        }


        updatePlaceholder();

    }


    /*==================================================
    GENERATE HTML/CSS/JS FROM CANVAS
    ==================================================*/

    function generateCodeFromCanvas() {

        if (
            !htmlEditor ||
            !cssEditor ||
            !jsEditor
        ) return;


        const elements =
            canvas.querySelectorAll(
                ".canvas-element"
            );


        if (
            elements.length === 0
        ) return;


        let html = "";
        let css = "";


        elements.forEach(
            (el, index) => {

                const type =
                    el.getAttribute(
                        "data-type"
                    );


                const clone =
                    el.cloneNode(true);


                clone.classList
                    .remove(
                        "selected"
                    );


                const originalId =
                    clone.id;


                const className =
                    "sb-element-" +
                    (index + 1);


                clone.classList
                    .add(
                        className
                    );


                clone.removeAttribute(
                    "id"
                );


                html +=
                    clone.outerHTML +
                    "\n\n";


                const comp =
                    window.getComputedStyle(
                        el
                    );


                css +=
                    `.${className}{\n` +
                    `  background-color:${comp.backgroundColor};\n` +
                    `  color:${comp.color};\n` +
                    `  font-size:${comp.fontSize};\n` +
                    `  padding:${comp.padding};\n` +
                    `  margin:${comp.margin};\n` +
                    `  width:${comp.width};\n` +
                    `  height:${comp.height};\n` +
                    `  border:${comp.borderWidth} ${comp.borderStyle} ${comp.borderColor};\n` +
                    `  border-radius:${comp.borderRadius};\n` +
                    `  text-align:${comp.textAlign};\n` +
                    `  box-shadow:${comp.boxShadow};\n` +
                    `  display:${comp.display};\n` +
                    `}\n\n`;

            }
        );


        htmlEditor.value =
            html.trim();


        cssEditor.value =
            css.trim();


        updateCharacterCount();

    }


    /*==================================================
    CHARACTER COUNTER
    ==================================================*/

    function updateCharacterCount() {

        if (!characterCount)
            return;


        const htmlLength =
            htmlEditor
                ? htmlEditor.value.length
                : 0;

        const cssLength =
            cssEditor
                ? cssEditor.value.length
                : 0;

        const jsLength =
            jsEditor
                ? jsEditor.value.length
                : 0;


        characterCount.textContent =
            `HTML: ${htmlLength} | ` +
            `CSS: ${cssLength} | ` +
            `JS: ${jsLength}`;

    }


    /*==================================================
    CODING STATUS
    ==================================================*/

    function showCodingStatus(
        message
    ) {

        if (!codingStatus)
            return;


        codingStatus.textContent =
            message;

    }


    /*==================================================
    RESIZABLE CODE EDITOR
    ==================================================*/

    let resizing = false;
    let startY = 0;
    let startHeight = 0;


    resizeHandle?.addEventListener(
        "pointerdown",
        event => {

            resizing = true;

            startY =
                event.clientY;

            startHeight =
                codingPanel
                    .getBoundingClientRect()
                    .height;


            resizeHandle.setPointerCapture(
                event.pointerId
            );


            document.body.style
                .userSelect =
                "none";

        }
    );


    resizeHandle?.addEventListener(
        "pointermove",
        event => {

            if (!resizing)
                return;


            const difference =
                startY -
                event.clientY;


            let newHeight =
                startHeight +
                difference;


            const minHeight =
                180;

            const maxHeight =
                window.innerHeight *
                0.70;


            newHeight =
                Math.max(
                    minHeight,
                    Math.min(
                        maxHeight,
                        newHeight
                    )
                );


            codingPanel.style.height =
                newHeight + "px";

        }
    );


    resizeHandle?.addEventListener(
        "pointerup",
        () => {

            resizing = false;

            document.body.style
                .userSelect =
                "";

        }
    );


    /*==================================================
    MEDIA UPLOAD
    ==================================================*/

    const mediaInput =
        document.getElementById(
            "media-file-input"
        );

    const mediaGallery =
        document.getElementById(
            "media-gallery-list"
        );


    mediaInput?.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            if (!file) return;


            const reader =
                new FileReader();


            reader.onload =
                result => {

                    const url =
                        result.target.result;


                    const image =
                        document.createElement(
                            "img"
                        );

                    image.src =
                        url;

                    image.style.width =
                        "100%";

                    image.style.borderRadius =
                        "6px";

                    image.style.marginBottom =
                        "6px";


                    mediaGallery
                        ?.appendChild(
                            image
                        );


                    if (
                        selectedElement &&
                        selectedElement.getAttribute(
                            "data-type"
                        ) === "image"
                    ) {

                        selectedElement
                            .innerHTML =
                            "";

                        const canvasImage =
                            document.createElement(
                                "img"
                            );

                        canvasImage.src =
                            url;

                        canvasImage.className =
                            "canvas-img-box";

                        selectedElement
                            .appendChild(
                                canvasImage
                            );

                        generateCodeFromCanvas();

                    }

                };


            reader.readAsDataURL(
                file
            );

        }
    );


    /*==================================================
    SETTINGS MODAL
    ==================================================*/

    const settingsModal =
        document.getElementById(
            "settings-modal"
        );


    document
        .getElementById(
            "btn-settings"
        )
        ?.addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "modal-project-title"
                    )
                    .value =
                    projectTitleInput.value;


                settingsModal.style.display =
                    "flex";

            }
        );


    document
        .getElementById(
            "close-settings-modal"
        )
        ?.addEventListener(
            "click",
            () => {

                settingsModal.style.display =
                    "none";

            }
        );


    document
        .getElementById(
            "btn-save-settings"
        )
        ?.addEventListener(
            "click",
            () => {

                projectTitleInput.value =
                    document.getElementById(
                        "modal-project-title"
                    ).value;


                canvas.style
                    .backgroundColor =
                    document.getElementById(
                        "modal-canvas-bg"
                    ).value;


                settingsModal.style.display =
                    "none";


                saveProject();

            }
        );


    /*==================================================
    OPTIONS MODAL
    ==================================================*/

    const optionsModal =
        document.getElementById(
            "options-modal"
        );


    document
        .getElementById(
            "btn-options"
        )
        ?.addEventListener(
            "click",
            () => {

                optionsModal.style.display =
                    "flex";

            }
        );


    document
        .getElementById(
            "close-options-modal"
        )
        ?.addEventListener(
            "click",
            () => {

                optionsModal.style.display =
                    "none";

            }
        );


    /*==================================================
    CLEAR CANVAS
    ==================================================*/

    document
        .getElementById(
            "modal-btn-clear"
        )
        ?.addEventListener(
            "click",
            () => {

                if (
                    !confirm(
                        "Are you sure you want to clear all blocks?"
                    )
                ) return;


                canvas.innerHTML =
                    '<div class="placeholder-text">' +
                    "Drag & drop blocks here or click Add (+) from top toolbar" +
                    "</div>";


                if (htmlEditor)
                    htmlEditor.value = "";

                if (cssEditor)
                    cssEditor.value = "";

                if (jsEditor)
                    jsEditor.value = "";


                updateLayers();

                updatePlaceholder();

                updateCharacterCount();

                optionsModal.style.display =
                    "none";


                saveState();

            }
        );


    /*==================================================
    EXPORT COMPLETE WEBSITE
    ==================================================*/

    function exportProject() {

        let html =
            htmlEditor?.value ||
            "";


        let css =
            cssEditor?.value ||
            "";


        let javascript =
            jsEditor?.value ||
            "";


        if (!html.trim()) {

            generateCodeFromCanvas();

            html =
                htmlEditor?.value ||
                "";

            css =
                cssEditor?.value ||
                "";

        }


        const title =
            projectTitleInput.value ||
            "SmartBazaar_Page";


        const completeHTML =
`<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>${escapeHTML(title)}</title>

<style>

${css}

</style>

</head>

<body>

${html}

<script>

${javascript}

<\/script>

</body>

</html>`;


        const blob =
            new Blob(
                [completeHTML],
                {
                    type:
                        "text/html;charset=utf-8"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            title
                .replace(
                    /[^a-z0-9_-]/gi,
                    "_"
                ) +
            ".html";


        document.body
            .appendChild(link);


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );


        showCodingStatus(
            "Export Complete ✓"
        );

    }


    document
        .getElementById(
            "btn-export"
        )
        ?.addEventListener(
            "click",
            exportProject
        );


    document
        .getElementById(
            "modal-btn-export"
        )
        ?.addEventListener(
            "click",
            () => {

                exportProject();

            }
        );


    /*==================================================
    ESCAPE HTML
    ==================================================*/

    function escapeHTML(
        text
    ) {

        const div =
            document.createElement(
                "div"
            );

        div.textContent =
            text;

        return div.innerHTML;

    }


    /*==================================================
    RGB TO HEX
    ==================================================*/

    function rgbToHex(rgb) {

        if (
            !rgb ||
            rgb === "transparent" ||
            rgb ===
            "rgba(0, 0, 0, 0)"
        ) {

            return "#27272a";

        }


        if (
            rgb.startsWith("#")
        ) {

            return rgb;

        }


        const match =
            rgb.match(
                /^rgba?\((\d+),\s*(\d+),\s*(\d+)/
            );


        if (!match)
            return "#27272a";


        return (
            "#" +
            [match[1], match[2], match[3]]
                .map(
                    value =>
                        (
                            "0" +
                            parseInt(
                                value
                            ).toString(16)
                        ).slice(-2)
                )
                .join("")
        );

    }


    /*==================================================
    INITIALIZE
    ==================================================*/

    loadProject();

    bindCanvasElements();

    updateLayers();

    updatePlaceholder();

    updateCharacterCount();


    if (
        canvas.querySelectorAll(
            ".canvas-element"
        ).length > 0
    ) {

        generateCodeFromCanvas();

    }


    saveState();


    /*==================================================
    FINAL READY MESSAGE
    ==================================================*/

    console.log(
        "SMARTBAZAAR PRO EDITOR READY ✓"
    );

});
