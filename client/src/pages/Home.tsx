/*
 * Design: "Grimório Arcano" — Dark Fantasy
 * Página inicial: cards dos personagens como entradas de um grimório.
 * Fundo escuro com padrão arcano, hero banner, cards com borda dourada.
 * 
 * Autenticação:
 * - Sem login: personagens originais + Regras Rápidas (acessíveis a todos)
 * - Com login: + Criar Personagem + Meus Personagens
 */
import { Link } from "wouter";
import { characters } from "@/data/characters";
import { motion } from "framer-motion";
import { Shield, Flame, Leaf, Skull, Sword, Plus, User, LogIn, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

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
  const { user, loading, isAuthenticated, logout } = useAuth();

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${BG_PATTERN})`,
        backgroundSize: "400px",
        backgroundRepeat: "repeat",
      }}
    >
      {/* Auth Bar - Barra de login/logout no topo */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0e1a]/80 border-b border-[#c9a84c]/20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <span
            className="text-sm gold-text tracking-wider"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Grimório Arcano
          </span>
          <div className="flex items-center gap-3">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#c9a84c]/60" />
            ) : isAuthenticated ? (
              <>
                <span
                  className="text-sm text-[#e8dcc8]/70 hidden sm:inline"
                  style={{ fontFamily: "'Crimson Text', serif" }}
                >
                  Bem-vindo, <span className="text-[#c9a84c]">{user?.name || "Aventureiro"}</span>
                </span>
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#c9a84c]/30 text-[#c9a84c]/80 hover:text-[#c9a84c] hover:border-[#c9a84c]/60 hover:bg-[#c9a84c]/10 transition-all text-xs uppercase tracking-wider"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sair
                </button>
              </>
            ) : (
              <a
                href={getLoginUrl()}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-md border border-[#c9a84c]/40 bg-[#c9a84c]/10 text-[#c9a84c] hover:bg-[#c9a84c]/20 hover:border-[#c9a84c]/70 transition-all text-xs uppercase tracking-wider"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                <LogIn className="w-3.5 h-3.5" />
                Entrar
              </a>
            )}
          </div>
        </div>
      </nav>

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

      {/* Characters Grid - Acessível a todos */}
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

      {/* Character Creator & My Characters - Apenas para logados */}
      {isAuthenticated && (
        <section className="container pb-6 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2
              className="text-center text-xl md:text-2xl font-semibold gold-text mb-6"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Área do Aventureiro
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-5xl mx-auto">
              <Link href="/criar-personagem">
                <div className="group relative overflow-hidden rounded-lg gold-border p-6 text-center transition-all duration-300 hover:gold-glow hover:-translate-y-1"
                  style={{ background: 'linear-gradient(135deg, oklch(0.14 0.018 250) 0%, oklch(0.11 0.02 250) 100%)' }}
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-500 opacity-40 group-hover:opacity-80 transition-opacity" />
                  <Plus className="w-8 h-8 text-[#c9a84c]/60 mx-auto mb-2 group-hover:text-[#c9a84c] transition-colors" />
                  <h3 className="text-lg md:text-xl font-bold gold-text-glow group-hover:text-[#e0c872] transition-colors" style={{ fontFamily: "'Cinzel', serif" }}>
                    Criar Personagem
                  </h3>
                  <p className="mt-1 text-xs text-[#e8dcc8]/50" style={{ fontFamily: "'Crimson Text', serif" }}>
                    Monte sua ficha com as regras de D&D 5e
                  </p>
                </div>
              </Link>
              <Link href="/meus-personagens">
                <div className="group relative overflow-hidden rounded-lg gold-border p-6 text-center transition-all duration-300 hover:gold-glow hover:-translate-y-1"
                  style={{ background: 'linear-gradient(135deg, oklch(0.14 0.018 250) 0%, oklch(0.11 0.02 250) 100%)' }}
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 opacity-40 group-hover:opacity-80 transition-opacity" />
                  <User className="w-8 h-8 text-[#c9a84c]/60 mx-auto mb-2 group-hover:text-[#c9a84c] transition-colors" />
                  <h3 className="text-lg md:text-xl font-bold gold-text-glow group-hover:text-[#e0c872] transition-colors" style={{ fontFamily: "'Cinzel', serif" }}>
                    Meus Personagens
                  </h3>
                  <p className="mt-1 text-xs text-[#e8dcc8]/50" style={{ fontFamily: "'Crimson Text', serif" }}>
                    Veja e gerencie suas fichas salvas
                  </p>
                </div>
              </Link>
            </div>
          </motion.div>
        </section>
      )}

      {/* Call to action para login - Apenas para não logados */}
      {!loading && !isAuthenticated && (
        <section className="container pb-6 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="max-w-5xl mx-auto"
          >
            <div
              className="relative overflow-hidden rounded-lg gold-border p-6 text-center"
              style={{ background: 'linear-gradient(135deg, oklch(0.14 0.018 250) 0%, oklch(0.11 0.02 250) 100%)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c9a84c] opacity-30" />
              <LogIn className="w-8 h-8 text-[#c9a84c]/50 mx-auto mb-3" />
              <h3
                className="text-lg md:text-xl font-bold gold-text mb-2"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Crie seu Próprio Personagem
              </h3>
              <p className="text-sm text-[#e8dcc8]/60 mb-4 max-w-md mx-auto" style={{ fontFamily: "'Crimson Text', serif" }}>
                Faça login para acessar o Criador de Personagens e salvar suas fichas customizadas.
              </p>
              <a
                href={getLoginUrl()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md border border-[#c9a84c]/50 bg-[#c9a84c]/15 text-[#c9a84c] hover:bg-[#c9a84c]/25 hover:border-[#c9a84c]/80 transition-all text-sm uppercase tracking-wider"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                <LogIn className="w-4 h-4" />
                Entrar no Grimório
              </a>
            </div>
          </motion.div>
        </section>
      )}

      {/* Quick Rules Link - Acessível a todos */}
      <section className="container pb-12 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="max-w-5xl mx-auto"
        >
          <Link href="/regras">
            <div className="group relative overflow-hidden rounded-lg gold-border p-6 text-center transition-all duration-300 hover:gold-glow hover:-translate-y-1"
              style={{ background: 'linear-gradient(135deg, oklch(0.14 0.018 250) 0%, oklch(0.11 0.02 250) 100%)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c9a84c] opacity-40 group-hover:opacity-80 transition-opacity" />
              <h3 className="text-xl md:text-2xl font-bold gold-text-glow group-hover:text-[#e0c872] transition-colors" style={{ fontFamily: "'Cinzel', serif" }}>
                Regras Rápidas
              </h3>
              <p className="mt-2 text-sm text-[#e8dcc8]/60" style={{ fontFamily: "'Crimson Text', serif" }}>
                Guia interativo das mecânicas essenciais de D&D 5e — consulte durante o jogo!
              </p>
              <div className="mt-4 pt-3 border-t border-[#c9a84c]/20">
                <span className="text-xs uppercase tracking-widest text-[#c9a84c]/50 group-hover:text-[#c9a84c]/80 transition-colors" style={{ fontFamily: "'Cinzel', serif" }}>
                  Abrir Guia
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
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
