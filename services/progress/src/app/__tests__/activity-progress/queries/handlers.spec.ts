import {
	FindActivityProgressByIdHandler,
	FindActivityProgressForUserHandler,
	ListActivityProgressHandler,
} from '@/app/activity-progress/queries';
import { ActivityProgressNotFoundException } from '@/app/activity-progress/exceptions';
import { APP_TEST_IDS, createReadRepositoryMock } from '../../common/test.utils';

const dto = {
	id: APP_TEST_IDS.activityProgressId,
	activityId: APP_TEST_IDS.activityId,
	lessonId: APP_TEST_IDS.lessonId,
	userId: APP_TEST_IDS.userId,
	completedAt: new Date('2026-01-01T00:00:00.000Z'),
};

describe('activity-progress queries', () => {
	it('findById returns dto', async () => {
		const repository = createReadRepositoryMock();
		repository.findById.mockResolvedValue(dto);
		const handler = new FindActivityProgressByIdHandler(repository as never);

		await expect(handler.execute({ id: dto.id })).resolves.toEqual(dto);
	});

	it('findById throws when not found', async () => {
		const repository = createReadRepositoryMock();
		repository.findById.mockResolvedValue(null);
		const handler = new FindActivityProgressByIdHandler(repository as never);

		await expect(handler.execute({ id: dto.id })).rejects.toBeInstanceOf(
			ActivityProgressNotFoundException,
		);
	});

	it('findForUser returns dto', async () => {
		const repository = createReadRepositoryMock();
		repository.findForUser.mockResolvedValue(dto);
		const handler = new FindActivityProgressForUserHandler(repository as never);

		await expect(
			handler.execute({ activityId: dto.activityId, userId: dto.userId }),
		).resolves.toEqual(dto);
	});

	it('findForUser throws when not found', async () => {
		const repository = createReadRepositoryMock();
		repository.findForUser.mockResolvedValue(null);
		const handler = new FindActivityProgressForUserHandler(repository as never);

		await expect(
			handler.execute({ activityId: dto.activityId, userId: dto.userId }),
		).rejects.toBeInstanceOf(ActivityProgressNotFoundException);
	});

	it('list maps query options/filters and returns list', async () => {
		const repository = createReadRepositoryMock();
		repository.list.mockResolvedValue([dto]);
		const handler = new ListActivityProgressHandler(repository as never);

		await expect(
			handler.execute({
				options: { page: 2, limit: 10 },
				where: { userId: dto.userId, lessonId: dto.lessonId },
			}),
		).resolves.toEqual([dto]);

		expect(repository.list).toHaveBeenCalledWith({
			options: { page: 2, limit: 10 },
			where: { userId: dto.userId, lessonId: dto.lessonId },
		});
	});
});