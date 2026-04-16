import type { ActivityType } from '@/domain/activities';
import type { ExerciseDifficulty } from '@/domain/exercises';

export interface ActivityDto {
	id: string;
	lessonId: string;
	name: string;
	description: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	type: ActivityType;
	order: number;
}

export interface ArticleDto extends ActivityDto {
	ref: string;
}

export interface ExerciseDto extends ActivityDto {
	difficulty: ExerciseDifficulty;
}

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

export interface ActivityProgressDto {
	activityId: string;
	lessonId: string;
	userId: string;
	completedAt: Date | null;
}
