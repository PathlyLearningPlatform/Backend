import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProjectAdminController } from './projects/projects.controller';
import { ProjectsModule } from '../projects/projects.module';
import { ExercisesModule } from '../exercises/exercises.module';
import { ExerciseAdminController } from './exercises/exercises.controller';
import { ArticleAdminController } from './articles/articles.controller';
import { ArticlesModule } from '../articles/articles.module';
import { ActivitiesModule } from '../activities/activities.module';
import { ActivityAdminController } from './activities/activities.controller';

@Module({
	imports: [
		AuthModule,
		ProjectsModule,
		ExercisesModule,
		ArticlesModule,
		ActivitiesModule,
	],
	controllers: [
		ProjectAdminController,
		ExerciseAdminController,
		ArticleAdminController,
		ActivityAdminController,
	],
})
export class AdminModule {}
