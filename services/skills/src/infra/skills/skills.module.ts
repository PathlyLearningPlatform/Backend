import { Module } from '@nestjs/common';
import { Neo4jModule } from '../common/neo4j/neo4j.module';
import { Neo4jSkillGraphAdapter } from '../adapters';
import { GrpcSkillsController } from './grpc.controller';
import { skillHandlersProvider } from './handlers.provider';
import { DiToken } from '../common';

@Module({
	imports: [Neo4jModule],
	providers: [Neo4jSkillGraphAdapter, ...skillHandlersProvider],
	controllers: [GrpcSkillsController],
	exports: [DiToken.SKILL_GRAPH_SERVICE],
})
export class SkillsModule {}
