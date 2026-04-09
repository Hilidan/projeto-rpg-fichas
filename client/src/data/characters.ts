/*
 * Design: "Grimório Arcano" — Dark Fantasy
 * Dados completos dos 5 personagens de D&D 5e, nível 3.
 * Atributos distribuídos via Standard Array (15, 14, 13, 12, 10, 8) + bônus raciais.
 * Bônus de Proficiência no nível 3: +2
 */

export interface Attribute {
  name: string;
  abbr: string;
  score: number;
  modifier: number;
  saveProficient: boolean;
}

export interface Skill {
  name: string;
  attribute: string;
  proficient: boolean;
  modifier: number;
}

export interface Attack {
  name: string;
  bonus: string;
  damage: string;
  type: string;
  description: string;
}

export interface Feature {
  name: string;
  description: string;
  source: string; // "Classe", "Raça", "Subclasse"
}

export interface SpellSlots {
  level: number;
  total: number;
  used: number;
}

export interface Spell {
  name: string;
  level: number; // 0 = truque
  school: string;
  castingTime: string;
  range: string;
  duration: string;
  description: string;
  concentration: boolean;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  player: string;
  race: string;
  class: string;
  subclass: string;
  level: number;
  age: number;
  alignment: string;
  background: string;
  proficiencyBonus: number;
  armorClass: number;
  acDescription: string;
  initiative: number;
  speed: number;
  hitPoints: number;
  hitDice: string;
  attributes: Attribute[];
  savingThrows: string[];
  skills: Skill[];
  attacks: Attack[];
  features: Feature[];
  proficiencies: {
    armor: string[];
    weapons: string[];
    tools: string[];
    languages: string[];
  };
  spellcasting?: {
    ability: string;
    saveDC: number;
    attackBonus: number;
    slots: SpellSlots[];
    spellsKnown?: number;
    cantripsKnown: number;
    spells: Spell[];
  };
  equipment: string[];
  personality: string;
  ideals: string;
  bonds: string;
  flaws: string;
  description: string;
  essence: string;
  quote: string;
  artUrl: string;
  accentColor: string;
}

function mod(score: number): number {
  return Math.floor((score - 10) / 2);
}

