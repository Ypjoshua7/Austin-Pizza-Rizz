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

const thankYouForm = document.querySelector("#thank-you-form");
const thankYouStatus = document.querySelector("#thank-you-form-status");

if (thankYouForm && thankYouStatus) {
  thankYouForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(thankYouForm);
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
      thankYouStatus.textContent = "Your browser blocked the WhatsApp window. Allow pop-ups or contact us at (956) 792-2971.";
      return;
    }

    whatsappWindow.opener = null;
    const personalMessage = document.querySelector("#pay-personal-message");
    if (personalMessage) {
      personalMessage.textContent = `Thank you, ${name}! We appreciate your support and hope to see you again soon.`;
    }
    thankYouStatus.textContent = "Your message is ready in WhatsApp. Send it there to contact us.";
    thankYouForm.reset();
  });
}
