/**
 * Dados de referência de D&D 5e para o Criador de Personagens.
 * Raças, classes, subclasses, perícias, equipamentos padrão, etc.
 */

export const RACES = [
  { value: "Humano", label: "Humano", speed: 9, traits: "+1 em todos os atributos", languages: ["Comum", "Escolha 1"] },
  { value: "Elfo", label: "Elfo", speed: 9, traits: "+2 Destreza, Visão no Escuro, Ancestral Feérica", languages: ["Comum", "Élfico"] },
  { value: "Elfo (Alto)", label: "Elfo (Alto)", speed: 9, traits: "+2 Destreza, +1 Inteligência, Truque extra", languages: ["Comum", "Élfico"] },
  { value: "Elfo (da Floresta)", label: "Elfo (da Floresta)", speed: 10, traits: "+2 Destreza, +1 Sabedoria, Máscara da Natureza", languages: ["Comum", "Élfico"] },
  { value: "Anão", label: "Anão", speed: 7, traits: "+2 Constituição, Visão no Escuro, Resistência Anã", languages: ["Comum", "Anão"] },
  { value: "Anão (da Colina)", label: "Anão (da Colina)", speed: 7, traits: "+2 Constituição, +1 Sabedoria, +1 PV por nível", languages: ["Comum", "Anão"] },
  { value: "Anão (da Montanha)", label: "Anão (da Montanha)", speed: 7, traits: "+2 Constituição, +2 Força, Proficiência em armaduras", languages: ["Comum", "Anão"] },
  { value: "Halfling", label: "Halfling", speed: 7, traits: "+2 Destreza, Sortudo, Corajoso", languages: ["Comum", "Halfling"] },
  { value: "Draconato", label: "Draconato", speed: 9, traits: "+2 Força, +1 Carisma, Sopro Dracônico, Resistência a dano", languages: ["Comum", "Dracônico"] },
  { value: "Gnomo", label: "Gnomo", speed: 7, traits: "+2 Inteligência, Visão no Escuro, Esperteza Gnômica", languages: ["Comum", "Gnômico"] },
  { value: "Meio-Elfo", label: "Meio-Elfo", speed: 9, traits: "+2 Carisma, +1 em dois atributos, Visão no Escuro", languages: ["Comum", "Élfico", "Escolha 1"] },
  { value: "Meio-Orc", label: "Meio-Orc", speed: 9, traits: "+2 Força, +1 Constituição, Visão no Escuro, Resistência Implacável", languages: ["Comum", "Orc"] },
  { value: "Tiefling", label: "Tiefling", speed: 9, traits: "+2 Carisma, +1 Inteligência, Visão no Escuro, Resistência a fogo", languages: ["Comum", "Infernal"] },
];

