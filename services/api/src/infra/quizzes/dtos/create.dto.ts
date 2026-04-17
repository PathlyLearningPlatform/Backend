import { ApiProperty } from '@nestjs/swagger';
import { CreateActivityDto } from '@infra/activities/dtos/create.dto';
import { QuizResponseDto } from './response.dto';

export class CreateQuizDto extends CreateActivityDto {}

export class CreateQuizResponseDto {
	@ApiProperty({ type: QuizResponseDto })
	quiz: QuizResponseDto;
}
