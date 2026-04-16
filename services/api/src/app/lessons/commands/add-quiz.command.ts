import { randomUUID } from 'node:crypto';
import type { QuizWithoutQuestionsDto } from '@/app/activities/dtos';
import { type ICommandHandler, LessonNotFoundException } from '@/app/common';
import { Quiz } from '@/domain/activities/quizzes/quiz.aggregate';
import type { IActivityRepository } from '@/domain/activities/repositories';
import {
	ActivityDescription,
	ActivityName,
	ActivityType,
} from '@/domain/activities/value-objects';
import { ActivityId } from '@/domain/activities/value-objects/id.vo';
import type { ILessonRepository } from '@/domain/lessons/repositories';
import { LessonId } from '@/domain/lessons/value-objects/id.vo';

type AddQuizCommand = {
	lessonId: string;
	name: string;
	description?: string | null;
};
type AddQuizResult = QuizWithoutQuestionsDto;

export class AddQuizHandler
	implements ICommandHandler<AddQuizCommand, AddQuizResult>
{
	constructor(
		private readonly lessonRepository: ILessonRepository,
		private readonly activityRepository: IActivityRepository,
	) {}

	async execute(command: AddQuizCommand): Promise<AddQuizResult> {
		const lessonId = LessonId.create(command.lessonId);
		const lesson = await this.lessonRepository.findById(lessonId);

		if (!lesson) {
			throw new LessonNotFoundException(lessonId.value);
		}

		const activityId = ActivityId.create(randomUUID());
		const activityRef = lesson.addActivity(activityId);

		const quiz = Quiz.create(activityRef.activityId, {
			createdAt: new Date(),
			lessonId,
			name: ActivityName.create(command.name),
			description:
				command.description != null
					? ActivityDescription.create(command.description)
					: null,
			order: activityRef.order,
		});

		lesson.update(new Date());

		await this.activityRepository.save(quiz);
		await this.lessonRepository.save(lesson);

		return {
			type: ActivityType.QUIZ,
			id: quiz.id.value,
			lessonId: quiz.lessonId.value,
			name: quiz.name.value,
			description: quiz.description?.value ?? null,
			createdAt: quiz.createdAt,
			updatedAt: quiz.updatedAt ?? null,
			order: quiz.order.value,
			questionCount: quiz.questionCount,
		};
	}
}
