import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type * as schema from '@/infra/db/schemas';

export type Db = NodePgDatabase<typeof schema>;
