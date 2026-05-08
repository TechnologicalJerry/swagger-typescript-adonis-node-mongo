import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UsersController = () => import('./users.controller')

router
  .group(() => {
    router.get('/', [UsersController, 'index'])
    router.get('/profile', [UsersController, 'profile'])
    router.get('/:id', [UsersController, 'show'])
    router.put('/:id', [UsersController, 'update'])
    router.delete('/:id', [UsersController, 'destroy']).use(middleware.role(['admin']))
  })
  .prefix('/api/v1/users')
  .use(middleware.auth())
