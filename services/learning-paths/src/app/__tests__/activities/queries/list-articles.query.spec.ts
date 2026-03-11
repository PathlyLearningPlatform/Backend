import { ListArticlesHandler } from '../../../activities/queries/list-articles.query';
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

describe('ListArticlesHandler', () => {
	it('returns a list of articles', async () => {
		const dtos = [sampleDto];
		const repo = mockActivityReadRepo({
			listArticles: jest.fn().mockResolvedValue(dtos),
		});
		const handler = new ListArticlesHandler(repo);

		const result = await handler.execute({});

		expect(result).toEqual(dtos);
	});

	it('passes filter and pagination to the repository', async () => {
		const repo = mockActivityReadRepo({
			listArticles: jest.fn().mockResolvedValue([]),
		});
		const handler = new ListArticlesHandler(repo);

		await handler.execute({
			where: { lessonId: TEST_IDS.LESSON_ID },
			options: { limit: 10, page: 2 },
		});

		expect(repo.listArticles).toHaveBeenCalledWith({
			where: { lessonId: TEST_IDS.LESSON_ID },
			options: { limit: 10, page: 2 },
		});
	});
});
