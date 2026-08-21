/*==================================================
SMARTBAZAAR PRO
WEBSITE BUILDER
JAVASCRIPT ENGINE

FEATURE: CODE EDITOR + LIVE PREVIEW
HTML / CSS / JAVASCRIPT
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*==================================================
    FEATURE: CORE ELEMENT REFERENCES
    ==================================================*/

    const leftSidebar = document.getElementById("left-sidebar");
    const rightSidebar = document.getElementById("right-sidebar");
    const canvas = document.getElementById("live-canvas");
    const projectTitleInput = document.getElementById("project-title-input");
    const layersTreeView = document.getElementById("layers-tree-view");
    const addBlockBtn = document.getElementById("btn-add-block");

    let selectedElement = null;
    let elementCounter = 0;

    let historyStack = [];
    let historyIndex = -1;

    /*==================================================
    FEATURE: PROJECT DATA
    ==================================================*/

    let projectData = {
        title: localStorage.getItem("smartbazaar_project_name") || "My_Awesome_Page",
        htmlCode: localStorage.getItem("smartbazaar_html_code") || "",
        cssCode: localStorage.getItem("smartbazaar_css_code") || "",
        jsCode: localStorage.getItem("smartbazaar_js_code") || ""
    };

    /*==================================================
    FEATURE: BASIC PROJECT TITLE
    ==================================================*/

    if (projectTitleInput) {
        projectTitleInput.value = projectData.title;

        projectTitleInput.addEventListener("input", () => {
            projectData.title = projectTitleInput.value;
            localStorage.setItem(
                "smartbazaar_project_name",
                projectData.title
            );
        });
    }

    /*==================================================
    FEATURE: HISTORY SYSTEM
    ==================================================*/

    function saveState() {

        if (!canvas) return;

        if (historyIndex < historyStack.length - 1) {
            historyStack = historyStack.slice(
                0,
                historyIndex + 1
            );
        }

        historyStack.push(canvas.innerHTML);

        historyIndex++;

        if (historyStack.length > 50) {
            historyStack.shift();
            historyIndex--;
        }
    }

    function restoreState(html) {

        if (!canvas) return;

        canvas.innerHTML = html;

        canvas
            .querySelectorAll(".canvas-element")
            .forEach(el => {

                el.addEventListener("click", e => {

                    e.stopPropagation();

                    selectElement(el);

                    if (rightSidebar) {
                        rightSidebar.classList.remove("hidden");
                    }

                });

            });

        updateLayers();

        const placeholder =
            canvas.querySelector(".placeholder-text");

        if (placeholder) {

            const elements =
                canvas.querySelectorAll(".canvas-element");

            placeholder.style.display =
                elements.length === 0 ? "block" : "none";
        }
    }

    /*==================================================
    FEATURE: UNDO
    ==================================================*/

    document
        .getElementById("btn-undo")
        ?.addEventListener("click", () => {

            if (historyIndex > 0) {

                historyIndex--;

                restoreState(
                    historyStack[historyIndex]
                );
            }

        });

    /*==================================================
    FEATURE: REDO
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
                    historyStack[historyIndex]
                );
            }

        });

    /*==================================================
    FEATURE: SIDEBAR CONTROLS
    ==================================================*/

    document
        .getElementById("close-left-sidebar")
        ?.addEventListener("click", () => {

            leftSidebar?.classList.add("hidden");

        });

    document
        .getElementById("close-right-sidebar")
        ?.addEventListener("click", () => {

            rightSidebar?.classList.add("hidden");

        });

    addBlockBtn?.addEventListener("click", () => {

        leftSidebar?.classList.toggle("hidden");

    });

    /*==================================================
    FEATURE: CANVAS SELECTION
    ==================================================*/

    canvas?.addEventListener("click", e => {

        const target =
            e.target.closest(".canvas-element");

        if (target) {

            selectElement(target);

            rightSidebar?.classList.remove("hidden");

        }
        else if (
            e.target === canvas ||
            e.target.classList.contains("placeholder-text")
        ) {

            canvas
                .querySelectorAll(".canvas-element")
                .forEach(el =>
                    el.classList.remove("selected")
                );

            selectedElement = null;
        }

    });

    /*==================================================
    FEATURE: DRAG & DROP
    ==================================================*/

    let draggedType = null;
    let draggedPattern = null;

    document
        .querySelectorAll(
            ".draggable-item, .pattern-item"
        )
        .forEach(item => {

            item.addEventListener(
                "dragstart",
                e => {

                    draggedType =
                        item.getAttribute("data-type");

                    draggedPattern =
                        item.getAttribute("data-pattern");

                    e.dataTransfer.setData(
                        "text/plain",
                        draggedType ||
                        draggedPattern ||
                        ""
                    );

                }
            );

        });

    canvas?.addEventListener("dragover", e => {

        e.preventDefault();

        canvas.classList.add("drag-over");

    });

    canvas?.addEventListener("dragleave", () => {

        canvas.classList.remove("drag-over");

    });

    canvas?.addEventListener("drop", e => {

        e.preventDefault();

        canvas.classList.remove("drag-over");

        const placeholder =
            canvas.querySelector(".placeholder-text");

        if (placeholder) {
            placeholder.style.display = "none";
        }

        if (draggedPattern) {

            createPattern(draggedPattern);

        }
        else if (draggedType) {

            createElementByType(draggedType);

        }

        draggedType = null;
        draggedPattern = null;

        rightSidebar?.classList.remove("hidden");

        saveState();

    });

    /*==================================================
    FEATURE: SIDEBAR TABS
    ==================================================*/

    document
        .querySelectorAll(".sidebar")
        .forEach(sidebar => {

            sidebar
                .querySelectorAll(".sub-tab-btn")
                .forEach(btn => {

                    btn.addEventListener(
                        "click",
                        () => {

                            sidebar
                                .querySelectorAll(
                                    ".sub-tab-btn"
                                )
                                .forEach(b =>
                                    b.classList.remove(
                                        "active"
                                    )
                                );

                            btn.classList.add("active");

                            const target =
                                btn.getAttribute(
                                    "data-target"
                                );

                            sidebar
                                .querySelectorAll(
                                    ".tab-pane"
                                )
                                .forEach(p =>
                                    p.classList.remove(
                                        "active"
                                    )
                                );

                            sidebar
                                .querySelector(
                                    `#${target}`
                                )
                                ?.classList.add(
                                    "active"
                                );

                        }
                    );

                });

        });

    /*==================================================
    FEATURE: ACCORDIONS
    ==================================================*/

    document
        .querySelectorAll(".accordion-header")
        .forEach(header => {

            header.addEventListener(
                "click",
                () => {

                    header
                        .parentElement
                        .classList.toggle("open");

                }
            );

        });

    /*==================================================
    FEATURE: CREATE ELEMENT
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
                "16",
                "12",
                "6",
                "100%",
                "auto",
                "solid",
                "1",
                "#3f3f46",
                "6",
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
                "16",
                "12",
                "6",
                "100%",
                "auto",
                "solid",
                "1",
                "#3f3f46",
                "6",
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
                "28",
                "12",
                "6",
                "auto",
                "auto",
                "none",
                "1",
                "#3f3f46",
                "6",
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
                "16",
                "16",
                "8",
                "100%",
                "120px",
                "dashed",
                "1",
                "#38bdf8",
                "8",
                "none",
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
                "16",
                "16",
                "8",
                "100%",
                "120px",
                "solid",
                "1",
                "#2563eb",
                "8",
                "none",
                "left",
                "grid"
            );

        }
        else {

            createElement(
                type,
                `Sample ${type.toUpperCase()}`,
                "",
                "",
                "#27272a",
                "#ffffff",
                "16",
                "12",
                "6",
                "100%",
                "auto",
                "none",
                "1",
                "#3f3f46",
                "6",
                "none",
                "left"
            );

        }
    }

    /*==================================================
    FEATURE: CREATE CANVAS ELEMENT
    ==================================================*/

    function createElement(
        type,
        text,
        imgSrc = "",
        videoSrc = "",
        bgColor = "#27272a",
        color = "#ffffff",
        fontSize = "16",
        padding = "12",
        margin = "6",
        width = "100%",
        height = "auto",
        bStyle = "none",
        bWidth = "1",
        bColor = "#3f3f46",
        radius = "6",
        shadow = "none",
        align = "left",
        displayMode = "block",
        flexDir = "row"
    ) {

        if (!canvas) return;

        elementCounter++;

        const el =
            document.createElement("div");

        el.className = "canvas-element";

        el.id =
            `el-${elementCounter}`;

        el.setAttribute(
            "data-type",
            type
        );

        /*------------------------------------------
        FEATURE: IMAGE ELEMENT
        ------------------------------------------*/

        if (type === "image") {

            const box =
                document.createElement("div");

            box.className =
                "empty-img-placeholder";

            box.innerHTML = `
                <span>🖼 No Image Selected</span>
                <small>Paste image URL in right panel</small>
            `;

            el.appendChild(box);

        }

        /*------------------------------------------
        FEATURE: VIDEO ELEMENT
        ------------------------------------------*/

        else if (type === "video") {

            const box =
                document.createElement("div");

            box.className =
                "empty-img-placeholder";

            box.innerHTML = `
                <span>🎥 Video</span>
                <small>Paste video URL in right panel</small>
            `;

            el.appendChild(box);

        }

        /*------------------------------------------
        FEATURE: NORMAL ELEMENT
        ------------------------------------------*/

        else {

            el.textContent = text;

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
                bStyle,
                bWidth,
                bColor,
                radius,
                shadow,
                align,
                displayMode,
                flexDir
            }
        );

        el.addEventListener(
            "click",
            e => {

                e.stopPropagation();

                selectElement(el);

                rightSidebar?.classList.remove(
                    "hidden"
                );

            }
        );

        canvas.appendChild(el);

        updateLayers();

        selectElement(el);

    }

    /*==================================================
    FEATURE: ELEMENT STYLING
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
            styles.bStyle;

        el.style.borderWidth =
            styles.bWidth + "px";

        el.style.borderColor =
            styles.bColor;

        el.style.borderRadius =
            styles.radius + "px";

        el.style.boxShadow =
            styles.shadow;

        el.style.textAlign =
            styles.align;

        el.style.display =
            styles.displayMode;

        if (styles.displayMode === "flex") {

            el.style.flexDirection =
                styles.flexDir;

        }

        if (styles.displayMode === "grid") {

            el.style.gridTemplateColumns =
                "1fr 1fr";

        }

        if (styles.align === "center") {

            el.style.marginLeft = "auto";
            el.style.marginRight = "auto";

        }
        else if (styles.align === "right") {

            el.style.marginLeft = "auto";
            el.style.marginRight = "0";

        }
        else {

            el.style.marginLeft = "0";
            el.style.marginRight = "0";

        }

    }

    /*==================================================
    FEATURE: SELECT ELEMENT
    ==================================================*/

    function selectElement(el) {

        document
            .querySelectorAll(
                ".canvas-element"
            )
            .forEach(item =>
                item.classList.remove(
                    "selected"
                )
            );

        selectedElement = el;

        if (selectedElement) {

            selectedElement.classList.add(
                "selected"
            );

            syncPropsToForm();

        }

    }

    /*==================================================
    FEATURE: LAYERS
    ==================================================*/

    function updateLayers() {

        if (!layersTreeView || !canvas)
            return;

        const elements =
            canvas.querySelectorAll(
                ".canvas-element"
            );

        if (elements.length === 0) {

            layersTreeView.innerHTML =
                `<p class="no-layers">
                    No layers added yet
                </p>`;

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
                    `${index + 1}. ${
                        el.getAttribute(
                            "data-type"
                        ).toUpperCase()
                    }`;

                layer.addEventListener(
                    "click",
                    e => {

                        e.stopPropagation();

                        selectElement(el);

                        rightSidebar?.classList.remove(
                            "hidden"
                        );

                    }
                );

                layersTreeView.appendChild(
                    layer
                );

            }
        );

    }

    /*==================================================
    FEATURE: PATTERNS
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
                "26",
                "14",
                "6",
                "100%",
                "auto",
                "none",
                "1",
                "#3f3f46",
                "6",
                "none",
                "center"
            );

            createElement(
                "paragraph",
                "The ultimate live website builder.",
                "",
                "",
                "#1e1e24",
                "#f1f5f9",
                "14",
                "10",
                "4",
                "100%",
                "auto",
                "none",
                "1",
                "#3f3f46",
                "6",
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
                "14",
                "12",
                "6",
                "100%",
                "auto",
                "none",
                "1",
                "#3f3f46",
                "6",
                "none",
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
                "16",
                "10",
                "6",
                "100%",
                "180px",
                "solid",
                "1",
                "#38bdf8",
                "8",
                "none",
                "left"
            );

            createElement(
                "heading",
                "Professional Web Development",
                "",
                "",
                "#181b22",
                "#ffffff",
                "18",
                "8",
                "4",
                "100%",
                "auto",
                "none",
                "1",
                "#3f3f46",
                "4",
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
                "20",
                "12",
                "6",
                "100%",
                "auto",
                "solid",
                "1",
                "#2563eb",
                "8",
                "none",
                "center"
            );

            createElement(
                "paragraph",
                "Includes unlimited blocks and instant export.",
                "",
                "",
                "#181b22",
                "#94a3b8",
                "14",
                "8",
                "4",
                "100%",
                "auto",
                "none",
                "1",
                "#2d3748",
                "6",
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
                "14",
                "10",
                "6",
                "100%",
                "auto",
                "none",
                "1",
                "#3f3f46",
                "6",
                "none",
                "center"
            );

        }

        else if (type === "testimonial") {

            createElement(
                "paragraph",
                "This builder completely changed how fast I launch client sites!",
                "",
                "",
                "#252833",
                "#e2e8f0",
                "14",
                "14",
                "6",
                "100%",
                "auto",
                "dashed",
                "1",
                "#38bdf8",
                "8",
                "none",
                "left"
            );

            createElement(
                "heading",
                "- Alex Johnson, Developer",
                "",
                "",
                "#252833",
                "#38bdf8",
                "12",
                "6",
                "4",
                "100%",
                "auto",
                "none",
                "1",
                "#3f3f46",
                "4",
                "none",
                "left"
            );

        }

    }

    /*==================================================
    FEATURE: PROPERTY PANEL
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

    function syncPropsToForm() {

        if (!selectedElement)
            return;

        const computed =
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

            const img =
                selectedElement.querySelector(
                    "img"
                );

            imageInput.value =
                img ? img.src : "";

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
            computed.display === "flex"
                ? "flex"
                : computed.display === "grid"
                    ? "grid"
                    : "block";

        flexDirectionInput.value =
            computed.flexDirection ||
            "row";

        bgColorInput.value =
            rgbToHex(
                computed.backgroundColor
            );

        textColorInput.value =
            rgbToHex(
                computed.color
            );

        fontSizeInput.value =
            parseInt(
                computed.fontSize
            ) || 16;

        widthInput.value =
            computed.width;

        heightInput.value =
            computed.height;

        paddingInput.value =
            parseInt(
                computed.paddingTop
            ) || 12;

        marginInput.value =
            parseInt(
                computed.marginTop
            ) || 6;

        borderStyleInput.value =
            computed.borderTopStyle ||
            "none";

        borderWidthInput.value =
            parseInt(
                computed.borderTopWidth
            ) || 1;

        borderColorInput.value =
            rgbToHex(
                computed.borderTopColor
            );

        radiusInput.value =
            parseInt(
                computed.borderRadius
            ) || 6;

    }

    /*==================================================
    FEATURE: CONTENT EDITING
    ==================================================*/

    textInput?.addEventListener(
        "input",
        e => {

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
                    e.target.value;

                updateLayers();

            }

        }
    );

    /*==================================================
    FEATURE: IMAGE URL
    ==================================================*/

    imageInput?.addEventListener(
        "input",
        e => {

            if (
                !selectedElement ||
                selectedElement.getAttribute(
                    "data-type"
                ) !== "image"
            )
                return;

            const url =
                e.target.value.trim();

            selectedElement.innerHTML = "";

            if (url) {

                const img =
                    document.createElement(
                        "img"
                    );

                img.className =
                    "canvas-img-box";

                img.src = url;

                selectedElement.appendChild(
                    img
                );

            }
            else {

                const box =
                    document.createElement(
                        "div"
                    );

                box.className =
                    "empty-img-placeholder";

                box.innerHTML = `
                    <span>🖼 No Image Selected</span>
                    <small>Paste image URL</small>
                `;

                selectedElement.appendChild(
                    box
                );

            }

        }
    );

    /*==================================================
    FEATURE: VIDEO URL
    ==================================================*/

    videoInput?.addEventListener(
        "input",
        e => {

            if (
                !selectedElement ||
                selectedElement.getAttribute(
                    "data-type"
                ) !== "video"
            )
                return;

            const url =
                e.target.value.trim();

            selectedElement.innerHTML = "";

            if (!url)
                return;

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

            selectedElement.appendChild(
                iframe
            );

        }
    );

    /*==================================================
    FEATURE: STYLE CONTROLS
    ==================================================*/

    bgColorInput?.addEventListener(
        "input",
        e => {

            if (selectedElement)
                selectedElement.style.backgroundColor =
                    e.target.value;

        }
    );

    textColorInput?.addEventListener(
        "input",
        e => {

            if (selectedElement)
                selectedElement.style.color =
                    e.target.value;

        }
    );

    fontSizeInput?.addEventListener(
        "input",
        e => {

            if (selectedElement)
                selectedElement.style.fontSize =
                    e.target.value + "px";

        }
    );

    widthInput?.addEventListener(
        "input",
        e => {

            if (selectedElement)
                selectedElement.style.width =
                    e.target.value;

        }
    );

    heightInput?.addEventListener(
        "input",
        e => {

            if (selectedElement)
                selectedElement.style.height =
                    e.target.value;

        }
    );

    paddingInput?.addEventListener(
        "input",
        e => {

            if (selectedElement)
                selectedElement.style.padding =
                    e.target.value + "px";

        }
    );

    marginInput?.addEventListener(
        "input",
        e => {

            if (selectedElement)
                selectedElement.style.margin =
                    e.target.value + "px";

        }
    );

    borderStyleInput?.addEventListener(
        "change",
        e => {

            if (selectedElement)
                selectedElement.style.borderStyle =
                    e.target.value;

        }
    );

    borderWidthInput?.addEventListener(
        "input",
        e => {

            if (selectedElement)
                selectedElement.style.borderWidth =
                    e.target.value + "px";

        }
    );

    borderColorInput?.addEventListener(
        "input",
        e => {

            if (selectedElement)
                selectedElement.style.borderColor =
                    e.target.value;

        }
    );

    radiusInput?.addEventListener(
        "input",
        e => {

            if (selectedElement)
                selectedElement.style.borderRadius =
                    e.target.value + "px";

        }
    );

    displayModeInput?.addEventListener(
        "change",
        e => {

            if (!selectedElement)
                return;

            selectedElement.style.display =
                e.target.value;

        }
    );

    flexDirectionInput?.addEventListener(
        "change",
        e => {

            if (!selectedElement)
                return;

            selectedElement.style.flexDirection =
                e.target.value;

        }
    );

    gridColumnsInput?.addEventListener(
        "change",
        e => {

            if (!selectedElement)
                return;

            selectedElement.style.display =
                "grid";

            selectedElement.style.gridTemplateColumns =
                e.target.value;

        }
    );

    /*==================================================
    FEATURE: DELETE ELEMENT
    ==================================================*/

    document
        .getElementById("btn-delete-el")
        ?.addEventListener("click", () => {

            if (!selectedElement) {

                alert(
                    "Please select an element first!"
                );

                return;
            }

            selectedElement.remove();

            selectedElement = null;

            updateLayers();

            rightSidebar?.classList.add(
                "hidden"
            );

            saveState();

        });

    /*==================================================
    FEATURE: DUPLICATE ELEMENT
    ==================================================*/

    document
        .getElementById("btn-duplicate-el")
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
                    `el-${elementCounter}`;

                clone.classList.remove(
                    "selected"
                );

                clone.addEventListener(
                    "click",
                    e => {

                        e.stopPropagation();

                        selectElement(clone);

                    }
                );

                selectedElement.after(clone);

                updateLayers();

                selectElement(clone);

                saveState();

            }
        );

    /*==================================================
    FEATURE: DEVICE SWITCHER
    ==================================================*/

    ["desktop", "tablet", "mobile"]
        .forEach(mode => {

            document
                .getElementById(
                    `btn-${mode}`
                )
                ?.addEventListener(
                    "click",
                    e => {

                        document
                            .querySelectorAll(
                                ".device-switcher button"
                            )
                            .forEach(
                                b =>
                                    b.classList.remove(
                                        "active"
                                    )
                            );

                        e.currentTarget.classList.add(
                            "active"
                        );

                        canvas.className =
                            `mode-${mode}`;

                    }
                );

        });

    /*==================================================
    FEATURE: PREVIEW MODE
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

        document.body.classList.toggle(
            "preview-mode"
        );

        if (!previewBtn)
            return;

        previewBtn.textContent =
            document.body.classList.contains(
                "preview-mode"
            )
                ? "❌ Exit Preview"
                : "👁 Preview";

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
    FEATURE: BACK BUTTON
    ==================================================*/

    document
        .getElementById("btn-back")
        ?.addEventListener(
            "click",
            () => window.history.back()
        );

    /*==================================================
    FEATURE: CODE STUDIO CREATION
    ==================================================
    Important:
    HTML میں الگ coding boxes لکھنے کی ضرورت نہیں۔
    JavaScript خود Code Studio بنائے گا.
    ==================================================/

    createCodeStudio();

    /*==================================================
    FEATURE: CODE STUDIO
    ==================================================*

    function createCodeStudio() {

        if (document.getElementById(
            "smartbazaar-code-studio"
        ))
            return;

        const studio =
            document.createElement("section");

        studio.id =
            "smartbazaar-code-studio";

        studio.innerHTML = `

            <div class="code-studio-header">

                <div class="code-studio-title">
                    <span>💻</span>
                    SmartBazaar Code Studio
                </div>

                <div class="code-studio-actions">

                    <button
                        id="code-studio-run"
                        class="code-action-btn"
                    >
                        ▶ Run
                    </button>

                    <button
                        id="code-studio-save"
                        class="code-action-btn"
                    >
                        💾 Save
                    </button>

                    <button
                        id="code-studio-export"
                        class="code-action-btn primary"
                    >
                        ⬇ Export
                    </button>

                    <button
                        id="code-studio-close"
                        class="code-action-btn close"
                    >
                        ×
                    </button>

                </div>

            </div>

            <div class="code-studio-workspace">

                <div class="code-editor-panel">

                    <div class="code-tabs">

                        <button
                            class="code-tab active"
                            data-code-target="html"
                        >
                            HTML
                        </button>

                        <button
                            class="code-tab"
                            data-code-target="css"
                        >
                            CSS
                        </button>

                        <button
                            class="code-tab"
                            data-code-target="js"
                        >
                            JavaScript
                        </button>

                    </div>

                    <div
                        class="code-box active"
                        id="code-box-html"
                    >

                        <div class="code-box-title">
                            HTML
                        </div>

                        <textarea
                            id="smartbazaar-html-editor"
                            spellcheck="false"
                            placeholder="Write HTML code here..."
                        ></textarea>

                    </div>

                    <div
                        class="code-box"
                        id="code-box-css"
                    >

                        <div class="code-box-title">
                            CSS
                        </div>

                        <textarea
                            id="smartbazaar-css-editor"
                            spellcheck="false"
                            placeholder="Write CSS code here..."
                        ></textarea>

                    </div>

                    <div
                        class="code-box"
                        id="code-box-js"
                    >

                        <div class="code-box-title">
                            JavaScript
                        </div>

                        <textarea
                            id="smartbazaar-js-editor"
                            spellcheck="false"
                            placeholder="Write JavaScript code here..."
                        ></textarea>

                    </div>

                </div>

                <div class="code-preview-panel">

                    <div class="code-preview-header">

                        <span>
                            👁 Live Preview
                        </span>

                        <button
                            id="code-preview-maximize"
                            title="Maximize Preview"
                        >
                            ⛶
                        </button>

                    </div>

                    <iframe
                        id="smartbazaar-code-preview"
                        sandbox="allow-scripts allow-forms allow-modals"
                    ></iframe>

                </div>

            </div>

        `;

        document.body.appendChild(studio);

        injectCodeStudioStyles();

        setupCodeStudio();

    }

    /*==================================================
    FEATURE: CODE STUDIO LOGIC
    ==================================================*

    function setupCodeStudio() {

        const htmlEditor =
            document.getElementById(
                "smartbazaar-html-editor"
            );

        const cssEditor =
            document.getElementById(
                "smartbazaar-css-editor"
            );

        const jsEditor =
            document.getElementById(
                "smartbazaar-js-editor"
            );

        const preview =
            document.getElementById(
                "smartbazaar-code-preview"
            );

        htmlEditor.value =
            projectData.htmlCode;

        cssEditor.value =
            projectData.cssCode;

        jsEditor.value =
            projectData.jsCode;

        /*------------------------------------------
        FEATURE: CODE TABS
        ------------------------------------------*

        document
            .querySelectorAll(".code-tab")
            .forEach(tab => {

                tab.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".code-tab"
                            )
                            .forEach(t =>
                                t.classList.remove(
                                    "active"
                                )
                            );

                        document
                            .querySelectorAll(
                                ".code-box"
                            )
                            .forEach(box =>
                                box.classList.remove(
                                    "active"
                                )
                            );

                        tab.classList.add(
                            "active"
                        );

                        const target =
                            tab.getAttribute(
                                "data-code-target"
                            );

                        document
                            .getElementById(
                                `code-box-${target}`
                            )
                            ?.classList.add(
                                "active"
                            );

                    }
                );

            });

        /*------------------------------------------
        FEATURE: LIVE CODING
        ------------------------------------------*

        function updateCodePreview() {

            const html =
                htmlEditor.value;

            const css =
                cssEditor.value;

            const js =
                jsEditor.value;

            const completeDocument = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
>

<style>

${css}

</style>

</head>

<body>

${html}

<script>

${js}

<\/script>

</body>

</html>

            `;

            preview.srcdoc =
                completeDocument;

        }

        htmlEditor.addEventListener(
            "input",
            () => {

                projectData.htmlCode =
                    htmlEditor.value;

                updateCodePreview();

            }
        );

        cssEditor.addEventListener(
            "input",
            () => {

                projectData.cssCode =
                    cssEditor.value;

                updateCodePreview();

            }
        );

        jsEditor.addEventListener(
            "input",
            () => {

                projectData.jsCode =
                    jsEditor.value;

                updateCodePreview();

            }
        );

        /*------------------------------------------
        FEATURE: RUN BUTTON
        ------------------------------------------*

        document
            .getElementById(
                "code-studio-run"
            )
            ?.addEventListener(
                "click",
                updateCodePreview
            );

        /*------------------------------------------
        FEATURE: SAVE CODE
        ------------------------------------------*

        document
            .getElementById(
                "code-studio-save"
            )
            ?.addEventListener(
                "click",
                () => {

                    localStorage.setItem(
                        "smartbazaar_html_code",
                        htmlEditor.value
                    );

                    localStorage.setItem(
                        "smartbazaar_css_code",
                        cssEditor.value
                    );

                    localStorage.setItem(
                        "smartbazaar_js_code",
                        jsEditor.value
                    );

                    alert(
                        "Coding saved successfully!"
                    );

                }
            );

        /*------------------------------------------
        FEATURE: CLOSE CODE STUDIO
        ------------------------------------------*

        document
            .getElementById(
                "code-studio-close"
            )
            ?.addEventListener(
                "click",
                () => {

                    studioClose();

                }
            );

        /*------------------------------------------
        FEATURE: MAXIMIZE PREVIEW
        ------------------------------------------*

        document
            .getElementById(
                "code-preview-maximize"
            )
            ?.addEventListener(
                "click",
                () => {

                    document
                        .getElementById(
                            "smartbazaar-code-studio"
                        )
                        ?.classList.toggle(
                            "preview-maximized"
                        );

                }
            );

        updateCodePreview();

    }

    /*==================================================
    FEATURE: CODE STUDIO CLOSE
    ==================================================*

    function studioClose() {

        const studio =
            document.getElementById(
                "smartbazaar-code-studio"
            );

        if (studio) {

            studio.classList.remove(
                "studio-open"
            );

            studio.classList.add(
                "studio-closed"
            );

        }

    }

    /*==================================================
    FEATURE: OPEN CODE STUDIO BUTTON
    ==================================================*

    function createCodeStudioToggle() {

        if (
            document.getElementById(
                "open-code-studio-btn"
            )
        )
            return;

        const button =
            document.createElement("button");

        button.id =
            "open-code-studio-btn";

        button.innerHTML =
            "💻 Code";

        button.title =
            "Open HTML CSS JavaScript Editor";

        document.body.appendChild(button);

        button.addEventListener(
            "click",
            () => {

                const studio =
                    document.getElementById(
                        "smartbazaar-code-studio"
                    );

                studio?.classList.remove(
                    "studio-closed"
                );

                studio?.classList.add(
                    "studio-open"
                );

            }
        );

    }

    createCodeStudioToggle();

    /*==================================================
    FEATURE: EXPORT COMPLETE WEBSITE
    ==================================================*

    function exportCompleteWebsite() {

        const htmlEditor =
            document.getElementById(
                "smartbazaar-html-editor"
            );

        const cssEditor =
            document.getElementById(
                "smartbazaar-css-editor"
            );

        const jsEditor =
            document.getElementById(
                "smartbazaar-js-editor"
            );

        const title =
            projectTitleInput?.value ||
            "SmartBazaar Page";

        const finalHTML = `

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
>

<title>${escapeHTML(title)}</title>

<style>

${cssEditor?.value || ""}

</style>

</head>

<body>

${htmlEditor?.value || ""}

<script>

${jsEditor?.value || ""}

<\/script>

</body>

</html>

        `;

        const blob =
            new Blob(
                [finalHTML],
                {
                    type:
                        "text/html;charset=utf-8"
                }
            );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            `${sanitizeFilename(title)}.html`;

        document.body.appendChild(link);

        link.click();

        link.remove();

        setTimeout(
            () =>
                URL.revokeObjectURL(url),
            1000
        );

    }

    /*==================================================
    FEATURE: EXPORT BUTTONS
    ==================================================*

    document
        .getElementById(
            "btn-export"
        )
        ?.addEventListener(
            "click",
            exportCompleteWebsite
        );

    document
        .getElementById(
            "modal-btn-export"
        )
        ?.addEventListener(
            "click",
            exportCompleteWebsite
        );

    document
        .getElementById(
            "code-studio-export"
        )
        ?.addEventListener(
            "click",
            exportCompleteWebsite
        );

    /*==================================================
    FEATURE: SAVE MAIN BUILDER
    ==================================================*

    document
        .getElementById(
            "btn-save"
        )
        ?.addEventListener(
            "click",
            () => {

                localStorage.setItem(
                    "smartbazaar_page_content",
                    canvas?.innerHTML || ""
                );

                localStorage.setItem(
                    "smartbazaar_project_name",
                    projectTitleInput?.value ||
                    "My_Awesome_Page"
                );

                saveCodeData();

                alert(
                    "Project saved successfully!"
                );

            }
        );

    /*==================================================
    FEATURE: SAVE CODE DATA
    ==================================================*

    function saveCodeData() {

        const html =
            document.getElementById(
                "smartbazaar-html-editor"
            )?.value || "";

        const css =
            document.getElementById(
                "smartbazaar-css-editor"
            )?.value || "";

        const js =
            document.getElementById(
                "smartbazaar-js-editor"
            )?.value || "";

        localStorage.setItem(
            "smartbazaar_html_code",
            html
        );

        localStorage.setItem(
            "smartbazaar_css_code",
            css
        );

        localStorage.setItem(
            "smartbazaar_js_code",
            js
        );

    }

    /*==================================================
    FEATURE: SETTINGS MODAL
    ==================================================*

    const settingsModal =
        document.getElementById(
            "settings-modal"
        );

    const optionsModal =
        document.getElementById(
            "options-modal"
        );

    document
        .getElementById(
            "btn-settings"
        )
        ?.addEventListener(
            "click",
            () => {

                document.getElementById(
                    "modal-project-title"
                ).value =
                    projectTitleInput?.value || "";

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

                const title =
                    document.getElementById(
                        "modal-project-title"
                    ).value;

                if (projectTitleInput) {

                    projectTitleInput.value =
                        title;

                    localStorage.setItem(
                        "smartbazaar_project_name",
                        title
                    );

                }

                const bg =
                    document.getElementById(
                        "modal-canvas-bg"
                    ).value;

                if (canvas) {

                    canvas.style.backgroundColor =
                        bg;

                }

                settingsModal.style.display =
                    "none";

                saveState();

            }
        );

    /*==================================================
    FEATURE: OPTIONS MODAL
    ==================================================*

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
    FEATURE: CLEAR CANVAS
    ==================================================*

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
                )
                    return;

                canvas.innerHTML = `
                    <div class="placeholder-text">
                        Drag & drop blocks here
                    </div>
                `;

                updateLayers();

                optionsModal.style.display =
                    "none";

                saveState();

            }
        );

    /*==================================================
    FEATURE: CLICK CREATE BLOCKS
    ==================================================*

    document
        .querySelectorAll(
            ".draggable-item"
        )
        .forEach(item => {

            item.addEventListener(
                "click",
                () => {

                    const type =
                        item.getAttribute(
                            "data-type"
                        );

                    const placeholder =
                        canvas.querySelector(
                            ".placeholder-text"
                        );

                    if (placeholder)
                        placeholder.style.display =
                            "none";

                    createElementByType(type);

                    rightSidebar?.classList.remove(
                        "hidden"
                    );

                    saveState();

                }
            );

        });

    /*==================================================
    FEATURE: CLICK PATTERNS
    ==================================================*

    document
        .querySelectorAll(
            ".pattern-item"
        )
        .forEach(item => {

            item.addEventListener(
                "click",
                () => {

                    const placeholder =
                        canvas.querySelector(
                            ".placeholder-text"
                        );

                    if (placeholder)
                        placeholder.style.display =
                            "none";

                    createPattern(
                        item.getAttribute(
                            "data-pattern"
                        )
                    );

                    rightSidebar?.classList.remove(
                        "hidden"
                    );

                    saveState();

                }
            );

        });

    /*==================================================
    FEATURE: RGB TO HEX
    ==================================================*

    function rgbToHex(rgb) {

        if (
            !rgb ||
            rgb === "transparent" ||
            rgb === "rgba(0, 0, 0, 0)"
        )
            return "#27272a";

        if (rgb.startsWith("#"))
            return rgb;

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
                    x =>
                        (
                            "0" +
                            parseInt(x)
                                .toString(16)
                        ).slice(-2)
                )
                .join("")
        );

    }

    /*==================================================
    FEATURE: SAFE FILE NAME
    ==================================================*

    function sanitizeFilename(name) {

        return String(name)
            .replace(
                /[<>:"/\\|?*]+/g,
                "_"
            )
            .trim() ||
            "smartbazaar-page";

    }

    /*==================================================
    FEATURE: HTML ESCAPE
    ==================================================*

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }

    /*==================================================
    FEATURE: CODE STUDIO CSS
    ==================================================*

    function injectCodeStudioStyles() {

        if (
            document.getElementById(
                "smartbazaar-code-studio-style"
            )
        )
            return;

        const style =
            document.createElement("style");

        style.id =
            "smartbazaar-code-studio-style";

        style.textContent = `

/*========================================
FEATURE: CODE STUDIO CONTAINER
========================================*

#smartbazaar-code-studio{

    position:fixed;

    left:0;

    right:0;

    bottom:0;

    height:360px;

    background:#101217;

    border-top:1px solid #334155;

    z-index:9998;

    display:flex;

    flex-direction:column;

    box-shadow:0 -10px 30px rgba(0,0,0,.45);

    transition:
        height .3s ease,
        transform .3s ease;

}

#smartbazaar-code-studio.studio-closed{

    transform:translateY(calc(100% - 42px));

}

/*========================================
FEATURE: CODE STUDIO HEADER
========================================*

.code-studio-header{

    height:42px;

    min-height:42px;

    display:flex;

    align-items:center;

    justify-content:space-between;

    padding:0 10px;

    background:#181b22;

    border-bottom:1px solid #2d3748;

}

.code-studio-title{

    font-size:12px;

    font-weight:700;

    color:#e2e8f0;

    display:flex;

    align-items:center;

    gap:7px;

}

.code-studio-actions{

    display:flex;

    align-items:center;

    gap:5px;

}

.code-action-btn{

    background:#252833;

    color:#cbd5e1;

    border:1px solid #3f4654;

    border-radius:5px;

    padding:5px 9px;

    font-size:10px;

    cursor:pointer;

}

.code-action-btn:hover{

    border-color:#38bdf8;

    color:#38bdf8;

}

.code-action-btn.primary{

    background:#2563eb;

    color:#fff;

    border-color:#2563eb;

}

.code-action-btn.close{

    font-size:16px;

    line-height:12px;

}

/*========================================
FEATURE: CODE WORKSPACE
========================================*

.code-studio-workspace{

    flex:1;

    min-height:0;

    display:flex;

    gap:1px;

    background:#0b0d11;

}

.code-editor-panel{

    flex:1.2;

    min-width:0;

    display:flex;

    flex-direction:column;

    background:#111318;

}

.code-tabs{

    height:35px;

    min-height:35px;

    display:flex;

    background:#181b22;

    border-bottom:1px solid #2d3748;

}

.code-tab{

    border:none;

    background:transparent;

    color:#64748b;

    padding:0 15px;

    cursor:pointer;

    font-size:10px;

    font-weight:700;

}

.code-tab.active{

    color:#38bdf8;

    background:#252833;

    box-shadow:inset 0 -2px 0 #38bdf8;

}

.code-box{

    display:none;

    flex:1;

    min-height:0;

    position:relative;

}

.code-box.active{

    display:flex;

    flex-direction:column;

}

.code-box-title{

    padding:5px 8px;

    color:#64748b;

    font-size:9px;

    background:#14161b;

}

.code-box textarea{

    flex:1;

    width:100%;

    min-height:0;

    resize:none;

    border:none;

    outline:none;

    padding:12px;

    background:#0d0f14;

    color:#dbeafe;

    font-family:

        Consolas,

        "Courier New",

        monospace;

    font-size:12px;

    line-height:1.6;

    tab-size:2;

}

/*========================================
FEATURE: LIVE PREVIEW
========================================*

.code-preview-panel{

    flex:1;

    min-width:0;

    display:flex;

    flex-direction:column;

    background:#0b0d11;

}

.code-preview-header{

    height:35px;

    min-height:35px;

    padding:0 10px;

    display:flex;

    align-items:center;

    justify-content:space-between;

    color:#94a3b8;

    font-size:10px;

    background:#181b22;

    border-bottom:1px solid #2d3748;

}

.code-preview-header button{

    background:#252833;

    color:#cbd5e1;

    border:1px solid #3f4654;

    border-radius:4px;

    cursor:pointer;

    padding:3px 7px;

}

#smartbazaar-code-preview{

    width:100%;

    height:100%;

    border:none;

    background:#fff;

}

/*========================================
FEATURE: OPEN CODE BUTTON
========================================*

#open-code-studio-btn{

    position:fixed;

    right:18px;

    bottom:18px;

    z-index:10000;

    border:none;

    border-radius:9px;

    background:#2563eb;

    color:#fff;

    padding:10px 15px;

    font-size:11px;

    font-weight:700;

    cursor:pointer;

    box-shadow:0 5px 20px rgba(0,0,0,.4);

}

#open-code-studio-btn:hover{

    background:#3b82f6;

    transform:translateY(-1px);

}

/*========================================
FEATURE: MAXIMIZED PREVIEW
========================================*

#smartbazaar-code-studio.preview-maximized{

    height:80vh;

}

/*========================================
FEATURE: MOBILE
========================================*

@media(max-width:800px){

    #smartbazaar-code-studio{

        height:430px;

    }

    .code-studio-workspace{

        flex-direction:column;

    }

    .code-editor-panel{

        flex:1;

        min-height:180px;

    }

    .code-preview-panel{

        flex:1;

        min-height:160px;

    }

    .code-action-btn{

        padding:5px 7px;

    }

    .code-studio-title{

        font-size:10px;

    }

    #open-code-studio-btn{

        right:10px;

        bottom:10px;

    }

}

        `;

        document.head.appendChild(style);

    }==*/

    /*==================================================
SMARTBAZAAR PRO
FEATURE: CODE STUDIO
HTML + CSS + JAVASCRIPT
CONNECTED WITH MAIN CANVAS PREVIEW
==================================================*/

