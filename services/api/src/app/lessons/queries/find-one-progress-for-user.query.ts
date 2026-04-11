import type { IQueryHandler } from "@/app/common";
import type { LessonProgressDto } from "../dtos";
import { LessonProgressNotFoundException } from "../exceptions";
import type { ILessonProgressReadRepository } from "../interfaces";

export type FindLessonProgressForUserQuery = {
	lessonId: string;
	userId: string;
};
export type FindLessonProgressForUserResult = LessonProgressDto;

export class FindLessonProgressForUserHandler
	implements
		IQueryHandler<
			FindLessonProgressForUserQuery,
			FindLessonProgressForUserResult
		>
{
	constructor(
		private readonly lessonProgressReadRepository: ILessonProgressReadRepository,
	) {}

	async execute(
		query: FindLessonProgressForUserQuery,
	): Promise<LessonProgressDto> {
		const lessonProgress =
			await this.lessonProgressReadRepository.findOneForUser(
				query.lessonId,
				query.userId,
			);

		if (!lessonProgress) {
			throw new LessonProgressNotFoundException("");
		}

		return lessonProgress;
	}
}
