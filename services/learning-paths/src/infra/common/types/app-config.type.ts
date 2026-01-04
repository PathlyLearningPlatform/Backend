import type z from 'zod';
import type { appConfigSchema } from '../schemas';

/**
 * @description Type infered from appConfigSchema
 */
export type Config = z.infer<typeof appConfigSchema>;