/*==================================================
FEATURE: CODE STUDIO CREATION
==================================================*/

createCodeStudio();

function createCodeStudio() {

    if (
        document.getElementById(
            "smartbazaar-code-studio"
        )
    ) {
        return;
    }

    const studio =
        document.createElement("section");

    studio.id =
        "smartbazaar-code-studio";

    studio.className =
        "studio-closed";

    studio.innerHTML = `

        <!--========================================
        CODE STUDIO HEADER
        ========================================-->

        <div class="code-studio-header">

            <div class="code-studio-title">

                <span>💻</span>

                <span>
                    SmartBazaar Code Studio
                </span>

            </div>


            <div class="code-studio-actions">

                <button
                    id="code-studio-run"
                    class="code-action-btn"
                    type="button"
                >
                    ▶ Run
                </button>


                <button
                    id="code-studio-save"
                    class="code-action-btn"
                    type="button"
                >
                    💾 Save
                </button>


                <button
                    id="code-studio-export"
                    class="code-action-btn primary"
                    type="button"
                >
                    ⬇ Export
                </button>


                <button
                    id="code-studio-close"
                    class="code-action-btn close"
                    type="button"
                >
                    ×
                </button>

            </div>

        </div>


        <!--========================================
        CODE EDITOR WORKSPACE
        NO SECOND PREVIEW
        ========================================-->

        <div class="code-studio-workspace">

            <div class="code-editor-panel">


                <!-- HTML -->

                <div
                    class="code-box active"
                    id="code-box-html"
                >

                    <div class="code-box-title">
                        HTML
                    </div>

                    <textarea
                        id="smartbazaar-html-editor"
                        spellcheck="false"
                        placeholder="Write HTML code here..."
                    ></textarea>

                </div>


                <!-- CSS -->

                <div
                    class="code-box"
                    id="code-box-css"
                >

                    <div class="code-box-title">
                        CSS
                    </div>

                    <textarea
                        id="smartbazaar-css-editor"
                        spellcheck="false"
                        placeholder="Write CSS code here..."
                    ></textarea>

                </div>


                <!-- JAVASCRIPT -->

                <div
                    class="code-box"
                    id="code-box-js"
                >

                    <div class="code-box-title">
                        JavaScript
                    </div>

                    <textarea
                        id="smartbazaar-js-editor"
                        spellcheck="false"
                        placeholder="Write JavaScript code here..."
                    ></textarea>

                </div>

            </div>

        </div>

    `;

    document.body.appendChild(studio);

    injectCodeStudioStyles();

    setupCodeStudio();

    createCodeStudioToggle();
}