export const CLASSES = [
  {
    value: "Bárbaro",
    label: "Bárbaro",
    hitDie: "d12",
    primaryAbility: "Força",
    savingThrows: ["Força", "Constituição"],
    armorProf: ["Armaduras leves", "Armaduras médias", "Escudos"],
    weaponProf: ["Armas simples", "Armas marciais"],
    skillChoices: ["Adestrar Animais", "Atletismo", "Intimidação", "Natureza", "Percepção", "Sobrevivência"],
    skillCount: 2,
    spellcaster: false,
    subclasses: [
      { value: "Caminho do Berserker", label: "Caminho do Berserker" },
      { value: "Caminho do Guerreiro Totêmico", label: "Caminho do Guerreiro Totêmico" },
    ],
  },
  {
    value: "Bardo",
    label: "Bardo",
    hitDie: "d8",
    primaryAbility: "Carisma",
    savingThrows: ["Destreza", "Carisma"],
    armorProf: ["Armaduras leves"],
    weaponProf: ["Armas simples", "Bestas de mão", "Espadas longas", "Rapieiras", "Espadas curtas"],
    skillChoices: ["Acrobacia", "Adestrar Animais", "Arcanismo", "Atletismo", "Enganação", "Furtividade", "História", "Intimidação", "Intuição", "Investigação", "Medicina", "Natureza", "Percepção", "Performance", "Persuasão", "Prestidigitação", "Religião", "Sobrevivência"],
    skillCount: 3,
    spellcaster: true,
    spellAbility: "Carisma",
    subclasses: [
      { value: "Colégio do Conhecimento", label: "Colégio do Conhecimento" },
      { value: "Colégio da Bravura", label: "Colégio da Bravura" },
    ],
  },
  {
    value: "Bruxo",
    label: "Bruxo (Warlock)",
    hitDie: "d8",
    primaryAbility: "Carisma",
    savingThrows: ["Sabedoria", "Carisma"],
    armorProf: ["Armaduras leves"],
    weaponProf: ["Armas simples"],
    skillChoices: ["Arcanismo", "Enganação", "História", "Intimidação", "Investigação", "Natureza", "Religião"],
    skillCount: 2,
    spellcaster: true,
    spellAbility: "Carisma",
    subclasses: [
      { value: "O Arquifada", label: "O Arquifada" },
      { value: "O Corruptor", label: "O Corruptor" },
      { value: "O Grande Antigo", label: "O Grande Antigo" },
    ],
  },
  {
    value: "Clérigo",
    label: "Clérigo",
    hitDie: "d8",
    primaryAbility: "Sabedoria",
    savingThrows: ["Sabedoria", "Carisma"],
    armorProf: ["Armaduras leves", "Armaduras médias", "Escudos"],
    weaponProf: ["Armas simples"],
    skillChoices: ["História", "Intuição", "Medicina", "Persuasão", "Religião"],
    skillCount: 2,
    spellcaster: true,
    spellAbility: "Sabedoria",
    subclasses: [
      { value: "Domínio da Vida", label: "Domínio da Vida" },
      { value: "Domínio da Luz", label: "Domínio da Luz" },
      { value: "Domínio da Tempestade", label: "Domínio da Tempestade" },
      { value: "Domínio da Guerra", label: "Domínio da Guerra" },
    ],
  },
  {
    value: "Druida",
    label: "Druida",
    hitDie: "d8",
    primaryAbility: "Sabedoria",
    savingThrows: ["Inteligência", "Sabedoria"],
    armorProf: ["Armaduras leves", "Armaduras médias", "Escudos (não metálicos)"],
    weaponProf: ["Clavas", "Adagas", "Dardos", "Javelins", "Maças", "Bordões", "Cimitarras", "Fundas", "Lanças"],
    skillChoices: ["Arcanismo", "Adestrar Animais", "Intuição", "Medicina", "Natureza", "Percepção", "Religião", "Sobrevivência"],
    skillCount: 2,
    spellcaster: true,
    spellAbility: "Sabedoria",
    subclasses: [
      { value: "Círculo da Terra", label: "Círculo da Terra" },
      { value: "Círculo da Lua", label: "Círculo da Lua" },
    ],
  },
  {
    value: "Feiticeiro",
    label: "Feiticeiro (Sorcerer)",
    hitDie: "d6",
    primaryAbility: "Carisma",
    savingThrows: ["Constituição", "Carisma"],
    armorProf: [],
    weaponProf: ["Adagas", "Dardos", "Fundas", "Bordões", "Bestas leves"],
    skillChoices: ["Arcanismo", "Enganação", "Intuição", "Intimidação", "Persuasão", "Religião"],
    skillCount: 2,
    spellcaster: true,
    spellAbility: "Carisma",
    subclasses: [
      { value: "Linhagem Dracônica", label: "Linhagem Dracônica" },
      { value: "Magia Selvagem", label: "Magia Selvagem" },
    ],
  },
  {
    value: "Guerreiro",
    label: "Guerreiro",
    hitDie: "d10",
    primaryAbility: "Força ou Destreza",
    savingThrows: ["Força", "Constituição"],
    armorProf: ["Todas as armaduras", "Escudos"],
    weaponProf: ["Armas simples", "Armas marciais"],
    skillChoices: ["Acrobacia", "Adestrar Animais", "Atletismo", "História", "Intimidação", "Intuição", "Percepção", "Sobrevivência"],
    skillCount: 2,
    spellcaster: false,
    subclasses: [
      { value: "Campeão", label: "Campeão" },
      { value: "Mestre de Batalha", label: "Mestre de Batalha" },
      { value: "Cavaleiro Arcano", label: "Cavaleiro Arcano" },
    ],
  },
  {
    value: "Ladino",
    label: "Ladino",
    hitDie: "d8",
    primaryAbility: "Destreza",
    savingThrows: ["Destreza", "Inteligência"],
    armorProf: ["Armaduras leves"],
    weaponProf: ["Armas simples", "Bestas de mão", "Espadas longas", "Rapieiras", "Espadas curtas"],
    skillChoices: ["Acrobacia", "Atletismo", "Enganação", "Furtividade", "Intimidação", "Intuição", "Investigação", "Percepção", "Performance", "Persuasão", "Prestidigitação"],
    skillCount: 4,
    spellcaster: false,
    subclasses: [
      { value: "Ladrão", label: "Ladrão" },
      { value: "Assassino", label: "Assassino" },
      { value: "Trapaceiro Arcano", label: "Trapaceiro Arcano" },
    ],
  },
  {
    value: "Mago",
    label: "Mago",
    hitDie: "d6",
    primaryAbility: "Inteligência",
    savingThrows: ["Inteligência", "Sabedoria"],
    armorProf: [],
    weaponProf: ["Adagas", "Dardos", "Fundas", "Bordões", "Bestas leves"],
    skillChoices: ["Arcanismo", "História", "Intuição", "Investigação", "Medicina", "Religião"],
    skillCount: 2,
    spellcaster: true,
    spellAbility: "Inteligência",
    subclasses: [
      { value: "Escola de Abjuração", label: "Escola de Abjuração" },
      { value: "Escola de Evocação", label: "Escola de Evocação" },
      { value: "Escola de Conjuração", label: "Escola de Conjuração" },
    ],
  },
  {
    value: "Monge",
    label: "Monge",
    hitDie: "d8",
    primaryAbility: "Destreza e Sabedoria",
    savingThrows: ["Força", "Destreza"],
    armorProf: [],
    weaponProf: ["Armas simples", "Espadas curtas"],
    skillChoices: ["Acrobacia", "Atletismo", "Furtividade", "História", "Intuição", "Religião"],
    skillCount: 2,
    spellcaster: false,
    subclasses: [
      { value: "Caminho da Mão Aberta", label: "Caminho da Mão Aberta" },
      { value: "Caminho da Sombra", label: "Caminho da Sombra" },
      { value: "Caminho dos Quatro Elementos", label: "Caminho dos Quatro Elementos" },
    ],
  },
  {
    value: "Paladino",
    label: "Paladino",
    hitDie: "d10",
    primaryAbility: "Força e Carisma",
    savingThrows: ["Sabedoria", "Carisma"],
    armorProf: ["Todas as armaduras", "Escudos"],
    weaponProf: ["Armas simples", "Armas marciais"],
    skillChoices: ["Atletismo", "Intimidação", "Intuição", "Medicina", "Persuasão", "Religião"],
    skillCount: 2,
    spellcaster: true,
    spellAbility: "Carisma",
    subclasses: [
      { value: "Juramento de Devoção", label: "Juramento de Devoção" },
      { value: "Juramento dos Anciões", label: "Juramento dos Anciões" },
      { value: "Juramento de Vingança", label: "Juramento de Vingança" },
    ],
  },
  {
    value: "Patrulheiro",
    label: "Patrulheiro (Ranger)",
    hitDie: "d10",
    primaryAbility: "Destreza e Sabedoria",
    savingThrows: ["Força", "Destreza"],
    armorProf: ["Armaduras leves", "Armaduras médias", "Escudos"],
    weaponProf: ["Armas simples", "Armas marciais"],
    skillChoices: ["Adestrar Animais", "Atletismo", "Furtividade", "Intuição", "Investigação", "Natureza", "Percepção", "Sobrevivência"],
    skillCount: 3,
    spellcaster: true,
    spellAbility: "Sabedoria",
    subclasses: [
      { value: "Caçador", label: "Caçador" },
      { value: "Mestre das Bestas", label: "Mestre das Bestas" },
    ],
  },
];