// ============================================================
// ASH — Elfa Paladina (Oath of Devotion), Nível 3
// ============================================================
const ash: Character = {
  id: "ash",
  name: "Ash",
  title: "A Luz que Nunca se Apaga",
  player: "Duda",
  race: "Elfa",
  class: "Paladina",
  subclass: "Juramento de Devoção",
  level: 3,
  age: 21,
  alignment: "Leal e Boa",
  background: "Acólita",
  proficiencyBonus: 2,
  // Cota de malha (16) + Escudo (+2) = 18
  armorClass: 18,
  acDescription: "Cota de Malha + Escudo",
  initiative: 0, // DEX mod +0
  speed: 9, // 9 metros (30 pés)
  // Paladino: d10 hit die. Nível 1: 10 + CON(+2) = 12. Nível 2: 12+6+2=20. Nível 3: 20+6+2=28
  hitPoints: 28,
  hitDice: "3d10",
  attributes: [
    { name: "Força", abbr: "FOR", score: 16, modifier: 3, saveProficient: false },
    { name: "Destreza", abbr: "DES", score: 10, modifier: 0, saveProficient: false },
    { name: "Constituição", abbr: "CON", score: 14, modifier: 2, saveProficient: false },
    { name: "Inteligência", abbr: "INT", score: 8, modifier: -1, saveProficient: false },
    { name: "Sabedoria", abbr: "SAB", score: 12, modifier: 1, saveProficient: true },
    { name: "Carisma", abbr: "CAR", score: 15, modifier: 2, saveProficient: true },
  ],
  savingThrows: ["Sabedoria", "Carisma"],
  skills: [
    { name: "Atletismo", attribute: "FOR", proficient: true, modifier: 5 },
    { name: "Intuição", attribute: "SAB", proficient: true, modifier: 3 },
    { name: "Persuasão", attribute: "CAR", proficient: true, modifier: 4 },
    { name: "Religião", attribute: "INT", proficient: true, modifier: 1 },
    { name: "Percepção", attribute: "SAB", proficient: false, modifier: 1 },
  ],
  attacks: [
    {
      name: "Espada Longa",
      bonus: "+5",
      damage: "1d8+3",
      type: "Cortante",
      description: "Ataque corpo a corpo com arma. Versátil (1d10 com duas mãos).",
    },
    {
      name: "Javelin",
      bonus: "+5",
      damage: "1d6+3",
      type: "Perfurante",
      description: "Ataque à distância (9/36m) ou corpo a corpo.",
    },
  ],
  features: [
    {
      name: "Sentido Divino",
      description: "Como ação, você detecta a localização de celestiais, corruptores e mortos-vivos a até 18 metros. Pode usar 3 vezes por descanso longo (1 + mod. Carisma).",
      source: "Classe",
    },
    {
      name: "Cura pelas Mãos",
      description: "Você possui uma reserva de 15 pontos de cura (nível × 5). Como ação, toque uma criatura e restaure pontos de vida dessa reserva. Recupera tudo em um descanso longo.",
      source: "Classe",
    },
    {
      name: "Estilo de Luta: Defesa",
      description: "Enquanto estiver usando armadura, você ganha +1 na Classe de Armadura (já incluído na CA).",
      source: "Classe",
    },
    {
      name: "Golpe Divino (Smite)",
      description: "Ao acertar um ataque corpo a corpo, gaste um espaço de magia para causar 2d8 de dano radiante extra (1º nível) ou 3d8 (2º nível). +1d8 contra mortos-vivos e corruptores.",
      source: "Classe",
    },
    {
      name: "Saúde Divina",
      description: "Você é imune a doenças.",
      source: "Classe",
    },
    {
      name: "Aura de Devoção",
      description: "Você e aliados a até 3 metros não podem ser enfeitiçados enquanto você estiver consciente.",
      source: "Subclasse",
    },
    {
      name: "Visão no Escuro",
      description: "Enxerga até 18 metros no escuro como se fosse luz fraca.",
      source: "Raça",
    },
    {
      name: "Ancestral Feérica",
      description: "Vantagem em testes de resistência contra ser encantada e não pode ser colocada para dormir magicamente.",
      source: "Raça",
    },
    {
      name: "Transe",
      description: "Elfos não precisam dormir. Meditam por 4 horas para obter os benefícios de 8 horas de sono.",
      source: "Raça",
    },
  ],
  proficiencies: {
    armor: ["Armaduras leves", "Armaduras médias", "Armaduras pesadas", "Escudos"],
    weapons: ["Armas simples", "Armas marciais"],
    tools: [],
    languages: ["Comum", "Élfico"],
  },
  spellcasting: {
    ability: "Carisma",
    saveDC: 12,
    attackBonus: 4,
    slots: [
      { level: 1, total: 3, used: 0 },
    ],
    cantripsKnown: 0,
    spells: [
      // Magias de Juramento (sempre preparadas)
      { name: "Proteção contra o Bem e o Mal", level: 1, school: "Abjuração", castingTime: "1 ação", range: "Toque", duration: "10 minutos", description: "Uma criatura tocada ganha proteção contra aberrações, celestiais, corruptores, elementais, fadas e mortos-vivos. Ataques dessas criaturas têm desvantagem e o alvo não pode ser enfeitiçado, amedrontado ou possuído por elas.", concentration: true },
      { name: "Santuário", level: 1, school: "Abjuração", castingTime: "1 ação bônus", range: "9 metros", duration: "1 minuto", description: "Criaturas que tentam atacar o alvo devem fazer um teste de resistência de Sabedoria. Se falharem, devem escolher outro alvo ou perdem o ataque.", concentration: false },
      // Magias preparadas (CAR mod + metade nível = 2+1 = 3 magias)
      { name: "Curar Ferimentos", level: 1, school: "Evocação", castingTime: "1 ação", range: "Toque", duration: "Instantâneo", description: "Toque uma criatura e restaure 1d8+2 pontos de vida. Não funciona em mortos-vivos ou constructos.", concentration: false },
      { name: "Escudo da Fé", level: 1, school: "Abjuração", castingTime: "1 ação bônus", range: "18 metros", duration: "10 minutos", description: "Um escudo cintilante de energia envolve uma criatura, concedendo +2 na CA.", concentration: true },
      { name: "Comando", level: 1, school: "Encantamento", castingTime: "1 ação", range: "18 metros", duration: "1 rodada", description: "Dê uma ordem de uma palavra a uma criatura. Ela deve ser bem-sucedida em um teste de Sabedoria ou seguir a ordem no próximo turno.", concentration: false },
    ],
  },
  equipment: [
    "Cota de malha",
    "Escudo",
    "Espada longa",
    "5 javelins",
    "Símbolo sagrado",
    "Kit de oração",
    "Mochila de explorador",
  ],
  personality: "Ash carrega a luz da justiça em cada passo que dá. Sua fé não é cega — é escolha.",
  ideals: "Proteger os inocentes e enfrentar o mal sem hesitar.",
  bonds: "Inspira esperança onde só havia escuridão.",
  flaws: "Acredita que redenção é possível — mas que a justiça deve vir primeiro.",
  description: "Ash carrega a luz da justiça em cada passo que dá. Sua fé não é cega — é escolha. Ela protege os inocentes, enfrenta o mal sem hesitar e inspira esperança onde só havia escuridão.",
  essence: "Protetora incansável, guerreira nobre e coração leal. Ash acredita que redenção é possível — mas que a justiça deve vir primeiro.",
  quote: "A escuridão pode ser forte, mas a luz sempre encontra um caminho.",
  artUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029969796/5e7QM9V4aGBt6fZvi3YMN7/ash-art_86f66a2f.png",
  accentColor: "#c9a84c",
};

