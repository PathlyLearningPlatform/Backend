import { ApiProperty } from '@nestjs/swagger';

export class AddChildBodyDto {
	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	parentSkillId!: string;

	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	childSkillId!: string;
}
