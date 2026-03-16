import { AggregateRoot, UserId, UUID } from '../common';
import { LearningPathId } from '../learning-path-progress';
import { SectionCompletedEvent } from './events';
import { SectionId, SectionProgressId } from './value-objects';

export type SectionProgressProps = {
  sectionId: SectionId;
  learningPathId: LearningPathId;
  userId: UserId;
  completedAt: Date | null;
  completedUnitCount: number;
  totalUnitCount: number;
};

export type SectionProgressFromDataSourceProps = {
  id: string;
  sectionId: string;
  learningPathId: string;
  userId: string;
  completedAt: Date | null;
  completedUnitCount: number;
  totalUnitCount: number;
};

export type CreateSectionProgressProps = {
  sectionId: SectionId;
  learningPathId: LearningPathId;
  userId: UserId;
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

  static fromDataSource(props: SectionProgressFromDataSourceProps): SectionProgress {
    const id = SectionProgressId.create(UUID.create(props.id));
    const sectionId = SectionId.create(UUID.create(props.sectionId));
    const userId = UserId.create(UUID.create(props.userId));
    const learningPathId = LearningPathId.create(UUID.create(props.learningPathId));

    return new SectionProgress(id, {
      sectionId,
      userId,
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
      sectionId: props.sectionId,
      completedAt: null,
      learningPathId: props.learningPathId,
      userId: props.userId,
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
        this._props.sectionId.toString(),
        this._props.learningPathId.toString(),
        this._props.userId.toString(),
        now,
      ),
    );
  }

  get id(): SectionProgressId {
    return this._id;
  }

  get sectionId(): SectionId {
    return this._props.sectionId;
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

  get totalUnitCount(): number {
    return this._props.totalUnitCount;
  }

  get completedUnitCount(): number {
    return this._props.completedUnitCount;
  }
}
