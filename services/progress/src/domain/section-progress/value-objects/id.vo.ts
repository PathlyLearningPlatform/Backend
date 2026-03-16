import { UUID, ValueObject } from '@/domain/common';

type Props = {
  value: UUID;
};

export class SectionProgressId extends ValueObject<Props> {
  private readonly _brand: 'sectionProgressId' = 'sectionProgressId';

  get value(): UUID {
    return this._props.value;
  }

  toString(): string {
    return this._props.value.toString();
  }

  static create(value: UUID): SectionProgressId {
    return new SectionProgressId({ value });
  }
}
