import React from 'react';
import { useNavigate } from 'react-router-dom';
import { YbyIcon } from '@/shared/ui/YbyIcon.jsx';

/**
 * Layout Split-Screen das telas de autenticação e recuperação de senha.
 * @see docs/04-REFORMULACAO-NOVO-DESIGN.md
 */
export function AuthSplitLayout({
  badge = null,
  headline = 'Rastreabilidade e Mensuração de Impacto',
  description = null,
  children,
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-yby-cream">
      {/* Painel Esquerdo: Verde Floresta com grafismos */}
      <div className="w-full md:w-1/2 bg-yby-dark text-white p-8 md:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Formas circulares decorativas de fundo */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />

        {/* Topo / Logo */}
        <div className="relative z-10 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center p-2 shadow-inner border border-white/10">
            <YbyIcon variant="white" className="w-7 h-7" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight">YBY</span>
        </div>

        {/* Mensagem Institucional Central */}
        <div className="relative z-10 my-10 md:my-auto max-w-md">
          {badge && (
            <span className="text-[11px] font-bold uppercase tracking-widest text-yby-light/80 block mb-3">
              {badge}
            </span>
          )}
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] ${
              description ? 'mb-4' : ''
            }`}
          >
            {headline}
          </h2>
          {description && (
            <p className="text-sm md:text-base text-white/80 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Rodapé do painel */}
        <div className="relative z-10 text-xs text-white/60">
          © {new Date().getFullYear()} YBY Soluções Sustentáveis
        </div>
      </div>

      {/* Painel Direito: Fundo Creme com Card Branco Centralizado */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 border border-yby-border shadow-card">
          {children}
        </div>
      </div>
    </div>
  );
}
