import { Module } from '@nestjs/common';
import { GrpcLessonProgressController } from './grpc.controller';
import { PostgresLessonProgressRepository } from './postgres.repository';
import { LearningPathsModule } from '@infra/common/modules/learning-paths/learning-paths.module';
import { lessonProgressUseCasesProvider } from './use-cases.provider';
import { DbModule } from '@infra/common/modules/db/db.module';

@Module({
	imports: [DbModule, LearningPathsModule],
	controllers: [GrpcLessonProgressController],
	providers: [
		PostgresLessonProgressRepository,
		...lessonProgressUseCasesProvider,
	],
	exports: [
		PostgresLessonProgressRepository,
		...lessonProgressUseCasesProvider,
	],
})
export class LessonProgressModule {}
