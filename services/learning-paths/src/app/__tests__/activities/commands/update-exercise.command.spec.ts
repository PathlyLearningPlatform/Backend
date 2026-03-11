import { UpdateExerciseHandler } from '../../../activities/commands/update-exercise.command';
import { ActivityNotFoundException } from '../../../common/exceptions/activity-not-found.exception';
import { ActivityType } from '@/domain/activities/value-objects/type.vo';
import { ExerciseDifficulty } from '@/domain/activities/exercises/value-objects';
import { mockActivityRepo, makeExercise, makeArticle, TEST_IDS } from '../../common';

describe('UpdateExerciseHandler', () => {
	it('updates an exercise and saves it', async () => {
		const exercise = makeExercise();
		const repo = mockActivityRepo({ load: jest.fn().mockResolvedValue(exercise) });
		const handler = new UpdateExerciseHandler(repo);

		const result = await handler.execute({
			where: { id: TEST_IDS.EXERCISE_ID },
			props: {
				name: 'Updated Exercise',
				difficulty: ExerciseDifficulty.HARD,
			},
		});

		expect(result.name).toBe('Updated Exercise');
		expect(result.difficulty).toBe(ExerciseDifficulty.HARD);
		expect(result.type).toBe(ActivityType.EXERCISE);
		expect(result.updatedAt).toBeInstanceOf(Date);
		expect(repo.save).toHaveBeenCalledTimes(1);
	});

	it('throws ActivityNotFoundException when not found', async () => {
		const repo = mockActivityRepo();
		const handler = new UpdateExerciseHandler(repo);

		await expect(
			handler.execute({ where: { id: TEST_IDS.EXERCISE_ID } }),
		).rejects.toThrow(ActivityNotFoundException);
	});

	it('throws ActivityNotFoundException when activity is not an Exercise', async () => {
		const article = makeArticle();
		const repo = mockActivityRepo({ load: jest.fn().mockResolvedValue(article) });
		const handler = new UpdateExerciseHandler(repo);

		await expect(
			handler.execute({ where: { id: TEST_IDS.ARTICLE_ID } }),
		).rejects.toThrow(ActivityNotFoundException);
	});
});
