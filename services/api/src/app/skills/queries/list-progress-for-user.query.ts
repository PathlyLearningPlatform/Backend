import { IQueryHandler } from '@/app/common';
import { SkillProgressDto } from '../dtos';
import { SkillProgressService } from '@/domain/services';
import { SkillProgressId } from '@/domain/skills';
import { SkillId } from '@/domain/skills';
import { UserId, UUID, ValidationException } from '@/domain/common';
import { SkillProgressNotFoundException } from '@/domain/exceptions';

export type ListSkillProgressForUserQuery = {
	userId: string;
};

export class ListSkillProgressForUserHandler
	implements IQueryHandler<ListSkillProgressForUserQuery, SkillProgressDto[]>
{
	constructor(private readonly skillProgressService: SkillProgressService) {}

	/**
	 * @throws {ValidationException}
	 */
	async execute(
		query: ListSkillProgressForUserQuery,
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
