import { OffsetPagination } from '@/app/common';
import { LearningPathDto } from '../dtos';

type LearningPathFilter = {
	options?: OffsetPagination;
	where?: {};
};

export interface ILearningPathReadRepository {
	list(filter?: LearningPathFilter): Promise<LearningPathDto[]>;
	findById(id: string): Promise<LearningPathDto | null>;
}
