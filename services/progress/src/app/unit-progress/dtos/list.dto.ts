import { OffsetPagination } from '@/app/common';

export type ListUnitProgressDto = {
	options?: OffsetPagination;
	where?: Partial<{
		userId: string;
		sectionId: string;
	}>;
};
