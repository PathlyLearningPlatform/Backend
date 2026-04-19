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
import type { ILessonRepository } from '@/domain/lessons/repositories';
import { LessonId } from '@/domain/lessons/value-objects/id.vo';
import { IQuizRepository } from '@/domain/quizzes/repositories';

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
		private readonly quizRepository: IQuizRepository,
	) {}

	async execute(command: AddQuizCommand): Promise<AddQuizResult> {
		const lessonId = LessonId.create(command.lessonId);
		const lesson = await this.lessonRepository.findById(lessonId);

		if (!lesson) {
			throw new LessonNotFoundException(lessonId.value);
		}

		const quizId = ActivityId.create(randomUUID());
		const activityRef = lesson.addActivity(quizId);

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

		await this.quizRepository.save(quiz);
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
