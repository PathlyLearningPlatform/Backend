import { IQueryHandler, UnitNotFoundException } from '@/app/common';
import { UnitDto } from '../dtos';
import { IUnitRepository, UnitId } from '@/domain/units';
import { Order } from '@/domain/common';
import { aggregateToDto } from '../helpers';

export type FindPreviousUnitQuery = {
	id: string;
};

export class FindPreviousUnitHandler
	implements IQueryHandler<FindPreviousUnitQuery, UnitDto>
{
	constructor(private readonly unitRepository: IUnitRepository) {}

	async execute(command: FindPreviousUnitQuery): Promise<UnitDto> {
		const id = UnitId.create(command.id);
		const unit = await this.unitRepository.findById(id);

		if (!unit) {
			throw new UnitNotFoundException(command.id);
		}

		const previousOrder = Order.create(unit.order.value - 1);
		const previous = await this.unitRepository.findBySectionIdAndOrder(
			unit.sectionId,
			previousOrder,
		);

		if (!previous) {
			throw new UnitNotFoundException('');
		}

		return aggregateToDto(previous);
	}
}
