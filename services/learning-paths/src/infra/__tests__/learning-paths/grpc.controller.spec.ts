import { status as GrpcStatus } from '@grpc/grpc-js';
import { GrpcException } from '@pathly-backend/common';
import { GrpcLearningPathsController } from '@/infra/learning-paths/grpc.controller';
import {
	LearningPathNotFoundException,
} from '@/app/common';
import { LearningPathCannotBeRemovedException } from '@/domain/learning-paths/exceptions';
import {
	mockHandler,
	type MockHandler,
	makeLearningPathDto,
	TEST_IDS,
} from '../common';

describe('GrpcLearningPathsController', () => {
	let controller: GrpcLearningPathsController;
	let listHandler: MockHandler;
	let findByIdHandler: MockHandler;
	let createHandler: MockHandler;
	let updateHandler: MockHandler;
	let removeHandler: MockHandler;

	beforeEach(() => {
		listHandler = mockHandler();
		findByIdHandler = mockHandler();
		createHandler = mockHandler();
		updateHandler = mockHandler();
		removeHandler = mockHandler();

		controller = new GrpcLearningPathsController(
			listHandler as any,
			findByIdHandler as any,
			createHandler as any,
			updateHandler as any,
			removeHandler as any,
		);
	});

	// ──────────────────────────────────────────────
	// list
	// ──────────────────────────────────────────────

	describe('list', () => {
		it('should return learning paths', async () => {
			const dto = makeLearningPathDto();
			listHandler.execute.mockResolvedValue([dto]);

			const result = await controller.list({ options: {} } as any);

			expect(result.learningPaths).toHaveLength(1);
			expect(result.learningPaths[0].id).toBe(dto.id);
			expect(listHandler.execute).toHaveBeenCalled();
		});

		it('should throw GrpcException with INTERNAL on unexpected error', async () => {
			listHandler.execute.mockRejectedValue(new Error('db error'));

			await expect(controller.list({ options: {} } as any)).rejects.toThrow(
				GrpcException,
			);
		});
	});

	// ──────────────────────────────────────────────
	// findById
	// ──────────────────────────────────────────────

	describe('findById', () => {
		it('should return a learning path', async () => {
			const dto = makeLearningPathDto();
			findByIdHandler.execute.mockResolvedValue(dto);

			const result = await controller.findById({
				where: { id: TEST_IDS.learningPath },
			} as any);

			expect(result.learningPath.id).toBe(dto.id);
		});

		it('should throw NOT_FOUND when LearningPathNotFoundException', async () => {
			findByIdHandler.execute.mockRejectedValue(
				new LearningPathNotFoundException(TEST_IDS.learningPath),
			);

			try {
				await controller.findById({
					where: { id: TEST_IDS.learningPath },
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
				controller.findById({ where: { id: TEST_IDS.learningPath } } as any),
			).rejects.toThrow(GrpcException);
		});
	});

	// ──────────────────────────────────────────────
	// create
	// ──────────────────────────────────────────────

	describe('create', () => {
		it('should return created learning path', async () => {
			const dto = makeLearningPathDto();
			createHandler.execute.mockResolvedValue(dto);

			const result = await controller.create({ name: 'LP' } as any);

			expect(result.learningPath.id).toBe(dto.id);
		});

		it('should throw INTERNAL on unexpected error', async () => {
			createHandler.execute.mockRejectedValue(new Error('boom'));

			await expect(controller.create({ name: 'LP' } as any)).rejects.toThrow(
				GrpcException,
			);
		});
	});

	// ──────────────────────────────────────────────
	// update
	// ──────────────────────────────────────────────

	describe('update', () => {
		it('should return updated learning path', async () => {
			const dto = makeLearningPathDto({ name: 'Updated' });
			updateHandler.execute.mockResolvedValue(dto);

			const result = await controller.update({
				where: { id: TEST_IDS.learningPath },
				fields: { name: 'Updated' },
			} as any);

			expect(result.learningPath.name).toBe('Updated');
		});

		it('should throw NOT_FOUND when LearningPathNotFoundException', async () => {
			updateHandler.execute.mockRejectedValue(
				new LearningPathNotFoundException(TEST_IDS.learningPath),
			);

			try {
				await controller.update({
					where: { id: TEST_IDS.learningPath },
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
					where: { id: TEST_IDS.learningPath },
					fields: {},
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
				where: { id: TEST_IDS.learningPath },
			} as any);

			expect(removeHandler.execute).toHaveBeenCalledWith({
				where: { id: TEST_IDS.learningPath },
			});
		});

		it('should throw FAILED_PRECONDITION when cannot be removed', async () => {
			removeHandler.execute.mockRejectedValue(
				new LearningPathCannotBeRemovedException(TEST_IDS.learningPath),
			);

			try {
				await controller.remove({
					where: { id: TEST_IDS.learningPath },
				} as any);
				fail('should have thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(GrpcException);
				expect((err as GrpcException).getError()).toMatchObject({
					code: GrpcStatus.FAILED_PRECONDITION,
				});
			}
		});

		it('should throw NOT_FOUND when LearningPathNotFoundException', async () => {
			removeHandler.execute.mockRejectedValue(
				new LearningPathNotFoundException(TEST_IDS.learningPath),
			);

			try {
				await controller.remove({
					where: { id: TEST_IDS.learningPath },
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
				controller.remove({
					where: { id: TEST_IDS.learningPath },
				} as any),
			).rejects.toThrow(GrpcException);
		});
	});
});
