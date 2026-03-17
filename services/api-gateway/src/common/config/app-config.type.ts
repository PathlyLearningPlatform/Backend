import type { z } from 'zod'
import type { appConfigSchema } from './app-config.schema'

export type AppConfig = z.infer<typeof appConfigSchema>
