import { status as GrpcStatus } from "@grpc/grpc-js";
import { GrpcException } from "@pathly-backend/common";
import { SectionNotFoundException, UnitNotFoundException } from "@/app/common";
import { GrpcUnitsController } from "@/infra/units/grpc.controller";
import {
	type MockHandler,
	makeUnitDto,
	mockHandler,
	TEST_IDS,
} from "../common";

describe("GrpcUnitsController", () => {
	let controller: GrpcUnitsController;
	let listHandler: MockHandler;
	let findByIdHandler: MockHandler;
	let addUnitHandler: MockHandler;
	let updateHandler: MockHandler;
	let reorderHandler: MockHandler;
	let removeHandler: MockHandler;

	beforeEach(() => {
		listHandler = mockHandler();
		findByIdHandler = mockHandler();
		addUnitHandler = mockHandler();
		updateHandler = mockHandler();
		reorderHandler = mockHandler();
		removeHandler = mockHandler();

		controller = new GrpcUnitsController(
			listHandler as any,
			findByIdHandler as any,
			addUnitHandler as any,
			updateHandler as any,
			reorderHandler as any,
			removeHandler as any,
		);
	});

	// ──────────────────────────────────────────────
	// list
	// ──────────────────────────────────────────────

	describe("list", () => {
		it("should return units", async () => {
			const dto = makeUnitDto();
			listHandler.execute.mockResolvedValue([dto]);

			const result = await controller.list({
				where: { sectionId: TEST_IDS.section },
				options: {},
			} as any);

			expect(result.units).toHaveLength(1);
			expect(result.units[0].id).toBe(dto.id);
		});

		it("should throw INTERNAL on unexpected error", async () => {
			listHandler.execute.mockRejectedValue(new Error("boom"));

			await expect(
				controller.list({ where: {}, options: {} } as any),
			).rejects.toThrow(GrpcException);
		});
	});

	// ──────────────────────────────────────────────
	// findById
	// ──────────────────────────────────────────────

	describe("findById", () => {
		it("should return a unit", async () => {
			const dto = makeUnitDto();
			findByIdHandler.execute.mockResolvedValue(dto);

			const result = await controller.findById({
				where: { id: TEST_IDS.unit },
			} as any);

			expect(result.unit.id).toBe(dto.id);
		});

		it("should throw NOT_FOUND when UnitNotFoundException", async () => {
			findByIdHandler.execute.mockRejectedValue(
				new UnitNotFoundException(TEST_IDS.unit),
			);

			try {
				await controller.findById({
					where: { id: TEST_IDS.unit },
				} as any);
				fail("should have thrown");
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it("should throw INTERNAL on unexpected error", async () => {
			findByIdHandler.execute.mockRejectedValue(new Error("boom"));

			await expect(
				controller.findById({ where: { id: TEST_IDS.unit } } as any),
			).rejects.toThrow(GrpcException);
		});
	});

	// ──────────────────────────────────────────────
	// create
	// ──────────────────────────────────────────────

	describe("create", () => {
		it("should return created unit", async () => {
			const dto = makeUnitDto();
			addUnitHandler.execute.mockResolvedValue(dto);

			const result = await controller.create({
				sectionId: TEST_IDS.section,
				name: "Unit",
			} as any);

			expect(result.unit.id).toBe(dto.id);
		});

		it("should throw NOT_FOUND when SectionNotFoundException", async () => {
			addUnitHandler.execute.mockRejectedValue(
				new SectionNotFoundException(TEST_IDS.section),
			);

			try {
				await controller.create({
					sectionId: TEST_IDS.section,
					name: "x",
				} as any);
				fail("should have thrown");
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it("should throw INTERNAL on unexpected error", async () => {
			addUnitHandler.execute.mockRejectedValue(new Error("boom"));

			await expect(
				controller.create({
					sectionId: TEST_IDS.section,
					name: "x",
				} as any),
			).rejects.toThrow(GrpcException);
		});
	});

	// ──────────────────────────────────────────────
	// update
	// ──────────────────────────────────────────────

	describe("update", () => {
		it("should return updated unit", async () => {
			const dto = makeUnitDto({ name: "Updated" });
			updateHandler.execute.mockResolvedValue(dto);

			const result = await controller.update({
				where: { id: TEST_IDS.unit },
				fields: { name: "Updated" },
			} as any);

			expect(result.unit.name).toBe("Updated");
		});

		it("should throw NOT_FOUND when UnitNotFoundException", async () => {
			updateHandler.execute.mockRejectedValue(
				new UnitNotFoundException(TEST_IDS.unit),
			);

			try {
				await controller.update({
					where: { id: TEST_IDS.unit },
					fields: { name: "x" },
				} as any);
				fail("should have thrown");
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it("should throw INTERNAL on unexpected error", async () => {
			updateHandler.execute.mockRejectedValue(new Error("boom"));

			await expect(
				controller.update({
					where: { id: TEST_IDS.unit },
					fields: {},
				} as any),
			).rejects.toThrow(GrpcException);
		});
	});

	// ──────────────────────────────────────────────
	// reorder
	// ──────────────────────────────────────────────

	describe("reorder", () => {
		it("should call reorderHandler", async () => {
			reorderHandler.execute.mockResolvedValue(undefined);

			await controller.reorder({
				unitId: TEST_IDS.unit,
				order: 3,
			} as any);

			expect(reorderHandler.execute).toHaveBeenCalledWith({
				unitId: TEST_IDS.unit,
				order: 3,
			});
		});

		it("should throw NOT_FOUND when UnitNotFoundException", async () => {
			reorderHandler.execute.mockRejectedValue(
				new UnitNotFoundException(TEST_IDS.unit),
			);

			try {
				await controller.reorder({
					unitId: TEST_IDS.unit,
					order: 3,
				} as any);
				fail("should have thrown");
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it("should throw INTERNAL on unexpected error", async () => {
			reorderHandler.execute.mockRejectedValue(new Error("boom"));

			await expect(
				controller.reorder({
					unitId: TEST_IDS.unit,
					order: 3,
				} as any),
			).rejects.toThrow(GrpcException);
		});
	});

	// ──────────────────────────────────────────────
	// remove
	// ──────────────────────────────────────────────

	describe("remove", () => {
		it("should call removeHandler", async () => {
			removeHandler.execute.mockResolvedValue(undefined);

			await controller.remove({
				where: { id: TEST_IDS.unit },
			} as any);

			expect(removeHandler.execute).toHaveBeenCalledWith({
				unitId: TEST_IDS.unit,
			});
		});

		it("should throw NOT_FOUND when UnitNotFoundException", async () => {
			removeHandler.execute.mockRejectedValue(
				new UnitNotFoundException(TEST_IDS.unit),
			);

			try {
				await controller.remove({
					where: { id: TEST_IDS.unit },
				} as any);
				fail("should have thrown");
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it("should throw INTERNAL on unexpected error", async () => {
			removeHandler.execute.mockRejectedValue(new Error("boom"));

			await expect(
				controller.remove({ where: { id: TEST_IDS.unit } } as any),
			).rejects.toThrow(GrpcException);
		});
	});
});
