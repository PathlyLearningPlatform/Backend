import { AggregateRoot, UserId, UUID } from "../common";
import { LearningPathCompletedEvent } from "./events";
import { LearningPathId, LearningPathProgressId } from "./value-objects";

export type LearningPathProgressProps = {
	completedAt: Date | null;
	completedSectionCount: number;
	totalSectionCount: number;
};

export type LearningPathProgressFromDataSourceProps = {
	learningPathId: string;
	userId: string;
	completedAt: Date | null;
	completedSectionCount: number;
	totalSectionCount: number;
};

export type CreateLearningPathProgressProps = {
	totalSectionCount: number;
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
		});
	}

	static create(
		id: LearningPathProgressId,
		props: CreateLearningPathProgressProps,
	): LearningPathProgress {
		return new LearningPathProgress(id, {
			completedAt: null,
			completedSectionCount: 0,
			totalSectionCount: props.totalSectionCount,
		});
	}

	completeSection(now: Date) {
		if (this._props.completedAt !== null) {
			return;
		}

		if (++this._props.completedSectionCount !== this._props.totalSectionCount) {
			return;
		}

		this._props.completedAt = now;

		this.addEvent(
			new LearningPathCompletedEvent(
				this._id.learningPathId.toString(),
				this._id.userId.toString(),
				now,
			),
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

	get totalSectionCount(): number {
		return this._props.totalSectionCount;
	}

	get completedSectionCount(): number {
		return this._props.completedSectionCount;
	}
}
