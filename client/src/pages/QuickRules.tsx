/*
 * Design: "Desertor Arcano" — Dark Fantasy
 * Página de Regras Rápidas: guia interativo das mecânicas de D&D 5e
 * para jogadores iniciantes consultarem durante o jogo.
 * Usa Tabs para categorias e Accordions para tópicos dentro de cada categoria.
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Dices, Swords, Sparkles, Heart, Shield, BookOpen, Zap, Target, Users, Clock } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useState } from "react";

const BG_PATTERN = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029969796/5e7QM9V4aGBt6fZvi3YMN7/page-bg-pattern-FkoGmkKLPZJaJsc78xzxmy.webp";
const DIVIDER = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029969796/5e7QM9V4aGBt6fZvi3YMN7/ornamental-divider-6Fe7JypmoDXKRGgmewzWJE.webp";

/* ─── Dice visual helper ─── */
function DiceFormula({ formula, label }: { formula: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-[#c9a84c]/30 rounded-lg px-3 py-1.5">
      <Dices className="w-4 h-4 text-[#c9a84c]" />
      <span className="text-[#e0c872] font-bold text-sm" style={{ fontFamily: "'Cinzel', serif" }}>{formula}</span>
      <span className="text-[#e8dcc8]/60 text-xs">— {label}</span>
    </div>
  );
}

/* ─── Info callout box ─── */
function Callout({ children, icon, title }: { children: React.ReactNode; icon: React.ReactNode; title: string }) {
  return (
    <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/20 rounded-lg p-4 my-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[#c9a84c]">{icon}</span>
        <span className="text-[#e0c872] font-semibold text-sm" style={{ fontFamily: "'Cinzel', serif" }}>{title}</span>
      </div>
      <div className="text-[#e8dcc8]/80 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

/* ─── Attribute mini-card ─── */
function AttrMini({ abbr, name, desc }: { abbr: string; name: string; desc: string }) {
  return (
    <div className="bg-[#0d0d1a] border border-[#c9a84c]/20 rounded-lg p-3 text-center hover:border-[#c9a84c]/50 transition-colors">
      <div className="text-[#c9a84c] font-bold text-lg" style={{ fontFamily: "'Cinzel', serif" }}>{abbr}</div>
      <div className="text-[#e8dcc8]/90 text-sm font-semibold mt-0.5">{name}</div>
      <div className="text-[#e8dcc8]/50 text-xs mt-1 leading-snug">{desc}</div>
    </div>
  );
}

/* ─── Step component for numbered sequences ─── */
function Step({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 mb-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#c9a84c]/20 border border-[#c9a84c]/40 flex items-center justify-center">
        <span className="text-[#c9a84c] font-bold text-sm" style={{ fontFamily: "'Cinzel', serif" }}>{num}</span>
      </div>
      <div className="flex-1">
        <div className="text-[#e0c872] font-semibold text-sm mb-1">{title}</div>
        <div className="text-[#e8dcc8]/70 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

/* ─── Modifier table ─── */
function ModifierTable() {
  const data = [
    { score: "1", mod: "-5" }, { score: "2-3", mod: "-4" }, { score: "4-5", mod: "-3" },
    { score: "6-7", mod: "-2" }, { score: "8-9", mod: "-1" }, { score: "10-11", mod: "+0" },
    { score: "12-13", mod: "+1" }, { score: "14-15", mod: "+2" }, { score: "16-17", mod: "+3" },
    { score: "18-19", mod: "+4" }, { score: "20", mod: "+5" },
  ];
  return (
    <div className="overflow-x-auto my-3">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#c9a84c]/20">
            <th className="text-left py-2 px-3 text-[#c9a84c] font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>Pontuação</th>
            <th className="text-center py-2 px-3 text-[#c9a84c] font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>Modificador</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.score} className="border-b border-[#c9a84c]/5 hover:bg-[#c9a84c]/5 transition-colors">
              <td className="py-1.5 px-3 text-[#e8dcc8]/80">{row.score}</td>
              <td className="py-1.5 px-3 text-center text-[#e0c872] font-bold">{row.mod}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── DC table ─── */
function DCTable() {
  const data = [
    { diff: "Muito Fácil", dc: "5" }, { diff: "Fácil", dc: "10" },
    { diff: "Moderada", dc: "15" }, { diff: "Difícil", dc: "20" },
    { diff: "Muito Difícil", dc: "25" }, { diff: "Quase Impossível", dc: "30" },
  ];
  return (
    <div className="overflow-x-auto my-3">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#c9a84c]/20">
            <th className="text-left py-2 px-3 text-[#c9a84c] font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>Dificuldade</th>
            <th className="text-center py-2 px-3 text-[#c9a84c] font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>CD</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.diff} className="border-b border-[#c9a84c]/5 hover:bg-[#c9a84c]/5 transition-colors">
              <td className="py-1.5 px-3 text-[#e8dcc8]/80">{row.diff}</td>
              <td className="py-1.5 px-3 text-center text-[#e0c872] font-bold">{row.dc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Actions table ─── */
function ActionsTable() {
  const actions = [
    { name: "Atacar", icon: <Swords className="w-4 h-4" />, desc: "Faça um ataque corpo a corpo ou à distância com sua arma." },
    { name: "Conjurar Magia", icon: <Sparkles className="w-4 h-4" />, desc: "Lance um feitiço que tenha tempo de conjuração de 1 ação." },
    { name: "Correr", icon: <Zap className="w-4 h-4" />, desc: "Ganhe movimento extra igual à sua velocidade neste turno." },
    { name: "Esquivar", icon: <Shield className="w-4 h-4" />, desc: "Foque na defesa: ataques contra você têm desvantagem." },
    { name: "Desengajar", icon: <ArrowLeft className="w-4 h-4" />, desc: "Seu movimento não provoca ataques de oportunidade." },
    { name: "Ajudar", icon: <Users className="w-4 h-4" />, desc: "Dê vantagem a um aliado no próximo teste ou ataque dele." },
  ];
  return (
    <div className="space-y-2 my-3">
      {actions.map((a) => (
        <div key={a.name} className="flex items-start gap-3 bg-[#0d0d1a] border border-[#c9a84c]/10 rounded-lg p-3 hover:border-[#c9a84c]/30 transition-colors">
          <span className="text-[#c9a84c] mt-0.5">{a.icon}</span>
          <div>
            <span className="text-[#e0c872] font-semibold text-sm">{a.name}</span>
            <p className="text-[#e8dcc8]/60 text-xs mt-0.5">{a.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Conditions quick ref ─── */
function ConditionsGrid() {
  const conditions = [
    { name: "Amedrontado", desc: "Desvantagem em testes e ataques enquanto vê a fonte do medo." },
    { name: "Atordoado", desc: "Incapacitado, não pode se mover, fala balbuciando." },
    { name: "Caído", desc: "Só pode rastejar. Ataques corpo a corpo contra você têm vantagem." },
    { name: "Cego", desc: "Falha em testes que exijam visão. Ataques contra você têm vantagem." },
    { name: "Envenenado", desc: "Desvantagem em rolagens de ataque e testes de habilidade." },
    { name: "Incapacitado", desc: "Não pode realizar ações ou reações." },
    { name: "Invisível", desc: "Ataques contra você têm desvantagem, seus ataques têm vantagem." },
    { name: "Paralisado", desc: "Incapacitado, ataques a 1,5m são acertos críticos automáticos." },
    { name: "Restringido", desc: "Velocidade 0, ataques contra você têm vantagem." },
    { name: "Surdo", desc: "Falha em testes que exijam audição." },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
      {conditions.map((c) => (
        <div key={c.name} className="bg-[#0d0d1a] border border-[#c9a84c]/10 rounded-lg p-3 hover:border-[#c9a84c]/30 transition-colors">
          <span className="text-[#e0c872] font-semibold text-sm">{c.name}</span>
          <p className="text-[#e8dcc8]/60 text-xs mt-1">{c.desc}</p>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function QuickRules() {
  const [activeTab, setActiveTab] = useState("fundamentos");

  const categories = [
    { id: "fundamentos", label: "Fundamentos", icon: <BookOpen className="w-4 h-4" /> },
    { id: "combate", label: "Combate", icon: <Swords className="w-4 h-4" /> },
    { id: "magia", label: "Magia", icon: <Sparkles className="w-4 h-4" /> },
    { id: "sobrevivencia", label: "Sobrevivência", icon: <Heart className="w-4 h-4" /> },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${BG_PATTERN})`,
        backgroundSize: "400px",
        backgroundRepeat: "repeat",
      }}
    >
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0a1a]/80 border-b border-[#c9a84c]/15">
        <div className="container flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2 text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span style={{ fontFamily: "'Cinzel', serif" }}>Voltar</span>
          </Link>
          <h1 className="text-lg md:text-xl font-bold gold-text-glow" style={{ fontFamily: "'Cinzel', serif" }}>
            Regras Rápidas
          </h1>
          <div className="w-16" />
        </div>
      </nav>

      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container pt-8 pb-4 text-center"
      >
        <img src={DIVIDER} alt="" className="w-48 md:w-64 mx-auto mb-4 opacity-50" />
        <p className="text-[#e8dcc8]/60 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Guia rápido das mecânicas essenciais de Dungeons & Dragons 5ª Edição.
          Consulte durante o jogo sempre que precisar!
        </p>
        <img src={DIVIDER} alt="" className="w-48 md:w-64 mx-auto mt-4 opacity-50 rotate-180" />
      </motion.section>

      {/* Tabs + Content */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="container pb-20"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
          {/* Tab buttons — horizontal scroll on mobile */}
          <TabsList className="w-full flex flex-wrap sm:flex-nowrap gap-1 bg-[#0d0d1a] border border-[#c9a84c]/15 rounded-xl p-1.5 h-auto">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all
                  data-[state=active]:bg-[#c9a84c]/15 data-[state=active]:text-[#e0c872] data-[state=active]:border-[#c9a84c]/30 data-[state=active]:shadow-none
                  text-[#e8dcc8]/50 hover:text-[#e8dcc8]/80 border-transparent"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {cat.icon}
                <span className="hidden sm:inline">{cat.label}</span>
                <span className="sm:hidden">{cat.label.slice(0, 4)}.</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ─── FUNDAMENTOS ─── */}
          <TabsContent value="fundamentos" className="mt-6">
            <div className="section-card">
              <Accordion type="multiple" defaultValue={["d20", "atributos"]} className="space-y-0">

                {/* O Dado d20 */}
                <AccordionItem value="d20" className="border-b border-[#c9a84c]/10">
                  <AccordionTrigger className="text-[#e0c872] text-base font-semibold hover:no-underline py-5" style={{ fontFamily: "'Cinzel', serif" }}>
                    <span className="flex items-center gap-2"><Dices className="w-5 h-5 text-[#c9a84c]" /> O Dado d20 — A Base de Tudo</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#e8dcc8]/70 text-sm leading-relaxed px-1">
                    <p className="mb-3">
                      Sempre que seu personagem tenta algo cujo resultado é incerto — atacar um inimigo, escalar um muro, convencer um guarda — você rola um <strong className="text-[#e0c872]">dado de 20 faces (d20)</strong>.
                    </p>
                    <Callout icon={<Target className="w-4 h-4" />} title="Como funciona">
                      <strong className="text-[#e0c872]">d20 + Modificador</strong> ≥ <strong className="text-[#e0c872]">Número Alvo</strong> = Sucesso!
                      <br />O número alvo pode ser a <strong>Classe de Dificuldade (CD)</strong> de um teste ou a <strong>Classe de Armadura (CA)</strong> de um inimigo.
                    </Callout>
                    <DCTable />
                    <Callout icon={<Dices className="w-4 h-4" />} title="Resultado Natural 20 ou 1">
                      Se você tirar <strong className="text-[#e0c872]">20 no d20</strong> (sem somar nada), é um <strong>acerto crítico</strong> em ataques — sempre acerta e causa dano dobrado!
                      Se tirar <strong className="text-[#e0c872]">1 no d20</strong>, é uma <strong>falha crítica</strong> em ataques — sempre erra, independente dos bônus.
                    </Callout>
                  </AccordionContent>
                </AccordionItem>

                {/* Atributos */}
                <AccordionItem value="atributos" className="border-b border-[#c9a84c]/10">
                  <AccordionTrigger className="text-[#e0c872] text-base font-semibold hover:no-underline py-5" style={{ fontFamily: "'Cinzel', serif" }}>
                    <span className="flex items-center gap-2"><Shield className="w-5 h-5 text-[#c9a84c]" /> Os 6 Atributos</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#e8dcc8]/70 text-sm leading-relaxed px-1">
                    <p className="mb-3">
                      Todo personagem possui 6 atributos que definem suas capacidades. Cada atributo tem uma <strong className="text-[#e0c872]">pontuação</strong> (ex: 16) e um <strong className="text-[#e0c872]">modificador</strong> (ex: +3), que é o número que você realmente soma nas rolagens.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                      <AttrMini abbr="FOR" name="Força" desc="Poder físico, ataques corpo a corpo" />
                      <AttrMini abbr="DES" name="Destreza" desc="Agilidade, reflexos, ataques à distância" />
                      <AttrMini abbr="CON" name="Constituição" desc="Saúde, vigor, pontos de vida" />
                      <AttrMini abbr="INT" name="Inteligência" desc="Memória, raciocínio, conhecimento" />
                      <AttrMini abbr="SAB" name="Sabedoria" desc="Intuição, percepção, bom senso" />
                      <AttrMini abbr="CAR" name="Carisma" desc="Personalidade, persuasão, liderança" />
                    </div>
                    <Callout icon={<BookOpen className="w-4 h-4" />} title="Tabela de Modificadores">
                      O modificador é calculado assim: <strong className="text-[#e0c872]">(Pontuação - 10) ÷ 2</strong>, arredondando para baixo.
                    </Callout>
                    <ModifierTable />
                  </AccordionContent>
                </AccordionItem>

                {/* Testes de Habilidade */}
                <AccordionItem value="testes" className="border-b border-[#c9a84c]/10">
                  <AccordionTrigger className="text-[#e0c872] text-base font-semibold hover:no-underline py-5" style={{ fontFamily: "'Cinzel', serif" }}>
                    <span className="flex items-center gap-2"><Target className="w-5 h-5 text-[#c9a84c]" /> Testes de Habilidade e Perícias</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#e8dcc8]/70 text-sm leading-relaxed px-1">
                    <p className="mb-3">
                      Quando o Mestre pede um teste, ele dirá qual atributo ou perícia usar. Você rola o d20 e soma o modificador correspondente.
                    </p>
                    <Callout icon={<Target className="w-4 h-4" />} title="Fórmula do Teste">
                      <DiceFormula formula="d20 + Modificador do Atributo" label="teste básico" />
                      <br /><br />
                      Se você for <strong className="text-[#e0c872]">proficiente</strong> na perícia pedida, some também o <strong className="text-[#e0c872]">Bônus de Proficiência (+2 no nível 3)</strong>.
                    </Callout>
                    <p className="mt-3">
                      <strong className="text-[#e0c872]">Exemplo:</strong> O Mestre pede um teste de Furtividade (Destreza). Seu modificador de Destreza é +3 e você é proficiente em Furtividade. Você rola d20 + 3 + 2 = d20 + 5.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                {/* Vantagem e Desvantagem */}
                <AccordionItem value="vantagem" className="border-b-0">
                  <AccordionTrigger className="text-[#e0c872] text-base font-semibold hover:no-underline py-5" style={{ fontFamily: "'Cinzel', serif" }}>
                    <span className="flex items-center gap-2"><Dices className="w-5 h-5 text-[#c9a84c]" /> Vantagem e Desvantagem</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#e8dcc8]/70 text-sm leading-relaxed px-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div className="bg-[#1a3a1a] border border-green-800/40 rounded-lg p-4">
                        <div className="text-green-400 font-semibold text-sm mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Vantagem</div>
                        <p className="text-[#e8dcc8]/70 text-xs">Role <strong className="text-green-300">2d20</strong> e use o <strong className="text-green-300">maior</strong> resultado. Situações favoráveis como atacar um inimigo surpreso.</p>
                      </div>
                      <div className="bg-[#3a1a1a] border border-red-800/40 rounded-lg p-4">
                        <div className="text-red-400 font-semibold text-sm mb-1" style={{ fontFamily: "'Cinzel', serif" }}>Desvantagem</div>
                        <p className="text-[#e8dcc8]/70 text-xs">Role <strong className="text-red-300">2d20</strong> e use o <strong className="text-red-300">menor</strong> resultado. Situações adversas como atacar sem enxergar.</p>
                      </div>
                    </div>
                    <Callout icon={<BookOpen className="w-4 h-4" />} title="Regra Importante">
                      Se você tiver vantagem E desvantagem ao mesmo tempo, elas se cancelam — role apenas 1d20 normalmente. Múltiplas vantagens não se acumulam.
                    </Callout>
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </div>
          </TabsContent>

          {/* ─── COMBATE ─── */}
          <TabsContent value="combate" className="mt-6">
            <div className="section-card">
              <Accordion type="multiple" defaultValue={["turno"]} className="space-y-0">

                {/* Ordem de Combate */}
                <AccordionItem value="iniciativa" className="border-b border-[#c9a84c]/10">
                  <AccordionTrigger className="text-[#e0c872] text-base font-semibold hover:no-underline py-5" style={{ fontFamily: "'Cinzel', serif" }}>
                    <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-[#c9a84c]" /> Início do Combate — Iniciativa</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#e8dcc8]/70 text-sm leading-relaxed px-1">
                    <p className="mb-3">Quando o combate começa, todos rolam <strong className="text-[#e0c872]">Iniciativa</strong> para decidir a ordem dos turnos.</p>
                    <DiceFormula formula="d20 + Modificador de Destreza" label="iniciativa" />
                    <p className="mt-3">Quem tirar o maior valor age primeiro. A ordem se repete a cada rodada até o combate acabar.</p>
                    <Callout icon={<Zap className="w-4 h-4" />} title="Surpresa">
                      Se um lado surpreendeu o outro (ex: emboscada), as criaturas surpresas não podem agir nem reagir no primeiro turno.
                    </Callout>
                  </AccordionContent>
                </AccordionItem>

                {/* O Turno */}
                <AccordionItem value="turno" className="border-b border-[#c9a84c]/10">
                  <AccordionTrigger className="text-[#e0c872] text-base font-semibold hover:no-underline py-5" style={{ fontFamily: "'Cinzel', serif" }}>
                    <span className="flex items-center gap-2"><Swords className="w-5 h-5 text-[#c9a84c]" /> Seu Turno — O Que Você Pode Fazer</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#e8dcc8]/70 text-sm leading-relaxed px-1">
                    <p className="mb-3">No seu turno (cerca de 6 segundos no jogo), você pode fazer:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                      <div className="bg-[#0d0d1a] border border-[#c9a84c]/20 rounded-lg p-3 text-center">
                        <div className="text-[#c9a84c] font-bold text-sm" style={{ fontFamily: "'Cinzel', serif" }}>Mover-se</div>
                        <p className="text-[#e8dcc8]/50 text-xs mt-1">Até sua velocidade (geralmente 9m)</p>
                      </div>
                      <div className="bg-[#0d0d1a] border border-[#c9a84c]/20 rounded-lg p-3 text-center">
                        <div className="text-[#c9a84c] font-bold text-sm" style={{ fontFamily: "'Cinzel', serif" }}>1 Ação</div>
                        <p className="text-[#e8dcc8]/50 text-xs mt-1">Atacar, conjurar, esquivar, etc.</p>
                      </div>
                      <div className="bg-[#0d0d1a] border border-[#c9a84c]/20 rounded-lg p-3 text-center">
                        <div className="text-[#c9a84c] font-bold text-sm" style={{ fontFamily: "'Cinzel', serif" }}>1 Ação Bônus</div>
                        <p className="text-[#e8dcc8]/50 text-xs mt-1">Se tiver habilidade que permita</p>
                      </div>
                    </div>
                    <p className="text-[#e0c872] font-semibold text-sm mb-2" style={{ fontFamily: "'Cinzel', serif" }}>Ações Disponíveis:</p>
                    <ActionsTable />
                    <Callout icon={<Zap className="w-4 h-4" />} title="Reação">
                      Fora do seu turno, você pode usar <strong className="text-[#e0c872]">1 Reação</strong> por rodada. O exemplo mais comum é o <strong>Ataque de Oportunidade</strong>: quando um inimigo sai do seu alcance, você pode atacá-lo.
                    </Callout>
                  </AccordionContent>
                </AccordionItem>

                {/* Como Atacar */}
                <AccordionItem value="atacar" className="border-b border-[#c9a84c]/10">
                  <AccordionTrigger className="text-[#e0c872] text-base font-semibold hover:no-underline py-5" style={{ fontFamily: "'Cinzel', serif" }}>
                    <span className="flex items-center gap-2"><Target className="w-5 h-5 text-[#c9a84c]" /> Como Atacar — Passo a Passo</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#e8dcc8]/70 text-sm leading-relaxed px-1">
                    <Step num={1} title="Role o d20 para acertar">
                      <DiceFormula formula="d20 + Mod. Atributo + Proficiência" label="rolagem de ataque" />
                      <p className="mt-1">Use <strong className="text-[#e0c872]">Força</strong> para armas corpo a corpo ou <strong className="text-[#e0c872]">Destreza</strong> para armas à distância.</p>
                    </Step>
                    <Step num={2} title="Compare com a CA do alvo">
                      Se o resultado for <strong className="text-[#e0c872]">≥ Classe de Armadura (CA)</strong> do inimigo, você acertou!
                    </Step>
                    <Step num={3} title="Role o dano">
                      <DiceFormula formula="Dado da Arma + Mod. Atributo" label="dano" />
                      <p className="mt-1">O dado depende da arma (ex: espada longa = 1d8, machado grande = 1d12).</p>
                    </Step>
                    <Callout icon={<Swords className="w-4 h-4" />} title="Acerto Crítico (Nat 20)">
                      Se tirar 20 no d20, role os <strong className="text-[#e0c872]">dados de dano duas vezes</strong> e some tudo! Ex: espada longa normalmente causa 1d8+3. No crítico: 2d8+3.
                    </Callout>
                  </AccordionContent>
                </AccordionItem>

                {/* Pontos de Vida e Morte */}
                <AccordionItem value="vida" className="border-b border-[#c9a84c]/10">
                  <AccordionTrigger className="text-[#e0c872] text-base font-semibold hover:no-underline py-5" style={{ fontFamily: "'Cinzel', serif" }}>
                    <span className="flex items-center gap-2"><Heart className="w-5 h-5 text-[#c9a84c]" /> Pontos de Vida e Morte</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#e8dcc8]/70 text-sm leading-relaxed px-1">
                    <p className="mb-3">
                      Seus <strong className="text-[#e0c872]">Pontos de Vida (PV)</strong> representam sua resistência. Quando chegam a <strong className="text-red-400">0</strong>, você cai inconsciente e começa a fazer <strong className="text-[#e0c872]">Testes de Resistência contra a Morte</strong>.
                    </p>
                    <Step num={1} title="Você cai a 0 PV">
                      Você fica inconsciente e cai no chão. Não pode agir.
                    </Step>
                    <Step num={2} title="No início de cada turno, role d20">
                      <strong className="text-green-400">10 ou mais</strong> = 1 sucesso. <strong className="text-red-400">9 ou menos</strong> = 1 falha.
                    </Step>
                    <Step num={3} title="Acumule resultados">
                      <strong className="text-green-400">3 sucessos</strong> = você estabiliza (fica com 0 PV mas para de morrer).
                      <br /><strong className="text-red-400">3 falhas</strong> = seu personagem morre.
                    </Step>
                    <Callout icon={<Heart className="w-4 h-4" />} title="Salvação">
                      Um aliado pode estabilizá-lo com um teste de Medicina (CD 10) ou qualquer magia de cura. Receber cura faz você voltar à consciência!
                    </Callout>
                  </AccordionContent>
                </AccordionItem>

                {/* Condições */}
                <AccordionItem value="condicoes" className="border-b-0">
                  <AccordionTrigger className="text-[#e0c872] text-base font-semibold hover:no-underline py-5" style={{ fontFamily: "'Cinzel', serif" }}>
                    <span className="flex items-center gap-2"><Zap className="w-5 h-5 text-[#c9a84c]" /> Condições Comuns</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#e8dcc8]/70 text-sm leading-relaxed px-1">
                    <p className="mb-2">Efeitos que podem afetar seu personagem durante o combate:</p>
                    <ConditionsGrid />
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </div>
          </TabsContent>

          {/* ─── MAGIA ─── */}
          <TabsContent value="magia" className="mt-6">
            <div className="section-card">
              <Accordion type="multiple" defaultValue={["truques"]} className="space-y-0">

                {/* Truques vs Magias */}
                <AccordionItem value="truques" className="border-b border-[#c9a84c]/10">
                  <AccordionTrigger className="text-[#e0c872] text-base font-semibold hover:no-underline py-5" style={{ fontFamily: "'Cinzel', serif" }}>
                    <span className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#c9a84c]" /> Truques vs. Magias com Espaço</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#e8dcc8]/70 text-sm leading-relaxed px-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div className="bg-[#1a2a3a] border border-blue-800/40 rounded-lg p-4">
                        <div className="text-blue-300 font-semibold text-sm mb-2" style={{ fontFamily: "'Cinzel', serif" }}>Truques (Cantrips)</div>
                        <ul className="text-[#e8dcc8]/70 text-xs space-y-1">
                          <li>Magias de nível 0</li>
                          <li>Podem ser usados <strong className="text-blue-300">infinitamente</strong></li>
                          <li>Não gastam espaços de magia</li>
                          <li>Ficam mais fortes conforme você sobe de nível</li>
                        </ul>
                      </div>
                      <div className="bg-[#2a1a3a] border border-purple-800/40 rounded-lg p-4">
                        <div className="text-purple-300 font-semibold text-sm mb-2" style={{ fontFamily: "'Cinzel', serif" }}>Magias (Nível 1+)</div>
                        <ul className="text-[#e8dcc8]/70 text-xs space-y-1">
                          <li>Magias de nível 1 a 9</li>
                          <li>Gastam <strong className="text-purple-300">Espaços de Magia</strong></li>
                          <li>Espaços se recuperam com descanso longo</li>
                          <li>Podem ser lançadas em espaço maior para efeito ampliado</li>
                        </ul>
                      </div>
                    </div>
                    <Callout icon={<Sparkles className="w-4 h-4" />} title="Exemplo Prático">
                      A Ash (Paladina nível 3) tem <strong className="text-[#e0c872]">3 espaços de nível 1</strong> e <strong className="text-[#e0c872]">2 de nível 2</strong>. Ela pode usar um espaço de nível 2 para lançar uma magia de nível 1 com efeito mais forte (como Curar Feridas curando mais PV).
                    </Callout>
                  </AccordionContent>
                </AccordionItem>

                {/* Como Conjurar */}
                <AccordionItem value="conjurar" className="border-b border-[#c9a84c]/10">
                  <AccordionTrigger className="text-[#e0c872] text-base font-semibold hover:no-underline py-5" style={{ fontFamily: "'Cinzel', serif" }}>
                    <span className="flex items-center gap-2"><Zap className="w-5 h-5 text-[#c9a84c]" /> Como Conjurar uma Magia</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#e8dcc8]/70 text-sm leading-relaxed px-1">
                    <Step num={1} title="Escolha a magia e o espaço">
                      Verifique se você tem a magia preparada e um espaço de magia disponível do nível necessário.
                    </Step>
                    <Step num={2} title="Verifique os componentes">
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="bg-[#0d0d1a] border border-[#c9a84c]/20 rounded px-2 py-1 text-xs"><strong className="text-[#e0c872]">V</strong> = Verbal (falar)</span>
                        <span className="bg-[#0d0d1a] border border-[#c9a84c]/20 rounded px-2 py-1 text-xs"><strong className="text-[#e0c872]">S</strong> = Somático (gestos)</span>
                        <span className="bg-[#0d0d1a] border border-[#c9a84c]/20 rounded px-2 py-1 text-xs"><strong className="text-[#e0c872]">M</strong> = Material (objetos)</span>
                      </div>
                    </Step>
                    <Step num={3} title="Resolva o efeito">
                      Algumas magias pedem uma <strong className="text-[#e0c872]">rolagem de ataque mágico</strong> (d20 + mod. de conjuração + proficiência). Outras pedem que o alvo faça um <strong className="text-[#e0c872]">teste de resistência</strong> contra sua CD de magia.
                    </Step>
                    <Callout icon={<Target className="w-4 h-4" />} title="CD de Magia">
                      <DiceFormula formula="8 + Proficiência + Mod. Conjuração" label="CD de magia" />
                      <p className="mt-1">O atributo de conjuração depende da classe: Carisma (Paladina, Bruxa, Feiticeira), Sabedoria (Druida).</p>
                    </Callout>
                  </AccordionContent>
                </AccordionItem>

                {/* Concentração */}
                <AccordionItem value="concentracao" className="border-b border-[#c9a84c]/10">
                  <AccordionTrigger className="text-[#e0c872] text-base font-semibold hover:no-underline py-5" style={{ fontFamily: "'Cinzel', serif" }}>
                    <span className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-[#c9a84c]" /> Concentração</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#e8dcc8]/70 text-sm leading-relaxed px-1">
                    <p className="mb-3">
                      Algumas magias exigem <strong className="text-[#e0c872]">Concentração</strong> para manter seus efeitos ativos. Isso significa que você precisa "manter o foco" na magia.
                    </p>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">✕</span>
                        <span className="text-xs">Você só pode se concentrar em <strong className="text-[#e0c872]">uma magia por vez</strong>.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">✕</span>
                        <span className="text-xs">Se conjurar outra magia de concentração, a anterior termina.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-0.5">!</span>
                        <span className="text-xs">Se levar dano, faça um <strong className="text-[#e0c872]">teste de Constituição (CD 10 ou metade do dano, o que for maior)</strong>. Se falhar, a magia acaba.</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Smite Divino (específico para a mesa) */}
                <AccordionItem value="smite" className="border-b-0">
                  <AccordionTrigger className="text-[#e0c872] text-base font-semibold hover:no-underline py-5" style={{ fontFamily: "'Cinzel', serif" }}>
                    <span className="flex items-center gap-2"><Swords className="w-5 h-5 text-[#c9a84c]" /> Magias Especiais da Nossa Mesa</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#e8dcc8]/70 text-sm leading-relaxed px-1">
                    <div className="space-y-3">
                      <div className="bg-[#1a1a0d] border border-yellow-800/30 rounded-lg p-3">
                        <div className="text-yellow-300 font-semibold text-sm" style={{ fontFamily: "'Cinzel', serif" }}>Smite Divino (Ash — Paladina)</div>
                        <p className="text-xs text-[#e8dcc8]/60 mt-1">Ao acertar um ataque corpo a corpo, gaste um espaço de magia para causar <strong className="text-yellow-300">2d8 de dano radiante extra</strong> (+1d8 por nível do espaço acima do 1º). Contra mortos-vivos: +1d8 adicional.</p>
                      </div>
                      <div className="bg-[#0d1a0d] border border-green-800/30 rounded-lg p-3">
                        <div className="text-green-300 font-semibold text-sm" style={{ fontFamily: "'Cinzel', serif" }}>Forma Selvagem (Yara — Druida)</div>
                        <p className="text-xs text-[#e8dcc8]/60 mt-1">Use uma ação para se transformar em um animal que já viu (lobo, urso, etc.). Você ganha os PV do animal. Pode usar <strong className="text-green-300">2 vezes por descanso curto</strong>.</p>
                      </div>
                      <div className="bg-[#1a0d1a] border border-purple-800/30 rounded-lg p-3">
                        <div className="text-purple-300 font-semibold text-sm" style={{ fontFamily: "'Cinzel', serif" }}>Pacto da Bruxa (Sabrina — Bruxa)</div>
                        <p className="text-xs text-[#e8dcc8]/60 mt-1">Espaços de magia se recuperam com <strong className="text-purple-300">descanso curto</strong> (não precisa esperar o longo!). Poucos espaços, mas sempre de nível máximo.</p>
                      </div>
                      <div className="bg-[#1a0d0d] border border-red-800/30 rounded-lg p-3">
                        <div className="text-red-300 font-semibold text-sm" style={{ fontFamily: "'Cinzel', serif" }}>Metamagia (Thihashian — Feiticeira)</div>
                        <p className="text-xs text-[#e8dcc8]/60 mt-1">Gaste <strong className="text-red-300">Pontos de Feitiçaria</strong> para alterar suas magias: conjurar sem componentes verbais, dobrar o alcance, ou lançar como ação bônus.</p>
                      </div>
                      <div className="bg-[#1a1510] border border-orange-800/30 rounded-lg p-3">
                        <div className="text-orange-300 font-semibold text-sm" style={{ fontFamily: "'Cinzel', serif" }}>Fúria (Krom — Bárbaro)</div>
                        <p className="text-xs text-[#e8dcc8]/60 mt-1">Use ação bônus para entrar em Fúria: <strong className="text-orange-300">+2 dano corpo a corpo</strong>, resistência a dano contundente/perfurante/cortante. Dura 1 minuto. <strong className="text-orange-300">3 usos por descanso longo</strong>.</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </div>
          </TabsContent>

          {/* ─── SOBREVIVÊNCIA ─── */}
          <TabsContent value="sobrevivencia" className="mt-6">
            <div className="section-card">
              <Accordion type="multiple" defaultValue={["descanso"]} className="space-y-0">

                {/* Descanso */}
                <AccordionItem value="descanso" className="border-b border-[#c9a84c]/10">
                  <AccordionTrigger className="text-[#e0c872] text-base font-semibold hover:no-underline py-5" style={{ fontFamily: "'Cinzel', serif" }}>
                    <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-[#c9a84c]" /> Descanso Curto vs. Descanso Longo</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#e8dcc8]/70 text-sm leading-relaxed px-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div className="bg-[#1a2a1a] border border-green-800/30 rounded-lg p-4">
                        <div className="text-green-400 font-semibold text-sm mb-2" style={{ fontFamily: "'Cinzel', serif" }}>Descanso Curto</div>
                        <div className="text-[#e8dcc8]/50 text-xs mb-2">Duração: 1 hora</div>
                        <ul className="text-[#e8dcc8]/70 text-xs space-y-1">
                          <li>Gaste <strong className="text-green-300">Dados de Vida</strong> para recuperar PV</li>
                          <li>Recupera habilidades marcadas "por descanso curto"</li>
                          <li>Bruxa recupera espaços de magia</li>
                          <li>Druida recupera Forma Selvagem</li>
                        </ul>
                      </div>
                      <div className="bg-[#1a1a2a] border border-blue-800/30 rounded-lg p-4">
                        <div className="text-blue-400 font-semibold text-sm mb-2" style={{ fontFamily: "'Cinzel', serif" }}>Descanso Longo</div>
                        <div className="text-[#e8dcc8]/50 text-xs mb-2">Duração: 8 horas</div>
                        <ul className="text-[#e8dcc8]/70 text-xs space-y-1">
                          <li>Recupera <strong className="text-blue-300">todos os PV</strong></li>
                          <li>Recupera <strong className="text-blue-300">todos os espaços de magia</strong></li>
                          <li>Recupera metade dos Dados de Vida gastos</li>
                          <li>Recupera Fúria, Pontos de Feitiçaria, etc.</li>
                        </ul>
                      </div>
                    </div>
                    <Callout icon={<Clock className="w-4 h-4" />} title="Dados de Vida">
                      Cada personagem tem Dados de Vida baseados na classe (ex: Bárbaro = d12, Paladina = d10). No descanso curto, role o dado e some seu mod. de Constituição para recuperar PV.
                    </Callout>
                  </AccordionContent>
                </AccordionItem>

                {/* Armadura e Defesa */}
                <AccordionItem value="armadura" className="border-b border-[#c9a84c]/10">
                  <AccordionTrigger className="text-[#e0c872] text-base font-semibold hover:no-underline py-5" style={{ fontFamily: "'Cinzel', serif" }}>
                    <span className="flex items-center gap-2"><Shield className="w-5 h-5 text-[#c9a84c]" /> Classe de Armadura (CA)</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#e8dcc8]/70 text-sm leading-relaxed px-1">
                    <p className="mb-3">
                      A <strong className="text-[#e0c872]">Classe de Armadura (CA)</strong> representa o quão difícil é acertar você. Quanto maior, melhor!
                    </p>
                    <div className="space-y-2 mb-3">
                      <div className="bg-[#0d0d1a] border border-[#c9a84c]/10 rounded-lg p-3">
                        <span className="text-[#e0c872] font-semibold text-sm">Armadura Leve</span>
                        <p className="text-xs text-[#e8dcc8]/60 mt-1">CA = Base da armadura + <strong>todo</strong> o mod. de Destreza</p>
                      </div>
                      <div className="bg-[#0d0d1a] border border-[#c9a84c]/10 rounded-lg p-3">
                        <span className="text-[#e0c872] font-semibold text-sm">Armadura Média</span>
                        <p className="text-xs text-[#e8dcc8]/60 mt-1">CA = Base da armadura + mod. de Destreza (<strong>máximo +2</strong>)</p>
                      </div>
                      <div className="bg-[#0d0d1a] border border-[#c9a84c]/10 rounded-lg p-3">
                        <span className="text-[#e0c872] font-semibold text-sm">Armadura Pesada</span>
                        <p className="text-xs text-[#e8dcc8]/60 mt-1">CA = Base da armadura (<strong>sem</strong> mod. de Destreza)</p>
                      </div>
                      <div className="bg-[#0d0d1a] border border-[#c9a84c]/10 rounded-lg p-3">
                        <span className="text-[#e0c872] font-semibold text-sm">Sem Armadura</span>
                        <p className="text-xs text-[#e8dcc8]/60 mt-1">CA = 10 + mod. de Destreza (Bárbaros: + mod. de Constituição também!)</p>
                      </div>
                    </div>
                    <Callout icon={<Shield className="w-4 h-4" />} title="Escudo">
                      Usar um escudo dá <strong className="text-[#e0c872]">+2 na CA</strong>, mas ocupa uma mão. Você precisa de proficiência com escudos para usá-lo.
                    </Callout>
                  </AccordionContent>
                </AccordionItem>

                {/* Dicas para Iniciantes */}
                <AccordionItem value="dicas" className="border-b-0">
                  <AccordionTrigger className="text-[#e0c872] text-base font-semibold hover:no-underline py-5" style={{ fontFamily: "'Cinzel', serif" }}>
                    <span className="flex items-center gap-2"><Users className="w-5 h-5 text-[#c9a84c]" /> Dicas para Iniciantes</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#e8dcc8]/70 text-sm leading-relaxed px-1">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="text-[#c9a84c] text-lg mt-0.5">1.</span>
                        <div>
                          <span className="text-[#e0c872] font-semibold text-sm">Não precisa decorar tudo</span>
                          <p className="text-xs text-[#e8dcc8]/60 mt-0.5">O Mestre vai guiar vocês. Quando tiver dúvida, pergunte! Consulte esta página ou sua ficha.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-[#c9a84c] text-lg mt-0.5">2.</span>
                        <div>
                          <span className="text-[#e0c872] font-semibold text-sm">Descreva o que quer fazer</span>
                          <p className="text-xs text-[#e8dcc8]/60 mt-0.5">Diga "quero tentar escalar o muro" em vez de "faço um teste de Atletismo". O Mestre dirá o que rolar.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-[#c9a84c] text-lg mt-0.5">3.</span>
                        <div>
                          <span className="text-[#e0c872] font-semibold text-sm">Trabalhe em equipe</span>
                          <p className="text-xs text-[#e8dcc8]/60 mt-0.5">Cada personagem tem pontos fortes diferentes. Combinem habilidades! A Ash pode proteger enquanto Thihashian ataca de longe.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-[#c9a84c] text-lg mt-0.5">4.</span>
                        <div>
                          <span className="text-[#e0c872] font-semibold text-sm">Interprete seu personagem</span>
                          <p className="text-xs text-[#e8dcc8]/60 mt-0.5">Não precisa fazer vozes (a menos que queira!). Pense em como seu personagem reagiria à situação.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-[#c9a84c] text-lg mt-0.5">5.</span>
                        <div>
                          <span className="text-[#e0c872] font-semibold text-sm">Divirta-se!</span>
                          <p className="text-xs text-[#e8dcc8]/60 mt-0.5">O objetivo é contar uma história juntos. Não existe "jogar errado" — o importante é se divertir.</p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </div>
          </TabsContent>
        </Tabs>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-[#c9a84c]/10 py-8 text-center">
        <img src={DIVIDER} alt="" className="w-48 mx-auto mb-4 opacity-40" />
        <p className="text-sm text-[#e8dcc8]/40">
          Dungeons & Dragons 5ª Edição — Guia Rápido para Iniciantes
        </p>
      </footer>
    </div>
  );
}
