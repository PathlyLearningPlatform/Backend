import { UUID, ValueObject } from '@/domain/common';

type Props = {
  value: UUID;
};

export class LearningPathProgressId extends ValueObject<Props> {
  private readonly _brand: 'learningPathProgressId' = 'learningPathProgressId';

  get value(): UUID {
    return this._props.value;
  }

  toString(): string {
    return this._props.value.toString();
  }

  static create(value: UUID): LearningPathProgressId {
    return new LearningPathProgressId({ value });
  }
}
