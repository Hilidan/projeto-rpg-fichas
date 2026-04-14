import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, customCharacters, InsertCustomCharacter } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================================
// Custom Characters CRUD
// ============================================================

export async function createCustomCharacter(data: InsertCustomCharacter) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(customCharacters).values(data);
  const insertId = result[0].insertId;
  
  const rows = await db.select().from(customCharacters).where(eq(customCharacters.id, insertId)).limit(1);
  return rows[0];
}

export async function getCustomCharactersByUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(customCharacters).where(eq(customCharacters.userId, userId));
}

export async function getCustomCharacterById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const rows = await db.select().from(customCharacters).where(eq(customCharacters.id, id)).limit(1);
  return rows.length > 0 ? rows[0] : null;
}

export async function updateCustomCharacter(id: number, userId: number, data: Partial<InsertCustomCharacter>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getCustomCharacterById(id);
  if (!existing || existing.userId !== userId) {
    throw new Error("Character not found or access denied");
  }
  
  const { id: _id, userId: _userId, createdAt: _ca, updatedAt: _ua, ...updateData } = data as any;
  
  await db.update(customCharacters).set(updateData).where(eq(customCharacters.id, id));
  
  return getCustomCharacterById(id);
}

export async function deleteCustomCharacter(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getCustomCharacterById(id);
  if (!existing || existing.userId !== userId) {
    throw new Error("Character not found or access denied");
  }
  
  await db.delete(customCharacters).where(eq(customCharacters.id, id));
  return { success: true };
}

export async function getAllCustomCharacters() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(customCharacters);
}
