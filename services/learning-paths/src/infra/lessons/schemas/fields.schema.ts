import { z } from 'zod';
import { UnitConstraints } from '@/domain/units/enums';

export const descriptionSchema = z
	.string()
	.max(UnitConstraints.MAX_DESCRIPTION_LENGTH)
	.nullable();
export const nameSchema = z.string().max(UnitConstraints.MAX_NAME_LENGTH);
export const orderSchema = z.int32().nonnegative();
export const unitIdSchema = z.uuid();
