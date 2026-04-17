import { IQueryHandler } from '@/app/common';
import { SkillProgressDto } from '../dtos';
import { SkillProgressId } from '@/domain/skills';
import { UserId, UUID, ValidationException } from '@/domain/common';
import {
	SkillId,
	SkillProgressNotFoundException,
	SkillProgressService,
} from '@/domain/skills';

export type FindOneSkillProgressForUserQuery = {
	userId: string;
	skillId: string;
};

export class FindOneSkillProgressForUserHandler
	implements IQueryHandler<FindOneSkillProgressForUserQuery, SkillProgressDto>
{
	constructor(private readonly skillProgressService: SkillProgressService) {}

	/**
	 * @throws {SkillProgressNotFoundException}
	 * @throws {ValidationException}
	 */
	async execute(
		query: FindOneSkillProgressForUserQuery,
	): Promise<SkillProgressDto> {
		// handle user not found case

		const skillId = SkillId.create(UUID.create(query.skillId));
		const userId = UserId.create(UUID.create(query.userId));
		const skillProgressId = SkillProgressId.create(skillId, userId);

		const skillProgress =
			await this.skillProgressService.findById(skillProgressId);

		if (!skillProgress) {
			throw new SkillProgressNotFoundException();
		}

		return {
			skillId: skillProgress.id.skillId.toString(),
			unlockedAt: skillProgress.unlockedAt,
			userId: skillProgress.id.userId.toString(),
		};
	}
}
