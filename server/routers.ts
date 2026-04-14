import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  createCustomCharacter,
  getCustomCharactersByUser,
  getCustomCharacterById,
  updateCustomCharacter,
  deleteCustomCharacter,
  getAllCustomCharacters,
} from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

// Zod schema for character creation/update
const characterInput = z.object({
  name: z.string().min(1).max(128),
  title: z.string().max(256).optional().default(""),
  player: z.string().max(128).optional().default(""),
  race: z.string().min(1).max(64),
  className: z.string().min(1).max(64),
  subclass: z.string().max(128).optional().default(""),
  level: z.number().int().min(1).max(20).default(1),
  age: z.number().int().min(0).optional().default(0),
  alignment: z.string().max(64).optional().default(""),
  background: z.string().max(128).optional().default(""),
  proficiencyBonus: z.number().int().default(2),
  armorClass: z.number().int().default(10),
  acDescription: z.string().max(256).optional().default(""),
  initiative: z.number().int().optional().default(0),
  speed: z.number().int().optional().default(9),
  hitPoints: z.number().int().min(1).default(10),
  hitDice: z.string().max(32).optional().default("1d10"),
  attributes: z.array(z.object({
    name: z.string(),
    abbr: z.string(),
    score: z.number(),
    modifier: z.number(),
    saveProficient: z.boolean(),
  })),
  savingThrows: z.array(z.string()).optional().default([]),
  skills: z.array(z.object({
    name: z.string(),
    attribute: z.string(),
    proficient: z.boolean(),
    modifier: z.number(),
  })).optional().default([]),
  attacks: z.array(z.object({
    name: z.string(),
    bonus: z.string(),
    damage: z.string(),
    type: z.string(),
    description: z.string(),
  })).optional().default([]),
  features: z.array(z.object({
    name: z.string(),
    description: z.string(),
    source: z.string(),
  })).optional().default([]),
  proficiencies: z.object({
    armor: z.array(z.string()),
    weapons: z.array(z.string()),
    tools: z.array(z.string()),
    languages: z.array(z.string()),
  }).optional().default({ armor: [], weapons: [], tools: [], languages: [] }),
  spellcasting: z.object({
    ability: z.string(),
    saveDC: z.number(),
    attackBonus: z.number(),
    slots: z.array(z.object({
      level: z.number(),
      total: z.number(),
      used: z.number(),
    })),
    spellsKnown: z.number().optional(),
    cantripsKnown: z.number(),
    spells: z.array(z.object({
      name: z.string(),
      level: z.number(),
      school: z.string(),
      castingTime: z.string(),
      range: z.string(),
      duration: z.string(),
      description: z.string(),
      concentration: z.boolean(),
    })),
  }).nullable().optional(),
  equipment: z.array(z.string()).optional().default([]),
  personality: z.string().optional().default(""),
  ideals: z.string().optional().default(""),
  bonds: z.string().optional().default(""),
  flaws: z.string().optional().default(""),
  description: z.string().optional().default(""),
  essence: z.string().optional().default(""),
  quote: z.string().optional().default(""),
  artUrl: z.string().optional().default(""),
  accentColor: z.string().optional().default("#c9a84c"),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  character: router({
    // Create a new custom character
    create: protectedProcedure
      .input(characterInput)
      .mutation(async ({ ctx, input }) => {
        return createCustomCharacter({
          userId: ctx.user.id,
          ...input,
        });
      }),

    // List current user's characters
    myList: protectedProcedure.query(async ({ ctx }) => {
      return getCustomCharactersByUser(ctx.user.id);
    }),

    // Get all characters (public gallery)
    listAll: publicProcedure.query(async () => {
      return getAllCustomCharacters();
    }),

    // Get a single character by ID (public)
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getCustomCharacterById(input.id);
      }),

    // Update a character (owner only)
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: characterInput.partial(),
      }))
      .mutation(async ({ ctx, input }) => {
        return updateCustomCharacter(input.id, ctx.user.id, input.data);
      }),

    // Delete a character (owner only)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return deleteCustomCharacter(input.id, ctx.user.id);
      }),

    // Upload character art
    uploadArt: protectedProcedure
      .input(z.object({
        fileName: z.string(),
        fileBase64: z.string(),
        contentType: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const ext = input.fileName.split(".").pop() || "png";
        const key = `character-art/${ctx.user.id}-${nanoid()}.${ext}`;
        const buffer = Buffer.from(input.fileBase64, "base64");
        const { url } = await storagePut(key, buffer, input.contentType);
        return { url };
      }),
  }),
});

export type AppRouter = typeof appRouter;
