import { Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { WebhooksController } from './webhooks.controller';

@Module({
	imports: [ProjectsModule],
	controllers: [WebhooksController],
})
export class WebhooksModule {}
