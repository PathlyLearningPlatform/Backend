import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { Roles } from './decorators';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	private matchRoles(required: string[], provided: string[]): boolean {
		const roles = new Set<string>(provided);

		for (const role of required) {
			if (!roles.has(role)) {
				return false;
			}
		}

		return true;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const roles = this.reflector.get(Roles, context.getHandler());

		if (roles.length === 0) {
			return true;
		}

		const request = context.switchToHttp().getRequest<Request>();
		const user = request.auth.user;

		return this.matchRoles(roles, user.roles);
	}
}
