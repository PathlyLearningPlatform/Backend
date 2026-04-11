import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSkillBodyDto {
	@ApiPropertyOptional({
		type: 'string',
	})
	name?: string;
}
