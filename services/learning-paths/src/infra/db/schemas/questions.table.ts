import { pgTable, uuid, text, primaryKey, integer } from 'drizzle-orm/pg-core';
import { quizzesTable } from './quizzes.table';

export const questionsTable = pgTable(
	'questions',
	{
		id: integer().notNull(),
		quizId: uuid('quiz_id')
			.notNull()
			.references(() => quizzesTable.activityId, { onDelete: 'cascade' }),
		content: text('content').notNull(),
		correctAnswer: text('correct_answer').notNull(),
	},
	(t) => [primaryKey({ columns: [t.quizId, t.id] })],
);
