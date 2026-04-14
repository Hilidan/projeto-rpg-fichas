/**
 * Ficha de Personagem Customizado — Exibe ficha salva no banco de dados
 * Mesmo estilo visual do CharacterSheet.tsx original
 */
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import {
  ArrowLeft, Heart, Shield, Zap, Footprints, Dices,
  Swords, BookOpen, Sparkles, Star, User, ScrollText,
} from "lucide-react";

const BG_PATTERN = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029969796/5e7QM9V4aGBt6fZvi3YMN7/page-bg-pattern-FkoGmkKLPZJaJsc78xzxmy.webp";
const DIVIDER = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029969796/5e7QM9V4aGBt6fZvi3YMN7/ornamental-divider-6Fe7JypmoDXKRGgmewzWJE.webp";

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

export default function CustomCharacterSheet() {
  const { id } = useParams<{ id: string }>();
  const { data: char, isLoading, error } = trpc.character.getById.useQuery(
    { id: parseInt(id || "0") },
    { enabled: !!id }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${BG_PATTERN})`, backgroundSize: "400px", backgroundRepeat: "repeat" }}>
        <div className="text-[#c9a84c] animate-pulse text-xl" style={{ fontFamily: "'Cinzel', serif" }}>Carregando ficha...</div>
      </div>
    );
  }

  if (error || !char) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${BG_PATTERN})`, backgroundSize: "400px", backgroundRepeat: "repeat" }}>
        <div className="section-card gold-border p-8 text-center max-w-md mx-4">
          <h2 className="text-2xl font-bold gold-text mb-3" style={{ fontFamily: "'Cinzel', serif" }}>Personagem não encontrado</h2>
          <Link href="/meus-personagens" className="text-[#c9a84c] hover:text-[#e0c872] transition-colors text-sm">
            Voltar para Meus Personagens
          </Link>
        </div>
      </div>
    );
  }

  const attributes = (char.attributes as any[]) || [];
  const skills = (char.skills as any[]) || [];
  const attacks = (char.attacks as any[]) || [];
  const features = (char.features as any[]) || [];
  const proficiencies = (char.proficiencies as any) || {};
  const spellcasting = (char.spellcasting as any) || null;
  const equipment = (char.equipment as string[]) || [];

  return (
    <div className="min-h-screen" style={{ backgroundImage: `url(${BG_PATTERN})`, backgroundSize: "400px", backgroundRepeat: "repeat" }}>
      {/* Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[oklch(0.10_0.015_250)]/90 border-b border-[#c9a84c]/20">
        <div className="container flex items-center justify-between py-3">
          <Link href="/meus-personagens" className="flex items-center gap-2 text-[#c9a84c] hover:text-[#e0c872] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm" style={{ fontFamily: "'Cinzel', serif" }}>Voltar</span>
          </Link>
          <h1 className="text-lg font-bold gold-text-glow truncate max-w-[200px]" style={{ fontFamily: "'Cinzel', serif" }}>
            {char.name}
          </h1>
          <div className="w-16" />
        </div>
      </nav>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Hero section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-card gold-border p-6"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Art */}
              {char.artUrl && (
                <div className="w-full md:w-64 h-64 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={char.artUrl as string} alt={char.name} className="w-full h-full object-cover object-top" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold gold-text-glow" style={{ fontFamily: "'Cinzel', serif" }}>
                  {char.name}
                </h2>
                {char.title && (
                  <p className="text-[#e8dcc8]/60 italic mt-1" style={{ fontFamily: "'Crimson Text', serif" }}>
                    {char.title as string}
                  </p>
                )}

                <img src={DIVIDER} alt="" className="w-32 opacity-40 my-3" />

                <div className="grid grid-cols-2 gap-2 text-sm" style={{ fontFamily: "'Crimson Text', serif" }}>
                  <div className="text-[#e8dcc8]/60">Jogador: <strong className="text-[#e8dcc8]">{char.player || "—"}</strong></div>
                  <div className="text-[#e8dcc8]/60">Raça: <strong className="text-[#e8dcc8]">{char.race}</strong></div>
                  <div className="text-[#e8dcc8]/60">Classe: <strong className="text-[#e8dcc8]">{char.className} {char.subclass ? `(${char.subclass})` : ""}</strong></div>
                  <div className="text-[#e8dcc8]/60">Nível: <strong className="text-[#e8dcc8]">{char.level}</strong></div>
                  {char.alignment && <div className="text-[#e8dcc8]/60">Alinhamento: <strong className="text-[#e8dcc8]">{char.alignment}</strong></div>}
                  {char.background && <div className="text-[#e8dcc8]/60">Antecedente: <strong className="text-[#e8dcc8]">{char.background}</strong></div>}
                </div>

                {char.essence && (
                  <div className="mt-4 p-3 rounded-md bg-[oklch(0.12_0.015_250)] border border-[#c9a84c]/20">
                    <span className="text-xs uppercase tracking-wider text-[#c9a84c]/60 font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>Essência</span>
                    <p className="text-sm text-[#e8dcc8]/80 mt-1 italic">{char.essence}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Combat Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="section-card gold-border p-6"
          >
            <SectionTitle icon={<Shield className="w-5 h-5" />}>Estatísticas de Combate</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="attribute-box">
                <Heart className="w-4 h-4 text-red-400 mb-1" />
                <span className="text-2xl font-bold text-[#e8dcc8]">{char.hitPoints}</span>
                <span className="text-[10px] text-[#e8dcc8]/50 uppercase">PV</span>
              </div>
              <div className="attribute-box">
                <Shield className="w-4 h-4 text-blue-400 mb-1" />
                <span className="text-2xl font-bold text-[#e8dcc8]">{char.armorClass}</span>
                <span className="text-[10px] text-[#e8dcc8]/50 uppercase">CA</span>
              </div>
              <div className="attribute-box">
                <Zap className="w-4 h-4 text-yellow-400 mb-1" />
                <span className="text-2xl font-bold text-[#e8dcc8]">{(char.initiative ?? 0) >= 0 ? `+${char.initiative}` : char.initiative}</span>
                <span className="text-[10px] text-[#e8dcc8]/50 uppercase">Iniciativa</span>
              </div>
              <div className="attribute-box">
                <Footprints className="w-4 h-4 text-green-400 mb-1" />
                <span className="text-2xl font-bold text-[#e8dcc8]">{char.speed || 9}m</span>
                <span className="text-[10px] text-[#e8dcc8]/50 uppercase">Deslocamento</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-[#e8dcc8]/60">
              <span>Bônus de Proficiência: <strong className="text-[#c9a84c]">+{char.proficiencyBonus || 2}</strong></span>
              <span>Dado de Vida: <strong className="text-[#c9a84c]">{char.hitDice || "—"}</strong></span>
            </div>
          </motion.div>

          {/* Attributes */}
          {attributes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="section-card gold-border p-6"
            >
              <SectionTitle icon={<Dices className="w-5 h-5" />}>Atributos</SectionTitle>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {attributes.map((attr: any) => {
                  const modStr = attr.modifier >= 0 ? `+${attr.modifier}` : `${attr.modifier}`;
                  return (
                    <div key={attr.abbr} className="attribute-box">
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
                })}
              </div>
            </motion.div>
          )}

          {/* Skills */}
          {skills.filter((s: any) => s.proficient).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="section-card gold-border p-6"
            >
              <SectionTitle icon={<BookOpen className="w-5 h-5" />}>Perícias</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {skills.filter((s: any) => s.proficient).map((sk: any) => {
                  const modStr = sk.modifier >= 0 ? `+${sk.modifier}` : `${sk.modifier}`;
                  return (
                    <div key={sk.name} className="flex items-center justify-between px-3 py-2 rounded-md bg-[oklch(0.12_0.015_250)] border border-[#c9a84c]/20">
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-[#c9a84c]" />
                        <span className="text-sm text-[#e8dcc8]">{sk.name}</span>
                        <span className="text-[10px] text-[#e8dcc8]/40">({sk.attribute?.slice(0, 3).toUpperCase()})</span>
                      </div>
                      <span className="text-sm font-bold text-[#c9a84c]">{modStr}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Attacks */}
          {attacks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="section-card gold-border p-6"
            >
              <SectionTitle icon={<Swords className="w-5 h-5" />}>Ataques</SectionTitle>
              <div className="space-y-3">
                {attacks.map((atk: any, i: number) => (
                  <div key={i} className="p-3 rounded-md bg-[oklch(0.12_0.015_250)] border border-[#c9a84c]/10">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-[#e8dcc8]" style={{ fontFamily: "'Cinzel', serif" }}>{atk.name}</h4>
                      <div className="flex gap-3 text-xs text-[#e8dcc8]/60">
                        {atk.bonus && <span>Bônus: <strong className="text-[#c9a84c]">{atk.bonus}</strong></span>}
                        {atk.damage && <span>Dano: <strong className="text-red-400">{atk.damage}</strong></span>}
                      </div>
                    </div>
                    {atk.description && <p className="text-xs text-[#e8dcc8]/60">{atk.description}</p>}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Features */}
          {features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="section-card gold-border p-6"
            >
              <SectionTitle icon={<Sparkles className="w-5 h-5" />}>Habilidades & Traços</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feat: any, i: number) => {
                  const sourceColors: Record<string, string> = {
                    Classe: "#3a6ea5",
                    Raça: "#2d8a4e",
                    Subclasse: "#8a5cf5",
                    Antecedente: "#a08030",
                  };
                  const color = sourceColors[feat.source] || "#c9a84c";
                  return (
                    <div key={i} className="p-3 rounded-md bg-[oklch(0.12_0.015_250)] border-l-2" style={{ borderColor: color }}>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-[#e8dcc8] text-sm" style={{ fontFamily: "'Cinzel', serif" }}>{feat.name}</h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${color}20`, color }}>{feat.source}</span>
                      </div>
                      {feat.description && <p className="text-xs text-[#e8dcc8]/60">{feat.description}</p>}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Equipment */}
          {equipment.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="section-card gold-border p-6"
            >
              <SectionTitle icon={<ScrollText className="w-5 h-5" />}>Equipamento</SectionTitle>
              <ul className="space-y-1">
                {equipment.map((item: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[#e8dcc8]/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]/50" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Personality */}
          {(char.personality || char.ideals || char.bonds || char.flaws) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="section-card gold-border p-6"
            >
              <SectionTitle icon={<User className="w-5 h-5" />}>Personalidade</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {char.personality && (
                  <div>
                    <h4 className="text-xs font-bold text-[#c9a84c] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Traços</h4>
                    <p className="text-sm text-[#e8dcc8]/70">{char.personality}</p>
                  </div>
                )}
                {char.ideals && (
                  <div>
                    <h4 className="text-xs font-bold text-[#c9a84c] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Ideais</h4>
                    <p className="text-sm text-[#e8dcc8]/70">{char.ideals}</p>
                  </div>
                )}
                {char.bonds && (
                  <div>
                    <h4 className="text-xs font-bold text-[#c9a84c] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Vínculos</h4>
                    <p className="text-sm text-[#e8dcc8]/70">{char.bonds}</p>
                  </div>
                )}
                {char.flaws && (
                  <div>
                    <h4 className="text-xs font-bold text-[#c9a84c] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Fraquezas</h4>
                    <p className="text-sm text-[#e8dcc8]/70">{char.flaws}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Quote */}
          {char.quote && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center py-6"
            >
              <img src={DIVIDER} alt="" className="w-48 mx-auto opacity-40 mb-4" />
              <p className="text-lg italic text-[#c9a84c]/70" style={{ fontFamily: "'Crimson Text', serif" }}>
                "{char.quote}"
              </p>
              <img src={DIVIDER} alt="" className="w-48 mx-auto opacity-40 mt-4" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
