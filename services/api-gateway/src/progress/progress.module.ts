import { Module } from '@nestjs/common'
import { ActivityProgressModule } from './activities/activities.module'
import { RouterModule } from '@nestjs/core'
import { LessonProgressModule } from './lessons/lessons.module'
import { UnitProgressModule } from './units/units.module'
import { SectionProgressModule } from './sections/sections.module'
import { LearningPathProgressModule } from './learning-paths/learning-paths.module'
import { SkillProgressModule } from './skills/skills.module'

@Module({
	imports: [
		ActivityProgressModule,
		LessonProgressModule,
		UnitProgressModule,
		SectionProgressModule,
		LearningPathProgressModule,
		SkillProgressModule,
		RouterModule.register([
			{
				path: 'v1/progress',
				module: ActivityProgressModule,
			},
			{
				path: 'v1/progress',
				module: LessonProgressModule,
			},
			{
				path: 'v1/progress',
				module: UnitProgressModule,
			},
			{
				path: 'v1/progress',
				module: SectionProgressModule,
			},
			{
				path: 'v1/progress',
				module: LearningPathProgressModule,
			},
			{
				path: 'v1/progress',
				module: SkillProgressModule,
			},
		]),
	],
})
export class ProgressModule {}
