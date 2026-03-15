import { IQueryHandler } from '@/app/common';
import { UnitProgressDto } from '../dtos';
import { IUnitProgressReadRepository } from '../interfaces';
import { UnitProgressNotFoundException } from '../exceptions';

export type FindUnitProgressByIdQuery = {
	id: string;
};
export type FindUnitProgressByIdResult = UnitProgressDto;

export class FindUnitProgressByIdHandler
	implements
		IQueryHandler<FindUnitProgressByIdQuery, FindUnitProgressByIdResult>
{
	constructor(
		private readonly unitProgressReadRepository: IUnitProgressReadRepository,
	) {}

	async execute(query: FindUnitProgressByIdQuery): Promise<UnitProgressDto> {
		const unitProgress = await this.unitProgressReadRepository.findById(
			query.id,
		);

		if (!unitProgress) {
			throw new UnitProgressNotFoundException(query.id);
		}

		return unitProgress;
	}
}
