import { ApiProperty } from '@nestjs/swagger';

export class AddSkillNextStepBodyDto {
	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	prerequisiteSkillId!: string;

	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	targetSkillId!: string;
}
