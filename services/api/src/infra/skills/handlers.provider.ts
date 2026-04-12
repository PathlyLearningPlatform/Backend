import type { Provider } from '@nestjs/common';
import { DiToken } from '../common';
import {
	AddChildSkillHandler,
	AddNextStepSkillHandler,
	CreateSkillHandler,
	FindOneSkillProgressForUserHandler,
	FindSkillByIdHandler,
	FindSkillBySlugHandler,
	GetPrerequisiteGraphHandler,
	ListSkillChildrenHandler,
	ListSkillNextStepsHandler,
	ListSkillPrerequisitiesHandler,
	ListSkillProgressForUserHandler,
	RemoveSkillHandler,
	UnlockSkillHandler,
	UpdateSkillHandler,
} from '@/app/skills';
import { SkillGraphService, SkillProgressService } from '@/domain/services';
import {
	Neo4jSkillGraphAdapter,
	Neo4jSkillProgressGraphAdapter,
} from '../common/adapters';

export const skillHandlersProvider: Provider[] = [
	{
		provide: DiToken.SKILL_GRAPH_SERVICE,
		useFactory(skillGraph: Neo4jSkillGraphAdapter) {
			return new SkillGraphService(skillGraph);
		},
		inject: [Neo4jSkillGraphAdapter],
	},
	{
		provide: DiToken.CREATE_SKILL_HANDLER,
		useFactory(skillGraphService: SkillGraphService) {
			return new CreateSkillHandler(skillGraphService);
		},
		inject: [DiToken.SKILL_GRAPH_SERVICE],
	},
	{
		provide: DiToken.UPDATE_SKILL_HANDLER,
		useFactory(skillGraphService: SkillGraphService) {
			return new UpdateSkillHandler(skillGraphService);
		},
		inject: [DiToken.SKILL_GRAPH_SERVICE],
	},
	{
		provide: DiToken.REMOVE_SKILL_HANDLER,
		useFactory(skillGraphService: SkillGraphService) {
			return new RemoveSkillHandler(skillGraphService);
		},
		inject: [DiToken.SKILL_GRAPH_SERVICE],
	},
	{
		provide: DiToken.ADD_CHILD_SKILL_HANDLER,
		useFactory(skillGraphService: SkillGraphService) {
			return new AddChildSkillHandler(skillGraphService);
		},
		inject: [DiToken.SKILL_GRAPH_SERVICE],
	},
	{
		provide: DiToken.ADD_NEXT_STEP_SKILL_HANDLER,
		useFactory(skillGraphService: SkillGraphService) {
			return new AddNextStepSkillHandler(skillGraphService);
		},
		inject: [DiToken.SKILL_GRAPH_SERVICE],
	},
	{
		provide: DiToken.FIND_SKILL_BY_ID_HANDLER,
		useFactory(skillGraphService: SkillGraphService) {
			return new FindSkillByIdHandler(skillGraphService);
		},
		inject: [DiToken.SKILL_GRAPH_SERVICE],
	},
	{
		provide: DiToken.FIND_SKILL_BY_SLUG_HANDLER,
		useFactory(skillGraphService: SkillGraphService) {
			return new FindSkillBySlugHandler(skillGraphService);
		},
		inject: [DiToken.SKILL_GRAPH_SERVICE],
	},
	{
		provide: DiToken.LIST_SKILL_CHILDREN_HANDLER,
		useFactory(skillGraphService: SkillGraphService) {
			return new ListSkillChildrenHandler(skillGraphService);
		},
		inject: [DiToken.SKILL_GRAPH_SERVICE],
	},
	{
		provide: DiToken.LIST_SKILL_PREREQUISITIES_HANDLER,
		useFactory(skillGraphService: SkillGraphService) {
			return new ListSkillPrerequisitiesHandler(skillGraphService);
		},
		inject: [DiToken.SKILL_GRAPH_SERVICE],
	},
	{
		provide: DiToken.LIST_SKILL_NEXT_STEPS_HANDLER,
		useFactory(skillGraphService: SkillGraphService) {
			return new ListSkillNextStepsHandler(skillGraphService);
		},
		inject: [DiToken.SKILL_GRAPH_SERVICE],
	},
	{
		provide: DiToken.GET_PREREQUISITE_GRAPH_HANDLER,
		useFactory(skillGraphService: SkillGraphService) {
			return new GetPrerequisiteGraphHandler(skillGraphService);
		},
		inject: [DiToken.SKILL_GRAPH_SERVICE],
	},
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
		provide: DiToken.LIST_SKILL_PROGRESS_FOR_USER_HANDLER,
		useFactory(skillProgressService: SkillProgressService) {
			return new ListSkillProgressForUserHandler(skillProgressService);
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
