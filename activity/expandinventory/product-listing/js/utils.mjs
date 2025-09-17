// minimal utils used by the product-listing page
export function loadHeaderFooter({ headerTarget = '#header', footerTarget = '#footer' } = {}) {
// simple header/footer injection for local development
const headerEl = document.querySelector(headerTarget) || document.querySelector('#site-header-placeholder');
const footerEl = document.querySelector(footerTarget) || document.querySelector('#site-footer-placeholder');


if (headerEl) {
headerEl.innerHTML = `
<header class="site-header">
<div class="container header-inner">
<div class="logo"><a href="/index.html">Virtual Art Gallery</a></div>
<nav class="main-nav"><a href="/index.html">Home</a></nav>
</div>
</header>
`;
}


if (footerEl) {
footerEl.innerHTML = `<footer class="site-footer container">&copy; ${new Date().getFullYear()} Virtual Art Gallery</footer>`;
}
}


export function getParam(name) {
const params = new URLSearchParams(window.location.search);
return params.get(name);
}