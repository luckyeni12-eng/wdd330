// product-list-main.mjs
import { loadTemplate, renderWithTemplate } from "../js/utils.mjs";

const PRODUCTS = [
  {
    id: "p1",
    title: "Starry Night",
    artist: "Vincent van Gogh",
    price: 120.0,
    image: "/images/starry-night.jpg",
  },
  {
    id: "p2",
    title: "Mona Lisa",
    artist: "Leonardo da Vinci",
    price: 200.0,
    image: "/images/mona-lisa.jpg",
  },
  {
    id: "p3",
    title: "The Scream",
    artist: "Edvard Munch",
    price: 150.0,
    image: "/images/the-scream.jpg",
  },
];

// Main initializer
export async function init() {
  const container = document.getElementById("product-list");
  if (!container) {
    console.warn("product-list-main: #product-list container not found");
    return;
  }

  // Build product cards dynamically
  container.innerHTML = "";
  PRODUCTS.forEach((p) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}" class="product-img"/>
      <h2 class="product-title">${p.title}</h2>
      <p class="product-artist">by ${p.artist}</p>
      <p class="product-price">$${p.price.toFixed(2)}</p>
      <button class="btn add-to-cart" data-id="${p.id}">Add to Cart</button>
    `;
    container.appendChild(card);
  });

  // Attach events for "Add to Cart"
  container.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      const product = PRODUCTS.find((p) => p.id === id);
      if (product) addToCart(product);
    });
  });
}

function addToCart(product) {
  try {
    const raw = localStorage.getItem("cart");
    const cart = raw ? JSON.parse(raw) : [];

    // Check if product already exists in cart
    const existing = cart.find((c) => c.id === product.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        artist: product.artist,
        price: product.price,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Notify rest of app (header/cart)
    window.dispatchEvent(new Event("cart-updated"));
  } catch (err) {
    console.error("addToCart failed:", err);
  }
}