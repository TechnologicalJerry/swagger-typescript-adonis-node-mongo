import mongoose from 'mongoose'
import type { ApplicationService } from '@adonisjs/core/types'
import env from '#start/env'

export default class MongoProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    const uri = env.get('MONGO_URI')
    
    mongoose.connection.on('connected', () => {
      this.app.logger.info('MongoDB connected successfully')
    })
    
    mongoose.connection.on('error', (err) => {
      this.app.logger.error(`MongoDB connection error: ${err}`)
    })

    await mongoose.connect(uri)
  }

  async shutdown() {
    await mongoose.disconnect()
    this.app.logger.info('MongoDB disconnected')
  }
}
