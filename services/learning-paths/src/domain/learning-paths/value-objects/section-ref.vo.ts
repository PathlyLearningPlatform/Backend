import { ValueObject, UUID } from '@/domain/common';
import { SectionId } from '@/domain/sections/value-objects/id.vo';

type Props = {
	sectionId: SectionId;
	order: number;
};

type CreateProps = {
	sectionId: string;
	order: number;
};

export class SectionRef extends ValueObject<Props> {
	get sectionId(): SectionId {
		return this._props.sectionId;
	}

	get order(): number {
		return this._props.order;
	}

	static create(props: CreateProps) {
		return new SectionRef({
			sectionId: SectionId.create(props.sectionId),
			order: props.order,
		});
	}
}
