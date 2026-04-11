import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSkillBodyDto {
	@ApiProperty({
		type: 'string',
	})
	name!: string;

	@ApiPropertyOptional({
		type: 'string',
		format: 'uuid',
		nullable: true,
	})
	parentId?: string | null;
}
