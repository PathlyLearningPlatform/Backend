import { ICommandHandler } from '@/app/common';
import { UUID, ValidationException } from '@/domain/common';
import { SkillNotFoundException } from '@/domain/exceptions';
import { SkillGraphService } from '@/domain/services';
import { SkillCannotReferenceItselfException, SkillId } from '@/domain/skills';

export type AddCommonSkillCommand = {
	firstSkillId: string;
	secondSkillId: string;
};

export class AddCommonSkillHandler
	implements ICommandHandler<AddCommonSkillCommand, void>
{
	constructor(private readonly skillGraphService: SkillGraphService) {}

	/**
	 * @throws {SkillNotFoundException}
	 * @throws {SkillCannotReferenceItselfException}
	 * @throws {ValidationException}
	 */
	async execute(command: AddCommonSkillCommand): Promise<void> {
		const firstId = SkillId.create(UUID.create(command.firstSkillId));
		const secondId = SkillId.create(UUID.create(command.secondSkillId));

		await this.skillGraphService.addCommon(firstId, secondId);
	}
}
