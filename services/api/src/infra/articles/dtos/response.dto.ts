import { ApiProperty } from '@nestjs/swagger';
import { ActivityResponseDto } from '@/infra/activities/dtos';

export class ArticleResponseDto extends ActivityResponseDto {
	@ApiProperty({
		type: 'string',
	})
	ref!: string;
}
