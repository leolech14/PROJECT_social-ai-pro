import pkg from 'pg'

const { Pool } = pkg

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required')
}

try {
  // Ensure the connection string is a valid URL
  new URL(connectionString)
} catch (error) {
  throw new Error(`Invalid DATABASE_URL: ${error.message}`)
}

const pool = new Pool({
  connectionString,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined
})

export default {
  query: (text, params) => pool.query(text, params),
  end: () => pool.end()
}
