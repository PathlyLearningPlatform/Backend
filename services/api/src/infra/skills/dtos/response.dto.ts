import { SkillRelationshipType } from '@/domain/skills';
import { ApiProperty } from '@nestjs/swagger';

export class SkillResponseDto {
	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	id!: string;

	@ApiProperty({
		type: 'string',
	})
	name!: string;

	@ApiProperty({
		type: 'string',
	})
	slug!: string;
}

export class SkillRelationshipResponseDto {
	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	fromId!: string;

	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	toId!: string;

	@ApiProperty({ enum: SkillRelationshipType })
	type!: SkillRelationshipType;
}

export class SkillGraphResponseDto {
	@ApiProperty({ type: [SkillResponseDto] })
	nodes!: SkillResponseDto[];

	@ApiProperty({ type: [SkillRelationshipResponseDto] })
	edges!: SkillRelationshipResponseDto[];
}

export class SkillProgressResponseDto {
	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	skillId!: string;

	@ApiProperty({
		type: 'string',
		format: 'uuid',
	})
	userId!: string;

	@ApiProperty({
		type: 'string',
		format: 'date-time',
	})
	unlockedAt!: string;
}
