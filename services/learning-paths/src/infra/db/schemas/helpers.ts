import { timestamp } from 'drizzle-orm/pg-core';

export const createdAt = timestamp().defaultNow().notNull();
export const updatedAt = timestamp().$onUpdateFn(() => new Date());
