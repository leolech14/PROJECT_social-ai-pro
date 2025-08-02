import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET
    if (!this.jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required')
    }
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
    } catch {
      return null
    }
  }

  async createUser({ email, password, name }) {
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0) {
      throw new Error('User already exists')
    }

    const hashedPassword = await this.hashPassword(password)
    const result = await db.query(
      `INSERT INTO users (email, name, password, created_at, subscription, videos_created, monthly_limit)
       VALUES ($1, $2, $3, NOW(), 'free', 0, 3)
       RETURNING id, email, name, created_at AS "createdAt", subscription, videos_created AS "videosCreated", monthly_limit AS "monthlyLimit"`,
      [email, name, hashedPassword]
    )

    const user = result.rows[0]
    return {
      user,
      token: this.generateToken(user.id, user.email)
    }
  }

  async loginUser({ email, password }) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isValid = await this.verifyPassword(password, user.password)
    if (!isValid) {
      throw new Error('Invalid credentials')
    }

    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.created_at,
      subscription: user.subscription,
      videosCreated: user.videos_created,
      monthlyLimit: user.monthly_limit
    }

    return {
      user: userWithoutPassword,
      token: this.generateToken(user.id, user.email)
    }
  }

  async getUserById(userId) {
    const result = await db.query(
      `SELECT id, email, name, created_at AS "createdAt", subscription, videos_created AS "videosCreated", monthly_limit AS "monthlyLimit"
       FROM users WHERE id = $1`,
      [userId]
    )
    return result.rows[0] || null
  }

  async updateUserSubscription(userId, subscription) {
    const limit = subscription === 'pro' || subscription === 'business' ? -1 : 3
    const result = await db.query(
      `UPDATE users SET subscription = $2, monthly_limit = $3 WHERE id = $1
       RETURNING id, email, name, created_at AS "createdAt", subscription, videos_created AS "videosCreated", monthly_limit AS "monthlyLimit"`,
      [userId, subscription, limit]
    )
    if (result.rows.length === 0) {
      throw new Error('User not found')
    }
    return result.rows[0]
  }

  async incrementVideoCount(userId) {
    const result = await db.query(
      `UPDATE users SET videos_created = videos_created + 1 WHERE id = $1 RETURNING videos_created`,
      [userId]
    )
    if (result.rows.length === 0) {
      throw new Error('User not found')
    }
    return result.rows[0].videos_created
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
