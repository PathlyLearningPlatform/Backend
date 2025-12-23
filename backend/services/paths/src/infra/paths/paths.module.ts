import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { GrpcPathsController } from './grpc.controller';
import { PostgresPathsRepository } from './postgres.repository';
import { pathsUseCasesProvider } from './use-cases.provider';

@Module({
	imports: [DbModule],
	controllers: [GrpcPathsController],
	providers: [PostgresPathsRepository, ...pathsUseCasesProvider],
	exports: [PostgresPathsRepository, ...pathsUseCasesProvider],
})
export class PathsModule {}
