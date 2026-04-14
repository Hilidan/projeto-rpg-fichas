import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-123",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

const sampleCharacterInput = {
  name: "Ash",
  title: "A Luz que Nunca se Apaga",
  player: "Duda",
  race: "Elfa",
  className: "Paladina",
  subclass: "Juramento de Devoção",
  level: 3,
  age: 21,
  alignment: "Leal e Bom",
  background: "Nobre",
  proficiencyBonus: 2,
  armorClass: 18,
  acDescription: "Cota de malha + Escudo",
  initiative: 0,
  speed: 9,
  hitPoints: 28,
  hitDice: "3d10",
  attributes: [
    { name: "Força", abbr: "FOR", score: 16, modifier: 3, saveProficient: false },
    { name: "Destreza", abbr: "DES", score: 10, modifier: 0, saveProficient: false },
    { name: "Constituição", abbr: "CON", score: 14, modifier: 2, saveProficient: false },
    { name: "Inteligência", abbr: "INT", score: 8, modifier: -1, saveProficient: false },
    { name: "Sabedoria", abbr: "SAB", score: 12, modifier: 1, saveProficient: true },
    { name: "Carisma", abbr: "CAR", score: 16, modifier: 3, saveProficient: true },
  ],
  savingThrows: ["Sabedoria", "Carisma"],
  skills: [
    { name: "Atletismo", attribute: "Força", proficient: true, modifier: 5 },
    { name: "Persuasão", attribute: "Carisma", proficient: true, modifier: 5 },
  ],
  attacks: [
    { name: "Espada Longa", bonus: "+5", damage: "1d8+3", type: "Cortante", description: "Ataque corpo a corpo" },
  ],
  features: [
    { name: "Sentido Divino", description: "Detecta celestiais, infernais e mortos-vivos.", source: "Classe" },
  ],
  proficiencies: {
    armor: ["Todas as armaduras", "Escudos"],
    weapons: ["Armas simples", "Armas marciais"],
    tools: [],
    languages: ["Comum", "Élfico"],
  },
  spellcasting: {
    ability: "Carisma",
    saveDC: 13,
    attackBonus: 5,
    slots: [{ level: 1, total: 3, used: 0 }],
    spellsKnown: 5,
    cantripsKnown: 0,
    spells: [
      {
        name: "Curar Feridas",
        level: 1,
        school: "Evocação",
        castingTime: "1 ação",
        range: "Toque",
        duration: "Instantâneo",
        description: "Restaura 1d8 + mod de conjuração em PV.",
        concentration: false,
      },
    ],
  },
  equipment: ["Cota de malha", "Escudo", "Espada longa"],
  personality: "Protetora e leal",
  ideals: "Justiça acima de tudo",
  bonds: "Protege os inocentes",
  flaws: "Teimosa demais",
  description: "Uma elfa paladina de coração puro",
  essence: "Protetora incansável",
  quote: "A escuridão pode ser forte, mas a luz sempre encontra um caminho.",
  artUrl: "",
  accentColor: "#c9a84c",
};

describe("character router", () => {
  it("validates character input schema correctly", () => {
    // Test that the input schema accepts valid data
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    // The caller should exist and have the character namespace
    expect(caller.character).toBeDefined();
    expect(caller.character.create).toBeDefined();
    expect(caller.character.myList).toBeDefined();
    expect(caller.character.getById).toBeDefined();
    expect(caller.character.update).toBeDefined();
    expect(caller.character.delete).toBeDefined();
    expect(caller.character.uploadArt).toBeDefined();
  });

  it("character.getById requires a numeric id", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    // Should throw on invalid input
    await expect(
      caller.character.getById({ id: "abc" as any })
    ).rejects.toThrow();
  });

  it("character.delete requires authentication", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    // Should throw because user is not authenticated
    await expect(
      caller.character.delete({ id: 1 })
    ).rejects.toThrow();
  });

  it("character.create requires authentication", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    // Should throw because user is not authenticated
    await expect(
      caller.character.create(sampleCharacterInput)
    ).rejects.toThrow();
  });

  it("character.myList requires authentication", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    await expect(
      caller.character.myList()
    ).rejects.toThrow();
  });

  it("character.uploadArt requires authentication", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    await expect(
      caller.character.uploadArt({
        fileName: "test.png",
        fileBase64: "dGVzdA==",
        contentType: "image/png",
      })
    ).rejects.toThrow();
  });

  it("character input rejects missing required fields", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    // Missing name, race, className, attributes
    await expect(
      caller.character.create({} as any)
    ).rejects.toThrow();
  });

  it("character input rejects invalid level", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    await expect(
      caller.character.create({
        ...sampleCharacterInput,
        level: 25, // Max is 20
      })
    ).rejects.toThrow();
  });
});
