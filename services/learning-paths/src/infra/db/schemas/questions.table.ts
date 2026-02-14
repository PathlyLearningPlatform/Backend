import { pgTable, uuid, text, primaryKey, serial } from 'drizzle-orm/pg-core';
import { quizzesTable } from './quizzes.table';

export const questionsTable = pgTable(
	'questions',
	{
		id: serial(),
		quizId: uuid()
			.notNull()
			.references(() => quizzesTable.activityId),
		content: text().notNull(),
		correctAnswer: text().notNull(),
	},
	(t) => [primaryKey({ columns: [t.quizId, t.id] })],
);
