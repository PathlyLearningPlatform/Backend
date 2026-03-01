export type CreateUnitCommand = {
	name: string;
	description?: string | null;
	sectionId: string;
	order: number;
};
