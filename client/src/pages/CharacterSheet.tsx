/*
 * Design: "Grimório Arcano" — Dark Fantasy
 * Ficha de personagem completa, responsiva, com seções claras para iniciantes.
 * Layout: coluna única no mobile, duas colunas em desktop para dados + arte.
 */
import { useParams, Link } from "wouter";
import { getCharacterById } from "@/data/characters";
import type { Character, Attribute, Feature, Spell, Attack } from "@/data/characters";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Shield,
  Zap,
  Footprints,
  Dices,
  Swords,
  BookOpen,
  Sparkles,
  Star,
  User,
  ScrollText,
} from "lucide-react";

const BG_PATTERN = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029969796/5e7QM9V4aGBt6fZvi3YMN7/page-bg-pattern-FkoGmkKLPZJaJsc78xzxmy.webp";
const DIVIDER = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029969796/5e7QM9V4aGBt6fZvi3YMN7/ornamental-divider-6Fe7JypmoDXKRGgmewzWJE.webp";

function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      {icon && <span className="text-[#c9a84c]">{icon}</span>}
      <h2
        className="text-xl md:text-2xl font-bold gold-text"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        {children}
      </h2>
      <div className="flex-1 h-px bg-gradient-to-r from-[#c9a84c]/40 to-transparent" />
    </div>
  );
}

