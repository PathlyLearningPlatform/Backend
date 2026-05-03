import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProjectAdminController } from './projects/projects.controller';
import { ProjectsModule } from '../projects/projects.module';

@Module({
	imports: [AuthModule, ProjectsModule],
	providers: [],
	controllers: [ProjectAdminController],
})
export class AdminModule {}