/*==================================================
FEATURE: CODE STUDIO LOGIC
==================================================*/

function setupCodeStudio() {

    const htmlEditor =
        document.getElementById(
            "smartbazaar-html-editor"
        );

    const cssEditor =
        document.getElementById(
            "smartbazaar-css-editor"
        );

    const jsEditor =
        document.getElementById(
            "smartbazaar-js-editor"
        );

    if (
        !htmlEditor ||
        !cssEditor ||
        !jsEditor
    ) {
        return;
    }


    /*==============================================
    LOAD SAVED CODE
    ==============================================*/

    htmlEditor.value =
        projectData.htmlCode || "";

    cssEditor.value =
        projectData.cssCode || "";

    jsEditor.value =
        projectData.jsCode || "";


    /*==============================================
    CODE TABS
    ==============================================*/

    createCodeTabs();


    /*==============================================
    LIVE CODING
    ==============================================*/

    htmlEditor.addEventListener(
        "input",
        () => {

            projectData.htmlCode =
                htmlEditor.value;

            updateCanvasFromCode();

        }
    );


    cssEditor.addEventListener(
        "input",
        () => {

            projectData.cssCode =
                cssEditor.value;

            updateCanvasFromCode();

        }
    );


    jsEditor.addEventListener(
        "input",
        () => {

            projectData.jsCode =
                jsEditor.value;

            updateCanvasFromCode();

        }
    );


    /*==============================================
    RUN BUTTON
    ==============================================*/

    document
        .getElementById(
            "code-studio-run"
        )
        ?.addEventListener(
            "click",
            () => {

                updateCanvasFromCode();

            }
        );


    /*==============================================
    SAVE BUTTON
    ==============================================*/

    document
        .getElementById(
            "code-studio-save"
        )
        ?.addEventListener(
            "click",
            () => {

                saveCodeData();

                alert(
                    "Coding saved successfully!"
                );

            }
        );


    /*==============================================
    CLOSE BUTTON
    ==============================================*/

    document
        .getElementById(
            "code-studio-close"
        )
        ?.addEventListener(
            "click",
            () => {

                closeCodeStudio();

            }
        );


    /*==============================================
    EXPORT BUTTON
    ==============================================*/

    document
        .getElementById(
            "code-studio-export"
        )
        ?.addEventListener(
            "click",
            () => {

                exportCompleteWebsite();

            }
        );


    /*==============================================
    INITIAL CODE PREVIEW
    ==============================================*/

    if (
        htmlEditor.value.trim() ||
        cssEditor.value.trim() ||
        jsEditor.value.trim()
    ) {

        updateCanvasFromCode();

    }

}


