import { relations } from "drizzle-orm";
import {
    text,
    pgTable,
    integer,
    real,
    unique,
    index,
    primaryKey,
    boolean,
    uuid,
    timestamp,
    serial,
} from "drizzle-orm/pg-core";
import { user } from "./schema";

// Role table
export const role = pgTable("role", {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
});

// Role relation
// export const role_relation = relations(role, ({ many }) => ({
//     users: many(user),
// }));

// Course table
export const course = pgTable(
    "course",
    {
        id: uuid("id")
            .primaryKey()
            .defaultRandom(),
        userId: text("userId").notNull(),
        title: text("title").notNull(),
        slug: text("slug").notNull().unique(),
        description: text("description"),
        imageUrl: text("imageUrl"),
        price: real("price"),
        isPublished: boolean("isPublished")
            .default(false)
            .notNull(),
        categoryId: integer("categoryId").references(() => category.id, {
            onDelete: "cascade",
        }),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => [{
        categoryIndex: index("course_categoryId").on(table.categoryId),
    }]
);

// Course relation
export const course_relation = relations(course, ({ one, many }) => ({
    category: one(category, {
        fields: [course.categoryId],
        references: [category.id],
    }),
    chapters: many(chapter),
    attachments: many(attachment),
    purchases: many(purchase),
}));

// Category table
export const category = pgTable("category", {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
});

// Category relation
export const category_relation = relations(category, ({ many }) => ({
    courses: many(course),
}));

// Chapter table
export const chapter = pgTable(
    "chapter",
    {
        id: uuid("id")
            .primaryKey()
            .defaultRandom(),
        title: text("title").notNull(),
        description: text("description"),
        videoId: text("videoId"),
        position: integer("position").notNull(),
        isPublished: boolean("isPublished")
            .default(false)
            .notNull(),
        isFree: boolean("isFree").default(false).notNull(),
        courseId: uuid("courseId")
            .notNull()
            .references(() => course.id, { onDelete: "cascade" }),
            createdAt: timestamp('created_at').notNull().defaultNow(),
            updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => [{
        courseIndex: index("chapter_courseId").on(table.courseId),
    }]
);

// Chapter relation
export const chapter_relation = relations(chapter, ({ one, many }) => ({
    course: one(course, { fields: [chapter.courseId], references: [course.id] }),
    bunnyData: one(bunnyData, {
        fields: [chapter.videoId],
        references: [bunnyData.videoId],
    }),
    userProgress: many(userProgress),
}));

// Attachment table
export const attachment = pgTable(
    "attachment",
    {
        id: uuid("id")
            .primaryKey()
            .defaultRandom(),
        courseId: uuid("courseId")
            .notNull()
            .references(() => course.id, { onDelete: "cascade" }),
        fileUrl: text("fileUrl").notNull(),
        fileName: text("fileName").notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
);

// Attachment relation
export const attachment_relation = relations(attachment, ({ one }) => ({
    course: one(course, {
        fields: [attachment.courseId],
        references: [course.id],
    }),
}));

// BunnyData table
export const bunnyData = pgTable(
    "bunnyData",
    {
        id: uuid("id")
            .primaryKey()
            .defaultRandom(),
        videoId: text("videoId").notNull().unique(),
        libraryId: integer("libraryId").notNull(),
        status: integer("status").default(0).notNull(),
        chapterId: uuid("chapterId")
            .unique()
            .references(() => chapter.id, { onDelete: "cascade" }),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => [{
        assetIndex: index("bunnyData_videoId").on(table.videoId),
    }]
);

// UserProgress table
export const userProgress = pgTable(
    "userProgress",
    {
        id: uuid("id")
            .primaryKey()
            .defaultRandom(),
        userId: text("userId").notNull(),
        chapterId: uuid("chapterId")
            .notNull()
            .references(() => chapter.id, { onDelete: "cascade" }),
        isCompleted: boolean("isCompleted")
            .default(false)
            .notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => [{
        userIndex: unique("unique_user_chapter").on(
            table.userId,
            table.chapterId
        ),
        chapterIndex: index("userProgress_chapterId").on(table.chapterId),
    }]
);

// UserProgress relation
export const userProgress_relation = relations(userProgress, ({ one }) => ({
    chapter: one(chapter, {
        fields: [userProgress.chapterId],
        references: [chapter.id],
    }),
}));

// Purchase table
export const purchase = pgTable(
    "purchase",
    {
        id: uuid("id")
            .primaryKey()
            .defaultRandom(),
        userId: text("userId").notNull(),
        courseId: uuid("courseId")
            .notNull()
            .references(() => course.id, { onDelete: "cascade" }),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => [{
        userIndex: unique("purchase_user_course_unique").on(
            table.userId,
            table.courseId
        ),
        courseIndex: index("purchase_courseId").on(table.courseId),
    }]
);

// Purchase relation
export const purchase_relation = relations(purchase, ({ one }) => ({
    course: one(course, { fields: [purchase.courseId], references: [course.id] }),
}));

// ChipCustomer table
export const chipCustomer = pgTable(
    "chipCustomer",
    {
        userId: text("userId").notNull(),
        courseId: uuid("courseId")
            .notNull()
            .references(() => course.id, { onDelete: "cascade" }),
        billCode: text("billCode").notNull(),
        transactionId: text("transactionId"),
        status: text("status")
            .notNull()
            .$type<"pending" | "success" | "failed" | "started">(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => [{
        pk: primaryKey({
            name: "userId_courseId",
            columns: [table.userId, table.courseId],
        }),
    }]
);

// ChipCustomer relation
export const chipCustomer_relation = relations(chipCustomer, ({ one }) => ({
    course: one(course, {
        fields: [chipCustomer.courseId],
        references: [course.id],
    }),
}));

export type CourseType = typeof course.$inferSelect;
export type ChapterType = typeof chapter.$inferSelect;
export type AttachmentType = typeof attachment.$inferSelect;
export type BunnyDataType = typeof bunnyData.$inferSelect;
export type CategoryType = typeof category.$inferSelect;
export type UserProgressType = typeof userProgress.$inferSelect;
export type PurchaseType = typeof purchase.$inferSelect;
export type ChipCustomerType = typeof chipCustomer.$inferSelect;