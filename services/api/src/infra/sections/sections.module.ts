import { DbModule } from '@/infra/db/db.module';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { LearningPathsModule } from '../learning-paths/learning-paths.module';
import { sectionHandlersProvider } from './handlers.provider';
import { SectionProgressController } from './progress.controller';
import { SectionsController } from './sections.controller';
import { PostgresSectionRepository } from './postgres.repository';
import { PostgresSectionProgressRepository } from './postgres-progress.repository';
import { PostgresSectionProgressReadRepository } from './postgres-progress-read.repository';
import { PostgresSectionReadRepository } from './postgres-read.repository';
import { InMemoryEventBus } from '@infra/common';

@Module({
	imports: [DbModule, LearningPathsModule, AuthModule],
	controllers: [SectionsController, SectionProgressController],
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
