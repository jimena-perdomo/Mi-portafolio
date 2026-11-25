(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");

  // Marca la página actual en la navegación compartida.
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".topbar nav a").forEach(link => {
    const targetPage = link.getAttribute("href");
    if (targetPage === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });


  if (!("IntersectionObserver" in window) || reducedMotion) {
    revealItems.forEach(item => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 5, 4) * 75}ms`;
      observer.observe(item);
    });
  }


  // Animación sutil de entrada para todas las imágenes del portafolio.
  const images = document.querySelectorAll("img");
  images.forEach((img, index) => {
    img.classList.add("image-motion");
    img.style.setProperty("--image-delay", `${Math.min(index, 4) * 65}ms`);
  });

  if (!reducedMotion && "IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("image-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });

    images.forEach(img => imageObserver.observe(img));
  } else {
    images.forEach(img => img.classList.add("image-visible"));
  }

  // Evita que una imagen rota deje un espacio visual sin explicación.
  images.forEach(img => {
    img.addEventListener("error", () => img.classList.add("image-load-error"), { once: true });
  });

  // Navegación con View Transitions cuando el navegador lo admite.
  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    const target = new URL(link.href, window.location.href);
    if (target.origin !== window.location.origin) return;
    link.addEventListener("click", event => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!document.startViewTransition || reducedMotion) return;
      event.preventDefault();
      document.startViewTransition(() => {
        window.location.href = target.href;
      });
    });
  });
})();
