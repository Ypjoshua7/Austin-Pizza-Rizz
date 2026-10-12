(() => {
  const supportsHoverPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!supportsHoverPointer.matches) return;

  const cursor = document.createElement("div");
  cursor.className = "pizza-cursor";
  cursor.setAttribute("aria-hidden", "true");

  const image = document.createElement("img");
  image.src = new URL("images/vegetable-italian-delicious-pizza-slice-png.png", document.currentScript.src).href;
  image.alt = "";
  cursor.append(image);
  document.body.append(cursor);
  document.body.classList.add("pizza-cursor-enabled");

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.classList.add("is-visible");
  }, { passive: true });

  document.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") return;
    image.classList.remove("is-spinning");
    void image.offsetWidth;
    image.classList.add("is-spinning");
  });

  window.addEventListener("pointerleave", () => cursor.classList.remove("is-visible"));
  window.addEventListener("pointerenter", () => cursor.classList.add("is-visible"));
})();
