import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { QuestionResponseDto } from './response.dto';

export class UpdateQuestionDto {
	@ApiPropertyOptional()
	content?: string;

	@ApiPropertyOptional()
	correctAnswer?: string;
}

export class UpdateQuestionResponseDto {
	@ApiProperty({
		type: QuestionResponseDto,
	})
	question: QuestionResponseDto;
}
