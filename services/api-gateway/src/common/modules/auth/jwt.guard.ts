import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { HttpErrorDto } from '@pathly-backend/common/index.js'
import { Request } from 'express'
import { JsonWebTokenError, JwtPayload } from 'jsonwebtoken'

@Injectable()
export class JwtGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const httpCtx = context.switchToHttp()
		const request = httpCtx.getRequest() as Request

		const authorizationHeader = request.headers.authorization

		if (!authorizationHeader) {
			throw new UnauthorizedException()
		}

		const [type, token] = authorizationHeader.split(' ') ?? []

		if (type !== 'Bearer') {
			throw new BadRequestException(
				new HttpErrorDto('token type must be bearer'),
			)
		}

		if (!token) {
			throw new UnauthorizedException(new HttpErrorDto('no token provided'))
		}

		try {
			const payload = await this.jwtService.verifyAsync<JwtPayload>(token)

			if (!payload.sub) {
				throw new BadRequestException(
					new HttpErrorDto('no sub field present in jwt'),
				)
			}

			request.auth = {
				user: {
					id: payload.sub,
				},
			}
		} catch (err) {
			if (err instanceof JsonWebTokenError) {
				const message = err.message

				throw new UnauthorizedException(new HttpErrorDto(message), {
					cause: err,
				})
			}

			throw err
		}

		return true
	}
}
