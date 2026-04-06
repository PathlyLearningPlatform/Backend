import { type IQueryHandler, LessonNotFoundException } from "@/app/common";
import type { LessonDto } from "../dtos";
import type { ILessonReadRepository } from "../interfaces";

type FindLessonByIdQuery = {
	where: {
		id: string;
	};
};
type FindLessonByIdResult = LessonDto;

export class FindLessonByIdHandler
	implements IQueryHandler<FindLessonByIdQuery, FindLessonByIdResult>
{
	constructor(private readonly lessonReadRepository: ILessonReadRepository) {}

	async execute(query: FindLessonByIdQuery): Promise<FindLessonByIdResult> {
		const lesson = await this.lessonReadRepository.findById(query.where.id);

		if (!lesson) {
			throw new LessonNotFoundException(query.where.id);
		}

		return lesson;
	}
}
