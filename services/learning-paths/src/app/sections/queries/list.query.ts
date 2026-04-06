import type { IQueryHandler, OffsetPagination } from "@/app/common";
import type { SectionDto } from "../dtos";
import type { ISectionReadRepository } from "../interfaces";

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
