import type {
	learningPathProgressTable,
	learningPathsTable,
} from '@/infra/db/schemas';

export type DbLearningPath = typeof learningPathsTable.$inferSelect;
export type DbLearningPathProgress =
	typeof learningPathProgressTable.$inferSelect;
