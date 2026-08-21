/*==================================================
SMARTBAZAAR PRO
WEBSITE BUILDER EDITOR
COMPLETE JAVASCRIPT
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*==================================================
    FEATURE: EDITOR INITIALIZATION
    ==================================================*/

    const canvas = document.getElementById("live-canvas");
    const leftSidebar = document.getElementById("left-sidebar");
    const rightSidebar = document.getElementById("right-sidebar");
    const layersTreeView = document.getElementById("layers-tree-view");
    const projectTitleInput = document.getElementById("project-title-input");

    if (!canvas) {
        console.error("SmartBazaar Pro: #live-canvas not found.");
        return;
    }

    let selectedElement = null;
    let elementCounter = 0;

    let historyStack = [];
    let historyIndex = -1;

    let draggedType = null;
    let draggedPattern = null;

    /*==================================================
    FEATURE: CODING PANEL
    HTML / CSS / JAVASCRIPT LIVE EDITOR
    ==================================================*/

    let codingPanel = null;
    let htmlCodeBox = null;
    let cssCodeBox = null;
    let jsCodeBox = null;
    let codingToggleButton = null;
    let codingPreviewFrame = null;

    function createCodingSystem() {

        if (document.getElementById("sb-coding-panel")) {
            codingPanel = document.getElementById("sb-coding-panel");
            return;
        }

        codingPanel = document.createElement("section");
        codingPanel.id = "sb-coding-panel";

        codingPanel.innerHTML = `
            <div class="sb-coding-header">

                <div class="sb-coding-title">
                    <span>💻</span>
                    <strong>Live Code Editor</strong>
                </div>

                <div class="sb-coding-actions">
                    <button id="sb-run-code">▶ Run</button>
                    <button id="sb-copy-code">📋 Copy</button>
                    <button id="sb-close-code">×</button>
                </div>

            </div>

            <div class="sb-code-editors">

                <div class="sb-code-box">
                    <div class="sb-code-label html-label">
                        <span>HTML</span>
                    </div>
                    <textarea
                        id="sb-html-code"
                        spellcheck="false"
                        placeholder="Write HTML here..."
                    ></textarea>
                </div>

                <div class="sb-code-box">
                    <div class="sb-code-label css-label">
                        <span>CSS</span>
                    </div>
                    <textarea
                        id="sb-css-code"
                        spellcheck="false"
                        placeholder="Write CSS here..."
                    ></textarea>
                </div>

                <div class="sb-code-box">
                    <div class="sb-code-label js-label">
                        <span>JavaScript</span>
                    </div>
                    <textarea
                        id="sb-js-code"
                        spellcheck="false"
                        placeholder="Write JavaScript here..."
                    ></textarea>
                </div>

            </div>

            <div class="sb-code-preview-area">

                <div class="sb-preview-title">
                    <span>👁 Live Coding Preview</span>
                    <span id="sb-preview-status">Ready</span>
                </div>

                <iframe
                    id="sb-coding-preview"
                    sandbox="allow-scripts allow-forms allow-modals"
                ></iframe>

            </div>
        `;

        /*
        FEATURE: CODING PANEL LOCATION

        Coding system is placed INSIDE the existing canvas container.
        It does NOT create a second main preview system.
        */

        const canvasContainer = document.getElementById("canvas-container");

        if (canvasContainer) {
            canvasContainer.appendChild(codingPanel);
        }

        htmlCodeBox = document.getElementById("sb-html-code");
        cssCodeBox = document.getElementById("sb-css-code");
        jsCodeBox = document.getElementById("sb-js-code");
        codingPreviewFrame = document.getElementById("sb-coding-preview");

        addCodingStyles();

        bindCodingEvents();

        /*
        Initially hidden.
        It will appear when Coding button is pressed.
        */

        codingPanel.style.display = "none";
    }

    /*==================================================
    FEATURE: CODING PANEL CSS
    ==================================================*/

    function addCodingStyles() {

        if (document.getElementById("sb-coding-styles")) {
            return;
        }

        const style = document.createElement("style");

        style.id = "sb-coding-styles";

        style.textContent = `

        #canvas-container{
            position:relative;
            flex:1;
            min-width:0;
            min-height:0;
        }

        #sb-coding-panel{
            position:absolute;
            inset:10px;
            z-index:500;
            background:#101217;
            border:1px solid #303746;
            border-radius:12px;
            display:none;
            flex-direction:column;
            overflow:hidden;
            box-shadow:0 15px 40px rgba(0,0,0,.55);
        }

        .sb-coding-header{
            min-height:48px;
            display:flex;
            justify-content:space-between;
            align-items:center;
            padding:8px 12px;
            background:#181b22;
            border-bottom:1px solid #303746;
        }

        .sb-coding-title{
            display:flex;
            align-items:center;
            gap:8px;
            color:#e5e7eb;
            font-size:13px;
        }

        .sb-coding-actions{
            display:flex;
            gap:6px;
        }

        .sb-coding-actions button{
            border:1px solid #374151;
            background:#20242d;
            color:#e5e7eb;
            padding:6px 10px;
            border-radius:6px;
            cursor:pointer;
            font-size:11px;
        }

        .sb-coding-actions button:hover{
            background:#2d3440;
            border-color:#38bdf8;
        }

        .sb-code-editors{
            flex:0 0 42%;
            min-height:180px;
            display:grid;
            grid-template-columns:repeat(3,1fr);
            gap:6px;
            padding:7px;
            background:#0c0e12;
        }

        .sb-code-box{
            min-width:0;
            display:flex;
            flex-direction:column;
            border:1px solid #303746;
            border-radius:7px;
            overflow:hidden;
            background:#11141a;
        }

        .sb-code-label{
            height:30px;
            display:flex;
            align-items:center;
            padding:0 9px;
            font-size:10px;
            font-weight:bold;
            color:#fff;
            background:#1c2028;
            border-bottom:1px solid #303746;
        }

        .html-label{
            border-left:3px solid #f97316;
        }

        .css-label{
            border-left:3px solid #38bdf8;
        }

        .js-label{
            border-left:3px solid #facc15;
        }

        .sb-code-box textarea{
            flex:1;
            width:100%;
            min-height:120px;
            resize:none;
            outline:none;
            border:none;
            padding:10px;
            background:#0b0d11;
            color:#e5e7eb;
            font-family:Consolas,Monaco,monospace;
            font-size:12px;
            line-height:1.5;
        }

        #sb-html-code{
            color:#fb923c;
        }

        #sb-css-code{
            color:#38bdf8;
        }

        #sb-js-code{
            color:#facc15;
        }

        .sb-code-preview-area{
            flex:1;
            min-height:180px;
            display:flex;
            flex-direction:column;
            background:#080a0e;
        }

        .sb-preview-title{
            height:34px;
            flex-shrink:0;
            display:flex;
            justify-content:space-between;
            align-items:center;
            padding:0 10px;
            color:#cbd5e1;
            font-size:10px;
            background:#181b22;
            border-top:1px solid #303746;
            border-bottom:1px solid #303746;
        }

        #sb-preview-status{
            color:#4ade80;
        }

        #sb-coding-preview{
            flex:1;
            width:100%;
            min-height:150px;
            border:none;
            background:#fff;
        }

        #btn-code-editor{
            background:#27272a !important;
            color:#38bdf8 !important;
            border-color:#38bdf8 !important;
        }

        #btn-code-editor.active{
            background:#2563eb !important;
            color:#fff !important;
        }

        @media(max-width:800px){

            .sb-code-editors{
                grid-template-columns:1fr;
                flex:0 0 48%;
                overflow-y:auto;
            }

            .sb-code-box{
                min-height:130px;
            }

            .sb-coding-panel{
                inset:5px;
            }

            .sb-coding-actions button{
                padding:5px 7px;
            }
        }

        @media(max-width:500px){

            .sb-coding-header{
                padding:6px;
            }

            .sb-coding-title strong{
                font-size:11px;
            }

            .sb-code-editors{
                flex:0 0 45%;
            }

            .sb-code-box textarea{
                font-size:11px;
            }

        }

        `;

        document.head.appendChild(style);
    }

    /*==================================================
    FEATURE: CODING BUTTON
    ==================================================*/

    function createCodingButton() {

        if (document.getElementById("btn-code-editor")) {
            codingToggleButton = document.getElementById("btn-code-editor");
            return;
        }

        codingToggleButton = document.createElement("button");

        codingToggleButton.id = "btn-code-editor";
        codingToggleButton.className = "toolbar-btn";
        codingToggleButton.title = "Live Code Editor";
        codingToggleButton.innerHTML = "💻";

        const settingsButton = document.getElementById("btn-settings");

        if (settingsButton && settingsButton.parentElement) {
            settingsButton.parentElement.insertBefore(
                codingToggleButton,
                settingsButton
            );
        }

        codingToggleButton.addEventListener("click", () => {

            if (!codingPanel) return;

            const isOpen =
                codingPanel.style.display === "flex";

            if (isOpen) {

                codingPanel.style.display = "none";
                codingToggleButton.classList.remove("active");

            } else {

                codingPanel.style.display = "flex";
                codingToggleButton.classList.add("active");

                syncCanvasToCode();

            }

        });
    }

    /*==================================================
    FEATURE: CODING EVENTS
    ==================================================*/

    function bindCodingEvents() {

        if (!htmlCodeBox) return;

        htmlCodeBox.addEventListener("input", () => {
            runLiveCode();
        });

        cssCodeBox.addEventListener("input", () => {
            runLiveCode();
        });

        jsCodeBox.addEventListener("input", () => {
            runLiveCode();
        });

        document
            .getElementById("sb-run-code")
            ?.addEventListener("click", runLiveCode);

        document
            .getElementById("sb-close-code")
            ?.addEventListener("click", () => {

                codingPanel.style.display = "none";

                if (codingToggleButton) {
                    codingToggleButton.classList.remove("active");
                }

            });

        document
            .getElementById("sb-copy-code")
            ?.addEventListener("click", copyAllCode);
    }

    /*==================================================
    FEATURE: LIVE CODE EXECUTION
    ==================================================*/

    function runLiveCode() {

        if (!codingPreviewFrame) return;

        const html = htmlCodeBox.value || "";
        const css = cssCodeBox.value || "";
        const js = jsCodeBox.value || "";

        const finalDocument = `
<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width,initial-scale=1.0">

<style>

${css}

</style>

</head>

<body>

${html}

<script>

try{

${js}

}catch(error){

console.error(error);

}

<\/script>

</body>
</html>
        `;

        codingPreviewFrame.srcdoc = finalDocument;

        const status =
            document.getElementById("sb-preview-status");

        if (status) {
            status.textContent = "● Live";
            status.style.color = "#4ade80";
        }
    }

    /*==================================================
    FEATURE: CANVAS → CODE
    ==================================================*/

    function syncCanvasToCode() {

        if (!htmlCodeBox) return;

        const elements =
            canvas.querySelectorAll(".canvas-element");

        let html = "";

        elements.forEach(el => {

            const clone = el.cloneNode(true);

            clone.classList.remove("selected");

            html += clone.outerHTML + "\n";

        });

        htmlCodeBox.value = html;

        /*
        Existing inline styles already contain
        the visual CSS created by Drag & Drop.
        */

        cssCodeBox.value = `/* SmartBazaar Pro Generated CSS */

.canvas-element{
    box-sizing:border-box;
}

.canvas-img-box{
    max-width:100%;
    display:block;
}

.canvas-video-box{
    max-width:100%;
}
`;

        runLiveCode();
    }

    /*==================================================
    FEATURE: CODE → CANVAS
    ==================================================*/

    function applyCodeToCanvas() {

        if (!htmlCodeBox) return;

        const html = htmlCodeBox.value.trim();

        if (!html) return;

        canvas.innerHTML = "";

        const wrapper = document.createElement("div");

        wrapper.innerHTML = html;

        while (wrapper.firstChild) {

            canvas.appendChild(
                wrapper.firstChild
            );

        }

        bindCanvasElements();

        updateLayers();

        saveState();
    }

    /*==================================================
    FEATURE: COPY CODE
    ==================================================*/

    function copyAllCode() {

        const combinedCode = `

<!-- HTML -->

${htmlCodeBox.value}

<style>

/* CSS */

${cssCodeBox.value}

</style>

<script>

/* JavaScript */

${jsCodeBox.value}

<\/script>

`;

        navigator.clipboard
            ?.writeText(combinedCode)
            .then(() => {

                const btn =
                    document.getElementById("sb-copy-code");

                if (btn) {

                    const oldText = btn.textContent;

                    btn.textContent = "✓ Copied";

                    setTimeout(() => {
                        btn.textContent = oldText;
                    }, 1500);

                }

            })
            .catch(() => {

                alert("Copy failed. Please copy manually.");

            });
    }

    /*==================================================
    FEATURE: HISTORY SYSTEM
    ==================================================*/

    function saveState() {

        if (historyIndex < historyStack.length - 1) {

            historyStack =
                historyStack.slice(
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

        canvas.innerHTML = html;

        bindCanvasElements();

        updateLayers();

        selectedElement = null;
    }

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
    FEATURE: SIDEBAR CONTROL
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

    document
        .getElementById("btn-add-block")
        ?.addEventListener("click", () => {

            leftSidebar?.classList.toggle("hidden");

        });

    /*==================================================
    FEATURE: TAB SYSTEM
    ==================================================*/

    document
        .querySelectorAll(".sidebar")
        .forEach(sidebar => {

            const buttons =
                sidebar.querySelectorAll(".sub-tab-btn");

            buttons.forEach(button => {

                button.addEventListener("click", () => {

                    buttons.forEach(b =>
                        b.classList.remove("active")
                    );

                    button.classList.add("active");

                    const target =
                        button.getAttribute("data-target");

                    sidebar
                        .querySelectorAll(".tab-pane")
                        .forEach(pane =>
                            pane.classList.remove("active")
                        );

                    sidebar
                        .querySelector(`#${target}`)
                        ?.classList.add("active");

                });

            });

        });

    /*==================================================
    FEATURE: ACCORDION
    ==================================================*/

    document
        .querySelectorAll(".accordion-header")
        .forEach(header => {

            header.addEventListener("click", () => {

                header
                    .parentElement
                    .classList
                    .toggle("open");

            });

        });

    /*==================================================
    FEATURE: DRAG & DROP
    ==================================================*/

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

    canvas.addEventListener(
        "dragover",
        e => {

            e.preventDefault();

            canvas.classList.add("drag-over");

        }
    );

    canvas.addEventListener(
        "dragleave",
        () => {

            canvas.classList.remove(
                "drag-over"
            );

        }
    );

    canvas.addEventListener(
        "drop",
        e => {

            e.preventDefault();

            canvas.classList.remove(
                "drag-over"
            );

            const placeholder =
                canvas.querySelector(
                    ".placeholder-text"
                );

            if (placeholder) {
                placeholder.style.display = "none";
            }

            if (draggedPattern) {

                createPattern(
                    draggedPattern
                );

                draggedPattern = null;

            } else if (draggedType) {

                createElementByType(
                    draggedType
                );

                draggedType = null;

            }

            rightSidebar?.classList.remove(
                "hidden"
            );

            saveState();

            syncCanvasToCode();

        }
    );

    /*==================================================
    FEATURE: CLICK TO CREATE
    ==================================================*/

    document
        .querySelectorAll(".draggable-item")
        .forEach(item => {

            item.addEventListener("click", () => {

                const type =
                    item.getAttribute("data-type");

                hidePlaceholder();

                createElementByType(type);

                rightSidebar?.classList.remove(
                    "hidden"
                );

                saveState();

                syncCanvasToCode();

            });

        });

    document
        .querySelectorAll(".pattern-item")
        .forEach(item => {

            item.addEventListener("click", () => {

                const pattern =
                    item.getAttribute("data-pattern");

                hidePlaceholder();

                createPattern(pattern);

                rightSidebar?.classList.remove(
                    "hidden"
                );

                saveState();

                syncCanvasToCode();

            });

        });

    function hidePlaceholder() {

        const ph =
            canvas.querySelector(
                ".placeholder-text"
            );

        if (ph) {
            ph.style.display = "none";
        }
    }

    /*==================================================
    FEATURE: ELEMENT CREATION
    ==================================================*/

    function createElementByType(type) {

        if (type === "heading") {

            createElement(
                "heading",
                "Sample Heading",
                "",
                "",
                "#27272a",
                "#ffffff",
                "26",
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

        else if (type === "paragraph") {

            createElement(
                "paragraph",
                "Sample paragraph text",
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

        else if (type === "button") {

            createElement(
                "button",
                "Click Me",
                "",
                "",
                "#2563eb",
                "#ffffff",
                "14",
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

        else if (type === "image") {

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
                "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
                `Sample ${String(type).toUpperCase()} Box`
            );

        }

    }

    /*==================================================
    FEATURE: CREATE ELEMENT
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

        if (type === "image") {

            const placeholderBox =
                document.createElement("div");

            placeholderBox.className =
                "empty-img-placeholder";

            placeholderBox.innerHTML =
                `<span>🖼 No Image Selected</span>
                 <small>Paste image URL in right panel</small>`;

            el.appendChild(
                placeholderBox
            );

        }

        else if (type === "video") {

            const iframe =
                document.createElement("iframe");

            iframe.className =
                "canvas-video-box";

            iframe.src = text;

            iframe.setAttribute(
                "allowfullscreen",
                ""
            );

            el.appendChild(iframe);

        }

        else if (type === "button") {

            const button =
                document.createElement("button");

            button.type = "button";

            button.textContent =
                text;

            button.style.background =
                "transparent";

            button.style.border =
                "none";

            button.style.color =
                "inherit";

            button.style.fontSize =
                "inherit";

            button.style.cursor =
                "pointer";

            el.appendChild(button);

        }

        else {

            el.textContent = text;

        }

        applyStyles(
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

        return el;
    }

    /*==================================================
    FEATURE: APPLY STYLES
    ==================================================*/

    function applyStyles(el, styles) {

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

        if (
            styles.displayMode === "flex"
        ) {

            el.style.flexDirection =
                styles.flexDir;

        }

        if (
            styles.displayMode === "grid"
        ) {

            el.style.gridTemplateColumns =
                "1fr 1fr";

            el.style.gap =
                "10px";

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

        else if (type === "image-box") {

            createElement(
                "image"
            );

            createElement(
                "heading",
                "Professional Web Development"
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
                "Unlimited blocks and instant export."
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
                `"This builder completely changed how fast I launch client sites!"`
            );

            createElement(
                "heading",
                "- Alex Johnson, Developer"
            );

        }

    }

    /*==================================================
    FEATURE: SELECT ELEMENT
    ==================================================*/

    function selectElement(el) {

        document
            .querySelectorAll(".canvas-element")
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
    FEATURE: REBIND ELEMENTS
    ==================================================*/

    function bindCanvasElements() {

        canvas
            .querySelectorAll(".canvas-element")
            .forEach(el => {

                if (
                    el.dataset.sbBound === "true"
                ) return;

                el.dataset.sbBound = "true";

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

            });

    }

    /*==================================================
    FEATURE: LAYERS
    ==================================================*/

    function updateLayers() {

        if (!layersTreeView) return;

        const elements =
            canvas.querySelectorAll(
                ".canvas-element"
            );

        if (elements.length === 0) {

            layersTreeView.innerHTML =
                `<p class="no-layers">
                    No layers added yet
                </p>`;

            const ph =
                canvas.querySelector(
                    ".placeholder-text"
                );

            if (ph) {
                ph.style.display = "block";
            }

            return;
        }

        layersTreeView.innerHTML = "";

        elements.forEach(
            (el, index) => {

                const layer =
                    document.createElement("div");

                layer.className =
                    "layer-item";

                layer.textContent =
                    `${index + 1}. ${
                        el.getAttribute(
                            "data-type"
                        )?.toUpperCase() ||
                        "ELEMENT"
                    }`;

                layer.addEventListener(
                    "click",
                    () => {

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
    FEATURE: INSPECTOR
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

    function syncPropsToForm() {

        if (!selectedElement) return;

        const comp =
            getComputedStyle(
                selectedElement
            );

        const type =
            selectedElement.getAttribute(
                "data-type"
            );

        if (groupTextContent)
            groupTextContent.style.display =
                "none";

        if (groupImageContent)
            groupImageContent.style.display =
                "none";

        if (groupVideoContent)
            groupVideoContent.style.display =
                "none";

        if (type === "image") {

            if (groupImageContent)
                groupImageContent.style.display =
                    "block";

            const img =
                selectedElement.querySelector(
                    "img"
                );

            if (imageInput)
                imageInput.value =
                    img?.src || "";

        }

        else if (type === "video") {

            if (groupVideoContent)
                groupVideoContent.style.display =
                    "block";

            const iframe =
                selectedElement.querySelector(
                    "iframe"
                );

            if (videoInput)
                videoInput.value =
                    iframe?.src || "";

        }

        else {

            if (groupTextContent)
                groupTextContent.style.display =
                    "block";

            if (textInput)
                textInput.value =
                    selectedElement.textContent;

        }

        if (bgColorInput)
            bgColorInput.value =
                rgbToHex(
                    comp.backgroundColor
                );

        if (textColorInput)
            textColorInput.value =
                rgbToHex(
                    comp.color
                );

        if (fontSizeInput)
            fontSizeInput.value =
                parseInt(comp.fontSize) || 16;

        if (widthInput)
            widthInput.value =
                comp.width || "100%";

        if (heightInput)
            heightInput.value =
                comp.height || "auto";

        if (paddingInput)
            paddingInput.value =
                parseInt(
                    comp.paddingTop
                ) || 12;

        if (marginInput)
            marginInput.value =
                parseInt(
                    comp.marginTop
                ) || 6;

        if (borderStyleInput)
            borderStyleInput.value =
                comp.borderTopStyle ||
                "none";

        if (borderWidthInput)
            borderWidthInput.value =
                parseInt(
                    comp.borderTopWidth
                ) || 1;

        if (borderColorInput)
            borderColorInput.value =
                rgbToHex(
                    comp.borderTopColor
                );

        if (radiusInput)
            radiusInput.value =
                parseInt(
                    comp.borderRadius
                ) || 6;

        if (displayModeInput)
            displayModeInput.value =
                ["flex", "grid"].includes(
                    comp.display
                )
                    ? comp.display
                    : "block";

        if (flexDirectionInput)
            flexDirectionInput.value =
                comp.flexDirection ||
                "row";

    }

    /*==================================================
    FEATURE: LIVE INSPECTOR CHANGES
    ==================================================*/

    function afterInspectorChange() {

        saveState();

        updateLayers();

        syncCanvasToCode();

    }

    textInput?.addEventListener(
        "input",
        e => {

            if (!selectedElement) return;

            const type =
                selectedElement.getAttribute(
                    "data-type"
                );

            if (
                type !== "image" &&
                type !== "video"
            ) {

                selectedElement.textContent =
                    e.target.value;

                afterInspectorChange();

            }

        }
    );

    imageInput?.addEventListener(
        "input",
        e => {

            if (
                !selectedElement ||
                selectedElement.getAttribute(
                    "data-type"
                ) !== "image"
            ) return;

            selectedElement.innerHTML = "";

            const url =
                e.target.value.trim();

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

                box.innerHTML =
                    "🖼 No Image Selected";

                selectedElement.appendChild(
                    box
                );

            }

            afterInspectorChange();

        }
    );

    videoInput?.addEventListener(
        "input",
        e => {

            if (
                !selectedElement ||
                selectedElement.getAttribute(
                    "data-type"
                ) !== "video"
            ) return;

            selectedElement.innerHTML = "";

            const iframe =
                document.createElement(
                    "iframe"
                );

            iframe.className =
                "canvas-video-box";

            iframe.src =
                e.target.value.trim();

            iframe.setAttribute(
                "allowfullscreen",
                ""
            );

            selectedElement.appendChild(
                iframe
            );

            afterInspectorChange();

        }
    );

    bgColorInput?.addEventListener(
        "input",
        e => {

            if (!selectedElement) return;

            selectedElement.style.backgroundColor =
                e.target.value;

            afterInspectorChange();

        }
    );

    textColorInput?.addEventListener(
        "input",
        e => {

            if (!selectedElement) return;

            selectedElement.style.color =
                e.target.value;

            afterInspectorChange();

        }
    );

    fontSizeInput?.addEventListener(
        "input",
        e => {

            if (!selectedElement) return;

            selectedElement.style.fontSize =
                e.target.value + "px";

            afterInspectorChange();

        }
    );

    widthInput?.addEventListener(
        "input",
        e => {

            if (!selectedElement) return;

            selectedElement.style.width =
                e.target.value;

            afterInspectorChange();

        }
    );

    heightInput?.addEventListener(
        "input",
        e => {

            if (!selectedElement) return;

            selectedElement.style.height =
                e.target.value;

            afterInspectorChange();

        }
    );

    paddingInput?.addEventListener(
        "input",
        e => {

            if (!selectedElement) return;

            selectedElement.style.padding =
                e.target.value + "px";

            afterInspectorChange();

        }
    );

    marginInput?.addEventListener(
        "input",
        e => {

            if (!selectedElement) return;

            selectedElement.style.margin =
                e.target.value + "px";

            afterInspectorChange();

        }
    );

    borderStyleInput?.addEventListener(
        "change",
        e => {

            if (!selectedElement) return;

            selectedElement.style.borderStyle =
                e.target.value;

            afterInspectorChange();

        }
    );

    borderWidthInput?.addEventListener(
        "input",
        e => {

            if (!selectedElement) return;

            selectedElement.style.borderWidth =
                e.target.value + "px";

            afterInspectorChange();

        }
    );

    borderColorInput?.addEventListener(
        "input",
        e => {

            if (!selectedElement) return;

            selectedElement.style.borderColor =
                e.target.value;

            afterInspectorChange();

        }
    );

    radiusInput?.addEventListener(
        "input",
        e => {

            if (!selectedElement) return;

            selectedElement.style.borderRadius =
                e.target.value + "px";

            afterInspectorChange();

        }
    );

    displayModeInput?.addEventListener(
        "change",
        e => {

            if (!selectedElement) return;

            selectedElement.style.display =
                e.target.value;

            afterInspectorChange();

        }
    );

    flexDirectionInput?.addEventListener(
        "change",
        e => {

            if (!selectedElement) return;

            selectedElement.style.flexDirection =
                e.target.value;

            afterInspectorChange();

        }
    );

    gridColumnsInput?.addEventListener(
        "change",
        e => {

            if (!selectedElement) return;

            selectedElement.style.display =
                "grid";

            selectedElement.style.gridTemplateColumns =
                e.target.value;

            afterInspectorChange();

        }
    );

    /*==================================================
    FEATURE: ALIGNMENT
    ==================================================*/

    document
        .querySelectorAll(".align-btn")
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
                        .forEach(
                            b =>
                                b.classList.remove(
                                    "active"
                                )
                        );

                    button.classList.add(
                        "active"
                    );

                    selectedElement.style.textAlign =
                        align;

                    if (align === "center") {

                        selectedElement.style.marginLeft =
                            "auto";

                        selectedElement.style.marginRight =
                            "auto";

                    }

                    else if (
                        align === "right"
                    ) {

                        selectedElement.style.marginLeft =
                            "auto";

                        selectedElement.style.marginRight =
                            "0";

                    }

                    else {

                        selectedElement.style.marginLeft =
                            "0";

                        selectedElement.style.marginRight =
                            "0";

                    }

                    afterInspectorChange();

                }
            );

        });

    /*==================================================
    FEATURE: DELETE
    ==================================================*/

    document
        .getElementById("btn-delete-el")
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

                rightSidebar?.classList.add(
                    "hidden"
                );

                saveState();

                syncCanvasToCode();

            }
        );

    /*==================================================
    FEATURE: DUPLICATE
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

                clone.dataset.sbBound =
                    "false";

                canvas.appendChild(
                    clone
                );

                bindCanvasElements();

                updateLayers();

                selectElement(clone);

                saveState();

                syncCanvasToCode();

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
    FEATURE: CANVAS CLICK
    ==================================================*/

    canvas.addEventListener(
        "click",
        e => {

            const target =
                e.target.closest(
                    ".canvas-element"
                );

            if (target) {

                selectElement(target);

                rightSidebar?.classList.remove(
                    "hidden"
                );

            }

        }
    );

    /*==================================================
    FEATURE: SAVE
    ==================================================*/

    document
        .getElementById("btn-save")
        ?.addEventListener(
            "click",
            () => {

                const data = {

                    title:
                        projectTitleInput?.value ||
                        "My_Awesome_Page",

                    html:
                        canvas.innerHTML,

                    codingHTML:
                        htmlCodeBox?.value ||
                        "",

                    codingCSS:
                        cssCodeBox?.value ||
                        "",

                    codingJS:
                        jsCodeBox?.value ||
                        "",

                    savedAt:
                        new Date().toISOString()

                };

                localStorage.setItem(
                    "smartbazaar_page_project",
                    JSON.stringify(data)
                );

                localStorage.setItem(
                    "smartbazaar_page_content",
                    canvas.innerHTML
                );

                alert(
                    "Page saved successfully!"
                );

            }
        );

    /*==================================================
    FEATURE: LOAD SAVED PROJECT
    ==================================================*/

    function loadSavedProject() {

        const saved =
            localStorage.getItem(
                "smartbazaar_page_project"
            );

        if (!saved) return;

        try {

            const data =
                JSON.parse(saved);

            if (data.html) {

                canvas.innerHTML =
                    data.html;

                bindCanvasElements();

                updateLayers();

            }

            if (htmlCodeBox) {

                htmlCodeBox.value =
                    data.codingHTML || "";

            }

            if (cssCodeBox) {

                cssCodeBox.value =
                    data.codingCSS || "";

            }

            if (jsCodeBox) {

                jsCodeBox.value =
                    data.codingJS || "";

            }

        }

        catch(error) {

            console.warn(
                "Saved project could not be loaded.",
                error
            );

        }

    }

    /*==================================================
    FEATURE: EXPORT
    ==================================================*/

    function exportProject() {

        const title =
            projectTitleInput?.value.trim() ||
            "smartbazaar-page";

        const html =
            htmlCodeBox?.value.trim() ||
            canvas.innerHTML;

        const css =
            cssCodeBox?.value ||
            "";

        const js =
            jsCodeBox?.value ||
            "";

        const finalHTML = `
<!DOCTYPE html>
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

${js}

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
            URL.createObjectURL(
                blob
            );

        const a =
            document.createElement(
                "a"
            );

        a.href = url;

        a.download =
            `${title.replace(
                /[^a-z0-9-_]/gi,
                "_"
            )}.html`;

        document.body.appendChild(a);

        a.click();

        a.remove();

        setTimeout(
            () =>
                URL.revokeObjectURL(url),
            1000
        );

    }

    document
        .getElementById("btn-export")
        ?.addEventListener(
            "click",
            exportProject
        );

    document
        .getElementById("modal-btn-export")
        ?.addEventListener(
            "click",
            exportProject
        );

    /*==================================================
    FEATURE: CLEAR CANVAS
    ==================================================*/

    document
        .getElementById("modal-btn-clear")
        ?.addEventListener(
            "click",
            () => {

                if (
                    !confirm(
                        "Are you sure you want to clear all blocks?"
                    )
                ) return;

                canvas.innerHTML = `
                    <div class="placeholder-text">
                        Drag & drop blocks here or click Add (+) from top toolbar
                    </div>
                `;

                selectedElement = null;

                updateLayers();

                saveState();

                syncCanvasToCode();

                document
                    .getElementById(
                        "options-modal"
                    )
                    ?.style &&
                    (
                        document.getElementById(
                            "options-modal"
                        ).style.display =
                            "none"
                    );

            }
        );

    /*==================================================
    FEATURE: SETTINGS MODAL
    ==================================================*/

    const settingsModal =
        document.getElementById(
            "settings-modal"
        );

    document
        .getElementById("btn-settings")
        ?.addEventListener(
            "click",
            () => {

                const modalTitle =
                    document.getElementById(
                        "modal-project-title"
                    );

                if (modalTitle) {

                    modalTitle.value =
                        projectTitleInput?.value ||
                        "";

                }

                if (settingsModal) {

                    settingsModal.style.display =
                        "flex";

                }

            }
        );

    document
        .getElementById(
            "close-settings-modal"
        )
        ?.addEventListener(
            "click",
            () => {

                if (settingsModal) {

                    settingsModal.style.display =
                        "none";

                }

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
                    )?.value;

                const bg =
                    document.getElementById(
                        "modal-canvas-bg"
                    )?.value;

                if (
                    projectTitleInput &&
                    title
                ) {

                    projectTitleInput.value =
                        title;

                    localStorage.setItem(
                        "smartbazaar_project_name",
                        title
                    );

                }

                if (bg) {

                    canvas.style.backgroundColor =
                        bg;

                }

                if (settingsModal) {

                    settingsModal.style.display =
                        "none";

                }

                saveState();

            }
        );

    /*==================================================
    FEATURE: OPTIONS MODAL
    ==================================================*/

    const optionsModal =
        document.getElementById(
            "options-modal"
        );

    document
        .getElementById("btn-options")
        ?.addEventListener(
            "click",
            () => {

                if (optionsModal) {

                    optionsModal.style.display =
                        "flex";

                }

            }
        );

    document
        .getElementById(
            "close-options-modal"
        )
        ?.addEventListener(
            "click",
            () => {

                if (optionsModal) {

                    optionsModal.style.display =
                        "none";

                }

            }
        );

    /*==================================================
    FEATURE: PROJECT TITLE
    ==================================================*/

    if (projectTitleInput) {

        projectTitleInput.value =
            localStorage.getItem(
                "smartbazaar_project_name"
            ) ||
            "My_Awesome_Page";

        projectTitleInput.addEventListener(
            "input",
            e => {

                localStorage.setItem(
                    "smartbazaar_project_name",
                    e.target.value
                );

            }
        );

    }

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

        if (!previewBtn) return;

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
            () => {

                window.history.back();

            }
        );

    /*==================================================
    FEATURE: RGB → HEX
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
                /^rgba?\(
                \s*(\d+),
                \s*(\d+),
                \s*(\d+)/x
            );

        if (!match) {

            return "#27272a";

        }

        return (
            "#" +
            [
                match[1],
                match[2],
                match[3]
            ]
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
    FEATURE: HTML ESCAPE
    ==================================================*/

    function escapeHTML(value) {

        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }

    /*==================================================
    FEATURE: CLOSE MODALS BY BACKGROUND CLICK
    ==================================================*/

    document
        .querySelectorAll(
            ".modal-overlay"
        )
        .forEach(modal => {

            modal.addEventListener(
                "click",
                e => {

                    if (
                        e.target === modal
                    ) {

                        modal.style.display =
                            "none";

                    }

                }
            );

        });

    /*==================================================
    FEATURE: INITIALIZE EVERYTHING
    ==================================================*/

    createCodingSystem();

    createCodingButton();

    loadSavedProject();

    bindCanvasElements();

    updateLayers();

    /*
    IMPORTANT:
    Do not immediately overwrite saved coding.
    If no coding exists, generate it from canvas.
    */

    if (
        htmlCodeBox &&
        !htmlCodeBox.value.trim()
    ) {

        syncCanvasToCode();

    }

    saveState();

    console.log(
        "SmartBazaar Pro Editor initialized successfully."
    );

});
