import { IQueryHandler } from '@/app/common';
import { UnitProgressDto } from '../dtos';
import { IUnitProgressReadRepository } from '../interfaces';
import { UnitProgressNotFoundException } from '../exceptions';

export type FindUnitProgressForUserQuery = {
	unitId: string;
	userId: string;
};
export type FindUnitProgressForUserResult = UnitProgressDto;

export class FindUnitProgressForUserHandler
	implements
		IQueryHandler<FindUnitProgressForUserQuery, FindUnitProgressForUserResult>
{
	constructor(
		private readonly unitProgressReadRepository: IUnitProgressReadRepository,
	) {}

	async execute(query: FindUnitProgressForUserQuery): Promise<UnitProgressDto> {
		const unitProgress = await this.unitProgressReadRepository.findForUser(
			query.unitId,
			query.userId,
		);

		if (!unitProgress) {
			throw new UnitProgressNotFoundException('');
		}

		return unitProgress;
	}
}
