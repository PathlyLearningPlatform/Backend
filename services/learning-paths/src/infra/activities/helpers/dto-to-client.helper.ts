import {
	ActivityDto,
	ArticleDto,
	ExerciseDto,
	QuizDto,
	QuizWithoutQuestionsDto,
	QuestionDto,
} from '@/app/activities/dtos';
import {
	type Activity,
	type Article,
	type Exercise,
	type Quiz,
	type Question,
	ActivityType as ContractActivityType,
	ExerciseDifficulty as ContractExerciseDifficulty,
} from '@pathly-backend/contracts/learning-paths/v1/activities.js';
import { ActivityType } from '@/domain/activities/value-objects';
import { ExerciseDifficulty } from '@/domain/activities/exercises/value-objects';

const activityTypeToContract: Record<string, ContractActivityType> = {
	[ActivityType.ARTICLE]: ContractActivityType.ARTICLE,
	[ActivityType.EXERCISE]: ContractActivityType.EXERCISE,
	[ActivityType.QUIZ]: ContractActivityType.QUIZ,
};

const exerciseDifficultyToContract: Record<string, ContractExerciseDifficulty> =
	{
		[ExerciseDifficulty.EASY]: ContractExerciseDifficulty.EASY,
		[ExerciseDifficulty.MEDIUM]: ContractExerciseDifficulty.MEDIUM,
		[ExerciseDifficulty.HARD]: ContractExerciseDifficulty.HARD,
	};

export function activityDtoToClient(dto: ActivityDto): Activity {
	return {
		id: dto.id,
		createdAt: dto.createdAt.toISOString(),
		updatedAt: dto.updatedAt?.toISOString() ?? '',
		name: dto.name,
		description: dto.description ?? '',
		order: dto.order,
		lessonId: dto.lessonId,
		type:
			activityTypeToContract[(dto as any).type] ?? ContractActivityType.ARTICLE,
	};
}

export function articleDtoToClient(dto: ArticleDto): Article {
	return {
		id: dto.id,
		createdAt: dto.createdAt.toISOString(),
		updatedAt: dto.updatedAt?.toISOString() ?? '',
		name: dto.name,
		description: dto.description ?? '',
		order: dto.order,
		lessonId: dto.lessonId,
		type: ContractActivityType.ARTICLE,
		ref: dto.ref,
	};
}

export function exerciseDtoToClient(dto: ExerciseDto): Exercise {
	return {
		id: dto.id,
		createdAt: dto.createdAt.toISOString(),
		updatedAt: dto.updatedAt?.toISOString() ?? '',
		name: dto.name,
		description: dto.description ?? '',
		order: dto.order,
		lessonId: dto.lessonId,
		type: ContractActivityType.EXERCISE,
		difficulty: exerciseDifficultyToContract[dto.difficulty],
	};
}

export function questionDtoToClient(dto: QuestionDto): Question {
	return {
		id: dto.id,
		quizId: dto.quizId,
		content: dto.content,
		correctAnswer: dto.correctAnswer,
		order: 0,
	};
}

export function quizDtoToClient(dto: QuizDto): Quiz {
	return {
		id: dto.id,
		createdAt: dto.createdAt.toISOString(),
		updatedAt: dto.updatedAt?.toISOString() ?? '',
		name: dto.name,
		description: dto.description ?? '',
		order: dto.order,
		lessonId: dto.lessonId,
		type: ContractActivityType.QUIZ,
		questions: dto.questions.map(questionDtoToClient),
	};
}

export function quizWithoutQuestionsDtoToClient(
	dto: QuizWithoutQuestionsDto,
): Quiz {
	return {
		id: dto.id,
		createdAt: dto.createdAt.toISOString(),
		updatedAt: dto.updatedAt?.toISOString() ?? '',
		name: dto.name,
		description: dto.description ?? '',
		order: dto.order,
		lessonId: dto.lessonId,
		type: ContractActivityType.QUIZ,
		questions: [],
	};
}
