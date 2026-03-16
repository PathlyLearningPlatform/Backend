import { IQueryHandler, OffsetPagination } from '@/app/common';
import { SectionProgressDto } from '../dtos';
import { ISectionProgressReadRepository } from '../interfaces';

export type ListSectionProgressQuery = {
	options?: OffsetPagination;
	where?: Partial<{
		userId: string;
		learningPathId: string;
	}>;
};
export type ListSectionProgressResult = SectionProgressDto[];

export class ListSectionProgressHandler
	implements IQueryHandler<ListSectionProgressQuery, ListSectionProgressResult>
{
	constructor(
		private readonly sectionProgressReadRepository: ISectionProgressReadRepository,
	) {}

	async execute(
		query: ListSectionProgressQuery,
	): Promise<ListSectionProgressResult> {
		const sectionProgress = await this.sectionProgressReadRepository.list({
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
			where: {
				learningPathId: query.where?.learningPathId,
				userId: query.where?.userId,
			},
		});

		return sectionProgress;
	}
}
