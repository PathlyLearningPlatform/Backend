import { IQueryHandler } from '@/app/common';
import { SkillProgressDto } from '../dtos';
import { SkillProgressService } from '@/domain/services';
import { SkillProgressId } from '@/domain/skill-progress';
import { SkillId } from '@/domain/skills';
import { UserId, UUID, ValidationException } from '@/domain/common';
import { SkillProgressNotFoundException } from '@/domain/exceptions';

export type FindSkillProgressForUserQuery = {
	userId: string;
};

export class FindSkillProgressForUserHandler
	implements IQueryHandler<FindSkillProgressForUserQuery, SkillProgressDto[]>
{
	constructor(private readonly skillProgressService: SkillProgressService) {}

	/**
	 * @throws {ValidationException}
	 */
	async execute(
		query: FindSkillProgressForUserQuery,
	): Promise<SkillProgressDto[]> {
		// handle user not found case

		const userId = UserId.create(UUID.create(query.userId));

		const skillProgress = await this.skillProgressService.findForUser(userId);

		return skillProgress.map((progress) => ({
			skillId: progress.id.skillId.toString(),
			userId: progress.id.userId.toString(),
			unlockedAt: progress.unlockedAt,
		}));
	}
}
