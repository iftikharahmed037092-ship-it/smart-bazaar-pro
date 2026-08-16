document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sidebar Tabs & Collapsible Logic ---
    const setupTabs = (containerSelector) => {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        container.querySelectorAll('.sidebar-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(targetId)?.classList.add('active');
            });
        });
    };
    setupTabs('#left-sidebar');
    setupTabs('#right-sidebar');

    const leftSidebar = document.getElementById('left-sidebar');
    const rightSidebar = document.getElementById('right-sidebar');
    document.getElementById('toggle-left')?.addEventListener('click', () => {
        leftSidebar.classList.toggle('collapsed');
        document.getElementById('toggle-left').textContent = leftSidebar.classList.contains('collapsed') ? '►' : '◄';
    });
    document.getElementById('toggle-right')?.addEventListener('click', () => {
        rightSidebar.classList.toggle('collapsed');
        document.getElementById('toggle-right').textContent = rightSidebar.classList.contains('collapsed') ? '◄' : '►';
    });

    // --- 2. Device View & Preview Mode ---
    const canvas = document.getElementById('live-canvas');
    const previewBtn = document.getElementById('btn-preview');
    const floatingBackBtn = document.getElementById('floating-back-btn');

    function togglePreviewMode() {
        document.body.classList.toggle('preview-mode');
        const isPreview = document.body.classList.contains('preview-mode');
        if (previewBtn) {
            previewBtn.textContent = isPreview ? '❌ Exit Preview' : '👁 Preview';
            previewBtn.style.backgroundColor = isPreview ? '#7f1d1d' : '';
        }
    }
    previewBtn?.addEventListener('click', togglePreviewMode);
    floatingBackBtn?.addEventListener('click', togglePreviewMode);

    ['desktop', 'tablet', 'mobile'].forEach(mode => {
        document.getElementById(`btn-${mode}`)?.addEventListener('click', (e) => {
            document.querySelectorAll('.device-switcher button').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            canvas.className = `mode-${mode}`;
        });
    });

    // --- 3. Element Creation & Canvas Engine ---
    const placeholder = canvas.querySelector('.placeholder-text');
    const layersTreeView = document.getElementById('layers-tree-view');
    let selectedElement = null;
    let elementCounter = 0;

    document.querySelectorAll('.draggable-item').forEach(item => {
        item.addEventListener('click', () => {
            const type = item.getAttribute('data-type');
            if (type) {
                if (placeholder) placeholder.style.display = 'none';
                createElementOnCanvas(type);
            }
        });
    });

    function createElementOnCanvas(type, customText = null, customBg = '', customColor = '', customSize = '', customRadius = '', customLink = '', customMargin = '', customPadding = '') {
        elementCounter++;
        const el = document.createElement('div');
        el.className = 'canvas-element';
        el.id = `element-${elementCounter}`;
        el.setAttribute('data-element-type', type);
        if (customLink) el.setAttribute('data-link', customLink);

        el.textContent = customText || `New ${type.toUpperCase()} Element`;
        if (customBg) el.style.backgroundColor = customBg;
        if (customColor) el.style.color = customColor;
        if (customSize) el.style.fontSize = customSize;
        if (customRadius) el.style.borderRadius = customRadius;
        if (customMargin) el.style.margin = customMargin;
        if (customPadding) el.style.padding = customPadding;

        el.addEventListener('click', (e) => {
            e.stopPropagation();
            selectElement(el);
        });

        canvas.appendChild(el);
        updateLayersTree();
        selectElement(el);
        saveProjectToLocalStorage();
    }

    function selectElement(el) {
        document.querySelectorAll('.canvas-element').forEach(item => item.classList.remove('selected'));
        selectedElement = el;
        if (selectedElement) {
            selectedElement.classList.add('selected');
            syncPropertiesToUI();
        }
    }

    canvas.addEventListener('click', (e) => {
        // If in preview mode, handle link navigation
        if (document.body.classList.contains('preview-mode')) {
            const targetEl = e.target.closest('.canvas-element');
            if (targetEl) {
                const link = targetEl.getAttribute('data-link');
                if (link) {
                    window.location.href = link;
                }
            }
            return;
        }

        if (e.target === canvas || e.target === placeholder) {
            document.querySelectorAll('.canvas-element').forEach(item => item.classList.remove('selected'));
            selectedElement = null;
        }
    });

    function updateLayersTree() {
        const elements = canvas.querySelectorAll('.canvas-element');
        if (elements.length === 0) {
            layersTreeView.innerHTML = '<p class="no-layers">No layers yet</p>';
            if (placeholder) placeholder.style.display = 'block';
            return;
        }
        layersTreeView.innerHTML = '';
        elements.forEach((el, index) => {
            const layerDiv = document.createElement('div');
            layerDiv.className = 'layer-item';
            layerDiv.textContent = `Layer ${index + 1}: ${el.getAttribute('data-element-type')}`;
            layerDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                selectElement(el);
            });
            layersTreeView.appendChild(layerDiv);
        });
    }

    // --- 4. LocalStorage Save & Load ---
    function saveProjectToLocalStorage() {
        const projectData = [];
        canvas.querySelectorAll('.canvas-element').forEach(el => {
            const comp = window.getComputedStyle(el);
            projectData.push({
                type: el.getAttribute('data-element-type'),
                text: el.textContent,
                bgColor: comp.backgroundColor,
                color: comp.color,
                fontSize: comp.fontSize,
                borderRadius: comp.borderRadius,
                link: el.getAttribute('data-link') || '',
                margin: comp.margin,
                padding: comp.padding
            });
        });
        localStorage.setItem('smartbazaar_saved_project', JSON.stringify(projectData));
    }

    function loadProjectFromLocalStorage() {
        const savedData = localStorage.getItem('smartbazaar_saved_project');
        if (!savedData) return;
        try {
            const projectData = JSON.parse(savedData);
            if (projectData.length > 0 && placeholder) placeholder.style.display = 'none';
            projectData.forEach(item => {
                createElementOnCanvas(item.type, item.text, item.bgColor, item.color, item.fontSize, item.borderRadius, item.link, item.margin, item.padding);
            });
        } catch (e) {
            console.error('Load error:', e);
        }
    }
    loadProjectFromLocalStorage();

    // --- 5. Element Actions (Delete & Duplicate) ---
    document.getElementById('btn-delete-el')?.addEventListener('click', () => {
        if (!selectedElement) return alert('Select an element first!');
        selectedElement.remove();
        selectedElement = null;
        updateLayersTree();
        saveProjectToLocalStorage();
    });

    document.getElementById('btn-duplicate-el')?.addEventListener('click', () => {
        if (!selectedElement) return alert('Select an element first!');
        const comp = window.getComputedStyle(selectedElement);
        createElementOnCanvas(
            selectedElement.getAttribute('data-element-type'),
            selectedElement.textContent,
            comp.backgroundColor,
            comp.color,
            comp.fontSize,
            comp.borderRadius,
            selectedElement.getAttribute('data-link'),
            comp.margin,
            comp.padding
        );
    });

    // --- 6. Real-time Property Binding (Inputs) ---
    const textInput = document.getElementById('prop-text-input');
    const linkInput = document.getElementById('prop-link-input');
    const bgColorInput = document.getElementById('prop-bg-color');
    const textColorInput = document.getElementById('prop-text-color');
    const fontSizeInput = document.getElementById('prop-font-size');
    const borderRadiusInput = document.getElementById('prop-border-radius');
    const marginInput = document.getElementById('prop-margin');
    const paddingInput = document.getElementById('prop-padding');

    function syncPropertiesToUI() {
        if (!selectedElement) return;
        const comp = window.getComputedStyle(selectedElement);
        if (textInput) textInput.value = selectedElement.textContent;
        if (linkInput) linkInput.value = selectedElement.getAttribute('data-link') || '';
        if (bgColorInput) bgColorInput.value = rgbToHex(comp.backgroundColor);
        if (textColorInput) textColorInput.value = rgbToHex(comp.color);
        if (fontSizeInput) fontSizeInput.value = parseInt(comp.fontSize) || 14;
        if (borderRadiusInput) borderRadiusInput.value = parseInt(comp.borderRadius) || 6;
        if (marginInput) marginInput.value = parseInt(comp.margin) || 0;
        if (paddingInput) paddingInput.value = parseInt(comp.padding) || 12;
    }

    textInput?.addEventListener('input', (e) => {
        if (selectedElement) { selectedElement.textContent = e.target.value; updateLayersTree(); saveProjectToLocalStorage(); }
    });
    linkInput?.addEventListener('input', (e) => {
        if (selectedElement) { selectedElement.setAttribute('data-link', e.target.value); saveProjectToLocalStorage(); }
    });
    bgColorInput?.addEventListener('input', (e) => {
        if (selectedElement) { selectedElement.style.backgroundColor = e.target.value; saveProjectToLocalStorage(); }
    });
    textColorInput?.addEventListener('input', (e) => {
        if (selectedElement) { selectedElement.style.color = e.target.value; saveProjectToLocalStorage(); }
    });
    fontSizeInput?.addEventListener('input', (e) => {
        if (selectedElement) { selectedElement.style.fontSize = e.target.value + 'px'; saveProjectToLocalStorage(); }
    });
    borderRadiusInput?.addEventListener('input', (e) => {
        if (selectedElement) { selectedElement.style.borderRadius = e.target.value + 'px'; saveProjectToLocalStorage(); }
    });
    marginInput?.addEventListener('input', (e) => {
        if (selectedElement) { selectedElement.style.margin = e.target.value + 'px'; saveProjectToLocalStorage(); }
    });
    paddingInput?.addEventListener('input', (e) => {
        if (selectedElement) { selectedElement.style.padding = e.target.value + 'px'; saveProjectToLocalStorage(); }
    });

    // --- 7. Export Code Generator (Downloads index.html & style.css) ---
    document.getElementById('btn-export')?.addEventListener('click', () => {
        const elements = canvas.querySelectorAll('.canvas-element');
        if (elements.length === 0) {
            alert('Canvas is empty! Add elements before exporting.');
            return;
        }

        let htmlContent = `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>SmartBazaar Exported Site</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n`;
        let cssContent = `body { background-color: #0f1117; color: #e2e8f0; font-family: sans-serif; padding: 20px; }\n`;

        elements.forEach((el, index) => {
            const comp = window.getComputedStyle(el);
            const link = el.getAttribute('data-link');
            const text = el.textContent;
            
            cssContent += `.builder-el-${index} {\n`;
            cssContent += `    background-color: ${comp.backgroundColor};\n`;
            cssContent += `    color: ${comp.color};\n`;
            cssContent += `    font-size: ${comp.fontSize};\n`;
            cssContent += `    border-radius: ${comp.borderRadius};\n`;
            cssContent += `    margin: ${comp.margin};\n`;
            cssContent += `    padding: ${comp.padding};\n`;
            cssContent += `}\n`;

            if (link) {
                htmlContent += `    <a href="${link}" style="text-decoration: none; display: block; margin-bottom: 10px;">\n`;
                htmlContent += `        <div class="builder-el-${index}">${text}</div>\n`;
                htmlContent += `    </a>\n`;
            } else {
                htmlContent += `    <div class="builder-el-${index}" style="margin-bottom: 10px;">${text}</div>\n`;
            }
        });

        htmlContent += `</body>\n</html>`;

        downloadFile(htmlContent, 'index.html', 'text/html');
        downloadFile(cssContent, 'style.css', 'text/css');
        alert('📦 Project files (index.html & style.css) generated and downloaded successfully!');
    });

    function downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function rgbToHex(rgb) {
        if (!rgb || rgb === 'transparent') return '#1e1e24';
        if (rgb.startsWith('#')) return rgb;
        const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!match) return '#1e1e24';
        return "#" + [match[1], match[2], match[3]].map(x => ("0" + parseInt(x).toString(16)).slice(-2)).join('');
    }

});
