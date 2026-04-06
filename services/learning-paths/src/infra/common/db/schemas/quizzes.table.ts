import { pgTable, uuid } from "drizzle-orm/pg-core";
import { activitiesTable } from "./activities.table";

export const quizzesTable = pgTable("quizzes", {
	activityId: uuid("activity_id")
		.primaryKey()
		.references(() => activitiesTable.id, { onDelete: "cascade" }),
});
