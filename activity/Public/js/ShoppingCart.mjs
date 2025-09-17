// ShoppingCart.mjs - module to manage rendering of the cart using a partial template
import { loadTemplate, renderWithTemplate } from "./utils.mjs";

export async function loadCart(parentSelector = "#cart-root", templatePath = "./partials/cart-template.html") {
  const parent = document.querySelector(parentSelector);
  if (!parent) {
    console.warn("loadCart: parent not found", parentSelector);
    return;
  }

  try {
    const template = await loadTemplate(templatePath);
    // render the outer cart template
    renderWithTemplate(template, parent);

    // after template insertion, populate items list & summary
    const raw = localStorage.getItem("cart");
    const cart = raw ? JSON.parse(raw) : [];

    const itemsContainer = document.getElementById("cart-items");
    const summaryCount = document.getElementById("summary-count");
    const summaryTotal = document.getElementById("summary-total");

    if (!itemsContainer) {
      console.warn("loadCart: #cart-items not present in template.");
      return;
    }

    // build list items (simple)
    itemsContainer.innerHTML = "";
    let total = 0;
    let totalCount = 0;

    cart.forEach((ci, idx) => {
      const qty = Number(ci.quantity || 1);
      const price = Number(ci.price || 0);
      total += qty * price;
      totalCount += qty;

      const li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML = `
        <div class="item-left">
          <strong>${escapeHtml(ci.title || "Untitled")}</strong>
          <div class="meta">by ${escapeHtml(ci.artist || "Unknown")}</div>
          <div class="price">\$${(price).toFixed(2)} × ${qty} = <strong>\$${(qty*price).toFixed(2)}</strong></div>
        </div>
        <div class="item-actions">
          <button data-index="${idx}" class="remove-item">Remove</button>
        </div>
      `;
      itemsContainer.appendChild(li);
    });

    if (summaryCount) summaryCount.textContent = totalCount;
    if (summaryTotal) summaryTotal.textContent = total.toFixed(2);

    // Wire remove buttons
    itemsContainer.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = Number(e.currentTarget.getAttribute("data-index"));
        removeFromCart(index);
        // simple re-render
        loadCart(parentSelector, templatePath);
        // update header cart count
        const ev = new Event("cart-updated");
        window.dispatchEvent(ev);
      });
    });
  } catch (err) {
    console.error("loadCart error:", err);
  }
}

function removeFromCart(index) {
  const raw = localStorage.getItem("cart");
  const cart = raw ? JSON.parse(raw) : [];
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}