/*==================================================
FEATURE: CODE TABS
==================================================*/

function createCodeTabs() {

    const panel =
        document.querySelector(
            ".code-editor-panel"
        );

    if (!panel) {
        return;
    }


    const oldTabs =
        panel.querySelector(
            ".code-tabs"
        );

    if (oldTabs) {
        oldTabs.remove();
    }


    const tabs =
        document.createElement(
            "div"
        );

    tabs.className =
        "code-tabs";

    tabs.innerHTML = `

        <button
            class="code-tab active"
            type="button"
            data-code-target="html"
        >
            HTML
        </button>

        <button
            class="code-tab"
            type="button"
            data-code-target="css"
        >
            CSS
        </button>

        <button
            class="code-tab"
            type="button"
            data-code-target="js"
        >
            JavaScript
        </button>

    `;


    panel.insertBefore(
        tabs,
        panel.firstChild
    );


    tabs
        .querySelectorAll(
            ".code-tab"
        )
        .forEach(
            tab => {

                tab.addEventListener(
                    "click",
                    () => {

                        tabs
                            .querySelectorAll(
                                ".code-tab"
                            )
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        "active"
                                    )
                            );


                        document
                            .querySelectorAll(
                                "#smartbazaar-code-studio .code-box"
                            )
                            .forEach(
                                box =>
                                    box.classList.remove(
                                        "active"
                                    )
                            );


                        tab.classList.add(
                            "active"
                        );


                        const target =
                            tab.getAttribute(
                                "data-code-target"
                            );


                        document
                            .getElementById(
                                `code-box-${target}`
                            )
                            ?.classList.add(
                                "active"
                            );

                    }
                );

            }
        );

}


