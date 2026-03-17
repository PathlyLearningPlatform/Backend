import {
	FindUnitProgressByIdHandler,
	FindUnitProgressForUserHandler,
	ListUnitProgressHandler,
} from '@/app/unit-progress/queries';
import { UnitProgressNotFoundException } from '@/app/unit-progress/exceptions';
import { APP_TEST_IDS, createReadRepositoryMock } from '../../common/test.utils';

const dto = {
	id: APP_TEST_IDS.unitProgressId,
	unitId: APP_TEST_IDS.unitId,
	sectionId: APP_TEST_IDS.sectionId,
	userId: APP_TEST_IDS.userId,
	completedAt: null,
	completedLessonCount: 1,
	totalLessonCount: 4,
};

describe('unit-progress queries', () => {
	it('findById returns dto', async () => {
		const repository = createReadRepositoryMock();
		repository.findById.mockResolvedValue(dto);
		const handler = new FindUnitProgressByIdHandler(repository as never);

		await expect(handler.execute({ id: dto.id })).resolves.toEqual(dto);
	});

	it('findById throws when not found', async () => {
		const repository = createReadRepositoryMock();
		repository.findById.mockResolvedValue(null);
		const handler = new FindUnitProgressByIdHandler(repository as never);

		await expect(handler.execute({ id: dto.id })).rejects.toBeInstanceOf(
			UnitProgressNotFoundException,
		);
	});

	it('findForUser returns dto', async () => {
		const repository = createReadRepositoryMock();
		repository.findForUser.mockResolvedValue(dto);
		const handler = new FindUnitProgressForUserHandler(repository as never);

		await expect(
			handler.execute({ unitId: dto.unitId, userId: dto.userId }),
		).resolves.toEqual(dto);
	});

	it('findForUser throws when not found', async () => {
		const repository = createReadRepositoryMock();
		repository.findForUser.mockResolvedValue(null);
		const handler = new FindUnitProgressForUserHandler(repository as never);

		await expect(
			handler.execute({ unitId: dto.unitId, userId: dto.userId }),
		).rejects.toBeInstanceOf(UnitProgressNotFoundException);
	});

	it('list maps options and where filters', async () => {
		const repository = createReadRepositoryMock();
		repository.list.mockResolvedValue([dto]);
		const handler = new ListUnitProgressHandler(repository as never);

		await expect(
			handler.execute({
				options: { page: 2, limit: 15 },
				where: { userId: dto.userId, sectionId: dto.sectionId },
			}),
		).resolves.toEqual([dto]);

		expect(repository.list).toHaveBeenCalledWith({
			options: { page: 2, limit: 15 },
			where: { userId: dto.userId, sectionId: dto.sectionId },
		});
	});
});