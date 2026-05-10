import { User } from './users.model'

export class UsersService {
  async getAllUsers() {
    return User.find({}, '-passwordHash -refreshToken')
  }

  async getUserById(id: string) {
    return User.findById(id, '-passwordHash -refreshToken')
  }

  async updateUser(id: string, data: any) {
    return User.findByIdAndUpdate(id, data, { new: true, select: '-passwordHash -refreshToken' })
  }

  async deleteUser(id: string) {
    const result = await User.findByIdAndDelete(id)
    return !!result
  }
}
