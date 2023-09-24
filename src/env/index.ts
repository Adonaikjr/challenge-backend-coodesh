import 'dotenv/config'
import { z } from 'zod'

// configurações de tipagem dotenv para ativar o IntelliSense ao invez de usar process.env, importamos o env e usamos env.SEU_ENV
const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  DATABASE_NAME: z.string(),
  COLLECTION_STREAM: z.string(),
  COLLECTION_PRODUCT: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('variaveis de ambiente inválida', _env.error.format())
  throw new Error('Variaveis de ambiente inválida')
}

export const env = _env.data
