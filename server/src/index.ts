import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import { logger } from './logger'
import { resolve } from 'path'
import _ from 'lodash'
import { getDatabase, getValidator } from './database'


const PORT = process.env.PORT || 8080
const API_PATH = '/api'
const STATIC_WEB_DIR = resolve(__dirname, '../public')

const app = express()

// SERVE STATIC FILES
app.use(express.static(STATIC_WEB_DIR))
app.use(express.json())

// POST SURVEY RESULT
app.post(`${API_PATH}/results`, async (req, res) => {
  logger.info('new result received')
  try {
    const validationResult = getValidator()(req.body)
    if (!validationResult.valid)
      throw new Error(JSON.stringify(validationResult.errors))

    const db = await getDatabase()
    await db.postResult(req.body)
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
    const results = await db.getResults()
    res.send(results)
  } catch (err) {
    logger.error(err)
    res.sendStatus(400)
  }
});

app.listen(PORT, () => {
  logger.info(`Server is running at http://localhost:${PORT}`)
});

export { app }



