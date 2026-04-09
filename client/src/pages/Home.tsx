/*
 * Design: "Grimório Arcano" — Dark Fantasy
 * Página inicial: cards dos personagens como entradas de um grimório.
 * Fundo escuro com padrão arcano, hero banner, cards com borda dourada.
 */
import { Link } from "wouter";
import { characters } from "@/data/characters";
import { motion } from "framer-motion";
import { Shield, Flame, Leaf, Skull, Sword } from "lucide-react";

const HERO_BANNER = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029969796/5e7QM9V4aGBt6fZvi3YMN7/hero-banner-HemJrKiadaGYEHGLSJEciv.webp";
const BG_PATTERN = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029969796/5e7QM9V4aGBt6fZvi3YMN7/page-bg-pattern-FkoGmkKLPZJaJsc78xzxmy.webp";
const DIVIDER = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029969796/5e7QM9V4aGBt6fZvi3YMN7/ornamental-divider-6Fe7JypmoDXKRGgmewzWJE.webp";

const classIcons: Record<string, React.ReactNode> = {
  "Paladina": <Shield className="w-6 h-6" />,
  "Druida": <Leaf className="w-6 h-6" />,
  "Bruxa": <Skull className="w-6 h-6" />,
  "Feiticeira": <Flame className="w-6 h-6" />,
  "Bárbaro": <Sword className="w-6 h-6" />,
};

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${BG_PATTERN})`,
        backgroundSize: "400px",
        backgroundRepeat: "repeat",
      }}
    >
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div className="relative w-full flex flex-col items-center justify-center py-12 md:py-20">
          <img
            src={HERO_BANNER}
            alt="Grimório Arcano"
            className="w-full max-w-4xl mx-auto object-contain px-4"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mt-6 md:mt-8 px-4"
          >
            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-wider gold-text-glow"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Projeto RPG
            </h1>
            <p className="mt-3 text-lg md:text-xl text-[#e8dcc8]/80" style={{ fontFamily: "'Crimson Text', serif" }}>
              Fichas dos Aventureiros — Dungeons & Dragons 5ª Edição
            </p>
          </motion.div>
          <img
            src={DIVIDER}
            alt=""
            className="w-64 md:w-80 mt-6 opacity-70"
          />
        </div>
      </section>

      {/* Characters Grid */}
      <section className="container pb-20 pt-4">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-2xl md:text-3xl font-semibold gold-text mb-10"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Escolha um Aventureiro
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {characters.map((char, index) => (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <Link href={`/personagem/${char.id}`}>
                <div
                  className="group relative overflow-hidden rounded-lg gold-border p-6 transition-all duration-300 hover:gold-glow hover:-translate-y-1"
                  style={{
                    background: `linear-gradient(135deg, oklch(0.14 0.018 250) 0%, oklch(0.11 0.02 250) 100%)`,
                  }}
                >
                  {/* Accent line at top */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 opacity-80 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: char.accentColor }}
                  />

                  {/* Character Art (if available) */}
                  {char.artUrl && (
                    <div className="w-full h-48 mb-4 overflow-hidden rounded-md">
                      <img
                        src={char.artUrl}
                        alt={char.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Character Info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3
                        className="text-2xl font-bold gold-text-glow group-hover:text-[#e0c872] transition-colors"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        {char.name}
                      </h3>
                      <p className="text-sm text-[#e8dcc8]/60 italic mt-0.5" style={{ fontFamily: "'Crimson Text', serif" }}>
                        {char.title}
                      </p>
                    </div>
                    <div
                      className="p-2 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                      style={{ color: char.accentColor }}
                    >
                      {classIcons[char.class] || <Shield className="w-6 h-6" />}
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5 text-sm" style={{ fontFamily: "'Crimson Text', serif" }}>
                    <div className="flex justify-between text-[#e8dcc8]/70">
                      <span>Raça</span>
                      <span className="text-[#e8dcc8]/90 font-semibold">{char.race}</span>
                    </div>
                    <div className="flex justify-between text-[#e8dcc8]/70">
                      <span>Classe</span>
                      <span className="text-[#e8dcc8]/90 font-semibold">{char.class}</span>
                    </div>
                    <div className="flex justify-between text-[#e8dcc8]/70">
                      <span>Nível</span>
                      <span className="text-[#e8dcc8]/90 font-semibold">{char.level}</span>
                    </div>
                    <div className="flex justify-between text-[#e8dcc8]/70">
                      <span>Jogador</span>
                      <span className="text-[#e8dcc8]/90 font-semibold">{char.player}</span>
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div className="mt-5 pt-3 border-t border-[#c9a84c]/20 text-center">
                    <span className="text-xs uppercase tracking-widest text-[#c9a84c]/50 group-hover:text-[#c9a84c]/80 transition-colors" style={{ fontFamily: "'Cinzel', serif" }}>
                      Ver Ficha Completa
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#c9a84c]/10 py-8 text-center">
        <img src={DIVIDER} alt="" className="w-48 mx-auto mb-4 opacity-40" />
        <p className="text-sm text-[#e8dcc8]/40" style={{ fontFamily: "'Crimson Text', serif" }}>
          Dungeons & Dragons 5ª Edição — Nível 3
        </p>
      </footer>
    </div>
  );
}
