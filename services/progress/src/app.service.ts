import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Event } from './domain/common';
import { DiToken } from './infra/common';
import { OnActivityCompletedHandler } from './app/activity-progress/events';
import { ActivityCompletedEvent } from './domain/activity-progress';

@Injectable()
export class AppService implements OnModuleInit {
	constructor(
		@Inject(DiToken.ON_ACTIVITY_COMPLETED_HANDLER)
		private readonly onActivityCompletedHandler: OnActivityCompletedHandler,
	) {}

	onModuleInit() {}

	@OnEvent(Event.ACTIVITY_COMPLETED)
	async handleActivityCompletedEvent(event: ActivityCompletedEvent) {
		await this.onActivityCompletedHandler.handle(event);
	}

	@OnEvent(Event.LESSON_COMPLETED)
	handleLessonCompletedEvent() {}

	@OnEvent(Event.UNIT_COMPLETED)
	handleUnitCompletedEvent() {}

	@OnEvent(Event.SECTION_COMPLETED)
	handleSectionCompletedEvent() {}

	@OnEvent(Event.LEARNING_PATH_COMPLETED)
	handleLearningPathCompletedEvent() {}
}
