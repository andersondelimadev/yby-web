import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OrganizationModal } from '../components/OrganizationModal.jsx';
import { ORGANIZATION_TYPES, ORGANIZATION_STATUS } from '@/domain/constants/organizationTypes.js';

describe('OrganizationModal Component', () => {
  it('deve conter as opções YBY, Cooperativa e Cliente no campo Tipo de Organização', () => {
    render(<OrganizationModal onClose={vi.fn()} onSave={vi.fn()} saving={false} />);

    const select = screen.getByLabelText(/Tipo de Organização/i);
    expect(select).toBeInTheDocument();

    const options = Array.from(select.querySelectorAll('option')).map((o) => o.value);
    expect(options).toContain(ORGANIZATION_TYPES.YBY);
    expect(options).toContain(ORGANIZATION_TYPES.COOPERATIVA);
    expect(options).toContain(ORGANIZATION_TYPES.CLIENTE);
  });

  it('deve exibir o switch de Status booleano e permitir alternar entre Ativa e Inativa', () => {
    const handleSave = vi.fn();
    render(<OrganizationModal onClose={vi.fn()} onSave={handleSave} saving={false} />);

    // Por padrão no cadastro vem Ativa
    const statusBtn = screen.getByRole('button', { name: /Alternar status da organização/i });
    expect(statusBtn).toBeInTheDocument();
    expect(screen.getByText('Ativa')).toBeInTheDocument();

    // Alterna para Inativa
    fireEvent.click(statusBtn);
    expect(screen.getByText('Inativa')).toBeInTheDocument();

    // Preenche nome obrigatório
    const nameInput = screen.getByLabelText(/Nome da Organização/i);
    fireEvent.change(nameInput, { target: { value: 'Nova Cooperativa Exemplo' } });

    // Salva o formulário
    const submitBtn = screen.getByRole('button', { name: /Cadastrar organização/i });
    fireEvent.click(submitBtn);

    expect(handleSave).toHaveBeenCalledWith({
      name: 'Nova Cooperativa Exemplo',
      cnpj: '',
      type: ORGANIZATION_TYPES.CLIENTE,
      status: ORGANIZATION_STATUS.INATIVA,
    });
  });

  it('deve inicializar com os dados da organização em modo edição incluindo o status existente', () => {
    const existingOrg = {
      id: 'org-test',
      name: 'Yby Matriz',
      cnpj: '12.345.678/0001-90',
      type: ORGANIZATION_TYPES.YBY,
      status: ORGANIZATION_STATUS.INATIVA,
    };

    render(
      <OrganizationModal
        organization={existingOrg}
        onClose={vi.fn()}
        onSave={vi.fn()}
        saving={false}
      />
    );

    expect(screen.getByDisplayValue('Yby Matriz')).toBeInTheDocument();
    expect(screen.getByDisplayValue('12.345.678/0001-90')).toBeInTheDocument();
    expect(screen.getByLabelText(/Tipo de Organização/i)).toHaveValue(ORGANIZATION_TYPES.YBY);
    expect(screen.getByText('Inativa')).toBeInTheDocument();
  });
});
