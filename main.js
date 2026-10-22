const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

if (menuOpenButton && menuCloseButton) {
  menuOpenButton.addEventListener("click", () => {
    document.body.classList.add("show-mobile-menu");
  });

  menuCloseButton.addEventListener("click", () => {
    document.body.classList.remove("show-mobile-menu");
  });

  document.querySelectorAll(".nav-menu .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("show-mobile-menu");
    });
  });
}

const testimonialsCarousel = document.querySelector(".testimonials-carousel");
if (testimonialsCarousel) {
  const viewport = testimonialsCarousel.querySelector(".testimonials-viewport");
  const track = testimonialsCarousel.querySelector(".testimonials-list");
  const previousButton = testimonialsCarousel.querySelector("[data-testimonials-previous]");
  const nextButton = testimonialsCarousel.querySelector("[data-testimonials-next]");
  const toggleButton = testimonialsCarousel.querySelector("[data-testimonials-toggle]");
  const originalSlides = [...track.children];
  const slideCount = originalSlides.length;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentIndex = slideCount;
  let autoplayTimer;
  let pointerStartX = null;
  let isPaused = reducedMotion.matches;

  const clonesBefore = originalSlides.map((slide) => {
    const clone = slide.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.inert = true;
    return clone;
  });
  const clonesAfter = originalSlides.map((slide) => {
    const clone = slide.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.inert = true;
    return clone;
  });
  track.prepend(...clonesBefore);
  track.append(...clonesAfter);

  const updatePosition = (animate = true) => {
    track.style.transition = animate ? "" : "none";
    const firstSlide = track.children[0];
    const secondSlide = track.children[1];
    const slideStep = secondSlide.offsetLeft - firstSlide.offsetLeft;
    track.style.transform = `translateX(-${currentIndex * slideStep}px)`;

    if (!animate) {
      requestAnimationFrame(() => {
        track.style.transition = "";
      });
    }
  };

  const moveNext = () => {
    currentIndex += 1;
    updatePosition();
  };

  const movePrevious = () => {
    currentIndex -= 1;
    updatePosition();
  };

  const stopAutoplay = () => {
    window.clearInterval(autoplayTimer);
    autoplayTimer = undefined;
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (!isPaused) autoplayTimer = window.setInterval(moveNext, 2000);
  };

  const updateToggleButton = () => {
    toggleButton.textContent = isPaused ? "Play" : "Pause";
    toggleButton.setAttribute(
      "aria-label",
      `${isPaused ? "Start" : "Pause"} automatic testimonials`,
    );
  };

  previousButton.addEventListener("click", movePrevious);
  nextButton.addEventListener("click", moveNext);
  toggleButton.addEventListener("click", () => {
    isPaused = !isPaused;
    updateToggleButton();
    startAutoplay();
  });

  viewport.addEventListener("pointerdown", (event) => {
    pointerStartX = event.clientX;
  });
  viewport.addEventListener("pointerup", (event) => {
    if (pointerStartX === null) return;
    const swipeDistance = event.clientX - pointerStartX;
    pointerStartX = null;
    if (Math.abs(swipeDistance) < 40) return;
    if (swipeDistance < 0) moveNext();
    else movePrevious();
  });
  viewport.addEventListener("pointercancel", () => {
    pointerStartX = null;
  });

  track.addEventListener("transitionend", () => {
    if (currentIndex >= slideCount * 2) {
      currentIndex -= slideCount;
      updatePosition(false);
    } else if (currentIndex < slideCount) {
      currentIndex += slideCount;
      updatePosition(false);
    }
  });

  testimonialsCarousel.addEventListener("mouseenter", stopAutoplay);
  testimonialsCarousel.addEventListener("mouseleave", startAutoplay);
  testimonialsCarousel.addEventListener("focusin", stopAutoplay);
  testimonialsCarousel.addEventListener("focusout", (event) => {
    if (!testimonialsCarousel.contains(event.relatedTarget)) startAutoplay();
  });
  window.addEventListener("resize", () => updatePosition(false));
  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) {
      isPaused = true;
      updateToggleButton();
      stopAutoplay();
    }
  });

  updatePosition(false);
  updateToggleButton();
  startAutoplay();
}

const heroVideo = document.querySelector(".hero-video");
if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.defaultMuted = true;
  heroVideo.loop = true;
  heroVideo.playsInline = true;

  const playHeroVideo = () => {
    heroVideo.play().catch((error) => {
      console.error("The hero background video could not start playing.", error);
    });
  };

  heroVideo.addEventListener("canplay", playHeroVideo, { once: true });
  playHeroVideo();
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && heroVideo.paused) playHeroVideo();
  });
}