// ============================================================
// YARA — Draconata Druida (Círculo da Lua), Nível 3
// ============================================================
const yara: Character = {
  id: "yara",
  name: "Yara",
  title: "Guardiã das Feras",
  player: "Mel",
  race: "Draconato",
  class: "Druida",
  subclass: "Círculo da Lua",
  level: 3,
  age: 28,
  alignment: "Neutra e Boa",
  background: "Eremita",
  proficiencyBonus: 2,
  // Armadura de couro (11 + DEX mod +1) = 12, com escudo = 14
  armorClass: 14,
  acDescription: "Couro + Escudo (não metálico)",
  initiative: 1,
  speed: 9,
  // Druida: d8 hit die. Nível 1: 8+2=10. Nível 2: 10+5+2=17. Nível 3: 17+5+2=24
  hitPoints: 24,
  hitDice: "3d8",
  attributes: [
    { name: "Força", abbr: "FOR", score: 13, modifier: 1, saveProficient: false },
    { name: "Destreza", abbr: "DES", score: 12, modifier: 1, saveProficient: false },
    { name: "Constituição", abbr: "CON", score: 14, modifier: 2, saveProficient: false },
    { name: "Inteligência", abbr: "INT", score: 10, modifier: 0, saveProficient: true },
    { name: "Sabedoria", abbr: "SAB", score: 16, modifier: 3, saveProficient: true },
    { name: "Carisma", abbr: "CAR", score: 9, modifier: -1, saveProficient: false },
  ],
  savingThrows: ["Inteligência", "Sabedoria"],
  skills: [
    { name: "Percepção", attribute: "SAB", proficient: true, modifier: 5 },
    { name: "Natureza", attribute: "INT", proficient: true, modifier: 2 },
    { name: "Sobrevivência", attribute: "SAB", proficient: true, modifier: 5 },
    { name: "Medicina", attribute: "SAB", proficient: true, modifier: 5 },
    { name: "Trato com Animais", attribute: "SAB", proficient: false, modifier: 3 },
  ],
  attacks: [
    {
      name: "Cimitarra",
      bonus: "+3",
      damage: "1d6+1",
      type: "Cortante",
      description: "Arma corpo a corpo com propriedade Finesse.",
    },
    {
      name: "Sopro de Dragão (Fogo)",
      bonus: "CD 12",
      damage: "2d6",
      type: "Fogo",
      description: "Todos em um cone de 4,5m fazem teste de DES. Falha: dano total. Sucesso: metade. 1× por descanso curto.",
    },
    {
      name: "Forma Selvagem: Urso",
      bonus: "+5",
      damage: "1d8+4",
      type: "Cortante",
      description: "Em forma de urso (CA 11, 34 PV). Garras: +5, 2d6+4 cortante. Mordida: +5, 1d8+4 perfurante.",
    },
    {
      name: "Forma Selvagem: Lobo",
      bonus: "+4",
      damage: "2d4+2",
      type: "Perfurante",
      description: "Em forma de lobo (CA 13, 11 PV). Mordida: +4, 2d4+2. Alvo faz FOR CD 11 ou cai.",
    },
  ],
  features: [
    {
      name: "Forma Selvagem",
      description: "Pode se transformar em um animal que já viu. No Círculo da Lua, pode assumir formas com ND até 1 (como urso ou lobo). Usa 2 vezes por descanso curto. Dura até metade do nível do druida em horas (1h30).",
      source: "Classe",
    },
    {
      name: "Formas de Combate",
      description: "Pode usar Forma Selvagem como ação bônus (em vez de ação). Pode gastar espaços de magia para curar 1d8 PV por nível do espaço enquanto em forma animal.",
      source: "Subclasse",
    },
    {
      name: "Sopro de Dragão",
      description: "Exala fogo em um cone de 4,5m. Criaturas na área fazem teste de DES (CD 12). Dano: 2d6 fogo. Sucesso: metade. 1× por descanso curto ou longo.",
      source: "Raça",
    },
    {
      name: "Resistência a Dano",
      description: "Resistência a dano de fogo (recebe metade do dano).",
      source: "Raça",
    },
    {
      name: "Linguagem Druídica",
      description: "Conhece a linguagem secreta dos druidas, usada para deixar mensagens ocultas.",
      source: "Classe",
    },
  ],
  proficiencies: {
    armor: ["Armaduras leves", "Armaduras médias", "Escudos (não metálicos)"],
    weapons: ["Clavas", "Adagas", "Dardos", "Bastões", "Cimitarras", "Fundas", "Foices", "Lanças"],
    tools: ["Kit de herbalismo"],
    languages: ["Comum", "Dracônico", "Druídico"],
  },
  spellcasting: {
    ability: "Sabedoria",
    saveDC: 13,
    attackBonus: 5,
    slots: [
      { level: 1, total: 4, used: 0 },
      { level: 2, total: 2, used: 0 },
    ],
    cantripsKnown: 2,
    spells: [
      // Truques
      { name: "Produzir Chamas", level: 0, school: "Conjuração", castingTime: "1 ação", range: "Pessoal", duration: "10 minutos", description: "Uma chama aparece na sua mão. Pode arremessá-la a até 9m para causar 1d8 de dano de fogo.", concentration: false },
      { name: "Orientação", level: 0, school: "Adivinhação", castingTime: "1 ação", range: "Toque", duration: "1 minuto", description: "Toque um aliado. Antes da duração acabar, ele pode adicionar 1d4 a um teste de habilidade.", concentration: true },
      // Magias de 1º nível
      { name: "Curar Ferimentos", level: 1, school: "Evocação", castingTime: "1 ação", range: "Toque", duration: "Instantâneo", description: "Restaura 1d8+3 pontos de vida de uma criatura tocada.", concentration: false },
      { name: "Falar com Animais", level: 1, school: "Adivinhação", castingTime: "1 ação (ritual)", range: "Pessoal", duration: "10 minutos", description: "Você ganha a habilidade de compreender e se comunicar verbalmente com animais.", concentration: false },
      { name: "Onda Trovejante", level: 1, school: "Evocação", castingTime: "1 ação", range: "Pessoal (cubo de 4,5m)", duration: "Instantâneo", description: "Cada criatura em um cubo de 4,5m faz teste de CON. Falha: 2d8 trovejante e é empurrada 3m. Sucesso: metade do dano.", concentration: false },
      { name: "Detectar Magia", level: 1, school: "Adivinhação", castingTime: "1 ação (ritual)", range: "Pessoal", duration: "10 minutos", description: "Você sente a presença de magia a até 9 metros. Pode ver a aura e identificar a escola de magia.", concentration: true },
      // Magias de 2º nível
      { name: "Pele de Árvore", level: 2, school: "Transmutação", castingTime: "1 ação", range: "Toque", duration: "1 hora", description: "A pele do alvo ganha textura de casca de árvore. CA do alvo se torna 16 (se for menor).", concentration: true },
      { name: "Restauração Menor", level: 2, school: "Abjuração", castingTime: "1 ação", range: "Toque", duration: "Instantâneo", description: "Toque uma criatura e encerre uma doença ou condição: cego, surdo, paralisado ou envenenado.", concentration: false },
    ],
  },
  equipment: [
    "Armadura de couro",
    "Escudo de madeira",
    "Cimitarra",
    "Foco druídico (cajado de madeira)",
    "Kit de herbalismo",
    "Mochila de explorador",
  ],
  personality: "Yara fala pouco, mas observa tudo. Sua conexão com a natureza é visceral — ela sente o vento mudar antes de qualquer tempestade.",
  ideals: "A natureza é sábia. Quem a respeita, encontra equilíbrio.",
  bonds: "Protege as criaturas que não podem se proteger sozinhas.",
  flaws: "Desconfia de quem vive em grandes cidades e depende demais da civilização.",
  description: "Yara é uma draconata que encontrou seu caminho entre as feras e as florestas. Sua conexão com a natureza é profunda, e ela se transforma em urso ou lobo para proteger seus aliados.",
  essence: "Guardiã feroz da natureza, Yara é a ponte entre o mundo civilizado e o selvagem. Seus olhos de dragão veem além das aparências.",
  quote: "A floresta não pede permissão para crescer. Eu também não.",
  artUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029969796/5e7QM9V4aGBt6fZvi3YMN7/yara-art_5b0c8aae.png",
  accentColor: "#4a8c5c",
};

