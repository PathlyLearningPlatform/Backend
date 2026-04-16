import type { IQueryHandler, OffsetPagination } from '@/app/common';
import type { SectionDto } from '../dtos';
import { ISectionRepository } from '@/domain/sections';
import { aggregateToDto } from '../helpers';

type ListSectionsQuery = {
	where?: {
		learningPathId?: string;
	};
	options?: OffsetPagination;
};
type ListSectionsResult = SectionDto[];

export class ListSectionsHandler
	implements IQueryHandler<ListSectionsQuery, ListSectionsResult>
{
	constructor(private readonly sectionRepository: ISectionRepository) {}

	async execute(query: ListSectionsQuery): Promise<ListSectionsResult> {
		const sections = await this.sectionRepository.list({
			where: {
				learningPathId: query.where?.learningPathId,
			},
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
		});

		return sections.map(aggregateToDto);
	}
}
