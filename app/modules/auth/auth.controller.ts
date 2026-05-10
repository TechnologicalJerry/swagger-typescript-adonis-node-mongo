import type { HttpContext } from '@adonisjs/core/http'
import { AuthService } from './auth.service'
import vine from '@vinejs/vine'

const registerValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(6),
    firstName: vine.string(),
    lastName: vine.string(),
  })
)

const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)

const refreshValidator = vine.compile(
  vine.object({
    refreshToken: vine.string(),
  })
)

export default class AuthController {
  private authService = new AuthService()

  async register({ request, response }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const result = await this.authService.register(data)
    
    if (!result.success) {
      return response.badRequest({ status: 'error', message: result.message })
    }
    
    return response.created({ status: 'success', data: result.data })
  }

  async login({ request, response }: HttpContext) {
    const data = await request.validateUsing(loginValidator)
    const result = await this.authService.login(data.email, data.password)
    
    if (!result.success) {
      return response.unauthorized({ status: 'error', message: result.message })
    }
    
    return response.ok({ status: 'success', data: result.data })
  }

  async refresh({ request, response }: HttpContext) {
    const { refreshToken } = await request.validateUsing(refreshValidator)
    const result = await this.authService.refresh(refreshToken)
    
    if (!result.success) {
      return response.unauthorized({ status: 'error', message: result.message })
    }
    
    return response.ok({ status: 'success', data: result.data })
  }

  async logout({ user, response }: HttpContext) {
    if (user) {
      await this.authService.logout(user.id)
    }
    return response.ok({ status: 'success', message: 'Logged out successfully' })
  }

  async forgotPassword({ response }: HttpContext) {
    // Implementation for forgot password
    return response.ok({ status: 'success', message: 'Password reset link sent' })
  }

  async resetPassword({ response }: HttpContext) {
    // Implementation for reset password
    return response.ok({ status: 'success', message: 'Password reset successfully' })
  }
}