/*==================================================
FEATURE: HTML CSS JS → MAIN CANVAS
==================================================*/

function updateCanvasFromCode() {

    const canvas =
        document.getElementById(
            "live-canvas"
        );

    const htmlEditor =
        document.getElementById(
            "smartbazaar-html-editor"
        );

    const cssEditor =
        document.getElementById(
            "smartbazaar-css-editor"
        );

    const jsEditor =
        document.getElementById(
            "smartbazaar-js-editor"
        );


    if (
        !canvas ||
        !htmlEditor ||
        !cssEditor ||
        !jsEditor
    ) {
        return;
    }


    const html =
        htmlEditor.value;

    const css =
        cssEditor.value;

    const js =
        jsEditor.value;


    /*==============================================
    SAVE CURRENT CODE
    ==============================================*/

    projectData.htmlCode =
        html;

    projectData.cssCode =
        css;

    projectData.jsCode =
        js;


    /*==============================================
    REMOVE PREVIOUS CODE STYLE
    ==============================================*/

    document
        .getElementById(
            "smartbazaar-code-live-style"
        )
        ?.remove();


    /*==============================================
    REMOVE PREVIOUS CODE CONTENT
    ==============================================*/

    const oldCodeContent =
        canvas.querySelector(
            ".smartbazaar-code-content"
        );

    if (oldCodeContent) {

        oldCodeContent.remove();

    }


    /*==============================================
    IF HTML IS EMPTY
    KEEP NORMAL BUILDER CANVAS
    ==============================================*/

    if (!html.trim()) {

        return;

    }


    /*==============================================
    CREATE CODE CONTENT INSIDE
    THE SAME MAIN CANVAS
    ==============================================*/

    const codeContent =
        document.createElement(
            "div"
        );

    codeContent.className =
        "smartbazaar-code-content";

    codeContent.innerHTML =
        html;


    canvas.appendChild(
        codeContent
    );


    /*==============================================
    APPLY CSS TO MAIN PAGE
    ==============================================*/

    if (css.trim()) {

        const style =
            document.createElement(
                "style"
            );

        style.id =
            "smartbazaar-code-live-style";

        style.textContent =
            css;

        document.head.appendChild(
            style
        );

    }


    /*==============================================
    RUN JAVASCRIPT
    ==============================================*/

    if (js.trim()) {

        setTimeout(
            () => {

                try {

                    const runCode =
                        new Function(
                            "canvas",
                            js
                        );

                    runCode(
                        codeContent
                    );

                }
                catch (error) {

                    console.error(
                        "SmartBazaar Code Error:",
                        error
                    );

                }

            },
            0
        );

    }

}


