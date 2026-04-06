import { Test } from "@nestjs/testing";
import { RepositoryException } from "@pathly-backend/common/index.js";
import { Article } from "@/domain/activities/articles/article.aggregate";
import { Exercise } from "@/domain/activities/exercises/exercise.aggregate";
import { ExerciseDifficulty } from "@/domain/activities/exercises/value-objects";
import { Question } from "@/domain/activities/quizzes/question.entity";
import { Quiz } from "@/domain/activities/quizzes/quiz.aggregate";
import { ActivityId, ActivityType } from "@/domain/activities/value-objects";
import { PostgresActivityRepository } from "@/infra/activities/postgres.repository";
import { DEFAULT_DATE } from "../common";
import { mockedDbService, mockedDrizzle, resetDrizzleMocks } from "../mocks";

const ACTIVITY_ID = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d";
const ARTICLE_ID = "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e";
const EXERCISE_ID = "a7b8c9d0-e1f2-4a3b-ac4d-5e6f7a8b9c03";
const QUIZ_ID = "b8c9d0e1-f2a3-4b4c-8d5e-6f7a8b9c0d14";
const QUESTION_ID = "c9d0e1f2-a3b4-4c5d-9e6f-7a8b9c0d1e25";
const LESSON_ID = "f6a7b8c9-d0e1-4f2a-9b3c-4d5e6f7a8b92";

