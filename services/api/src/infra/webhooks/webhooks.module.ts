import { Module } from '@nestjs/common';
import { ProjectModule } from '../projects/projects.module';
import { WebhooksController } from './webhooks.controller';

@Module({
	imports: [ProjectModule],
	controllers: [WebhooksController],
})
export class WebhooksModule {}
