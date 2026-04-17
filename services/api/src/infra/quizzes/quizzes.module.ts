import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { AuthModule } from '../auth/auth.module';
import { LessonsModule } from '../lessons/lessons.module';
import { ActivitiesModule } from '../activities/activities.module';
import { quizHandlersProvider } from './handlers.provider';
import { QuizzesController } from './quizzes.controller';

@Module({
	imports: [DbModule, AuthModule, LessonsModule, ActivitiesModule],
	controllers: [QuizzesController],
	providers: [...quizHandlersProvider],
	exports: [...quizHandlersProvider],
})
export class QuizzesModule {}
