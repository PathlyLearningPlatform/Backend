import type z from 'zod';
import type { appConfigSchema } from '../schemas';

export type Config = z.infer<typeof appConfigSchema>;
