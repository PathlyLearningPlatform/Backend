import { UUID, ValueObject } from '@/domain/common';

type Props = {
  value: UUID;
};

export class LearningPathId extends ValueObject<Props> {
  private readonly _brand: 'learningPathId' = 'learningPathId';

  get value(): UUID {
    return this._props.value;
  }

  toString(): string {
    return this._props.value.toString();
  }

  static create(value: UUID): LearningPathId {
    return new LearningPathId({ value });
  }
}
