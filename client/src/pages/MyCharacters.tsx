/**
 * Meus Personagens — Lista de fichas customizadas do usuário logado
 * Estilo "Desertor Arcano"
 */
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Sparkles, User } from "lucide-react";
import { toast } from "sonner";

const BG_PATTERN = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029969796/5e7QM9V4aGBt6fZvi3YMN7/page-bg-pattern-FkoGmkKLPZJaJsc78xzxmy.webp";
const DIVIDER = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029969796/5e7QM9V4aGBt6fZvi3YMN7/ornamental-divider-6Fe7JypmoDXKRGgmewzWJE.webp";

export default function MyCharacters() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { data: characters, isLoading, refetch } = trpc.character.myList.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const deleteChar = trpc.character.delete.useMutation({
    onSuccess: () => {
      toast.success("Personagem excluído");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  if (authLoading || isLoading) {
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
          <p className="text-[#e8dcc8]/70 mb-6">Faça login para ver seus personagens.</p>
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
            Meus Personagens
          </h1>
          <Link href="/criar-personagem" className="flex items-center gap-1 text-[#c9a84c] hover:text-[#e0c872] transition-colors">
            <Plus className="w-4 h-4" />
            <span className="text-sm hidden sm:inline" style={{ fontFamily: "'Cinzel', serif" }}>Novo</span>
          </Link>
        </div>
      </nav>

      <img src={DIVIDER} alt="" className="w-48 mx-auto opacity-40 my-6" />

      <div className="container pb-20">
        {!characters || characters.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-card gold-border p-8 text-center max-w-md mx-auto"
          >
            <User className="w-12 h-12 text-[#c9a84c]/40 mx-auto mb-4" />
            <h3 className="text-xl font-bold gold-text mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
              Nenhum personagem criado
            </h3>
            <p className="text-sm text-[#e8dcc8]/60 mb-6">
              Crie seu primeiro personagem e ele aparecerá aqui!
            </p>
            <Link
              href="/criar-personagem"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#c9a84c] text-[oklch(0.12_0.015_250)] font-bold hover:bg-[#e0c872] transition-colors"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              <Plus className="w-5 h-5" /> Criar Personagem
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {characters.map((char, index) => (
              <motion.div
                key={char.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/ficha-custom/${char.id}`}>
                  <div className="group relative overflow-hidden rounded-lg gold-border p-6 transition-all duration-300 hover:gold-glow hover:-translate-y-1"
                    style={{ background: 'linear-gradient(135deg, oklch(0.14 0.018 250) 0%, oklch(0.11 0.02 250) 100%)' }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-0.5 opacity-80 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: (char.accentColor as string) || "#c9a84c" }} />

                    {char.artUrl && (
                      <div className="w-full h-48 mb-4 overflow-hidden rounded-md">
                        <img src={char.artUrl as string} alt={char.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="text-2xl font-bold gold-text-glow group-hover:text-[#e0c872] transition-colors" style={{ fontFamily: "'Cinzel', serif" }}>
                        {char.name}
                      </h3>
                      {char.title && (
                        <p className="text-sm text-[#e8dcc8]/60 italic mt-0.5" style={{ fontFamily: "'Crimson Text', serif" }}>
                          {char.title}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 space-y-1.5 text-sm" style={{ fontFamily: "'Crimson Text', serif" }}>
                      <div className="flex justify-between text-[#e8dcc8]/70">
                        <span>Raça</span>
                        <span className="text-[#e8dcc8]/90 font-semibold">{char.race}</span>
                      </div>
                      <div className="flex justify-between text-[#e8dcc8]/70">
                        <span>Classe</span>
                        <span className="text-[#e8dcc8]/90 font-semibold">{char.className}</span>
                      </div>
                      <div className="flex justify-between text-[#e8dcc8]/70">
                        <span>Nível</span>
                        <span className="text-[#e8dcc8]/90 font-semibold">{char.level}</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#c9a84c]/20 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-widest text-[#c9a84c]/50 group-hover:text-[#c9a84c]/80 transition-colors" style={{ fontFamily: "'Cinzel', serif" }}>
                        Ver Ficha
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (confirm("Tem certeza que deseja excluir este personagem?")) {
                            deleteChar.mutate({ id: char.id });
                          }
                        }}
                        className="p-1.5 rounded-md text-red-400/50 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