describe("PostgresActivityRepository", () => {
	let repository: PostgresActivityRepository;

	beforeEach(async () => {
		resetDrizzleMocks();

		const module = await Test.createTestingModule({
			providers: [PostgresActivityRepository, mockedDbService],
		}).compile();

		repository = module.get(PostgresActivityRepository);
	});

	describe("load", () => {
		const id = ActivityId.create(ACTIVITY_ID);

		describe("article", () => {
			it("should return an article when found", async () => {
				const dbActivity = {
					id: ARTICLE_ID,
					lessonId: LESSON_ID,
					name: "Test Article",
					description: null,
					createdAt: DEFAULT_DATE,
					updatedAt: null,
					order: 0,
					type: ActivityType.ARTICLE,
				};
				const dbArticle = {
					activityId: ARTICLE_ID,
					ref: "https://example.com",
				};

				mockedDrizzle.where
					.mockResolvedValueOnce([dbActivity])
					.mockResolvedValueOnce([dbArticle]);

				const result = await repository.load(ActivityId.create(ARTICLE_ID));

				expect(mockedDrizzle.transaction).toHaveBeenCalled();
				expect(result).toBeInstanceOf(Article);
				expect(result!.id.value).toBe(ARTICLE_ID);
			});

			it("should return null when article detail not found", async () => {
				const dbActivity = {
					id: ARTICLE_ID,
					lessonId: LESSON_ID,
					name: "Test Article",
					description: null,
					createdAt: DEFAULT_DATE,
					updatedAt: null,
					order: 0,
					type: ActivityType.ARTICLE,
				};

				mockedDrizzle.where
					.mockResolvedValueOnce([dbActivity])
					.mockResolvedValueOnce([]);

				const result = await repository.load(ActivityId.create(ARTICLE_ID));

				expect(result).toBeNull();
			});
		});

		describe("exercise", () => {
			it("should return an exercise when found", async () => {
				const dbActivity = {
					id: EXERCISE_ID,
					lessonId: LESSON_ID,
					name: "Test Exercise",
					description: null,
					createdAt: DEFAULT_DATE,
					updatedAt: null,
					order: 0,
					type: ActivityType.EXERCISE,
				};
				const dbExercise = {
					activityId: EXERCISE_ID,
					difficulty: ExerciseDifficulty.EASY,
				};

				mockedDrizzle.where
					.mockResolvedValueOnce([dbActivity])
					.mockResolvedValueOnce([dbExercise]);

				const result = await repository.load(ActivityId.create(EXERCISE_ID));

				expect(result).toBeInstanceOf(Exercise);
				expect(result!.id.value).toBe(EXERCISE_ID);
			});

			it("should return null when exercise detail not found", async () => {
				const dbActivity = {
					id: EXERCISE_ID,
					lessonId: LESSON_ID,
					name: "Test Exercise",
					description: null,
					createdAt: DEFAULT_DATE,
					updatedAt: null,
					order: 0,
					type: ActivityType.EXERCISE,
				};

				mockedDrizzle.where
					.mockResolvedValueOnce([dbActivity])
					.mockResolvedValueOnce([]);

				const result = await repository.load(ActivityId.create(EXERCISE_ID));

				expect(result).toBeNull();
			});
		});

		describe("quiz", () => {
			it("should return a quiz when found", async () => {
				const dbActivity = {
					id: QUIZ_ID,
					lessonId: LESSON_ID,
					name: "Test Quiz",
					description: null,
					createdAt: DEFAULT_DATE,
					updatedAt: null,
					order: 0,
					type: ActivityType.QUIZ,
				};
				const dbQuiz = { activityId: QUIZ_ID };
				const dbQuestions = [
					{
						id: QUESTION_ID,
						quizId: QUIZ_ID,
						content: "What is 1+1?",
						correctAnswer: "2",
						order: 0,
						createdAt: DEFAULT_DATE,
						updatedAt: null,
					},
				];

				mockedDrizzle.where
					.mockResolvedValueOnce([dbActivity])
					.mockResolvedValueOnce([dbQuiz])
					.mockResolvedValueOnce(dbQuestions);

				const result = await repository.load(ActivityId.create(QUIZ_ID));

				expect(result).toBeInstanceOf(Quiz);
				expect(result!.id.value).toBe(QUIZ_ID);
			});

			it("should return null when quiz detail not found", async () => {
				const dbActivity = {
					id: QUIZ_ID,
					lessonId: LESSON_ID,
					name: "Test Quiz",
					description: null,
					createdAt: DEFAULT_DATE,
					updatedAt: null,
					order: 0,
					type: ActivityType.QUIZ,
				};

				mockedDrizzle.where
					.mockResolvedValueOnce([dbActivity])
					.mockResolvedValueOnce([]);

				const result = await repository.load(ActivityId.create(QUIZ_ID));

				expect(result).toBeNull();
			});
		});

		it("should return null when activity not found", async () => {
			mockedDrizzle.where.mockResolvedValueOnce([]);

			const result = await repository.load(id);

			expect(result).toBeNull();
		});

		it("should throw RepositoryException on error", async () => {
			mockedDrizzle.transaction.mockRejectedValueOnce(new Error("db error"));

			await expect(repository.load(id)).rejects.toThrow(RepositoryException);
		});
	});

	describe("save", () => {
		describe("article", () => {
			it("should upsert activity and article rows", async () => {
				mockedDrizzle.onConflictDoUpdate
					.mockResolvedValueOnce(undefined)
					.mockResolvedValueOnce(undefined);

				const article = Article.fromDataSource({
					id: ARTICLE_ID,
					lessonId: LESSON_ID,
					name: "Test Article",
					description: null,
					createdAt: DEFAULT_DATE,
					updatedAt: null,
					order: 0,
					ref: "https://example.com",
				});

				await repository.save(article);

				expect(mockedDrizzle.transaction).toHaveBeenCalled();
				expect(mockedDrizzle.insert).toHaveBeenCalledTimes(2);
				expect(mockedDrizzle.values).toHaveBeenCalledTimes(2);
				expect(mockedDrizzle.onConflictDoUpdate).toHaveBeenCalledTimes(2);
			});
		});

		describe("exercise", () => {
			it("should upsert activity and exercise rows", async () => {
				mockedDrizzle.onConflictDoUpdate
					.mockResolvedValueOnce(undefined)
					.mockResolvedValueOnce(undefined);

				const exercise = Exercise.fromDataSource({
					id: EXERCISE_ID,
					lessonId: LESSON_ID,
					name: "Test Exercise",
					description: null,
					createdAt: DEFAULT_DATE,
					updatedAt: null,
					order: 0,
					difficulty: ExerciseDifficulty.EASY,
				});

				await repository.save(exercise);

				expect(mockedDrizzle.transaction).toHaveBeenCalled();
				expect(mockedDrizzle.insert).toHaveBeenCalledTimes(2);
				expect(mockedDrizzle.values).toHaveBeenCalledTimes(2);
				expect(mockedDrizzle.onConflictDoUpdate).toHaveBeenCalledTimes(2);
			});
		});

		describe("quiz", () => {
			it("should upsert activity, quiz, and question rows", async () => {
				mockedDrizzle.onConflictDoUpdate
					.mockResolvedValueOnce(undefined)
					.mockResolvedValueOnce(undefined);
				mockedDrizzle.onConflictDoNothing.mockResolvedValueOnce(undefined);
				// select existing questions for cleanup
				mockedDrizzle.where.mockResolvedValueOnce([{ id: QUESTION_ID }]);

				const question = Question.fromDataSource({
					id: QUESTION_ID,
					quizId: QUIZ_ID,
					content: "What is 1+1?",
					correctAnswer: "2",
					order: 0,
					createdAt: DEFAULT_DATE,
					updatedAt: null,
				});

				const quiz = Quiz.fromDataSource({
					id: QUIZ_ID,
					lessonId: LESSON_ID,
					name: "Test Quiz",
					description: null,
					createdAt: DEFAULT_DATE,
					updatedAt: null,
					order: 0,
					questions: [question],
					questionCount: 1,
				});

				await repository.save(quiz);

				expect(mockedDrizzle.transaction).toHaveBeenCalled();
				expect(mockedDrizzle.insert).toHaveBeenCalledTimes(3);
				expect(mockedDrizzle.onConflictDoUpdate).toHaveBeenCalledTimes(2);
				expect(mockedDrizzle.onConflictDoNothing).toHaveBeenCalledTimes(1);
			});

			it("should delete all questions when quiz has none", async () => {
				mockedDrizzle.onConflictDoUpdate
					.mockResolvedValueOnce(undefined)
					.mockResolvedValueOnce(undefined);
				// delete all questions
				mockedDrizzle.where.mockResolvedValueOnce(undefined);

				const quiz = Quiz.fromDataSource({
					id: QUIZ_ID,
					lessonId: LESSON_ID,
					name: "Test Quiz",
					description: null,
					createdAt: DEFAULT_DATE,
					updatedAt: null,
					order: 0,
					questions: [],
					questionCount: 0,
				});

				await repository.save(quiz);

				expect(mockedDrizzle.delete).toHaveBeenCalled();
			});

			it("should delete removed questions", async () => {
				const remainingQuestionId = "f7a8b9c0-d1e2-4f3a-8b4c-5d6e7f8a9b03";
				mockedDrizzle.onConflictDoUpdate
					.mockResolvedValueOnce(undefined)
					.mockResolvedValueOnce(undefined)
					.mockResolvedValueOnce(undefined);
				// existing questions in DB include one that's been removed
				mockedDrizzle.where.mockResolvedValueOnce([
					{ id: remainingQuestionId },
					{ id: QUESTION_ID },
				]);
				// delete the removed question
				mockedDrizzle.where.mockResolvedValueOnce(undefined);

				const question = Question.fromDataSource({
					id: remainingQuestionId,
					quizId: QUIZ_ID,
					content: "Remaining question",
					correctAnswer: "yes",
					order: 0,
					createdAt: DEFAULT_DATE,
					updatedAt: null,
				});

				const quiz = Quiz.fromDataSource({
					id: QUIZ_ID,
					lessonId: LESSON_ID,
					name: "Test Quiz",
					description: null,
					createdAt: DEFAULT_DATE,
					updatedAt: null,
					order: 0,
					questions: [question],
					questionCount: 1,
				});

				await repository.save(quiz);

				expect(mockedDrizzle.delete).toHaveBeenCalled();
			});
		});

		it("should throw RepositoryException on error", async () => {
			mockedDrizzle.transaction.mockRejectedValueOnce(new Error("db error"));

			const article = Article.fromDataSource({
				id: ARTICLE_ID,
				lessonId: LESSON_ID,
				name: "Test Article",
				description: null,
				createdAt: DEFAULT_DATE,
				updatedAt: null,
				order: 0,
				ref: "https://example.com",
			});

			await expect(repository.save(article)).rejects.toThrow(
				RepositoryException,
			);
		});
	});

	describe("remove", () => {
		const id = ActivityId.create(ACTIVITY_ID);

		it("should return true when entity was deleted", async () => {
			mockedDrizzle.where.mockResolvedValueOnce({ rows: [{}] });

			const result = await repository.remove(id);

			expect(mockedDrizzle.delete).toHaveBeenCalled();
			expect(mockedDrizzle.where).toHaveBeenCalled();
			expect(result).toBe(true);
		});

		it("should return false when entity was not found", async () => {
			mockedDrizzle.where.mockResolvedValueOnce({ rows: [] });

			const result = await repository.remove(id);

			expect(result).toBe(false);
		});

		it("should throw RepositoryException on error", async () => {
			mockedDrizzle.where.mockRejectedValueOnce(new Error("db error"));

			await expect(repository.remove(id)).rejects.toThrow(RepositoryException);
		});
	});
});
