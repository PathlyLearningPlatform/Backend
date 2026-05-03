import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProjectAdminController } from './projects/projects.controller';
import { ProjectsModule } from '../projects/projects.module';
import { ExercisesModule } from '../exercises/exercises.module';
import { ExerciseAdminController } from './exercises/exercises.controller';

@Module({
	imports: [AuthModule, ProjectsModule, ExercisesModule],
	controllers: [ProjectAdminController, ExerciseAdminController],
})
export class AdminModule {}
