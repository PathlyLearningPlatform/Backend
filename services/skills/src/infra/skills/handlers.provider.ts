import { Provider } from '@nestjs/common';
import { DiToken } from '../common';
import {
	AddAlternativeSkillHandler,
	AddChildSkillHandler,
	AddCommonSkillHandler,
	AddPrerequisiteSkillHandler,
	CreateSkillHandler,
	FindSkillByIdHandler,
	FindSkillBySlugHandler,
	GetPrerequisiteGraphHandler,
	GetTopLevelPrerequisiteGraphHandler,
	ListCommonSkillsHandler,
	ListSkillAlternativesHandler,
	ListSkillChildrenHandler,
	ListSkillPrerequisitiesHandler,
	RemoveSkillHandler,
	UpdateSkillHandler,
} from '@/app/skills';
import { SkillGraphService } from '@/domain/services';
import { Neo4jSkillGraphAdapter } from '../adapters';

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
		provide: DiToken.ADD_ALTERNATIVE_SKILL_HANDLER,
		useFactory(skillGraphService: SkillGraphService) {
			return new AddAlternativeSkillHandler(skillGraphService);
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
		provide: DiToken.ADD_PREREQUISITE_SKILL_HANDLER,
		useFactory(skillGraphService: SkillGraphService) {
			return new AddPrerequisiteSkillHandler(skillGraphService);
		},
		inject: [DiToken.SKILL_GRAPH_SERVICE],
	},
	{
		provide: DiToken.ADD_COMMON_SKILL_HANDLER,
		useFactory(skillGraphService: SkillGraphService) {
			return new AddCommonSkillHandler(skillGraphService);
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
		provide: DiToken.LIST_COMMON_SKILLS_HANDLER,
		useFactory(skillGraphService: SkillGraphService) {
			return new ListCommonSkillsHandler(skillGraphService);
		},
		inject: [DiToken.SKILL_GRAPH_SERVICE],
	},
	{
		provide: DiToken.LIST_SKILL_ALTERNATIVES_HANDLER,
		useFactory(skillGraphService: SkillGraphService) {
			return new ListSkillAlternativesHandler(skillGraphService);
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
		provide: DiToken.GET_TOP_LEVEL_PREREQUISITE_GRAPH_HANDLER,
		useFactory(skillGraphService: SkillGraphService) {
			return new GetTopLevelPrerequisiteGraphHandler(skillGraphService);
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
];
