import { OffsetPagination } from '@/app/common';

export type ListLessonProgressDto = {
	options?: OffsetPagination;
	where?: Partial<{
		userId: string;
		unitId: string;
	}>;
};
