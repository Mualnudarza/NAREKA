/* ═══════════════════════════════════════════════════
   NAREKA — Darwanza Alif · script.js
   Pure vanilla JS — no frameworks
   ═══════════════════════════════════════════════════ */

/* ── NAVBAR SCROLL SHADOW ───────────────────────────── */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── HAMBURGER MOBILE MENU ──────────────────────────── */
const hamburger = document.getElementById('nav-hamburger');
const mobileNav = document.getElementById('mobile-nav');

if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        mobileNav.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileNav.classList.remove('open');
            hamburger.setAttribute('aria-expanded', false);
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !mobileNav.contains(e.target)) {
            hamburger.classList.remove('open');
            mobileNav.classList.remove('open');
            hamburger.setAttribute('aria-expanded', false);
        }
    });
}

/* ── SCROLL REVEAL (INTERSECTION OBSERVER) ──────────── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, Number(delay));
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.tl-item, .bento-card, .article-card').forEach((el, i) => {
    el.dataset.delay = (i % 4) * 75;
    revealObserver.observe(el);
});

/* ── PROJECT CAROUSEL ───────────────────────────────── */
const wrapper = document.querySelector('.projects-wrapper');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

if (wrapper && prevBtn && nextBtn) {
    const getScrollAmount = () => {
        const card = wrapper.querySelector('.project-card');
        return card ? card.offsetWidth + 24 : 0; // 24 = gap
    };

    nextBtn.addEventListener('click', () => {
        wrapper.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
        wrapper.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    // Touch / swipe support
    let touchStartX = 0;

    wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
        const delta = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 40) {
            wrapper.scrollBy({ left: delta > 0 ? getScrollAmount() : -getScrollAmount(), behavior: 'smooth' });
        }
    }, { passive: true });
}

/* ── CONTACT FORM ───────────────────────────────────── */
function handleSend() {
    const name = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const subject = document.getElementById('f-subject').value.trim();
    const msg = document.getElementById('f-msg').value.trim();

    if (!name || !email || !msg) {
        alert('Mohon lengkapi nama, email, dan pesan terlebih dahulu.');
        return;
    }

    const mailtoLink =
        `mailto:darwanzaalif@gmail.com` +
        `?subject=${encodeURIComponent(subject || 'Pesan dari NAREKA Website')}` +
        `&body=${encodeURIComponent('Dari: ' + name + ' (' + email + ')\n\n' + msg)}`;

    window.location.href = mailtoLink;
}

// Expose to HTML onclick
window.handleSend = handleSend;

/* ── SMOOTH ANCHOR SCROLL (with offset for fixed nav) ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 72; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});