import { Module } from '@nestjs/common';
import { DbModule } from '@infra/common/db/db.module';
import { LearningPathsModule } from '../learning-paths/learning-paths.module';
import { GrpcSectionsController } from './grpc.controller';
import { PostgresSectionRepository } from './postgres.repository';
import { PostgresSectionReadRepository } from './postgres-read.repository';
import { sectionHandlersProvider } from './handlers.provider';

@Module({
	imports: [DbModule, LearningPathsModule],
	controllers: [GrpcSectionsController],
	providers: [
		PostgresSectionRepository,
		PostgresSectionReadRepository,
		...sectionHandlersProvider,
	],
	exports: [
		PostgresSectionRepository,
		PostgresSectionReadRepository,
		...sectionHandlersProvider,
	],
})
export class SectionsModule {}
