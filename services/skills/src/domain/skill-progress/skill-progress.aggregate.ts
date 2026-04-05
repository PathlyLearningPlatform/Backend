import { AggregateRoot, UserId, UUID } from '../common';
import { SkillId } from '../skills';
import { SkillProgressId } from './value-objects';

export type SkillProgressProps = {
	unlockedAt: Date;
};
export type CreateSkillProgressProps = {
	unlockedAt: Date;
};
export type SkillProgressFromDataSourceProps = {
	skillId: string;
	userId: string;
	unlockedAt: Date;
};

export class SkillProgress extends AggregateRoot<
	SkillProgressId,
	SkillProgressProps
> {
	private readonly _props: SkillProgressProps;

	private constructor(id: SkillProgressId, props: SkillProgressProps) {
		super(id);
		this._props = props;
	}

	static create(
		id: SkillProgressId,
		props: CreateSkillProgressProps,
	): SkillProgress {
		return new SkillProgress(id, {
			unlockedAt: props.unlockedAt,
		});
	}

	static fromDataSource(
		props: SkillProgressFromDataSourceProps,
	): SkillProgress {
		const skillProgressId = SkillProgressId.create(
			SkillId.create(UUID.create(props.skillId)),
			UserId.create(UUID.create(props.userId)),
		);

		return new SkillProgress(skillProgressId, {
			unlockedAt: props.unlockedAt,
		});
	}

	get id(): SkillProgressId {
		return this._id;
	}

	get unlockedAt(): Date {
		return this._props.unlockedAt;
	}
}
