import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { AuthModule } from '../auth/auth.module';
import { LessonsModule } from '../lessons/lessons.module';
import { ActivitiesModule } from '../activities/activities.module';
import { exerciseHandlersProvider } from './handlers.provider';
import { ExercisesController } from './exercises.controller';

@Module({
	imports: [DbModule, AuthModule, LessonsModule, ActivitiesModule],
	controllers: [ExercisesController],
	providers: [...exerciseHandlersProvider],
	exports: [...exerciseHandlersProvider],
})
export class ExercisesModule {}
