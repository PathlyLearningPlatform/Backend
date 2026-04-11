import { Module } from '@nestjs/common';
import { Neo4jModule } from '../neo4j/neo4j.module';
import { Neo4jSkillGraphAdapter } from '../common/adapters';
import { skillHandlersProvider } from './handlers.provider';
import { DiToken } from '../common';

@Module({
	imports: [Neo4jModule],
	providers: [Neo4jSkillGraphAdapter, ...skillHandlersProvider],
	controllers: [],
	exports: [DiToken.SKILL_GRAPH_SERVICE],
})
export class SkillsModule {}
