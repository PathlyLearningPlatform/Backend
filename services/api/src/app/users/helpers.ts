import { User } from '@/domain/users';
import { UserDto } from './dtos';

export function aggregateToDto(aggregate: User): UserDto {
	return {
		email: aggregate.email.value,
		id: aggregate.id.toString(),
		username: aggregate.username,
	};
}
