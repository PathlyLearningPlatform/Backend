import { ActivityCompletedEvent } from '@/domain/activity-progress/events';
import { Event } from '@/domain/common';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { OnActivityCompletedHandler } from '@/app/handlers';
import { DiToken } from '../common';

@Injectable()
export class EventHandler {
	constructor(
		@Inject(DiToken.ON_ACTIVITY_COMPLETED_HANDLER)
		private readonly onActivityCompletedHandler: OnActivityCompletedHandler,
	) {}

	@OnEvent(Event.ACTIVITY_COMPLETED)
	async handleActivityCompleted(event: ActivityCompletedEvent) {
		await this.onActivityCompletedHandler.handle(event);
	}
}
