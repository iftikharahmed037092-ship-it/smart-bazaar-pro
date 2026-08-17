document.addEventListener('DOMContentLoaded', () => {

    const leftSidebar = document.getElementById('left-sidebar');
    const rightSidebar = document.getElementById('right-sidebar');
    const canvas = document.getElementById('live-canvas');
    const placeholder = canvas.querySelector('.placeholder-text');
    const layersTreeView = document.getElementById('layers-tree-view');
    const projectTitleInput = document.getElementById('project-title-input');
    const addBlockBtn = document.getElementById('btn-add-block');

    let selectedElement = null;
    let elementCounter = 0;
    
    let historyStack = [];
    let historyIndex = -1;

    function saveState() {
        if (historyIndex < historyStack.length - 1) {
            historyStack = historyStack.slice(0, historyIndex + 1);
        }
        historyStack.push(canvas.innerHTML);
        historyIndex++;
    }

    function restoreState(html) {
        canvas.innerHTML = html;
        canvas.querySelectorAll('.canvas-element').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                selectElement(el);
                rightSidebar.classList.remove('hidden');
            });
        });
        const ph = canvas.querySelector('.placeholder-text');
        if (ph) ph.style.display = canvas.querySelectorAll('.canvas-element').length === 0 ? 'block' : 'none';
        updateLayers();
    }

    document.getElementById('btn-undo').addEventListener('click', () => {
        if (historyIndex > 0) {
            historyIndex--;
            restoreState(historyStack[historyIndex]);
        }
    });

    document.getElementById('btn-redo').addEventListener('click', () => {
        if (historyIndex < historyStack.length - 1) {
            historyIndex++;
            restoreState(historyStack[historyIndex]);
        }
    });

    document.getElementById('close-left-sidebar').addEventListener('click', () => leftSidebar.classList.add('hidden'));
    document.getElementById('close-right-sidebar').addEventListener('click', () => rightSidebar.classList.add('hidden'));
    addBlockBtn.addEventListener('click', () => leftSidebar.classList.toggle('hidden'));

    canvas.addEventListener('click', (e) => {
        const targetEl = e.target.closest('.canvas-element');
        if (targetEl) {
            selectElement(targetEl);
            rightSidebar.classList.remove('hidden');
        } else if (e.target === canvas || e.target === placeholder) {
            document.querySelectorAll('.canvas-element').forEach(el => el.classList.remove('selected'));
            selectedElement = null;
        }
    });

    // --- HTML5 Drag & Drop Implementation ---
    let draggedType = null;
    let draggedPattern = null;

    document.querySelectorAll('.draggable-item, .pattern-item').forEach(item => {
        item.addEventListener('dragstart', (e) => {
            draggedType = item.getAttribute('data-type');
            draggedPattern = item.getAttribute('data-pattern');
            e.dataTransfer.setData('text/plain', draggedType || draggedPattern);
        });
    });

    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
        canvas.classList.add('drag-over');
    });

    canvas.addEventListener('dragleave', () => {
        canvas.classList.remove('drag-over');
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        canvas.classList.remove('drag-over');
        if (placeholder) placeholder.style.display = 'none';

        if (draggedPattern) {
            createPattern(draggedPattern);
            draggedPattern = null;
        } else if (draggedType) {
            createElementByType(draggedType);
            draggedType = null;
        }
        rightSidebar.classList.remove('hidden');
        saveState();
    });

    document.querySelectorAll('.sidebar').forEach(sidebar => {
        const subTabs = sidebar.querySelectorAll('.sub-tab-btn');
        subTabs.forEach(btn => {
            btn.addEventListener('click', () => {
                subTabs.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const targetPaneId = btn.getAttribute('data-target');
                sidebar.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
                sidebar.querySelector(`#${targetPaneId}`).classList.add('active');
            });
        });
    });

    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('open');
        });
    });

    projectTitleInput.value = localStorage.getItem('smartbazaar_project_name') || 'My_Awesome_Page';
    projectTitleInput.addEventListener('input', (e) => localStorage.setItem('smartbazaar_project_name', e.target.value));

    // Modals
    const settingsModal = document.getElementById('settings-modal');
    const optionsModal = document.getElementById('options-modal');

    document.getElementById('btn-settings').addEventListener('click', () => {
        document.getElementById('modal-project-title').value = projectTitleInput.value;
        settingsModal.style.display = 'flex';
    });
    document.getElementById('close-settings-modal').addEventListener('click', () => settingsModal.style.display = 'none');
    document.getElementById('btn-save-settings').addEventListener('click', () => {
        projectTitleInput.value = document.getElementById('modal-project-title').value;
        canvas.style.backgroundColor = document.getElementById('modal-canvas-bg').value;
        settingsModal.style.display = 'none';
        saveState();
    });

    document.getElementById('btn-options').addEventListener('click', () => optionsModal.style.display = 'flex');
    document.getElementById('close-options-modal').addEventListener('click', () => optionsModal.style.display = 'none');
    
    document.getElementById('modal-btn-clear').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all blocks?')) {
            canvas.innerHTML = '<div class="placeholder-text">Drag & drop blocks here or click Add (+) from top toolbar</div>';
            updateLayers();
            optionsModal.style.display = 'none';
            saveState();
        }
    });

    document.getElementById('modal-btn-export').addEventListener('click', () => {
        const blob = new Blob([canvas.innerHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'page-export.html';
        a.click();
    });

    // Click creation fallback
    document.querySelectorAll('.draggable-item').forEach(item => {
        item.addEventListener('click', () => {
            const type = item.getAttribute('data-type');
            if (placeholder) placeholder.style.display = 'none';
            createElementByType(type);
            rightSidebar.classList.remove('hidden');
            saveState();
        });
    });

    document.querySelectorAll('.pattern-item').forEach(pattern => {
        pattern.addEventListener('click', () => {
            if (placeholder) placeholder.style.display = 'none';
            createPattern(pattern.getAttribute('data-pattern'));
            rightSidebar.classList.remove('hidden');
            saveState();
        });
    });

    function createElementByType(type) {
        if (type === 'image') {
            createElement('image', '', '', '', '#1e1e24', '#ffffff', '16', '12', '6', '100%', 'auto', 'solid', '1', '#3f3f46', '6', 'none', 'left');
        } else if (type === 'video') {
            createElement('video', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '', '', '#14161b', '#ffffff', '16', '12', '6', '100%', 'auto', 'solid', '1', '#3f3f46', '6', 'none', 'left');
        } else if (type === 'icon') {
            createElement('icon', '⭐', '', '', '#27272a', '#38bdf8', '28', '12', '6', 'auto', 'auto', 'none', '1', '#3f3f46', '6', 'none', 'center');
        } else if (type === 'flex') {
            createElement('flex', 'Flexbox Container', '', '', '#252833', '#ffffff', '16', '16', '8', '100%', '120px', 'dashed', '1', '#38bdf8', '8', '0 4px 6px rgba(0,0,0,0.3)', 'left', 'flex', 'row');
        } else if (type === 'grid') {
            createElement('grid', 'Grid Container', '', '', '#252833', '#ffffff', '16', '16', '8', '100%', '120px', 'solid', '1', '#2563eb', '8', '0 4px 6px rgba(0,0,0,0.3)', 'left', 'grid');
        } else if (type === 'container' || type === 'card') {
            createElement(type, `Sample ${type.toUpperCase()} Box`, '', '', '#27272a', '#ffffff', '16', '16', '6', '100%', '100px', 'solid', '1', '#38bdf8', '8', '0 4px 6px rgba(0,0,0,0.3)', 'left');
        } else {
            createElement(type, `Sample ${type.toUpperCase()} Text`, '', '', '#27272a', '#ffffff', '16', '12', '6', '100%', 'auto', 'none', '1', '#3f3f46', '6', 'none', 'left');
        }
    }

    function createPattern(patType) {
        if (patType === 'hero') {
            createElement('heading', 'Build Your Dream Website Today', '', '', '#1e1e24', '#38bdf8', '26', '14', '6', '100%', 'auto', 'none', '1', '#3f3f46', '6', 'none', 'center');
            createElement('paragraph', 'The ultimate live website builder with responsive grids and elements.', '', '', '#1e1e24', '#f1f5f9', '14', '10', '4', '100%', 'auto', 'none', '1', '#3f3f46', '6', 'none', 'center');
            createElement('button', 'Get Started Now', '', '', '#2563eb', '#ffffff', '14', '12', '6', '100%', 'auto', 'none', '1', '#3f3f46', '6', '0 4px 10px rgba(37,99,235,0.4)', 'center');
        } else if (patType === 'image-box') {
            createElement('image', '', '', '', '#181b22', '#ffffff', '16', '10', '6', '100%', '180px', 'solid', '1', '#38bdf8', '8', '0 6px 12px rgba(0,0,0,0.4)', 'left');
            createElement('heading', 'Professional Web Development', '', '', '#181b22', '#ffffff', '18', '8', '4', '100%', 'auto', 'none', '1', '#3f3f46', '4', 'none', 'left');
        } else if (patType === 'pricing') {
            createElement('heading', 'Pro Plan - $29/mo', '', '', '#181b22', '#ffffff', '20', '12', '6', '100%', 'auto', 'solid', '1', '#2563eb', '8', '0 8px 16px rgba(0,0,0,0.4)', 'center');
            createElement('paragraph', 'Includes unlimited blocks, custom CSS dimensions, and instant export.', '', '', '#181b22', '#94a3b8', '14', '8', '4', '100%', 'auto', 'none', '1', '#2d3748', '6', 'none', 'center');
            createElement('button', 'Choose Plan', '', '', '#10b981', '#ffffff', '14', '10', '6', '100%', 'auto', 'none', '1', '#3f3f46', '6', 'none', 'center');
        } else if (patType === 'testimonial') {
            createElement('paragraph', '"This builder completely changed how fast I launch client sites. Absolutely incredible!"', '', '', '#252833', '#e2e8f0', '14', '14', '6', '100%', 'auto', 'dashed', '1', '#38bdf8', '8', '0 4px 12px rgba(0,0,0,0.3)', 'left');
            createElement('heading', '- Alex Johnson, Developer', '', '', '#252833', '#38bdf8', '12', '6', '4', '100%', 'auto', 'none', '1', '#3f3f46', '4', 'none', 'left');
        }
    }

    function createElement(type, text, imgSrc = '', videoSrc = '', bgColor = '#27272a', color = '#ffffff', fontSize = '16', padding = '12', margin = '6', width = '100%', height = 'auto', bStyle = 'none', bWidth = '1', bColor = '#3f3f46', radius = '6', shadow = 'none', align = 'left', displayMode = 'block', flexDir = 'row') {
        elementCounter++;
        const el = document.createElement('div');
        el.className = 'canvas-element';
        el.id = `el-${elementCounter}`;
        el.setAttribute('data-type', type);
        
        if (type === 'image') {
            const placeholderBox = document.createElement('div');
            placeholderBox.className = 'empty-img-placeholder';
            placeholderBox.innerHTML = '<span>🖼 No Image Selected</span><small>Paste image URL in right panel</small>';
            el.appendChild(placeholderBox);
        } else if (type === 'video') {
            const iframe = document.createElement('iframe');
            iframe.className = 'canvas-video-box';
            iframe.src = text;
            iframe.setAttribute('allowfullscreen', '');
            el.appendChild(iframe);
        } else {
            el.textContent = text;
        }
        
        applyStylesToElement(el, { bgColor, color, fontSize, padding, margin, width, height, bStyle, bWidth, bColor, radius, shadow, align, displayMode, flexDir });

        el.addEventListener('click', (e) => {
            e.stopPropagation();
            selectElement(el);
            rightSidebar.classList.remove('hidden');
        });

        canvas.appendChild(el);
        updateLayers();
        selectElement(el);
    }

    function applyStylesToElement(el, styles) {
        el.style.backgroundColor = styles.bgColor;
        el.style.color = styles.color;
        el.style.fontSize = styles.fontSize + 'px';
        el.style.padding = styles.padding + 'px';
        el.style.margin = styles.margin + 'px';
        el.style.width = styles.width;
        el.style.height = styles.height;
        el.style.borderStyle = styles.bStyle;
        el.style.borderWidth = styles.bWidth + 'px';
        el.style.borderColor = styles.bColor;
        el.style.borderRadius = styles.radius + 'px';
        el.style.boxShadow = styles.shadow;
        el.style.textAlign = styles.align;
        el.style.display = styles.displayMode;
        if (styles.displayMode === 'flex') {
            el.style.flexDirection = styles.flexDir;
        }
        if (styles.align === 'center') {
            el.style.marginLeft = 'auto';
            el.style.marginRight = 'auto';
        } else if (styles.align === 'right') {
            el.style.marginLeft = 'auto';
            el.style.marginRight = '0';
        } else {
            el.style.marginLeft = '0';
            el.style.marginRight = '0';
        }
    }

    function selectElement(el) {
        document.querySelectorAll('.canvas-element').forEach(item => item.classList.remove('selected'));
        selectedElement = el;
        if (selectedElement) {
            selectedElement.classList.add('selected');
            syncPropsToForm();
        }
    }

    function updateLayers() {
        const elements = canvas.querySelectorAll('.canvas-element');
        if (elements.length === 0) {
            layersTreeView.innerHTML = '<p class="no-layers">No layers added yet</p>';
            if (placeholder) placeholder.style.display = 'block';
            return;
        }
        layersTreeView.innerHTML = '';
        elements.forEach((el, index) => {
            const div = document.createElement('div');
            div.className = 'layer-item';
            div.textContent = `${index + 1}. ${el.getAttribute('data-type').toUpperCase()}`;
            div.addEventListener('click', (e) => {
                e.stopPropagation();
                selectElement(el);
                rightSidebar.classList.remove('hidden');
            });
            layersTreeView.appendChild(div);
        });
    }

    const textInput = document.getElementById('prop-text-input');
    const imageInput = document.getElementById('prop-image-input');
    const videoInput = document.getElementById('prop-video-input');
    const groupTextContent = document.getElementById('group-text-content');
    const groupImageContent = document.getElementById('group-image-content');
    const groupVideoContent = document.getElementById('group-video-content');

    const displayModeInput = document.getElementById('prop-display-mode');
    const flexDirectionInput = document.getElementById('prop-flex-direction');
    const gridColumnsInput = document.getElementById('prop-grid-columns');

    const bgColorInput = document.getElementById('prop-bg-color');
    const textColorInput = document.getElementById('prop-text-color');
    const fontSizeInput = document.getElementById('prop-font-size');
    const widthInput = document.getElementById('prop-width');
    const heightInput = document.getElementById('prop-height');
    const paddingInput = document.getElementById('prop-padding');
    const marginInput = document.getElementById('prop-margin');
    const borderStyleInput = document.getElementById('prop-border-style');
    const borderWidthInput = document.getElementById('prop-border-width');
    const borderColorInput = document.getElementById('prop-border-color');
    const radiusInput = document.getElementById('prop-border-radius');

    function syncPropsToForm() {
        if (!selectedElement) return;
        const comp = window.getComputedStyle(selectedElement);
        const type = selectedElement.getAttribute('data-type');

        groupTextContent.style.display = 'none';
        groupImageContent.style.display = 'none';
        groupVideoContent.style.display = 'none';

        if (type === 'image') {
            groupImageContent.style.display = 'block';
            const imgEl = selectedElement.querySelector('img');
            imageInput.value = imgEl ? imgEl.src : '';
        } else if (type === 'video') {
            groupVideoContent.style.display = 'block';
            const vidEl = selectedElement.querySelector('iframe');
            videoInput.value = vidEl ? vidEl.src : '';
        } else {
            groupTextContent.style.display = 'block';
            textInput.value = selectedElement.textContent;
        }

        displayModeInput.value = comp.display !== 'flex' && comp.display !== 'grid' ? 'block' : comp.display;
        flexDirectionInput.value = comp.flexDirection || 'row';

        bgColorInput.value = rgbToHex(comp.backgroundColor);
        textColorInput.value = rgbToHex(comp.color);
        fontSizeInput.value = parseInt(comp.fontSize) || 16;
        widthInput.value = comp.width || '100%';
        heightInput.value = comp.height || 'auto';
        paddingInput.value = parseInt(comp.paddingTop) || 12;
        marginInput.value = parseInt(comp.marginTop) || 6;
        borderStyleInput.value = comp.borderTopStyle || 'none';
        borderWidthInput.value = parseInt(comp.borderTopWidth) || 1;
        borderColorInput.value = rgbToHex(comp.borderTopColor);
        radiusInput.value = parseInt(comp.borderRadius) || 6;

        document.querySelectorAll('.align-btn').forEach(btn => {
            if (btn.getAttribute('data-align') === comp.textAlign) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    document.querySelectorAll('.align-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!selectedElement) return;
            const align = btn.getAttribute('data-align');
            document.querySelectorAll('.align-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            selectedElement.style.textAlign = align;
            if (align === 'center') {
                selectedElement.style.marginLeft = 'auto';
                selectedElement.style.marginRight = 'auto';
            } else if (align === 'right') {
                selectedElement.style.marginLeft = 'auto';
                selectedElement.style.marginRight = '0';
            } else {
                selectedElement.style.marginLeft = '0';
                selectedElement.style.marginRight = '0';
            }
            saveState();
        });
    });

    displayModeInput?.addEventListener('change', (e) => {
        if (!selectedElement) return;
        const mode = e.target.value;
        selectedElement.style.display = mode;
        saveState();
    });

    flexDirectionInput?.addEventListener('change', (e) => {
        if (!selectedElement) return;
        selectedElement.style.flexDirection = e.target.value;
        saveState();
    });

    gridColumnsInput?.addEventListener('change', (e) => {
        if (!selectedElement) return;
        selectedElement.style.display = 'grid';
        selectedElement.style.gridTemplateColumns = e.target.value;
        saveState();
    });

    textInput?.addEventListener('input', (e) => { 
        if (selectedElement && ['heading', 'paragraph', 'button', 'container', 'card', 'flex', 'grid'].includes(selectedElement.getAttribute('data-type'))) { 
            selectedElement.textContent = e.target.value; 
            updateLayers(); 
            saveState();
        } 
    });
    
    imageInput?.addEventListener('input', (e) => { 
        if (selectedElement && selectedElement.getAttribute('data-type') === 'image') { 
            const url = e.target.value.trim();
            selectedElement.innerHTML = ''; 
            if (url) {
                const img = document.createElement('img');
                img.className = 'canvas-img-box';
                img.src = url;
                selectedElement.appendChild(img);
            } else {
                const placeholderBox = document.createElement('div');
                placeholderBox.className = 'empty-img-placeholder';
                placeholderBox.innerHTML = '<span>🖼 No Image Selected</span><small>Paste image URL</small>';
                selectedElement.appendChild(placeholderBox);
            }
            saveState();
        } 
    });

    videoInput?.addEventListener('input', (e) => {
        if (selectedElement && selectedElement.getAttribute('data-type') === 'video') {
            const url = e.target.value.trim();
            selectedElement.innerHTML = '';
            const iframe = document.createElement('iframe');
            iframe.className = 'canvas-video-box';
            iframe.src = url;
            iframe.setAttribute('allowfullscreen', '');
            selectedElement.appendChild(iframe);
            saveState();
        }
    });

    bgColorInput?.addEventListener('input', (e) => { if (selectedElement) { selectedElement.style.backgroundColor = e.target.value; saveState(); } });
    textColorInput?.addEventListener('input', (e) => { if (selectedElement) { selectedElement.style.color = e.target.value; saveState(); } });
    fontSizeInput?.addEventListener('input', (e) => { if (selectedElement) { selectedElement.style.fontSize = e.target.value + 'px'; saveState(); } });
    widthInput?.addEventListener('input', (e) => { if (selectedElement) { selectedElement.style.width = e.target.value; saveState(); } });
    heightInput?.addEventListener('input', (e) => { if (selectedElement) { selectedElement.style.height = e.target.value; saveState(); } });
    paddingInput?.addEventListener('input', (e) => { if (selectedElement) { selectedElement.style.padding = e.target.value + 'px'; saveState(); } });
    marginInput?.addEventListener('input', (e) => { if (selectedElement) { selectedElement.style.margin = e.target.value + 'px'; saveState(); } });
    borderStyleInput?.addEventListener('change', (e) => { if (selectedElement) { selectedElement.style.borderStyle = e.target.value; saveState(); } });
    borderWidthInput?.addEventListener('input', (e) => { if (selectedElement) { selectedElement.style.borderWidth = e.target.value + 'px'; saveState(); } });
    borderColorInput?.addEventListener('input', (e) => { if (selectedElement) { selectedElement.style.borderColor = e.target.value; saveState(); } });
    radiusInput?.addEventListener('input', (e) => { if (selectedElement) { selectedElement.style.borderRadius = e.target.value + 'px'; saveState(); } });

    document.getElementById('btn-delete-el')?.addEventListener('click', () => {
        if (!selectedElement) return alert('Please select an element first!');
        selectedElement.remove();
        selectedElement = null;
        updateLayers();
        rightSidebar.classList.add('hidden');
        saveState();
    });

    document.getElementById('btn-duplicate-el')?.addEventListener('click', () => {
        if (!selectedElement) return alert('Please select an element first!');
        const comp = window.getComputedStyle(selectedElement);
        const type = selectedElement.getAttribute('data-type');
        
        createElement(
            type,
            selectedElement.textContent,
            '', '',
            rgbToHex(comp.backgroundColor),
            rgbToHex(comp.color),
            parseInt(comp.fontSize),
            parseInt(comp.paddingTop),
            parseInt(comp.marginTop),
            comp.width,
            comp.height,
            comp.borderTopStyle,
            parseInt(comp.borderTopWidth),
            rgbToHex(comp.borderTopColor),
            parseInt(comp.borderRadius),
            comp.boxShadow,
            comp.textAlign,
            comp.display,
            comp.flexDirection
        );
        saveState();
    });

    ['desktop', 'tablet', 'mobile'].forEach(mode => {
        document.getElementById(`btn-${mode}`)?.addEventListener('click', (e) => {
            document.querySelectorAll('.device-switcher button').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            canvas.className = `mode-${mode}`;
        });
    });

    const previewBtn = document.getElementById('btn-preview');
    const floatingBackBtn = document.getElementById('floating-back-btn');
    function togglePreview() {
        document.body.classList.toggle('preview-mode');
        previewBtn.textContent = document.body.classList.contains('preview-mode') ? '❌ Exit Preview' : '👁 Preview';
    }
    previewBtn?.addEventListener('click', togglePreview);
    floatingBackBtn?.addEventListener('click', togglePreview);

    document.getElementById('btn-back')?.addEventListener('click', () => window.history.back());
    document.getElementById('btn-save')?.addEventListener('click', () => {
        localStorage.setItem('smartbazaar_page_content', canvas.innerHTML);
        alert('Page saved successfully!');
    });

    function rgbToHex(rgb) {
        if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return '#27272a';
        if (rgb.startsWith('#')) return rgb;
        const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return '#27272a';
        return "#" + [match[1], match[2], match[3]].map(x => ("0" + parseInt(x).toString(16)).slice(-2)).join('');
    }

    saveState();
});
