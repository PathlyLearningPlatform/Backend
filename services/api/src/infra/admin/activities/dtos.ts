import { ActivityType } from '@/domain/activities';
import { ActivityResponseDto } from '@/infra/activities/dtos';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateActivityDto {
	@ApiProperty()
	declare name: string;

	@ApiPropertyOptional()
	declare description?: string;

	@ApiProperty({ format: 'uuid' })
	declare lessonId: string;

	@ApiProperty({ enum: ActivityType })
	declare type: ActivityType;
}
export class CreateActivityResponseDto {
	@ApiProperty({ type: ActivityResponseDto })
	declare data: ActivityResponseDto;
}

export class UpdateActivityDto {
	@ApiPropertyOptional()
	declare name?: string;

	@ApiPropertyOptional({ nullable: true })
	declare description?: string | null;
}
export class UpdateActivityResponseDto {
	@ApiProperty({ type: ActivityResponseDto })
	declare data: ActivityResponseDto;
}
