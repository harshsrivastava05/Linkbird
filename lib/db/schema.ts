import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  // We add this field to store the hashed password
  hashedPassword: text("hashedPassword"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// Enhanced Leads Table with additional profile fields
export const leads = pgTable("leads", {
  id: text("id").notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  status: varchar("status", { length: 50 }).default("Pending").notNull(), // e.g., 'Pending', 'Contacted', 'Responded'
  
  // Additional profile fields for enhanced lead management
  title: varchar("title", { length: 255 }), // Job title
  company: varchar("company", { length: 255 }), // Company name
  location: varchar("location", { length: 255 }), // Location (city, state/country)
  profileImage: text("profile_image"), // URL to profile image
  connectionStatus: varchar("connection_status", { length: 50 }), // 1st, 2nd, 3rd, etc.
  linkedinUrl: text("linkedin_url"), // LinkedIn profile URL
  phoneNumber: varchar("phone_number", { length: 50 }), // Phone number
  industry: varchar("industry", { length: 100 }), // Industry
  companySize: varchar("company_size", { length: 50 }), // Company size (1-10, 11-50, etc.)
  
  // Activity tracking
  lastActivity: timestamp("last_activity"), // Last activity timestamp
  lastContactedAt: timestamp("last_contacted_at"), // When we last contacted them
  responseRate: integer("response_rate").default(0), // Response rate percentage
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  
  // Foreign keys
  campaignId: text("campaign_id")
    .notNull()
    .references(() => campaigns.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const campaigns = pgTable("campaigns", {
  id: text("id").notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("Active").notNull(),
  progress: integer("progress").default(0).notNull(),
  
  // Additional campaign fields
  description: text("description"), // Campaign description
  targetAudience: varchar("target_audience", { length: 255 }), // Target audience description
  goalCount: integer("goal_count").default(0), // Target number of leads
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  
  // Foreign key
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

// New table for tracking lead activities (messages, connection requests, etc.)
export const leadActivities = pgTable("lead_activities", {
  id: text("id").notNull().primaryKey(),
  leadId: text("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  type: varchar("type", { length: 50 }).notNull(), // 'message', 'connection_request', 'profile_view', etc.
  title: varchar("title", { length: 255 }).notNull(), // Activity title
  description: text("description"), // Activity description
  status: varchar("status", { length: 50 }).default("pending").notNull(), // 'pending', 'completed', 'failed'
  
  // Activity metadata
  messageContent: text("message_content"), // For message activities
  responseReceived: boolean("response_received").default(false),
  responseContent: text("response_content"), // Response from lead
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});