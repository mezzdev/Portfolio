gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

const splitMainh2 = new SplitText("main h2", {
    type: "chars"
});

const splitPresta = new SplitText(".presta p", {
    type: "words",
    wordsClass: "word"
});

gsap.from("main h1", {
    opacity: 0,
    y: 20,
    duration: 1,
    ease: "power3.out"
});

gsap.from(splitMainh2.chars, {
    opacity: 0,
    y: 20,
    duration: 0.2,
    ease: "power3.out",
    stagger: 0.05
});

gsap.fromTo(".presta h1",
    {
        opacity: 0,
        y: 30
    },
    {
        opacity: 1,
        y: 0,
        duration: 1.9,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".presta",
            start: "top 65%",
            toggleActions: "play none none none"
        }
    }
);

gsap.from(splitPresta.words, {
    opacity: 0,
    y: 35,
    duration: 0.4,
    stagger: 0.12,
    ease: "power1.out",
    scrollTrigger: {
        trigger: ".presta p",
        start: "top 85%",
        toggleActions: "play none none none"
    }
});

gsap.from(".navbar", {
    yPercent: -100,
    duration: 0.6,
    ease: "power3.out"
});

if (window.innerWidth > 600) {
    gsap.from(".nav-links a", {
        opacity: 0,
        y: -15,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.3
    });
}



gsap.set(".service1", {
    opacity: 1,
    y: 0,
    scale: 1
});

gsap.fromTo(".competences h1",
    {
        opacity: 0,
        y: 30
    },
    {
        opacity: 1,
        y: 0,
        duration: 2.6,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".competences",
            start: "top 90%",
            toggleActions: "play none none none"
        }
    }
);

gsap.fromTo(".service1",
    {
        opacity: 0,
        y: 60
    },
    {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".services",
            start: "top 90%"
        }
    }
);

document.querySelectorAll(".service1").forEach((card) => {
    card.addEventListener("mouseenter", () => {
        gsap.to(card, {
            y: -5,
            borderColor: "#000000",
            duration: 0.3,
            ease: "power2.out"
        });
    });

    card.addEventListener("mouseleave", () => {
        gsap.to(card, {
            y: 0,
            borderColor: "#808080",
            duration: 0.3,
            ease: "power2.out"
        });
    });
});
