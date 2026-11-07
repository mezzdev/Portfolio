const sfx = new Audio("assets/click.mp3");
sfx.volume = 0.7;

document.addEventListener("click", () => {
    sfx.currentTime = 0;
    sfx.play();
});

const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

const EASE = 0.15;
const GROW = 1.3;

let mx = innerWidth / 2;
let my = innerHeight / 2;

let rx = mx;
let ry = my;

let scale = 1;
let want = 1;

if (matchMedia('(pointer: fine)').matches) {

    addEventListener('pointermove', e => {
        mx = e.clientX;
        my = e.clientY;
    }, { passive: true });

    addEventListener('pointerover', e => {
        want = e.target.closest('a, button, [data-cursor-hover]') ? GROW : 1;
    });

    function loop() {
        rx += (mx - rx) * EASE;
        ry += (my - ry) * EASE;

        scale += (want - scale) * 0.12;

        dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;

        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${scale})`;

        requestAnimationFrame(loop);
    }

    loop();
}

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

let menuOpen = false;

if (window.innerWidth <= 600) {
    gsap.set(navLinks, {
        display: "none",
        opacity: 0,
        y: -15
    });
}

menuToggle.addEventListener("click", () => {
    if (window.innerWidth > 600) return;

    if (!menuOpen) {
        menuOpen = true;
        menuToggle.textContent = "✕";

        gsap.set(navLinks, { display: "flex" });

        gsap.to(navLinks, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power3.out"
        });

        gsap.from(".nav-links a", {
            opacity: 0,
            y: -8,
            stagger: 0.07,
            duration: 0.3,
            ease: "power2.out"
        });

    } else {
        menuOpen = false;
        menuToggle.textContent = "☰";

        gsap.to(navLinks, {
            opacity: 0,
            y: -15,
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
                gsap.set(navLinks, { display: "none" });
            }
        });
    }
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        if (!menuOpen) return;

        menuOpen = false;
        menuToggle.textContent = "☰";

        gsap.to(navLinks, {
            opacity: 0,
            y: -15,
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
                gsap.set(navLinks, { display: "none" });
            }
        });
    });
});