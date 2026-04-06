import { type IQueryHandler, UnitNotFoundException } from "@/app/common";
import type { UnitDto } from "../dtos";
import type { IUnitReadRepository } from "../interfaces";

type FindUnitByIdQuery = {
	where: {
		id: string;
	};
};
type FindUnitByIdResult = UnitDto;

export class FindUnitByIdHandler
	implements IQueryHandler<FindUnitByIdQuery, FindUnitByIdResult>
{
	constructor(private readonly unitReadRepository: IUnitReadRepository) {}

	async execute(query: FindUnitByIdQuery): Promise<FindUnitByIdResult> {
		const unit = await this.unitReadRepository.findById(query.where.id);

		if (!unit) {
			throw new UnitNotFoundException(query.where.id);
		}

		return unit;
	}
}
