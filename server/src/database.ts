import { Client } from 'pg'
import { Validator } from 'jsonschema'

const DATABASE_URL = process.env.DATABASE_URL
const DATABASE_TABLE = 'results'

const getValidator = function() {
  const v = new Validator()
  const schema = {
    id: 'Result',
    type: 'object',
    properties: {
      tiles: { type: 'array' },
      avatar: { type: 'string' },
      playgroundType: { type: 'string' },
      missing: { type: 'string' },
      version: { type: 'string' },
      seed: { type: 'number' }
    },
    additionalProperties: false,
    minProperties: 6
  }
  return function(data: object) {
    return v.validate(data, schema)
  }
}

const getDatabase = async function() {
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

  async function getResults() : Promise<{id : number, data: object}[]> {
    const results = await client.query(`SELECT * from ${DATABASE_TABLE}`)
    return results.rows
  }

  async function postResult(data: object) {
    await client.query(`INSERT INTO ${DATABASE_TABLE} (data) VALUES ($1)`,[JSON.stringify(data)])
  }

  return { getResults, postResult}
}

export { getDatabase, getValidator }