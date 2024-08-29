import { Hono } from '@hono/hono'
import { RealTimeSindo } from '../system/mod.ts'
import { prettyJSON } from '@hono/hono/pretty-json'
import { cors } from '@hono/hono/cors'
import { KeihoService } from '../system/keiho/mod.ts'

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

const keihoService = new KeihoService()
app.get('/keiho', async (c) => {
  const keiho = await keihoService.getKeiho()
  return c.json(keiho)
})
app.get('/areacodes', async (c) => c.json(await keihoService.getAreaCodes()))

app.get('/time', c => c.json({
  time: new Date().getTime(),
  string: new Date().toUTCString()
}))


export default app
