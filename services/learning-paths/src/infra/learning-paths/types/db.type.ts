import type { learningPathsTable } from '@/infra/db/schemas';

export type DbLearningPath = typeof learningPathsTable.$inferSelect;
