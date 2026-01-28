import type {
	activitiesTable,
	articlesTable,
	exercisesTable,
	quizzesTable,
} from '@/infra/db/schemas';

export type DbActivity = typeof activitiesTable.$inferSelect;
export type DbArticle = typeof articlesTable.$inferSelect;
export type DbExercise = typeof exercisesTable.$inferSelect;
export type DbQuiz = typeof quizzesTable.$inferSelect;
