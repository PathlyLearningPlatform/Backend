import { ICommandHandler } from '@/app/common';
import { UserId, UUID, ValidationException } from '@/domain/common';
import { SkillNotFoundException } from '@/domain/exceptions';
import { SkillProgressService } from '@/domain/services';
import { SkillProgressId } from '@/domain/skill-progress';
import { SkillId } from '@/domain/skills';

export type UnlockSkillCommand = {
	skillId: string;
	userId: string;
};

export class UnlockSkillHandler implements ICommandHandler<UnlockSkillCommand> {
	constructor(private readonly skillProgressService: SkillProgressService) {}

	/**
	 * @throws {SkillNotFoundException}
	 * @throws {ValidationException}
	 */
	async execute(command: UnlockSkillCommand): Promise<void> {
		const skillId = SkillId.create(UUID.create(command.skillId));
		const userId = UserId.create(UUID.create(command.userId));
		const skillProgressId = SkillProgressId.create(skillId, userId);

		await this.skillProgressService.unlock(skillProgressId, new Date());
	}
}
