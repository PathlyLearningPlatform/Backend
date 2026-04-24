import { ExerciseDifficulty } from '@/domain/exercises';
import z from 'zod';

export const difficultySchema = z.enum(ExerciseDifficulty);
