import { Test } from "@nestjs/testing";
import { RepositoryException } from "@pathly-backend/common/index.js";
import { Lesson } from "@/domain/lessons/lesson.aggregate";
import { LessonId } from "@/domain/lessons/value-objects/id.vo";
import { PostgresLessonRepository } from "@/infra/lessons/postgres.repository";
import { DEFAULT_DATE } from "../common";
import { mockedDbService, mockedDrizzle, resetDrizzleMocks } from "../mocks";

const LESSON_ID = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d";
const UNIT_ID = "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e";
const ACTIVITY_ID = "e5f6a7b8-c9d0-4e1f-8a2b-3c4d5e6f7a81";

describe("PostgresLessonRepository", () => {
	let repository: PostgresLessonRepository;

	beforeEach(async () => {
		resetDrizzleMocks();

		const module = await Test.createTestingModule({
			providers: [PostgresLessonRepository, mockedDbService],
		}).compile();

		repository = module.get(PostgresLessonRepository);
	});

	describe("load", () => {
		const id = LessonId.create(LESSON_ID);

		it("should return a lesson when found", async () => {
			const dbRow = {
				id: LESSON_ID,
				unitId: UNIT_ID,
				name: "Test Lesson",
				description: null,
				createdAt: DEFAULT_DATE,
				updatedAt: null,
				order: 0,
				activityCount: 0,
			};

			mockedDrizzle.where
				.mockResolvedValueOnce([dbRow])
				.mockResolvedValueOnce([]);

			const result = await repository.load(id);

			expect(mockedDrizzle.transaction).toHaveBeenCalled();
			expect(mockedDrizzle.select).toHaveBeenCalledTimes(2);
			expect(mockedDrizzle.from).toHaveBeenCalledTimes(2);
			expect(mockedDrizzle.where).toHaveBeenCalledTimes(2);
			expect(result).toBeInstanceOf(Lesson);
			expect(result!.id.value).toBe(LESSON_ID);
			expect(result!.name.value).toBe("Test Lesson");
		});

		it("should reconstruct activity refs", async () => {
			const dbRow = {
				id: LESSON_ID,
				unitId: UNIT_ID,
				name: "Test Lesson",
				description: "A desc",
				createdAt: DEFAULT_DATE,
				updatedAt: DEFAULT_DATE,
				order: 0,
				activityCount: 1,
			};
			const activityRefs = [{ order: 0, activityId: ACTIVITY_ID }];

			mockedDrizzle.where
				.mockResolvedValueOnce([dbRow])
				.mockResolvedValueOnce(activityRefs);

			const result = await repository.load(id);

			expect(result).toBeInstanceOf(Lesson);
			expect(result!.activityCount).toBe(1);
		});

		it("should return null when not found", async () => {
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
		it("should call insert → values → onConflictDoUpdate", async () => {
			mockedDrizzle.onConflictDoUpdate.mockResolvedValueOnce(undefined);

			const lesson = Lesson.fromDataSource({
				id: LESSON_ID,
				unitId: UNIT_ID,
				name: "Test Lesson",
				description: null,
				createdAt: DEFAULT_DATE,
				updatedAt: null,
				order: 0,
				activityCount: 0,
				activityRefs: [],
			});

			await repository.save(lesson);

			expect(mockedDrizzle.insert).toHaveBeenCalled();
			expect(mockedDrizzle.values).toHaveBeenCalled();
			expect(mockedDrizzle.onConflictDoUpdate).toHaveBeenCalled();
		});

		it("should throw RepositoryException on error", async () => {
			mockedDrizzle.onConflictDoUpdate.mockRejectedValueOnce(
				new Error("db error"),
			);

			const lesson = Lesson.fromDataSource({
				id: LESSON_ID,
				unitId: UNIT_ID,
				name: "Test Lesson",
				description: null,
				createdAt: DEFAULT_DATE,
				updatedAt: null,
				order: 0,
				activityCount: 0,
				activityRefs: [],
			});

			await expect(repository.save(lesson)).rejects.toThrow(
				RepositoryException,
			);
		});
	});

	describe("remove", () => {
		const id = LessonId.create(LESSON_ID);

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
