import { IQueryHandler } from '@/app/common';
import { SectionProgressDto } from '../dtos';
import { ISectionProgressReadRepository } from '../interfaces';
import { SectionProgressNotFoundException } from '../exceptions';

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
			await this.sectionProgressReadRepository.findForUser(
				query.sectionId,
				query.userId,
			);

		if (!sectionProgress) {
			throw new SectionProgressNotFoundException('');
		}

		return sectionProgress;
	}
}
