import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { AuthModule } from '../auth/auth.module';
import { LessonsModule } from '../lessons/lessons.module';
import { ActivitiesModule } from '../activities/activities.module';
import { articleHandlersProvider } from './handlers.provider';
import { ArticlesController } from './articles.controller';

@Module({
	imports: [DbModule, AuthModule, LessonsModule, ActivitiesModule],
	controllers: [ArticlesController],
	providers: [...articleHandlersProvider],
	exports: [...articleHandlersProvider],
})
export class ArticlesModule {}
