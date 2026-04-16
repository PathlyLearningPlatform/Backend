import type { IQueryHandler, OffsetPagination } from '@/app/common';
import type { UnitDto } from '../dtos';
import { IUnitRepository } from '@/domain/units';
import { aggregateToDto } from '../helpers';

type ListUnitsQuery = {
	where?: {
		sectionId?: string;
	};
	options?: OffsetPagination;
};
type ListUnitsResult = UnitDto[];

export class ListUnitsHandler
	implements IQueryHandler<ListUnitsQuery, ListUnitsResult>
{
	constructor(private readonly unitRepository: IUnitRepository) {}

	async execute(query: ListUnitsQuery): Promise<ListUnitsResult> {
		const units = await this.unitRepository.list({
			where: {
				sectionId: query.where?.sectionId,
			},
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
		});

		return units.map(aggregateToDto);
	}
}
