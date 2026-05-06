import { AggregateRoot, UserId, UUID } from '../common';
import { LearningPathId } from '../learning-paths/value-objects';
import { SectionCompletedEvent, SectionStartedEvent } from './events';
import { SectionId, SectionProgressId } from './value-objects';

export type SectionProgressProps = {
	learningPathId: LearningPathId;
	completedAt: Date | null;
	completedUnitCount: number;
	totalUnitCount: number;
	createdAt: Date;
	updatedAt: Date | null;
};

export type SectionProgressFromDataSourceProps = {
	sectionId: string;
	learningPathId: string;
	userId: string;
	completedAt: Date | null;
	completedUnitCount: number;
	totalUnitCount: number;
	createdAt: Date;
	updatedAt: Date | null;
};

export type CreateSectionProgressProps = {
	learningPathId: LearningPathId;
	totalUnitCount: number;
	createdAt: Date;
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
			createdAt: props.createdAt,
			updatedAt: props.updatedAt,
		});
	}

	static create(
		id: SectionProgressId,
		props: CreateSectionProgressProps,
	): SectionProgress {
		const progress = new SectionProgress(id, {
			learningPathId: props.learningPathId,
			completedAt: null,
			completedUnitCount: 0,
			totalUnitCount: props.totalUnitCount,
			createdAt: props.createdAt,
			updatedAt: null,
		});

		progress.addEvent(
			new SectionStartedEvent(progress.userId.toString(), props.createdAt, {
				sectionId: progress.sectionId.value,
			}),
		);

		return progress;
	}

	completeUnit(now: Date) {
		this._props.updatedAt = now;

		if (this._props.completedAt !== null) {
			return;
		}

		if (++this._props.completedUnitCount !== this._props.totalUnitCount) {
			return;
		}

		this._props.completedAt = now;

		this.addEvent(
			new SectionCompletedEvent(this._id.userId.toString(), now, {
				sectionId: this._id.sectionId.value,
				learningPathId: this._props.learningPathId.toString(),
			}),
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

	get createdAt(): Date {
		return this._props.createdAt;
	}

	get updatedAt(): Date | null {
		return this._props.updatedAt;
	}

	get totalUnitCount(): number {
		return this._props.totalUnitCount;
	}

	get completedUnitCount(): number {
		return this._props.completedUnitCount;
	}
}
