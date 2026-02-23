import z from 'zod';
import { ActivityProgressConstraints } from '../enums';

export const userIdSchema = z.uuid();
export const activityIdSchema = z.uuid();
export const completedAtSchema = z.iso.datetime();
export const idSchema = z.uuid();
export const limitSchema = z
	.int32()
	.min(ActivityProgressConstraints.MIN_LIMIT)
	.max(ActivityProgressConstraints.MAX_LIMIT)
	.default(ActivityProgressConstraints.DEFAULT_LIMIT);
export const pageSchema = z
	.int32()
	.nonnegative()
	.default(ActivityProgressConstraints.DEFAULT_PAGE);
