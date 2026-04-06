import type { unitsTable } from "@/infra/common/db/schemas";

export type DbUnit = typeof unitsTable.$inferSelect;
