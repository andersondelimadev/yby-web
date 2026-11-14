import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { LoginPage } from '../pages/LoginPage.jsx';

describe('LoginPage Component', () => {
  it('deve exibir em destaque a frase "Rastreabilidade e Mensuração de Impacto" sem o selo superior e sem a descrição inferior', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Frase central atualizada
    expect(screen.getByText('Rastreabilidade e Mensuração de Impacto')).toBeInTheDocument();

    // Selo superior e descrição inferior devem estar ausentes
    expect(screen.queryByText('PLATAFORMA DE COLETA SELETIVA')).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Acompanhe resíduos, cooperativas e pontos de entrega voluntária/i)
    ).not.toBeInTheDocument();

    // Campos do formulário de login
    expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
  });
});
