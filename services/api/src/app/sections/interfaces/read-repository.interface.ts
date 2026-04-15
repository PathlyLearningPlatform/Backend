import type { OffsetPagination } from '@/app/common';
import type {
	ListSectionProgressDto,
	SectionDto,
	SectionProgressDto,
} from '../dtos';

type SectionFilter = {
	options?: OffsetPagination;
	where?: {
		learningPathId?: string;
	};
};

export interface ISectionReadRepository {
	list(filter?: SectionFilter): Promise<SectionDto[]>;
	findById(id: string): Promise<SectionDto | null>;
}

export interface ISectionProgressReadRepository {
	list(dto?: ListSectionProgressDto): Promise<SectionProgressDto[]>;

	findOneForUser(
		sectionId: string,
		userId: string,
	): Promise<SectionProgressDto | null>;
}
