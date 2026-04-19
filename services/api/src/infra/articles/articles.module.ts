import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { AuthModule } from '../auth/auth.module';
import { LessonsModule } from '../lessons/lessons.module';
import { articleHandlersProvider } from './handlers.provider';
import { ArticlesController } from './articles.controller';
import { PostgresArticleRepository } from './postgres.repository';

@Module({
	imports: [DbModule, AuthModule, LessonsModule],
	controllers: [ArticlesController],
	providers: [...articleHandlersProvider, PostgresArticleRepository],
	exports: [...articleHandlersProvider, PostgresArticleRepository],
})
export class ArticlesModule {}
