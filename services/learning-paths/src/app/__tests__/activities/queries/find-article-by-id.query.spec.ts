import { FindArticleByIdHandler } from '../../../activities/queries/find-article-by-id.query';
import { ActivityNotFoundException } from '../../../common/exceptions/activity-not-found.exception';
import { ArticleDto } from '../../../activities/dtos';
import { ActivityType } from '@/domain/activities/value-objects/type.vo';
import { mockActivityReadRepo, TEST_IDS, DEFAULT_DATE } from '../../common';

const sampleDto: ArticleDto = {
	id: TEST_IDS.ARTICLE_ID,
	lessonId: TEST_IDS.LESSON_ID,
	name: 'Test Article',
	description: null,
	createdAt: DEFAULT_DATE,
	updatedAt: null,
	type: ActivityType.ARTICLE,
	order: 0,
	ref: 'https://example.com/article',
};

describe('FindArticleByIdHandler', () => {
	it('returns the article when found', async () => {
		const repo = mockActivityReadRepo({
			findArticleById: jest.fn().mockResolvedValue(sampleDto),
		});
		const handler = new FindArticleByIdHandler(repo);

		const result = await handler.execute({ where: { id: TEST_IDS.ARTICLE_ID } });

		expect(result).toEqual(sampleDto);
		expect(repo.findArticleById).toHaveBeenCalledWith(TEST_IDS.ARTICLE_ID);
	});

	it('throws ActivityNotFoundException when not found', async () => {
		const repo = mockActivityReadRepo();
		const handler = new FindArticleByIdHandler(repo);

		await expect(
			handler.execute({ where: { id: TEST_IDS.ARTICLE_ID } }),
		).rejects.toThrow(ActivityNotFoundException);
	});
});
