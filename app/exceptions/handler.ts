import { HttpExceptionHandler } from '@adonisjs/core/http'
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'

export default class HttpExceptionHandler extends HttpExceptionHandler {
  protected debug = process.env.NODE_ENV === 'development'

  async handle(error: any, ctx: HttpContext) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return ctx.response.status(422).send({
        status: 'error',
        message: 'Validation failed',
        errors: error.messages
      })
    }

    const status = error.status || 500
    const message = error.message || 'Internal server error'

    ctx.response.status(status).send({
      status: 'error',
      message: this.debug ? message : 'An unexpected error occurred',
      ...(this.debug && { stack: error.stack })
    })
  }
}
