import type { OffsetPagination } from "@/app/common";
import type {
	LessonDto,
	LessonProgressDto,
	ListLessonProgressDto,
} from "../dtos";

type LessonFilter = {
	options?: OffsetPagination;
	where?: {
		unitId?: string;
	};
};

export interface ILessonReadRepository {
	list(filter?: LessonFilter): Promise<LessonDto[]>;
	findById(id: string): Promise<LessonDto | null>;
}

export interface ILessonProgressReadRepository {
	list(dto?: ListLessonProgressDto): Promise<LessonProgressDto[]>;

	findById(id: string): Promise<LessonProgressDto | null>;

	findOneForUser(
		lessonId: string,
		userId: string,
	): Promise<LessonProgressDto | null>;
}
