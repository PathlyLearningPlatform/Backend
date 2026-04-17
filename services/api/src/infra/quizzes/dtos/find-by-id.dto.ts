import { ApiProperty } from '@nestjs/swagger';
import { QuizResponseDto } from './response.dto';

export class FindQuizByIdResponseDto {
	@ApiProperty({ type: QuizResponseDto })
	quiz: QuizResponseDto;
}