// ============================================================
// SABRINA — Tiefling Bruxa (Warlock, Pacto da Lâmina), Nível 3
// ============================================================
const sabrina: Character = {
  id: "sabrina",
  name: "Sabrina",
  title: "A Chama do Pacto",
  player: "Fillipe",
  race: "Tiefling",
  class: "Bruxa",
  subclass: "Patrono: O Corruptor",
  level: 3,
  age: 25,
  alignment: "Caótica e Neutra",
  background: "Charlatã",
  proficiencyBonus: 2,
  // Armadura de couro (11 + DEX +2) = 13
  armorClass: 13,
  acDescription: "Armadura de Couro",
  initiative: 2,
  speed: 9,
  // Warlock: d8 hit die. Nível 1: 8+1=9. Nível 2: 9+5+1=15. Nível 3: 15+5+1=21
  hitPoints: 21,
  hitDice: "3d8",
  attributes: [
    { name: "Força", abbr: "FOR", score: 8, modifier: -1, saveProficient: false },
    { name: "Destreza", abbr: "DES", score: 14, modifier: 2, saveProficient: false },
    { name: "Constituição", abbr: "CON", score: 13, modifier: 1, saveProficient: false },
    { name: "Inteligência", abbr: "INT", score: 12, modifier: 1, saveProficient: false },
    { name: "Sabedoria", abbr: "SAB", score: 10, modifier: 0, saveProficient: true },
    { name: "Carisma", abbr: "CAR", score: 17, modifier: 3, saveProficient: true },
  ],
  savingThrows: ["Sabedoria", "Carisma"],
  skills: [
    { name: "Enganação", attribute: "CAR", proficient: true, modifier: 5 },
    { name: "Intimidação", attribute: "CAR", proficient: true, modifier: 5 },
    { name: "Arcanismo", attribute: "INT", proficient: true, modifier: 3 },
    { name: "Persuasão", attribute: "CAR", proficient: true, modifier: 5 },
  ],
  attacks: [
    {
      name: "Rajada Mística",
      bonus: "+5",
      damage: "1d10+3",
      type: "Energia",
      description: "Truque de ataque à distância (36m). Invocação: Rajada Agonizante adiciona +CAR ao dano.",
    },
    {
      name: "Arma do Pacto",
      bonus: "+5",
      damage: "1d8+3",
      type: "Variável",
      description: "Invoca uma arma mágica como ação. Usa Carisma para ataque e dano. Pode ser qualquer forma de arma corpo a corpo.",
    },
  ],
  features: [
    {
      name: "Magia de Pacto",
      description: "Seus espaços de magia são sempre do nível mais alto disponível (2º nível) e recuperam em descanso curto ou longo. Você possui 2 espaços de magia.",
      source: "Classe",
    },
    {
      name: "Invocações Místicas",
      description: "Você conhece 2 invocações que ampliam seus poderes.",
      source: "Classe",
    },
    {
      name: "Rajada Agonizante",
      description: "Adicione seu modificador de Carisma (+3) ao dano de Rajada Mística.",
      source: "Classe",
    },
    {
      name: "Máscara de Muitas Faces",
      description: "Pode conjurar Disfarçar-se à vontade, sem gastar espaço de magia.",
      source: "Classe",
    },
    {
      name: "Pacto da Lâmina",
      description: "Pode criar uma arma de pacto mágica como ação. A arma conta como mágica e usa Carisma para ataque e dano.",
      source: "Classe",
    },
    {
      name: "Bênção do Sombrio",
      description: "Quando reduz uma criatura hostil a 0 PV, ganha PV temporários iguais ao seu mod. Carisma + nível de bruxa (6 PV temporários).",
      source: "Subclasse",
    },
    {
      name: "Resistência Infernal",
      description: "Resistência a dano de fogo.",
      source: "Raça",
    },
    {
      name: "Legado Infernal",
      description: "Conhece o truque Taumaturgia. No 3º nível, pode conjurar Repreensão Infernal 1×/dia como magia de 2º nível.",
      source: "Raça",
    },
    {
      name: "Visão no Escuro",
      description: "Enxerga até 18 metros no escuro como se fosse luz fraca.",
      source: "Raça",
    },
  ],
  proficiencies: {
    armor: ["Armaduras leves"],
    weapons: ["Armas simples"],
    tools: ["Kit de disfarce", "Kit de falsificação"],
    languages: ["Comum", "Infernal"],
  },
  spellcasting: {
    ability: "Carisma",
    saveDC: 13,
    attackBonus: 5,
    slots: [
      { level: 2, total: 2, used: 0 },
    ],
    spellsKnown: 4,
    cantripsKnown: 3,
    spells: [
      // Truques
      { name: "Rajada Mística", level: 0, school: "Evocação", castingTime: "1 ação", range: "36 metros", duration: "Instantâneo", description: "Um raio de energia mística atinge o alvo. +5 para acertar, 1d10+3 de dano de energia.", concentration: false },
      { name: "Taumaturgia", level: 0, school: "Transmutação", castingTime: "1 ação", range: "9 metros", duration: "Até 1 minuto", description: "Manifesta um prodígio sobrenatural: tremor no chão, olhos brilham, voz amplificada, etc.", concentration: false },
      { name: "Mão Mágica", level: 0, school: "Conjuração", castingTime: "1 ação", range: "9 metros", duration: "1 minuto", description: "Uma mão espectral surge e pode manipular objetos, abrir portas ou carregar até 5kg.", concentration: false },
      // Magias conhecidas (4 magias)
      { name: "Enfeitiçar Pessoa", level: 1, school: "Encantamento", castingTime: "1 ação", range: "9 metros", duration: "1 hora", description: "O alvo faz teste de SAB. Falha: fica enfeitiçado por você e o considera um amigo. Sabe que foi enfeitiçado quando o efeito acaba.", concentration: false },
      { name: "Repreensão Infernal", level: 1, school: "Evocação", castingTime: "1 reação", range: "18 metros", duration: "Instantâneo", description: "Quando sofre dano, a criatura que causou faz teste de DES. Falha: 2d10 fogo (ou 3d10 no 2º nível). Sucesso: metade.", concentration: false },
      { name: "Escuridão", level: 2, school: "Evocação", castingTime: "1 ação", range: "18 metros", duration: "10 minutos", description: "Escuridão mágica preenche uma esfera de 4,5m de raio. Visão no escuro não funciona. Luz não-mágica não ilumina.", concentration: true },
      { name: "Coroa da Loucura", level: 2, school: "Encantamento", castingTime: "1 ação", range: "36 metros", duration: "1 minuto", description: "O alvo faz teste de SAB. Falha: fica enfeitiçado e deve usar sua ação para atacar corpo a corpo uma criatura que você escolher.", concentration: true },
    ],
  },
  equipment: [
    "Armadura de couro",
    "Duas adagas",
    "Componentes arcanos",
    "Kit de disfarce",
    "Roupas finas",
    "Mochila de explorador",
  ],
  personality: "Sabrina fala com a confiança de quem já enganou demônios — e talvez tenha. Seu sorriso esconde mais do que revela.",
  ideals: "Liberdade acima de tudo. Ninguém deveria ser preso a um destino que não escolheu.",
  bonds: "O pacto que fez tem um preço, e ela pretende pagar nos seus próprios termos.",
  flaws: "Confia demais na própria lábia e subestima quem parece simples.",
  description: "Sabrina é uma tiefling que fez um pacto sombrio com uma entidade poderosa. Seus poderes vêm com um preço, mas ela pretende pagar nos seus próprios termos.",
  essence: "Carismática e perigosa, Sabrina caminha entre a luz e as sombras. Seu pacto é sua força — e talvez sua perdição.",
  quote: "Todo poder tem um preço. O segredo é fazer alguém pagar por você.",
  artUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029969796/5e7QM9V4aGBt6fZvi3YMN7/sabrina-art_261471d8.png",
  accentColor: "#8b3a62",
};

