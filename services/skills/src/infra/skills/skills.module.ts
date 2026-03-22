import { Module } from '@nestjs/common';
import { Neo4jModule } from '../common/neo4j/neo4j.module';
import { Neo4jSkillGraphAdapter } from '../adapters';
import { GrpcSkillsController } from './grpc.controller';
import { skillHandlersProvider } from './handlers.provider';

@Module({
	imports: [Neo4jModule],
	providers: [Neo4jSkillGraphAdapter, ...skillHandlersProvider],
	controllers: [GrpcSkillsController],
})
export class SkillsModule {}
