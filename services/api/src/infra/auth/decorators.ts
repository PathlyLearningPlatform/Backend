import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { Reflector } from '@nestjs/core';

export const User = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<Request>();

		return request.auth.user;
	},
);

export const Roles = Reflector.createDecorator<string[]>();
