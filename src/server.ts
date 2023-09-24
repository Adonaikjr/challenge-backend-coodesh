import { env } from './env'
import { app } from './app'

app.listen(env.PORT, () => {
  console.log(`servidor online porta: ${env.PORT}`)
})
