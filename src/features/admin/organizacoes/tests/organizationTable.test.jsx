import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OrganizationTable } from '../components/OrganizationTable.jsx';
import { OrganizationMobileCard } from '../components/OrganizationMobileCard.jsx';
import { ORGANIZATION_TYPES, ORGANIZATION_STATUS } from '@/domain/constants/organizationTypes.js';

describe('OrganizationTable & OrganizationMobileCard - Destaque de Organização Inativa', () => {
  const mockOrganizations = [
    {
      id: 'org-1',
      name: 'Yby Soluções Sustentáveis',
      shortName: 'Yby',
      cnpj: '07.100.456/0001-89',
      type: ORGANIZATION_TYPES.COOPERATIVA,
      status: ORGANIZATION_STATUS.ATIVA,
      city: 'Fortaleza',
      state: 'CE',
    },
    {
      id: 'org-2',
      name: 'Rosa Virginia',
      shortName: 'Rosa Virginia',
      cnpj: '07.103.456/0001-89',
      type: ORGANIZATION_TYPES.COOPERATIVA,
      status: ORGANIZATION_STATUS.INATIVA,
      city: 'Fortaleza',
      state: 'CE',
    },
  ];

  it('deve aplicar fundo acinzentado e badge cinza na linha da organização inativa na tabela Desktop', () => {
    render(
      <OrganizationTable
        organizations={mockOrganizations}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleStatus={vi.fn()}
      />
    );

    const rows = screen.getAllByRole('row');
    // Header is row 0, row 1 is Yby (Ativa), row 2 is Rosa Virginia (Inativa)
    const activeRow = rows[1];
    const inactiveRow = rows[2];

    expect(activeRow.className).toContain('bg-white');
    expect(activeRow.className).not.toContain('bg-gray-100/90');

    expect(inactiveRow.className).toContain('bg-gray-100/90');
    expect(inactiveRow).toHaveTextContent('Inativa');
  });

  it('deve aplicar fundo acinzentado e badge cinza no card mobile quando a organização estiver inativa', () => {
    const { container: activeContainer } = render(
      <OrganizationMobileCard
        org={mockOrganizations[0]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleStatus={vi.fn()}
      />
    );
    expect(activeContainer.firstChild.className).toContain('bg-white');

    const { container: inactiveContainer } = render(
      <OrganizationMobileCard
        org={mockOrganizations[1]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleStatus={vi.fn()}
      />
    );
    expect(inactiveContainer.firstChild.className).toContain('bg-gray-100/90');
  });

  it('deve exibir o CNPJ em coluna própria no lugar de Localidade e manter o nome limpo', () => {
    render(
      <OrganizationTable
        organizations={mockOrganizations}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleStatus={vi.fn()}
      />
    );

    expect(screen.getByRole('columnheader', { name: 'CNPJ' })).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: /Localidade/i })).not.toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    const firstDataRow = rows[1];
    expect(firstDataRow.cells[0]).toHaveTextContent('Yby Soluções Sustentáveis');
    expect(firstDataRow.cells[0]).not.toHaveTextContent('07.100.456/0001-89');
    expect(firstDataRow.cells[3]).toHaveTextContent('07.100.456/0001-89');
  });

  it('deve renderizar organização do tipo YBY com badge verde e ícone representativo', () => {
    const ybyOrg = {
      id: 'org-yby',
      name: 'Yby Soluções Sustentáveis',
      shortName: 'Yby',
      cnpj: '07.100.456/0001-89',
      type: ORGANIZATION_TYPES.YBY,
      status: ORGANIZATION_STATUS.ATIVA,
      city: 'Fortaleza',
      state: 'CE',
    };

    render(
      <OrganizationTable
        organizations={[ybyOrg]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleStatus={vi.fn()}
      />
    );

    const ybyBadge = screen.getByText('YBY');
    expect(ybyBadge).toBeInTheDocument();
    expect(ybyBadge.closest('span')).toHaveClass('text-yby-primary');
  });
});
