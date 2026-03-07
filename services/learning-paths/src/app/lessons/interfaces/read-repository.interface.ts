import { OffsetPagination } from '@/app/common';
import { LessonDto } from '../dtos';

type LessonFilter = {
	options?: OffsetPagination;
	where?: {
		unitId?: string;
	};
};

export interface ILessonReadRepository {
	list(filter?: LessonFilter): Promise<LessonDto[]>;
	findById(id: string): Promise<LessonDto | null>;
}
