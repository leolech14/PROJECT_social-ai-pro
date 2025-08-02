import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    this.jwtExpiry = '7d'
    this.saltRounds = 10
  }

  async hashPassword(password) {
    return bcrypt.hash(password, this.saltRounds)
  }

  async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash)
  }

  generateToken(userId, email) {
    return jwt.sign(
      { userId, email },
      this.jwtSecret,
      { expiresIn: this.jwtExpiry }
    )
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret)
    } catch (error) {
      return null
    }
  }

  // Mock user storage - in production, use a real database
  users = new Map()

  async createUser({ email, password, name }) {
    // Check if user exists
    if (this.users.has(email)) {
      throw new Error('User already exists')
    }

    const hashedPassword = await this.hashPassword(password)
    const user = {
      id: Date.now().toString(),
      email,
      name,
      password: hashedPassword,
      createdAt: new Date(),
      subscription: 'free',
      videosCreated: 0,
      monthlyLimit: 3
    }

    this.users.set(email, user)
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return {
      user: userWithoutPassword,
      token: this.generateToken(user.id, user.email)
    }
  }

  async loginUser({ email, password }) {
    const user = this.users.get(email)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isValid = await this.verifyPassword(password, user.password)
    if (!isValid) {
      throw new Error('Invalid credentials')
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return {
      user: userWithoutPassword,
      token: this.generateToken(user.id, user.email)
    }
  }

  async getUserById(userId) {
    for (const user of this.users.values()) {
      if (user.id === userId) {
        const { password: _, ...userWithoutPassword } = user
        return userWithoutPassword
      }
    }
    return null
  }

  async updateUserSubscription(userId, subscription) {
    for (const [email, user] of this.users.entries()) {
      if (user.id === userId) {
        const updatedUser = {
          ...user,
          subscription,
          monthlyLimit: subscription === 'pro' ? -1 : subscription === 'business' ? -1 : 3
        }
        this.users.set(email, updatedUser)
        const { password: _, ...userWithoutPassword } = updatedUser
        return userWithoutPassword
      }
    }
    throw new Error('User not found')
  }

  async incrementVideoCount(userId) {
    for (const [email, user] of this.users.entries()) {
      if (user.id === userId) {
        const updatedUser = {
          ...user,
          videosCreated: user.videosCreated + 1
        }
        this.users.set(email, updatedUser)
        return updatedUser.videosCreated
      }
    }
    throw new Error('User not found')
  }

  async checkVideoLimit(userId) {
    const user = await this.getUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    if (user.subscription !== 'free') {
      return { allowed: true, remaining: -1 }
    }

    const allowed = user.videosCreated < user.monthlyLimit
    const remaining = Math.max(0, user.monthlyLimit - user.videosCreated)
    
    return { allowed, remaining }
  }
}

export default AuthService