/*==================================================
FEATURE: OPEN CODE STUDIO BUTTON
==================================================*/

function createCodeStudioToggle() {

    if (
        document.getElementById(
            "open-code-studio-btn"
        )
    ) {
        return;
    }


    const button =
        document.createElement(
            "button"
        );

    button.id =
        "open-code-studio-btn";

    button.type =
        "button";

    button.innerHTML =
        "💻 Code";

    button.title =
        "Open HTML CSS JavaScript Editor";


    document.body.appendChild(
        button
    );


    button.addEventListener(
        "click",
        () => {

            const studio =
                document.getElementById(
                    "smartbazaar-code-studio"
                );

            if (!studio) {
                return;
            }


            studio.classList.remove(
                "studio-closed"
            );

            studio.classList.add(
                "studio-open"
            );

        }
    );

}


/*==================================================
FEATURE: CLOSE CODE STUDIO
==================================================*/

function closeCodeStudio() {

    const studio =
        document.getElementById(
            "smartbazaar-code-studio"
        );

    if (!studio) {
        return;
    }


    studio.classList.remove(
        "studio-open"
    );

    studio.classList.add(
        "studio-closed"
    );

}


/*==================================================
FEATURE: SAVE CODE DATA
==================================================*/

function saveCodeData() {

    const html =
        document.getElementById(
            "smartbazaar-html-editor"
        )?.value || "";


    const css =
        document.getElementById(
            "smartbazaar-css-editor"
        )?.value || "";


    const js =
        document.getElementById(
            "smartbazaar-js-editor"
        )?.value || "";


    projectData.htmlCode =
        html;

    projectData.cssCode =
        css;

    projectData.jsCode =
        js;


    localStorage.setItem(
        "smartbazaar_html_code",
        html
    );


    localStorage.setItem(
        "smartbazaar_css_code",
        css
    );


    localStorage.setItem(
        "smartbazaar_js_code",
        js
    );

}


