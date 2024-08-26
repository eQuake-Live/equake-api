import { Hono } from '@hono/hono'
import { RealTimeSindo } from '../system/mod.ts'
import { prettyJSON } from '@hono/hono/pretty-json'
import { cors } from '@hono/hono/cors'

const app = new Hono()

app.use(prettyJSON())
app.use(cors())

app.get('/', (c) =>
  c.json({
    name: 'eQuoke-Live kmoni API',
  }))

const realTimeSindoService = new RealTimeSindo()
app.get('/sindo', async (c) => {
  const sindo = await realTimeSindoService.getSindo()
  return c.json(sindo)
})

export default app
