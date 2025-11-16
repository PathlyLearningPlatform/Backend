import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('healthcheck')
  @HttpCode(HttpStatus.OK)
  healthcheck() {}
}
