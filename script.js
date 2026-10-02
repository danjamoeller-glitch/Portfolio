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
 const header = document.querySelector('.site-header');
 if (!header) return;
 const controls = [...header.querySelectorAll('.site-logo, .menu-toggle')];
 function refresh() {
  const old = header.style.pointerEvents;
  header.style.pointerEvents = 'none';
  controls.forEach(control => {
   const rect = control.getBoundingClientRect();
   let under = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
   let dark = false;
   if (under?.closest('.work-hero,.approach-section,.design-thinking,.concept-section')) dark = true;
   else {
    while (under) {
     const value = getComputedStyle(under).backgroundColor;
     const rgb = value.match(/[\d.]+/g);
     if (rgb && rgb.length >= 3 && (rgb.length < 4 || Number(rgb[3]) > .5)) {
      dark = (.299 * Number(rgb[0]) + .587 * Number(rgb[1]) + .114 * Number(rgb[2])) < 145;
      break;
     }
     under = under.parentElement;
    }
   }
   const color = dark ? '#f2eee6' : '#111111';
   control.style.color = color;
   control.style.borderColor = color;
   control.querySelectorAll('span').forEach(line => {
    if (control.classList.contains('menu-toggle')) line.style.backgroundColor = color;
   });
  });
  header.style.pointerEvents = old;
 }
 let queued = false;
 function schedule() { if (queued) return; queued = true; requestAnimationFrame(() => {queued = false; refresh();}); }
 refresh();
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule);
 window.addEventListener('load',refresh);
}

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

            const readerControl = event.target.closest('.portfolio-controls, .portfolio-chapters');
            cursor.style.opacity = readerControl ? "0" : "1";
            if (readerControl) { cursorX = mouseX; cursorY = mouseY; }



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

    const viewElements = Array.from(document.querySelectorAll(
        'a[href], button, summary'
    )).filter(element => element.hasAttribute('data-cursor') ||
        element.matches('.work-image-link, summary') ||
        element.querySelector('img'));



    viewElements.forEach(
        element => {

            element.addEventListener(
                "mouseenter",
                event => {
                    if (element.disabled) return;

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