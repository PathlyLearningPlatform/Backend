import { Inject, Injectable } from '@nestjs/common';
import { Neo4jService } from '../common/neo4j/neo4j.service';
import type { ISkillGraph } from '@/domain/interfaces';
import { Skill } from '@/domain/skills';
import type { SkillId, SkillRelationship } from '@/domain/skills';
import type { Slug } from '@/domain/common';
import { SkillNotFoundException } from '@/domain/exceptions';
import { DbException } from '../common/exceptions/db.exception';
import type { Record } from 'neo4j-driver';

@Injectable()
export class Neo4jSkillGraphAdapter implements ISkillGraph {
	constructor(
		@Inject(Neo4jService) private readonly neo4jService: Neo4jService,
	) {}

	private mapSkillNode(record: Record, alias: string = 's'): Skill {
		const node = record.get(alias) as {
			properties: {
				id: string;
				name: string;
				isRoot: boolean;
				slug: string;
				parentId: string | null;
			};
		};

		const props = node.properties;

		return Skill.fromDataSource({
			id: props.id,
			name: props.name,
			isRoot: props.isRoot,
			slug: props.slug,
			parentId: props.parentId,
		});
	}

	private async assertSkillExists(skillId: string): Promise<void> {
		const query = /*cypher*/ `
			MATCH (s:Skill {id: $skillId})
			RETURN count(s) > 0 AS exists
		`;

		const result = await this.neo4jService.db.executeQuery(query, {
			skillId,
		});
		const exists = result.records[0]?.get('exists') as boolean | undefined;

		if (!exists) {
			throw new SkillNotFoundException(skillId);
		}
	}

