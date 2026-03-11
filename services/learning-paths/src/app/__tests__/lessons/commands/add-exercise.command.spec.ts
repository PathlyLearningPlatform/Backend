import { AddExerciseHandler } from '../../../lessons/commands/add-exercise.command';
import { LessonNotFoundException } from '../../../common/exceptions/lesson-not-found.exception';
import { ActivityType } from '@/domain/activities/value-objects/type.vo';
import { ExerciseDifficulty } from '@/domain/activities/exercises/value-objects';
import { mockLessonRepo, mockActivityRepo, makeLesson, TEST_IDS } from '../../common';

describe('AddExerciseHandler', () => {
	it('adds an exercise to a lesson', async () => {
		const lesson = makeLesson();
		const lessonRepo = mockLessonRepo({ load: jest.fn().mockResolvedValue(lesson) });
		const activityRepo = mockActivityRepo();
		const handler = new AddExerciseHandler(lessonRepo, activityRepo);

		const result = await handler.execute({
			lessonId: TEST_IDS.LESSON_ID,
			name: 'New Exercise',
			difficulty: ExerciseDifficulty.MEDIUM,
		});

		expect(result.name).toBe('New Exercise');
		expect(result.lessonId).toBe(TEST_IDS.LESSON_ID);
		expect(result.type).toBe(ActivityType.EXERCISE);
		expect(result.difficulty).toBe(ExerciseDifficulty.MEDIUM);
		expect(result.order).toBe(0);
		expect(activityRepo.save).toHaveBeenCalledTimes(1);
		expect(lessonRepo.save).toHaveBeenCalledTimes(1);
	});

	it('throws LessonNotFoundException when lesson not found', async () => {
		const lessonRepo = mockLessonRepo();
		const activityRepo = mockActivityRepo();
		const handler = new AddExerciseHandler(lessonRepo, activityRepo);

		await expect(
			handler.execute({
				lessonId: TEST_IDS.LESSON_ID,
				name: 'E',
				difficulty: ExerciseDifficulty.EASY,
			}),
		).rejects.toThrow(LessonNotFoundException);
	});
});
