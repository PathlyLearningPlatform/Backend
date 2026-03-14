import { Module } from '@nestjs/common'
import { ActivityProgressModule } from './activities/activities.module'
import { RouterModule } from '@nestjs/core'
import { LessonProgressModule } from './lessons/lessons.module'

@Module({
	imports: [
		ActivityProgressModule,
		LessonProgressModule,
		RouterModule.register([
			{
				path: 'v1/progress',
				module: ActivityProgressModule,
			},
			{
				path: 'v1/progress',
				module: LessonProgressModule,
			},
		]),
	],
})
export class ProgressModule {}
