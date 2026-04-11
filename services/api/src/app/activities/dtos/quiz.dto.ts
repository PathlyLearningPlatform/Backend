import type { ActivityDto } from './activity.dto';

export interface QuestionDto {
	id: string;
	content: string;
	correctAnswer: string;
	quizId: string;
	order: number;
}

export interface QuizDto extends ActivityDto {
	questionCount: number;
	questions: QuestionDto[];
}

export interface QuizWithoutQuestionsDto extends ActivityDto {
	questionCount: number;
}
