import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, roles: string[]) {
    if (!ctx.user) {
      return ctx.response.unauthorized({ message: 'Authentication required' })
    }

    if (!roles.includes(ctx.user.role)) {
      return ctx.response.forbidden({ message: 'You do not have permission to access this resource' })
    }

    await next()
  }
}
