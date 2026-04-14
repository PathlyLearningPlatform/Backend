import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetPrerequisiteGraphQueryDto {
	@ApiPropertyOptional({
		type: 'string',
		format: 'uuid',
	})
	parentSkillId?: string;
}

export class ListSkillProgressQueryDto {
	@ApiPropertyOptional()
	limit?: number;

	@ApiPropertyOptional()
	page?: number;
}
