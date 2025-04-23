import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const priorityEnum = pgEnum('priority', ['high', 'medium', 'low']);
export const statusEnum = pgEnum('status', ['open', 'in_progress', 'resolved', 'closed']);
export const categoryEnum = pgEnum('category', ['bug', 'feature', 'documentation', 'security', 'performance']);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Issues table
export const issues = pgTable("issues", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: statusEnum("status").notNull().default('open'),
  priority: priorityEnum("priority").notNull(),
  category: categoryEnum("category").notNull(),
  assigneeId: integer("assignee_id").references(() => users.id),
  reporterId: integer("reporter_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Comments table
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  issueId: integer("issue_id").references(() => issues.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Attachments table
export const attachments = pgTable("attachments", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  filepath: text("filepath").notNull(),
  issueId: integer("issue_id").references(() => issues.id).notNull(),
  uploaderId: integer("uploader_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  userId: integer("user_id").references(() => users.id).notNull(),
  issueId: integer("issue_id").references(() => issues.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for insertion
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  avatarUrl: true,
});

export const insertIssueSchema = createInsertSchema(issues).omit({
  id: true, 
  createdAt: true,
  updatedAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const insertAttachmentSchema = createInsertSchema(attachments).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Issue = typeof issues.$inferSelect;
export type InsertIssue = z.infer<typeof insertIssueSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Attachment = typeof attachments.$inferSelect;
export type InsertAttachment = z.infer<typeof insertAttachmentSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// Enum values for frontend usage
export const PRIORITY_VALUES = ['high', 'medium', 'low'] as const;
export const STATUS_VALUES = ['open', 'in_progress', 'resolved', 'closed'] as const;
export const CATEGORY_VALUES = ['bug', 'feature', 'documentation', 'security', 'performance'] as const;

export type Priority = (typeof PRIORITY_VALUES)[number];
export type Status = (typeof STATUS_VALUES)[number];
export type Category = (typeof CATEGORY_VALUES)[number];
