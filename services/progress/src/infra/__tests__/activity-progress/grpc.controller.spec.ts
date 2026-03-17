import { ActivityNotFoundException } from '@/app/common';
import {
	ActivityProgressNotFoundException,
	LessonNotStartedException,
	type CompleteActivityHandler,
	type FindActivityProgressByIdHandler,
	type FindActivityProgressForUserHandler,
	type ListActivityProgressHandler,
	type RemoveActivityProgressHandler,
} from '@/app/activity-progress';
import { GrpcActivityProgressController } from '@/infra/activity-progress/grpc.controller';
import { GrpcException } from '@pathly-backend/common';
import {
	asHandler,
	createErroringHandlerMock,
	createHandlerMock,
	INFRA_TEST_IDS,
} from '../common/test.utils';

describe('GrpcActivityProgressController', () => {
	const dto = {
		id: INFRA_TEST_IDS.activityProgressId,
		activityId: INFRA_TEST_IDS.activityId,
		lessonId: INFRA_TEST_IDS.lessonId,
		userId: INFRA_TEST_IDS.userId,
		completedAt: new Date('2026-01-01T00:00:00.000Z'),
	};

	const createController = (overrides?: {
		list?: ListActivityProgressHandler;
		findById?: FindActivityProgressByIdHandler;
		findForUser?: FindActivityProgressForUserHandler;
		complete?: CompleteActivityHandler;
		remove?: RemoveActivityProgressHandler;
	}) =>
		new GrpcActivityProgressController(
			overrides?.list ??
				asHandler<ListActivityProgressHandler>(createHandlerMock([dto])),
			overrides?.findById ??
				asHandler<FindActivityProgressByIdHandler>(createHandlerMock(dto)),
			overrides?.findForUser ??
				asHandler<FindActivityProgressForUserHandler>(createHandlerMock(dto)),
			overrides?.complete ??
				asHandler<CompleteActivityHandler>(createHandlerMock(dto)),
			overrides?.remove ??
				asHandler<RemoveActivityProgressHandler>(createHandlerMock(undefined)),
		);

	describe('list', () => {
		it('returns mapped response', async () => {
			const controller = createController();

			await expect(
				controller.list({
					options: { page: 1, limit: 10 },
					where: {
						userId: INFRA_TEST_IDS.userId,
						lessonId: INFRA_TEST_IDS.lessonId,
					},
				}),
			).resolves.toEqual({
				activityProgress: [
					{
						id: dto.id,
						activityId: dto.activityId,
						lessonId: dto.lessonId,
						userId: dto.userId,
						completedAt: dto.completedAt.toISOString(),
					},
				],
			});
		});

		it('maps unknown errors to GrpcException', async () => {
			const controller = createController({
				list: asHandler<ListActivityProgressHandler>(
					createErroringHandlerMock(new Error('boom')),
				),
			});

			await expect(controller.list({})).rejects.toBeInstanceOf(GrpcException);
		});
	});

	describe('findForUser', () => {
		it('returns mapped response', async () => {
			await expect(
				createController().findForUser({
					activityId: INFRA_TEST_IDS.activityId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).resolves.toEqual({
				activityProgress: {
					id: dto.id,
					activityId: dto.activityId,
					lessonId: dto.lessonId,
					userId: dto.userId,
					completedAt: dto.completedAt.toISOString(),
				},
			});
		});

		it('maps not-found error', async () => {
			const controller = createController({
				findForUser: asHandler<FindActivityProgressForUserHandler>(
					createErroringHandlerMock(
						new ActivityProgressNotFoundException(dto.id),
					),
				),
			});

			await expect(
				controller.findForUser({
					activityId: INFRA_TEST_IDS.activityId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).rejects.toBeInstanceOf(GrpcException);
		});
	});

	describe('findById', () => {
		it('returns mapped response', async () => {
			await expect(
				createController().findById({ id: dto.id }),
			).resolves.toEqual({
				activityProgress: {
					id: dto.id,
					activityId: dto.activityId,
					lessonId: dto.lessonId,
					userId: dto.userId,
					completedAt: dto.completedAt.toISOString(),
				},
			});
		});

		it('maps not-found error', async () => {
			const controller = createController({
				findById: asHandler<FindActivityProgressByIdHandler>(
					createErroringHandlerMock(
						new ActivityProgressNotFoundException(dto.id),
					),
				),
			});

			await expect(controller.findById({ id: dto.id })).rejects.toBeInstanceOf(
				GrpcException,
			);
		});
	});

	describe('complete', () => {
		it('returns mapped response', async () => {
			await expect(
				createController().complete({
					activityId: INFRA_TEST_IDS.activityId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).resolves.toEqual({
				activityProgress: {
					id: dto.id,
					activityId: dto.activityId,
					lessonId: dto.lessonId,
					userId: dto.userId,
					completedAt: dto.completedAt.toISOString(),
				},
			});
		});

		it('maps activity not-found error', async () => {
			const controller = createController({
				complete: asHandler<CompleteActivityHandler>(
					createErroringHandlerMock(
						new ActivityNotFoundException(INFRA_TEST_IDS.activityId),
					),
				),
			});

			await expect(
				controller.complete({
					activityId: INFRA_TEST_IDS.activityId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).rejects.toBeInstanceOf(GrpcException);
		});

		it('maps lesson not-started error', async () => {
			const controller = createController({
				complete: asHandler<CompleteActivityHandler>(
					createErroringHandlerMock(
						new LessonNotStartedException(
							INFRA_TEST_IDS.lessonId,
							INFRA_TEST_IDS.userId,
						),
					),
				),
			});

			await expect(
				controller.complete({
					activityId: INFRA_TEST_IDS.activityId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).rejects.toBeInstanceOf(GrpcException);
		});
	});

	describe('remove', () => {
		it('returns empty object on success', async () => {
			await expect(
				createController().remove({ id: INFRA_TEST_IDS.activityProgressId }),
			).resolves.toEqual({});
		});

		it('maps app not-found error', async () => {
			const controller = createController({
				remove: asHandler<RemoveActivityProgressHandler>(
					createErroringHandlerMock(
						new ActivityProgressNotFoundException(
							INFRA_TEST_IDS.activityProgressId,
						),
					),
				),
			});

			await expect(
				controller.remove({ id: INFRA_TEST_IDS.activityProgressId }),
			).rejects.toBeInstanceOf(GrpcException);
		});
	});
});
