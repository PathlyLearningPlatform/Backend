import type { IQueryHandler, OffsetPagination } from "@/app/common";
import type { UnitDto } from "../dtos";
import type { IUnitReadRepository } from "../interfaces";

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
	constructor(private readonly unitReadRepository: IUnitReadRepository) {}

	async execute(query: ListUnitsQuery): Promise<ListUnitsResult> {
		const units = await this.unitReadRepository.list({
			where: {
				sectionId: query.where?.sectionId,
			},
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
		});

		return units;
	}
}
