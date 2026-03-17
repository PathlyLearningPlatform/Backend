import { LearningPathNotFoundException } from '@/app/common';
import {
	LearningPathProgressNotFoundException,
	type FindLearningPathProgressByIdHandler,
	type FindLearningPathProgressForUserHandler,
	type ListLearningPathProgressHandler,
	type RemoveLearningPathProgressHandler,
	type StartLearningPathHandler,
} from '@/app/learning-path-progress';
import { GrpcLearningPathProgressController } from '@/infra/learning-path-progress/grpc.controller';
import { GrpcException } from '@pathly-backend/common';
import {
	asHandler,
	createErroringHandlerMock,
	createHandlerMock,
	INFRA_TEST_IDS,
} from '../common/test.utils';

describe('GrpcLearningPathProgressController', () => {
	const dto = {
		id: INFRA_TEST_IDS.learningPathProgressId,
		learningPathId: INFRA_TEST_IDS.learningPathId,
		userId: INFRA_TEST_IDS.userId,
		completedAt: null,
		completedSectionCount: 2,
		totalSectionCount: 6,
	};

	const createController = (overrides?: {
		list?: ListLearningPathProgressHandler;
		findById?: FindLearningPathProgressByIdHandler;
		findForUser?: FindLearningPathProgressForUserHandler;
		start?: StartLearningPathHandler;
		remove?: RemoveLearningPathProgressHandler;
	}) =>
		new GrpcLearningPathProgressController(
			overrides?.list ??
				asHandler<ListLearningPathProgressHandler>(createHandlerMock([dto])),
			overrides?.findById ??
				asHandler<FindLearningPathProgressByIdHandler>(createHandlerMock(dto)),
			overrides?.findForUser ??
				asHandler<FindLearningPathProgressForUserHandler>(createHandlerMock(dto)),
			overrides?.start ??
				asHandler<StartLearningPathHandler>(createHandlerMock(dto)),
			overrides?.remove ??
				asHandler<RemoveLearningPathProgressHandler>(createHandlerMock(undefined)),
		);

	describe('list', () => {
		it('returns mapped response', async () => {
			await expect(
				createController().list({
					options: { page: 1, limit: 10 },
					where: { userId: INFRA_TEST_IDS.userId },
				}),
			).resolves.toEqual({ learningPathProgress: [{ ...dto, completedAt: '' }] });
		});
	});

	describe('findForUser', () => {
		it('returns mapped response', async () => {
			await expect(
				createController().findForUser({
					learningPathId: INFRA_TEST_IDS.learningPathId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).resolves.toEqual({ learningPathProgress: { ...dto, completedAt: '' } });
		});

		it('maps app not-found to GrpcException', async () => {
			const controller = createController({
				findForUser: asHandler<FindLearningPathProgressForUserHandler>(
					createErroringHandlerMock(
						new LearningPathProgressNotFoundException(
							INFRA_TEST_IDS.learningPathProgressId,
						),
					),
				),
			});

			await expect(
				controller.findForUser({
					learningPathId: INFRA_TEST_IDS.learningPathId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).rejects.toBeInstanceOf(GrpcException);
		});
	});

	describe('findById', () => {
		it('returns mapped response', async () => {
			await expect(
				createController().findById({ id: INFRA_TEST_IDS.learningPathProgressId }),
			).resolves.toEqual({ learningPathProgress: { ...dto, completedAt: '' } });
		});
	});

	describe('start', () => {
		it('returns mapped response', async () => {
			await expect(
				createController().start({
					learningPathId: INFRA_TEST_IDS.learningPathId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).resolves.toEqual({ learningPathProgress: { ...dto, completedAt: '' } });
		});

		it('maps not-found to GrpcException', async () => {
			const controller = createController({
				start: asHandler<StartLearningPathHandler>(
					createErroringHandlerMock(
						new LearningPathNotFoundException(INFRA_TEST_IDS.learningPathId),
					),
				),
			});

			await expect(
				controller.start({
					learningPathId: INFRA_TEST_IDS.learningPathId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).rejects.toBeInstanceOf(GrpcException);
		});
	});

	describe('remove', () => {
		it('returns empty object on success', async () => {
			await expect(
				createController().remove({ id: INFRA_TEST_IDS.learningPathProgressId }),
			).resolves.toEqual({});
		});

		it('maps not-found error', async () => {
			const controller = createController({
				remove: asHandler<RemoveLearningPathProgressHandler>(
					createErroringHandlerMock(
						new LearningPathProgressNotFoundException(
							INFRA_TEST_IDS.learningPathProgressId,
						),
					),
				),
			});

			await expect(
				controller.remove({ id: INFRA_TEST_IDS.learningPathProgressId }),
			).rejects.toBeInstanceOf(GrpcException);
		});
	});
});
