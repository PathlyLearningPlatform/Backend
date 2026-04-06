import type {
	ActivityDto,
	ActivityProgressDto,
	ArticleDto,
	ExerciseDto,
	ListActivityProgressDto,
	QuizDto,
	QuizWithoutQuestionsDto,
} from "../dtos";
import type { ActivityFilter } from "./filter.interface";

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

export interface IActivityProgressReadRepository {
	list(dto: ListActivityProgressDto): Promise<ActivityProgressDto[]>;

	findById(id: string): Promise<ActivityProgressDto | null>;

	findOneForUser(
		activityId: string,
		userId: string,
	): Promise<ActivityProgressDto | null>;
}
