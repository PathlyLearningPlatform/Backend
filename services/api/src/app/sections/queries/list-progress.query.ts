import type { IQueryHandler, OffsetPagination } from '@/app/common';
import type { SectionProgressDto } from '../dtos';
import { ISectionProgressRepository } from '@/domain/sections';
import { progressAggregateToDto } from '../helpers';

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
		private readonly sectionProgressRepository: ISectionProgressRepository,
	) {}

	async execute(
		query: ListSectionProgressQuery,
	): Promise<ListSectionProgressResult> {
		const sectionProgress = await this.sectionProgressRepository.list({
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
			where: {
				learningPathId: query.where?.learningPathId,
				userId: query.where?.userId,
			},
		});

		return sectionProgress.map(progressAggregateToDto);
	}
}
