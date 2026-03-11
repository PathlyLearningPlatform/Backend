import { Quiz } from '../../activities/quizzes/quiz.aggregate';
import { Question } from '../../activities/quizzes/question.entity';
import { QuestionId } from '../../activities/quizzes/value-objects';
import { ActivityId } from '../../activities/value-objects/id.vo';
import { ActivityName } from '../../activities/value-objects/name.vo';
import { ActivityDescription } from '../../activities/value-objects/description.vo';
import { ActivityType } from '../../activities/value-objects/type.vo';
import { LessonId } from '../../lessons/value-objects/id.vo';
import { UUID } from '../../common/value-objects/uuid.vo';
import { Order } from '../../common/value-objects/order.vo';
import { QuestionAlreadyExistsException } from '../../activities/quizzes/exceptions';

const makeUuid = (value: string) => new UUID({ value });

const makeActivityId = (value = '123e4567-e89b-42d3-a456-426614174000') =>
	new ActivityId({ value: makeUuid(value) });

const makeLessonId = (value = '223e4567-e89b-42d3-a456-426614174000') =>
	new LessonId({ value: makeUuid(value) });

const makeQuestionId = (value = '323e4567-e89b-42d3-a456-426614174000') =>
	new QuestionId({ value: makeUuid(value) });

const makeQuestion = (idValue: string, order: number, quizId: ActivityId) =>
	Question.create(makeQuestionId(idValue), {
		quizId,
		content: `Question ${idValue}`,
		correctAnswer: `Answer ${idValue}`,
		order: Order.create(order),
		createdAt: new Date('2026-03-10T12:00:00.000Z'),
	});

const getQuestions = (quiz: Quiz): Question[] =>
	(quiz as unknown as { _props: { questions: Question[] } })._props.questions;

