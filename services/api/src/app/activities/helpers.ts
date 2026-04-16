import type { Activity } from '@/domain/activities/activity.aggregate';
import type { Article } from '@/domain/activities/articles/article.aggregate';
import type { Exercise } from '@/domain/activities/exercises/exercise.aggregate';
import type { Quiz } from '@/domain/activities/quizzes/quiz.aggregate';
import type { ActivityProgress } from '@/domain/activities/progress.aggregate';
import type {
	ActivityDto,
	ActivityProgressDto,
	ArticleDto,
	ExerciseDto,
	QuestionDto,
	QuizDto,
	QuizWithoutQuestionsDto,
} from './dtos';

export function aggregateToDto(aggregate: Activity): ActivityDto {
	return {
		id: aggregate.id.value,
		lessonId: aggregate.lessonId.value,
		name: aggregate.name.value,
		description: aggregate.description?.value ?? null,
		createdAt: aggregate.createdAt,
		updatedAt: aggregate.updatedAt,
		order: aggregate.order.value,
		type: aggregate.type,
	};
}

function questionToDto(quiz: Quiz): QuestionDto[] {
	return quiz.questions.map((question) => ({
		id: question.id.value,
		quizId: question.quizId.value,
		content: question.content,
		correctAnswer: question.correctAnswer,
		order: question.order.value,
	}));
}

export function articleAggregateToDto(aggregate: Article): ArticleDto {
	return {
		...aggregateToDto(aggregate),
		ref: aggregate.ref.value,
	};
}

export function exerciseAggregateToDto(aggregate: Exercise): ExerciseDto {
	return {
		...aggregateToDto(aggregate),
		difficulty: aggregate.difficulty,
	};
}

export function quizAggregateToDto(aggregate: Quiz): QuizDto {
	return {
		...aggregateToDto(aggregate),
		questionCount: aggregate.questionCount,
		questions: questionToDto(aggregate),
	};
}

export function quizAggregateToPreviewDto(
	aggregate: Quiz,
): QuizWithoutQuestionsDto {
	return {
		...aggregateToDto(aggregate),
		questionCount: aggregate.questionCount,
	};
}

export function progressAggregateToDto(
	aggregate: ActivityProgress,
): ActivityProgressDto {
	return {
		activityId: aggregate.activityId.value,
		lessonId: aggregate.lessonId.value,
		userId: aggregate.userId.toString(),
		completedAt: aggregate.completedAt,
	};
}
