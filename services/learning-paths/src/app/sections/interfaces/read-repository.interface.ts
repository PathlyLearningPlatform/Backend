import { OffsetPagination } from '@/app/common';
import { SectionDto } from '../dtos';

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
