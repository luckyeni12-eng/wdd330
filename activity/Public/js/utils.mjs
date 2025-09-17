// utils.mjs - helper utilities for loading templates and rendering small templates
// Exported functions:
// - loadTemplate(path) -> Promise<string>  (fetches HTML partial and returns text)
// - renderWithTemplate(template, parentElement, data, callback) -> void
// - loadHeaderFooter() -> Promise<void>

export async function loadTemplate(path) {
  // path is relative to current page. Use absolute or relative based on project.
  try {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Failed to load template: ${path} (${res.status})`);
    const text = await res.text();
    return text;
  } catch (err) {
    console.error("loadTemplate error:", err);
    throw err;
  }
}

/**
 * Inserts a template string into a DOM element (parentElement).
 * template: string (raw HTML)
 * parentElement: Element OR selector string
 * data: optional object for very simple token-replacement in template (e.g. {{name}})
 * callback: optional function() called after insertion
 */
export function renderWithTemplate(template, parentElement, data = null, callback = null) {
  // allow passing a selector or node
  let parent = typeof parentElement === "string" ? document.querySelector(parentElement) : parentElement;
  if (!parent) {
    console.warn("renderWithTemplate: parentElement not found", parentElement);
    return;
  }

  let output = template;

  // Very small templating: replace {{key}} with data[key], if data provided.
  if (data && typeof data === "object") {
    Object.keys(data).forEach((k) => {
      const re = new RegExp(`{{\\s*${escapeRegExp(k)}\\s*}}`, "g");
      output = output.replace(re, String(data[k]));
    });
  }

  parent.innerHTML = output;

  if (typeof callback === "function") {
    try {
      callback();
    } catch (err) {
      console.error("renderWithTemplate callback error:", err);
    }
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * loadHeaderFooter
 * Loads partials/header.html and partials/footer.html and injects them into the page.
 * It expects placeholder elements in the host page with ids: #site-header and #site-footer
 *
 * Usage:
 *   import { loadHeaderFooter } from './js/utils.mjs';
 *   await loadHeaderFooter(); // will fetch ./partials/header.html and ./partials/footer.html
 *
 * If partials are in a different relative location from your page, pass basePath (optional)
 * e.g. loadHeaderFooter('/src/public/partials/');
 */
export async function loadHeaderFooter(basePath = "./partials/") {
  // determine header/footer paths
  const headerPath = `${basePath}header.html`;
  const footerPath = `${basePath}footer.html`;

  try {
    const [headerHtml, footerHtml] = await Promise.all([
      loadTemplate(headerPath),
      loadTemplate(footerPath),
    ]);

    // Insert header
    const headerPlaceholder = document.getElementById("site-header");
    if (headerPlaceholder) {
      renderWithTemplate(headerHtml, headerPlaceholder, null, () => {
        // After header is inserted, initialize dynamic cart count from localStorage
        updateCartCount();
      });
    } else {
      console.warn("loadHeaderFooter: #site-header element not found.");
    }

    // Insert footer
    const footerPlaceholder = document.getElementById("site-footer");
    if (footerPlaceholder) {
      renderWithTemplate(footerHtml, footerPlaceholder);
    } else {
      console.warn("loadHeaderFooter: #site-footer element not found.");
    }
  } catch (err) {
    console.error("loadHeaderFooter failed:", err);
  }
}

/** small helper reading cart count stored in localStorage under 'cart' (array) */
function updateCartCount() {
  try {
    const raw = localStorage.getItem("cart");
    const cart = raw ? JSON.parse(raw) : [];
    const count = Array.isArray(cart) ? cart.reduce((acc, it) => acc + (it.quantity || 1), 0) : 0;
    const el = document.getElementById("cart-count");
    if (el) el.textContent = count;
  } catch (err) {
    console.warn("updateCartCount error:", err);
  }
}