import { integer, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "./helpers";

export const learningPathsTable = pgTable("learning_paths", {
	id: uuid("id").primaryKey(),
	createdAt,
	updatedAt,
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	sectionCount: integer("section_count").notNull().default(0),
});
