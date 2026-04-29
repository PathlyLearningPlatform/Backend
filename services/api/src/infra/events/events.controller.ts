import { Controller, Sse, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiHeader, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { filter, map, Observable } from 'rxjs';
import { fromEvent } from 'rxjs';
import { User } from '../auth/user.decorator';
import { JwtGuard } from '../auth/jwt.guard';
import { type UserInfo } from '../auth/user-info.type';
import { DomainEvent } from '@/domain/common';
import { EventDto } from './dtos';

@UseGuards(JwtGuard)
@Controller({ path: 'events', version: '1' })
export class EventsController {
	constructor(private readonly eventEmitter: EventEmitter2) {}

	@Sse()
	@ApiOkResponse({
		type: EventDto,
		headers: {
			'Content-Type': {
				schema: {
					type: 'string',
					enum: ['text/event-stream'],
				},
			},
			'Cache-Control': {
				schema: { type: 'string', enum: ['no-cache'] },
			},
			Connection: {
				schema: { type: 'string', enum: ['keep-alive'] },
			},
		},
	})
	events(@User() user: UserInfo): Observable<MessageEvent> {
		return fromEvent<DomainEvent>(this.eventEmitter, '**').pipe(
			filter((val) => val.userId === user.id),
			map(
				(val) =>
					new MessageEvent(val.eventName, {
						data: {
							name: val.eventName,
							occuredAt: val.occuredAt.toISOString(),
							userId: val.userId,
							payload: val.payload,
						} as EventDto,
					}),
			),
		);
	}
}
