import { Email, UserId } from '@/domain/common';
import { User } from '../user.aggregate';

export interface IUserRepository {
	list(): Promise<User[]>;

	findById(id: UserId): Promise<User | null>;

	findByEmail(email: Email): Promise<User | null>;

	findByUsername(username: string): Promise<User | null>;

	save(aggregate: User): Promise<void>;

	remove(id: UserId): Promise<boolean>;
}
