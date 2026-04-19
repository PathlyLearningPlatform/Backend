import { ActivityType } from '@/domain/activities';

export interface QuestionDto {
	id: string;
	content: string;
	correctAnswer: string;
	quizId: string;
	order: number;
}

export interface QuizDto {
	id: string;
	lessonId: string;
	name: string;
	description: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	type: ActivityType;
	order: number;
	questionCount: number;
	questions: QuestionDto[];
}

export interface QuizWithoutQuestionsDto {
	id: string;
	lessonId: string;
	name: string;
	description: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	type: ActivityType;
	order: number;
	questionCount: number;
}

export interface QuizAttemptDto {
	id: string;
	userId: string;
	quizId: string;
	attemptedAt: Date;
	answers: {
		questionId: string;
		text: string;
		isCorrect: boolean;
	}[];
	score: number;
}
