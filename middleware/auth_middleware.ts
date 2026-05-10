import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import jwt from 'jsonwebtoken'
import env from '#start/env'
import { User } from '#app/modules/users/users.model'

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const authHeader = ctx.request.header('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.response.unauthorized({ message: 'Missing or invalid token' })
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, env.get('JWT_ACCESS_SECRET') as string) as any
      const user = await User.findById(decoded.userId)
      
      if (!user) {
        return ctx.response.unauthorized({ message: 'User not found' })
      }

      // Inject user into context for subsequent requests
      ctx.user = user

      await next()
    } catch (error) {
      return ctx.response.unauthorized({ message: 'Token is invalid or expired' })
    }
  }
}
