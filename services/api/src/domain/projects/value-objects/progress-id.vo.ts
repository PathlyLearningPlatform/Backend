import { type UserId, ValueObject } from '@/domain/common';
import type { ProjectId } from './id.vo';

type Props = {
	projectId: ProjectId;
	userId: UserId;
};

export class ProjectProgressId extends ValueObject<Props> {
	get projectId(): ProjectId {
		return this._props.projectId;
	}

	get userId(): UserId {
		return this._props.userId;
	}

	static create(projectId: ProjectId, userId: UserId): ProjectProgressId {
		return new ProjectProgressId({ projectId, userId });
	}
}
