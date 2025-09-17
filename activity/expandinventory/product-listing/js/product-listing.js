import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs';


// load header/footer into placeholders
loadHeaderFooter({ headerTarget: '#site-header-placeholder', footerTarget: '#site-footer-placeholder' });


(async function initPage() {
// read category param. default to "tents" if not provided
const category = getParam('category') || 'tents';


// set title
const titleEl = document.getElementById('listing-title');
if (titleEl) titleEl.textContent = `Top Products: ${toTitleCase(category)}`;


// data source
const dataSource = new ProductData();


// container
const listElement = document.querySelector('.product-list');


const myList = new ProductList(category, dataSource, listElement);
await myList.init();


// helper
function toTitleCase(str) {
return str
.split('-')
.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
.join(' ');
}
})();