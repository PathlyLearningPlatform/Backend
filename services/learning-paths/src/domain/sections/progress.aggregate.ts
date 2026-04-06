import { AggregateRoot, UserId, UUID } from "../common";
import { LearningPathId } from "../learning-paths/value-objects";
import { SectionCompletedEvent } from "./events";
import { SectionId, SectionProgressId } from "./value-objects";

export type SectionProgressProps = {
	learningPathId: LearningPathId;
	completedAt: Date | null;
	completedUnitCount: number;
	totalUnitCount: number;
};

export type SectionProgressFromDataSourceProps = {
	sectionId: string;
	learningPathId: string;
	userId: string;
	completedAt: Date | null;
	completedUnitCount: number;
	totalUnitCount: number;
};

export type CreateSectionProgressProps = {
	learningPathId: LearningPathId;
	totalUnitCount: number;
};

export class SectionProgress extends AggregateRoot<
	SectionProgressId,
	SectionProgressProps
> {
	private readonly _props: SectionProgressProps;

	private constructor(id: SectionProgressId, props: SectionProgressProps) {
		super(id);
		this._props = props;
	}

	static fromDataSource(
		props: SectionProgressFromDataSourceProps,
	): SectionProgress {
		const sectionId = SectionId.create(props.sectionId);
		const learningPathId = LearningPathId.create(
			UUID.create(props.learningPathId),
		);
		const userId = UserId.create(UUID.create(props.userId));
		const id = SectionProgressId.create(sectionId, userId);

		return new SectionProgress(id, {
			learningPathId,
			completedAt: props.completedAt,
			completedUnitCount: props.completedUnitCount,
			totalUnitCount: props.totalUnitCount,
		});
	}

	static create(
		id: SectionProgressId,
		props: CreateSectionProgressProps,
	): SectionProgress {
		return new SectionProgress(id, {
			learningPathId: props.learningPathId,
			completedAt: null,
			completedUnitCount: 0,
			totalUnitCount: props.totalUnitCount,
		});
	}

	completeUnit(now: Date) {
		if (this._props.completedAt !== null) {
			return;
		}

		if (++this._props.completedUnitCount !== this._props.totalUnitCount) {
			return;
		}

		this._props.completedAt = now;

		this.addEvent(
			new SectionCompletedEvent(
				this._id.sectionId.value,
				this._props.learningPathId.toString(),
				this._id.userId.toString(),
				now,
			),
		);
	}

	get sectionId(): SectionId {
		return this._id.sectionId;
	}

	get learningPathId(): LearningPathId {
		return this._props.learningPathId;
	}

	get userId(): UserId {
		return this._id.userId;
	}

	get completedAt(): Date | null {
		return this._props.completedAt;
	}

	get totalUnitCount(): number {
		return this._props.totalUnitCount;
	}

	get completedUnitCount(): number {
		return this._props.completedUnitCount;
	}
}
