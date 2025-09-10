// product.js
import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

// get productId from URL
const productId = getParam("product");

// create data source
const dataSource = new ProductData("tents");

// create ProductDetails instance
const product = new ProductDetails(productId, dataSource);
product.init();