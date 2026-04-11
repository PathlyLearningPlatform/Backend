import type { IQueryHandler } from "@/app/common";
import type { SectionProgressDto } from "../dtos";
import { SectionProgressNotFoundException } from "../exceptions";
import type { ISectionProgressReadRepository } from "../interfaces";

export type FindSectionProgressForUserQuery = {
	sectionId: string;
	userId: string;
};
export type FindSectionProgressForUserResult = SectionProgressDto;

export class FindSectionProgressForUserHandler
	implements
		IQueryHandler<
			FindSectionProgressForUserQuery,
			FindSectionProgressForUserResult
		>
{
	constructor(
		private readonly sectionProgressReadRepository: ISectionProgressReadRepository,
	) {}

	async execute(
		query: FindSectionProgressForUserQuery,
	): Promise<SectionProgressDto> {
		const sectionProgress =
			await this.sectionProgressReadRepository.findOneForUser(
				query.sectionId,
				query.userId,
			);

		if (!sectionProgress) {
			throw new SectionProgressNotFoundException("");
		}

		return sectionProgress;
	}
}
