import { status as GrpcStatus } from '@grpc/grpc-js';
import { GrpcException } from '@pathly-backend/common';
import { GrpcSectionsController } from '@/infra/sections/grpc.controller';
import {
	LearningPathNotFoundException,
	SectionNotFoundException,
} from '@/app/common';
import {
	mockHandler,
	type MockHandler,
	makeSectionDto,
	TEST_IDS,
} from '../common';

describe('GrpcSectionsController', () => {
	let controller: GrpcSectionsController;
	let listHandler: MockHandler;
	let findByIdHandler: MockHandler;
	let addSectionHandler: MockHandler;
	let updateHandler: MockHandler;
	let reorderHandler: MockHandler;
	let removeHandler: MockHandler;

	beforeEach(() => {
		listHandler = mockHandler();
		findByIdHandler = mockHandler();
		addSectionHandler = mockHandler();
		updateHandler = mockHandler();
		reorderHandler = mockHandler();
		removeHandler = mockHandler();

		controller = new GrpcSectionsController(
			listHandler as any,
			findByIdHandler as any,
			addSectionHandler as any,
			updateHandler as any,
			reorderHandler as any,
			removeHandler as any,
		);
	});

	// ──────────────────────────────────────────────
	// list
	// ──────────────────────────────────────────────

	describe('list', () => {
		it('should return sections', async () => {
			const dto = makeSectionDto();
			listHandler.execute.mockResolvedValue([dto]);

			const result = await controller.list({
				where: { learningPathId: TEST_IDS.learningPath },
				options: {},
			} as any);

			expect(result.sections).toHaveLength(1);
			expect(result.sections[0].id).toBe(dto.id);
		});

		it('should throw INTERNAL on unexpected error', async () => {
			listHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.list({ where: {}, options: {} } as any),
			).rejects.toThrow(GrpcException);
		});
	});

	// ──────────────────────────────────────────────
	// findById
	// ──────────────────────────────────────────────

	describe('findById', () => {
		it('should return a section', async () => {
			const dto = makeSectionDto();
			findByIdHandler.execute.mockResolvedValue(dto);

			const result = await controller.findById({
				where: { id: TEST_IDS.section },
			} as any);

			expect(result.section.id).toBe(dto.id);
		});

		it('should throw NOT_FOUND when SectionNotFoundException', async () => {
			findByIdHandler.execute.mockRejectedValue(
				new SectionNotFoundException(TEST_IDS.section),
			);

			try {
				await controller.findById({
					where: { id: TEST_IDS.section },
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw INTERNAL on unexpected error', async () => {
			findByIdHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.findById({ where: { id: TEST_IDS.section } } as any),
			).rejects.toThrow(GrpcException);
		});
	});

	// ──────────────────────────────────────────────
	// create
	// ──────────────────────────────────────────────

	describe('create', () => {
		it('should return created section', async () => {
			const dto = makeSectionDto();
			addSectionHandler.execute.mockResolvedValue(dto);

			const result = await controller.create({
				learningPathId: TEST_IDS.learningPath,
				name: 'Sec',
			} as any);

			expect(result.section.id).toBe(dto.id);
		});

		it('should throw NOT_FOUND when LearningPathNotFoundException', async () => {
			addSectionHandler.execute.mockRejectedValue(
				new LearningPathNotFoundException(TEST_IDS.learningPath),
			);

			try {
				await controller.create({
					learningPathId: TEST_IDS.learningPath,
					name: 'x',
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw INTERNAL on unexpected error', async () => {
			addSectionHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.create({
					learningPathId: TEST_IDS.learningPath,
					name: 'x',
				} as any),
			).rejects.toThrow(GrpcException);
		});
	});

	// ──────────────────────────────────────────────
	// update
	// ──────────────────────────────────────────────

	describe('update', () => {
		it('should return updated section', async () => {
			const dto = makeSectionDto({ name: 'Updated' });
			updateHandler.execute.mockResolvedValue(dto);

			const result = await controller.update({
				where: { id: TEST_IDS.section },
				fields: { name: 'Updated' },
			} as any);

			expect(result.section.name).toBe('Updated');
		});

		it('should throw NOT_FOUND when SectionNotFoundException', async () => {
			updateHandler.execute.mockRejectedValue(
				new SectionNotFoundException(TEST_IDS.section),
			);

			try {
				await controller.update({
					where: { id: TEST_IDS.section },
					fields: { name: 'x' },
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw INTERNAL on unexpected error', async () => {
			updateHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.update({
					where: { id: TEST_IDS.section },
					fields: {},
				} as any),
			).rejects.toThrow(GrpcException);
		});
	});

	// ──────────────────────────────────────────────
	// reorder
	// ──────────────────────────────────────────────

	describe('reorder', () => {
		it('should call reorderHandler', async () => {
			reorderHandler.execute.mockResolvedValue(undefined);

			await controller.reorder({
				sectionId: TEST_IDS.section,
				order: 2,
			} as any);

			expect(reorderHandler.execute).toHaveBeenCalledWith({
				sectionId: TEST_IDS.section,
				order: 2,
			});
		});

		it('should throw NOT_FOUND when SectionNotFoundException', async () => {
			reorderHandler.execute.mockRejectedValue(
				new SectionNotFoundException(TEST_IDS.section),
			);

			try {
				await controller.reorder({
					sectionId: TEST_IDS.section,
					order: 2,
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw INTERNAL on unexpected error', async () => {
			reorderHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.reorder({
					sectionId: TEST_IDS.section,
					order: 2,
				} as any),
			).rejects.toThrow(GrpcException);
		});
	});

	// ──────────────────────────────────────────────
	// remove
	// ──────────────────────────────────────────────

	describe('remove', () => {
		it('should call removeHandler', async () => {
			removeHandler.execute.mockResolvedValue(undefined);

			await controller.remove({
				where: { id: TEST_IDS.section },
			} as any);

			expect(removeHandler.execute).toHaveBeenCalledWith({
				sectionId: TEST_IDS.section,
			});
		});

		it('should throw NOT_FOUND when SectionNotFoundException', async () => {
			removeHandler.execute.mockRejectedValue(
				new SectionNotFoundException(TEST_IDS.section),
			);

			try {
				await controller.remove({
					where: { id: TEST_IDS.section },
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.NOT_FOUND,
				});
			}
		});

		it('should throw INTERNAL on unexpected error', async () => {
			removeHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(
				controller.remove({ where: { id: TEST_IDS.section } } as any),
			).rejects.toThrow(GrpcException);
		});
	});
});
