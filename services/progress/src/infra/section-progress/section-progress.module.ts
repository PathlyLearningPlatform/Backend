import { Module } from '@nestjs/common';
import { PostgresSectionProgressRepository } from './postgres.repository';
import { DbModule } from '@infra/common/db/db.module';
import { PostgresSectionProgressReadRepository } from './postgres-read.repository';
import { InMemoryEventBus, LearningPathsModule } from '../common';
import { sectionProgressHandlersProvider } from './handlers.provider';
import { LearningPathProgressModule } from '../learning-path-progress/learning-path-progress.module';
import { GrpcSectionProgressController } from './grpc.controller';

@Module({
	imports: [DbModule, LearningPathProgressModule, LearningPathsModule],
	controllers: [GrpcSectionProgressController],
	providers: [
		InMemoryEventBus,
		PostgresSectionProgressRepository,
		PostgresSectionProgressReadRepository,
		...sectionProgressHandlersProvider,
	],
	exports: [
		PostgresSectionProgressRepository,
		PostgresSectionProgressReadRepository,
	],
})
export class SectionProgressModule {}
