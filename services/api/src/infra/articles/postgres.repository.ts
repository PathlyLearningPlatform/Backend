import { DbService } from '@/infra/db/db.service';
import { Inject, Injectable } from '@nestjs/common';
import { DbException } from '@infra/common';
import { eq } from 'drizzle-orm';
import type { Db } from '@/infra/db/types';
import { articlesTable } from '../db/schemas';
import { ActivitiesApiConstraints } from '../activities/enums';
import {
	IArticleRepository,
	ListArticlesOptions,
} from '@/domain/articles/repositories';
import { Article, ArticleId } from '@/domain/articles';

@Injectable()
export class PostgresArticleRepository implements IArticleRepository {
	private db: Db;

	constructor(@Inject(DbService) private readonly dbService: DbService) {
		this.db = this.dbService.getDb();
	}

	async findById(id: ArticleId): Promise<Article | null> {
		try {
			const [article] = await this.db
				.select()
				.from(articlesTable)
				.where(eq(articlesTable.id, id.primitive()));

			if (!article) {
				return null;
			}

			return Article.fromDataSource({
				id: article.id,
				createdAt: article.createdAt,
				updatedAt: article.updatedAt,
				name: article.name,
				description: article.description,
				ref: article.ref,
			});
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async list(options?: ListArticlesOptions): Promise<Article[]> {
		const limit =
			options?.options?.limit ?? ActivitiesApiConstraints.DEFAULT_LIMIT;
		const page =
			options?.options?.page ?? ActivitiesApiConstraints.DEFAULT_PAGE;

		try {
			const result = await this.db
				.select()
				.from(articlesTable)
				.limit(limit)
				.offset(limit * page);

			return result.map(Article.fromDataSource);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async remove(id: ArticleId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(articlesTable)
				.where(eq(articlesTable.id, id.primitive()));

			return result.rows.length > 0;
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async save(aggregate: Article): Promise<void> {
		try {
			await this.db
				.insert(articlesTable)
				.values({
					id: aggregate.id.primitive(),
					name: aggregate.name,
					description: aggregate.description,
					createdAt: aggregate.createdAt,
					updatedAt: aggregate.updatedAt,
					ref: aggregate.ref.value,
				})
				.onConflictDoUpdate({
					target: articlesTable.id,
					set: {
						name: aggregate.name,
						description: aggregate.description,
						ref: aggregate.ref.value,
						updatedAt: aggregate.updatedAt,
					},
				});
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}
}
