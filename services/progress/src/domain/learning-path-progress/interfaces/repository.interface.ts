import { LearningPathProgress } from '../learning-path-progress.aggregate';
import { LearningPathProgressId } from '../value-objects';

export interface ILearningPathProgressRepository {
  load(id: LearningPathProgressId): Promise<LearningPathProgress | null>;

  save(aggregate: LearningPathProgress): Promise<void>;

  remove(id: LearningPathProgressId): Promise<boolean>;
}
