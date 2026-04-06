import { DbModule } from '@infra/common/db/db.module';
import { Module } from '@nestjs/common';
import { SectionsModule } from '../sections/sections.module';
import { GrpcUnitsController } from './grpc.controller';
import { unitHandlersProvider } from './handlers.provider';
import { PostgresUnitRepository } from './postgres.repository';
import { PostgresUnitProgressRepository } from './postgres-progress.repository';
import { PostgresUnitProgressReadRepository } from './postgres-progress-read.repository';
import { PostgresUnitReadRepository } from './postgres-read.repository';
import { InMemoryEventBus } from '../common/adapters';

@Module({
	imports: [DbModule, SectionsModule],
	controllers: [GrpcUnitsController],
	providers: [
		InMemoryEventBus,
		PostgresUnitRepository,
		PostgresUnitReadRepository,
		PostgresUnitProgressRepository,
		PostgresUnitProgressReadRepository,
		...unitHandlersProvider,
	],
	exports: [
		PostgresUnitRepository,
		PostgresUnitReadRepository,
		PostgresUnitProgressRepository,
		PostgresUnitProgressReadRepository,
		...unitHandlersProvider,
	],
})
export class UnitsModule {}
