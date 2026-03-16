import { AggregateRoot, UserId, UUID } from '../common';
import { LearningPathCompletedEvent } from './events';
import { LearningPathId, LearningPathProgressId } from './value-objects';

export type LearningPathProgressProps = {
  learningPathId: LearningPathId;
  userId: UserId;
  completedAt: Date | null;
  completedSectionCount: number;
  totalSectionCount: number;
};

export type LearningPathProgressFromDataSourceProps = {
  id: string;
  learningPathId: string;
  userId: string;
  completedAt: Date | null;
  completedSectionCount: number;
  totalSectionCount: number;
};

export type CreateLearningPathProgressProps = {
  learningPathId: LearningPathId;
  userId: UserId;
  totalSectionCount: number;
};

export class LearningPathProgress extends AggregateRoot<
  LearningPathProgressId,
  LearningPathProgressProps
> {
  private readonly _props: LearningPathProgressProps;

  private constructor(id: LearningPathProgressId, props: LearningPathProgressProps) {
    super(id);
    this._props = props;
  }

  static fromDataSource(props: LearningPathProgressFromDataSourceProps): LearningPathProgress {
    const id = LearningPathProgressId.create(UUID.create(props.id));
    const learningPathId = LearningPathId.create(UUID.create(props.learningPathId));
    const userId = UserId.create(UUID.create(props.userId));

    return new LearningPathProgress(id, {
      learningPathId,
      userId,
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
      learningPathId: props.learningPathId,
      completedAt: null,
      userId: props.userId,
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
        this._props.learningPathId.toString(),
        this._props.userId.toString(),
        now,
      ),
    );
  }

  get id(): LearningPathProgressId {
    return this._id;
  }

  get learningPathId(): LearningPathId {
    return this._props.learningPathId;
  }


  get userId(): UserId {
    return this._props.userId;
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
