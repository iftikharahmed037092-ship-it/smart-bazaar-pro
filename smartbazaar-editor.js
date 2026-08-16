document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sidebar Tabs Switching Logic ---
    const setupTabs = (containerSelector) => {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        const buttons = container.querySelectorAll('.sidebar-tabs .tab-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                const targetContent = document.getElementById(targetId);
                if (targetContent) targetContent.classList.add('active');
            });
        });
    };

    setupTabs('#left-sidebar');
    setupTabs('#right-sidebar');

    // --- 2. Drag & Drop Engine (Module 4) ---
    const canvas = document.getElementById('live-canvas');
    const placeholder = canvas.querySelector('.placeholder-text');
    const draggableItems = document.querySelectorAll('.draggable-item');

    let selectedElement = null;

    draggableItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', item.getAttribute('data-type'));
        });
    });

    canvas.addEventListener('dragover', (e) => {
        e.preventDefault(); // Dropping ki ijazat dene ke liye
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('text/plain');
        if (!type) return;

        // Placeholder text hide kar dein jab pehla element aaye
        if (placeholder) {
            placeholder.style.display = 'none';
        }

        createElementOnCanvas(type);
    });

    // --- 3. Create Element Function ---
    function createElementOnCanvas(type) {
        const el = document.createElement('div');
        el.className = 'canvas-element';
        el.setAttribute('data-element-type', type);

        let defaultText = 'New Element';
        if (type === 'heading') defaultText = '📌 Heading Element';
        else if (type === 'text') defaultText = '📄 Paragraph Text Element';
        else if (type === 'button') defaultText = '🔘 Button Element';
        else if (type === 'image') defaultText = '🖼 Image Box Element';
        else if (type === 'container') defaultText = '📦 Container Box';
        else if (type === 'product-card') defaultText = '🛍 Product Card Item';

        el.textContent = defaultText;

        // Click event to select element
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            selectElement(el);
        });

        canvas.appendChild(el);
        selectElement(el);
    }

    // --- 4. Element Selection & Property Binding (Module 6, 7, 8) ---
    function selectElement(el) {
        document.querySelectorAll('.canvas-element').forEach(item => {
            item.classList.remove('selected');
        });
        selectedElement = el;
        if (selectedElement) {
            selectedElement.classList.add('selected');
            syncPropertiesToUI();
        }
    }

    // Canvas par khali jagah click karne par selection khatam ho jaye
    canvas.addEventListener('click', () => {
        document.querySelectorAll('.canvas-element').forEach(item => {
            item.classList.remove('selected');
        });
        selectedElement = null;
    });

    // Right Sidebar Inputs Binding
    const textInput = document.getElementById('prop-text-input');
    const bgColorInput = document.getElementById('prop-bg-color');
    const fontSizeInput = document.getElementById('prop-font-size');
    const borderRadiusInput = document.getElementById('prop-border-radius');

    function syncPropertiesToUI() {
        if (!selectedElement) return;
        if (textInput) textInput.value = selectedElement.textContent;
        if (bgColorInput) bgColorInput.value = rgbToHex(window.getComputedStyle(selectedElement).backgroundColor) || '#1e1e24';
        if (fontSizeInput) fontSizeInput.value = parseInt(window.getComputedStyle(selectedElement).fontSize) || 14;
        if (borderRadiusInput) borderRadiusInput.value = parseInt(window.getComputedStyle(selectedElement).borderRadius) || 6;
    }

    // Real-time Text Update
    if (textInput) {
        textInput.addEventListener('input', (e) => {
            if (selectedElement) {
                selectedElement.textContent = e.target.value;
            }
        });
    }

    // Real-time Background Color Update
    if (bgColorInput) {
        bgColorInput.addEventListener('input', (e) => {
            if (selectedElement) {
                selectedElement.style.backgroundColor = e.target.value;
            }
        });
    }

    // Real-time Font Size Update
    if (fontSizeInput) {
        fontSizeInput.addEventListener('input', (e) => {
            if (selectedElement) {
                selectedElement.style.fontSize = e.target.value + 'px';
            }
        });
    }

    // Real-time Border Radius Update
    if (borderRadiusInput) {
        borderRadiusInput.addEventListener('input', (e) => {
            if (selectedElement) {
                selectedElement.style.borderRadius = e.target.value + 'px';
            }
        });
    }

    // Helper: RGB to Hex conversion for color input
    function rgbToHex(rgb) {
        if (!rgb || rgb === 'transparent') return '#1e1e24';
        if (rgb.startsWith('#')) return rgb;
        const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!match) return '#1e1e24';
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "#" + hex(match[1]) + hex(match[2]) + hex(match[3]);
    }

});
