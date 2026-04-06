import { DbModule } from '@infra/common/db/db.module';
import { Module } from '@nestjs/common';
import { LearningPathsModule } from '../learning-paths/learning-paths.module';
import { GrpcSectionsController } from './grpc.controller';
import { sectionHandlersProvider } from './handlers.provider';
import { PostgresSectionRepository } from './postgres.repository';
import { PostgresSectionProgressRepository } from './postgres-progress.repository';
import { PostgresSectionProgressReadRepository } from './postgres-progress-read.repository';
import { PostgresSectionReadRepository } from './postgres-read.repository';
import { InMemoryEventBus } from '../common/adapters';

@Module({
	imports: [DbModule, LearningPathsModule],
	controllers: [GrpcSectionsController],
	providers: [
		InMemoryEventBus,
		PostgresSectionRepository,
		PostgresSectionReadRepository,
		PostgresSectionProgressRepository,
		PostgresSectionProgressReadRepository,
		...sectionHandlersProvider,
	],
	exports: [
		PostgresSectionRepository,
		PostgresSectionReadRepository,
		PostgresSectionProgressRepository,
		PostgresSectionProgressReadRepository,
		...sectionHandlersProvider,
	],
})
export class SectionsModule {}
