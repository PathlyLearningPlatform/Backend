import { ListSectionProgressDto, SectionProgressDto } from '../dtos';

export interface ISectionProgressReadRepository {
	list(dto?: ListSectionProgressDto): Promise<SectionProgressDto[]>;

	findById(id: string): Promise<SectionProgressDto | null>;

	findForUser(
		sectionId: string,
		userId: string,
	): Promise<SectionProgressDto | null>;
}
