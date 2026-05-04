import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('internal')
@Controller()
export class AppController {
	@Get('healthcheck')
	@HttpCode(HttpStatus.NO_CONTENT)
	healthcheck() {}
}
