import { z } from 'zod';

export const descriptionSchema = z.string().max(500).nullable();
export const nameSchema = z.string().max(255);
export const orderSchema = z.int32().nonnegative();
export const sectionIdSchema = z.uuid();
