import type { LessonUpdateProps } from '@/domain/lessons/entities';

export type UpdateLessonCommand = {
	where: {
		id: string;
	};
	fields?: LessonUpdateProps;
};