function AttributeCard({ attr }: { attr: Attribute }) {
  const modStr = attr.modifier >= 0 ? `+${attr.modifier}` : `${attr.modifier}`;
  return (
    <div className="attribute-box">
      <span className="text-xs uppercase tracking-wider text-[#c9a84c]/80 font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>
        {attr.abbr}
      </span>
      <span className="text-3xl font-bold text-[#e8dcc8] mt-1">{modStr}</span>
      <span className="text-xs text-[#e8dcc8]/50 mt-1">{attr.score}</span>
      {attr.saveProficient && (
        <span className="text-[8px] uppercase tracking-wider text-[#c9a84c]/60 mt-1">★ Resist.</span>
      )}
    </div>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const sourceColors: Record<string, string> = {
    Classe: "#c9a84c",
    Subclasse: "#3a6ea5",
    Raça: "#4a8c5c",
  };
  return (
    <div className="section-card group hover:gold-glow transition-all duration-300">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-bold text-[#e8dcc8] text-base" style={{ fontFamily: "'Cinzel', serif", fontSize: "0.95rem" }}>
          {feature.name}
        </h4>
        <span
          className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{
            color: sourceColors[feature.source] || "#c9a84c",
            border: `1px solid ${sourceColors[feature.source] || "#c9a84c"}40`,
          }}
        >
          {feature.source}
        </span>
      </div>
      <p className="text-sm text-[#e8dcc8]/70 leading-relaxed" style={{ fontFamily: "'Crimson Text', serif" }}>
        {feature.description}
      </p>
    </div>
  );
}

function AttackCard({ attack }: { attack: Attack }) {
  return (
    <div className="section-card">
      <h4 className="font-bold text-[#e8dcc8] mb-2" style={{ fontFamily: "'Cinzel', serif", fontSize: "0.95rem" }}>
        {attack.name}
      </h4>
      <div className="grid grid-cols-3 gap-2 mb-2 text-sm">
        <div className="text-center">
          <span className="block text-[10px] uppercase text-[#c9a84c]/60">Bônus</span>
          <span className="text-[#e8dcc8] font-semibold">{attack.bonus}</span>
        </div>
        <div className="text-center">
          <span className="block text-[10px] uppercase text-[#c9a84c]/60">Dano</span>
          <span className="text-[#e8dcc8] font-semibold">{attack.damage}</span>
        </div>
        <div className="text-center">
          <span className="block text-[10px] uppercase text-[#c9a84c]/60">Tipo</span>
          <span className="text-[#e8dcc8] font-semibold">{attack.type}</span>
        </div>
      </div>
      <p className="text-xs text-[#e8dcc8]/60 leading-relaxed" style={{ fontFamily: "'Crimson Text', serif" }}>
        {attack.description}
      </p>
    </div>
  );
}

function SpellCard({ spell }: { spell: Spell }) {
  return (
    <div className="section-card">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-bold text-[#e8dcc8]" style={{ fontFamily: "'Cinzel', serif", fontSize: "0.9rem" }}>
          {spell.name}
        </h4>
        <span className="text-[10px] uppercase tracking-wider text-[#3a6ea5] whitespace-nowrap">
          {spell.level === 0 ? "Truque" : `Nível ${spell.level}`}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-[#e8dcc8]/60 mb-2">
        <span>⏱ {spell.castingTime}</span>
        <span>📏 {spell.range}</span>
        <span>⏳ {spell.duration}</span>
        <span>📖 {spell.school}</span>
      </div>
      {spell.concentration && (
        <span className="inline-block text-[10px] uppercase tracking-wider text-amber-400/80 bg-amber-400/10 px-2 py-0.5 rounded mb-2">
          Concentração
        </span>
      )}
      <p className="text-sm text-[#e8dcc8]/70 leading-relaxed" style={{ fontFamily: "'Crimson Text', serif" }}>
        {spell.description}
      </p>
    </div>
  );
}

function StatBox({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-[oklch(0.12_0.015_250)] border border-[#c9a84c]/20">
      <span className="text-[#c9a84c]">{icon}</span>
      <span className="text-2xl font-bold text-[#e8dcc8]">{value}</span>
      <span className="text-[10px] uppercase tracking-wider text-[#e8dcc8]/50" style={{ fontFamily: "'Cinzel', serif" }}>
        {label}
      </span>
    </div>
  );
}

export default function CharacterSheet() {
  const params = useParams<{ id: string }>();
  const character = getCharacterById(params.id || "");

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${BG_PATTERN})`, backgroundSize: "400px" }}>
        <div className="text-center">
          <h1 className="text-3xl gold-text-glow mb-4" style={{ fontFamily: "'Cinzel', serif" }}>Personagem não encontrado</h1>
          <Link href="/">
            <span className="text-[#c9a84c] hover:text-[#e0c872] transition-colors flex items-center gap-2 justify-center">
              <ArrowLeft className="w-4 h-4" /> Voltar ao Grimório
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const c = character;

  return (
    <div
      className="min-h-screen pb-16"
      style={{
        backgroundImage: `url(${BG_PATTERN})`,
        backgroundSize: "400px",
        backgroundRepeat: "repeat",
      }}
    >
      {/* Header / Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[#c9a84c]/15 backdrop-blur-md bg-[oklch(0.10_0.015_250)]/90">
        <div className="container flex items-center justify-between py-3">
          <Link href="/">
            <span className="text-[#c9a84c] hover:text-[#e0c872] transition-colors flex items-center gap-2 text-sm">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline" style={{ fontFamily: "'Cinzel', serif" }}>Voltar ao Grimório</span>
              <span className="sm:hidden" style={{ fontFamily: "'Cinzel', serif" }}>Voltar</span>
            </span>
          </Link>
          <span className="text-sm text-[#e8dcc8]/50" style={{ fontFamily: "'Cinzel', serif" }}>
            Nível {c.level} — {c.class}
          </span>
        </div>
      </nav>

      <div className="container pt-6 md:pt-10">
        {/* Character Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
            {/* Art */}
            {c.artUrl && (
              <div className="w-full md:w-80 lg:w-96 shrink-0 rounded-lg overflow-hidden gold-border">
                <img
                  src={c.artUrl}
                  alt={c.name}
                  className="w-full object-cover"
                />
              </div>
            )}

            {/* Basic Info */}
            <div className="flex-1 w-full">
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold gold-text-glow mb-1"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {c.name}
              </h1>
              <p className="text-lg text-[#e8dcc8]/60 italic mb-4" style={{ fontFamily: "'Crimson Text', serif" }}>
                {c.title}
              </p>

              <img src={DIVIDER} alt="" className="w-48 opacity-50 mb-4" />

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-6" style={{ fontFamily: "'Crimson Text', serif" }}>
                <div className="flex justify-between text-[#e8dcc8]/70">
                  <span>Jogador(a):</span>
                  <span className="text-[#e8dcc8] font-semibold">{c.player}</span>
                </div>
                <div className="flex justify-between text-[#e8dcc8]/70">
                  <span>Raça:</span>
                  <span className="text-[#e8dcc8] font-semibold">{c.race}</span>
                </div>
                <div className="flex justify-between text-[#e8dcc8]/70">
                  <span>Classe:</span>
                  <span className="text-[#e8dcc8] font-semibold">{c.class}</span>
                </div>
                <div className="flex justify-between text-[#e8dcc8]/70">
                  <span>Subclasse:</span>
                  <span className="text-[#e8dcc8] font-semibold">{c.subclass}</span>
                </div>
                <div className="flex justify-between text-[#e8dcc8]/70">
                  <span>Nível:</span>
                  <span className="text-[#e8dcc8] font-semibold">{c.level}</span>
                </div>
                <div className="flex justify-between text-[#e8dcc8]/70">
                  <span>Idade:</span>
                  <span className="text-[#e8dcc8] font-semibold">{c.age} anos</span>
                </div>
                <div className="flex justify-between text-[#e8dcc8]/70">
                  <span>Alinhamento:</span>
                  <span className="text-[#e8dcc8] font-semibold">{c.alignment}</span>
                </div>
                <div className="flex justify-between text-[#e8dcc8]/70">
                  <span>Antecedente:</span>
                  <span className="text-[#e8dcc8] font-semibold">{c.background}</span>
                </div>
              </div>

              {/* Core Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatBox label="Pontos de Vida" value={c.hitPoints} icon={<Heart className="w-5 h-5" />} />
                <StatBox label="Classe de Armadura" value={c.armorClass} icon={<Shield className="w-5 h-5" />} />
                <StatBox label="Iniciativa" value={c.initiative >= 0 ? `+${c.initiative}` : c.initiative} icon={<Zap className="w-5 h-5" />} />
                <StatBox label="Deslocamento" value={`${c.speed}m`} icon={<Footprints className="w-5 h-5" />} />
              </div>

              <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#e8dcc8]/50">
                <span>🎲 Dados de Vida: <strong className="text-[#e8dcc8]/80">{c.hitDice}</strong></span>
                <span>⭐ Bônus de Proficiência: <strong className="text-[#e8dcc8]/80">+{c.proficiencyBonus}</strong></span>
                <span>🛡 CA: <strong className="text-[#e8dcc8]/80">{c.acDescription}</strong></span>
              </div>
            </div>
          </div>

          {/* Description & Essence */}
          <div className="mt-6 section-card">
            <p className="text-base text-[#e8dcc8]/80 leading-relaxed italic" style={{ fontFamily: "'Crimson Text', serif" }}>
              "{c.description}"
            </p>
            {c.essence && (
              <p className="mt-3 text-sm text-[#c9a84c]/70 leading-relaxed" style={{ fontFamily: "'Crimson Text', serif" }}>
                <strong>Essência:</strong> {c.essence}
              </p>
            )}
          </div>
        </motion.section>

        {/* Attributes */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <SectionTitle icon={<Dices className="w-5 h-5" />}>Atributos</SectionTitle>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {c.attributes.map((attr) => (
              <AttributeCard key={attr.abbr} attr={attr} />
            ))}
          </div>
          <div className="mt-3 section-card">
            <p className="text-xs text-[#e8dcc8]/50 leading-relaxed" style={{ fontFamily: "'Crimson Text', serif" }}>
              <strong className="text-[#c9a84c]/70">Como ler:</strong> O número grande é o <strong>modificador</strong> — é o que você soma (ou subtrai) nas rolagens de dado.
              O número pequeno abaixo é a pontuação base do atributo. A estrela (★) indica que o personagem tem proficiência em testes de resistência daquele atributo.
            </p>
          </div>
        </motion.section>

        {/* Skills */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-8"
        >
          <SectionTitle icon={<Star className="w-5 h-5" />}>Perícias</SectionTitle>
          <div className="section-card">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {c.skills.map((skill) => (
                <div key={skill.name} className="flex items-center justify-between py-1.5 px-3 rounded-md hover:bg-[oklch(0.18_0.015_250)] transition-colors">
                  <div className="flex items-center gap-2">
                    {skill.proficient && <span className="text-[#c9a84c] text-xs">●</span>}
                    {!skill.proficient && <span className="text-[#e8dcc8]/20 text-xs">○</span>}
                    <span className="text-sm text-[#e8dcc8]/80">{skill.name}</span>
                    <span className="text-[10px] text-[#e8dcc8]/40">({skill.attribute})</span>
                  </div>
                  <span className="text-sm font-semibold text-[#e8dcc8]">
                    {skill.modifier >= 0 ? `+${skill.modifier}` : skill.modifier}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-[#e8dcc8]/40" style={{ fontFamily: "'Crimson Text', serif" }}>
              ● = proficiente (bônus de proficiência +{c.proficiencyBonus} já incluído). O Mestre pede um teste de perícia quando o resultado de uma ação é incerto.
            </p>
          </div>
        </motion.section>

        {/* Attacks */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <SectionTitle icon={<Swords className="w-5 h-5" />}>Ataques</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {c.attacks.map((atk) => (
              <AttackCard key={atk.name} attack={atk} />
            ))}
          </div>
          <div className="mt-3 section-card">
            <p className="text-xs text-[#e8dcc8]/50 leading-relaxed" style={{ fontFamily: "'Crimson Text', serif" }}>
              <strong className="text-[#c9a84c]/70">Como atacar:</strong> Role 1d20 + Bônus de Ataque. Se o resultado for igual ou maior que a CA do inimigo, você acertou! Então role os dados de Dano.
              Se tirar 20 no d20, é um <strong>acerto crítico</strong> — role os dados de dano duas vezes!
            </p>
          </div>
        </motion.section>

        {/* Features & Traits */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-8"
        >
          <SectionTitle icon={<Sparkles className="w-5 h-5" />}>Habilidades e Traços</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {c.features.map((feat) => (
              <FeatureCard key={feat.name} feature={feat} />
            ))}
          </div>
        </motion.section>

        {/* Spellcasting */}
        {c.spellcasting && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <SectionTitle icon={<BookOpen className="w-5 h-5" />}>Magias</SectionTitle>

            {/* Spell Stats */}
            <div className="section-card mb-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
                <div>
                  <span className="block text-[10px] uppercase text-[#c9a84c]/60 mb-1">Atributo</span>
                  <span className="text-[#e8dcc8] font-semibold">{c.spellcasting.ability}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-[#c9a84c]/60 mb-1">CD de Magia</span>
                  <span className="text-[#e8dcc8] font-semibold">{c.spellcasting.saveDC}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-[#c9a84c]/60 mb-1">Bônus de Ataque</span>
                  <span className="text-[#e8dcc8] font-semibold">+{c.spellcasting.attackBonus}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-[#c9a84c]/60 mb-1">Espaços de Magia</span>
                  <span className="text-[#e8dcc8] font-semibold">
                    {c.spellcasting.slots.map((s) => `${s.total}× nível ${s.level}`).join(", ")}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs text-[#e8dcc8]/40 leading-relaxed" style={{ fontFamily: "'Crimson Text', serif" }}>
                <strong className="text-[#c9a84c]/70">Como funciona:</strong> Truques podem ser usados à vontade. Magias de nível 1+ gastam um espaço de magia.
                Espaços recuperam após um descanso longo{c.class === "Bruxa" ? " (ou curto, no caso da Bruxa)" : ""}.
                Quando uma magia pede um teste de resistência, o alvo rola 1d20 + modificador contra sua CD de Magia ({c.spellcasting.saveDC}).
              </p>
            </div>

            {/* Cantrips */}
            {c.spellcasting.spells.filter((s) => s.level === 0).length > 0 && (
              <div className="mb-4">
                <h3 className="text-base font-semibold text-[#c9a84c]/80 mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
                  Truques (uso ilimitado)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {c.spellcasting.spells
                    .filter((s) => s.level === 0)
                    .map((spell) => (
                      <SpellCard key={spell.name} spell={spell} />
                    ))}
                </div>
              </div>
            )}

            {/* Level 1+ Spells */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => {
              const spellsAtLevel = c.spellcasting!.spells.filter((s) => s.level === level);
              if (spellsAtLevel.length === 0) return null;
              const slotInfo = c.spellcasting!.slots.find((s) => s.level === level);
              return (
                <div key={level} className="mb-4">
                  <h3 className="text-base font-semibold text-[#c9a84c]/80 mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
                    Nível {level}
                    {slotInfo && (
                      <span className="text-xs text-[#e8dcc8]/40 ml-2 font-normal">
                        ({slotInfo.total} espaço{slotInfo.total > 1 ? "s" : ""})
                      </span>
                    )}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {spellsAtLevel.map((spell) => (
                      <SpellCard key={spell.name} spell={spell} />
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.section>
        )}

        {/* Proficiencies */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mb-8"
        >
          <SectionTitle icon={<ScrollText className="w-5 h-5" />}>Proficiências</SectionTitle>
          <div className="section-card">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm" style={{ fontFamily: "'Crimson Text', serif" }}>
              {c.proficiencies.armor.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#c9a84c]/60 block mb-1">Armaduras</span>
                  <span className="text-[#e8dcc8]/70">{c.proficiencies.armor.join(", ")}</span>
                </div>
              )}
              {c.proficiencies.weapons.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#c9a84c]/60 block mb-1">Armas</span>
                  <span className="text-[#e8dcc8]/70">{c.proficiencies.weapons.join(", ")}</span>
                </div>
              )}
              {c.proficiencies.tools.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#c9a84c]/60 block mb-1">Ferramentas</span>
                  <span className="text-[#e8dcc8]/70">{c.proficiencies.tools.join(", ")}</span>
                </div>
              )}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#c9a84c]/60 block mb-1">Idiomas</span>
                <span className="text-[#e8dcc8]/70">{c.proficiencies.languages.join(", ")}</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Equipment */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <SectionTitle icon={<User className="w-5 h-5" />}>Equipamento</SectionTitle>
          <div className="section-card">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm" style={{ fontFamily: "'Crimson Text', serif" }}>
              {c.equipment.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[#e8dcc8]/70">
                  <span className="text-[#c9a84c]/40">◆</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Personality */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mb-8"
        >
          <SectionTitle icon={<User className="w-5 h-5" />}>Personalidade</SectionTitle>
          <div className="section-card space-y-3 text-sm" style={{ fontFamily: "'Crimson Text', serif" }}>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#c9a84c]/60 block mb-1">Traços de Personalidade</span>
              <p className="text-[#e8dcc8]/70">{c.personality}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#c9a84c]/60 block mb-1">Ideais</span>
              <p className="text-[#e8dcc8]/70">{c.ideals}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#c9a84c]/60 block mb-1">Vínculos</span>
              <p className="text-[#e8dcc8]/70">{c.bonds}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#c9a84c]/60 block mb-1">Defeitos</span>
              <p className="text-[#e8dcc8]/70">{c.flaws}</p>
            </div>
          </div>
        </motion.section>

        {/* Quote */}
        {c.quote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center py-8"
          >
            <img src={DIVIDER} alt="" className="w-48 mx-auto mb-4 opacity-40" />
            <p className="text-lg italic text-[#c9a84c]/60 max-w-2xl mx-auto" style={{ fontFamily: "'Crimson Text', serif" }}>
              "{c.quote}"
            </p>
            <img src={DIVIDER} alt="" className="w-48 mx-auto mt-4 opacity-40 rotate-180" />
          </motion.div>
        )}
      </div>
    </div>
  );
}
