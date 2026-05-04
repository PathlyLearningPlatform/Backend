import { IQueryHandler, UnitNotFoundException } from '@/app/common';
import { UnitDto } from '../dtos';
import { IUnitRepository, UnitId } from '@/domain/units';
import { Order } from '@/domain/common';
import { aggregateToDto } from '../helpers';

export type FindNextUnitQuery = {
	id: string;
};

export class FindNextUnitHandler
	implements IQueryHandler<FindNextUnitQuery, UnitDto>
{
	constructor(private readonly unitRepository: IUnitRepository) {}

	async execute(command: FindNextUnitQuery): Promise<UnitDto> {
		const id = UnitId.create(command.id);
		const unit = await this.unitRepository.findById(id);

		if (!unit) {
			throw new UnitNotFoundException(command.id);
		}

		const nextOrder = Order.create(unit.order.value + 1);
		const next = await this.unitRepository.findBySectionIdAndOrder(
			unit.sectionId,
			nextOrder,
		);

		if (!next) {
			throw new UnitNotFoundException('');
		}

		return aggregateToDto(next);
	}
}
