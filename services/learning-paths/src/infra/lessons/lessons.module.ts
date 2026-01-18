import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { GrpcLessonsController } from './grpc.controller';
import { PostgresLessonsRepository } from './postgres.repository';
import { lessonsUseCasesProvider } from './use-cases.provider';
import { UnitsModule } from '../units/units.module';

@Module({
	imports: [DbModule, UnitsModule],
	controllers: [GrpcLessonsController],
	providers: [PostgresLessonsRepository, ...lessonsUseCasesProvider],
	exports: [PostgresLessonsRepository, ...lessonsUseCasesProvider],
})
export class LessonsModule {}
