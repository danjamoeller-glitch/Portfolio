/* ========================================
   GLOBAL
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    initMenu();
    initCustomCursor();
    initSmoothAnchors();
    initWorkInteractions();
    initAdaptiveHeader();

});


/* ========================================
   BURGER MENU
======================================== */

function initMenu() {

    const menuToggle = document.querySelector(".menu-toggle");
    const menuOverlay = document.querySelector(".menu-overlay");
    const menuClose = document.querySelector(".menu-close");
    const menuLinks = document.querySelectorAll(".menu-links a");

    if (!menuToggle || !menuOverlay) return;


    function openMenu() {

        menuOverlay.classList.add("is-open");
        document.body.classList.add("menu-open");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

    }


    function closeMenu() {

        menuOverlay.classList.remove("is-open");
        document.body.classList.remove("menu-open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    function toggleMenu() {

        const isOpen =
            menuOverlay.classList.contains("is-open");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }

    }


    menuToggle.addEventListener(
        "click",
        toggleMenu
    );


    if (menuClose) {

        menuClose.addEventListener(
            "click",
            closeMenu
        );

    }


    menuLinks.forEach(link => {

        link.addEventListener(
            "click",
            closeMenu
        );

    });


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {
                closeMenu();
            }

        }
    );

}


/* ========================================
   ADAPTIVE HEADER / BURGER
   Schwarz auf hell
   Weiß auf dunkel
======================================== */

function initAdaptiveHeader() {

    const header =
        document.querySelector(".site-header");

    const menuToggle =
        document.querySelector(".menu-toggle");

    const logo =
        document.querySelector(".site-logo");

    if (!header || !menuToggle) return;


    function getVisibleBackground(element) {

        let current = element;

        while (
            current &&
            current !== document.documentElement
        ) {

            const style =
                window.getComputedStyle(current);

            const background =
                style.backgroundColor;

            if (
                background &&
                background !== "transparent" &&
                background !== "rgba(0, 0, 0, 0)"
            ) {
                return background;
            }

            current =
                current.parentElement;

        }

        return window.getComputedStyle(
            document.body
        ).backgroundColor;

    }


    function isDarkBackground(background) {

        if (!background) return false;

        const rgb =
            background.match(/\d+(\.\d+)?/g);

        if (!rgb || rgb.length < 3) {
            return false;
        }

        const red =
            Number(rgb[0]);

        const green =
            Number(rgb[1]);

        const blue =
            Number(rgb[2]);


        const brightness =
            (
                red * 299 +
                green * 587 +
                blue * 114
            ) / 1000;


        return brightness < 145;

    }


    function updateHeaderColor() {

        /*
        Prüft die Fläche direkt unter
        dem Burger-Menü.
        */

        const rect =
            menuToggle.getBoundingClientRect();

        const x =
            rect.left +
            rect.width / 2;

        const y =
            rect.top +
            rect.height / 2;


        /*
        Header kurz aus der Trefferprüfung
        nehmen, damit das Element darunter
        gefunden wird.
        */

        const oldPointerEvents =
            header.style.pointerEvents;

        header.style.pointerEvents =
            "none";


        const elementUnderHeader =
            document.elementFromPoint(
                x,
                y
            );


        header.style.pointerEvents =
            oldPointerEvents;


        if (!elementUnderHeader) return;


        /*
        Work Hero ist schwarz, aber manche
        Sections nutzen Backgrounds über
        Klassen oder Verläufe.

        Deshalb zuerst bekannte dunkle
        Bereiche prüfen.
        */

        const darkSection =
            elementUnderHeader.closest(
                [
                    ".work-hero",
                    ".work-statement",
                    ".approach-section",
                    ".design-thinking"
                ].join(",")
            );


        let dark = false;


        if (darkSection) {

            dark = true;

        } else {

            const background =
                getVisibleBackground(
                    elementUnderHeader
                );

            dark =
                isDarkBackground(
                    background
                );

        }


        if (dark) {

            /* WHITE */

            menuToggle.style.borderColor =
                "rgba(242, 238, 230, .55)";

            menuToggle.style.color =
                "#f2eee6";


            const burgerLines =
                menuToggle.querySelectorAll(
                    "span"
                );


            burgerLines.forEach(line => {

                line.style.backgroundColor =
                    "#f2eee6";

            });


            if (logo) {

                logo.style.color =
                    "#f2eee6";

            }

        } else {

            /* BLACK */

            menuToggle.style.borderColor =
                "rgba(17, 17, 17, .35)";

            menuToggle.style.color =
                "#111111";


            const burgerLines =
                menuToggle.querySelectorAll(
                    "span"
                );


            burgerLines.forEach(line => {

                line.style.backgroundColor =
                    "#111111";

            });


            if (logo) {

                logo.style.color =
                    "#111111";

            }

        }

    }


    /*
    Direkt beim Laden.
    */

    updateHeaderColor();


    /*
    Beim Scrollen automatisch wechseln.
    */

    window.addEventListener(
        "scroll",
        updateHeaderColor,
        {
            passive: true
        }
    );


    /*
    Auch bei Resize neu prüfen.
    */

    window.addEventListener(
        "resize",
        updateHeaderColor
    );

}


/* ========================================
   CUSTOM CURSOR
======================================== */

