const navbarLinks = document.querySelectorAll(".nav-menu .nav-link");
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

if (menuOpenButton && menuCloseButton) {
  menuOpenButton.addEventListener("click", () => {
    document.body.classList.toggle("show-mobile-menu");
  });

  menuCloseButton.addEventListener("click", () => {
    document.body.classList.remove("show-mobile-menu");
  });

  navbarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("show-mobile-menu");
    });
  });
}

const thankYouForm = document.querySelector("#thank-you-form");
const formStatus = document.querySelector("#thank-you-form-status");
const personalMessage = document.querySelector("#pay-personal-message");

if (thankYouForm && formStatus && personalMessage) {
  thankYouForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(thankYouForm);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const whatsappMessage = [
      "Austin Pizza Rizz - Customer Message",
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : "",
      `Message: ${message}`,
    ].filter(Boolean).join("\n");
    const whatsappUrl = `https://wa.me/19567922971?text=${encodeURIComponent(whatsappMessage)}`;
    const whatsappWindow = window.open(whatsappUrl, "_blank");

    if (!whatsappWindow) {
      formStatus.textContent = "Your browser blocked the WhatsApp window. Please allow pop-ups and try again, or message us at (956) 792-2971.";
      return;
    }

    whatsappWindow.opener = null;
    personalMessage.textContent = `Thank you, ${name}! We appreciate your support and hope to see you again soon.`;
    formStatus.textContent = "Your message is ready in WhatsApp. Send it there to get in touch with us.";
    thankYouForm.reset();
  });
}