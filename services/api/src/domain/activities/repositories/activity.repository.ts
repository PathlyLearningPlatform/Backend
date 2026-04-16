import type { Activity } from '../activity.aggregate';
import type { Article } from '../articles/article.aggregate';
import type { Exercise } from '../exercises/exercise.aggregate';
import type { Quiz } from '../quizzes/quiz.aggregate';
import type { ActivityId } from '../value-objects';

export type ListActivitiesOptions = {
	options?: Partial<{
		limit: number;
		page: number;
	}>;
	where?: Partial<{
		lessonId: string;
	}>;
};

export interface IActivityRepository {
	findById(id: ActivityId): Promise<Activity | null>;

	list(options?: ListActivitiesOptions): Promise<Activity[]>;

	listArticles(options?: ListActivitiesOptions): Promise<Article[]>;

	listExercises(options?: ListActivitiesOptions): Promise<Exercise[]>;

	listQuizzes(options?: ListActivitiesOptions): Promise<Quiz[]>;

	findArticleById(id: ActivityId): Promise<Article | null>;

	findExerciseById(id: ActivityId): Promise<Exercise | null>;

	findQuizById(id: ActivityId): Promise<Quiz | null>;

	save(aggregate: Activity): Promise<void>;

	remove(id: ActivityId): Promise<boolean>;
}
