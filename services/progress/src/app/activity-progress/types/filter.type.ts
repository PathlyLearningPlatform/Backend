import { OffsetPagination } from '@/app/types';

export type ActivityProgressFilter = {
	options?: OffsetPagination;
	fields?: {
		userId?: string;
	};
};
