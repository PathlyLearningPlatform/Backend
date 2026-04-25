import { ApiProperty } from '@nestjs/swagger';

class Repository {
	id!: number;
	name!: string;
	url!: string;
	created_at!: string;
}

class Organization {
	id!: number;
	login!: string;
}

class Sender {
	id!: string;
	login!: string;
}

class CheckRun {
	id!: number;
	name!: string;
	status!: string;
	conclussion!: string;
	started_at!: string;
	completed_at!: string;
}

export class GithubWebhookDto {
	@ApiProperty()
	action!: string;

	@ApiProperty({ type: Repository })
	repository!: Repository;

	@ApiProperty({ type: Organization })
	organization!: Organization;

	@ApiProperty({ type: Sender })
	sender!: Sender;

	@ApiProperty({ type: CheckRun })
	check_run?: CheckRun;
}