export const ALL_SKILLS = [
  { name: "Acrobacia", attribute: "Destreza" },
  { name: "Adestrar Animais", attribute: "Sabedoria" },
  { name: "Arcanismo", attribute: "Inteligência" },
  { name: "Atletismo", attribute: "Força" },
  { name: "Enganação", attribute: "Carisma" },
  { name: "Furtividade", attribute: "Destreza" },
  { name: "História", attribute: "Inteligência" },
  { name: "Intimidação", attribute: "Carisma" },
  { name: "Intuição", attribute: "Sabedoria" },
  { name: "Investigação", attribute: "Inteligência" },
  { name: "Medicina", attribute: "Sabedoria" },
  { name: "Natureza", attribute: "Inteligência" },
  { name: "Percepção", attribute: "Sabedoria" },
  { name: "Performance", attribute: "Carisma" },
  { name: "Persuasão", attribute: "Carisma" },
  { name: "Prestidigitação", attribute: "Destreza" },
  { name: "Religião", attribute: "Inteligência" },
  { name: "Sobrevivência", attribute: "Sabedoria" },
];

export const ALIGNMENTS = [
  "Leal e Bom", "Neutro e Bom", "Caótico e Bom",
  "Leal e Neutro", "Neutro", "Caótico e Neutro",
  "Leal e Mau", "Neutro e Mau", "Caótico e Mau",
];

export const BACKGROUNDS = [
  "Acólito", "Charlatão", "Criminoso", "Artista", "Herói do Povo",
  "Artesão de Guilda", "Eremita", "Nobre", "Forasteiro", "Sábio",
  "Marinheiro", "Soldado", "Órfão",
];

export const ATTRIBUTE_NAMES = [
  { name: "Força", abbr: "FOR" },
  { name: "Destreza", abbr: "DES" },
  { name: "Constituição", abbr: "CON" },
  { name: "Inteligência", abbr: "INT" },
  { name: "Sabedoria", abbr: "SAB" },
  { name: "Carisma", abbr: "CAR" },
];

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

/** Calculate modifier from ability score */
export function calcModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/** Calculate proficiency bonus by level */
export function calcProficiencyBonus(level: number): number {
  if (level <= 4) return 2;
  if (level <= 8) return 3;
  if (level <= 12) return 4;
  if (level <= 16) return 5;
  return 6;
}

/** Calculate hit points at a given level for a given hit die and CON modifier */
export function calcHitPoints(hitDie: string, level: number, conMod: number): number {
  const dieMax = parseInt(hitDie.replace("d", ""));
  const firstLevel = dieMax + conMod;
  const avgPerLevel = Math.floor(dieMax / 2) + 1 + conMod;
  return firstLevel + avgPerLevel * (level - 1);
}
