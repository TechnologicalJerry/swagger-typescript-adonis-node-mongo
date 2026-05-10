import type { HttpContext } from '@adonisjs/core/http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default class DocsController {
  async index({ response }: HttpContext) {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>API Docs</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
        <script>
          window.onload = function() {
            window.ui = SwaggerUIBundle({
              url: "/api/docs/swagger.json",
              dom_id: '#swagger-ui',
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIBundle.SwaggerUIStandalonePreset
              ],
            });
          }
        </script>
      </body>
      </html>
    `
    return response.header('Content-Type', 'text/html').send(html)
  }

  async json({ response }: HttpContext) {
    const filePath = path.join(__dirname, '../../swagger/openapi.json')
    const file = fs.readFileSync(filePath, 'utf-8')
    return response.json(JSON.parse(file))
  }
}
