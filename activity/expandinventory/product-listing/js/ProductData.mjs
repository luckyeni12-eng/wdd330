// ProductData.mjs
const baseURL = import.meta.env.VITE_SERVER_URL || 'https://wdd330-backend.onrender.com/';


export default class ProductData {
constructor() {
// nothing required here; category is passed to getData
}


async convertToJson(response) {
if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
return response.json();
}


async getData(category) {
// query the API endpoint for a category
const url = `${baseURL}products/search/${category}`;
const response = await fetch(url);
const data = await this.convertToJson(response);
// API returns { Result: [...] }
return data.Result || [];
}


async getProductById(id) {
const url = `${baseURL}product/${id}`;
const response = await fetch(url);
const data = await this.convertToJson(response);
return data.Result || data; // defensive
}
}