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

const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)

const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string(),
    newPassword: vine.string().minLength(6),
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

  async forgotPassword({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(forgotPasswordValidator)
    const result = await this.authService.forgotPassword(email)
    
    if (!result.success) {
      // In production, we might want to return success anyway to prevent email enumeration
      return response.badRequest({ status: 'error', message: result.message })
    }
    
    return response.ok({ status: 'success', message: 'Password reset link sent' })
  }

  async resetPassword({ request, response }: HttpContext) {
    const { token, newPassword } = await request.validateUsing(resetPasswordValidator)
    const result = await this.authService.resetPassword(token, newPassword)
    
    if (!result.success) {
      return response.badRequest({ status: 'error', message: result.message })
    }
    
    return response.ok({ status: 'success', message: 'Password reset successfully' })
  }
}
