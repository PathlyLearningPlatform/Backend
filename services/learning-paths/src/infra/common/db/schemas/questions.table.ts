import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "./helpers";
import { quizzesTable } from "./quizzes.table";

export const questionsTable = pgTable("questions", {
	id: uuid("id").primaryKey(),
	createdAt,
	updatedAt,
	order: integer("order").notNull(),
	quizId: uuid("quiz_id")
		.notNull()
		.references(() => quizzesTable.activityId, { onDelete: "cascade" }),
	content: text("content").notNull(),
	correctAnswer: text("correct_answer").notNull(),
});
