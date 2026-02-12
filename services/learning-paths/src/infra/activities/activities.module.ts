import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { GrpcActivitiesController } from './grpc.controller';
import { PostgresActivitiesRepository } from './postgres.repository';
import { activitiesUseCasesProvider } from './use-cases.provider';
import { LessonsModule } from '../lessons/lessons.module';

@Module({
	imports: [DbModule, LessonsModule],
	controllers: [GrpcActivitiesController],
	providers: [PostgresActivitiesRepository, ...activitiesUseCasesProvider],
	exports: [PostgresActivitiesRepository, ...activitiesUseCasesProvider],
})
export class ActivitiesModule {}
