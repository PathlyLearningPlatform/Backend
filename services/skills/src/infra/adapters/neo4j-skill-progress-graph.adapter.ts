import { Inject, Injectable } from '@nestjs/common';
import { Neo4jService } from '../common/neo4j/neo4j.service';
import { ISkillProgressGraph } from '@/domain/interfaces';
import { SkillProgress, SkillProgressId } from '@/domain/skill-progress';
import { DbException } from '../common/exceptions/db.exception';
import { UserId } from '@/domain/common';
import { Record } from 'neo4j-driver';

@Injectable()
export class Neo4jSkillProgressGraphAdapter implements ISkillProgressGraph {
	constructor(
		@Inject(Neo4jService) private readonly neo4jService: Neo4jService,
	) {}

	async save(aggregate: SkillProgress): Promise<void> {
		try {
			const query = /* cypher */ `
        MATCH (s:Skill {id: $skillId})
        MERGE (u:User {id: $userId})
        MERGE (u)-[:HAS {unlockedAt: $unlockedAt}]->(s)
        FINISH
      `;

			await this.neo4jService.db.executeQuery(query, {
				skillId: aggregate.id.skillId.toString(),
				userId: aggregate.id.userId.toString(),
				unlockedAt: aggregate.unlockedAt.toISOString(),
			});
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}

	async findForUser(userId: UserId): Promise<SkillProgress[]> {
		try {
			const query = /* cypher */ `
        MATCH (u:User {id: $userId})-[r:HAS]->(s:Skill)
        RETURN r.unlockedAt as unlockedAt, s.id as skillId
      `;

			const result = await this.neo4jService.db.executeQuery(query, {
				userId: userId.toString(),
			});

			return result.records.map((record) =>
				SkillProgress.fromDataSource({
					skillId: record.get('skillId'),
					userId: userId.toString(),
					unlockedAt: new Date(record.get('unlockedAt')),
				}),
			);
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}

	async load(id: SkillProgressId): Promise<SkillProgress | null> {
		try {
			const query = /* cypher */ `
        MATCH (u:User {id: $userId})-[r:HAS]->(s:Skill {id: $skillId})
        RETURN r.unlockedAt as unlockedAt
      `;

			const result = await this.neo4jService.db.executeQuery(query, {
				userId: id.userId.toString(),
				skillId: id.skillId.toString(),
			});

			if (result.records.length === 0) {
				return null;
			}

			const record = result.records[0];
			return SkillProgress.fromDataSource({
				skillId: id.skillId.toString(),
				userId: id.userId.toString(),
				unlockedAt: new Date(record.get('unlockedAt')),
			});
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}

	async remove(id: SkillProgressId): Promise<boolean> {
		try {
			const query = /* cypher */ `
        MATCH (u:User {id: $userId})-[r:HAS]->(s:Skill {id: $skillId})
        DELETE r
        RETURN count(r) as count
      `;

			const result = await this.neo4jService.db.executeQuery(query, {
				userId: id.userId.toString(),
				skillId: id.skillId.toString(),
			});

			return result.records[0].get('count').toNumber() > 0;
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}
}
