import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { PathsModule } from '../paths/paths.module';
import { GrpcSectionsController } from './grpc.controller';
import { PostgresSectionsRepository } from './postgres.repository';
import { sectionsUseCasesProvider } from './use-cases.provider';

@Module({
	imports: [DbModule, PathsModule],
	controllers: [GrpcSectionsController],
	providers: [PostgresSectionsRepository, ...sectionsUseCasesProvider],
	exports: [PostgresSectionsRepository, ...sectionsUseCasesProvider],
})
export class SectionsModule {}
