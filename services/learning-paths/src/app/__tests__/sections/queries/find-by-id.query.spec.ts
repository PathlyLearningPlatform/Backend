import { SectionNotFoundException } from "../../../common/exceptions/section-not-found.exception";
import type { SectionDto } from "../../../sections/dtos";
import { FindSectionByIdHandler } from "../../../sections/queries/find-by-id.query";
import { DEFAULT_DATE, mockSectionReadRepo, TEST_IDS } from "../../common";

const sampleDto: SectionDto = {
	id: TEST_IDS.SECTION_ID,
	learningPathId: TEST_IDS.LP_ID,
	name: "Test Section",
	description: null,
	createdAt: DEFAULT_DATE,
	updatedAt: null,
	order: 0,
	unitCount: 0,
};

describe("FindSectionByIdHandler", () => {
	it("returns the section when found", async () => {
		const repo = mockSectionReadRepo({
			findById: jest.fn().mockResolvedValue(sampleDto),
		});
		const handler = new FindSectionByIdHandler(repo);

		const result = await handler.execute({
			where: { id: TEST_IDS.SECTION_ID },
		});

		expect(result).toEqual(sampleDto);
		expect(repo.findById).toHaveBeenCalledWith(TEST_IDS.SECTION_ID);
	});

	it("throws SectionNotFoundException when not found", async () => {
		const repo = mockSectionReadRepo();
		const handler = new FindSectionByIdHandler(repo);

		await expect(
			handler.execute({ where: { id: TEST_IDS.SECTION_ID } }),
		).rejects.toThrow(SectionNotFoundException);
	});
});
