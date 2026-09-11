gsap.registerPlugin(ScrollTrigger);


// HERO HEADLINE

gsap.to(".hero-title", {
    xPercent: -18,
    ease: "none",

    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
    }
});


// HERO BESCHREIBUNG

gsap.to(".hero-description", {
    y: -100,
    ease: "none",

    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
    }
});


// ABOUT HEADLINE

gsap.from(".intro h2", {
    x: -180,
    opacity: 0,
    ease: "none",

    scrollTrigger: {
        trigger: ".intro",
        start: "top 80%",
        end: "top 25%",
        scrub: 1
    }
});


// ABOUT TEXT

gsap.from(".intro p", {
    y: 120,
    opacity: 0,

    scrollTrigger: {
        trigger: ".intro",
        start: "top 70%",
        end: "top 30%",
        scrub: 1
    }
});


// SELECTED WORK

gsap.from(".work-intro h2", {
    xPercent: 25,
    ease: "none",

    scrollTrigger: {
        trigger: ".work-intro",
        start: "top bottom",
        end: "top 20%",
        scrub: 1
    }
});


// SERVICES

gsap.from(".services h2", {
    y: 150,
    opacity: 0,

    scrollTrigger: {
        trigger: ".services",
        start: "top 75%",
        end: "top 25%",
        scrub: 1
    }
});


// CONTACT

gsap.from(".contact h2", {
    scale: 0.8,
    opacity: 0,
    transformOrigin: "left center",

    scrollTrigger: {
        trigger: ".contact",
        start: "top 75%",
        end: "top 25%",
        scrub: 1
    }
});