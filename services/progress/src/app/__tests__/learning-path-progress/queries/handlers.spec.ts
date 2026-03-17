import {
	FindLearningPathProgressByIdHandler,
	FindLearningPathProgressForUserHandler,
	ListLearningPathProgressHandler,
} from '@/app/learning-path-progress/queries';
import { LearningPathProgressNotFoundException } from '@/app/learning-path-progress/exceptions';
import { APP_TEST_IDS, createReadRepositoryMock } from '../../common/test.utils';

const dto = {
	id: APP_TEST_IDS.learningPathProgressId,
	learningPathId: APP_TEST_IDS.learningPathId,
	userId: APP_TEST_IDS.userId,
	completedAt: null,
	completedSectionCount: 1,
	totalSectionCount: 4,
};

describe('learning-path-progress queries', () => {
	it('findById returns dto', async () => {
		const repository = createReadRepositoryMock();
		repository.findById.mockResolvedValue(dto);
		const handler = new FindLearningPathProgressByIdHandler(repository as never);

		await expect(handler.execute({ id: dto.id })).resolves.toEqual(dto);
	});

	it('findById throws when not found', async () => {
		const repository = createReadRepositoryMock();
		repository.findById.mockResolvedValue(null);
		const handler = new FindLearningPathProgressByIdHandler(repository as never);

		await expect(handler.execute({ id: dto.id })).rejects.toBeInstanceOf(
			LearningPathProgressNotFoundException,
		);
	});

	it('findForUser returns dto', async () => {
		const repository = createReadRepositoryMock();
		repository.findForUser.mockResolvedValue(dto);
		const handler = new FindLearningPathProgressForUserHandler(
			repository as never,
		);

		await expect(
			handler.execute({
				learningPathId: dto.learningPathId,
				userId: dto.userId,
			}),
		).resolves.toEqual(dto);
	});

	it('findForUser throws when not found', async () => {
		const repository = createReadRepositoryMock();
		repository.findForUser.mockResolvedValue(null);
		const handler = new FindLearningPathProgressForUserHandler(
			repository as never,
		);

		await expect(
			handler.execute({
				learningPathId: dto.learningPathId,
				userId: dto.userId,
			}),
		).rejects.toBeInstanceOf(LearningPathProgressNotFoundException);
	});

	it('list maps options and where filters', async () => {
		const repository = createReadRepositoryMock();
		repository.list.mockResolvedValue([dto]);
		const handler = new ListLearningPathProgressHandler(repository as never);

		await expect(
			handler.execute({
				options: { page: 4, limit: 5 },
				where: { userId: dto.userId },
			}),
		).resolves.toEqual([dto]);

		expect(repository.list).toHaveBeenCalledWith({
			options: { page: 4, limit: 5 },
			where: { userId: dto.userId },
		});
	});
});