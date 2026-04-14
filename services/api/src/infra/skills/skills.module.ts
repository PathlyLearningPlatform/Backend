import { Module } from '@nestjs/common';
import { Neo4jModule } from '../neo4j/neo4j.module';
import {
	Neo4jSkillGraphAdapter,
	Neo4jSkillProgressGraphAdapter,
} from '../common/adapters';
import { skillHandlersProvider } from './handlers.provider';
import { DiToken } from '../common';
import { SkillsController } from './skills.controller';
import { SkillProgressController } from './progress.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [Neo4jModule, AuthModule],
	providers: [
		Neo4jSkillGraphAdapter,
		Neo4jSkillProgressGraphAdapter,
		...skillHandlersProvider,
	],
	controllers: [SkillsController, SkillProgressController],
	exports: [DiToken.SKILL_GRAPH_SERVICE],
})
export class SkillsModule {}
