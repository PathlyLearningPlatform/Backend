import { ICommandHandler } from '@/app/common';
import { UUID, ValidationException } from '@/domain/common';
import { SkillGraphService } from '@/domain/services';
import { SkillId } from '@/domain/skills';

export type RemoveSkillCommand = {
	id: string;
};

export class RemoveSkillHandler implements ICommandHandler<RemoveSkillCommand> {
	constructor(private readonly skillGraphService: SkillGraphService) {}

	/**
	 * @description removes skill with all it's relationships
	 * @throws {SkillNotFoundException}
	 * @throws {ValidationException}
	 */
	async execute(command: RemoveSkillCommand): Promise<void> {
		await this.skillGraphService.removeSkill(
			SkillId.create(UUID.create(command.id)),
		);
	}
}
