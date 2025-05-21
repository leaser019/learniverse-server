const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String, required: false },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Clothing', 'Electronics'] },
    product_shop: { type: String, required: false },
    product_attributes: { type: Schema.Types.Mixed, required: false }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const clothingSchema = new Schema({
  brand: { type: String, required: true },
  size: { type: String, required: true },
  material: { type: String, required: true }
})

const electronicsSchema = new Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  material: { type: String, required: false }
})

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model('Clothing', clothingSchema),
  electronics: model('Electronics', electronicsSchema)
}
