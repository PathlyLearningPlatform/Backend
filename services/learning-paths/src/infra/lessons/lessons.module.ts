import { Module } from '@nestjs/common';
import { DbModule } from '@infra/common/db/db.module';
import { UnitsModule } from '../units/units.module';
import { GrpcLessonsController } from './grpc.controller';
import { PostgresLessonRepository } from './postgres.repository';
import { PostgresLessonReadRepository } from './postgres-read.repository';
import { lessonHandlersProvider } from './handlers.provider';

@Module({
	imports: [DbModule, UnitsModule],
	controllers: [GrpcLessonsController],
	providers: [
		PostgresLessonRepository,
		PostgresLessonReadRepository,
		...lessonHandlersProvider,
	],
	exports: [
		PostgresLessonRepository,
		PostgresLessonReadRepository,
		...lessonHandlersProvider,
	],
})
export class LessonsModule {}
