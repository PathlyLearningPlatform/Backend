import { Inject, Injectable, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigException } from '@infra/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Pool } from 'pg';
import { DiToken } from '@infra/common';
import type { Config } from '../config/type';
import type * as schema from './schemas';
import { AppLogger } from '../logger';

@Injectable()
export class DbService implements OnModuleInit {
	private readonly dbConfig: Config['db'];

	constructor(
		@Inject(DiToken.DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
		@Inject(DiToken.PG_POOL) private readonly pool: Pool,
		@Inject(ConfigService)
		private readonly configService: ConfigService,
		@Inject(AppLogger)
		private readonly appLogger: AppLogger,
	) {
		const dbConfig = this.configService.get<Config['db']>('db');

		if (!dbConfig) {
			throw new ConfigException('failed to load db config');
		}

		this.dbConfig = dbConfig;
	}

	onModuleInit() {
		this.appLogger.log(
			`Connected to postgres on url: posgtres://${this.dbConfig.user}:***@${this.dbConfig.host}:${this.dbConfig.port}/${this.dbConfig.name}`,
		);
	}

	getDb() {
		return this.db;
	}

	async close() {
		await this.pool.end();
	}
}
