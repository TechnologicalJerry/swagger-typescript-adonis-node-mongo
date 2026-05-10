import { User } from '#app/modules/users/users.model'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import env from '#start/env'
import crypto from 'crypto'

export class AuthService {
  async register(data: any) {
    const existingUser = await User.findOne({ email: data.email })
    if (existingUser) {
      return { success: false, message: 'User with this email already exists' }
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(data.password, salt)

    const user = await User.create({
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
    })

    const userObj = user.toObject()
    delete (userObj as any).passwordHash
    return { success: true, data: userObj }
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email })
    if (!user) {
      return { success: false, message: 'Invalid credentials' }
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return { success: false, message: 'Invalid credentials' }
    }

    const tokens = this.generateTokens(user.id)
    
    // Save refresh token
    user.refreshToken = tokens.refreshToken
    await user.save()

    const userObj = user.toObject()
    delete (userObj as any).passwordHash
    delete (userObj as any).refreshToken

    return { 
      success: true, 
      data: {
        user: userObj,
        ...tokens
      }
    }
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, env.get('JWT_REFRESH_SECRET') as string) as any
      const user = await User.findById(decoded.userId)

      if (!user || user.refreshToken !== refreshToken) {
        return { success: false, message: 'Invalid refresh token' }
      }

      const tokens = this.generateTokens(user.id)
      
      // Update refresh token
      user.refreshToken = tokens.refreshToken
      await user.save()

      return { success: true, data: tokens }
    } catch (error) {
      return { success: false, message: 'Invalid refresh token' }
    }
  }

  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { refreshToken: null })
    return true
  }

  private generateTokens(userId: string) {
    const accessToken = jwt.sign(
      { userId },
      env.get('JWT_ACCESS_SECRET') as string,
      { expiresIn: env.get('JWT_ACCESS_EXPIRATION') as string }
    )

    const refreshToken = jwt.sign(
      { userId, jti: crypto.randomUUID() },
      env.get('JWT_REFRESH_SECRET') as string,
      { expiresIn: env.get('JWT_REFRESH_EXPIRATION') as string }
    )

    return { accessToken, refreshToken }
  }
}
