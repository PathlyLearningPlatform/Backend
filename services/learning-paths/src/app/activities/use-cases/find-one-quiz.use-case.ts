import type { Quiz } from '@/domain/activities/entities';
import { ActivityNotFoundException } from '@/domain/activities/exceptions';
import type { IActivitiesRepository } from '../interfaces';

export class FindOneQuizUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(activityId: string): Promise<Quiz> {
		const quiz = await this.activitiesRepository.findOneQuiz(activityId);

		if (!quiz) {
			throw new ActivityNotFoundException(activityId);
		}

		return quiz;
	}
}
