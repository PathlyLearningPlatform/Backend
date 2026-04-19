import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { AuthModule } from '../auth/auth.module';
import { LessonsModule } from '../lessons/lessons.module';
import { quizHandlersProvider } from './handlers.provider';
import { QuizzesController } from './quizzes.controller';
import { PostgresQuizRepository } from './postgres.repository';
import { QuizAttemptsController } from './attempts.controller';
import { PostgresQuizAttemptRepository } from './postgres-attempt.repository';

@Module({
	imports: [DbModule, AuthModule, LessonsModule],
	controllers: [QuizzesController, QuizAttemptsController],
	providers: [
		...quizHandlersProvider,
		PostgresQuizRepository,
		PostgresQuizAttemptRepository,
	],
	exports: [
		...quizHandlersProvider,
		PostgresQuizRepository,
		PostgresQuizAttemptRepository,
	],
})
export class QuizzesModule {}
