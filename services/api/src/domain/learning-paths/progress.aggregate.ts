import { AggregateRoot, UserId, UUID } from '../common';
import { LearningPathCompletedEvent, LearningPathStartedEvent } from './events';
import { LearningPathId, LearningPathProgressId } from './value-objects';

export type LearningPathProgressProps = {
	completedAt: Date | null;
	completedSectionCount: number;
	totalSectionCount: number;
	createdAt: Date;
	updatedAt: Date | null;
};

export type LearningPathProgressFromDataSourceProps = {
	learningPathId: string;
	userId: string;
	completedAt: Date | null;
	completedSectionCount: number;
	totalSectionCount: number;
	createdAt: Date;
	updatedAt: Date | null;
};

export type CreateLearningPathProgressProps = {
	totalSectionCount: number;
	createdAt: Date;
};

export class LearningPathProgress extends AggregateRoot<
	LearningPathProgressId,
	LearningPathProgressProps
> {
	private readonly _props: LearningPathProgressProps;

	private constructor(
		id: LearningPathProgressId,
		props: LearningPathProgressProps,
	) {
		super(id);
		this._props = props;
	}

	static fromDataSource(
		props: LearningPathProgressFromDataSourceProps,
	): LearningPathProgress {
		const learningPathId = LearningPathId.create(
			UUID.create(props.learningPathId),
		);
		const userId = UserId.create(UUID.create(props.userId));
		const id = LearningPathProgressId.create(learningPathId, userId);

		return new LearningPathProgress(id, {
			completedAt: props.completedAt,
			completedSectionCount: props.completedSectionCount,
			totalSectionCount: props.totalSectionCount,
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
		});
	}

	static create(
		id: LearningPathProgressId,
		props: CreateLearningPathProgressProps,
	): LearningPathProgress {
		const progress = new LearningPathProgress(id, {
			completedAt: null,
			completedSectionCount: 0,
			totalSectionCount: props.totalSectionCount,
			createdAt: props.createdAt,
			updatedAt: null,
		});

		progress.addEvent(
			new LearningPathStartedEvent(
				progress.userId.toString(),
				props.createdAt,
				{
					learningPathId: progress.learningPathId.value,
				},
			),
		);

		return progress;
	}

	completeSection(now: Date) {
		this._props.updatedAt = now;

		if (this._props.completedAt !== null) {
			return;
		}

		if (++this._props.completedSectionCount !== this._props.totalSectionCount) {
			return;
		}

		this._props.completedAt = now;

		this.addEvent(
			new LearningPathCompletedEvent(this._id.userId.toString(), now, {
				learningPathId: this._id.learningPathId.value,
			}),
		);
	}

	get learningPathId(): LearningPathId {
		return this._id.learningPathId;
	}

	get userId(): UserId {
		return this._id.userId;
	}

	get completedAt(): Date | null {
		return this._props.completedAt;
	}

	get createdAt(): Date {
		return this._props.createdAt;
	}

	get updatedAt(): Date | null {
		return this._props.updatedAt;
	}

	get totalSectionCount(): number {
		return this._props.totalSectionCount;
	}

	get completedSectionCount(): number {
		return this._props.completedSectionCount;
	}
}
