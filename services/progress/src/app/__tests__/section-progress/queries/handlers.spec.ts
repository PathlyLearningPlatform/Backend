import {
	FindSectionProgressByIdHandler,
	FindSectionProgressForUserHandler,
	ListSectionProgressHandler,
} from '@/app/section-progress/queries';
import { SectionProgressNotFoundException } from '@/app/section-progress/exceptions';
import { APP_TEST_IDS, createReadRepositoryMock } from '../../common/test.utils';

const dto = {
	id: APP_TEST_IDS.sectionProgressId,
	sectionId: APP_TEST_IDS.sectionId,
	learningPathId: APP_TEST_IDS.learningPathId,
	userId: APP_TEST_IDS.userId,
	completedAt: null,
	completedUnitCount: 2,
	totalUnitCount: 6,
};

describe('section-progress queries', () => {
	it('findById returns dto', async () => {
		const repository = createReadRepositoryMock();
		repository.findById.mockResolvedValue(dto);
		const handler = new FindSectionProgressByIdHandler(repository as never);

		await expect(handler.execute({ id: dto.id })).resolves.toEqual(dto);
	});

	it('findById throws when not found', async () => {
		const repository = createReadRepositoryMock();
		repository.findById.mockResolvedValue(null);
		const handler = new FindSectionProgressByIdHandler(repository as never);

		await expect(handler.execute({ id: dto.id })).rejects.toBeInstanceOf(
			SectionProgressNotFoundException,
		);
	});

	it('findForUser returns dto', async () => {
		const repository = createReadRepositoryMock();
		repository.findForUser.mockResolvedValue(dto);
		const handler = new FindSectionProgressForUserHandler(repository as never);

		await expect(
			handler.execute({ sectionId: dto.sectionId, userId: dto.userId }),
		).resolves.toEqual(dto);
	});

	it('findForUser throws when not found', async () => {
		const repository = createReadRepositoryMock();
		repository.findForUser.mockResolvedValue(null);
		const handler = new FindSectionProgressForUserHandler(repository as never);

		await expect(
			handler.execute({ sectionId: dto.sectionId, userId: dto.userId }),
		).rejects.toBeInstanceOf(SectionProgressNotFoundException);
	});

	it('list maps options and where filters', async () => {
		const repository = createReadRepositoryMock();
		repository.list.mockResolvedValue([dto]);
		const handler = new ListSectionProgressHandler(repository as never);

		await expect(
			handler.execute({
				options: { page: 3, limit: 7 },
				where: { userId: dto.userId, learningPathId: dto.learningPathId },
			}),
		).resolves.toEqual([dto]);

		expect(repository.list).toHaveBeenCalledWith({
			options: { page: 3, limit: 7 },
			where: { userId: dto.userId, learningPathId: dto.learningPathId },
		});
	});
});