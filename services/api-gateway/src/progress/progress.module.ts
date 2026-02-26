import { Module } from '@nestjs/common'
import { ActivityProgressModule } from './activities/activities.module'
import { RouterModule } from '@nestjs/core'

@Module({
	imports: [
		ActivityProgressModule,
		RouterModule.register([
			{
				path: 'v1/progress',
				module: ActivityProgressModule,
			},
		]),
	],
})
export class ProgressModule {}
