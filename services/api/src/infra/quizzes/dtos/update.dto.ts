import { ApiProperty } from '@nestjs/swagger';
import { UpdateActivityDto } from '@infra/activities/dtos/update.dto';
import { QuizResponseDto } from './response.dto';

export class UpdateQuizDto extends UpdateActivityDto {}

export class UpdateQuizResponseDto {
	@ApiProperty({ type: QuizResponseDto })
	quiz: QuizResponseDto;
}
