import { ICommandHandler } from '@/app/common';
import { UUID, ValidationException } from '@/domain/common';
import {
	SkillNotFoundException,
	SkillGraphService,
	SkillCannotReferenceItselfException,
	SkillId,
} from '@/domain/skills';

export type AddChildSkillCommand = {
	parentSkillId: string;
	childSkillId: string;
};

export class AddChildSkillHandler
	implements ICommandHandler<AddChildSkillCommand, void>
{
	constructor(private readonly skillGraphService: SkillGraphService) {}

	/**
	 * @throws {SkillNotFoundException}
	 * @throws {SkillCannotReferenceItselfException}
	 * @throws {ValidationException}
	 */
	async execute(command: AddChildSkillCommand): Promise<void> {
		const parentId = SkillId.create(UUID.create(command.parentSkillId));
		const childId = SkillId.create(UUID.create(command.childSkillId));

		await this.skillGraphService.addChild(parentId, childId);
	}
}
