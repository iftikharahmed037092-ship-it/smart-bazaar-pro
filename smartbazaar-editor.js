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
            const item = header.parentElement;
            item.classList.toggle('open');
        });
    });

    projectTitleInput.value = localStorage.getItem('smartbazaar_project_name') || 'My_Awesome_Page';
    projectTitleInput.addEventListener('input', (e) => localStorage.setItem('smartbazaar_project_name', e.target.value));

    // اکیلے بلاکس ایڈ کرنا (بغیر کسی فکسڈ تصویر کے، خالی امیج باکس)
    document.querySelectorAll('.draggable-item').forEach(item => {
        item.addEventListener('click', () => {
            const type = item.getAttribute('data-type');
            if (placeholder) placeholder.style.display = 'none';
            
            if (type === 'image') {
                createElement('image', '', '', '#1e1e24', '#ffffff', '16', '12', '6', '100%', 'auto', 'solid', '1', '#3f3f46', '6', 'none');
            } else if (type === 'container' || type === 'card') {
                createElement(type, `Sample ${type.toUpperCase()} Box`, '', '#27272a', '#ffffff', '16', '16', '6', '100%', '100px', 'solid', '1', '#38bdf8', '8', '0 4px 6px rgba(0,0,0,0.3)');
            } else {
                createElement(type, `Sample ${type.toUpperCase()} Text`, '', '#27272a', '#ffffff', '16', '12', '6', '100%', 'auto', 'none', '1', '#3f3f46', '6', 'none');
            }
            rightSidebar.classList.remove('hidden');
        });
    });

    // --- ریڈی میڈ پیٹرنز (Ready-made Sections) ---
    document.querySelectorAll('.pattern-item').forEach(pattern => {
        pattern.addEventListener('click', () => {
            if (placeholder) placeholder.style.display = 'none';
            const patType = pattern.getAttribute('data-pattern');
            
            if (patType === 'hero') {
                createElement('heading', 'Build Your Dream Website Today', '', '#1e1e24', '#38bdf8', '26', '14', '6', '100%', 'auto', 'none', '1', '#3f3f46', '6', 'none');
                createElement('paragraph', 'The ultimate live website builder with responsive grids and elements.', '', '#1e1e24', '#f1f5f9', '14', '10', '4', '100%', 'auto', 'none', '1', '#3f3f46', '6', 'none');
                createElement('button', 'Get Started Now', '', '#2563eb', '#ffffff', '14', '12', '6', '100%', 'auto', 'none', '1', '#3f3f46', '6', '0 4px 10px rgba(37,99,235,0.4)');
            } else if (patType === 'image-box') {
                createElement('image', '', '', '#181b22', '#ffffff', '16', '10', '6', '100%', '180px', 'solid', '1', '#38bdf8', '8', '0 6px 12px rgba(0,0,0,0.4)');
                createElement('heading', 'Professional Web Development', '', '#181b22', '#ffffff', '18', '8', '4', '100%', 'auto', 'none', '1', '#3f3f46', '4', 'none');
            } else if (patType === 'pricing') {
                createElement('heading', 'Pro Plan - $29/mo', '', '#181b22', '#ffffff', '20', '12', '6', '100%', 'auto', 'solid', '1', '#2563eb', '8', '0 8px 16px rgba(0,0,0,0.4)');
                createElement('paragraph', 'Includes unlimited blocks, custom CSS dimensions, and instant export.', '', '#181b22', '#94a3b8', '14', '8', '4', '100%', 'auto', 'none', '1', '#2d3748', '6', 'none');
                createElement('button', 'Choose Plan', '', '#10b981', '#ffffff', '14', '10', '6', '100%', 'auto', 'none', '1', '#3f3f46', '6', 'none');
            } else if (patType === 'testimonial') {
                createElement('paragraph', '"This builder completely changed how fast I launch client sites. Absolutely incredible!"', '', '#252833', '#e2e8f0', '14', '14', '6', '100%', 'auto', 'dashed', '1', '#38bdf8', '8', '0 4px 12px rgba(0,0,0,0.3)');
                createElement('heading', '- Alex Johnson, Developer', '', '#252833', '#38bdf8', '12', '6', '4', '100%', 'auto', 'none', '1', '#3f3f46', '4', 'none');
            } else if (patType === 'cta') {
                createElement('heading', 'Ready to Scale Your Business?', '', '#1e293b', '#ffffff', '20', '12', '6', '100%', 'auto', 'solid', '1', '#3b82f6', '8', '0 8px 20px rgba(59,130,246,0.3)');
                createElement('button', 'Start Free Trial', '', '#3b82f6', '#ffffff', '14', '10', '6', '100%', 'auto', 'none', '1', '#3f3f46', '6', 'none');
            }
            
            rightSidebar.classList.remove('hidden');
        });
    });

    function createElement(type, text, imgSrc = '', bgColor = '#27272a', color = '#ffffff', fontSize = '16', padding = '12', margin = '6', width = '100%', height = 'auto', bStyle = 'none', bWidth = '1', bColor = '#3f3f46', radius = '6', shadow = 'none') {
        elementCounter++;
        const el = document.createElement('div');
        el.className = 'canvas-element';
        el.id = `el-${elementCounter}`;
        el.setAttribute('data-type', type);
        
        if (type === 'image') {
            if (imgSrc) {
                const img = document.createElement('img');
                img.className = 'canvas-img-box';
                img.src = imgSrc;
                el.appendChild(img);
            } else {
                const placeholderBox = document.createElement('div');
                placeholderBox.className = 'empty-img-placeholder';
                placeholderBox.innerHTML = '<span>🖼 No Image Selected</span><small>Paste image URL in right panel</small>';
                el.appendChild(placeholderBox);
            }
        } else {
            el.textContent = text;
        }
        
        applyStylesToElement(el, { bgColor, color, fontSize, padding, margin, width, height, bStyle, bWidth, bColor, radius, shadow });

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
    const groupTextContent = document.getElementById('group-text-content');
    const groupImageContent = document.getElementById('group-image-content');

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
    const boxShadowInput = document.getElementById('prop-box-shadow');

    function syncPropsToForm() {
        if (!selectedElement) return;
        const comp = window.getComputedStyle(selectedElement);
        const type = selectedElement.getAttribute('data-type');

        if (type === 'image') {
            groupTextContent.style.display = 'none';
            groupImageContent.style.display = 'block';
            const imgEl = selectedElement.querySelector('img');
            imageInput.value = imgEl ? imgEl.src : '';
        } else {
            groupTextContent.style.display = 'block';
            groupImageContent.style.display = 'none';
            textInput.value = selectedElement.textContent;
        }

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
        boxShadowInput.value = comp.boxShadow !== 'none' ? comp.boxShadow : 'none';
    }

    textInput?.addEventListener('input', (e) => { if (selectedElement && selectedElement.getAttribute('data-type') !== 'image') { selectedElement.textContent = e.target.value; updateLayers(); } });
    
    imageInput?.addEventListener('input', (e) => { 
        if (selectedElement && selectedElement.getAttribute('data-type') === 'image') { 
            const url = e.target.value.trim();
            selectedElement.innerHTML = ''; // صاف کریں
            if (url) {
                const img = document.createElement('img');
                img.className = 'canvas-img-box';
                img.src = url;
                selectedElement.appendChild(img);
            } else {
                const placeholderBox = document.createElement('div');
                placeholderBox.className = 'empty-img-placeholder';
                placeholderBox.innerHTML = '<span>🖼 No Image Selected</span><small>Paste image URL in right panel</small>';
                selectedElement.appendChild(placeholderBox);
            }
        } 
    });

    bgColorInput?.addEventListener('input', (e) => { if (selectedElement) selectedElement.style.backgroundColor = e.target.value; });
    textColorInput?.addEventListener('input', (e) => { if (selectedElement) selectedElement.style.color = e.target.value; });
    fontSizeInput?.addEventListener('input', (e) => { if (selectedElement) selectedElement.style.fontSize = e.target.value + 'px'; });
    widthInput?.addEventListener('input', (e) => { if (selectedElement) selectedElement.style.width = e.target.value; });
    heightInput?.addEventListener('input', (e) => { if (selectedElement) selectedElement.style.height = e.target.value; });
    paddingInput?.addEventListener('input', (e) => { if (selectedElement) selectedElement.style.padding = e.target.value + 'px'; });
    marginInput?.addEventListener('input', (e) => { if (selectedElement) selectedElement.style.margin = e.target.value + 'px'; });
    borderStyleInput?.addEventListener('change', (e) => { if (selectedElement) selectedElement.style.borderStyle = e.target.value; });
    borderWidthInput?.addEventListener('input', (e) => { if (selectedElement) selectedElement.style.borderWidth = e.target.value + 'px'; });
    borderColorInput?.addEventListener('input', (e) => { if (selectedElement) selectedElement.style.borderColor = e.target.value; });
    radiusInput?.addEventListener('input', (e) => { if (selectedElement) selectedElement.style.borderRadius = e.target.value + 'px'; });
    boxShadowInput?.addEventListener('change', (e) => { if (selectedElement) selectedElement.style.boxShadow = e.target.value; });

    document.getElementById('btn-delete-el')?.addEventListener('click', () => {
        if (!selectedElement) return alert('Please select an element first!');
        selectedElement.remove();
        selectedElement = null;
        updateLayers();
        rightSidebar.classList.add('hidden');
    });

    document.getElementById('btn-duplicate-el')?.addEventListener('click', () => {
        if (!selectedElement) return alert('Please select an element first!');
        const comp = window.getComputedStyle(selectedElement);
        const type = selectedElement.getAttribute('data-type');
        const imgEl = selectedElement.querySelector('img');
        
        createElement(
            type,
            selectedElement.textContent,
            imgEl ? imgEl.src : '',
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
            comp.boxShadow
        );
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

});
