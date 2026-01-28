import type { Lesson } from '@domain/lessons/entities';
import type {
	CreateLessonCommand,
	FindLessonsCommand,
	FindOneLessonCommand,
	RemoveLessonCommand,
	UpdateLessonCommand,
} from '../commands';

export interface ILessonsRepository {
	find(command: FindLessonsCommand): Promise<Lesson[]>;

	findOne(command: FindOneLessonCommand): Promise<Lesson | null>;

	create(command: CreateLessonCommand): Promise<Lesson>;

	update(command: UpdateLessonCommand): Promise<Lesson | null>;

	remove(command: RemoveLessonCommand): Promise<Lesson | null>;
}
