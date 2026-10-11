const navbarLinks = document.querySelectorAll(".nav-menu .nav-link");
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");
menuOpenButton.addEventListener("click", () => {
  // Toggle mobile menu visibility
  document.body.classList.toggle("show-mobile-menu");
});
// Close menu when the close button is clicked
menuCloseButton.addEventListener("click", () => menuOpenButton.click());
// Close menu when nav link is clicked
navbarLinks.forEach((link) => {
  link.addEventListener("click", () => menuOpenButton.click());
});

const orderInquiryForm = document.querySelector("#order-inquiry-form");
if (orderInquiryForm) {
  orderInquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.querySelector("#order-name").value.trim();
    const email = document.querySelector("#order-email").value.trim();
    const phone = document.querySelector("#order-phone").value.trim();
    const message = document.querySelector("#order-message").value.trim();

    const whatsappNumber = "19567922971";
    const fullMessage = [
      "New order inquiry:",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Description: ${message}`,
    ].join("\n");

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fullMessage)}`;
    window.open(whatsappUrl, "_blank");
    orderInquiryForm.reset();
  });
}

/* Initializing Swiper only when the homepage testimonial slider exists */
const testimonialSlider = document.querySelector(".slider-wrapper");
if (testimonialSlider && window.Swiper) {
  const swiper = new window.Swiper(testimonialSlider, {
    loop: true,
    grabCursor: true,
    spaceBetween: 25,
    speed: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 500,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      0: { slidesPerView: 1 },
    },
  });
}

// Multi-step form controls exist only on the separate contact page.
const slidePage = document.querySelector(".slide-page");
const nextButtons = [
  document.querySelector(".firstNext"),
  document.querySelector(".next-1"),
  document.querySelector(".next-2"),
];
const previousButtons = [
  document.querySelector(".prev-1"),
  document.querySelector(".prev-2"),
  document.querySelector(".prev-3"),
];
const submitButton = document.querySelector(".submit");
const progressItems = [...document.querySelectorAll(".step")];

if (slidePage && nextButtons.every(Boolean) && previousButtons.every(Boolean) && submitButton) {
  let currentStep = 0;
  const updateStep = (nextStep) => {
    currentStep = nextStep;
    slidePage.style.marginLeft = `${-25 * currentStep}%`;
    progressItems.forEach((step, index) => {
      step.querySelector(".bullet")?.classList.toggle("active", index < currentStep);
      step.querySelector(".check")?.classList.toggle("active", index < currentStep);
      step.querySelector("p")?.classList.toggle("active", index < currentStep);
    });
  };

  nextButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      updateStep(Math.min(currentStep + 1, 3));
    });
  });

  previousButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      updateStep(Math.max(currentStep - 1, 0));
    });
  });

  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    updateStep(3);
    window.setTimeout(() => {
      window.alert("Your form was submitted successfully.");
      window.location.reload();
    }, 800);
  });
}

const gallery = document.querySelector(".gallery-section");
if (gallery) {
  const gallerySliderElement = gallery.querySelector(".gallery-slider");
  const galleryControls = gallery.querySelector(".gallery-controls");
  const gallerySwiper = window.Swiper && gallerySliderElement
    ? new window.Swiper(gallerySliderElement, {
        slidesPerView: 1,
        spaceBetween: 18,
        speed: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 550,
        grabCursor: true,
        rewind: true,
        watchOverflow: true,
        keyboard: { enabled: true, onlyInViewport: true },
        navigation: {
          nextEl: gallery.querySelector(".gallery-button-next"),
          prevEl: gallery.querySelector(".gallery-button-prev"),
        },
        pagination: {
          el: gallery.querySelector(".gallery-pagination"),
          clickable: true,
          bulletElement: "button",
        },
        breakpoints: {
          680: { slidesPerView: 2, spaceBetween: 22 },
        },
      })
    : null;

  const filterButtons = [...gallery.querySelectorAll("[data-gallery-filter]")];
  const galleryItems = [...gallery.querySelectorAll(".gallery-item")];
  const emptyMessage = gallery.querySelector(".gallery-empty");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.galleryFilter;
      let visibleCount = 0;

      filterButtons.forEach((filter) => {
        const active = filter === button;
        filter.classList.toggle("is-active", active);
        filter.setAttribute("aria-pressed", String(active));
      });

      galleryItems.forEach((item) => {
        const visible = category === "all" || item.dataset.category === category;
        item.hidden = !visible;
        if (visible) visibleCount += 1;
      });

      if (emptyMessage) emptyMessage.hidden = visibleCount > 0;
      if (gallerySliderElement) gallerySliderElement.hidden = visibleCount === 0;
      if (galleryControls) galleryControls.hidden = visibleCount < 2;
      gallerySwiper?.update();
      gallerySwiper?.slideTo(0, 0);
    });
  });

  gallerySwiper?.on("slideChange", () => {
    galleryItems.forEach((item, index) => {
      item.setAttribute("aria-label", `Pizza ${index + 1} of ${galleryItems.length}`);
      item.setAttribute("aria-roledescription", "slide");
    });
  });

  const modal = gallery.querySelector(".gallery-modal");
  const modalImage = modal?.querySelector(".gallery-modal-image");
  const modalCaption = modal?.querySelector(".gallery-modal-caption");
  const closeModalButton = modal?.querySelector(".gallery-modal-close");

  gallery.querySelectorAll(".gallery-card").forEach((card) => {
    card.addEventListener("click", () => {
      if (!modal?.showModal || !modalImage) return;
      modalImage.src = card.dataset.fullImage;
      modalImage.alt = card.dataset.imageAlt || "Pizza photo";
      if (modalCaption) modalCaption.textContent = card.dataset.imageAlt || "Austin Pizza Rizz gallery";
      modal.showModal();
    });
  });

  closeModalButton?.addEventListener("click", () => modal.close());
  modal?.addEventListener("cancel", (event) => {
    event.preventDefault();
    modal.close();
  });
  modal?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      modal.close();
    }
  });
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });

  if (window.gsap && window.ScrollTrigger && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.gsap.registerPlugin(window.ScrollTrigger);

    window.gsap.from(".gallery-item", {
      autoAlpha: 0,
      y: 38,
      duration: 0.75,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".gallery-list",
        start: "top 88%",
        once: true,
      },
    });

    gallery.querySelectorAll(".gallery-image").forEach((image, index) => {
      window.gsap.fromTo(image,
        { "--gallery-parallax": index % 2 === 0 ? "10px" : "-10px" },
        {
          "--gallery-parallax": index % 2 === 0 ? "-10px" : "10px",
          ease: "none",
          scrollTrigger: {
            trigger: image.closest(".gallery-card"),
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        },
      );
    });
  }
}