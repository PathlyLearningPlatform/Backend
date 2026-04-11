import type z from 'zod';
import type { appConfigSchema } from './schema';

/**
 * @description Type infered from appConfigSchema
 */
export type AppConfig = z.infer<typeof appConfigSchema>;

export type Config = AppConfig;
