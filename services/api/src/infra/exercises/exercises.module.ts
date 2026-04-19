import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { AuthModule } from '../auth/auth.module';
import { LessonsModule } from '../lessons/lessons.module';
import { exerciseHandlersProvider } from './handlers.provider';
import { ExercisesController } from './exercises.controller';
import { PostgresExerciseRepository } from './postgres.repository';

@Module({
	imports: [DbModule, AuthModule, LessonsModule],
	controllers: [ExercisesController],
	providers: [...exerciseHandlersProvider, PostgresExerciseRepository],
	exports: [...exerciseHandlersProvider, PostgresExerciseRepository],
})
export class ExercisesModule {}
