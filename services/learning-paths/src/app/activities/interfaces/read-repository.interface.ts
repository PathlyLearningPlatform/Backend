import { OffsetPagination } from '@/app/common';
import {
	ActivityDto,
	ArticleDto,
	ExerciseDto,
	QuizDto,
	QuizWithoutQuestionsDto,
} from '../dtos';

type ActivityFilter = {
	options?: OffsetPagination;
	where?: Partial<{
		lessonId: string;
	}>;
};

export interface IActivityReadRepository {
	list(filter?: ActivityFilter): Promise<ActivityDto[]>;
	listArticles(filter?: ActivityFilter): Promise<ArticleDto[]>;
	listExercises(filter?: ActivityFilter): Promise<ExerciseDto[]>;
	listQuizzes(filter?: ActivityFilter): Promise<QuizWithoutQuestionsDto[]>;

	findById(id: string): Promise<ActivityDto | null>;
	findArticleById(id: string): Promise<ArticleDto | null>;
	findExerciseById(id: string): Promise<ExerciseDto | null>;
	findQuizById(id: string): Promise<QuizDto | null>;
}
