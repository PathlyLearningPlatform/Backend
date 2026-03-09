import { learningPathsTable } from '@/infra/common/db/schemas';

export type DbLearningPath = typeof learningPathsTable.$inferSelect;
