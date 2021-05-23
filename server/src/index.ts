import express from 'express'
import { logger } from './logger'
import { resolve } from 'path'
import { Client } from 'pg'
// import { config } from './config'
import _ from 'lodash'

const PORT = process.env.PORT || 8080
const API_PATH = '/api'
const STATIC_WEB_DIR = resolve(__dirname, '../public')


const DATABASE_TABLE = 'results'
const DATABASE_URL = process.env.DATABASE_URL 
// const DATABASE_URL = process.env.DATABASE_URL || config.connectionString

async function getDatabase() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    
  })
  await client.connect()

  //check if table exists, else create it
  try {
    await client.query(`SELECT * FROM ${DATABASE_TABLE};`)
  } catch (err) {
    await client.query(
    `CREATE TABLE ${DATABASE_TABLE} ( 
      id SERIAL PRIMARY KEY,
      data jsonb NOT NULL
    );`)
  }
  return client
}

const app = express()

// SERVE STATIC FILES
app.use(express.static(STATIC_WEB_DIR))
app.use(express.json())

const validateData = function(data : any) {
  if (!_.has(data,'tiles'))
    throw new Error("Data does not contain tiles data")
  if (!_.has(data,'avatar'))
    throw new Error("Data does not contain avatar")
  if (!_.has(data,'playgroundType'))
    throw new Error("Data does not contain playground type")
  if (!_.has(data,'missing'))
    throw new Error("Data does not contain playground missing")
  if (!_.has(data,'version'))
    throw new Error("Data does not contain version")
  if (!_.has(data,'seed'))
    throw new Error("Data does not contain seed")

  return _.pick(data, ['tiles', 'avatar', 'playgroundType', 'missing', 'version', 'seed' ])
}

// POST SURVEY RESULT
app.post(`${API_PATH}/results`, async (req, res) => {
  logger.info('new result received')
  try {
    validateData(req.body)
    const db = await getDatabase()
    await db.query(`INSERT INTO ${DATABASE_TABLE} (data) VALUES ($1)`,[JSON.stringify(req.body)])
    res.sendStatus(200)
  } catch (err) {
    logger.error(err)
    res.sendStatus(400)
  }
});

// GET SURVEY RESULTS
app.get(`${API_PATH}/results`, async (req, res) => {
  try {
    const db = await getDatabase()
    const results = await db.query(`SELECT * from ${DATABASE_TABLE}`)
    res.send(results.rows)
  } catch (err) {
    logger.error(err)
    res.sendStatus(400)
  }
});

app.listen(PORT, () => {
  logger.info(`Server is running at http://localhost:${PORT}`)
});

export { app }