// ============================================================
// THIHASHIAN — Tiefling Feiticeira (Linhagem Dracônica), Nível 3
// ============================================================
const thihashian: Character = {
  id: "thihashian",
  name: "Thihashian",
  title: "Sangue de Dragão",
  player: "Dri",
  race: "Tiefling",
  class: "Feiticeira",
  subclass: "Linhagem Dracônica (Fogo)",
  level: 3,
  age: 20,
  alignment: "Caótica e Boa",
  background: "Sábia",
  proficiencyBonus: 2,
  // Linhagem Dracônica: CA base = 13 + DEX mod (+2) = 15 (sem armadura)
  armorClass: 15,
  acDescription: "Escamas Dracônicas (13 + DES)",
  initiative: 2,
  speed: 9,
  // Feiticeiro: d6 hit die. Nível 1: 6+2=8. Nível 2: 8+4+2=14. Nível 3: 14+4+2=20
  hitPoints: 20,
  hitDice: "3d6",
  attributes: [
    { name: "Força", abbr: "FOR", score: 8, modifier: -1, saveProficient: false },
    { name: "Destreza", abbr: "DES", score: 14, modifier: 2, saveProficient: false },
    { name: "Constituição", abbr: "CON", score: 14, modifier: 2, saveProficient: true },
    { name: "Inteligência", abbr: "INT", score: 10, modifier: 0, saveProficient: false },
    { name: "Sabedoria", abbr: "SAB", score: 12, modifier: 1, saveProficient: false },
    { name: "Carisma", abbr: "CAR", score: 17, modifier: 3, saveProficient: true },
  ],
  savingThrows: ["Constituição", "Carisma"],
  skills: [
    { name: "Arcanismo", attribute: "INT", proficient: true, modifier: 2 },
    { name: "Persuasão", attribute: "CAR", proficient: true, modifier: 5 },
    { name: "Intuição", attribute: "SAB", proficient: true, modifier: 3 },
    { name: "Intimidação", attribute: "CAR", proficient: true, modifier: 5 },
  ],
  attacks: [
    {
      name: "Raio de Fogo",
      bonus: "+5",
      damage: "1d10",
      type: "Fogo",
      description: "Truque de ataque à distância (36m). Bônus de Afinidade Elemental: +3 dano de fogo em magias de fogo.",
    },
    {
      name: "Adaga",
      bonus: "+4",
      damage: "1d4+2",
      type: "Perfurante",
      description: "Arma corpo a corpo ou arremesso (6/18m). Finesse, leve.",
    },
  ],
  features: [
    {
      name: "Fonte de Magia",
      description: "Possui 3 Pontos de Feitiçaria (igual ao nível). Pode converter pontos em espaços de magia e vice-versa.",
      source: "Classe",
    },
    {
      name: "Metamagia",
      description: "Conhece 2 opções de Metamagia para alterar suas magias.",
      source: "Classe",
    },
    {
      name: "Magia Sutil",
      description: "Gaste 1 ponto de feitiçaria para conjurar sem componentes verbais ou somáticos (ninguém percebe que você conjurou).",
      source: "Classe",
    },
    {
      name: "Magia Potencializada",
      description: "Gaste 1 ponto de feitiçaria para rolar novamente até 3 dados de dano de uma magia (deve usar o novo resultado).",
      source: "Classe",
    },
    {
      name: "Escamas Dracônicas",
      description: "Sua CA base é 13 + modificador de Destreza quando não usa armadura. Sua pele tem escamas sutis de dragão.",
      source: "Subclasse",
    },
    {
      name: "Afinidade Elemental (Fogo)",
      description: "Ao conjurar uma magia que causa dano de fogo, adicione +3 (mod. Carisma) ao dano.",
      source: "Subclasse",
    },
    {
      name: "Resistência Infernal",
      description: "Resistência a dano de fogo.",
      source: "Raça",
    },
    {
      name: "Legado Infernal",
      description: "Conhece Taumaturgia. No 3º nível, pode conjurar Repreensão Infernal 1×/dia como magia de 2º nível.",
      source: "Raça",
    },
    {
      name: "Visão no Escuro",
      description: "Enxerga até 18 metros no escuro como se fosse luz fraca.",
      source: "Raça",
    },
  ],
  proficiencies: {
    armor: [],
    weapons: ["Adagas", "Dardos", "Fundas", "Bastões", "Bestas leves"],
    tools: [],
    languages: ["Comum", "Infernal", "Dracônico"],
  },
  spellcasting: {
    ability: "Carisma",
    saveDC: 13,
    attackBonus: 5,
    slots: [
      { level: 1, total: 4, used: 0 },
      { level: 2, total: 2, used: 0 },
    ],
    spellsKnown: 4,
    cantripsKnown: 5,
    spells: [
      // Truques (5: 4 de feiticeira + 1 racial)
      { name: "Raio de Fogo", level: 0, school: "Evocação", castingTime: "1 ação", range: "36 metros", duration: "Instantâneo", description: "Arremessa uma fagulha de fogo. +5 para acertar, 1d10 de dano de fogo (+3 com Afinidade).", concentration: false },
      { name: "Taumaturgia", level: 0, school: "Transmutação", castingTime: "1 ação", range: "9 metros", duration: "Até 1 minuto", description: "Manifesta um prodígio sobrenatural: tremor, olhos brilhantes, voz amplificada.", concentration: false },
      { name: "Luz", level: 0, school: "Evocação", castingTime: "1 ação", range: "Toque", duration: "1 hora", description: "Um objeto tocado emite luz brilhante em 6m e luz fraca por mais 6m.", concentration: false },
      { name: "Prestidigitação", level: 0, school: "Transmutação", castingTime: "1 ação", range: "3 metros", duration: "Até 1 hora", description: "Pequenos truques mágicos: acender vela, limpar roupa, aquecer comida, criar imagem na palma da mão.", concentration: false },
      { name: "Rajada de Fogo", level: 0, school: "Conjuração", castingTime: "1 ação", range: "18 metros", duration: "Instantâneo", description: "Arremessa uma pequena bola de fogo. Criaturas em 1,5m do ponto fazem DES. Falha: 1d6 fogo.", concentration: false },
      // Magias conhecidas (4)
      { name: "Mãos Flamejantes", level: 1, school: "Evocação", castingTime: "1 ação", range: "Pessoal (cone de 4,5m)", duration: "Instantâneo", description: "Chamas jorram das suas mãos. Criaturas no cone fazem DES. Falha: 3d6 fogo (+3 Afinidade). Sucesso: metade.", concentration: false },
      { name: "Escudo Arcano", level: 1, school: "Abjuração", castingTime: "1 reação", range: "Pessoal", duration: "1 rodada", description: "Quando atingida por ataque ou Mísseis Mágicos, ganha +5 na CA até o início do próximo turno.", concentration: false },
      { name: "Esfera Flamejante", level: 2, school: "Conjuração", castingTime: "1 ação", range: "18 metros", duration: "1 minuto", description: "Uma esfera de fogo de 1,5m de diâmetro surge. Criaturas a 1,5m fazem DES. Falha: 2d6 fogo (+3). Pode mover a esfera 9m como ação bônus.", concentration: true },
      { name: "Invisibilidade", level: 2, school: "Ilusão", castingTime: "1 ação", range: "Toque", duration: "1 hora", description: "Uma criatura tocada fica invisível até atacar ou conjurar uma magia.", concentration: true },
    ],
  },
  equipment: [
    "Duas adagas",
    "Componente arcano (cristal)",
    "Mochila de explorador",
    "Roupas comuns",
  ],
  personality: "Thihashian é jovem e impetuosa. O fogo corre em suas veias — literalmente — e ela ainda está aprendendo a controlá-lo.",
  ideals: "O poder não é bom nem mau. O que importa é o que você faz com ele.",
  bonds: "Quer provar que sua linhagem infernal não define quem ela é.",
  flaws: "Age por impulso e às vezes libera mais poder do que pretendia.",
  description: "Thihashian é uma tiefling jovem cujo sangue carrega a essência de dragões antigos. Chamas dançam em seus olhos quando ela conjura, e sua magia é tão selvagem quanto seu espírito.",
  essence: "Fogo e determinação. Thihashian é a prova viva de que o destino não é escrito em pedra — é forjado em chamas.",
  quote: "Meu sangue é fogo. Minha vontade é mais forte.",
  artUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029969796/5e7QM9V4aGBt6fZvi3YMN7/thihashian-art-v2-fmiFD8LpAK33N4SXK7bZ5C.webp",
  accentColor: "#c44b2b",
};

