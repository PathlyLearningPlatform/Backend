import type { UnitDto } from "../../../units/dtos";
import { ListUnitsHandler } from "../../../units/queries/list.query";
import { DEFAULT_DATE, mockUnitReadRepo, TEST_IDS } from "../../common";

const sampleDto: UnitDto = {
	id: TEST_IDS.UNIT_ID,
	sectionId: TEST_IDS.SECTION_ID,
	name: "Test Unit",
	description: null,
	createdAt: DEFAULT_DATE,
	updatedAt: null,
	order: 0,
	lessonCount: 0,
};

describe("ListUnitsHandler", () => {
	it("returns a list of units", async () => {
		const dtos = [sampleDto];
		const repo = mockUnitReadRepo({
			list: jest.fn().mockResolvedValue(dtos),
		});
		const handler = new ListUnitsHandler(repo);

		const result = await handler.execute({});

		expect(result).toEqual(dtos);
	});

	it("passes filter and pagination to the repository", async () => {
		const repo = mockUnitReadRepo({
			list: jest.fn().mockResolvedValue([]),
		});
		const handler = new ListUnitsHandler(repo);

		await handler.execute({
			where: { sectionId: "123" },
			options: { limit: 5, page: 1 },
		});

		expect(repo.list).toHaveBeenCalledWith({
			where: { sectionId: "123" },
			options: { limit: 5, page: 1 },
		});
	});
});