describe('Quiz aggregate', () => {
	describe('create', () => {
		it('creates a quiz with all props', () => {
			const createdAt = new Date('2026-03-10T12:00:00.000Z');
			const id = makeActivityId();
			const lessonId = makeLessonId();

			const quiz = Quiz.create(id, {
				lessonId,
				name: ActivityName.create('My Quiz'),
				description: ActivityDescription.create('A description'),
				createdAt,
				order: Order.create(0),
			});

			expect(quiz.id).toBe(id);
			expect(quiz.lessonId).toBe(lessonId);
			expect(quiz.name.value).toBe('My Quiz');
			expect(quiz.description?.value).toBe('A description');
			expect(quiz.createdAt).toBe(createdAt);
			expect(quiz.updatedAt).toBeNull();
			expect(quiz.order.value).toBe(0);
			expect(quiz.type).toBe(ActivityType.QUIZ);
			expect(quiz.questionCount).toBe(0);
			expect(getQuestions(quiz)).toHaveLength(0);
		});

		it('sets description to null when not provided', () => {
			const quiz = Quiz.create(makeActivityId(), {
				lessonId: makeLessonId(),
				name: ActivityName.create('Quiz'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});

			expect(quiz.description).toBeNull();
		});
	});

	describe('fromDataSource', () => {
		it('reconstructs a quiz from raw data with pre-built questions', () => {
			const quizId = makeActivityId();
			const lessonId = makeLessonId();
			const createdAt = new Date('2026-03-10T12:00:00.000Z');
			const updatedAt = new Date('2026-03-10T13:00:00.000Z');
			const questions = [
				makeQuestion('323e4567-e89b-42d3-a456-426614174000', 0, quizId),
				makeQuestion('423e4567-e89b-42d3-a456-426614174000', 1, quizId),
			];

			const quiz = Quiz.fromDataSource({
				id: quizId.value,
				lessonId: lessonId.value,
				name: 'My Quiz',
				description: 'A description',
				createdAt,
				updatedAt,
				order: 1,
				questions,
				questionCount: 2,
			});

			expect(quiz.id.value).toBe(quizId.value);
			expect(quiz.lessonId.value).toBe(lessonId.value);
			expect(quiz.name.value).toBe('My Quiz');
			expect(quiz.description?.value).toBe('A description');
			expect(quiz.createdAt).toBe(createdAt);
			expect(quiz.updatedAt).toBe(updatedAt);
			expect(quiz.order.value).toBe(1);
			expect(quiz.type).toBe(ActivityType.QUIZ);
			expect(quiz.questionCount).toBe(2);
			expect(getQuestions(quiz)).toHaveLength(2);
		});

		it('sets description to null when null is provided', () => {
			const quiz = Quiz.fromDataSource({
				id: makeActivityId().value,
				lessonId: makeLessonId().value,
				name: 'Quiz',
				description: null,
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				updatedAt: null,
				order: 0,
				questions: [],
				questionCount: 0,
			});

			expect(quiz.description).toBeNull();
		});
	});

	describe('update', () => {
		it('updates name, description and sets updatedAt', () => {
			const now = new Date('2026-03-10T12:05:00.000Z');
			const quiz = Quiz.create(makeActivityId(), {
				lessonId: makeLessonId(),
				name: ActivityName.create('Old Name'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});

			quiz.update(now, {
				name: ActivityName.create('New Name'),
				description: ActivityDescription.create('New Desc'),
			});

			expect(quiz.name.value).toBe('New Name');
			expect(quiz.description?.value).toBe('New Desc');
			expect(quiz.updatedAt).toBe(now);
		});

		it('sets updatedAt even when no props provided', () => {
			const quiz = Quiz.create(makeActivityId(), {
				lessonId: makeLessonId(),
				name: ActivityName.create('Quiz'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const now = new Date('2026-03-10T12:05:00.000Z');

			quiz.update(now);

			expect(quiz.updatedAt).toBe(now);
		});
	});

	describe('addQuestion', () => {
		it('adds a question and increments questionCount', () => {
			const quizId = makeActivityId();
			const quiz = Quiz.create(quizId, {
				lessonId: makeLessonId(),
				name: ActivityName.create('Quiz'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const question = makeQuestion('323e4567-e89b-42d3-a456-426614174000', 0, quizId);

			quiz.addQuestion(question);

			expect(quiz.questionCount).toBe(1);
			expect(getQuestions(quiz)).toHaveLength(1);
			expect(getQuestions(quiz)[0]).toBe(question);
		});

		it('throws QuestionAlreadyExistsException when adding a duplicate question', () => {
			const quizId = makeActivityId();
			const quiz = Quiz.create(quizId, {
				lessonId: makeLessonId(),
				name: ActivityName.create('Quiz'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const question = makeQuestion('323e4567-e89b-42d3-a456-426614174000', 0, quizId);
			quiz.addQuestion(question);

			const duplicate = makeQuestion('323e4567-e89b-42d3-a456-426614174000', 1, quizId);
			expect(() => quiz.addQuestion(duplicate)).toThrow(QuestionAlreadyExistsException);
		});
	});

	describe('removeQuestion', () => {
		it('does nothing when the question is not found', () => {
			const quizId = makeActivityId();
			const quiz = Quiz.create(quizId, {
				lessonId: makeLessonId(),
				name: ActivityName.create('Quiz'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			quiz.addQuestion(makeQuestion('323e4567-e89b-42d3-a456-426614174000', 0, quizId));

			quiz.removeQuestion(makeQuestionId('999e4567-e89b-42d3-a456-426614174000'));

			expect(quiz.questionCount).toBe(1);
		});

		it('removes a question and rearranges remaining questions', () => {
			const quizId = makeActivityId();
			const quiz = Quiz.create(quizId, {
				lessonId: makeLessonId(),
				name: ActivityName.create('Quiz'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const q1 = makeQuestion('323e4567-e89b-42d3-a456-426614174000', 0, quizId);
			const q2 = makeQuestion('423e4567-e89b-42d3-a456-426614174000', 1, quizId);
			const q3 = makeQuestion('523e4567-e89b-42d3-a456-426614174000', 2, quizId);
			quiz.addQuestion(q1);
			quiz.addQuestion(q2);
			quiz.addQuestion(q3);

			quiz.removeQuestion(makeQuestionId('423e4567-e89b-42d3-a456-426614174000'));

			expect(quiz.questionCount).toBe(2);
			const questions = getQuestions(quiz);
			expect(questions).toHaveLength(2);
			expect(questions[0].order.value).toBe(0);
			expect(questions[1].order.value).toBe(1);
		});
	});

	describe('reorderQuestion', () => {
		it('returns null when the question is not found', () => {
			const quizId = makeActivityId();
			const quiz = Quiz.create(quizId, {
				lessonId: makeLessonId(),
				name: ActivityName.create('Quiz'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});

			const result = quiz.reorderQuestion(
				makeQuestionId('999e4567-e89b-42d3-a456-426614174000'),
				Order.create(0),
			);

			expect(result).toBeNull();
		});

		it('reorders a question and rearranges all questions', () => {
			const quizId = makeActivityId();
			const quiz = Quiz.create(quizId, {
				lessonId: makeLessonId(),
				name: ActivityName.create('Quiz'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const q1 = makeQuestion('323e4567-e89b-42d3-a456-426614174000', 0, quizId);
			const q2 = makeQuestion('423e4567-e89b-42d3-a456-426614174000', 1, quizId);
			const q3 = makeQuestion('523e4567-e89b-42d3-a456-426614174000', 2, quizId);
			quiz.addQuestion(q1);
			quiz.addQuestion(q2);
			quiz.addQuestion(q3);

			quiz.reorderQuestion(
				makeQuestionId('523e4567-e89b-42d3-a456-426614174000'),
				Order.create(0),
			);

			const questions = getQuestions(quiz);
			expect(questions[0].id.equals(makeQuestionId('523e4567-e89b-42d3-a456-426614174000'))).toBe(true);
			expect(questions[0].order.value).toBe(0);
			expect(questions[1].order.value).toBe(1);
			expect(questions[2].order.value).toBe(2);
		});

		it('clamps newOrder to the last index when exceeding length', () => {
			const quizId = makeActivityId();
			const quiz = Quiz.create(quizId, {
				lessonId: makeLessonId(),
				name: ActivityName.create('Quiz'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const q1 = makeQuestion('323e4567-e89b-42d3-a456-426614174000', 0, quizId);
			const q2 = makeQuestion('423e4567-e89b-42d3-a456-426614174000', 1, quizId);
			quiz.addQuestion(q1);
			quiz.addQuestion(q2);

			quiz.reorderQuestion(
				makeQuestionId('323e4567-e89b-42d3-a456-426614174000'),
				Order.create(99),
			);

			const questions = getQuestions(quiz);
			expect(questions[1].id.equals(makeQuestionId('323e4567-e89b-42d3-a456-426614174000'))).toBe(true);
			expect(questions[0].order.value).toBe(0);
			expect(questions[1].order.value).toBe(1);
		});
	});

	describe('findQuestion', () => {
		it('returns the question when found by id', () => {
			const quizId = makeActivityId();
			const quiz = Quiz.create(quizId, {
				lessonId: makeLessonId(),
				name: ActivityName.create('Quiz'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			const question = makeQuestion('323e4567-e89b-42d3-a456-426614174000', 0, quizId);
			quiz.addQuestion(question);

			const found = quiz.findQuestion(makeQuestionId('323e4567-e89b-42d3-a456-426614174000'));

			expect(found).toBe(question);
		});

		it('returns null when the question is not found', () => {
			const quizId = makeActivityId();
			const quiz = Quiz.create(quizId, {
				lessonId: makeLessonId(),
				name: ActivityName.create('Quiz'),
				createdAt: new Date('2026-03-10T12:00:00.000Z'),
				order: Order.create(0),
			});
			quiz.addQuestion(makeQuestion('323e4567-e89b-42d3-a456-426614174000', 0, quizId));

			const found = quiz.findQuestion(makeQuestionId('999e4567-e89b-42d3-a456-426614174000'));

			expect(found).toBeNull();
		});
	});
});
