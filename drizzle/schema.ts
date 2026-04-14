import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Custom character sheets created by users.
 * Complex nested data (attributes, skills, spells, etc.) stored as JSON.
 */
export const customCharacters = mysqlTable("custom_characters", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Basic info
  name: varchar("name", { length: 128 }).notNull(),
  title: varchar("title", { length: 256 }).default(""),
  player: varchar("player", { length: 128 }).default(""),
  race: varchar("race", { length: 64 }).notNull(),
  className: varchar("className", { length: 64 }).notNull(),
  subclass: varchar("subclass", { length: 128 }).default(""),
  level: int("level").notNull().default(1),
  age: int("age").default(0),
  alignment: varchar("alignment", { length: 64 }).default(""),
  background: varchar("background", { length: 128 }).default(""),
  
  // Combat stats
  proficiencyBonus: int("proficiencyBonus").notNull().default(2),
  armorClass: int("armorClass").notNull().default(10),
  acDescription: varchar("acDescription", { length: 256 }).default(""),
  initiative: int("initiative").default(0),
  speed: int("speed").default(9),
  hitPoints: int("hitPoints").notNull().default(10),
  hitDice: varchar("hitDice", { length: 32 }).default("1d10"),
  
  // Complex data as JSON
  attributes: json("attributes").notNull(), // Attribute[]
  savingThrows: json("savingThrows"), // string[]
  skills: json("skills"), // Skill[]
  attacks: json("attacks"), // Attack[]
  features: json("features"), // Feature[]
  proficiencies: json("proficiencies"), // { armor, weapons, tools, languages }
  spellcasting: json("spellcasting"), // SpellCasting object or null
  equipment: json("equipment"), // string[]
  
  // Personality
  personality: text("personality"),
  ideals: text("ideals"),
  bonds: text("bonds"),
  flaws: text("flaws"),
  description: text("description"),
  essence: text("essence"),
  quote: text("quote"),
  
  // Art
  artUrl: text("artUrl"),
  accentColor: varchar("accentColor", { length: 32 }).default("#c9a84c"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustomCharacter = typeof customCharacters.$inferSelect;
export type InsertCustomCharacter = typeof customCharacters.$inferInsert;
