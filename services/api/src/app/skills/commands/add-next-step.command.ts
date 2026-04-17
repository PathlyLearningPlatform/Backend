import { ICommandHandler } from '@/app/common';
import { UUID, ValidationException } from '@/domain/common';
import {
	SkillNotFoundException,
	SkillGraphService,
	SkillCannotReferenceItselfException,
	SkillId,
} from '@/domain/skills';

export type AddNextStepSkillCommand = {
	prerequisiteSkillId: string;
	targetSkillId: string;
};

export class AddNextStepSkillHandler
	implements ICommandHandler<AddNextStepSkillCommand, void>
{
	constructor(private readonly skillGraphService: SkillGraphService) {}

	/**
	 * @throws {SkillNotFoundException}
	 * @throws {SkillCannotReferenceItselfException}
	 * @throws {ValidationException}
	 */
	async execute(command: AddNextStepSkillCommand): Promise<void> {
		const prerequisiteId = SkillId.create(
			UUID.create(command.prerequisiteSkillId),
		);
		const targetId = SkillId.create(UUID.create(command.targetSkillId));

		await this.skillGraphService.addNextStep(prerequisiteId, targetId);
	}
}
