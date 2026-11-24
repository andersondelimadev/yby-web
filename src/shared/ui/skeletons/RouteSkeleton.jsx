import React from 'react';
import { DashboardSkeleton } from './DashboardSkeleton.jsx';
import { RelatoriosSkeleton } from './RelatoriosSkeleton.jsx';
import { PlanejamentoSkeleton } from './PlanejamentoSkeleton.jsx';
import { CadastroSkeleton } from './CadastroSkeleton.jsx';
import { EdicaoSkeleton } from './EdicaoSkeleton.jsx';
import { PontoColetaSkeleton } from './PontoColetaSkeleton.jsx';
import { OrganizacoesSkeleton } from './OrganizacoesSkeleton.jsx';
import { UsuariosSkeleton } from './UsuariosSkeleton.jsx';
import { RotinasSkeleton } from './RotinasSkeleton.jsx';

/**
 * Roteador Inteligente de Skeletons.
 * Renderiza dinamicamente o esqueleto estrutural correspondente à rota informada.
 *
 * @param {Object} props
 * @param {string} [props.pathname] - Rota atual da aplicação (ex: '/dashboard')
 */
export function RouteSkeleton({ pathname = window.location.pathname }) {
  if (pathname.includes('/rotinas')) {
    return <RotinasSkeleton />;
  }
  if (pathname.includes('/organizacoes')) {
    return <OrganizacoesSkeleton />;
  }
  if (pathname.includes('/usuarios')) {
    return <UsuariosSkeleton />;
  }
  if (pathname.includes('/relatorios')) {
    return <RelatoriosSkeleton />;
  }
  if (pathname.includes('/planejamento')) {
    return <PlanejamentoSkeleton />;
  }
  if (pathname.includes('/cadastro')) {
    return <CadastroSkeleton />;
  }
  if (pathname.includes('/edicao')) {
    return <EdicaoSkeleton />;
  }
  if (pathname.includes('/ponto-coleta')) {
    return <PontoColetaSkeleton />;
  }
  return <DashboardSkeleton />;
}
