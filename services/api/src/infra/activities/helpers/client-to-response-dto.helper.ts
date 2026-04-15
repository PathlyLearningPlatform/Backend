import type {
	ActivityDto,
	ActivityProgressDto,
	ArticleDto,
	ExerciseDto,
	QuizDto,
	QuizWithoutQuestionsDto,
	QuestionDto,
} from '@/app/activities/dtos';
import type {
	ActivityResponseDto,
	ActivityProgressResponseDto,
	ArticleResponseDto,
	ExerciseResponseDto,
	QuestionResponseDto,
	QuizResponseDto,
} from '../dtos';
import type { ActivityType, ExerciseDifficulty } from '../enums';

export function clientActivityToResponseDto(
	activity: ActivityDto,
): ActivityResponseDto {
	return {
		id: activity.id,
		lessonId: activity.lessonId,
		createdAt: activity.createdAt.toISOString(),
		name: activity.name,
		order: activity.order,
		type: activity.type as ActivityType,
		description: activity.description,
		updatedAt: activity.updatedAt ? activity.updatedAt.toISOString() : null,
	};
}

export function clientArticleToResponseDto(
	article: ArticleDto,
): ArticleResponseDto {
	return {
		id: article.id,
		lessonId: article.lessonId,
		createdAt: article.createdAt.toISOString(),
		name: article.name,
		order: article.order,
		ref: article.ref,
		type: article.type as ActivityType,
		description: article.description,
		updatedAt: article.updatedAt ? article.updatedAt.toISOString() : null,
	};
}

export function clientExerciseToResponseDto(
	exercise: ExerciseDto,
): ExerciseResponseDto {
	return {
		id: exercise.id,
		lessonId: exercise.lessonId,
		createdAt: exercise.createdAt.toISOString(),
		name: exercise.name,
		order: exercise.order,
		difficulty: exercise.difficulty as ExerciseDifficulty,
		type: exercise.type as ActivityType,
		description: exercise.description,
		updatedAt: exercise.updatedAt ? exercise.updatedAt.toISOString() : null,
	};
}

export function clientQuestionToResponseDto(
	question: QuestionDto,
): QuestionResponseDto {
	return {
		content: question.content,
		correctAnswer: question.correctAnswer,
		id: question.id,
		order: question.order,
		quizId: question.quizId,
	};
}

export function clientQuizToResponseDto(
	quiz: QuizDto | QuizWithoutQuestionsDto,
): QuizResponseDto {
	return {
		id: quiz.id,
		lessonId: quiz.lessonId,
		createdAt: quiz.createdAt.toISOString(),
		name: quiz.name,
		order: quiz.order,
		questions: ('questions' in quiz ? quiz.questions : []).map(
			clientQuestionToResponseDto,
		),
		type: quiz.type as ActivityType,
		description: quiz.description,
		updatedAt: quiz.updatedAt ? quiz.updatedAt.toISOString() : null,
	};
}

export function clientActivityProgressToResponseDto(
	progress: ActivityProgressDto,
): ActivityProgressResponseDto {
	return {
		activityId: progress.activityId,
		lessonId: progress.lessonId,
		userId: progress.userId,
		completedAt: progress.completedAt?.toISOString() ?? null,
	};
}
