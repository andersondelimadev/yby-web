import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginPage } from '../pages/LoginPage.jsx';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('deve exibir a frase de impacto, campos de login e não exibir o acesso separado por código da cooperativa', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Rastreabilidade e Mensuração de Impacto')).toBeInTheDocument();
    expect(screen.queryByText('PLATAFORMA DE COLETA SELETIVA')).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Acompanhe resíduos, cooperativas e pontos de entrega voluntária/i)
    ).not.toBeInTheDocument();

    expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Acessar como cooperativa/i)
    ).not.toBeInTheDocument();
  });

  it('deve autenticar como cooperativa e redirecionar para /ponto-coleta ao informar login "Cooperativa" com a senha padrão', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const loginInput = screen.getByLabelText(/E-mail/i);
    const submitButton = screen.getByRole('button', { name: /Entrar/i });

    fireEvent.change(loginInput, { target: { value: 'Cooperativa' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/ponto-coleta');
    });

    const stored = JSON.parse(localStorage.getItem('usuario'));
    expect(stored.user.role).toBe('cooperativa');
  });

  it('deve autenticar como cooperativa ao informar o e-mail de usuário vinculado a cooperativa', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const loginInput = screen.getByLabelText(/E-mail/i);
    const submitButton = screen.getByRole('button', { name: /Entrar/i });

    fireEvent.change(loginInput, { target: { value: 'rosa@cooperativa.org' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/ponto-coleta');
    });

    const stored = JSON.parse(localStorage.getItem('usuario'));
    expect(stored.user.role).toBe('cooperativa');
    expect(stored.user.email).toBe('rosa@cooperativa.org');
  });

  it('deve autenticar como administrador e redirecionar para /dashboard com admin@somosyby.com', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', { name: /Entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    const stored = JSON.parse(localStorage.getItem('usuario'));
    expect(stored.user.isAdmin).toBe(true);
  });

  it('não deve autenticar quando a senha estiver incorreta', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const loginInput = screen.getByLabelText(/E-mail/i);
    const passwordInput = screen.getByLabelText(/Senha/i);
    const submitButton = screen.getByRole('button', { name: /Entrar/i });

    fireEvent.change(loginInput, { target: { value: 'Cooperativa' } });
    fireEvent.change(passwordInput, { target: { value: 'senhaerrada' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(localStorage.getItem('usuario')).toBeNull();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
