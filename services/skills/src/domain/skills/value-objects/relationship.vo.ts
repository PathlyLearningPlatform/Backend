import { ValueObject, UUID } from '@domain/common';
import { SkillId } from './id.vo';
import { SkillRelationshipType } from './relationship-type.vo';
import { SkillCannotReferenceItselfException } from '../exceptions';

type Props = {
	fromId: SkillId;
	toId: SkillId;
	type: SkillRelationshipType;
};

export class SkillRelationship extends ValueObject<Props> {
	get fromId(): SkillId {
		return this._props.fromId;
	}

	get toId(): SkillId {
		return this._props.toId;
	}

	get type(): SkillRelationshipType {
		return this._props.type;
	}

	get isDirectional(): boolean {
		return [
			SkillRelationshipType.PREREQUISITE_OF,
			SkillRelationshipType.PART_OF,
		].includes(this._props.type);
	}

	static create(props: Props): SkillRelationship {
		if (props.fromId.equals(props.toId)) {
			throw new SkillCannotReferenceItselfException();
		}
		return new SkillRelationship(props);
	}
}
