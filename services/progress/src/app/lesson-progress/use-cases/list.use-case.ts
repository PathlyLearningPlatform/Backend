import { LessonProgress } from '@/domain/lesson-progress/entities/lesson-progress.entity';
import { ListLessonProgressCommand } from '../commands';
import { ILessonProgressRepository } from '../interfaces';

export class ListLessonProgressUseCase {
	constructor(
		private readonly lessonProgressRepository: ILessonProgressRepository,
	) {}

	async execute(command: ListLessonProgressCommand): Promise<LessonProgress[]> {
		const result = await this.lessonProgressRepository.list({
			options: {
				limit: command.options?.limit,
				page: command.options?.page,
			},
			where: {
				userId: command.where?.userId,
			},
		});

		return result;
	}
}
