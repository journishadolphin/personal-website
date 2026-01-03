// GSAP Animation Script - Run first
document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.error('GSAP is not loaded. Please include GSAP CDN in your HTML');
        return;
    }

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // ====== Image Flip Animation ======
    const imageMotion = document.querySelector('.image-motion');
    if (imageMotion) {
        // Set initial state
        gsap.set(imageMotion, {
            rotateX: 90,
        });

        // Animate on scroll
        gsap.to(imageMotion, {
            rotateX: 0,
            scrollTrigger: {
                trigger: '.section2',
                start: 'top bottom',
                end: 'center center',
                scrub: 1,
                markers: false,
            },
        });
    }

    // ====== Title Animation ======
    const title = document.querySelector('.section3-header h1');
    if (title) {
        gsap.fromTo(title, 
            {
                opacity: 0,
                y: 50,
            }, 
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.section3',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            }
        );
    }

    // ====== Subtitle Animation ======
    const subtitle = document.querySelector('.section3-header p');
    if (subtitle) {
        gsap.fromTo(subtitle,
            {
                opacity: 0,
                y: 30,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: 0.3,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.section3',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            }
        );
    }

    // ====== Feature Cards Animation ======
    const featureCards = document.querySelectorAll('.feature');
    if (featureCards.length > 0) {
        gsap.fromTo(featureCards,
            {
                opacity: 0,
                y: 50,
                scale: 0.9,
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                stagger: 0.2,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.features',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            }
        );
    }

    // ====== Refresh ScrollTrigger after all animations are set ======
    
});

// CodePen Slider Script - Run after GSAP
(() => {
    const track = document.getElementById("track");
    const wrap = track.parentElement;
    const cards = Array.from(track.children);
    const prev = document.getElementById("prev");
    const next = document.getElementById("next");
    const dotsBox = document.getElementById("dots");
    const isMobile = () => matchMedia("(max-width:767px)").matches;
    cards.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.className = "dot";
        dot.onclick = () => activate(i, true);
        dotsBox.appendChild(dot);
    });
    const dots = Array.from(dotsBox.children);
    let current = 0;
    function center(i) {
        const card = cards[i];
        const axis = isMobile() ? "top" : "left";
        const size = isMobile() ? "clientHeight" : "clientWidth";
        const start = isMobile() ? card.offsetTop : card.offsetLeft;
        wrap.scrollTo({
            [axis]: start - (wrap[size] / 2 - card[size] / 2),
            behavior: "smooth"
        });
    }
    function toggleUI(i) {
        cards.forEach((c, k) => c.toggleAttribute("active", k === i));
        dots.forEach((d, k) => d.classList.toggle("active", k === i));
        prev.disabled = i === 0;
        next.disabled = i === cards.length - 1;
    }
    function activate(i, scroll) {
        if (i === current) return;
        current = i;
        toggleUI(i);
        if (scroll) center(i);
    }
    function go(step) {
        activate(Math.min(Math.max(current + step, 0), cards.length - 1), true);
    }
    prev.onclick = () => go(-1);
    next.onclick = () => go(1);
    addEventListener(
        "keydown",
        (e) => {
            if (["ArrowRight", "ArrowDown"].includes(e.key)) go(1);
            if (["ArrowLeft", "ArrowUp"].includes(e.key)) go(-1);
        },
        { passive: true }
    );
    cards.forEach((card, i) => {
        card.addEventListener(
            "mouseenter",
            () => matchMedia("(hover:hover)").matches && activate(i, true)
        );
        card.addEventListener("click", () => activate(i, true));
    });
    let sx = 0,
        sy = 0;
    track.addEventListener(
        "touchstart",
        (e) => {
            sx = e.touches[0].clientX;
            sy = e.touches[0].clientY;
        },
        { passive: true }
    );
    track.addEventListener(
        "touchend",
        (e) => {
            const dx = e.changedTouches[0].clientX - sx;
            const dy = e.changedTouches[0].clientY - sy;
            if (isMobile() ? Math.abs(dy) > 60 : Math.abs(dx) > 60)
                go((isMobile() ? dy : dx) > 0 ? -1 : 1);
        },
        { passive: true }
    );
    if (window.matchMedia("(max-width:767px)").matches) dotsBox.hidden = true;
    addEventListener("resize", () => center(current));
    toggleUI(0);
    center(0);
})();