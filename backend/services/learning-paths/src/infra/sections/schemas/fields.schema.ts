import { z } from 'zod';
import { SectionConstraints } from '@/domain/sections/enums';

export const descriptionSchema = z
	.string()
	.max(SectionConstraints.MAX_DESCRIPTION_LENGTH)
	.nullable();
export const nameSchema = z.string().max(SectionConstraints.MAX_NAME_LENGTH);
export const orderSchema = z.int32().nonnegative();
export const learningPathIdSchema = z.uuid();
