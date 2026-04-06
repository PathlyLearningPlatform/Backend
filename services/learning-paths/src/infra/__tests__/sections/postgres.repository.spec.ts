import { Test } from "@nestjs/testing";
import { RepositoryException } from "@pathly-backend/common/index.js";
import { Section } from "@/domain/sections/section.aggregate";
import { SectionId } from "@/domain/sections/value-objects/id.vo";
import { PostgresSectionRepository } from "@/infra/sections/postgres.repository";
import { DEFAULT_DATE } from "../common";
import { mockedDbService, mockedDrizzle, resetDrizzleMocks } from "../mocks";

const SECTION_ID = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d";
const LP_ID = "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e";
const UNIT_ID = "c3d4e5f6-a7b8-4c9d-ae1f-2a3b4c5d6e7f";

describe("PostgresSectionRepository", () => {
	let repository: PostgresSectionRepository;

	beforeEach(async () => {
		resetDrizzleMocks();

		const module = await Test.createTestingModule({
			providers: [PostgresSectionRepository, mockedDbService],
		}).compile();

		repository = module.get(PostgresSectionRepository);
	});

	describe("load", () => {
		const id = SectionId.create(SECTION_ID);

		it("should return a section when found", async () => {
			const dbRow = {
				id: SECTION_ID,
				learningPathId: LP_ID,
				name: "Test Section",
				description: null,
				createdAt: DEFAULT_DATE,
				updatedAt: null,
				order: 0,
				unitCount: 0,
			};

			mockedDrizzle.where
				.mockResolvedValueOnce([dbRow])
				.mockResolvedValueOnce([]);

			const result = await repository.load(id);

			expect(mockedDrizzle.transaction).toHaveBeenCalled();
			expect(mockedDrizzle.select).toHaveBeenCalledTimes(2);
			expect(mockedDrizzle.from).toHaveBeenCalledTimes(2);
			expect(mockedDrizzle.where).toHaveBeenCalledTimes(2);
			expect(result).toBeInstanceOf(Section);
			expect(result!.id.value).toBe(SECTION_ID);
			expect(result!.name.value).toBe("Test Section");
		});

		it("should reconstruct unit refs", async () => {
			const dbRow = {
				id: SECTION_ID,
				learningPathId: LP_ID,
				name: "Test Section",
				description: "A desc",
				createdAt: DEFAULT_DATE,
				updatedAt: DEFAULT_DATE,
				order: 0,
				unitCount: 1,
			};
			const unitRefs = [{ order: 0, unitId: UNIT_ID }];

			mockedDrizzle.where
				.mockResolvedValueOnce([dbRow])
				.mockResolvedValueOnce(unitRefs);

			const result = await repository.load(id);

			expect(result).toBeInstanceOf(Section);
			expect(result!.unitCount).toBe(1);
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

			const section = Section.fromDataSource({
				id: SECTION_ID,
				learningPathId: LP_ID,
				name: "Test Section",
				description: null,
				createdAt: DEFAULT_DATE,
				updatedAt: null,
				order: 0,
				unitCount: 0,
				unitRefs: [],
			});

			await repository.save(section);

			expect(mockedDrizzle.insert).toHaveBeenCalled();
			expect(mockedDrizzle.values).toHaveBeenCalled();
			expect(mockedDrizzle.onConflictDoUpdate).toHaveBeenCalled();
		});

		it("should throw RepositoryException on error", async () => {
			mockedDrizzle.onConflictDoUpdate.mockRejectedValueOnce(
				new Error("db error"),
			);

			const section = Section.fromDataSource({
				id: SECTION_ID,
				learningPathId: LP_ID,
				name: "Test Section",
				description: null,
				createdAt: DEFAULT_DATE,
				updatedAt: null,
				order: 0,
				unitCount: 0,
				unitRefs: [],
			});

			await expect(repository.save(section)).rejects.toThrow(
				RepositoryException,
			);
		});
	});

	describe("remove", () => {
		const id = SectionId.create(SECTION_ID);

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
