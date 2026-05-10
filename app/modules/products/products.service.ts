import { Product } from './products.model'

export class ProductsService {
  async getAllProducts() {
    return Product.find({})
  }

  async getProductById(id: string) {
    return Product.findById(id)
  }

  async createProduct(data: any) {
    const product = new Product(data)
    await product.save()
    return product
  }

  async updateProduct(id: string, data: any) {
    return Product.findByIdAndUpdate(id, data, { new: true })
  }

  async deleteProduct(id: string) {
    const result = await Product.findByIdAndDelete(id)
    return !!result
  }
}
