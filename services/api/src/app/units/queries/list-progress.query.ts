import type { IQueryHandler, OffsetPagination } from "@/app/common";
import type { UnitProgressDto } from "../dtos";
import type { IUnitProgressReadRepository } from "../interfaces";

export type ListUnitProgressQuery = {
	options?: OffsetPagination;
	where?: Partial<{
		userId: string;
		sectionId: string;
	}>;
};
export type ListUnitProgressResult = UnitProgressDto[];

export class ListUnitProgressHandler
	implements IQueryHandler<ListUnitProgressQuery, ListUnitProgressResult>
{
	constructor(
		private readonly unitProgressReadRepository: IUnitProgressReadRepository,
	) {}

	async execute(query: ListUnitProgressQuery): Promise<ListUnitProgressResult> {
		const unitProgress = await this.unitProgressReadRepository.list({
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
			where: {
				sectionId: query.where?.sectionId,
				userId: query.where?.userId,
			},
		});

		return unitProgress;
	}
}
