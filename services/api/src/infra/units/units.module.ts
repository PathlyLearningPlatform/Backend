import { DbModule } from '@/infra/db/db.module';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SectionsModule } from '../sections/sections.module';
import { unitHandlersProvider } from './handlers.provider';
import { UnitProgressController } from './progress.controller';
import { UnitsController } from './units.controller';
import { PostgresUnitRepository } from './postgres.repository';
import { PostgresUnitProgressRepository } from './postgres-progress.repository';
import { PostgresUnitProgressReadRepository } from './postgres-progress-read.repository';
import { PostgresUnitReadRepository } from './postgres-read.repository';
import { InMemoryEventBus } from '@infra/common';

@Module({
	imports: [DbModule, SectionsModule, AuthModule],
	controllers: [UnitsController, UnitProgressController],
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
