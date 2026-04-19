import {
	QuizDto,
	QuestionDto,
	QuizWithoutQuestionsDto,
	QuizAttemptDto,
} from './dtos';
import { Quiz, QuizAttempt } from '@/domain/quizzes';

export function questionToDto(quiz: Quiz): QuestionDto[] {
	return quiz.questions.map((question) => ({
		id: question.id.value,
		quizId: question.quizId.value,
		content: question.content,
		correctAnswer: question.correctAnswer,
		order: question.order.value,
	}));
}

export function aggregateToDto(aggregate: Quiz): QuizDto {
	return {
		id: aggregate.id.value,
		lessonId: aggregate.lessonId.value,
		name: aggregate.name.value,
		description: aggregate.description?.value ?? null,
		createdAt: aggregate.createdAt,
		updatedAt: aggregate.updatedAt,
		order: aggregate.order.value,
		type: aggregate.type,
		questionCount: aggregate.questionCount,
		questions: questionToDto(aggregate),
	};
}

export function aggregateToPreviewDto(
	aggregate: Quiz,
): QuizWithoutQuestionsDto {
	return {
		id: aggregate.id.value,
		lessonId: aggregate.lessonId.value,
		name: aggregate.name.value,
		description: aggregate.description?.value ?? null,
		createdAt: aggregate.createdAt,
		updatedAt: aggregate.updatedAt,
		order: aggregate.order.value,
		type: aggregate.type,
		questionCount: aggregate.questionCount,
	};
}

export function attemptToDto(attempt: QuizAttempt): QuizAttemptDto {
	return {
		id: attempt.id.value,
		quizId: attempt.quizId.value,
		userId: attempt.userId.toString(),
		attemptedAt: attempt.attemptedAt,
		score: attempt.score,
		answers: attempt.answers.map((item) => ({
			isCorrect: item.isCorrect ?? false,
			text: item.text,
			questionId: item.questionId.value,
		})),
	};
}
