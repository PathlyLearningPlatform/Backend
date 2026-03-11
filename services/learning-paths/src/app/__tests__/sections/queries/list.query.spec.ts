import { ListSectionsHandler } from '../../../sections/queries/list.query';
import { SectionDto } from '../../../sections/dtos';
import { mockSectionReadRepo, TEST_IDS, DEFAULT_DATE } from '../../common';

const sampleDto: SectionDto = {
	id: TEST_IDS.SECTION_ID,
	learningPathId: TEST_IDS.LP_ID,
	name: 'Test Section',
	description: null,
	createdAt: DEFAULT_DATE,
	updatedAt: null,
	order: 0,
	unitCount: 0,
};

describe('ListSectionsHandler', () => {
	it('returns a list of sections', async () => {
		const dtos = [sampleDto];
		const repo = mockSectionReadRepo({
			list: jest.fn().mockResolvedValue(dtos),
		});
		const handler = new ListSectionsHandler(repo);

		const result = await handler.execute({});

		expect(result).toEqual(dtos);
	});

	it('passes filter and pagination to the repository', async () => {
		const repo = mockSectionReadRepo({
			list: jest.fn().mockResolvedValue([]),
		});
		const handler = new ListSectionsHandler(repo);

		await handler.execute({
			where: { learningPathId: '123' },
			options: { limit: 5, page: 1 },
		});

		expect(repo.list).toHaveBeenCalledWith({
			where: { learningPathId: '123' },
			options: { limit: 5, page: 1 },
		});
	});
});
