import { Provider } from '@nestjs/common';
import { DiToken } from '../common';
import { UnlockSkillHandler } from '@/app/skill-progress/commands';
import {
	FindOneSkillProgressForUserHandler,
	FindSkillProgressForUserHandler,
} from '@/app/skill-progress/queries';
import { SkillGraphService, SkillProgressService } from '@/domain/services';
import { Neo4jSkillProgressGraphAdapter } from '../adapters';

export const skillProgressHandlersProvider: Provider[] = [
	{
		provide: DiToken.SKILL_PROGRESS_SERVICE,
		useFactory(
			skillGraphService: SkillGraphService,
			skillProgressGraph: Neo4jSkillProgressGraphAdapter,
		) {
			return new SkillProgressService(skillGraphService, skillProgressGraph);
		},
		inject: [DiToken.SKILL_GRAPH_SERVICE, Neo4jSkillProgressGraphAdapter],
	},
	{
		provide: DiToken.UNLOCK_SKILL_HANDLER,
		useFactory(skillProgressService: SkillProgressService) {
			return new UnlockSkillHandler(skillProgressService);
		},
		inject: [DiToken.SKILL_PROGRESS_SERVICE],
	},
	{
		provide: DiToken.FIND_SKILL_PROGRESS_FOR_USER_HANDLER,
		useFactory(skillProgressService: SkillProgressService) {
			return new FindSkillProgressForUserHandler(skillProgressService);
		},
		inject: [DiToken.SKILL_PROGRESS_SERVICE],
	},
	{
		provide: DiToken.FIND_ONE_SKILL_PROGRESS_FOR_USER_HANDLER,
		useFactory(skillProgressService: SkillProgressService) {
			return new FindOneSkillProgressForUserHandler(skillProgressService);
		},
		inject: [DiToken.SKILL_PROGRESS_SERVICE],
	},
];
