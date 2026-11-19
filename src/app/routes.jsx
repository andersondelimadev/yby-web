import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppShell } from '@/shared/layout/AppShell.jsx';
import { RouteSkeleton } from '@/shared/ui/skeletons/RouteSkeleton.jsx';

// Code-splitting com React.lazy para todas as páginas
const LandingPage = lazy(() => import('@/features/landing/LandingPage.jsx').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage.jsx').then(m => ({ default: m.LoginPage })));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage.jsx').then(m => ({ default: m.ForgotPasswordPage })));
const VerifyEmailPage = lazy(() => import('@/features/auth/pages/VerifyEmailPage.jsx').then(m => ({ default: m.VerifyEmailPage })));
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage.jsx').then(m => ({ default: m.ResetPasswordPage })));
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage.jsx').then(m => ({ default: m.DashboardPage })));
const PlanejamentoPage = lazy(() => import('@/features/planejamento/PlanejamentoPage.jsx').then(m => ({ default: m.PlanejamentoPage })));
const RelatoriosPage = lazy(() => import('@/features/relatorios/RelatoriosPage.jsx').then(m => ({ default: m.RelatoriosPage })));
const CadastroPage = lazy(() => import('@/features/cadastro/CadastroPage.jsx').then(m => ({ default: m.CadastroPage })));
const EdicaoPage = lazy(() => import('@/features/edicao/EdicaoPage.jsx').then(m => ({ default: m.EdicaoPage })));
const PontoColetaPage = lazy(() => import('@/features/ponto-coleta/PontoColetaPage.jsx').then(m => ({ default: m.PontoColetaPage })));
const OrganizacoesPage = lazy(() => import('@/features/admin/organizacoes/OrganizacoesPage.jsx').then(m => ({ default: m.OrganizacoesPage })));
const UsuariosPage = lazy(() => import('@/features/admin/usuarios/UsuariosPage.jsx').then(m => ({ default: m.UsuariosPage })));

function SuspenseWrapper({ children }) {
  const location = useLocation();
  return (
    <Suspense fallback={<RouteSkeleton pathname={location.pathname} />}>
      {children}
    </Suspense>
  );
}

export function AppRoutes() {
  return (
    <SuspenseWrapper>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signIn" element={<LoginPage />} />
        <Route path="/signIn-client" element={<Navigate to="/signIn" replace />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Rota Direta da Cooperativa em Campo */}
        <Route
          path="/ponto-coleta"
          element={
            <div className="p-4 bg-yby-cream min-h-screen">
              <PontoColetaPage />
            </div>
          }
        />

        {/* Rotas Internas com AppShell (Sidebar no Desktop + Drawer no Mobile) */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/planejamento" element={<PlanejamentoPage />} />
          <Route path="/relatorios" element={<RelatoriosPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/edicao" element={<EdicaoPage />} />
          <Route path="/admin/organizacoes" element={<OrganizacoesPage />} />
          <Route path="/admin/usuarios" element={<UsuariosPage />} />
          <Route path="/admin" element={<Navigate to="/admin/organizacoes" replace />} />
          <Route path="/organizacoes" element={<Navigate to="/admin/organizacoes" replace />} />
          <Route path="/usuarios" element={<Navigate to="/admin/usuarios" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SuspenseWrapper>
  );
}
