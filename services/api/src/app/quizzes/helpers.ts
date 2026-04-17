import { QuizDto, QuestionDto, QuizWithoutQuestionsDto } from './dtos';
import { Quiz } from '@/domain/quizzes';
import { aggregateToDto as activityAggregateToDto } from '../activities/helpers';

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
		...activityAggregateToDto(aggregate),
		questionCount: aggregate.questionCount,
		questions: questionToDto(aggregate),
	};
}

export function aggregateToPreviewDto(
	aggregate: Quiz,
): QuizWithoutQuestionsDto {
	return {
		...activityAggregateToDto(aggregate),
		questionCount: aggregate.questionCount,
	};
}
