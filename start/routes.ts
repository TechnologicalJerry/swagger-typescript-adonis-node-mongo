import router from '@adonisjs/core/services/router'

router.get('/api/v1/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// We will import module routes here
import '#app/modules/auth/auth.routes'
import '#app/modules/users/users.routes'

const DocsController = () => import('#app/controllers/docs.controller')

router.get('/api/docs', [DocsController, 'index'])
router.get('/api/docs/swagger.json', [DocsController, 'json'])
