import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import {
  UserPlus,
  Calendar,
  Folder,
  BarChart2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
  Building2,
  Users,
  CalendarClock,
} from 'lucide-react';
import { AccountSettingsModal } from './AccountSettingsModal.jsx';
import { YbyIcon } from '@/shared/ui/YbyIcon.jsx';

/**
 * Menu lateral retrátil e expansível do YBY.
 * Possui submenu em Cadastro (Cliente, Cooperativa, Usuário) sempre aberto
 * e área de perfil com foto, nome, login e configurações no rodapé.
 */
export function Sidebar({ collapsed, onToggleCollapse, onItemClick, className = '' }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Estado do modal de configurações da conta
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Dados do usuário logado (armazenados localmente)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('usuario_perfil');
      if (stored) return JSON.parse(stored);
      const auth = localStorage.getItem('usuario');
      if (auth) {
        const parsed = JSON.parse(auth);
        return {
          name: parsed.user?.name || 'Administrador YBY',
          email: parsed.user?.email || 'admin@somosyby.com',
          avatar: null,
        };
      }
    } catch (e) {}
    return {
      name: 'Administrador YBY',
      email: 'admin@somosyby.com',
      avatar: null,
    };
  });

  const handleUpdateUser = (updated) => {
    setCurrentUser(updated);
    localStorage.setItem('usuario_perfil', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/signIn');
  };

  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'cliente';

  return (
    <>
      <aside
        className={clsx(
          'h-screen bg-yby-surface border-r border-yby-border flex flex-col justify-between transition-all duration-300 z-30 select-none overflow-y-auto',
          collapsed ? 'w-20' : 'w-64',
          className
        )}
      >
        {/* Topo: Logo + Botão de Recolher */}
        <div>
          <div className="flex items-center justify-between p-4 border-b border-yby-border/60 min-h-[72px]">
            <div
              className="flex items-center gap-3 overflow-hidden cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <div className="w-10 h-10 rounded-xl bg-yby-tint/60 border border-yby-border/60 flex items-center justify-center p-1.5 flex-shrink-0 shadow-sm">
                <YbyIcon variant="dark" className="w-6 h-6" />
              </div>
              {!collapsed && (
                <span className="font-extrabold text-xl tracking-tight text-yby-heading whitespace-nowrap">
                  YBY
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onToggleCollapse}
              className="w-8 h-8 rounded-full bg-white border border-yby-border flex items-center justify-center text-yby-muted hover:text-yby-heading hover:bg-yby-tint transition-colors shadow-sm flex-shrink-0"
              title={collapsed ? 'Expandir menu' : 'Recolher menu'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Itens do Menu */}
          <nav className="p-3 space-y-1.5 mt-2">
            {/* 1. DASHBOARD */}
            <NavLink
              to="/dashboard"
              onClick={onItemClick}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all relative',
                  isActive
                    ? 'bg-yby-light text-yby-primary shadow-sm font-bold'
                    : 'text-yby-heading hover:bg-white/60 hover:text-yby-primary'
                )
              }
              title={collapsed ? 'Dashboard' : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-yby-primary rounded-r-md" />
                  )}
                  <BarChart2 className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="whitespace-nowrap">Dashboard</span>}
                </>
              )}
            </NavLink>

            {/* 2. RELATÓRIOS */}
            <NavLink
              to="/relatorios"
              onClick={onItemClick}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all relative',
                  isActive
                    ? 'bg-yby-light text-yby-primary shadow-sm font-bold'
                    : 'text-yby-heading hover:bg-white/60 hover:text-yby-primary'
                )
              }
              title={collapsed ? 'Relatórios' : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-yby-primary rounded-r-md" />
                  )}
                  <Folder className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="whitespace-nowrap">Relatórios</span>}
                </>
              )}
            </NavLink>

            {/* 3. PLANEJAMENTO */}
            <NavLink
              to="/planejamento"
              onClick={onItemClick}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all relative',
                  isActive
                    ? 'bg-yby-light text-yby-primary shadow-sm font-bold'
                    : 'text-yby-heading hover:bg-white/60 hover:text-yby-primary'
                )
              }
              title={collapsed ? 'Planejamento' : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-yby-primary rounded-r-md" />
                  )}
                  <Calendar className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="whitespace-nowrap">Planejamento</span>}
                </>
              )}
            </NavLink>

            {/* 4. CADASTRO com Submenu Permanente (Cliente, Cooperativa, Usuário) */}
            <div>
              <div
                onClick={() => {
                  if (collapsed) {
                    onToggleCollapse();
                  } else {
                    navigate('/cadastro?tab=cliente');
                  }
                  if (onItemClick) onItemClick();
                }}
                className={clsx(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer select-none',
                  location.pathname.startsWith('/cadastro')
                    ? 'bg-yby-light/70 text-yby-primary font-bold'
                    : 'text-yby-heading hover:bg-white/60 hover:text-yby-primary'
                )}
                title={collapsed ? 'Cadastro' : undefined}
              >
                <div className="flex items-center gap-3.5">
                  <UserPlus className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>Cadastro</span>}
                </div>
              </div>

              {/* Sub-itens de Cadastro */}
              {!collapsed && (
                <div className="pl-10 pr-2 pt-1 pb-1 space-y-1">
                  {[
                    { id: 'cliente', label: 'Cliente' },
                    { id: 'cooperativa', label: 'Cooperativa' },
                    { id: 'usuario', label: 'Usuário' },
                  ].map((sub) => {
                    const isSubActive =
                      location.pathname.startsWith('/cadastro') &&
                      (currentTab === sub.id || (sub.id === 'usuario' && currentTab === 'gestor'));
                    return (
                      <NavLink
                        key={sub.id}
                        to={`/cadastro?tab=${sub.id}`}
                        onClick={onItemClick}
                        className={clsx(
                          'block px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                          isSubActive
                            ? 'bg-yby-primary text-white shadow-sm font-bold'
                            : 'text-yby-muted hover:text-yby-heading hover:bg-white/50'
                        )}
                      >
                        {sub.label}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SEÇÃO: PAINEL ADMINISTRATIVO */}
            <div className="pt-2 pb-1">
              {!collapsed && (
                <span className="px-3.5 text-[10px] font-bold text-yby-muted uppercase tracking-wider block">
                  Administração
                </span>
              )}
              {collapsed && <div className="border-t border-yby-border/60 my-2" />}
            </div>

            {/* ORGANIZAÇÕES */}
            <NavLink
              to="/admin/organizacoes"
              onClick={onItemClick}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all relative',
                  isActive
                    ? 'bg-yby-light text-yby-primary shadow-sm font-bold'
                    : 'text-yby-heading hover:bg-white/60 hover:text-yby-primary'
                )
              }
              title={collapsed ? 'Organizações' : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-yby-primary rounded-r-md" />
                  )}
                  <Building2 className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="whitespace-nowrap">Organizações</span>}
                </>
              )}
            </NavLink>

            {/* USUÁRIOS */}
            <NavLink
              to="/admin/usuarios"
              onClick={onItemClick}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all relative',
                  isActive
                    ? 'bg-yby-light text-yby-primary shadow-sm font-bold'
                    : 'text-yby-heading hover:bg-white/60 hover:text-yby-primary'
                )
              }
              title={collapsed ? 'Usuários' : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-yby-primary rounded-r-md" />
                  )}
                  <Users className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="whitespace-nowrap">Usuários</span>}
                </>
              )}
            </NavLink>

            {/* ROTINAS DE COLETA */}
            <NavLink
              to="/admin/rotinas"
              onClick={onItemClick}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all relative',
                  isActive
                    ? 'bg-yby-light text-yby-primary shadow-sm font-bold'
                    : 'text-yby-heading hover:bg-white/60 hover:text-yby-primary'
                )
              }
              title={collapsed ? 'Rotinas de coleta' : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-yby-primary rounded-r-md" />
                  )}
                  <CalendarClock className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="whitespace-nowrap">Rotinas de coleta</span>}
                </>
              )}
            </NavLink>
          </nav>
        </div>

        {/* Rodapé: Card do Usuário (Foto, Nome, Login, Configurações) + Botão Sair */}
        <div className="p-3 border-t border-yby-border/60 space-y-2">
          {/* Card do Usuário com botão de Configurações */}
          <div
            className={clsx(
              'flex items-center justify-between p-2 rounded-xl bg-white/70 border border-yby-border/60 transition-colors',
              collapsed && 'justify-center p-1.5'
            )}
          >
            <div
              className="flex items-center gap-2.5 overflow-hidden cursor-pointer"
              onClick={() => setSettingsOpen(true)}
              title="Abrir configurações da conta"
            >
              {/* Foto ou Iniciais */}
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-yby-primary flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-yby-primary text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
              )}

              {/* Nome e Login */}
              {!collapsed && (
                <div className="overflow-hidden text-left leading-tight">
                  <p className="text-xs font-bold text-yby-heading truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-yby-muted truncate">
                    {currentUser.email}
                  </p>
                </div>
              )}
            </div>

            {/* Botão de Configurações */}
            {!collapsed && (
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="p-1.5 rounded-lg text-yby-muted hover:text-yby-primary hover:bg-yby-tint transition-colors"
                title="Configurações da conta"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Botão Sair */}
          <button
            type="button"
            onClick={handleLogout}
            className={clsx(
              'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-yby-muted hover:text-yby-danger hover:bg-red-50 transition-colors w-full text-left',
              collapsed && 'justify-center px-0'
            )}
            title="Sair"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Modal de Configurações da Conta */}
      {settingsOpen && (
        <AccountSettingsModal
          user={currentUser}
          onClose={() => setSettingsOpen(false)}
          onUpdateUser={handleUpdateUser}
        />
      )}
    </>
  );
}
