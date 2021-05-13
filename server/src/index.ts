import express from 'express'
import { logger } from './logger'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import { resolve } from 'path'

const PORT = 8000
const API_PATH = '/api'
const DATA_FILE = resolve(__dirname, '../data/data.json')
const STATIC_WEB_DIR = resolve(__dirname, '../../app/build')

type DbSchema = {
  results: any[]
}

async function getDatabase() {
  const adapter = new FileSync<DbSchema>(DATA_FILE)
  const db = low(adapter)
  await db.defaults({ results: []}).write()
  return db
}

const app = express()

// SERVE STATIC FILES
app.use(express.static(STATIC_WEB_DIR))
app.use(express.json())

// POST SURVEY RESULT
app.post(`${API_PATH}/results`, async (req, res) => {
  const db = await getDatabase()
  db.get('results').push(req.body).write()
  logger.info('new result received')
  res.sendStatus(200)
});

// GET SURVEY RESULTS
app.get(`${API_PATH}/results`, async (req, res) => {
  const db = await getDatabase()
  const results = db.get('results')
  res.send(results.value())
});

app.listen(PORT, () => {
  logger.info(`Server is running at https://localhost:${PORT}`)
});


