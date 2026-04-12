import { Inject, Injectable } from '@nestjs/common';
import { Neo4jService } from '@/infra/neo4j/neo4j.service';
import type { ISkillGraph } from '@/domain/interfaces';
import { Skill, SkillRelationshipType } from '@/domain/skills';
import { SkillId, SkillRelationship } from '@/domain/skills';
import type { Slug } from '@/domain/common';
import { DbException } from '../exceptions/db.exception';
import type { Record } from 'neo4j-driver';

@Injectable()
export class Neo4jSkillGraphAdapter implements ISkillGraph {
	constructor(
		@Inject(Neo4jService) private readonly neo4jService: Neo4jService,
	) {}

	private mapNode(record: Record, alias: string = 's'): Skill {
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

	async save(aggregate: Skill): Promise<void> {
		try {
			const query = /*cypher*/ `
				MERGE (s:Skill {id: $id})
				SET s.name = $name,
					s.isRoot = $isRoot,
					s.slug = $slug,
					s.parentId = $parentId
			`;

			await this.neo4jService.db.executeQuery(query, {
				id: aggregate.id.toString(),
				name: aggregate.name.toString(),
				isRoot: aggregate.isRoot,
				slug: aggregate.slug.toString(),
				parentId: aggregate.parentId?.toString() ?? null,
			});
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}
	async remove(id: SkillId): Promise<boolean> {
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
			const query = /*cypher*/ `
				MATCH (fromSkill:Skill {id: $fromId})
				MATCH (toSkill:Skill {id: $toId})
				MERGE (fromSkill)-[:$($relType)]->(toSkill)
			`;

			await this.neo4jService.db.executeQuery(query, {
				fromId,
				toId,
				relType: relationship.type,
			});
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}
	async unlink(relationship: SkillRelationship): Promise<void> {
		try {
			const fromId = relationship.fromId.toString();
			const toId = relationship.toId.toString();

			const query = /*cypher*/ `
					MATCH (fromSkill:Skill {id: $fromId})-[r:$($relType)]->(toSkill:Skill {id: $toId})
					DELETE r
				`;

			await this.neo4jService.db.executeQuery(query, {
				fromId,
				toId,
				relType: relationship.type,
			});
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}

	async findById(id: SkillId): Promise<Skill | null> {
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

			return this.mapNode(record);
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}
	async findBySlug(slug: Slug): Promise<Skill | null> {
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

			return this.mapNode(record);
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}

	async getPrerequisiteGraph(parentId: SkillId | null) {
		try {
			const query = /* cypher */ `
				MATCH (prerequisite:Skill)
				WHERE prerequisite.parentId = $parentId 
					OR (prerequisite.parentId IS NULL AND $parentId IS NULL)
				OPTIONAL MATCH (prerequisite)<-[r:NEXT_STEP_OF]-(target:Skill)
				WHERE target.parentId = prerequisite.parentId 
					OR (target.parentId IS NULL AND prerequisite.parentId IS NULL)
				RETURN prerequisite, r, target
			`;

			const { records } = await this.neo4jService.db.executeQuery(query, {
				parentId: parentId?.toString() ?? null,
			});

			const nodes: Skill[] = [];
			const edges: SkillRelationship[] = [];

			records.forEach((record) => {
				const prerequisite = this.mapNode(record, 'prerequisite');

				nodes.push(prerequisite);

				if (record.get('target')) {
					const target = this.mapNode(record, 'target');
					const edge = SkillRelationship.create({
						fromId: target.id,
						toId: prerequisite.id,
						type: SkillRelationshipType.NEXT_STEP_OF,
					});
					edges.push(edge);
				}
			});

			return {
				nodes,
				edges,
			};
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}

	async listIncoming(
		id: SkillId,
		relationshipType: SkillRelationshipType,
	): Promise<Skill[]> {
		try {
			const query = /*cypher*/ `
				MATCH (s:Skill {id: $id})<-[:$($relType)]-(incoming:Skill)
				RETURN incoming
			`;

			const result = await this.neo4jService.db.executeQuery(query, {
				id: id.toString(),
				relType: relationshipType,
			});

			return result.records.map((record) => this.mapNode(record, 'incoming'));
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}
	async listOutgoing(
		id: SkillId,
		relationshipType: SkillRelationshipType,
	): Promise<Skill[]> {
		try {
			const query = /*cypher*/ `
				MATCH (s:Skill {id: $id})-[:$($relType)]->(outgoing:Skill)
				RETURN outgoing
			`;

			const result = await this.neo4jService.db.executeQuery(query, {
				id: id.toString(),
				relType: relationshipType,
			});

			return result.records.map((record) => this.mapNode(record, 'outgoing'));
		} catch (err) {
			throw new DbException('neo4j error', err);
		}
	}
}
