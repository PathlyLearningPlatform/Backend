import { ICommandHandler } from '@/app/common';
import { UUID, ValidationException } from '@/domain/common';
import { SkillNotFoundException } from '@/domain/exceptions';
import { SkillGraphService } from '@/domain/services';
import { SkillCannotReferenceItselfException, SkillId } from '@/domain/skills';

export type AddPrerequisiteSkillCommand = {
	prerequisiteSkillId: string;
	targetSkillId: string;
};

export class AddPrerequisiteSkillHandler
	implements ICommandHandler<AddPrerequisiteSkillCommand, void>
{
	constructor(private readonly skillGraphService: SkillGraphService) {}

	/**
	 * @throws {SkillNotFoundException}
	 * @throws {SkillCannotReferenceItselfException}
	 * @throws {ValidationException}
	 */
	async execute(command: AddPrerequisiteSkillCommand): Promise<void> {
		const prerequisiteId = SkillId.create(
			UUID.create(command.prerequisiteSkillId),
		);
		const targetId = SkillId.create(UUID.create(command.targetSkillId));

		await this.skillGraphService.addPrerequisite(prerequisiteId, targetId);
	}
}
