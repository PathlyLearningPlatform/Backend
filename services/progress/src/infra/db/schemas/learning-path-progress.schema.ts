import { LearningPathProgressStatus } from '@/domain/learning-path-progress/enums';
import {
	integer,
	pgEnum,
	pgTable,
	timestamp,
	unique,
	uuid,
} from 'drizzle-orm/pg-core';

const status = pgEnum(
	'learning_path_progress_status',
	LearningPathProgressStatus,
);

export const learningPathProgressTable = pgTable(
	'learning_path_progress',
	{
		id: uuid('id').primaryKey(),
		learningPathId: uuid('learning_path_id').notNull(),
		userId: uuid('user_id').notNull(),
		status: status().notNull().default(LearningPathProgressStatus.NOT_STARTED),
		completedSectionsCount: integer('completed_sections_count')
			.notNull()
			.default(0),
		completedAt: timestamp(),
	},
	(t) => [unique().on(t.learningPathId, t.userId)],
);
