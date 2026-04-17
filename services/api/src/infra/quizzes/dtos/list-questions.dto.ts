import { ApiProperty } from '@nestjs/swagger';
import { QuestionResponseDto } from './response.dto';

export class ListQuestionsResponseDto {
	@ApiProperty({
		type: [QuestionResponseDto],
	})
	questions: QuestionResponseDto[];
}
