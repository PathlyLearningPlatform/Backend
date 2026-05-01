import { UserRole } from './enums';

export type UserInfo = {
	id: string;
	roles: UserRole[];
};
