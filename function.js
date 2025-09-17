// set initial date in cover letter
document.getElementById('cover-date').innerText = (new Date()).toLocaleDateString();

// Toggle dropdown behaviour
function toggleDropdown(el, ev){
    ev.stopPropagation();
    document.querySelectorAll('.icon-btn').forEach(btn => { if(btn !== el) btn.classList.remove('open'); });
    el.classList.toggle('open');
}
// close dropdowns on outside click
document.addEventListener('click', function(e){
    if(!e.target.closest('nav')) {
        document.querySelectorAll('.icon-btn').forEach(btn => btn.classList.remove('open'));
    }
});

// THEME FUNCTIONS
function setTheme(theme){
    switch(theme){
        case 'dark':
            document.documentElement.style.setProperty('--primary','#2d3436');
            document.documentElement.style.setProperty('--secondary','#636e72');
            document.documentElement.style.setProperty('--glass-bg','rgba(28,28,30,0.72)');
            document.body.style.background = 'linear-gradient(135deg,#0f1724,#1b2430)';
            document.body.style.color = '#e9eefb';
            break;
        case 'light':
            document.documentElement.style.setProperty('--primary','#007aff');
            document.documentElement.style.setProperty('--secondary','#5ac8fa');
            document.documentElement.style.setProperty('--glass-bg','rgba(255,255,255,0.62)');
            document.body.style.background = 'linear-gradient(135deg,#f5f7fa,#e6eefc)';
            document.body.style.color = '#1c1c1e';
            break;
        case 'green':
            document.documentElement.style.setProperty('--primary','#34c759');
            document.documentElement.style.setProperty('--secondary','#81e89d');
            document.documentElement.style.setProperty('--glass-bg','rgba(245,255,247,0.78)');
            document.body.style.background = 'linear-gradient(135deg,#f1fbf3,#ddf5e0)';
            document.body.style.color = '#0b3d1c';
            break;
        case 'blue':
            document.documentElement.style.setProperty('--primary','#0a84ff');
            document.documentElement.style.setProperty('--secondary','#64d2ff');
            document.documentElement.style.setProperty('--glass-bg','rgba(235,246,255,0.85)');
            document.body.style.background = 'linear-gradient(135deg,#e7f4ff,#d8ecff)';
            document.body.style.color = '#033a66';
            break;
    }
}

// FONT FUNCTIONS
function setFont(f){
    switch(f){
        case 'sans':
            document.body.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif";
            break;
        case 'serif':
            document.body.style.fontFamily = "Georgia, 'Times New Roman', Times, serif";
            break;
        case 'mono':
            document.body.style.fontFamily = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";
            break;
    }
}

// UTILS: build a full standalone HTML for download (includes styles)
function buildFullHtml(titleText, innerHtml){
    // capture styles (first <style> tag only for simplicity)
    const styles = Array.from(document.querySelectorAll('style')).map(s => s.innerHTML).join('\n');
    const fa = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">';
    const head = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>${titleText}</title>
        ${fa}
        <style>${styles} body{margin:20px;} </style>
      `;
    return '<!doctype html><html><head>' + head + '</head><body>' + innerHtml + '</body></html>';
}

// DOWNLOAD HTML (single section)
function downloadHTML(sectionId, filename){
    const sec = document.getElementById(sectionId);
    if(!sec){ alert('Section not found'); return; }
    const html = buildFullHtml(filename, sec.outerHTML);
    const blob = new Blob([html], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    document.querySelectorAll('.icon-btn').forEach(b => b.classList.remove('open'));
}

// DOWNLOAD DOCX (uses html-docx-js)
function downloadDOC(sectionId, filename){
    const sec = document.getElementById(sectionId);
    if(!sec){ alert('Section not found'); return; }
    const html = buildFullHtml(filename, sec.outerHTML);
    try {
        const converted = htmlDocx.asBlob(html);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(converted);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    } catch (err){
        alert('DOCX conversion failed in this browser. Try HTML or PDF download.');
        console.error(err);
    }
    document.querySelectorAll('.icon-btn').forEach(b => b.classList.remove('open'));
}

// DOWNLOAD PDF (uses jsPDF html)
function downloadPDF(sectionId, filename){
    const sec = document.getElementById(sectionId);
    if(!sec){ alert('Section not found'); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');
    // clone node to avoid UI overlays
    const clone = sec.cloneNode(true);
    // put clone in a temp container to preserve layout
    const temp = document.createElement('div');
    temp.style.width = '780px';
    temp.style.padding = '18px';
    temp.appendChild(clone);
    document.body.appendChild(temp);
    doc.html(temp, {
        callback: function(pdf){
            pdf.save(filename);
            document.body.removeChild(temp);
        },
        x: 12, y: 12, html2canvas: { scale: 1.2 }, margin: [12,12,12,12]
    });
    document.querySelectorAll('.icon-btn').forEach(b => b.classList.remove('open'));
}

// Convenience wrappers used in dropdown onclick
function downloadHTMLWrapper(sectionId, filename){ downloadHTML(sectionId, filename); }
function downloadDOCWrapper(sectionId, filename){ downloadDOC(sectionId, filename); }
function downloadPDFWrapper(sectionId, filename){ downloadPDF(sectionId, filename); }

// For backward-compatibility with inline attr calls in HTML
function downloadHTML(sectionId, filename){ downloadHTMLWrapper(sectionId, filename); }
function downloadDOC(sectionId, filename){ downloadDOCWrapper(sectionId, filename); }
function downloadPDF(sectionId, filename){ downloadPDFWrapper(sectionId, filename); }

// set initial defaults
setTheme('light');
setFont('sans');
