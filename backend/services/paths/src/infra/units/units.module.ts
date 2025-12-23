import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { SectionsModule } from '../sections/sections.module';
import { GrpcUnitsController } from './grpc.controller';
import { PostgresUnitsRepository } from './postgres.repository';
import { unitsUseCasesProvider } from './use-cases.provider';

@Module({
	imports: [DbModule, SectionsModule],
	controllers: [GrpcUnitsController],
	providers: [PostgresUnitsRepository, ...unitsUseCasesProvider],
	exports: [PostgresUnitsRepository, ...unitsUseCasesProvider],
})
export class UnitsModule {}
