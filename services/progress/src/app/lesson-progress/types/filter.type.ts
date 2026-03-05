import { OffsetPagination } from '@/app/common/types';

export type LessonProgressFilter = {
	options?: OffsetPagination;
	where?: {
		userId?: string;
	};
};
