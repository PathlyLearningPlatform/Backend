import type { IQueryHandler } from "@/app/common";
import type { UnitProgressDto } from "../dtos";
import { UnitProgressNotFoundException } from "../exceptions";
import type { IUnitProgressReadRepository } from "../interfaces";

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
		const unitProgress = await this.unitProgressReadRepository.findOneForUser(
			query.unitId,
			query.userId,
		);

		if (!unitProgress) {
			throw new UnitProgressNotFoundException("");
		}

		return unitProgress;
	}
}
