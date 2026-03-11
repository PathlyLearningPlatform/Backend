import { CreateLearningPathHandler } from '../../../learning-paths/commands/create.command';
import { mockLearningPathRepo } from '../../common';

describe('CreateLearningPathHandler', () => {
	it('creates a learning path and saves it', async () => {
		const repo = mockLearningPathRepo();
		const handler = new CreateLearningPathHandler(repo);

		const result = await handler.execute({
			name: 'My Path',
			description: 'A description',
		});

		expect(result.name).toBe('My Path');
		expect(result.description).toBe('A description');
		expect(result.sectionCount).toBe(0);
		expect(result.updatedAt).toBeNull();
		expect(result.id).toBeDefined();
		expect(result.createdAt).toBeInstanceOf(Date);
		expect(repo.save).toHaveBeenCalledTimes(1);
	});

	it('sets description to null when not provided', async () => {
		const repo = mockLearningPathRepo();
		const handler = new CreateLearningPathHandler(repo);

		const result = await handler.execute({ name: 'My Path' });

		expect(result.description).toBeNull();
	});
});
