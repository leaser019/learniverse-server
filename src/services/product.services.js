'use strict'

const { product, clothing, electronics } = require('../models/product.models')
const { collection } = require('../models/user.models')

class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case 'Clothing':
        return new Clothing(payload)
      case 'Electronics':
        return new Electronics(payload)
      default:
        throw new Error('Invalid product type')
    }
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
  }
  async createNewProduct() {
    return await product.create(this)
  }
}

class Clothing extends Product{
  async createNewProduct() {
    const newClothing = await clothing.create(this.product_attributes)
    if (!newClothing) {
      throw new Error('Error creating clothing product')
    }
    const newProduct = await super.create()
    if (!newProduct) {
      throw new Error('Error creating product')
    }
    return newProduct
  }
}

class Electronics extends Product{
  async createNewProduct() {
    const newElectronics = await electronics.create(this.product_attributes)
    if (!newElectronics) {
      throw new Error('Error creating electronics product')
    }
    const newProduct = await super.create()
    if (!newProduct) {
      throw new Error('Error creating product')
    }
    return newProduct
  }
}