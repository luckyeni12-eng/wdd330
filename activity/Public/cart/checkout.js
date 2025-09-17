import { loadHeaderFooter } from '../js/utils.mjs';

await loadHeaderFooter('../partials/');

// Simple checkout bootstrap: show cart summary pulled from localStorage
const root = document.getElementById('checkout-root');
if (!root) throw new Error('checkout root missing');

const raw = localStorage.getItem('cart');
const cart = raw ? JSON.parse(raw) : [];

if (!cart.length) {
  root.innerHTML = `<p>Your cart is empty. <a href="/product_pages/index.html">Go shopping</a></p>`;
} else {
  const total = cart.reduce((acc, it) => acc + (Number(it.price || 0) * (Number(it.quantity) || 1)), 0);
  root.innerHTML = `
    <section class="checkout-summary">
      <h2>Order Summary</h2>
      <p>Items: ${cart.length}</p>
      <p>Total: $${total.toFixed(2)}</p>
      <button id="place-order" class="btn">Place Order</button>
    </section>
  `;

  document.getElementById('place-order').addEventListener('click', () => {
    // demo behavior: clear cart and show success
    localStorage.removeItem('cart');
    // signal update to other pages
    window.dispatchEvent(new Event('cart-updated'));
    root.innerHTML = `
      <article class="order-confirmation">
        <h2>Thank you — Order placed!</h2>
        <p>Your order has been received (demo). You may return to <a href="/index.html">home</a>.</p>
      </article>
    `;
  });
}