import { Test } from "@nestjs/testing";
import { PostgresLessonReadRepository } from "@/infra/lessons/postgres-read.repository";
import { makeLessonDto, TEST_IDS } from "../common";
import { mockedDbService, mockedDrizzle } from "../mocks";

describe("PostgresLessonReadRepository", () => {
	let repository: PostgresLessonReadRepository;

	beforeEach(async () => {
		jest.clearAllMocks();

		const module = await Test.createTestingModule({
			providers: [PostgresLessonReadRepository, mockedDbService],
		}).compile();

		repository = module.get(PostgresLessonReadRepository);
	});

	describe("list", () => {
		it("should call select chain and return results", async () => {
			const dto = makeLessonDto();
			mockedDrizzle.offset.mockResolvedValueOnce([dto]);

			const result = await repository.list({
				where: { unitId: TEST_IDS.unit },
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
		it("should return a lesson when found", async () => {
			const dto = makeLessonDto();
			mockedDrizzle.where.mockResolvedValueOnce([dto]);

			const result = await repository.findById(TEST_IDS.lesson);

			expect(result).toEqual(dto);
		});

		it("should return null when not found", async () => {
			mockedDrizzle.where.mockResolvedValueOnce([]);

			const result = await repository.findById(TEST_IDS.lesson);

			expect(result).toBeNull();
		});
	});
});
