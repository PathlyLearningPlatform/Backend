import type { SectionProgress } from "../progress.aggregate";
import type { SectionProgressId } from "../value-objects";

export interface ISectionProgressRepository {
	load(id: SectionProgressId): Promise<SectionProgress | null>;

	save(aggregate: SectionProgress): Promise<void>;

	remove(id: SectionProgressId): Promise<boolean>;
}
