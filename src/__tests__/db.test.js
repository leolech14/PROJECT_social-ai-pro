import { jest } from '@jest/globals'

describe('Database configuration', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  it('throws an error when DATABASE_URL is missing', async () => {
    delete process.env.DATABASE_URL
    await expect(import('../db.js')).rejects.toThrow('DATABASE_URL environment variable is required')
  })

  it('throws an error when DATABASE_URL is malformed', async () => {
    process.env.DATABASE_URL = 'not-a-valid-url'
    await expect(import('../db.js')).rejects.toThrow(/Invalid DATABASE_URL/)
  })
})
