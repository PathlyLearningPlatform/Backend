import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { AuthModule } from '../auth/auth.module';
import { exerciseHandlersProvider } from './handlers.provider';
import {
	ExerciseController,
	ExerciseProgressController,
	ExerciseSubmissionController,
} from './controllers';
import {
	PostgresExerciseRepository,
	PostgresExerciseProgressRepository,
	PostgresExerciseSubmissionRepository,
} from './repositories';
import { InMemoryEventBus } from '../common';

@Module({
	imports: [DbModule, AuthModule],
	controllers: [
		ExerciseController,
		ExerciseProgressController,
		ExerciseSubmissionController,
	],
	providers: [
		...exerciseHandlersProvider,
		PostgresExerciseRepository,
		PostgresExerciseProgressRepository,
		PostgresExerciseSubmissionRepository,
		InMemoryEventBus,
	],
	exports: [
		...exerciseHandlersProvider,
		PostgresExerciseRepository,
		PostgresExerciseProgressRepository,
		PostgresExerciseSubmissionRepository,
	],
})
export class ExercisesModule {}
