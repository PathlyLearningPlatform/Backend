import { LearningPath } from '@/domain/learning-paths/learning-path.aggregate';
import { LearningPathId } from '@/domain/learning-paths/value-objects/id.vo';
import { Section } from '@/domain/sections/section.aggregate';
import { SectionId } from '@/domain/sections/value-objects/id.vo';
import { SectionName } from '@/domain/sections/value-objects/name.vo';
import { Unit } from '@/domain/units/unit.aggregate';
import { UnitId } from '@/domain/units/value-objects/id.vo';
import { UnitName } from '@/domain/units/value-objects/name.vo';
import { Lesson } from '@/domain/lessons/lesson.aggregate';
import { LessonId } from '@/domain/lessons/value-objects/id.vo';
import { LessonName } from '@/domain/lessons/value-objects/name.vo';
import { Article } from '@/domain/activities/articles/article.aggregate';
import { Exercise } from '@/domain/activities/exercises/exercise.aggregate';
import { Quiz } from '@/domain/activities/quizzes/quiz.aggregate';
import { Question } from '@/domain/activities/quizzes/question.entity';
import { ActivityId } from '@/domain/activities/value-objects/id.vo';
import { ActivityName } from '@/domain/activities/value-objects/name.vo';
import { ExerciseDifficulty } from '@/domain/activities/exercises/value-objects';
import { QuestionId } from '@/domain/activities/quizzes/value-objects';
import { Url, Order } from '@/domain/common';
import { DEFAULT_DATE, TEST_IDS } from './test-ids';

export function makeLearningPath(overrides?: { id?: string; name?: string }) {
	return LearningPath.create(
		LearningPathId.create(overrides?.id ?? TEST_IDS.LP_ID),
		{
			name: overrides?.name ?? 'Test Path',
			createdAt: DEFAULT_DATE,
		},
	);
}

export function makeSection(overrides?: {
	id?: string;
	learningPathId?: string;
	order?: number;
}) {
	return Section.create(
		SectionId.create(overrides?.id ?? TEST_IDS.SECTION_ID),
		{
			learningPathId: LearningPathId.create(
				overrides?.learningPathId ?? TEST_IDS.LP_ID,
			),
			name: SectionName.create('Test Section'),
			createdAt: DEFAULT_DATE,
			order: Order.create(overrides?.order ?? 0),
		},
	);
}

export function makeUnit(overrides?: {
	id?: string;
	sectionId?: string;
	order?: number;
}) {
	return Unit.create(UnitId.create(overrides?.id ?? TEST_IDS.UNIT_ID), {
		sectionId: SectionId.create(overrides?.sectionId ?? TEST_IDS.SECTION_ID),
		name: UnitName.create('Test Unit'),
		createdAt: DEFAULT_DATE,
		order: Order.create(overrides?.order ?? 0),
	});
}

export function makeLesson(overrides?: {
	id?: string;
	unitId?: string;
	order?: number;
}) {
	return Lesson.create(
		LessonId.create(overrides?.id ?? TEST_IDS.LESSON_ID),
		{
			unitId: UnitId.create(overrides?.unitId ?? TEST_IDS.UNIT_ID),
			name: LessonName.create('Test Lesson'),
			createdAt: DEFAULT_DATE,
			order: Order.create(overrides?.order ?? 0),
		},
	);
}

export function makeArticle(overrides?: {
	id?: string;
	lessonId?: string;
	order?: number;
}) {
	return Article.create(
		ActivityId.create(overrides?.id ?? TEST_IDS.ARTICLE_ID),
		{
			lessonId: LessonId.create(overrides?.lessonId ?? TEST_IDS.LESSON_ID),
			name: ActivityName.create('Test Article'),
			createdAt: DEFAULT_DATE,
			order: Order.create(overrides?.order ?? 0),
			ref: Url.create('https://example.com/article'),
		},
	);
}

export function makeExercise(overrides?: {
	id?: string;
	lessonId?: string;
	order?: number;
	difficulty?: ExerciseDifficulty;
}) {
	return Exercise.create(
		ActivityId.create(overrides?.id ?? TEST_IDS.EXERCISE_ID),
		{
			lessonId: LessonId.create(overrides?.lessonId ?? TEST_IDS.LESSON_ID),
			name: ActivityName.create('Test Exercise'),
			createdAt: DEFAULT_DATE,
			order: Order.create(overrides?.order ?? 0),
			difficulty: overrides?.difficulty ?? ExerciseDifficulty.EASY,
		},
	);
}

export function makeQuiz(overrides?: {
	id?: string;
	lessonId?: string;
	order?: number;
}) {
	return Quiz.create(ActivityId.create(overrides?.id ?? TEST_IDS.QUIZ_ID), {
		lessonId: LessonId.create(overrides?.lessonId ?? TEST_IDS.LESSON_ID),
		name: ActivityName.create('Test Quiz'),
		createdAt: DEFAULT_DATE,
		order: Order.create(overrides?.order ?? 0),
	});
}

export function makeQuestion(overrides?: {
	id?: string;
	quizId?: string;
	order?: number;
	content?: string;
	correctAnswer?: string;
}) {
	return Question.create(
		QuestionId.create(overrides?.id ?? TEST_IDS.QUESTION_ID),
		{
			quizId: ActivityId.create(overrides?.quizId ?? TEST_IDS.QUIZ_ID),
			content: overrides?.content ?? 'What is 1+1?',
			correctAnswer: overrides?.correctAnswer ?? '2',
			order: Order.create(overrides?.order ?? 0),
			createdAt: DEFAULT_DATE,
		},
	);
}
