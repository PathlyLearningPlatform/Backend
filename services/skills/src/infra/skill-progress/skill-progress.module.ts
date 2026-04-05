import { Module } from '@nestjs/common';
import { skillProgressHandlersProvider } from './handlers.provider';
import { SkillsModule } from '../skills/skills.module';
import { Neo4jSkillProgressGraphAdapter } from '../adapters';
import { GrpcSkillProgressController } from './grpc.controller';
import { Neo4jModule } from '../common/neo4j/neo4j.module';

@Module({
	imports: [SkillsModule, Neo4jModule],
	controllers: [GrpcSkillProgressController],
	providers: [Neo4jSkillProgressGraphAdapter, ...skillProgressHandlersProvider],
})
export class SkillProgressModule {}
