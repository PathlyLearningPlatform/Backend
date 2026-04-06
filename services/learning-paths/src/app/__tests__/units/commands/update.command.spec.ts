import { UnitNotFoundException } from "../../../common/exceptions/unit-not-found.exception";
import { UpdateUnitHandler } from "../../../units/commands/update.command";
import { makeUnit, mockUnitRepo, TEST_IDS } from "../../common";

describe("UpdateUnitHandler", () => {
	it("updates a unit and saves it", async () => {
		const unit = makeUnit();
		const repo = mockUnitRepo({ load: jest.fn().mockResolvedValue(unit) });
		const handler = new UpdateUnitHandler(repo);

		const result = await handler.execute({
			where: { id: TEST_IDS.UNIT_ID },
			props: { name: "Updated Unit", description: "New desc" },
		});

		expect(result.name).toBe("Updated Unit");
		expect(result.description).toBe("New desc");
		expect(result.updatedAt).toBeInstanceOf(Date);
		expect(repo.save).toHaveBeenCalledTimes(1);
	});

	it("throws UnitNotFoundException when not found", async () => {
		const repo = mockUnitRepo();
		const handler = new UpdateUnitHandler(repo);

		await expect(
			handler.execute({ where: { id: TEST_IDS.UNIT_ID } }),
		).rejects.toThrow(UnitNotFoundException);
	});
});
