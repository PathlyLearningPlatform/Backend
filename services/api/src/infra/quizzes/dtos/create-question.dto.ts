import { ApiProperty } from '@nestjs/swagger';
import { QuestionResponseDto } from './response.dto';

export class CreateQuestionDto {
	@ApiProperty()
	content: string;

	@ApiProperty()
	correctAnswer: string;
}

export class CreateQuestionResponseDto {
	@ApiProperty({
		type: QuestionResponseDto,
	})
	question: QuestionResponseDto;
}
