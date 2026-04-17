import { ApiProperty } from '@nestjs/swagger';
import { CreateActivityDto } from '@infra/activities/dtos/create.dto';
import { ArticleResponseDto } from './response.dto';

export class CreateArticleDto extends CreateActivityDto {
	@ApiProperty({
		type: 'string',
	})
	ref!: string;
}

export class CreateArticleResponseDto {
	@ApiProperty({ type: ArticleResponseDto })
	article!: ArticleResponseDto;
}
