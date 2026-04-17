import type {
	QuestionDto,
	QuizDto,
	QuizWithoutQuestionsDto,
} from '@/app/quizzes';
import type { QuestionResponseDto, QuizResponseDto } from './dtos/response.dto';
import type { ActivityType } from '../activities/enums';

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
