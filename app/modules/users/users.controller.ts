import type { HttpContext } from '@adonisjs/core/http'
import { UsersService } from './users.service'
import vine from '@vinejs/vine'

const updateValidator = vine.compile(
  vine.object({
    firstName: vine.string().optional(),
    lastName: vine.string().optional(),
    avatar: vine.string().optional(),
  })
)

export default class UsersController {
  private usersService = new UsersService()

  async index({ response }: HttpContext) {
    const users = await this.usersService.getAllUsers()
    return response.ok({ status: 'success', data: users })
  }

  async profile({ user, response }: HttpContext) {
    return response.ok({ status: 'success', data: user })
  }

  async show({ params, response }: HttpContext) {
    const user = await this.usersService.getUserById(params.id)
    if (!user) {
      return response.notFound({ status: 'error', message: 'User not found' })
    }
    return response.ok({ status: 'success', data: user })
  }

  async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(updateValidator)
    const user = await this.usersService.updateUser(params.id, data)
    if (!user) {
      return response.notFound({ status: 'error', message: 'User not found' })
    }
    return response.ok({ status: 'success', data: user })
  }

  async destroy({ params, response }: HttpContext) {
    const success = await this.usersService.deleteUser(params.id)
    if (!success) {
      return response.notFound({ status: 'error', message: 'User not found' })
    }
    return response.ok({ status: 'success', message: 'User deleted successfully' })
  }
}
