import {
	Activity,
	Article,
	Exercise,
	Quiz,
} from '@/domain/activities/entities';

export interface IActivitiesRepository {
	find(): Promise<Activity[]>;
	findArticles(): Promise<Article[]>;
	findExercises(): Promise<Exercise[]>;
	findQuizzes(): Promise<Quiz[]>;

	findOne(id: string): Promise<Activity | null>;
	findOneArticle(id: string): Promise<Article | null>;
	findOneExercise(id: string): Promise<Exercise | null>;
	findOneQuiz(id: string): Promise<Quiz | null>;

	createArticle(): Promise<Article>;
	createExercise(): Promise<Exercise>;
	createQuiz(): Promise<Quiz>;

	updateArticle(): Promise<Article | null>;
	updateExercise(): Promise<Exercise | null>;
	updateQuiz(): Promise<Quiz | null>;

	remove(id: string): Promise<Activity | null>;
}