function connectWhatsAppForm(form, status, messageElement) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const text = [
      "Austin Pizza Rizz - Customer Message",
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : "",
      `Message: ${message}`,
    ].filter(Boolean).join("\n");
    const whatsappUrl = `https://wa.me/19567922971?text=${encodeURIComponent(text)}`;
    const whatsappWindow = window.open(whatsappUrl, "_blank");

    if (!whatsappWindow) {
      status.textContent = "Your browser blocked the WhatsApp window. Allow pop-ups or contact us at (956) 792-2971.";
      return;
    }

    whatsappWindow.opener = null;
    if (messageElement) {
      messageElement.textContent = `Thank you, ${name}! We appreciate your support and hope to see you again soon.`;
    }
    status.textContent = "Your message is ready in WhatsApp. Send it there to contact us.";
    form.reset();
  });
}

const orderForm = document.querySelector("#order-inquiry-form");
if (orderForm) {
  const orderStatus = document.querySelector("#order-form-note");
  if (orderStatus) connectWhatsAppForm(orderForm, orderStatus, null);
}

const thankYouForm = document.querySelector("#thank-you-form");
const thankYouStatus = document.querySelector("#thank-you-form-status");
if (thankYouForm && thankYouStatus) {
  connectWhatsAppForm(
    thankYouForm,
    thankYouStatus,
    document.querySelector("#pay-personal-message"),
  );
}

function setupFilters(section, buttonSelector, itemSelector, filterAttribute, itemAttribute) {
  if (!section) return;

  const buttons = [...section.querySelectorAll(buttonSelector)];
  const items = [...section.querySelectorAll(itemSelector)];
  const emptyMessage = section.querySelector("[role='status'][hidden]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filterValue = button.dataset[filterAttribute];
      let visibleCount = 0;

      buttons.forEach((filterButton) => {
        const active = filterButton === button;
        filterButton.classList.toggle("is-active", active);
        filterButton.setAttribute("aria-pressed", String(active));
      });

      items.forEach((item) => {
        const visible = filterValue === "all" || item.dataset[itemAttribute] === filterValue;
        item.hidden = !visible;
        if (visible) visibleCount += 1;
      });

      if (emptyMessage) emptyMessage.hidden = visibleCount > 0;
    });
  });
}

setupFilters(
  document.querySelector(".menu-section"),
  "[data-menu-filter]",
  ".menu-item",
  "menuFilter",
  "menuType",
);
const gallery = document.querySelector(".gallery-section");
if (gallery) {
  const modal = gallery.querySelector(".gallery-modal");
  const modalImage = modal?.querySelector(".gallery-modal-image");
  const modalTitle = modal?.querySelector(".gallery-modal-caption h2");
  const modalSubtitle = modal?.querySelector(".gallery-modal-caption p");
  const closeButton = modal?.querySelector(".gallery-modal-close");
  const slider = gallery.querySelector(".gallery-slider");
  const firstItem = gallery.querySelector(".gallery-item");
  const scrollDistance = () => {
    if (!firstItem) return 0;
    const gap = Number.parseFloat(getComputedStyle(gallery.querySelector(".gallery-list")).gap) || 0;
    return firstItem.getBoundingClientRect().width + gap;
  };

  gallery.querySelector("[data-gallery-previous]")?.addEventListener("click", () => {
    slider?.scrollBy({ left: -scrollDistance(), behavior: "smooth" });
  });
  gallery.querySelector("[data-gallery-next]")?.addEventListener("click", () => {
    slider?.scrollBy({ left: scrollDistance(), behavior: "smooth" });
  });

  gallery.querySelectorAll(".gallery-card").forEach((card) => {
    card.addEventListener("click", () => {
      if (!modal || !modalImage || typeof modal.showModal !== "function") {
        console.error("The gallery image viewer is not supported in this browser.");
        return;
      }

      modalImage.src = card.dataset.fullImage || "";
      modalImage.alt = card.dataset.imageAlt || "Pizza photo";
      if (modalTitle) modalTitle.textContent = card.dataset.imageTitle || modalImage.alt;
      if (modalSubtitle) modalSubtitle.textContent = card.dataset.imageSubtitle || "";
      modal.showModal();
    });
  });

  closeButton?.addEventListener("click", () => modal.close());
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });
}
