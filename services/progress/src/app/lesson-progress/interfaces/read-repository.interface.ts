import { LessonProgressDto, ListLessonProgressDto } from '../dtos';

export interface ILessonProgressReadRepository {
	list(dto?: ListLessonProgressDto): Promise<LessonProgressDto[]>;

	findById(id: string): Promise<LessonProgressDto | null>;

	findForUser(
		lessonId: string,
		userId: string,
	): Promise<LessonProgressDto | null>;
}
