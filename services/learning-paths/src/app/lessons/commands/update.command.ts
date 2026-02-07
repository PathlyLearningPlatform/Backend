import type { LessonUpdateFields } from '@/domain/lessons/entities';

export type UpdateLessonCommand = {
	where: {
		id: string;
	};
	fields?: LessonUpdateFields;
};
