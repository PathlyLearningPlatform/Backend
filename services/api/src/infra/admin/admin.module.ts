import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { handlers } from './providers';
import { ProjectAdminController } from './controllers/projects.controller';

@Module({
	imports: [AuthModule],
	providers: [...handlers],
	controllers: [ProjectAdminController],
})
export class AdminModule {}
