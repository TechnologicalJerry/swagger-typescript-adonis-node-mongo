import { defineConfig } from '@adonisjs/core/bodyparser'

const bodyParserConfig = defineConfig({
  allowedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'],
  multipart: {
    autoProcess: true,
    processManually: [],
    encoding: 'utf-8',
    convertEmptyStringsToNull: true,
    maxFields: 1000,
    limit: '20mb',
    types: [
      'multipart/form-data',
    ],
  },
})

export default bodyParserConfig
