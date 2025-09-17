export default class ProductList {
constructor(category, dataSource, listElement) {
this.category = category;
this.dataSource = dataSource;
this.listElement = listElement;
}


async init() {
const items = await this.dataSource.getData(this.category);
this.render(items);
}


render(items) {
if (!this.listElement) return;
this.listElement.innerHTML = '';


if (!items || items.length === 0) {
this.listElement.innerHTML = '<p class="empty">No products found.</p>';
return;
}


const fragment = document.createDocumentFragment();


items.forEach((p) => {
const card = document.createElement('a');
card.className = 'product-card';
// product detail link with id param
card.href = `/product_detail/index.html?id=${p.ProductId || p.Id || p.id}`;


const img = document.createElement('img');
// new API stores images under Media -> PrimaryMedium or PrimaryLarge
const imageUrl = (p?.PrimaryMedium?.Url) || (p?.PrimaryImage?.Url) || (p?.Media?.PrimaryMedium?.Url) || (p?.PrimaryPictureUrl) || '';
img.src = imageUrl;
img.alt = p.ProductName || p.Title || 'product image';


const title = document.createElement('h3');
title.textContent = p.ProductName || p.Title || 'Untitled';


const price = document.createElement('div');
price.className = 'price';
// some APIs store price in p?.SalePrice or p?.Price
price.textContent = p?.SalePrice ? `$${p.SalePrice}` : (p?.Price ? `$${p.Price}` : '');


card.appendChild(img);
const info = document.createElement('div');
info.className = 'info';
info.appendChild(title);
info.appendChild(price);


card.appendChild(info);


fragment.appendChild(card);
});


this.listElement.appendChild(fragment);
}
}