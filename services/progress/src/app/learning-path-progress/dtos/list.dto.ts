import { OffsetPagination } from '@/app/common';

export type ListLearningPathProgressDto = {
	options?: OffsetPagination;
	where?: Partial<{
		userId: string;
	}>;
};
