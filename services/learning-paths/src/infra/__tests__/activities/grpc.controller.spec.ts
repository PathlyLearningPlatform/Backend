import { status as GrpcStatus } from '@grpc/grpc-js';
import { GrpcException } from '@pathly-backend/common';
import { GrpcActivitiesController } from '@/infra/activities/grpc.controller';
import {
	LessonNotFoundException,
	ActivityNotFoundException,
	QuestionNotFoundException,
} from '@/app/common';
import {
	mockHandler,
	type MockHandler,
	makeActivityDto,
	makeArticleDto,
	makeExerciseDto,
	makeQuizDto,
	makeQuizWithoutQuestionsDto,
	makeQuestionDto,
	TEST_IDS,
} from '../common';

describe('GrpcActivitiesController', () => {
	let controller: GrpcActivitiesController;
	let listActivitiesHandler: MockHandler;
	let listArticlesHandler: MockHandler;
	let listExercisesHandler: MockHandler;
	let listQuizzesHandler: MockHandler;
	let findActivityByIdHandler: MockHandler;
	let findArticleByIdHandler: MockHandler;
	let findExerciseByIdHandler: MockHandler;
	let findQuizByIdHandler: MockHandler;
	let addArticleHandler: MockHandler;
	let addExerciseHandler: MockHandler;
	let addQuizHandler: MockHandler;
	let updateArticleHandler: MockHandler;
	let updateExerciseHandler: MockHandler;
	let reorderActivityHandler: MockHandler;
	let removeActivityHandler: MockHandler;
	let addQuestionHandler: MockHandler;
	let updateQuestionHandler: MockHandler;
	let reorderQuestionHandler: MockHandler;
	let removeQuestionHandler: MockHandler;

	beforeEach(() => {
		listActivitiesHandler = mockHandler();
		listArticlesHandler = mockHandler();
		listExercisesHandler = mockHandler();
		listQuizzesHandler = mockHandler();
		findActivityByIdHandler = mockHandler();
		findArticleByIdHandler = mockHandler();
		findExerciseByIdHandler = mockHandler();
		findQuizByIdHandler = mockHandler();
		addArticleHandler = mockHandler();
		addExerciseHandler = mockHandler();
		addQuizHandler = mockHandler();
		updateArticleHandler = mockHandler();
		updateExerciseHandler = mockHandler();
		reorderActivityHandler = mockHandler();
		removeActivityHandler = mockHandler();
		addQuestionHandler = mockHandler();
		updateQuestionHandler = mockHandler();
		reorderQuestionHandler = mockHandler();
		removeQuestionHandler = mockHandler();

		controller = new GrpcActivitiesController(
			listActivitiesHandler as any,
			listArticlesHandler as any,
			listExercisesHandler as any,
			listQuizzesHandler as any,
			findActivityByIdHandler as any,
			findArticleByIdHandler as any,
			findExerciseByIdHandler as any,
			findQuizByIdHandler as any,
			addArticleHandler as any,
			addExerciseHandler as any,
			addQuizHandler as any,
			updateArticleHandler as any,
			updateExerciseHandler as any,
			reorderActivityHandler as any,
			removeActivityHandler as any,
			addQuestionHandler as any,
			updateQuestionHandler as any,
			reorderQuestionHandler as any,
			removeQuestionHandler as any,
		);
	});

	// ══════════════════════════════════════════════
	// List
	// ══════════════════════════════════════════════

	describe('list', () => {
		it('should return activities', async () => {
			const dto = makeActivityDto();
			listActivitiesHandler.execute.mockResolvedValue([dto]);

			const result = await controller.list({
				where: { lessonId: TEST_IDS.lesson },
				options: {},
			} as any);

			expect(result.activities).toHaveLength(1);
			expect(result.activities[0].id).toBe(dto.id);
		});

		it('should throw INTERNAL on unexpected error', async () => {
			listActivitiesHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.list({ where: {}, options: {} } as any),
			).rejects.toThrow(GrpcException);
		});
	});

	describe('listArticles', () => {
		it('should return articles', async () => {
			const dto = makeArticleDto();
			listArticlesHandler.execute.mockResolvedValue([dto]);

			const result = await controller.listArticles({
				where: { lessonId: TEST_IDS.lesson },
				options: {},
			} as any);

			expect(result.articles).toHaveLength(1);
			expect(result.articles[0].id).toBe(dto.id);
		});

		it('should throw INTERNAL on unexpected error', async () => {
			listArticlesHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.listArticles({ where: {}, options: {} } as any),
			).rejects.toThrow(GrpcException);
		});
	});

	describe('listExercises', () => {
		it('should return exercises', async () => {
			const dto = makeExerciseDto();
			listExercisesHandler.execute.mockResolvedValue([dto]);

			const result = await controller.listExercises({
				where: { lessonId: TEST_IDS.lesson },
				options: {},
			} as any);

			expect(result.exercises).toHaveLength(1);
			expect(result.exercises[0].id).toBe(dto.id);
		});

		it('should throw INTERNAL on unexpected error', async () => {
			listExercisesHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.listExercises({ where: {}, options: {} } as any),
			).rejects.toThrow(GrpcException);
		});
	});

	describe('listQuizzes', () => {
		it('should return quizzes', async () => {
			const dto = makeQuizWithoutQuestionsDto();
			listQuizzesHandler.execute.mockResolvedValue([dto]);

			const result = await controller.listQuizzes({
				where: { lessonId: TEST_IDS.lesson },
				options: {},
			} as any);

			expect(result.quizzes).toHaveLength(1);
			expect(result.quizzes[0].id).toBe(dto.id);
		});

		it('should throw INTERNAL on unexpected error', async () => {
			listQuizzesHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.listQuizzes({ where: {}, options: {} } as any),
			).rejects.toThrow(GrpcException);
		});
	});

	// ══════════════════════════════════════════════
	// Find by ID
	// ══════════════════════════════════════════════

	describe('findById', () => {
		it('should return an activity', async () => {
			const dto = makeActivityDto();
			findActivityByIdHandler.execute.mockResolvedValue(dto);

			const result = await controller.findById({
				where: { id: TEST_IDS.activity },
			} as any);

			expect(result.activity.id).toBe(dto.id);
		});

		it('should throw NOT_FOUND when ActivityNotFoundException', async () => {
			findActivityByIdHandler.execute.mockRejectedValue(
				new ActivityNotFoundException(TEST_IDS.activity),
			);

			try {
				await controller.findById({
					where: { id: TEST_IDS.activity },
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw INTERNAL on unexpected error', async () => {
			findActivityByIdHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.findById({ where: { id: TEST_IDS.activity } } as any),
			).rejects.toThrow(GrpcException);
		});
	});

	describe('findArticleById', () => {
		it('should return an article', async () => {
			const dto = makeArticleDto();
			findArticleByIdHandler.execute.mockResolvedValue(dto);

			const result = await controller.findArticleById({
				where: { id: TEST_IDS.article },
			} as any);

			expect(result.article.id).toBe(dto.id);
		});

		it('should throw NOT_FOUND when ActivityNotFoundException', async () => {
			findArticleByIdHandler.execute.mockRejectedValue(
				new ActivityNotFoundException(TEST_IDS.article),
			);

			try {
				await controller.findArticleById({
					where: { id: TEST_IDS.article },
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw INTERNAL on unexpected error', async () => {
			findArticleByIdHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.findArticleById({
					where: { id: TEST_IDS.article },
				} as any),
			).rejects.toThrow(GrpcException);
		});
	});

	describe('findExerciseById', () => {
		it('should return an exercise', async () => {
			const dto = makeExerciseDto();
			findExerciseByIdHandler.execute.mockResolvedValue(dto);

			const result = await controller.findExerciseById({
				where: { id: TEST_IDS.exercise },
			} as any);

			expect(result.exercise.id).toBe(dto.id);
		});

		it('should throw NOT_FOUND when ActivityNotFoundException', async () => {
			findExerciseByIdHandler.execute.mockRejectedValue(
				new ActivityNotFoundException(TEST_IDS.exercise),
			);

			try {
				await controller.findExerciseById({
					where: { id: TEST_IDS.exercise },
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw INTERNAL on unexpected error', async () => {
			findExerciseByIdHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.findExerciseById({
					where: { id: TEST_IDS.exercise },
				} as any),
			).rejects.toThrow(GrpcException);
		});
	});

	describe('findQuizById', () => {
		it('should return a quiz', async () => {
			const dto = makeQuizDto();
			findQuizByIdHandler.execute.mockResolvedValue(dto);

			const result = await controller.findQuizById({
				where: { id: TEST_IDS.quiz },
			} as any);

			expect(result.quiz.id).toBe(dto.id);
		});

		it('should throw NOT_FOUND when ActivityNotFoundException', async () => {
			findQuizByIdHandler.execute.mockRejectedValue(
				new ActivityNotFoundException(TEST_IDS.quiz),
			);

			try {
				await controller.findQuizById({
					where: { id: TEST_IDS.quiz },
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw INTERNAL on unexpected error', async () => {
			findQuizByIdHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.findQuizById({ where: { id: TEST_IDS.quiz } } as any),
			).rejects.toThrow(GrpcException);
		});
	});

	// ══════════════════════════════════════════════
	// Create
	// ══════════════════════════════════════════════

	describe('createArticle', () => {
		it('should return created article', async () => {
			const dto = makeArticleDto();
			addArticleHandler.execute.mockResolvedValue(dto);

			const result = await controller.createArticle({
				lessonId: TEST_IDS.lesson,
				name: 'Art',
				ref: 'https://example.com',
			} as any);

			expect(result.article.id).toBe(dto.id);
		});

		it('should throw NOT_FOUND when LessonNotFoundException', async () => {
			addArticleHandler.execute.mockRejectedValue(
				new LessonNotFoundException(TEST_IDS.lesson),
			);

			try {
				await controller.createArticle({
					lessonId: TEST_IDS.lesson,
					name: 'x',
					ref: 'r',
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw INTERNAL on unexpected error', async () => {
			addArticleHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.createArticle({
					lessonId: TEST_IDS.lesson,
					name: 'x',
					ref: 'r',
				} as any),
			).rejects.toThrow(GrpcException);
		});
	});

	describe('createExercise', () => {
		it('should return created exercise', async () => {
			const dto = makeExerciseDto();
			addExerciseHandler.execute.mockResolvedValue(dto);

			const result = await controller.createExercise({
				lessonId: TEST_IDS.lesson,
				name: 'Ex',
				difficulty: 'EASY',
			} as any);

			expect(result.exercise.id).toBe(dto.id);
		});

		it('should throw NOT_FOUND when LessonNotFoundException', async () => {
			addExerciseHandler.execute.mockRejectedValue(
				new LessonNotFoundException(TEST_IDS.lesson),
			);

			try {
				await controller.createExercise({
					lessonId: TEST_IDS.lesson,
					name: 'x',
					difficulty: 'EASY',
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw INTERNAL on unexpected error', async () => {
			addExerciseHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.createExercise({
					lessonId: TEST_IDS.lesson,
					name: 'x',
					difficulty: 'EASY',
				} as any),
			).rejects.toThrow(GrpcException);
		});
	});

	describe('createQuiz', () => {
		it('should return created quiz', async () => {
			const dto = makeQuizWithoutQuestionsDto();
			addQuizHandler.execute.mockResolvedValue(dto);

			const result = await controller.createQuiz({
				lessonId: TEST_IDS.lesson,
				name: 'Quiz',
			} as any);

			expect(result.quiz.id).toBe(dto.id);
		});

		it('should throw NOT_FOUND when LessonNotFoundException', async () => {
			addQuizHandler.execute.mockRejectedValue(
				new LessonNotFoundException(TEST_IDS.lesson),
			);

			try {
				await controller.createQuiz({
					lessonId: TEST_IDS.lesson,
					name: 'x',
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw INTERNAL on unexpected error', async () => {
			addQuizHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.createQuiz({
					lessonId: TEST_IDS.lesson,
					name: 'x',
				} as any),
			).rejects.toThrow(GrpcException);
		});
	});

	// ══════════════════════════════════════════════
	// Update
	// ══════════════════════════════════════════════

	describe('updateArticle', () => {
		it('should return updated article', async () => {
			const dto = makeArticleDto({ name: 'Updated' });
			updateArticleHandler.execute.mockResolvedValue(dto);

			const result = await controller.updateArticle({
				where: { activityId: TEST_IDS.article },
				fields: { name: 'Updated' },
			} as any);

			expect(result.article.name).toBe('Updated');
		});

		it('should throw NOT_FOUND when ActivityNotFoundException', async () => {
			updateArticleHandler.execute.mockRejectedValue(
				new ActivityNotFoundException(TEST_IDS.article),
			);

			try {
				await controller.updateArticle({
					where: { activityId: TEST_IDS.article },
					fields: { name: 'x' },
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw INTERNAL on unexpected error', async () => {
			updateArticleHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.updateArticle({
					where: { activityId: TEST_IDS.article },
					fields: {},
				} as any),
			).rejects.toThrow(GrpcException);
		});
	});

	describe('updateExercise', () => {
		it('should return updated exercise', async () => {
			const dto = makeExerciseDto({ name: 'Updated' });
			updateExerciseHandler.execute.mockResolvedValue(dto);

			const result = await controller.updateExercise({
				where: { activityId: TEST_IDS.exercise },
				fields: { name: 'Updated' },
			} as any);

			expect(result.exercise.name).toBe('Updated');
		});

		it('should throw NOT_FOUND when ActivityNotFoundException', async () => {
			updateExerciseHandler.execute.mockRejectedValue(
				new ActivityNotFoundException(TEST_IDS.exercise),
			);

			try {
				await controller.updateExercise({
					where: { activityId: TEST_IDS.exercise },
					fields: { name: 'x' },
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw INTERNAL on unexpected error', async () => {
			updateExerciseHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.updateExercise({
					where: { activityId: TEST_IDS.exercise },
					fields: {},
				} as any),
			).rejects.toThrow(GrpcException);
		});
	});

	describe('updateQuiz', () => {
		it('should throw UNIMPLEMENTED', async () => {
			try {
				await controller.updateQuiz({
					where: { activityId: TEST_IDS.quiz },
					fields: { name: 'x' },
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.UNIMPLEMENTED,
				});
			}
		});
	});

	// ══════════════════════════════════════════════
	// Reorder / Remove
	// ══════════════════════════════════════════════

	describe('reorder', () => {
		it('should call reorderActivityHandler', async () => {
			reorderActivityHandler.execute.mockResolvedValue(undefined);

			await controller.reorder({
				activityId: TEST_IDS.activity,
				order: 2,
			} as any);

			expect(reorderActivityHandler.execute).toHaveBeenCalledWith({
				activityId: TEST_IDS.activity,
				order: 2,
			});
		});

		it('should throw NOT_FOUND when ActivityNotFoundException', async () => {
			reorderActivityHandler.execute.mockRejectedValue(
				new ActivityNotFoundException(TEST_IDS.activity),
			);

			try {
				await controller.reorder({
					activityId: TEST_IDS.activity,
					order: 2,
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw INTERNAL on unexpected error', async () => {
			reorderActivityHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.reorder({
					activityId: TEST_IDS.activity,
					order: 2,
				} as any),
			).rejects.toThrow(GrpcException);
		});
	});

	describe('remove', () => {
		it('should call removeActivityHandler', async () => {
			removeActivityHandler.execute.mockResolvedValue(undefined);

			await controller.remove({
				where: { id: TEST_IDS.activity },
			} as any);

			expect(removeActivityHandler.execute).toHaveBeenCalledWith({
				activityId: TEST_IDS.activity,
			});
		});

		it('should throw NOT_FOUND when ActivityNotFoundException', async () => {
			removeActivityHandler.execute.mockRejectedValue(
				new ActivityNotFoundException(TEST_IDS.activity),
			);

			try {
				await controller.remove({
					where: { id: TEST_IDS.activity },
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw INTERNAL on unexpected error', async () => {
			removeActivityHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.remove({ where: { id: TEST_IDS.activity } } as any),
			).rejects.toThrow(GrpcException);
		});
	});

	// ══════════════════════════════════════════════
	// Questions
	// ══════════════════════════════════════════════

	describe('findQuestionById', () => {
		it('should return a question', async () => {
			const questionDto = makeQuestionDto();
			const quizDto = makeQuizDto({ questions: [questionDto] });
			findQuizByIdHandler.execute.mockResolvedValue(quizDto);

			const result = await controller.findQuestionById({
				where: { quizId: TEST_IDS.quiz, id: TEST_IDS.question },
			} as any);

			expect(result.question.id).toBe(questionDto.id);
		});

		it('should throw NOT_FOUND when question not in quiz', async () => {
			const quizDto = makeQuizDto({ questions: [] });
			findQuizByIdHandler.execute.mockResolvedValue(quizDto);

			try {
				await controller.findQuestionById({
					where: { quizId: TEST_IDS.quiz, id: TEST_IDS.question },
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw NOT_FOUND when ActivityNotFoundException', async () => {
			findQuizByIdHandler.execute.mockRejectedValue(
				new ActivityNotFoundException(TEST_IDS.quiz),
			);

			try {
				await controller.findQuestionById({
					where: { quizId: TEST_IDS.quiz, id: TEST_IDS.question },
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw INTERNAL on unexpected error', async () => {
			findQuizByIdHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.findQuestionById({
					where: { quizId: TEST_IDS.quiz, id: TEST_IDS.question },
				} as any),
			).rejects.toThrow(GrpcException);
		});
	});

	describe('createQuestion', () => {
		it('should return created question', async () => {
			const dto = makeQuestionDto();
			addQuestionHandler.execute.mockResolvedValue(dto);

			const result = await controller.createQuestion({
				quizId: TEST_IDS.quiz,
				content: 'Q?',
				correctAnswer: 'A',
			} as any);

			expect(result.question.id).toBe(dto.id);
		});

		it('should throw NOT_FOUND when ActivityNotFoundException', async () => {
			addQuestionHandler.execute.mockRejectedValue(
				new ActivityNotFoundException(TEST_IDS.quiz),
			);

			try {
				await controller.createQuestion({
					quizId: TEST_IDS.quiz,
					content: 'Q?',
					correctAnswer: 'A',
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw INTERNAL on unexpected error', async () => {
			addQuestionHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.createQuestion({
					quizId: TEST_IDS.quiz,
					content: 'Q?',
					correctAnswer: 'A',
				} as any),
			).rejects.toThrow(GrpcException);
		});
	});

	describe('updateQuestion', () => {
		it('should return updated question', async () => {
			const dto = makeQuestionDto({ content: 'Updated?' });
			updateQuestionHandler.execute.mockResolvedValue(dto);

			const result = await controller.updateQuestion({
				where: { quizId: TEST_IDS.quiz, id: TEST_IDS.question },
				fields: { content: 'Updated?' },
			} as any);

			expect(result.question.content).toBe('Updated?');
		});

		it('should throw NOT_FOUND when QuestionNotFoundException', async () => {
			updateQuestionHandler.execute.mockRejectedValue(
				new QuestionNotFoundException(TEST_IDS.question),
			);

			try {
				await controller.updateQuestion({
					where: { quizId: TEST_IDS.quiz, id: TEST_IDS.question },
					fields: { content: 'x' },
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw NOT_FOUND when ActivityNotFoundException', async () => {
			updateQuestionHandler.execute.mockRejectedValue(
				new ActivityNotFoundException(TEST_IDS.quiz),
			);

			try {
				await controller.updateQuestion({
					where: { quizId: TEST_IDS.quiz, id: TEST_IDS.question },
					fields: { content: 'x' },
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw INTERNAL on unexpected error', async () => {
			updateQuestionHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.updateQuestion({
					where: { quizId: TEST_IDS.quiz, id: TEST_IDS.question },
					fields: {},
				} as any),
			).rejects.toThrow(GrpcException);
		});
	});

	describe('reorderQuestion', () => {
		it('should call reorderQuestionHandler', async () => {
			reorderQuestionHandler.execute.mockResolvedValue(undefined);

			await controller.reorderQuestion({
				quizId: TEST_IDS.quiz,
				questionId: TEST_IDS.question,
				order: 1,
			} as any);

			expect(reorderQuestionHandler.execute).toHaveBeenCalledWith({
				quizId: TEST_IDS.quiz,
				questionId: TEST_IDS.question,
				order: 1,
			});
		});

		it('should throw NOT_FOUND when QuestionNotFoundException', async () => {
			reorderQuestionHandler.execute.mockRejectedValue(
				new QuestionNotFoundException(TEST_IDS.question),
			);

			try {
				await controller.reorderQuestion({
					quizId: TEST_IDS.quiz,
					questionId: TEST_IDS.question,
					order: 1,
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw NOT_FOUND when ActivityNotFoundException', async () => {
			reorderQuestionHandler.execute.mockRejectedValue(
				new ActivityNotFoundException(TEST_IDS.quiz),
			);

			try {
				await controller.reorderQuestion({
					quizId: TEST_IDS.quiz,
					questionId: TEST_IDS.question,
					order: 1,
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw INTERNAL on unexpected error', async () => {
			reorderQuestionHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.reorderQuestion({
					quizId: TEST_IDS.quiz,
					questionId: TEST_IDS.question,
					order: 1,
				} as any),
			).rejects.toThrow(GrpcException);
		});
	});

	describe('removeQuestion', () => {
		it('should call removeQuestionHandler', async () => {
			removeQuestionHandler.execute.mockResolvedValue(undefined);

			await controller.removeQuestion({
				where: { quizId: TEST_IDS.quiz, id: TEST_IDS.question },
			} as any);

			expect(removeQuestionHandler.execute).toHaveBeenCalledWith({
				quizId: TEST_IDS.quiz,
				questionId: TEST_IDS.question,
			});
		});

		it('should throw NOT_FOUND when QuestionNotFoundException', async () => {
			removeQuestionHandler.execute.mockRejectedValue(
				new QuestionNotFoundException(TEST_IDS.question),
			);

			try {
				await controller.removeQuestion({
					where: { quizId: TEST_IDS.quiz, id: TEST_IDS.question },
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw NOT_FOUND when ActivityNotFoundException', async () => {
			removeQuestionHandler.execute.mockRejectedValue(
				new ActivityNotFoundException(TEST_IDS.quiz),
			);

			try {
				await controller.removeQuestion({
					where: { quizId: TEST_IDS.quiz, id: TEST_IDS.question },
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw INTERNAL on unexpected error', async () => {
			removeQuestionHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.removeQuestion({
					where: { quizId: TEST_IDS.quiz, id: TEST_IDS.question },
				} as any),
			).rejects.toThrow(GrpcException);
		});
	});
});