// ============================================================
// KROM — Humano Bárbaro (Caminho do Berserker), Nível 3
// ============================================================
const krom: Character = {
  id: "krom",
  name: "Krom",
  title: "O Inabalável",
  player: "Pablo",
  race: "Humano",
  class: "Bárbaro",
  subclass: "Caminho do Berserker",
  level: 3,
  age: 39,
  alignment: "Caótico e Neutro",
  background: "Soldado",
  proficiencyBonus: 2,
  // Defesa sem armadura: 10 + DEX(+2) + CON(+3) = 15
  armorClass: 15,
  acDescription: "Defesa sem Armadura (10 + DES + CON)",
  initiative: 2,
  speed: 9,
  // Bárbaro: d12 hit die. Nível 1: 12+3=15. Nível 2: 15+7+3=25. Nível 3: 25+7+3=35
  hitPoints: 35,
  hitDice: "3d12",
  attributes: [
    { name: "Força", abbr: "FOR", score: 17, modifier: 3, saveProficient: true },
    { name: "Destreza", abbr: "DES", score: 14, modifier: 2, saveProficient: false },
    { name: "Constituição", abbr: "CON", score: 16, modifier: 3, saveProficient: true },
    { name: "Inteligência", abbr: "INT", score: 9, modifier: -1, saveProficient: false },
    { name: "Sabedoria", abbr: "SAB", score: 11, modifier: 0, saveProficient: false },
    { name: "Carisma", abbr: "CAR", score: 13, modifier: 1, saveProficient: false },
  ],
  savingThrows: ["Força", "Constituição"],
  skills: [
    { name: "Atletismo", attribute: "FOR", proficient: true, modifier: 5 },
    { name: "Intimidação", attribute: "CAR", proficient: true, modifier: 3 },
    { name: "Percepção", attribute: "SAB", proficient: true, modifier: 2 },
    { name: "Sobrevivência", attribute: "SAB", proficient: true, modifier: 2 },
  ],
  attacks: [
    {
      name: "Machado Grande",
      bonus: "+5",
      damage: "1d12+3",
      type: "Cortante",
      description: "Arma corpo a corpo, pesada, duas mãos. Em fúria: +2 dano extra.",
    },
    {
      name: "Javelin",
      bonus: "+5",
      damage: "1d6+3",
      type: "Perfurante",
      description: "Arma de arremesso (9/36m) ou corpo a corpo.",
    },
    {
      name: "Ataque Frenético",
      bonus: "+5",
      damage: "1d12+5",
      type: "Cortante",
      description: "Durante Frenesi, pode fazer um ataque corpo a corpo extra como ação bônus. Sofre 1 nível de exaustão ao fim.",
    },
  ],
  features: [
    {
      name: "Fúria",
      description: "Como ação bônus, entre em fúria por 1 minuto. Ganha: +2 dano corpo a corpo, resistência a dano cortante/perfurante/contundente, vantagem em testes de FOR. Não pode conjurar magias. 3 usos por descanso longo.",
      source: "Classe",
    },
    {
      name: "Defesa sem Armadura",
      description: "Sem armadura, sua CA = 10 + DES (+2) + CON (+3) = 15. Pode usar escudo.",
      source: "Classe",
    },
    {
      name: "Ataque Imprudente",
      description: "No primeiro ataque do turno, pode atacar com vantagem. Em troca, ataques contra você têm vantagem até seu próximo turno.",
      source: "Classe",
    },
    {
      name: "Sentido de Perigo",
      description: "Vantagem em testes de resistência de Destreza contra efeitos que pode ver (como bolas de fogo e armadilhas). Não funciona se estiver cego, surdo ou incapacitado.",
      source: "Classe",
    },
    {
      name: "Frenesi",
      description: "Ao entrar em fúria, pode escolher entrar em frenesi. Durante o frenesi, pode fazer um ataque corpo a corpo extra como ação bônus a cada turno. Ao fim, sofre 1 nível de exaustão.",
      source: "Subclasse",
    },
    {
      name: "Versátil (Humano)",
      description: "+1 em todos os atributos (já incluído). Humanos são adaptáveis e determinados.",
      source: "Raça",
    },
  ],
  proficiencies: {
    armor: ["Armaduras leves", "Armaduras médias", "Escudos"],
    weapons: ["Armas simples", "Armas marciais"],
    tools: ["Veículos terrestres", "Kit de jogo (dados)"],
    languages: ["Comum", "Orc"],
  },
  equipment: [
    "Machado grande",
    "4 javelins",
    "Mochila de explorador",
    "Insígnia de patente",
    "Troféu de inimigo derrotado",
    "Kit de jogo (dados)",
  ],
  personality: "Krom fala pouco e age com decisão. Seus olhos carregam o peso de batalhas passadas, mas também uma chama que se recusa a apagar.",
  ideals: "A verdadeira força não está nos músculos — está em saber quando lutar e quando proteger.",
  bonds: "Carrega cicatrizes de guerras que jurou nunca mais repetir.",
  flaws: "Quando a fúria toma conta, é difícil distinguir amigo de inimigo.",
  description: "Krom é um veterano de guerra endurecido pelo tempo e pelas batalhas. Aos 39 anos, sua força bruta é lendária, mas é sua experiência que o torna verdadeiramente perigoso.",
  essence: "Guerreiro implacável, Krom é a muralha entre seus aliados e o perigo. Sua fúria é uma tempestade controlada — até deixar de ser.",
  quote: "Palavras não param uma espada. Eu paro.",
  artUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663029969796/5e7QM9V4aGBt6fZvi3YMN7/krom-art_a401b978.png",
  accentColor: "#8b4513",
};

export const characters: Character[] = [ash, yara, sabrina, thihashian, krom];

export function getCharacterById(id: string): Character | undefined {
  return characters.find((c) => c.id === id);
}
