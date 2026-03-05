import { OffsetPagination } from '@/app/common';

export type ActivityProgressFilter = {
	options?: OffsetPagination;
	fields?: {
		userId?: string;
	};
};
