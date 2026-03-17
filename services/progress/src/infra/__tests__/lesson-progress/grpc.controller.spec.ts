import { LessonNotFoundException } from '@/app/common';
import {
	LessonProgressNotFoundException,
	UnitNotStartedException,
	type FindLessonProgressByIdHandler,
	type FindLessonProgressForUserHandler,
	type ListLessonProgressHandler,
	type RemoveLessonProgressHandler,
	type StartLessonHandler,
} from '@/app/lesson-progress';
import { GrpcLessonProgressController } from '@/infra/lesson-progress/grpc.controller';
import { GrpcException } from '@pathly-backend/common';
import {
	asHandler,
	createErroringHandlerMock,
	createHandlerMock,
	INFRA_TEST_IDS,
} from '../common/test.utils';

describe('GrpcLessonProgressController', () => {
	const dto = {
		id: INFRA_TEST_IDS.lessonProgressId,
		lessonId: INFRA_TEST_IDS.lessonId,
		unitId: INFRA_TEST_IDS.unitId,
		userId: INFRA_TEST_IDS.userId,
		completedAt: null,
		completedActivityCount: 1,
		totalActivityCount: 3,
	};

	const createController = (overrides?: {
		list?: ListLessonProgressHandler;
		findById?: FindLessonProgressByIdHandler;
		findForUser?: FindLessonProgressForUserHandler;
		start?: StartLessonHandler;
		remove?: RemoveLessonProgressHandler;
	}) =>
		new GrpcLessonProgressController(
			overrides?.list ??
				asHandler<ListLessonProgressHandler>(createHandlerMock([dto])),
			overrides?.findById ??
				asHandler<FindLessonProgressByIdHandler>(createHandlerMock(dto)),
			overrides?.findForUser ??
				asHandler<FindLessonProgressForUserHandler>(createHandlerMock(dto)),
			overrides?.start ?? asHandler<StartLessonHandler>(createHandlerMock(dto)),
			overrides?.remove ??
				asHandler<RemoveLessonProgressHandler>(createHandlerMock(undefined)),
		);

	describe('list', () => {
		it('returns mapped response', async () => {
			await expect(
				createController().list({
					options: { page: 1, limit: 10 },
					where: { userId: INFRA_TEST_IDS.userId, unitId: INFRA_TEST_IDS.unitId },
				}),
			).resolves.toEqual({ lessonProgress: [{ ...dto, completedAt: '' }] });
		});
	});

	describe('findForUser', () => {
		it('returns mapped response', async () => {
			await expect(
				createController().findForUser({
					lessonId: INFRA_TEST_IDS.lessonId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).resolves.toEqual({ lessonProgress: { ...dto, completedAt: '' } });
		});

		it('maps not-found error', async () => {
			const controller = createController({
				findForUser: asHandler<FindLessonProgressForUserHandler>(
					createErroringHandlerMock(
						new LessonProgressNotFoundException(INFRA_TEST_IDS.lessonProgressId),
					),
				),
			});

			await expect(
				controller.findForUser({
					lessonId: INFRA_TEST_IDS.lessonId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).rejects.toBeInstanceOf(GrpcException);
		});
	});

	describe('findById', () => {
		it('returns mapped response', async () => {
			await expect(
				createController().findById({ id: INFRA_TEST_IDS.lessonProgressId }),
			).resolves.toEqual({ lessonProgress: { ...dto, completedAt: '' } });
		});

		it('maps app not-found to GrpcException', async () => {
			const controller = createController({
				findById: asHandler<FindLessonProgressByIdHandler>(
					createErroringHandlerMock(
						new LessonProgressNotFoundException(INFRA_TEST_IDS.lessonProgressId),
					),
				),
			});

			await expect(
				controller.findById({ id: INFRA_TEST_IDS.lessonProgressId }),
			).rejects.toBeInstanceOf(GrpcException);
		});
	});

	describe('start', () => {
		it('returns mapped response', async () => {
			await expect(
				createController().start({
					lessonId: INFRA_TEST_IDS.lessonId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).resolves.toEqual({ lessonProgress: { ...dto, completedAt: '' } });
		});

		it('maps lesson-not-found error', async () => {
			const controller = createController({
				start: asHandler<StartLessonHandler>(
					createErroringHandlerMock(
						new LessonNotFoundException(INFRA_TEST_IDS.lessonId),
					),
				),
			});

			await expect(
				controller.start({
					lessonId: INFRA_TEST_IDS.lessonId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).rejects.toBeInstanceOf(GrpcException);
		});

		it('maps unit-not-started error', async () => {
			const controller = createController({
				start: asHandler<StartLessonHandler>(
					createErroringHandlerMock(
						new UnitNotStartedException(
							INFRA_TEST_IDS.unitId,
							INFRA_TEST_IDS.userId,
						),
					),
				),
			});

			await expect(
				controller.start({
					lessonId: INFRA_TEST_IDS.lessonId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).rejects.toBeInstanceOf(GrpcException);
		});
	});

	describe('remove', () => {
		it('returns empty object on success', async () => {
			await expect(
				createController().remove({ id: INFRA_TEST_IDS.lessonProgressId }),
			).resolves.toEqual({});
		});

		it('maps not-found error', async () => {
			const controller = createController({
				remove: asHandler<RemoveLessonProgressHandler>(
					createErroringHandlerMock(
						new LessonProgressNotFoundException(INFRA_TEST_IDS.lessonProgressId),
					),
				),
			});

			await expect(
				controller.remove({ id: INFRA_TEST_IDS.lessonProgressId }),
			).rejects.toBeInstanceOf(GrpcException);
		});
	});
});
