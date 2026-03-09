import { Module } from '@nestjs/common';
import { DbModule } from '@infra/common/db/db.module';
import { SectionsModule } from '../sections/sections.module';
import { GrpcUnitsController } from './grpc.controller';
import { PostgresUnitRepository } from './postgres.repository';
import { PostgresUnitReadRepository } from './postgres-read.repository';
import { unitHandlersProvider } from './handlers.provider';

@Module({
	imports: [DbModule, SectionsModule],
	controllers: [GrpcUnitsController],
	providers: [
		PostgresUnitRepository,
		PostgresUnitReadRepository,
		...unitHandlersProvider,
	],
	exports: [
		PostgresUnitRepository,
		PostgresUnitReadRepository,
		...unitHandlersProvider,
	],
})
export class UnitsModule {}
