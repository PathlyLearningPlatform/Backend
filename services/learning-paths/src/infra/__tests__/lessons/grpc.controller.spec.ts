import { status as GrpcStatus } from "@grpc/grpc-js";
import { GrpcException } from "@pathly-backend/common";
import { LessonNotFoundException, UnitNotFoundException } from "@/app/common";
import { GrpcLessonsController } from "@/infra/lessons/grpc.controller";
import {
	type MockHandler,
	makeLessonDto,
	mockHandler,
	TEST_IDS,
} from "../common";

describe("GrpcLessonsController", () => {
	let controller: GrpcLessonsController;
	let listHandler: MockHandler;
	let findByIdHandler: MockHandler;
	let addLessonHandler: MockHandler;
	let updateHandler: MockHandler;
	let reorderHandler: MockHandler;
	let removeHandler: MockHandler;

	beforeEach(() => {
		listHandler = mockHandler();
		findByIdHandler = mockHandler();
		addLessonHandler = mockHandler();
		updateHandler = mockHandler();
		reorderHandler = mockHandler();
		removeHandler = mockHandler();

		controller = new GrpcLessonsController(
			listHandler as any,
			findByIdHandler as any,
			addLessonHandler as any,
			updateHandler as any,
			reorderHandler as any,
			removeHandler as any,
		);
	});

	// ──────────────────────────────────────────────
	// list
	// ──────────────────────────────────────────────

	describe("list", () => {
		it("should return lessons", async () => {
			const dto = makeLessonDto();
			listHandler.execute.mockResolvedValue([dto]);

			const result = await controller.list({
				where: { unitId: TEST_IDS.unit },
				options: {},
			} as any);

			expect(result.lessons).toHaveLength(1);
			expect(result.lessons[0].id).toBe(dto.id);
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
		it("should return a lesson", async () => {
			const dto = makeLessonDto();
			findByIdHandler.execute.mockResolvedValue(dto);

			const result = await controller.findById({
				where: { id: TEST_IDS.lesson },
			} as any);

			expect(result.lesson.id).toBe(dto.id);
		});

		it("should throw NOT_FOUND when LessonNotFoundException", async () => {
			findByIdHandler.execute.mockRejectedValue(
				new LessonNotFoundException(TEST_IDS.lesson),
			);

			try {
				await controller.findById({
					where: { id: TEST_IDS.lesson },
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
				controller.findById({ where: { id: TEST_IDS.lesson } } as any),
			).rejects.toThrow(GrpcException);
		});
	});

	// ──────────────────────────────────────────────
	// create
	// ──────────────────────────────────────────────

	describe("create", () => {
		it("should return created lesson", async () => {
			const dto = makeLessonDto();
			addLessonHandler.execute.mockResolvedValue(dto);

			const result = await controller.create({
				unitId: TEST_IDS.unit,
				name: "Lesson",
			} as any);

			expect(result.lesson.id).toBe(dto.id);
		});

		it("should throw NOT_FOUND when UnitNotFoundException", async () => {
			addLessonHandler.execute.mockRejectedValue(
				new UnitNotFoundException(TEST_IDS.unit),
			);

			try {
				await controller.create({
					unitId: TEST_IDS.unit,
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
			addLessonHandler.execute.mockRejectedValue(new Error("boom"));

			await expect(
				controller.create({ unitId: TEST_IDS.unit, name: "x" } as any),
			).rejects.toThrow(GrpcException);
		});
	});

	// ──────────────────────────────────────────────
	// update
	// ──────────────────────────────────────────────

	describe("update", () => {
		it("should return updated lesson", async () => {
			const dto = makeLessonDto({ name: "Updated" });
			updateHandler.execute.mockResolvedValue(dto);

			const result = await controller.update({
				where: { id: TEST_IDS.lesson },
				fields: { name: "Updated" },
			} as any);

			expect(result.lesson.name).toBe("Updated");
		});

		it("should throw NOT_FOUND when LessonNotFoundException", async () => {
			updateHandler.execute.mockRejectedValue(
				new LessonNotFoundException(TEST_IDS.lesson),
			);

			try {
				await controller.update({
					where: { id: TEST_IDS.lesson },
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
					where: { id: TEST_IDS.lesson },
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
				lessonId: TEST_IDS.lesson,
				order: 1,
			} as any);

			expect(reorderHandler.execute).toHaveBeenCalledWith({
				lessonId: TEST_IDS.lesson,
				order: 1,
			});
		});

		it("should throw NOT_FOUND when LessonNotFoundException", async () => {
			reorderHandler.execute.mockRejectedValue(
				new LessonNotFoundException(TEST_IDS.lesson),
			);

			try {
				await controller.reorder({
					lessonId: TEST_IDS.lesson,
					order: 1,
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
					lessonId: TEST_IDS.lesson,
					order: 1,
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
				where: { id: TEST_IDS.lesson },
			} as any);

			expect(removeHandler.execute).toHaveBeenCalledWith({
				lessonId: TEST_IDS.lesson,
			});
		});

		it("should throw NOT_FOUND when LessonNotFoundException", async () => {
			removeHandler.execute.mockRejectedValue(
				new LessonNotFoundException(TEST_IDS.lesson),
			);

			try {
				await controller.remove({
					where: { id: TEST_IDS.lesson },
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
				controller.remove({ where: { id: TEST_IDS.lesson } } as any),
			).rejects.toThrow(GrpcException);
		});
	});
});
