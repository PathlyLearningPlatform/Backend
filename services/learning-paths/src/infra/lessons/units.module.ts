import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { SectionsModule } from '../sections/sections.module';
import { GrpcLessonsController } from './grpc.controller';
import { PostgresLessonsRepository } from './postgres.repository';
import { lessonsUseCasesProvider } from './use-cases.provider';

@Module({
	imports: [DbModule, SectionsModule],
	controllers: [GrpcLessonsController],
	providers: [PostgresLessonsRepository, ...lessonsUseCasesProvider],
	exports: [PostgresLessonsRepository, ...lessonsUseCasesProvider],
})
export class LessonsModule {}
