import type { OffsetPagination } from "@/app/common";

export type ListSectionProgressDto = {
	options?: OffsetPagination;
	where?: Partial<{
		userId: string;
		learningPathId: string;
	}>;
};
