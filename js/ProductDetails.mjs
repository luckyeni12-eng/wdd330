// ProductDetails.mjs
import { setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = {};
  }

  async init() {
    // fetch product data
    this.product = await this.dataSource.findProductById(this.productId);

    // render page
    this.renderProductDetails();

    // set up event listener for Add to Cart
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    let cart = JSON.parse(localStorage.getItem("so-cart")) || [];
    cart.push(this.product);
    setLocalStorage("so-cart", cart);
    alert(`${this.product.Name} added to cart!`);
  }

  renderProductDetails() {
    const productSection = document.querySelector(".product-detail");

    productSection.innerHTML = `
      <h2 class="text-2xl font-bold mb-4">${this.product.Name}</h2>
      <img src="${this.product.Image}" alt="${this.product.Name}" class="w-64 h-auto mb-4 shadow-lg rounded-lg">
      <p class="mb-2"><strong>Price:</strong> $${this.product.FinalPrice}</p>
      <p class="mb-4">${this.product.Description}</p>
      <button id="addToCart" class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
        Add to Cart
      </button>
    `;
  }
}