	async saveSkill(aggreagate: Skill): Promise<void> {
		try {
			const query = /*cypher*/ `
				MERGE (s:Skill {id: $id})
				SET s.name = $name,
					s.isRoot = $isRoot,
					s.slug = $slug,
					s.parentId = $parentId
			`;

			await this.neo4jService.db.executeQuery(query, {
				id: aggreagate.id.toString(),
				name: aggreagate.name.toString(),
				isRoot: aggreagate.isRoot,
				slug: aggreagate.slug.toString(),
				parentId: aggreagate.parentId?.toString() ?? null,
			});
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}

	async removeSkill(id: SkillId): Promise<boolean> {
		try {
			const query = /*cypher*/ `
				MATCH (s:Skill {id: $id})
				DETACH DELETE s
			`;

			const result = await this.neo4jService.db.executeQuery(query, {
				id: id.toString(),
			});

			return result.summary.counters.containsUpdates();
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}

	async link(relationship: SkillRelationship): Promise<void> {
		const fromId = relationship.fromId.toString();
		const toId = relationship.toId.toString();

		try {
			await this.assertSkillExists(fromId);
			await this.assertSkillExists(toId);

			const query = /*cypher*/ `
				MATCH (fromSkill:Skill {id: $fromId})
				MATCH (toSkill:Skill {id: $toId})
				MERGE (fromSkill)-[:\`${relationship.type}\`]->(toSkill)
			`;

			await this.neo4jService.db.executeQuery(query, {
				fromId,
				toId,
			});
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}

	async unlink(relationship: SkillRelationship): Promise<void> {
		try {
			const fromId = relationship.fromId.toString();
			const toId = relationship.toId.toString();

			await this.assertSkillExists(fromId);
			await this.assertSkillExists(toId);

			const query = relationship.isDirectional
				? /*cypher*/ `
					MATCH (fromSkill:Skill {id: $fromId})-[r:\`${relationship.type}\`]->(toSkill:Skill {id: $toId})
					DELETE r
				`
				: /*cypher*/ `
					MATCH (fromSkill:Skill {id: $fromId})-[r:\`${relationship.type}\`]-(toSkill:Skill {id: $toId})
					DELETE r
				`;

			await this.neo4jService.db.executeQuery(query, {
				fromId,
				toId,
			});
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}

	async findRootSkill(): Promise<Skill | null> {
		try {
			const query = /*cypher*/ `
				MATCH (s:Skill {isRoot: true})
				RETURN s
				LIMIT 1
			`;

			const result = await this.neo4jService.db.executeQuery(query, {});
			const record = result.records[0];

			if (!record) {
				return null;
			}

			return this.mapSkillNode(record);
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}

	async findSkillById(id: SkillId): Promise<Skill | null> {
		try {
			const query = /*cypher*/ `
				MATCH (s:Skill {id: $id})
				RETURN s
				LIMIT 1
			`;

			const result = await this.neo4jService.db.executeQuery(query, {
				id: id.toString(),
			});

			const record = result.records[0];

			if (!record) {
				return null;
			}

			return this.mapSkillNode(record);
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}

	async findSkillBySlug(slug: Slug): Promise<Skill | null> {
		try {
			const query = /*cypher*/ `
				MATCH (s:Skill {slug: $slug})
				RETURN s
				LIMIT 1
			`;

			const result = await this.neo4jService.db.executeQuery(query, {
				slug: slug.toString(),
			});

			const record = result.records[0];

			if (!record) {
				return null;
			}

			return this.mapSkillNode(record);
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}

	async listCommonSkills(id: SkillId): Promise<Skill[]> {
		try {
			const query = /*cypher*/ `
				MATCH (s:Skill {id: $id})-[:COMMON_WITH]-(other:Skill)
				RETURN DISTINCT other
			`;

			const result = await this.neo4jService.db.executeQuery(query, {
				id: id.toString(),
			});

			return result.records.map((record) => this.mapSkillNode(record, 'other'));
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}

	async listSkillAlternatives(id: SkillId): Promise<Skill[]> {
		try {
			const query = /*cypher*/ `
				MATCH (s:Skill {id: $id})-[:ALTERNATIVE_TO]-(other:Skill)
				RETURN DISTINCT other
			`;

			const result = await this.neo4jService.db.executeQuery(query, {
				id: id.toString(),
			});

			return result.records.map((record) => this.mapSkillNode(record, 'other'));
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}

	async listSkillChildren(id: SkillId): Promise<Skill[]> {
		try {
			const query = /*cypher*/ `
				MATCH (child:Skill)-[:PART_OF]->(parent:Skill {id: $id})
				RETURN DISTINCT child
			`;

			const result = await this.neo4jService.db.executeQuery(query, {
				id: id.toString(),
			});

			return result.records.map((record) => this.mapSkillNode(record, 'child'));
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}

	async listSkillPrerequisities(id: SkillId): Promise<Skill[]> {
		try {
			const query = /*cypher*/ `
				MATCH (prerequisite:Skill)-[:PREREQUISITE_OF]->(target:Skill {id: $id})
				RETURN DISTINCT prerequisite
			`;

			const result = await this.neo4jService.db.executeQuery(query, {
				id: id.toString(),
			});

			return result.records.map((record) =>
				this.mapSkillNode(record, 'prerequisite'),
			);
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}

	async relationshipExists(relationship: SkillRelationship): Promise<boolean> {
		try {
			const fromId = relationship.fromId.toString();
			const toId = relationship.toId.toString();

			await this.assertSkillExists(fromId);
			await this.assertSkillExists(toId);

			const query = relationship.isDirectional
				? /*cypher*/ `
					MATCH (fromSkill:Skill {id: $fromId})-[r:\`${relationship.type}\`]->(toSkill:Skill {id: $toId})
					RETURN count(r) > 0 AS exists
				`
				: /*cypher*/ `
					MATCH (fromSkill:Skill {id: $fromId})-[r:\`${relationship.type}\`]-(toSkill:Skill {id: $toId})
					RETURN count(r) > 0 AS exists
				`;

			const result = await this.neo4jService.db.executeQuery(query, {
				fromId,
				toId,
			});

			const exists = result.records[0]?.get('exists') as boolean | undefined;

			return Boolean(exists);
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}
}
