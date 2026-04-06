import type {
	ActivityDto,
	ArticleDto,
	ExerciseDto,
	QuestionDto,
	QuizDto,
	QuizWithoutQuestionsDto,
} from "@/app/activities/dtos";
import type { LearningPathDto } from "@/app/learning-paths/dtos";
import type { LessonDto } from "@/app/lessons/dtos";
import type { SectionDto } from "@/app/sections/dtos";
import type { UnitDto } from "@/app/units/dtos";
import { ExerciseDifficulty } from "@/domain/activities/exercises/value-objects";
import { ActivityType } from "@/domain/activities/value-objects";
import { DEFAULT_DATE, TEST_IDS } from "./test-ids";

export function makeLearningPathDto(
	overrides?: Partial<LearningPathDto>,
): LearningPathDto {
	return {
		id: TEST_IDS.learningPath,
		createdAt: DEFAULT_DATE,
		updatedAt: null,
		name: "Test LP",
		description: null,
		sectionCount: 0,
		...overrides,
	};
}

export function makeSectionDto(overrides?: Partial<SectionDto>): SectionDto {
	return {
		id: TEST_IDS.section,
		learningPathId: TEST_IDS.learningPath,
		createdAt: DEFAULT_DATE,
		updatedAt: null,
		name: "Test Section",
		description: null,
		order: 0,
		unitCount: 0,
		...overrides,
	};
}

export function makeUnitDto(overrides?: Partial<UnitDto>): UnitDto {
	return {
		id: TEST_IDS.unit,
		sectionId: TEST_IDS.section,
		createdAt: DEFAULT_DATE,
		updatedAt: null,
		name: "Test Unit",
		description: null,
		order: 0,
		lessonCount: 0,
		...overrides,
	};
}

export function makeLessonDto(overrides?: Partial<LessonDto>): LessonDto {
	return {
		id: TEST_IDS.lesson,
		unitId: TEST_IDS.unit,
		createdAt: DEFAULT_DATE,
		updatedAt: null,
		name: "Test Lesson",
		description: null,
		order: 0,
		activityCount: 0,
		...overrides,
	};
}

export function makeActivityDto(overrides?: Partial<ActivityDto>): ActivityDto {
	return {
		id: TEST_IDS.activity,
		lessonId: TEST_IDS.lesson,
		name: "Test Activity",
		description: null,
		createdAt: DEFAULT_DATE,
		updatedAt: null,
		type: ActivityType.ARTICLE,
		order: 0,
		...overrides,
	};
}

export function makeArticleDto(overrides?: Partial<ArticleDto>): ArticleDto {
	return {
		id: TEST_IDS.article,
		lessonId: TEST_IDS.lesson,
		name: "Test Article",
		description: null,
		createdAt: DEFAULT_DATE,
		updatedAt: null,
		type: ActivityType.ARTICLE,
		order: 0,
		ref: "https://example.com",
		...overrides,
	};
}

export function makeExerciseDto(overrides?: Partial<ExerciseDto>): ExerciseDto {
	return {
		id: TEST_IDS.exercise,
		lessonId: TEST_IDS.lesson,
		name: "Test Exercise",
		description: null,
		createdAt: DEFAULT_DATE,
		updatedAt: null,
		type: ActivityType.EXERCISE,
		order: 0,
		difficulty: ExerciseDifficulty.EASY,
		...overrides,
	};
}

export function makeQuizDto(overrides?: Partial<QuizDto>): QuizDto {
	return {
		id: TEST_IDS.quiz,
		lessonId: TEST_IDS.lesson,
		name: "Test Quiz",
		description: null,
		createdAt: DEFAULT_DATE,
		updatedAt: null,
		type: ActivityType.QUIZ,
		order: 0,
		questionCount: 0,
		questions: [],
		...overrides,
	};
}

export function makeQuizWithoutQuestionsDto(
	overrides?: Partial<QuizWithoutQuestionsDto>,
): QuizWithoutQuestionsDto {
	return {
		id: TEST_IDS.quiz,
		lessonId: TEST_IDS.lesson,
		name: "Test Quiz",
		description: null,
		createdAt: DEFAULT_DATE,
		updatedAt: null,
		type: ActivityType.QUIZ,
		order: 0,
		questionCount: 0,
		...overrides,
	};
}

export function makeQuestionDto(overrides?: Partial<QuestionDto>): QuestionDto {
	return {
		id: TEST_IDS.question,
		quizId: TEST_IDS.quiz,
		content: "What is 1+1?",
		correctAnswer: "2",
		...overrides,
	};
}
