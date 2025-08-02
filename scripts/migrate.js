import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import db from '../src/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function run() {
  const dir = path.join(__dirname, '..', 'migrations')
  const files = fs.readdirSync(dir).sort()

  for (const file of files) {
    const filePath = path.join(dir, file)
    const sql = fs.readFileSync(filePath, 'utf8')
    console.log(`Running migration ${file}`)
    await db.query(sql)
  }

  await db.end()
  console.log('Migrations completed')
}

run().catch(err => {
  console.error('Migration failed', err)
  process.exit(1)
})
