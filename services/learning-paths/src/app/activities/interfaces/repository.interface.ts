import {
	Activity,
	ActivityQuery,
	Article,
	Exercise,
	Quiz,
} from '@/domain/activities/entities';

export interface IActivitiesRepository {
	find(query: ActivityQuery): Promise<Activity[]>;

	findOne(id: string): Promise<Activity | null>;
	findOneArticle(activityId: string): Promise<Article | null>;
	findOneExercise(activityId: string): Promise<Exercise | null>;
	findOneQuiz(activityId: string): Promise<Quiz | null>;

	saveArticle(entity: Article): Promise<void>;
	saveExercise(entity: Exercise): Promise<void>;
	saveQuiz(entity: Quiz): Promise<void>;

	remove(id: string): Promise<boolean>;
}
