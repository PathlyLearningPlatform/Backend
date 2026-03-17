import {
	FindLessonProgressByIdHandler,
	FindLessonProgressForUserHandler,
	ListLessonProgressHandler,
} from '@/app/lesson-progress/queries';
import { LessonProgressNotFoundException } from '@/app/lesson-progress/exceptions';
import { APP_TEST_IDS, createReadRepositoryMock } from '../../common/test.utils';

const dto = {
	id: APP_TEST_IDS.lessonProgressId,
	lessonId: APP_TEST_IDS.lessonId,
	unitId: APP_TEST_IDS.unitId,
	userId: APP_TEST_IDS.userId,
	completedAt: null,
	completedActivityCount: 1,
	totalActivityCount: 5,
};

describe('lesson-progress queries', () => {
	it('findById returns dto', async () => {
		const repository = createReadRepositoryMock();
		repository.findById.mockResolvedValue(dto);
		const handler = new FindLessonProgressByIdHandler(repository as never);

		await expect(handler.execute({ id: dto.id })).resolves.toEqual(dto);
	});

	it('findById throws when not found', async () => {
		const repository = createReadRepositoryMock();
		repository.findById.mockResolvedValue(null);
		const handler = new FindLessonProgressByIdHandler(repository as never);

		await expect(handler.execute({ id: dto.id })).rejects.toBeInstanceOf(
			LessonProgressNotFoundException,
		);
	});

	it('findForUser returns dto', async () => {
		const repository = createReadRepositoryMock();
		repository.findForUser.mockResolvedValue(dto);
		const handler = new FindLessonProgressForUserHandler(repository as never);

		await expect(
			handler.execute({ lessonId: dto.lessonId, userId: dto.userId }),
		).resolves.toEqual(dto);
	});

	it('findForUser throws when not found', async () => {
		const repository = createReadRepositoryMock();
		repository.findForUser.mockResolvedValue(null);
		const handler = new FindLessonProgressForUserHandler(repository as never);

		await expect(
			handler.execute({ lessonId: dto.lessonId, userId: dto.userId }),
		).rejects.toBeInstanceOf(LessonProgressNotFoundException);
	});

	it('list maps options and where filters', async () => {
		const repository = createReadRepositoryMock();
		repository.list.mockResolvedValue([dto]);
		const handler = new ListLessonProgressHandler(repository as never);

		await expect(
			handler.execute({
				options: { page: 1, limit: 20 },
				where: { userId: dto.userId, unitId: dto.unitId },
			}),
		).resolves.toEqual([dto]);

		expect(repository.list).toHaveBeenCalledWith({
			options: { page: 1, limit: 20 },
			where: { userId: dto.userId, unitId: dto.unitId },
		});
	});
});