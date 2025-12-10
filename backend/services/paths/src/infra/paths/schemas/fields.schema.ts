import { z } from 'zod';
import { PathConstraints } from '@/domain/paths/enums';

export const descriptionSchema = z
	.string()
	.max(PathConstraints.MAX_DESCRIPTION_LENGTH)
	.nullable();
export const nameSchema = z.string().max(PathConstraints.MAX_NAME_LENGTH);
