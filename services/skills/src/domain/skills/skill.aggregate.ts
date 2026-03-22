import { AggregateRoot, Slug, UUID } from '../common';
import { RootSkillParentException } from './exceptions';
import { SkillName } from './value-objects';
import { SkillId } from './value-objects/id.vo';

export type SkillProps = {
	name: SkillName;
	slug: Slug;
	isRoot: boolean;
	parentId: SkillId | null;
};
export type CreateSkillProps = {
	name: SkillName;
	isRoot?: boolean;
	parentId?: SkillId | null;
};
export type SkillFromDataSourceProps = {
	id: string;
	name: string;
	slug: string;
	isRoot: boolean;
	parentId: string | null;
};
export type UpdateSkillProps = Partial<{
	name: SkillName;
}>;

export class Skill extends AggregateRoot<SkillId, SkillProps> {
	private readonly _props: SkillProps;

	private constructor(id: SkillId, props: SkillProps) {
		super(id);
		this._props = props;
	}

	static create(id: SkillId, props: CreateSkillProps): Skill {
		if (props.isRoot && !props.parentId) {
			throw new RootSkillParentException();
		}

		return new Skill(id, {
			name: props.name,
			slug: Slug.create(props.name.toString()),
			isRoot: props.isRoot ?? false,
			parentId: props.parentId ?? null,
		});
	}

	static fromDataSource(props: SkillFromDataSourceProps): Skill {
		const skillId = SkillId.create(UUID.create(props.id));

		return new Skill(skillId, {
			name: SkillName.create(props.name),
			slug: Slug.create(props.slug),
			isRoot: props.isRoot,
			parentId: props.parentId
				? SkillId.create(UUID.create(props.parentId))
				: null,
		});
	}

	update(props?: UpdateSkillProps) {
		if (props?.name) {
			this._props.name = props.name;
		}
	}

	get id(): SkillId {
		return this._id;
	}

	get name(): SkillName {
		return this._props.name;
	}

	get slug(): Slug {
		return this._props.slug;
	}

	get isRoot(): boolean {
		return this._props.isRoot;
	}

	get parentId(): SkillId | null {
		return this._props.parentId;
	}
}
