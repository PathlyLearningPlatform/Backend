import type { OffsetPagination } from "@/app/common";

export type ListActivityProgressDto = {
	options?: OffsetPagination;
	where?: Partial<{
		userId: string;
		lessonId: string;
	}>;
};
