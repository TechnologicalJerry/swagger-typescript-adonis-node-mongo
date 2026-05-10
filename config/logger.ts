import env from '#start/env'
import { defineConfig, targets } from '@adonisjs/logger'

const loggerConfig = defineConfig({
  default: 'app',

  loggers: {
    app: {
      enabled: true,
      name: env.get('APP_NAME'),
      level: env.get('LOG_LEVEL'),
      transport: {
        targets: targets()
          .pushIf(!env.get('NODE_ENV'), targets.pretty())
          .pushIf(env.get('NODE_ENV') === 'development', targets.pretty())
          .pushIf(env.get('NODE_ENV') === 'production', targets.file({ destination: 1 }))
          .toArray(),
      },
    },
  },
})

export default loggerConfig
declare module '@adonisjs/logger/types' {
  export interface LoggersList extends InferLoggers<typeof loggerConfig> {}
}