function initCustomCursor() {

    const cursor =
        document.querySelector(".custom-cursor");

    if (!cursor) return;


    const cursorLabel =
        cursor.querySelector(".cursor-label");


    let mouseX =
        window.innerWidth / 2;

    let mouseY =
        window.innerHeight / 2;

    let cursorX =
        mouseX;

    let cursorY =
        mouseY;


    cursor.style.opacity =
        "0";


    document.addEventListener(
        "mousemove",
        event => {

            mouseX =
                event.clientX;

            mouseY =
                event.clientY;

            cursor.style.opacity =
                "1";


            updateCursorContrast(
                event.clientX,
                event.clientY
            );

        }
    );


    function animateCursor() {

        cursorX +=
            (mouseX - cursorX) * 0.18;

        cursorY +=
            (mouseY - cursorY) * 0.18;


        cursor.style.left =
            cursorX + "px";

        cursor.style.top =
            cursorY + "px";


        requestAnimationFrame(
            animateCursor
        );

    }


    animateCursor();


    /* ====================================
       CURSOR CONTRAST
    ==================================== */

    function updateCursorContrast(x, y) {

        cursor.style.pointerEvents =
            "none";


        const element =
            document.elementFromPoint(
                x,
                y
            );


        if (!element) return;


        /*
        Bekannte dunkle Flächen zuerst.
        */

        const darkArea =
            element.closest(
                [
                    ".work-hero",
                    ".work-statement",
                    ".approach-section",
                    ".design-thinking",
                    ".portfolio-image.dark"
                ].join(",")
            );


        if (darkArea) {

            setLightCursor();

            return;

        }


        const background =
            findVisibleBackground(
                element
            );


        if (!background) {

            setDarkCursor();

            return;

        }


        const rgb =
            background.match(
                /\d+(\.\d+)?/g
            );


        if (
            !rgb ||
            rgb.length < 3
        ) {

            setDarkCursor();

            return;

        }


        const red =
            Number(rgb[0]);

        const green =
            Number(rgb[1]);

        const blue =
            Number(rgb[2]);


        const brightness =
            (
                red * 299 +
                green * 587 +
                blue * 114
            ) / 1000;


        if (brightness < 145) {

            setLightCursor();

        } else {

            setDarkCursor();

        }

    }


    function findVisibleBackground(element) {

        let current =
            element;


        while (
            current &&
            current !==
            document.documentElement
        ) {

            const style =
                window.getComputedStyle(
                    current
                );


            const background =
                style.backgroundColor;


            if (
                background &&
                background !==
                "transparent" &&
                background !==
                "rgba(0, 0, 0, 0)"
            ) {

                return background;

            }


            current =
                current.parentElement;

        }


        return window
            .getComputedStyle(
                document.body
            )
            .backgroundColor;

    }


    function setLightCursor() {

        cursor.dataset.contrast =
            "light";

        cursor.style.background =
            "#f2eee6";

        cursor.style.color =
            "#111111";

        cursor.style.borderColor =
            cursor.classList.contains(
                "is-active"
            )
                ? "rgba(242,238,230,.55)"
                : "transparent";

    }


    function setDarkCursor() {

        cursor.dataset.contrast =
            "dark";

        cursor.style.background =
            "#111111";

        cursor.style.color =
            "#f2eee6";

        cursor.style.borderColor =
            cursor.classList.contains(
                "is-active"
            )
                ? "rgba(17,17,17,.18)"
                : "transparent";

    }


    /* ====================================
       VIEW ELEMENTS
    ==================================== */

    const viewElements =
        document.querySelectorAll(
            [
                "[data-cursor]",
                ".work-image-link",
                ".portfolio-image",
                ".hero-image",
                ".about-image",
                ".about-portrait",
                ".photo-card"
            ].join(",")
        );


    viewElements.forEach(
        element => {

            element.addEventListener(
                "mouseenter",
                event => {

                    const label =
                        element.dataset
                            .cursor ||
                        "VIEW";


                    cursor.classList.add(
                        "is-active"
                    );


                    if (cursorLabel) {

                        cursorLabel.textContent =
                            label;

                    }


                    updateCursorContrast(
                        event.clientX,
                        event.clientY
                    );

                }
            );


            element.addEventListener(
                "mouseleave",
                event => {

                    cursor.classList.remove(
                        "is-active"
                    );


                    updateCursorContrast(
                        event.clientX,
                        event.clientY
                    );

                }
            );

        }
    );


    /* ====================================
       LINKS + BUTTONS
    ==================================== */

    const links =
        document.querySelectorAll(
            "a, button"
        );


    links.forEach(link => {

        link.addEventListener(
            "mouseenter",
            () => {

                cursor.style.transform =
                    "translate(-50%, -50%) scale(1.65)";

            }
        );


        link.addEventListener(
            "mouseleave",
            () => {

                cursor.style.transform =
                    "translate(-50%, -50%) scale(1)";

            }
        );

    });


    document.addEventListener(
        "mouseleave",
        () => {

            cursor.style.opacity =
                "0";

        }
    );


    document.addEventListener(
        "mouseenter",
        () => {

            cursor.style.opacity =
                "1";

        }
    );

}


/* ========================================
   SMOOTH ANCHORS
======================================== */

function initSmoothAnchors() {

    const anchorLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    anchorLinks.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const href =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !href ||
                    href === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        href
                    );


                if (!target) return;


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });

}


/* ========================================
   WORK INTERACTIONS
======================================== */

function initWorkInteractions() {

    const workPage =
        document.body.classList.contains(
            "work-page"
        );


    if (!workPage) return;


    const images =
        document.querySelectorAll(
            ".portfolio-image"
        );


    images.forEach(image => {

        image.addEventListener(
            "mouseenter",
            () => {

                image.style.transform =
                    "scale(.992)";

            }
        );


        image.addEventListener(
            "mouseleave",
            () => {

                image.style.transform =
                    "scale(1)";

            }
        );

    });

}


/* ========================================
   REDUCED MOTION
======================================== */

const reducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );


if (reducedMotion.matches) {

    document.documentElement.style
        .scrollBehavior =
        "auto";

}