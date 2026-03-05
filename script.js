const PHONE_NUMBER = "5491171283985";

const menuToggle = document.getElementById("menuToggle");
const mainMenu = document.getElementById("mainMenu");
const contactForm = document.getElementById("contactForm");
const heroCopyBlock = document.querySelector(".hero-copy-block");
const heroMediaWrap = document.querySelector(".hero-media-wrap");
const heroImage = document.querySelector(".hero-img");
const formStatus = document.getElementById("formStatus");

/* ── Menu toggle ── */
if (menuToggle && mainMenu) {
  const closeMenu = () => {
    mainMenu.classList.remove("is-open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = mainMenu.classList.toggle("is-open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });

  mainMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (!mainMenu.classList.contains("is-open")) {
      return;
    }

    const target = event.target;
    if (target instanceof Node && !mainMenu.contains(target) && !menuToggle.contains(target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

/* ── Contact form → WhatsApp ── */
if (contactForm) {
  const nameInput = contactForm.querySelector('input[name="name"]');
  const messageInput = contactForm.querySelector('textarea[name="message"]');
  const nameError = document.getElementById("nameError");
  const messageError = document.getElementById("messageError");

  const setFieldError = (input, errorElement, message) => {
    if (!(input instanceof HTMLElement) || !(errorElement instanceof HTMLElement)) {
      return;
    }

    input.setAttribute("aria-invalid", "true");
    errorElement.textContent = message;
  };

  const clearFieldError = (input, errorElement) => {
    if (!(input instanceof HTMLElement) || !(errorElement instanceof HTMLElement)) {
      return;
    }

    input.removeAttribute("aria-invalid");
    errorElement.textContent = "";
  };

  const clearStatus = () => {
    if (formStatus) {
      formStatus.textContent = "";
    }
  };

  if (nameInput && nameError) {
    nameInput.addEventListener("input", () => {
      clearFieldError(nameInput, nameError);
      clearStatus();
    });
  }

  if (messageInput && messageError) {
    messageInput.addEventListener("input", () => {
      clearFieldError(messageInput, messageError);
      clearStatus();
    });
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const company = String(formData.get("company") || "").trim();
    const message = String(formData.get("message") || "").trim();

    let hasErrors = false;

    if (nameInput && nameError) {
      clearFieldError(nameInput, nameError);
    }

    if (messageInput && messageError) {
      clearFieldError(messageInput, messageError);
    }

    clearStatus();

    if (!name) {
      hasErrors = true;
      if (nameInput && nameError) {
        setFieldError(nameInput, nameError, "Por favor, completá tu nombre.");
      }
    }

    if (!message) {
      hasErrors = true;
      if (messageInput && messageError) {
        setFieldError(messageInput, messageError, "Por favor, describí tu necesidad.");
      }
    } else if (message.length < 12) {
      hasErrors = true;
      if (messageInput && messageError) {
        setFieldError(messageInput, messageError, "Sumá más detalle para ayudarte mejor (mínimo 12 caracteres).");
      }
    }

    if (hasErrors) {
      if (formStatus) {
        formStatus.textContent = "Revisá los campos marcados para continuar.";
      }
      return;
    }

    const parts = [
      `Hola, soy ${name}.`,
      "Quiero solicitar asistencia técnica con Guerrero e Hijos."
    ];

    if (company) {
      parts.push(`Empresa: ${company}.`);
    }

    if (message) {
      parts.push(`Detalle: ${message}.`);
    }

    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(parts.join(" "))}`;

    window.open(whatsappUrl, "_blank");

    if (formStatus) {
      formStatus.textContent = "Abrimos WhatsApp en una nueva pestaña para continuar la consulta.";
    }
  });
}

/* ── Sync hero media height with copy block ── */
const syncHeroMediaHeight = () => {
  if (!heroCopyBlock || !heroMediaWrap || !heroImage) {
    return;
  }

  if (window.innerWidth <= 1080) {
    heroMediaWrap.style.removeProperty("height");
    heroImage.style.removeProperty("height");
    return;
  }

  const copyHeight = Math.ceil(heroCopyBlock.getBoundingClientRect().height);
  heroMediaWrap.style.height = `${copyHeight}px`;
  heroImage.style.height = `${copyHeight}px`;
};

let resizeTimer;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(syncHeroMediaHeight, 120);
});

window.addEventListener("load", syncHeroMediaHeight);
syncHeroMediaHeight();

/* ── Hide mobile WhatsApp CTA on scroll up ── */
const mobileWaCta = document.querySelector(".mobile-wa-cta");

if (mobileWaCta) {
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY < lastScrollY) {
      mobileWaCta.style.opacity = "0";
      mobileWaCta.style.pointerEvents = "none";
    } else {
      mobileWaCta.style.opacity = "1";
      mobileWaCta.style.pointerEvents = "auto";
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
}

/* ── Reveal animations with IntersectionObserver ── */
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
}
