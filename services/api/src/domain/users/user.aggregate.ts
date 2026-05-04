import { AggregateRoot, Email, UserId, UUID } from '../common';

export type UserProps = {
	email: Email;
	username: string;
};
export type CreateUserProps = { email: Email; username: string };
export type UserFromDataSourceProps = {
	id: string;
	email: string;
	username: string;
};

export class User extends AggregateRoot<UserId, UserProps> {
	private _props: UserProps;

	private constructor(id: UserId, props: UserProps) {
		super(id);
		this._props = props;
	}

	static create(id: UserId, props: CreateUserProps): User {
		return new User(id, {
			email: props.email,
			username: props.username,
		});
	}

	static fromDataSource(props: UserFromDataSourceProps): User {
		const userId = UserId.create(UUID.create(props.id));
		return new User(userId, {
			username: props.username,
			email: Email.create(props.email),
		});
	}

	get id(): UserId {
		return this._id;
	}

	get email(): Email {
		return this._props.email;
	}

	get username(): string {
		return this._props.username;
	}
}
