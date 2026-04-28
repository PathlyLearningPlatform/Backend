import { Controller, Sse, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiResponse } from '@nestjs/swagger';
import { filter, map, Observable } from 'rxjs';
import { fromEvent } from 'rxjs';
import { User } from '../auth/user.decorator';
import { JwtGuard } from '../auth/jwt.guard';
import { type UserInfo } from '../auth/user-info.type';
import { DomainEvent } from '@/domain/common';

@UseGuards(JwtGuard)
@Controller({ path: 'events', version: '1' })
export class EventsController {
	constructor(private readonly eventEmitter: EventEmitter2) {}

	@Sse()
	@ApiResponse({
		status: 200,
	})
	events(@User() user: UserInfo): Observable<MessageEvent> {
		return fromEvent<DomainEvent>(this.eventEmitter, '**').pipe(
			filter((val) => val.userId === user.id),
			map((val) => new MessageEvent('', { data: val })),
		);
	}
}
