import { User } from '#app/modules/users/users.model'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import env from '#start/env'
import crypto from 'crypto'
import { EmailService } from '#app/modules/email/email.service'

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

  async forgotPassword(email: string) {
    const user = await User.findOne({ email })
    if (!user) {
      return { success: false, message: 'User not found' }
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')

    user.resetPasswordToken = resetTokenHash
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    await user.save()

    const emailService = new EmailService()
    const emailSent = await emailService.sendPasswordResetEmail(user.email, resetToken)

    if (!emailSent) {
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      await user.save()
      return { success: false, message: 'Could not send reset email' }
    }

    return { success: true }
  }

  async resetPassword(token: string, newPassword: string) {
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: new Date() },
    })

    if (!user) {
      return { success: false, message: 'Invalid or expired password reset token' }
    }

    const salt = await bcrypt.genSalt(10)
    user.passwordHash = await bcrypt.hash(newPassword, salt)
    
    // Clear reset token fields
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    
    await user.save()

    return { success: true }
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
