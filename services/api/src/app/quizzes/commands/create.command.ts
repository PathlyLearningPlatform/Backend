import { randomUUID } from 'node:crypto';
import type { QuizWithoutQuestionsDto } from '../dtos';
import { type ICommandHandler, LessonNotFoundException } from '@/app/common';
import { Quiz } from '@/domain/quizzes/quiz.aggregate';
import {
	ActivityDescription,
	ActivityName,
	ActivityType,
} from '@/domain/activities/value-objects';
import { ActivityId } from '@/domain/activities/value-objects/id.vo';
import { LessonId } from '@/domain/lessons/value-objects/id.vo';
import { IQuizRepository } from '@/domain/quizzes/repositories';
import { Order } from '@/domain/common';
import { aggregateToPreviewDto } from '../helpers';

type CreateQuizCommand = {
	name: string;
	description?: string | null;
};

export class CreateQuizHandler
	implements ICommandHandler<CreateQuizCommand, QuizWithoutQuestionsDto>
{
	constructor(private readonly quizRepository: IQuizRepository) {}

	async execute(command: CreateQuizCommand): Promise<QuizWithoutQuestionsDto> {
		const quizId = ActivityId.create(randomUUID());

		const quiz = Quiz.create(quizId, {
			createdAt: new Date(),
			lessonId: LessonId.create('00000000-0000-0000-0000-000000000000'),
			name: ActivityName.create(command.name),
			order: Order.create(0),
			description: command.description
				? ActivityDescription.create(command.description)
				: null,
		});

		await this.quizRepository.save(quiz);

		return aggregateToPreviewDto(quiz);
	}
}
