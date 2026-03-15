import type z from 'zod';
import type { appConfigSchema } from './schema';

/**
 * @description Type infered from appConfigSchema
 */
export type Config = z.infer<typeof appConfigSchema>;
