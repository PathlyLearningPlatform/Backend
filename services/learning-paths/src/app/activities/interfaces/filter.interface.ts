import type { OffsetPagination } from "@/app/common";

export type ActivityFilter = {
	options?: OffsetPagination;
	where?: Partial<{
		lessonId: string;
	}>;
};
