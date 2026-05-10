import mongoose, { Schema, Document } from 'mongoose'

export interface UserDocument extends Document {
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  role: 'user' | 'admin'
  avatar?: string
  refreshToken?: string
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: {
      type: String,
      required: false,
    },
    refreshToken: {
      type: String,
      required: false,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
)

export const User = mongoose.model<UserDocument>('User', userSchema)
