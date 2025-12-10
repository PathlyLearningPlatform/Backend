import type { Path } from '../entities';

export type PathsOrderByFields = Exclude<keyof Path, 'id' | 'description'>;
