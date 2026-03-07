import { IQueryHandler, OffsetPagination } from '@/app/common';
import { ISectionReadRepository } from '../interfaces';
import { SectionDto } from '../dtos';

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
	constructor(private readonly sectionReadRepository: ISectionReadRepository) {}

	async execute(query: ListSectionsQuery): Promise<ListSectionsResult> {
		const sections = await this.sectionReadRepository.list({
			where: {
				learningPathId: query.where?.learningPathId,
			},
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
		});

		return sections;
	}
}
