import { Module } from '@nestjs/common';
import { PostgresUnitProgressRepository } from './postgres.repository';
import { DbModule } from '@infra/common/db/db.module';
import { PostgresUnitProgressReadRepository } from './postgres-read.repository';
import { InMemoryEventBus, LearningPathsModule } from '../common';
import { unitProgressHandlersProvider } from './handlers.provider';
import { SectionProgressModule } from '../section-progress/section-progress.module';
import { GrpcUnitProgressController } from './grpc.controller';

@Module({
	imports: [DbModule, SectionProgressModule, LearningPathsModule],
	controllers: [GrpcUnitProgressController],
	providers: [
		InMemoryEventBus,
		PostgresUnitProgressRepository,
		PostgresUnitProgressReadRepository,
		...unitProgressHandlersProvider,
	],
	exports: [PostgresUnitProgressRepository, PostgresUnitProgressReadRepository],
})
export class UnitProgressModule {}
