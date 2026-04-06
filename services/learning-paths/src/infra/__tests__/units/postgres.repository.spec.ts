import { Test } from "@nestjs/testing";
import { RepositoryException } from "@pathly-backend/common/index.js";
import { Unit } from "@/domain/units/unit.aggregate";
import { UnitId } from "@/domain/units/value-objects/id.vo";
import { PostgresUnitRepository } from "@/infra/units/postgres.repository";
import { DEFAULT_DATE } from "../common";
import { mockedDbService, mockedDrizzle, resetDrizzleMocks } from "../mocks";

const UNIT_ID = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d";
const SECTION_ID = "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e";
const LESSON_ID = "d4e5f6a7-b8c9-4d0e-bf2a-3b4c5d6e7f80";

describe("PostgresUnitRepository", () => {
	let repository: PostgresUnitRepository;

	beforeEach(async () => {
		resetDrizzleMocks();

		const module = await Test.createTestingModule({
			providers: [PostgresUnitRepository, mockedDbService],
		}).compile();

		repository = module.get(PostgresUnitRepository);
	});

	describe("load", () => {
		const id = UnitId.create(UNIT_ID);

		it("should return a unit when found", async () => {
			const dbRow = {
				id: UNIT_ID,
				sectionId: SECTION_ID,
				name: "Test Unit",
				description: null,
				createdAt: DEFAULT_DATE,
				updatedAt: null,
				order: 0,
				lessonCount: 0,
			};

			mockedDrizzle.where
				.mockResolvedValueOnce([dbRow])
				.mockResolvedValueOnce([]);

			const result = await repository.load(id);

			expect(mockedDrizzle.transaction).toHaveBeenCalled();
			expect(mockedDrizzle.select).toHaveBeenCalledTimes(2);
			expect(mockedDrizzle.from).toHaveBeenCalledTimes(2);
			expect(mockedDrizzle.where).toHaveBeenCalledTimes(2);
			expect(result).toBeInstanceOf(Unit);
			expect(result!.id.value).toBe(UNIT_ID);
			expect(result!.name.value).toBe("Test Unit");
		});

		it("should reconstruct lesson refs", async () => {
			const dbRow = {
				id: UNIT_ID,
				sectionId: SECTION_ID,
				name: "Test Unit",
				description: "A desc",
				createdAt: DEFAULT_DATE,
				updatedAt: DEFAULT_DATE,
				order: 0,
				lessonCount: 1,
			};
			const lessonRefs = [{ order: 0, lessonId: LESSON_ID }];

			mockedDrizzle.where
				.mockResolvedValueOnce([dbRow])
				.mockResolvedValueOnce(lessonRefs);

			const result = await repository.load(id);

			expect(result).toBeInstanceOf(Unit);
			expect(result!.lessonCount).toBe(1);
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

			const unit = Unit.fromDataSource({
				id: UNIT_ID,
				sectionId: SECTION_ID,
				name: "Test Unit",
				description: null,
				createdAt: DEFAULT_DATE,
				updatedAt: null,
				order: 0,
				lessonCount: 0,
				lessonRefs: [],
			});

			await repository.save(unit);

			expect(mockedDrizzle.insert).toHaveBeenCalled();
			expect(mockedDrizzle.values).toHaveBeenCalled();
			expect(mockedDrizzle.onConflictDoUpdate).toHaveBeenCalled();
		});

		it("should throw RepositoryException on error", async () => {
			mockedDrizzle.onConflictDoUpdate.mockRejectedValueOnce(
				new Error("db error"),
			);

			const unit = Unit.fromDataSource({
				id: UNIT_ID,
				sectionId: SECTION_ID,
				name: "Test Unit",
				description: null,
				createdAt: DEFAULT_DATE,
				updatedAt: null,
				order: 0,
				lessonCount: 0,
				lessonRefs: [],
			});

			await expect(repository.save(unit)).rejects.toThrow(RepositoryException);
		});
	});

	describe("remove", () => {
		const id = UnitId.create(UNIT_ID);

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
