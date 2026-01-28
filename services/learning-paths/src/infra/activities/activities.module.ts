import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { GrpcActivitiesController } from './grpc.controller';
import { PostgresActivitiesRepository } from './postgres.repository';
import { activitiesUseCasesProvider } from './use-cases.provider';

@Module({
	imports: [DbModule],
	controllers: [GrpcActivitiesController],
	providers: [PostgresActivitiesRepository, ...activitiesUseCasesProvider],
	exports: [PostgresActivitiesRepository, ...activitiesUseCasesProvider],
})
export class ActivitiesModule {}
