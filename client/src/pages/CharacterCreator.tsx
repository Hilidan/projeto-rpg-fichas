/**
 * Criador de Personagens — Formulário interativo multi-step
 * Estilo "Grimório Arcano" consistente com o resto do site.
 * Steps: 1) Dados Básicos  2) Atributos  3) Perícias  4) Combate & Equipamento  5) Personalidade & Foto  6) Revisão
 */
import { useState, useMemo, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  RACES, CLASSES, ALL_SKILLS, ALIGNMENTS, BACKGROUNDS,
  ATTRIBUTE_NAMES, STANDARD_ARRAY, calcModifier, calcProficiencyBonus, calcHitPoints,
} from "@/data/dnd5eData";
import {
  ArrowLeft, ArrowRight, Check, Upload, User, Sword, BookOpen,
  Shield, Heart, Sparkles, ScrollText, Dices, Save,
} from "lucide-react";
import { toast } from "sonner";

const BG_PATTERN = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029969796/5e7QM9V4aGBt6fZvi3YMN7/page-bg-pattern-FkoGmkKLPZJaJsc78xzxmy.webp";
const DIVIDER = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029969796/5e7QM9V4aGBt6fZvi3YMN7/ornamental-divider-6Fe7JypmoDXKRGgmewzWJE.webp";

const STEPS = [
  { title: "Dados Básicos", icon: <User className="w-4 h-4" /> },
  { title: "Atributos", icon: <Dices className="w-4 h-4" /> },
  { title: "Perícias", icon: <BookOpen className="w-4 h-4" /> },
  { title: "Combate", icon: <Sword className="w-4 h-4" /> },
  { title: "Personalidade", icon: <ScrollText className="w-4 h-4" /> },
  { title: "Revisão", icon: <Check className="w-4 h-4" /> },
];

function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      {icon && <span className="text-[#c9a84c]">{icon}</span>}
      <h2 className="text-xl md:text-2xl font-bold gold-text" style={{ fontFamily: "'Cinzel', serif" }}>
        {children}
      </h2>
      <div className="flex-1 h-px bg-gradient-to-r from-[#c9a84c]/40 to-transparent" />
    </div>
  );
}

function FormField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-[#c9a84c]" style={{ fontFamily: "'Cinzel', serif" }}>
        {label}
      </label>
      {hint && <p className="text-xs text-[#e8dcc8]/50">{hint}</p>}
      {children}
    </div>
  );
}

const inputClass = "w-full px-3 py-2 rounded-md bg-[oklch(0.12_0.015_250)] border border-[#c9a84c]/30 text-[#e8dcc8] placeholder-[#e8dcc8]/30 focus:border-[#c9a84c] focus:outline-none focus:ring-1 focus:ring-[#c9a84c]/50 transition-colors";
const selectClass = inputClass + " appearance-none";

