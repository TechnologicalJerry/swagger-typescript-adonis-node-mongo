import type { HttpContext } from '@adonisjs/core/http'
import { ProductsService } from './products.service'
import vine from '@vinejs/vine'

const createValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    description: vine.string(),
    price: vine.number().min(0),
    stock: vine.number().min(0),
    category: vine.string(),
    imageUrl: vine.string().optional(),
  })
)

const updateValidator = vine.compile(
  vine.object({
    name: vine.string().trim().optional(),
    description: vine.string().optional(),
    price: vine.number().min(0).optional(),
    stock: vine.number().min(0).optional(),
    category: vine.string().optional(),
    imageUrl: vine.string().optional(),
  })
)

export default class ProductsController {
  private productsService = new ProductsService()

  async index({ response }: HttpContext) {
    const products = await this.productsService.getAllProducts()
    return response.ok({ status: 'success', data: products })
  }

  async show({ params, response }: HttpContext) {
    const product = await this.productsService.getProductById(params.id)
    if (!product) {
      return response.notFound({ status: 'error', message: 'Product not found' })
    }
    return response.ok({ status: 'success', data: product })
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createValidator)
    const product = await this.productsService.createProduct(data)
    return response.created({ status: 'success', data: product })
  }

  async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(updateValidator)
    const product = await this.productsService.updateProduct(params.id, data)
    if (!product) {
      return response.notFound({ status: 'error', message: 'Product not found' })
    }
    return response.ok({ status: 'success', data: product })
  }

  async destroy({ params, response }: HttpContext) {
    const success = await this.productsService.deleteProduct(params.id)
    if (!success) {
      return response.notFound({ status: 'error', message: 'Product not found' })
    }
    return response.ok({ status: 'success', message: 'Product deleted successfully' })
  }
}
