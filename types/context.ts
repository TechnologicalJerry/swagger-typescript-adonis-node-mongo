import { UserDocument } from '#app/modules/users/users.model'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    user?: UserDocument
  }
}
