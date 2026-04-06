import { Test } from "@nestjs/testing";
import { ActivityType } from "@/domain/activities/value-objects";
import { PostgresActivityReadRepository } from "@/infra/activities/postgres-read.repository";
import {
	makeActivityDto,
	makeArticleDto,
	makeExerciseDto,
	makeQuestionDto,
	TEST_IDS,
} from "../common";
import { mockedDbService, mockedDrizzle } from "../mocks";

describe("PostgresActivityReadRepository", () => {
	let repository: PostgresActivityReadRepository;

	beforeEach(async () => {
		jest.clearAllMocks();

		const module = await Test.createTestingModule({
			providers: [PostgresActivityReadRepository, mockedDbService],
		}).compile();

		repository = module.get(PostgresActivityReadRepository);
	});

	describe("list", () => {
		it("should call select chain and return results", async () => {
			const dto = makeActivityDto();
			mockedDrizzle.offset.mockResolvedValueOnce([dto]);

			const result = await repository.list({
				where: { lessonId: TEST_IDS.lesson },
				options: {},
			});

			expect(mockedDrizzle.select).toHaveBeenCalled();
			expect(mockedDrizzle.from).toHaveBeenCalled();
			expect(result).toEqual([dto]);
		});

		it("should return empty array when no results", async () => {
			mockedDrizzle.offset.mockResolvedValueOnce([]);

			const result = await repository.list();

			expect(result).toEqual([]);
		});
	});

	describe("findById", () => {
		it("should return an activity when found", async () => {
			const dto = makeActivityDto();
			mockedDrizzle.where.mockResolvedValueOnce([dto]);

			const result = await repository.findById(TEST_IDS.activity);

			expect(result).toEqual(dto);
		});

		it("should return null when not found", async () => {
			mockedDrizzle.where.mockResolvedValueOnce([]);

			const result = await repository.findById(TEST_IDS.activity);

			expect(result).toBeNull();
		});
	});

	describe("findArticleById", () => {
		it("should return an article when found", async () => {
			const dto = makeArticleDto();
			mockedDrizzle.where.mockResolvedValueOnce([dto]);

			const result = await repository.findArticleById(TEST_IDS.article);

			expect(result).toEqual(dto);
		});

		it("should return null when not found", async () => {
			mockedDrizzle.where.mockResolvedValueOnce([]);

			const result = await repository.findArticleById(TEST_IDS.article);

			expect(result).toBeNull();
		});
	});

	describe("findExerciseById", () => {
		it("should return an exercise when found", async () => {
			const dto = makeExerciseDto();
			mockedDrizzle.where.mockResolvedValueOnce([dto]);

			const result = await repository.findExerciseById(TEST_IDS.exercise);

			expect(result).toEqual(dto);
		});

		it("should return null when not found", async () => {
			mockedDrizzle.where.mockResolvedValueOnce([]);

			const result = await repository.findExerciseById(TEST_IDS.exercise);

			expect(result).toBeNull();
		});
	});

	describe("findQuizById", () => {
		it("should return a quiz with questions when found", async () => {
			const quizRow = {
				id: TEST_IDS.quiz,
				lessonId: TEST_IDS.lesson,
				name: "Quiz",
				description: null,
				createdAt: new Date(),
				updatedAt: null,
				order: 0,
				type: ActivityType.QUIZ,
			};
			const questionRow = {
				id: TEST_IDS.question,
				quizId: TEST_IDS.quiz,
				content: "Q?",
				correctAnswer: "A",
			};

			// First where: quiz select
			mockedDrizzle.where
				.mockResolvedValueOnce([quizRow])
				// Second where: questions select
				.mockResolvedValueOnce([questionRow]);

			const result = await repository.findQuizById(TEST_IDS.quiz);

			expect(result).not.toBeNull();
			expect(result!.id).toBe(TEST_IDS.quiz);
			expect(result!.questions).toHaveLength(1);
			expect(result!.questions[0].id).toBe(TEST_IDS.question);
		});

		it("should return null when quiz not found", async () => {
			mockedDrizzle.where.mockResolvedValueOnce([]);

			const result = await repository.findQuizById(TEST_IDS.quiz);

			expect(result).toBeNull();
		});
	});
});
