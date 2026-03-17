import { SectionNotFoundException } from '@/app/common';
import {
	LearningPathNotStartedException,
	SectionProgressNotFoundException,
	type FindSectionProgressByIdHandler,
	type FindSectionProgressForUserHandler,
	type ListSectionProgressHandler,
	type RemoveSectionProgressHandler,
	type StartSectionHandler,
} from '@/app/section-progress';
import { GrpcSectionProgressController } from '@/infra/section-progress/grpc.controller';
import { GrpcException } from '@pathly-backend/common';
import {
	asHandler,
	createErroringHandlerMock,
	createHandlerMock,
	INFRA_TEST_IDS,
} from '../common/test.utils';

describe('GrpcSectionProgressController', () => {
	const dto = {
		id: INFRA_TEST_IDS.sectionProgressId,
		sectionId: INFRA_TEST_IDS.sectionId,
		learningPathId: INFRA_TEST_IDS.learningPathId,
		userId: INFRA_TEST_IDS.userId,
		completedAt: null,
		completedUnitCount: 1,
		totalUnitCount: 4,
	};

	const createController = (overrides?: {
		list?: ListSectionProgressHandler;
		findById?: FindSectionProgressByIdHandler;
		findForUser?: FindSectionProgressForUserHandler;
		start?: StartSectionHandler;
		remove?: RemoveSectionProgressHandler;
	}) =>
		new GrpcSectionProgressController(
			overrides?.list ??
				asHandler<ListSectionProgressHandler>(createHandlerMock([dto])),
			overrides?.findById ??
				asHandler<FindSectionProgressByIdHandler>(createHandlerMock(dto)),
			overrides?.findForUser ??
				asHandler<FindSectionProgressForUserHandler>(createHandlerMock(dto)),
			overrides?.start ?? asHandler<StartSectionHandler>(createHandlerMock(dto)),
			overrides?.remove ??
				asHandler<RemoveSectionProgressHandler>(createHandlerMock(undefined)),
		);

	describe('list', () => {
		it('returns mapped response', async () => {
			await expect(
				createController().list({
					options: { page: 1, limit: 10 },
					where: {
						userId: INFRA_TEST_IDS.userId,
						learningPathId: INFRA_TEST_IDS.learningPathId,
					},
				}),
			).resolves.toEqual({ sectionProgress: [{ ...dto, completedAt: '' }] });
		});
	});

	describe('findForUser', () => {
		it('returns mapped response', async () => {
			await expect(
				createController().findForUser({
					sectionId: INFRA_TEST_IDS.sectionId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).resolves.toEqual({ sectionProgress: { ...dto, completedAt: '' } });
		});

		it('maps not-found error', async () => {
			const controller = createController({
				findForUser: asHandler<FindSectionProgressForUserHandler>(
					createErroringHandlerMock(
						new SectionProgressNotFoundException(INFRA_TEST_IDS.sectionProgressId),
					),
				),
			});

			await expect(
				controller.findForUser({
					sectionId: INFRA_TEST_IDS.sectionId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).rejects.toBeInstanceOf(GrpcException);
		});
	});

	describe('findById', () => {
		it('returns mapped response', async () => {
			await expect(
				createController().findById({ id: INFRA_TEST_IDS.sectionProgressId }),
			).resolves.toEqual({ sectionProgress: { ...dto, completedAt: '' } });
		});

		it('maps app not-found to GrpcException', async () => {
			const controller = createController({
				findById: asHandler<FindSectionProgressByIdHandler>(
					createErroringHandlerMock(
						new SectionProgressNotFoundException(INFRA_TEST_IDS.sectionProgressId),
					),
				),
			});

			await expect(
				controller.findById({ id: INFRA_TEST_IDS.sectionProgressId }),
			).rejects.toBeInstanceOf(GrpcException);
		});
	});

	describe('start', () => {
		it('returns mapped response', async () => {
			await expect(
				createController().start({
					sectionId: INFRA_TEST_IDS.sectionId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).resolves.toEqual({ sectionProgress: { ...dto, completedAt: '' } });
		});

		it('maps section not-found error', async () => {
			const controller = createController({
				start: asHandler<StartSectionHandler>(
					createErroringHandlerMock(
						new SectionNotFoundException(INFRA_TEST_IDS.sectionId),
					),
				),
			});

			await expect(
				controller.start({
					sectionId: INFRA_TEST_IDS.sectionId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).rejects.toBeInstanceOf(GrpcException);
		});

		it('maps learning-path-not-started error', async () => {
			const controller = createController({
				start: asHandler<StartSectionHandler>(
					createErroringHandlerMock(
						new LearningPathNotStartedException(
							INFRA_TEST_IDS.learningPathId,
							INFRA_TEST_IDS.userId,
						),
					),
				),
			});

			await expect(
				controller.start({
					sectionId: INFRA_TEST_IDS.sectionId,
					userId: INFRA_TEST_IDS.userId,
				}),
			).rejects.toBeInstanceOf(GrpcException);
		});
	});

	describe('remove', () => {
		it('returns empty object on success', async () => {
			await expect(
				createController().remove({ id: INFRA_TEST_IDS.sectionProgressId }),
			).resolves.toEqual({});
		});

		it('maps not-found error', async () => {
			const controller = createController({
				remove: asHandler<RemoveSectionProgressHandler>(
					createErroringHandlerMock(
						new SectionProgressNotFoundException(INFRA_TEST_IDS.sectionProgressId),
					),
				),
			});

			await expect(
				controller.remove({ id: INFRA_TEST_IDS.sectionProgressId }),
			).rejects.toBeInstanceOf(GrpcException);
		});
	});
});
