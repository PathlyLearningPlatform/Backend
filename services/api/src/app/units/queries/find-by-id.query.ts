import { type IQueryHandler, UnitNotFoundException } from '@/app/common';
import type { UnitDto } from '../dtos';
import { IUnitRepository, UnitId } from '@/domain/units';
import { aggregateToDto } from '../helpers';

type FindUnitByIdQuery = {
	where: {
		id: string;
	};
};
type FindUnitByIdResult = UnitDto;

export class FindUnitByIdHandler
	implements IQueryHandler<FindUnitByIdQuery, FindUnitByIdResult>
{
	constructor(private readonly unitRepository: IUnitRepository) {}

	async execute(query: FindUnitByIdQuery): Promise<FindUnitByIdResult> {
		const unitId = UnitId.create(query.where.id);
		const unit = await this.unitRepository.findById(unitId);

		if (!unit) {
			throw new UnitNotFoundException(query.where.id);
		}

		return aggregateToDto(unit);
	}
}
