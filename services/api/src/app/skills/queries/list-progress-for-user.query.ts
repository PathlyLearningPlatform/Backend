import { IQueryHandler } from '@/app/common';
import { SkillProgressDto } from '../dtos';
import { UserId, UUID, ValidationException } from '@/domain/common';
import { SkillProgressService } from '@/domain/skills';

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
