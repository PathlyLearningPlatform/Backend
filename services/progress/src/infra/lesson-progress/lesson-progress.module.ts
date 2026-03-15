import { Module } from '@nestjs/common';
import { GrpcLessonProgressController } from './grpc.controller';
import { PostgresLessonProgressRepository } from './postgres.repository';
import { DbModule } from '@infra/common/db/db.module';
import { PostgresLessonProgressReadRepository } from './postgres-read.repository';
import { InMemoryEventBus, LearningPathsModule } from '../common';

@Module({
	imports: [DbModule, LearningPathsModule],
	controllers: [GrpcLessonProgressController],
	providers: [
		InMemoryEventBus,
		PostgresLessonProgressRepository,
		PostgresLessonProgressReadRepository,
	],
	exports: [
		PostgresLessonProgressRepository,
		PostgresLessonProgressReadRepository,
	],
})
export class LessonProgressModule {}