export default function CharacterCreator() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);

  // Form state
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [player, setPlayer] = useState("");
  const [race, setRace] = useState("");
  const [className, setClassName] = useState("");
  const [subclass, setSubclass] = useState("");
  const [level, setLevel] = useState(3);
  const [age, setAge] = useState(25);
  const [alignment, setAlignment] = useState("");
  const [background, setBackground] = useState("");

  // Attributes: index maps to ATTRIBUTE_NAMES order
  const [attrScores, setAttrScores] = useState<number[]>([15, 14, 13, 12, 10, 8]);

  // Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Combat extras
  const [equipment, setEquipment] = useState("");
  const [attacks, setAttacks] = useState([
    { name: "", bonus: "", damage: "", type: "", description: "" },
  ]);
  const [features, setFeatures] = useState([
    { name: "", description: "", source: "Classe" },
  ]);

  // Personality
  const [personality, setPersonality] = useState("");
  const [ideals, setIdeals] = useState("");
  const [bonds, setBonds] = useState("");
  const [flaws, setFlaws] = useState("");
  const [description, setDescription] = useState("");
  const [essence, setEssence] = useState("");
  const [quote, setQuote] = useState("");

  // Photo
  const [artFile, setArtFile] = useState<File | null>(null);
  const [artPreview, setArtPreview] = useState<string>("");

  // Derived values
  const selectedClass = useMemo(() => CLASSES.find(c => c.value === className), [className]);
  const selectedRace = useMemo(() => RACES.find(r => r.value === race), [race]);
  const profBonus = useMemo(() => calcProficiencyBonus(level), [level]);

  const attributes = useMemo(() => {
    return ATTRIBUTE_NAMES.map((attr, i) => ({
      name: attr.name,
      abbr: attr.abbr,
      score: attrScores[i],
      modifier: calcModifier(attrScores[i]),
      saveProficient: selectedClass?.savingThrows.includes(attr.name) ?? false,
    }));
  }, [attrScores, selectedClass]);

  const conMod = useMemo(() => calcModifier(attrScores[2]), [attrScores]);
  const dexMod = useMemo(() => calcModifier(attrScores[1]), [attrScores]);
  const hitPoints = useMemo(() => {
    if (!selectedClass) return 10;
    return calcHitPoints(selectedClass.hitDie, level, conMod);
  }, [selectedClass, level, conMod]);

  const armorClass = useMemo(() => 10 + dexMod, [dexMod]);
  const speed = useMemo(() => selectedRace?.speed ?? 9, [selectedRace]);

  const skills = useMemo(() => {
    return ALL_SKILLS.map(sk => {
      const attrIndex = ATTRIBUTE_NAMES.findIndex(a => a.name === sk.attribute);
      const attrMod = attrIndex >= 0 ? calcModifier(attrScores[attrIndex]) : 0;
      const proficient = selectedSkills.includes(sk.name);
      return {
        name: sk.name,
        attribute: sk.attribute,
        proficient,
        modifier: attrMod + (proficient ? profBonus : 0),
      };
    });
  }, [attrScores, selectedSkills, profBonus]);

  const maxSkills = selectedClass?.skillCount ?? 2;

  // Mutations
  const uploadArt = trpc.character.uploadArt.useMutation();
  const createChar = trpc.character.create.useMutation();

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }
    setArtFile(file);
    const reader = new FileReader();
    reader.onload = () => setArtPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleAttrChange = useCallback((index: number, value: number) => {
    setAttrScores(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const toggleSkill = useCallback((skillName: string) => {
    setSelectedSkills(prev => {
      if (prev.includes(skillName)) return prev.filter(s => s !== skillName);
      if (prev.length >= maxSkills) {
        toast.error(`Você só pode escolher ${maxSkills} perícias`);
        return prev;
      }
      return [...prev, skillName];
    });
  }, [maxSkills]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error("Faça login para salvar seu personagem");
      return;
    }

    try {
      let artUrl = "";
      if (artFile) {
        const base64 = artPreview.split(",")[1];
        const result = await uploadArt.mutateAsync({
          fileName: artFile.name,
          fileBase64: base64,
          contentType: artFile.type,
        });
        artUrl = result.url;
      }

      const filteredAttacks = attacks.filter(a => a.name.trim() !== "");
      const filteredFeatures = features.filter(f => f.name.trim() !== "");

      await createChar.mutateAsync({
        name,
        title,
        player,
        race,
        className,
        subclass,
        level,
        age,
        alignment,
        background,
        proficiencyBonus: profBonus,
        armorClass,
        acDescription: `${armorClass} (sem armadura)`,
        initiative: dexMod,
        speed,
        hitPoints,
        hitDice: `${level}${selectedClass?.hitDie ?? "d10"}`,
        attributes,
        savingThrows: selectedClass?.savingThrows ?? [],
        skills,
        attacks: filteredAttacks,
        features: filteredFeatures,
        proficiencies: {
          armor: selectedClass?.armorProf ?? [],
          weapons: selectedClass?.weaponProf ?? [],
          tools: [],
          languages: selectedRace?.languages ?? ["Comum"],
        },
        spellcasting: selectedClass?.spellcaster ? {
          ability: (selectedClass as any).spellAbility ?? "Carisma",
          saveDC: 8 + profBonus + calcModifier(attrScores[ATTRIBUTE_NAMES.findIndex(a => a.name === ((selectedClass as any).spellAbility ?? "Carisma"))]),
          attackBonus: profBonus + calcModifier(attrScores[ATTRIBUTE_NAMES.findIndex(a => a.name === ((selectedClass as any).spellAbility ?? "Carisma"))]),
          slots: [],
          cantripsKnown: 0,
          spells: [],
        } : null,
        equipment: equipment.split("\n").filter(e => e.trim() !== ""),
        personality,
        ideals,
        bonds,
        flaws,
        description,
        essence,
        quote,
        artUrl,
        accentColor: "#c9a84c",
      });

      toast.success("Personagem criado com sucesso!");
      navigate("/meus-personagens");
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar personagem");
    }
  };

  // Auth gate
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${BG_PATTERN})`, backgroundSize: "400px", backgroundRepeat: "repeat" }}>
        <div className="text-[#c9a84c] animate-pulse text-xl" style={{ fontFamily: "'Cinzel', serif" }}>Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${BG_PATTERN})`, backgroundSize: "400px", backgroundRepeat: "repeat" }}>
        <div className="section-card gold-border p-8 text-center max-w-md mx-4">
          <Sparkles className="w-12 h-12 text-[#c9a84c] mx-auto mb-4" />
          <h2 className="text-2xl font-bold gold-text mb-3" style={{ fontFamily: "'Cinzel', serif" }}>Acesso Necessário</h2>
          <p className="text-[#e8dcc8]/70 mb-6">Faça login para criar seu personagem e salvar sua ficha.</p>
          <a
            href={getLoginUrl()}
            className="inline-block px-6 py-3 rounded-md bg-[#c9a84c] text-[oklch(0.12_0.015_250)] font-bold hover:bg-[#e0c872] transition-colors"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Entrar
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundImage: `url(${BG_PATTERN})`, backgroundSize: "400px", backgroundRepeat: "repeat" }}>
      {/* Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[oklch(0.10_0.015_250)]/90 border-b border-[#c9a84c]/20">
        <div className="container flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2 text-[#c9a84c] hover:text-[#e0c872] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm" style={{ fontFamily: "'Cinzel', serif" }}>Voltar</span>
          </Link>
          <h1 className="text-lg font-bold gold-text-glow" style={{ fontFamily: "'Cinzel', serif" }}>
            Criar Personagem
          </h1>
          <div className="w-16" />
        </div>
      </nav>

      {/* Step indicator */}
      <div className="container pt-6 pb-4">
        <div className="flex items-center justify-center gap-1 md:gap-2 flex-wrap">
          {STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-full text-xs transition-all ${
                i === step
                  ? "bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/50"
                  : i < step
                  ? "bg-[#c9a84c]/10 text-[#c9a84c]/70"
                  : "text-[#e8dcc8]/40"
              }`}
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {s.icon}
              <span className="hidden sm:inline">{s.title}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
          ))}
        </div>
      </div>

      <img src={DIVIDER} alt="" className="w-48 mx-auto opacity-40 mb-6" />

      {/* Form content */}
      <div className="container pb-20">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 0: Basic Info */}
              {step === 0 && (
                <div className="section-card gold-border p-6 space-y-5">
                  <SectionTitle icon={<User className="w-5 h-5" />}>Dados Básicos</SectionTitle>
                  <p className="text-sm text-[#e8dcc8]/60 -mt-2">
                    Comece definindo quem é o seu personagem. Escolha um nome, raça e classe.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Nome do Personagem" hint="Ex: Ash, Krom, Yara...">
                      <input className={inputClass} value={name} onChange={e => setName(e.target.value)} placeholder="Nome do personagem" />
                    </FormField>
                    <FormField label="Título / Epíteto" hint="Ex: A Luz que Nunca se Apaga">
                      <input className={inputClass} value={title} onChange={e => setTitle(e.target.value)} placeholder="Título opcional" />
                    </FormField>
                    <FormField label="Nome do Jogador">
                      <input className={inputClass} value={player} onChange={e => setPlayer(e.target.value)} placeholder="Seu nome" />
                    </FormField>
                    <FormField label="Nível" hint="De 1 a 20">
                      <input type="number" className={inputClass} value={level} onChange={e => setLevel(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))} min={1} max={20} />
                    </FormField>
                    <FormField label="Raça" hint="Cada raça tem traços únicos">
                      <select className={selectClass} value={race} onChange={e => setRace(e.target.value)}>
                        <option value="">Selecione...</option>
                        {RACES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                      {selectedRace && (
                        <p className="text-xs text-[#c9a84c]/70 mt-1">Traços: {selectedRace.traits}</p>
                      )}
                    </FormField>
                    <FormField label="Classe" hint="Define suas habilidades em combate">
                      <select className={selectClass} value={className} onChange={e => { setClassName(e.target.value); setSubclass(""); setSelectedSkills([]); }}>
                        <option value="">Selecione...</option>
                        {CLASSES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                      {selectedClass && (
                        <p className="text-xs text-[#c9a84c]/70 mt-1">Dado de Vida: {selectedClass.hitDie} | Habilidade Principal: {selectedClass.primaryAbility}</p>
                      )}
                    </FormField>
                    {selectedClass && selectedClass.subclasses.length > 0 && (
                      <FormField label="Subclasse" hint="Especialização da sua classe (a partir do nível 3)">
                        <select className={selectClass} value={subclass} onChange={e => setSubclass(e.target.value)}>
                          <option value="">Selecione...</option>
                          {selectedClass.subclasses.map(sc => <option key={sc.value} value={sc.value}>{sc.label}</option>)}
                        </select>
                      </FormField>
                    )}
                    <FormField label="Idade">
                      <input type="number" className={inputClass} value={age} onChange={e => setAge(parseInt(e.target.value) || 0)} min={0} />
                    </FormField>
                    <FormField label="Alinhamento">
                      <select className={selectClass} value={alignment} onChange={e => setAlignment(e.target.value)}>
                        <option value="">Selecione...</option>
                        {ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </FormField>
                    <FormField label="Antecedente">
                      <select className={selectClass} value={background} onChange={e => setBackground(e.target.value)}>
                        <option value="">Selecione...</option>
                        {BACKGROUNDS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </FormField>
                  </div>
                </div>
              )}

              {/* Step 1: Attributes */}
              {step === 1 && (
                <div className="section-card gold-border p-6 space-y-5">
                  <SectionTitle icon={<Dices className="w-5 h-5" />}>Atributos</SectionTitle>
                  <p className="text-sm text-[#e8dcc8]/60 -mt-2">
                    Distribua os valores entre os 6 atributos. Você pode usar o Standard Array (15, 14, 13, 12, 10, 8) ou definir valores manualmente. O modificador é calculado automaticamente.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      onClick={() => setAttrScores([15, 14, 13, 12, 10, 8])}
                      className="px-3 py-1.5 text-xs rounded-md bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 hover:bg-[#c9a84c]/30 transition-colors"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Standard Array
                    </button>
                    <button
                      onClick={() => setAttrScores([10, 10, 10, 10, 10, 10])}
                      className="px-3 py-1.5 text-xs rounded-md bg-[#c9a84c]/10 text-[#c9a84c]/70 border border-[#c9a84c]/20 hover:bg-[#c9a84c]/20 transition-colors"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Resetar (10s)
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {ATTRIBUTE_NAMES.map((attr, i) => {
                      const mod = calcModifier(attrScores[i]);
                      const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
                      return (
                        <div key={attr.abbr} className="attribute-box">
                          <span className="text-xs uppercase tracking-wider text-[#c9a84c]/80 font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>
                            {attr.abbr}
                          </span>
                          <input
                            type="number"
                            className="w-16 text-center text-2xl font-bold bg-transparent text-[#e8dcc8] border-b border-[#c9a84c]/30 focus:border-[#c9a84c] focus:outline-none mt-1"
                            value={attrScores[i]}
                            onChange={e => handleAttrChange(i, Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                            min={1}
                            max={30}
                          />
                          <span className="text-lg font-bold text-[#c9a84c] mt-1">{modStr}</span>
                          <span className="text-[8px] uppercase tracking-wider text-[#e8dcc8]/40 mt-1">{attr.name}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Derived stats preview */}
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="section-card text-center p-3">
                      <Heart className="w-4 h-4 text-red-400 mx-auto mb-1" />
                      <div className="text-lg font-bold text-[#e8dcc8]">{hitPoints}</div>
                      <div className="text-[10px] text-[#e8dcc8]/50 uppercase">Pontos de Vida</div>
                    </div>
                    <div className="section-card text-center p-3">
                      <Shield className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                      <div className="text-lg font-bold text-[#e8dcc8]">{armorClass}</div>
                      <div className="text-[10px] text-[#e8dcc8]/50 uppercase">Classe de Armadura</div>
                    </div>
                    <div className="section-card text-center p-3">
                      <Sparkles className="w-4 h-4 text-[#c9a84c] mx-auto mb-1" />
                      <div className="text-lg font-bold text-[#e8dcc8]">+{profBonus}</div>
                      <div className="text-[10px] text-[#e8dcc8]/50 uppercase">Bônus Prof.</div>
                    </div>
                    <div className="section-card text-center p-3">
                      <Dices className="w-4 h-4 text-green-400 mx-auto mb-1" />
                      <div className="text-lg font-bold text-[#e8dcc8]">{dexMod >= 0 ? `+${dexMod}` : dexMod}</div>
                      <div className="text-[10px] text-[#e8dcc8]/50 uppercase">Iniciativa</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Skills */}
              {step === 2 && (
                <div className="section-card gold-border p-6 space-y-5">
                  <SectionTitle icon={<BookOpen className="w-5 h-5" />}>Perícias</SectionTitle>
                  <p className="text-sm text-[#e8dcc8]/60 -mt-2">
                    Escolha <strong className="text-[#c9a84c]">{maxSkills}</strong> perícias da sua classe.
                    Perícias com proficiência ganham +{profBonus} ao modificador.
                    {selectedClass && (
                      <span className="block mt-1">
                        Perícias disponíveis para {selectedClass.label}: <strong className="text-[#c9a84c]">{selectedClass.skillChoices.join(", ")}</strong>
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-[#e8dcc8]/40">
                    Selecionadas: {selectedSkills.length}/{maxSkills}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ALL_SKILLS.map(sk => {
                      const isClassSkill = selectedClass?.skillChoices.includes(sk.name) ?? false;
                      const isSelected = selectedSkills.includes(sk.name);
                      const attrIndex = ATTRIBUTE_NAMES.findIndex(a => a.name === sk.attribute);
                      const attrMod = attrIndex >= 0 ? calcModifier(attrScores[attrIndex]) : 0;
                      const totalMod = attrMod + (isSelected ? profBonus : 0);
                      const modStr = totalMod >= 0 ? `+${totalMod}` : `${totalMod}`;

                      return (
                        <button
                          key={sk.name}
                          onClick={() => isClassSkill && toggleSkill(sk.name)}
                          disabled={!isClassSkill}
                          className={`flex items-center justify-between px-3 py-2 rounded-md border transition-all text-left ${
                            isSelected
                              ? "bg-[#c9a84c]/20 border-[#c9a84c]/60 text-[#e8dcc8]"
                              : isClassSkill
                              ? "bg-[oklch(0.12_0.015_250)] border-[#c9a84c]/20 text-[#e8dcc8]/80 hover:border-[#c9a84c]/40"
                              : "bg-[oklch(0.10_0.015_250)] border-[#e8dcc8]/10 text-[#e8dcc8]/30 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${isSelected ? "bg-[#c9a84c] border-[#c9a84c]" : "border-[#c9a84c]/30"}`}>
                              {isSelected && <Check className="w-3 h-3 text-[oklch(0.12_0.015_250)]" />}
                            </div>
                            <span className="text-sm">{sk.name}</span>
                            <span className="text-[10px] text-[#e8dcc8]/40">({sk.attribute.slice(0, 3).toUpperCase()})</span>
                          </div>
                          <span className={`text-sm font-bold ${isSelected ? "text-[#c9a84c]" : "text-[#e8dcc8]/50"}`}>
                            {modStr}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Combat & Equipment */}
              {step === 3 && (
                <div className="section-card gold-border p-6 space-y-5">
                  <SectionTitle icon={<Sword className="w-5 h-5" />}>Combate & Equipamento</SectionTitle>
                  <p className="text-sm text-[#e8dcc8]/60 -mt-2">
                    Defina seus ataques e liste seu equipamento. Você pode adicionar mais ataques clicando no botão abaixo.
                  </p>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-[#c9a84c]" style={{ fontFamily: "'Cinzel', serif" }}>Ataques</h3>
                    {attacks.map((atk, i) => (
                      <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-md bg-[oklch(0.12_0.015_250)] border border-[#c9a84c]/10">
                        <input className={inputClass} placeholder="Nome do ataque" value={atk.name} onChange={e => { const n = [...attacks]; n[i].name = e.target.value; setAttacks(n); }} />
                        <input className={inputClass} placeholder="Bônus (ex: +5)" value={atk.bonus} onChange={e => { const n = [...attacks]; n[i].bonus = e.target.value; setAttacks(n); }} />
                        <input className={inputClass} placeholder="Dano (ex: 1d8+3)" value={atk.damage} onChange={e => { const n = [...attacks]; n[i].damage = e.target.value; setAttacks(n); }} />
                        <input className={inputClass} placeholder="Tipo (ex: Cortante)" value={atk.type} onChange={e => { const n = [...attacks]; n[i].type = e.target.value; setAttacks(n); }} />
                        <div className="sm:col-span-2">
                          <input className={inputClass} placeholder="Descrição breve" value={atk.description} onChange={e => { const n = [...attacks]; n[i].description = e.target.value; setAttacks(n); }} />
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setAttacks([...attacks, { name: "", bonus: "", damage: "", type: "", description: "" }])}
                      className="text-xs text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors"
                    >
                      + Adicionar Ataque
                    </button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-[#c9a84c]" style={{ fontFamily: "'Cinzel', serif" }}>Habilidades / Traços</h3>
                    {features.map((feat, i) => (
                      <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-md bg-[oklch(0.12_0.015_250)] border border-[#c9a84c]/10">
                        <input className={inputClass} placeholder="Nome da habilidade" value={feat.name} onChange={e => { const n = [...features]; n[i].name = e.target.value; setFeatures(n); }} />
                        <select className={selectClass} value={feat.source} onChange={e => { const n = [...features]; n[i].source = e.target.value; setFeatures(n); }}>
                          <option value="Classe">Classe</option>
                          <option value="Raça">Raça</option>
                          <option value="Subclasse">Subclasse</option>
                          <option value="Antecedente">Antecedente</option>
                        </select>
                        <div className="sm:col-span-2">
                          <textarea className={inputClass + " min-h-[60px]"} placeholder="Descrição da habilidade" value={feat.description} onChange={e => { const n = [...features]; n[i].description = e.target.value; setFeatures(n); }} />
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setFeatures([...features, { name: "", description: "", source: "Classe" }])}
                      className="text-xs text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors"
                    >
                      + Adicionar Habilidade
                    </button>
                  </div>

                  <FormField label="Equipamento" hint="Liste seus itens, um por linha">
                    <textarea
                      className={inputClass + " min-h-[100px]"}
                      value={equipment}
                      onChange={e => setEquipment(e.target.value)}
                      placeholder={"Espada longa\nArmadura de cota de malha\nEscudo\nPacote de explorador"}
                    />
                  </FormField>
                </div>
              )}

              {/* Step 4: Personality & Photo */}
              {step === 4 && (
                <div className="section-card gold-border p-6 space-y-5">
                  <SectionTitle icon={<ScrollText className="w-5 h-5" />}>Personalidade & Aparência</SectionTitle>
                  <p className="text-sm text-[#e8dcc8]/60 -mt-2">
                    Dê vida ao seu personagem! Descreva sua personalidade, motivações e aparência.
                  </p>

                  {/* Photo upload */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-48 h-48 rounded-lg border-2 border-dashed border-[#c9a84c]/30 overflow-hidden flex items-center justify-center bg-[oklch(0.12_0.015_250)] hover:border-[#c9a84c]/60 transition-colors group">
                      {artPreview ? (
                        <img src={artPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-4">
                          <Upload className="w-8 h-8 text-[#c9a84c]/40 mx-auto mb-2 group-hover:text-[#c9a84c]/70 transition-colors" />
                          <span className="text-xs text-[#e8dcc8]/40 group-hover:text-[#e8dcc8]/60 transition-colors">Clique para enviar foto</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    <span className="text-xs text-[#e8dcc8]/40">Máximo 5MB • JPG, PNG ou WebP</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Descrição Física">
                      <textarea className={inputClass + " min-h-[80px]"} value={description} onChange={e => setDescription(e.target.value)} placeholder="Aparência, roupas, marcas..." />
                    </FormField>
                    <FormField label="Essência" hint="Quem é seu personagem em uma frase?">
                      <textarea className={inputClass + " min-h-[80px]"} value={essence} onChange={e => setEssence(e.target.value)} placeholder="O que define seu personagem..." />
                    </FormField>
                    <FormField label="Personalidade">
                      <textarea className={inputClass + " min-h-[60px]"} value={personality} onChange={e => setPersonality(e.target.value)} placeholder="Traços de personalidade..." />
                    </FormField>
                    <FormField label="Ideais">
                      <textarea className={inputClass + " min-h-[60px]"} value={ideals} onChange={e => setIdeals(e.target.value)} placeholder="O que você acredita..." />
                    </FormField>
                    <FormField label="Vínculos">
                      <textarea className={inputClass + " min-h-[60px]"} value={bonds} onChange={e => setBonds(e.target.value)} placeholder="Pessoas ou lugares importantes..." />
                    </FormField>
                    <FormField label="Fraquezas">
                      <textarea className={inputClass + " min-h-[60px]"} value={flaws} onChange={e => setFlaws(e.target.value)} placeholder="Defeitos ou vulnerabilidades..." />
                    </FormField>
                  </div>

                  <FormField label="Frase Marcante" hint="Uma citação que define seu personagem">
                    <input className={inputClass} value={quote} onChange={e => setQuote(e.target.value)} placeholder='"A escuridão pode ser forte, mas a luz sempre encontra um caminho."' />
                  </FormField>
                </div>
              )}

              {/* Step 5: Review */}
              {step === 5 && (
                <div className="section-card gold-border p-6 space-y-5">
                  <SectionTitle icon={<Check className="w-5 h-5" />}>Revisão Final</SectionTitle>
                  <p className="text-sm text-[#e8dcc8]/60 -mt-2">
                    Confira os dados do seu personagem antes de salvar.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left column */}
                    <div className="space-y-4">
                      {artPreview && (
                        <div className="w-full h-48 rounded-lg overflow-hidden">
                          <img src={artPreview} alt={name} className="w-full h-full object-cover object-top" />
                        </div>
                      )}
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold gold-text-glow" style={{ fontFamily: "'Cinzel', serif" }}>{name || "Sem Nome"}</h3>
                        {title && <p className="text-sm text-[#e8dcc8]/60 italic">{title}</p>}
                        <div className="text-sm space-y-1 text-[#e8dcc8]/70">
                          <p>Jogador: <strong className="text-[#e8dcc8]">{player || "—"}</strong></p>
                          <p>Raça: <strong className="text-[#e8dcc8]">{race || "—"}</strong></p>
                          <p>Classe: <strong className="text-[#e8dcc8]">{className || "—"}</strong> {subclass && `(${subclass})`}</p>
                          <p>Nível: <strong className="text-[#e8dcc8]">{level}</strong></p>
                          <p>Alinhamento: <strong className="text-[#e8dcc8]">{alignment || "—"}</strong></p>
                        </div>
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        {attributes.map(attr => {
                          const modStr = attr.modifier >= 0 ? `+${attr.modifier}` : `${attr.modifier}`;
                          return (
                            <div key={attr.abbr} className="attribute-box py-2">
                              <span className="text-[10px] uppercase text-[#c9a84c]/80 font-semibold">{attr.abbr}</span>
                              <span className="text-xl font-bold text-[#e8dcc8]">{modStr}</span>
                              <span className="text-[10px] text-[#e8dcc8]/50">{attr.score}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="section-card p-2">
                          <div className="text-sm font-bold text-[#e8dcc8]">{hitPoints} PV</div>
                          <div className="text-[10px] text-[#e8dcc8]/50">Pontos de Vida</div>
                        </div>
                        <div className="section-card p-2">
                          <div className="text-sm font-bold text-[#e8dcc8]">{armorClass} CA</div>
                          <div className="text-[10px] text-[#e8dcc8]/50">Classe de Armadura</div>
                        </div>
                      </div>

                      {selectedSkills.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-[#c9a84c] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Perícias</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedSkills.map(sk => (
                              <span key={sk} className="text-xs px-2 py-0.5 rounded-full bg-[#c9a84c]/20 text-[#c9a84c]">{sk}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Save button */}
                  <div className="pt-4 border-t border-[#c9a84c]/20">
                    <button
                      onClick={handleSave}
                      disabled={!name || !race || !className || createChar.isPending || uploadArt.isPending}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#c9a84c] text-[oklch(0.12_0.015_250)] font-bold hover:bg-[#e0c872] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {(createChar.isPending || uploadArt.isPending) ? (
                        <>Salvando...</>
                      ) : (
                        <><Save className="w-5 h-5" /> Salvar Personagem</>
                      )}
                    </button>
                    {(!name || !race || !className) && (
                      <p className="text-xs text-red-400/70 text-center mt-2">Preencha pelo menos Nome, Raça e Classe para salvar.</p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-[#c9a84c] border border-[#c9a84c]/30 hover:bg-[#c9a84c]/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              <ArrowLeft className="w-4 h-4" /> Anterior
            </button>
            <button
              onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
              disabled={step === STEPS.length - 1}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-[#c9a84c] border border-[#c9a84c]/30 hover:bg-[#c9a84c]/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Próximo <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
