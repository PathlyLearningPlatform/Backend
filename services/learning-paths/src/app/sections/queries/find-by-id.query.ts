import { IQueryHandler, SectionNotFoundException } from '@/app/common';
import { ISectionReadRepository } from '../interfaces';
import { SectionDto } from '../dtos';

type FindSectionByIdQuery = {
	where: {
		id: string;
	};
};
type FindSectionByIdResult = SectionDto;

export class FindSectionByIdHandler
	implements IQueryHandler<FindSectionByIdQuery, FindSectionByIdResult>
{
	constructor(private readonly sectionReadRepository: ISectionReadRepository) {}

	async execute(query: FindSectionByIdQuery): Promise<FindSectionByIdResult> {
		const section = await this.sectionReadRepository.findById(query.where.id);

		if (!section) {
			throw new SectionNotFoundException(query.where.id);
		}

		return section;
	}
}
