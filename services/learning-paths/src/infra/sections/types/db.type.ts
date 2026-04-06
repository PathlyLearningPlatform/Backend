import type { sectionsTable } from "@/infra/common/db/schemas";

export type DbSection = typeof sectionsTable.$inferSelect;
