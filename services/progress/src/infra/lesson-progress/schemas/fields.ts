import z from 'zod';
import { LessonProgressConstraints } from '../enums';

export const userIdSchema = z.uuid();
export const lessonIdSchema = z.uuid();
export const completedAtSchema = z.iso.datetime();
export const lessonProgressIdSchema = z.uuid();
export const limitSchema = z
	.int32()
	.min(LessonProgressConstraints.MIN_LIMIT)
	.max(LessonProgressConstraints.MAX_LIMIT)
	.default(LessonProgressConstraints.DEFAULT_LIMIT);
export const pageSchema = z
	.int32()
	.nonnegative()
	.default(LessonProgressConstraints.DEFAULT_PAGE);