/*==================================================
FEATURE: EXPORT COMPLETE WEBSITE
==================================================*/

function exportCompleteWebsite() {

    const html =
        document.getElementById(
            "smartbazaar-html-editor"
        )?.value || "";


    const css =
        document.getElementById(
            "smartbazaar-css-editor"
        )?.value || "";


    const js =
        document.getElementById(
            "smartbazaar-js-editor"
        )?.value || "";


    const title =
        document.getElementById(
            "project-title-input"
        )?.value ||
        "SmartBazaar Website";


    const finalHTML = `<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>${escapeHTML(title)}</title>

<style>

${css}

</style>

</head>

<body>

${html}

<script>

${js}

<\/script>

</body>

</html>`;


    const blob =
        new Blob(
            [finalHTML],
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
        `${sanitizeFilename(title)}.html`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    setTimeout(
        () => {

            URL.revokeObjectURL(
                url
            );

        },
        1000
    );

}


/*==================================================
FEATURE: CODE STUDIO CSS
==================================================*/

function injectCodeStudioStyles() {

    if (
        document.getElementById(
            "smartbazaar-code-studio-style"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "smartbazaar-code-studio-style";


    style.textContent = `

/*========================================
CODE STUDIO
========================================*/

#smartbazaar-code-studio{

    position:fixed;

    left:0;

    right:0;

    bottom:0;

    height:340px;

    background:#101217;

    border-top:1px solid #334155;

    z-index:9998;

    display:flex;

    flex-direction:column;

    box-shadow:
        0 -10px 30px rgba(0,0,0,.45);

    transition:
        transform .3s ease;

}


/*========================================
CLOSED
========================================*/

#smartbazaar-code-studio.studio-closed{

    transform:
        translateY(calc(100% - 42px));

}


/*========================================
HEADER
========================================*/

.code-studio-header{

    height:42px;

    min-height:42px;

    display:flex;

    align-items:center;

    justify-content:space-between;

    padding:0 10px;

    background:#181b22;

    border-bottom:
        1px solid #2d3748;

}


.code-studio-title{

    display:flex;

    align-items:center;

    gap:7px;

    color:#e2e8f0;

    font-size:12px;

    font-weight:700;

}


.code-studio-actions{

    display:flex;

    align-items:center;

    gap:5px;

}


.code-action-btn{

    background:#252833;

    color:#cbd5e1;

    border:
        1px solid #3f4654;

    border-radius:5px;

    padding:5px 9px;

    font-size:10px;

    cursor:pointer;

}


.code-action-btn:hover{

    border-color:#38bdf8;

    color:#38bdf8;

}


.code-action-btn.primary{

    background:#2563eb;

    color:#fff;

    border-color:#2563eb;

}


.code-action-btn.close{

    font-size:16px;

}


/*========================================
WORKSPACE
========================================*/

.code-studio-workspace{

    flex:1;

    min-height:0;

    display:flex;

    background:#0b0d11;

}


.code-editor-panel{

    width:100%;

    height:100%;

    display:flex;

    flex-direction:column;

    background:#111318;

}


/*========================================
CODE TABS
========================================*/

.code-tabs{

    height:35px;

    min-height:35px;

    display:flex;

    background:#181b22;

    border-bottom:
        1px solid #2d3748;

}


.code-tab{

    border:none;

    background:transparent;

    color:#64748b;

    padding:
        0 18px;

    cursor:pointer;

    font-size:10px;

    font-weight:700;

}


.code-tab.active{

    color:#38bdf8;

    background:#252833;

    box-shadow:
        inset 0 -2px 0 #38bdf8;

}


/*========================================
CODE BOX
========================================*/

.code-box{

    display:none;

    flex:1;

    min-height:0;

    flex-direction:column;

}


.code-box.active{

    display:flex;

}


.code-box-title{

    padding:5px 8px;

    color:#64748b;

    font-size:9px;

    background:#14161b;

}


.code-box textarea{

    flex:1;

    width:100%;

    min-height:0;

    resize:none;

    border:none;

    outline:none;

    box-sizing:border-box;

    padding:12px;

    background:#0d0f14;

    color:#dbeafe;

    font-family:
        Consolas,
        "Courier New",
        monospace;

    font-size:12px;

    line-height:1.6;

    tab-size:2;

}


/*========================================
CODE CONTENT INSIDE MAIN CANVAS
========================================*/

.smartbazaar-code-content{

    width:100%;

    min-height:100%;

    box-sizing:border-box;

}


/*========================================
CODE BUTTON
========================================*/

#open-code-studio-btn{

    position:fixed;

    right:18px;

    bottom:18px;

    z-index:10000;

    border:none;

    border-radius:9px;

    background:#2563eb;

    color:#fff;

    padding:10px 15px;

    font-size:11px;

    font-weight:700;

    cursor:pointer;

    box-shadow:
        0 5px 20px rgba(0,0,0,.4);

}


#open-code-studio-btn:hover{

    background:#3b82f6;

    transform:
        translateY(-1px);

}


/*========================================
MOBILE
========================================*/

@media(max-width:800px){

    #smartbazaar-code-studio{

        height:430px;

    }


    .code-studio-title{

        font-size:10px;

    }


    .code-action-btn{

        padding:
            5px 7px;

    }


    #open-code-studio-btn{

        right:10px;

        bottom:10px;

    }

}

    `;


    document.head.appendChild(
        style
    );

}


/*==================================================
FEATURE: INITIALIZE CODE STUDIO
==================================================*/

createCodeStudioToggle();

    /*==================================================
    FEATURE: INITIAL STATE
    ==================================================*/

    if (canvas) {

        const existing =
            canvas.querySelectorAll(
                ".canvas-element"
            );

        if (existing.length > 0) {

            existing.forEach(el => {

                const number =
                    parseInt(
                        el.id?.replace(
                            "el-",
                            ""
                        )
                    );

                if (!isNaN(number)) {

                    elementCounter =
                        Math.max(
                            elementCounter,
                            number
                        );

                }

            });

        }

    }

    saveState();

});
