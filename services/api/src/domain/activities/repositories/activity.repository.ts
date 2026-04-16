import type { Activity } from '../activity.aggregate';
import type { Article } from '@domain/articles/article.aggregate';
import type { Exercise } from '@domain/exercises/exercise.aggregate';
import type { Quiz } from '@domain/quizzes/quiz.aggregate';
import type { ActivityId } from '../value-objects';
import { LessonId } from '@/domain/lessons';
import { Order } from '@/domain/common';

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

	findByLessonIdAndOrder(
		lessonId: LessonId,
		order: Order,
	): Promise<Activity | null>;

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
