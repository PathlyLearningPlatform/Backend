import { UnitNotFoundException } from '@/app/common';
import {
	SectionNotStartedException,
	UnitProgressNotFoundException,
	type FindUnitProgressByIdHandler,
	type FindUnitProgressForUserHandler,
	type ListUnitProgressHandler,
	type RemoveUnitProgressHandler,
	type StartUnitHandler,
} from '@/app/unit-progress';
import { GrpcUnitProgressController } from '@/infra/unit-progress/grpc.controller';
import { GrpcException } from '@pathly-backend/common';
import {
	asHandler,
	createErroringHandlerMock,
	createHandlerMock,
	INFRA_TEST_IDS,
} from '../common/test.utils';

describe('GrpcUnitProgressController', () => {
	const dto = {
		id: INFRA_TEST_IDS.unitProgressId,
		unitId: INFRA_TEST_IDS.unitId,
		sectionId: INFRA_TEST_IDS.sectionId,
		userId: INFRA_TEST_IDS.userId,
		completedAt: null,
		completedLessonCount: 2,
		totalLessonCount: 6,
	};

	const createController = (overrides?: {
		list?: ListUnitProgressHandler;
		findById?: FindUnitProgressByIdHandler;
		findForUser?: FindUnitProgressForUserHandler;
		start?: StartUnitHandler;
		remove?: RemoveUnitProgressHandler;
	}) =>
		new GrpcUnitProgressController(
			overrides?.list ?? asHandler<ListUnitProgressHandler>(createHandlerMock([dto])),
			overrides?.findById ??
				asHandler<FindUnitProgressByIdHandler>(createHandlerMock(dto)),
			overrides?.findForUser ??
				asHandler<FindUnitProgressForUserHandler>(createHandlerMock(dto)),
			overrides?.start ?? asHandler<StartUnitHandler>(createHandlerMock(dto)),
			overrides?.remove ??
				asHandler<RemoveUnitProgressHandler>(createHandlerMock(undefined)),
		);

	describe('list', () => {
		it('returns mapped response', async () => {
			await expect(
				createController().list({
					options: { page: 1, limit: 10 },
					where: {
						userId: INFRA_TEST_IDS.userId,
						sectionId: INFRA_TEST_IDS.sectionId,
					},
				}),
			).resolves.toEqual({ unitProgress: [{ ...dto, completedAt: '' }] });
		});
	});

	describe('findForUser', () => {
		it('returns mapped response', async () => {
			await expect(
				createController().findForUser({
					unitId: INFRA_TEST_IDS.unitId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).resolves.toEqual({ unitProgress: { ...dto, completedAt: '' } });
		});

		it('maps not-found error', async () => {
			const controller = createController({
				findForUser: asHandler<FindUnitProgressForUserHandler>(
					createErroringHandlerMock(
						new UnitProgressNotFoundException(INFRA_TEST_IDS.unitProgressId),
					),
				),
			});

			await expect(
				controller.findForUser({
					unitId: INFRA_TEST_IDS.unitId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).rejects.toBeInstanceOf(GrpcException);
		});
	});

	describe('findById', () => {
		it('returns mapped response', async () => {
			await expect(
				createController().findById({ id: INFRA_TEST_IDS.unitProgressId }),
			).resolves.toEqual({ unitProgress: { ...dto, completedAt: '' } });
		});
	});

	describe('start', () => {
		it('returns mapped response', async () => {
			await expect(
				createController().start({
					unitId: INFRA_TEST_IDS.unitId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).resolves.toEqual({ unitProgress: { ...dto, completedAt: '' } });
		});

		it('maps unit not-found error', async () => {
			const controller = createController({
				start: asHandler<StartUnitHandler>(
					createErroringHandlerMock(
						new UnitNotFoundException(INFRA_TEST_IDS.unitId),
					),
				),
			});

			await expect(
				controller.start({
					unitId: INFRA_TEST_IDS.unitId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).rejects.toBeInstanceOf(GrpcException);
		});

		it('maps section-not-started error', async () => {
			const controller = createController({
				start: asHandler<StartUnitHandler>(
					createErroringHandlerMock(
						new SectionNotStartedException(
							INFRA_TEST_IDS.sectionId,
							INFRA_TEST_IDS.userId,
						),
					),
				),
			});

			await expect(
				controller.start({
					unitId: INFRA_TEST_IDS.unitId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).rejects.toBeInstanceOf(GrpcException);
		});
	});

	describe('remove', () => {
		it('returns empty object on success', async () => {
			await expect(
				createController().remove({ id: INFRA_TEST_IDS.unitProgressId }),
			).resolves.toEqual({});
		});

		it('maps app not-found to GrpcException', async () => {
			const controller = createController({
				remove: asHandler<RemoveUnitProgressHandler>(
					createErroringHandlerMock(
						new UnitProgressNotFoundException(INFRA_TEST_IDS.unitProgressId),
					),
				),
			});

			await expect(
				controller.remove({ id: INFRA_TEST_IDS.unitProgressId }),
			).rejects.toBeInstanceOf(GrpcException);
		});
	});
});
