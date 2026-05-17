// ============ PDF.JS SETUP ============
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// ============ BURGER MENU ============
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const allNavLinks = document.querySelectorAll('.nav-link');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ============ ACTIVE NAV ON SCROLL ============
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) current = section.id;
    });
    allNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });

    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.style.boxShadow = '0 5px 20px rgba(0,0,0,0.08)';
    } else {
        nav.style.boxShadow = 'none';
    }
});

// ============ FILTER BAR ============
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const emptyState = document.getElementById('emptyState');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Toggle active class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        let visibleCount = 0;

        projectCards.forEach(card => {
            const cat = card.getAttribute('data-category');
            if (filter === 'all' || cat === filter) {
                card.classList.remove('hide');
                visibleCount++;
            } else {
                card.classList.add('hide');
            }
        });

        // Show empty state if nothing matches
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    });
});

// ============ MODAL ============
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

function openModal(content) {
    modalBody.innerHTML = content;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModalFunc() {
    modal.classList.remove('active');
    modalBody.innerHTML = '';
    document.body.style.overflow = '';
}
closeModal.addEventListener('click', closeModalFunc);
modal.addEventListener('click', e => {
    if (e.target === modal) closeModalFunc();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModalFunc();
});

// ============ CARD CLICK HANDLERS ============
projectCards.forEach(card => {
    card.addEventListener('click', () => {
        const pdf = card.getAttribute('data-pdf');
        const img = card.getAttribute('data-img');
        const video = card.getAttribute('data-video');
        const file = card.getAttribute('data-file');

        if (pdf) {
            openModal(`<iframe src="${encodeURI(pdf)}#toolbar=1" title="PDF Viewer"></iframe>`);
        } else if (img) {
            openModal(`<img src="${encodeURI(img)}" alt="Project">`);
        } else if (video) {
            openModal(`
                <iframe src="https://www.youtube.com/embed/${video}?autoplay=1&rel=0"
                    title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowfullscreen></iframe>
            `);
        } else if (file) {
            const fileName = file.split('/').pop();
            openModal(`
                <div class="modal-file-info">
                    <i class="bi bi-file-earmark-arrow-down"></i>
                    <h3>${fileName}</h3>
                    <p style="color:#666;max-width:500px;">
                        This file format can't be previewed in the browser.
                        Click below to download &amp; open in compatible software.
                    </p>
                    <a href="${encodeURI(file)}" download>
                        <i class="bi bi-download"></i> Download File
                    </a>
                </div>
            `);
        }
    });
});

// ============ PDF THUMBNAIL GENERATION ============
async function renderPdfThumb(container) {
    const pdfSrc = container.getAttribute('data-pdf-src');
    if (!pdfSrc || !window.pdfjsLib) return;

    try {
        const pdf = await pdfjsLib.getDocument(encodeURI(pdfSrc)).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const containerWidth = container.offsetWidth || 400;
        const scale = (containerWidth * 1.5) / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;

        container.appendChild(canvas);
        container.classList.add('loaded');
    } catch (err) {
        console.warn('PDF thumbnail failed for:', pdfSrc, err.message);
    }
}

const thumbObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            renderPdfThumb(entry.target);
            obs.unobserve(entry.target);
        }
    });
}, { rootMargin: '200px' });

document.querySelectorAll('.pdf-thumb').forEach(el => {
    thumbObserver.observe(el);
});

// ============ FADE-IN ON SCROLL ============
const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.skill-card, .contact-item, .social-link')
    .forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });

console.log('%c✨ Welcome to Rupali Lohat\'s Portfolio ✨', 'color:#c9a96e;font-size:18px;font-weight:bold;');