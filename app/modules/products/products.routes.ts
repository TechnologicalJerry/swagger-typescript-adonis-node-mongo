import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ProductsController = () => import('./products.controller')

router
  .group(() => {
    router.get('/', [ProductsController, 'index'])
    router.get('/:id', [ProductsController, 'show'])
    router.post('/', [ProductsController, 'store']).use(middleware.role(['admin']))
    router.put('/:id', [ProductsController, 'update']).use(middleware.role(['admin']))
    router.delete('/:id', [ProductsController, 'destroy']).use(middleware.role(['admin']))
  })
  .prefix('/api/v1/products')
  .use(middleware.auth())
