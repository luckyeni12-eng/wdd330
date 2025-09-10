// ProductData.mjs

export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `../json/${this.category}.json`;
  }

  async getData() {
    const response = await fetch(this.path);
    if (!response.ok) {
      throw new Error(`Failed to load ${this.path}`);
    }
    return await response.json();
  }

  async findProductById(id) {
    const data = await this.getData();
    return data.find((item) => item.Id === id);
  }
}