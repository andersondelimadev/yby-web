import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrganizationShowModal } from '../components/OrganizationShowModal.jsx';
import { CollectionPointModal } from '../components/CollectionPointModal.jsx';
import { ORGANIZATION_TYPES } from '@/domain/constants/organizationTypes.js';
import { cepService } from '@/services/cepService.js';

describe('OrganizationShowModal & CollectionPointModal dedicado', () => {
  const mockOrg = {
    id: 'client-1',
    name: 'Ticiana Rolim Empreendimentos',
    cnpj: '12.345.678/0001-90',
    type: ORGANIZATION_TYPES.CLIENTE,
    created_at: '2026-02-05T14:15:00Z',
    collectionPoints: [
      {
        id: 'cp-1',
        nickname: 'Torre Aldeota',
        zip_code: '60160-100',
        address: 'Av. Santos Dumont',
        number: '1200',
        neighborhood: 'Aldeota',
        city: 'Fortaleza',
        state: 'CE',
        active: true,
      },
    ],
  };

  const mockOrganizations = [
    mockOrg,
    {
      id: 'coop-1',
      name: 'Yby Soluções Sustentáveis',
      type: ORGANIZATION_TYPES.YBY,
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('deve exibir dados da organização, delegar adição/edição ao modal dedicado e confirmar exclusão inline', async () => {
    const onRequestAddPoint = vi.fn();
    const onRequestEditPoint = vi.fn();
    const onDeleteCollectionPoint = vi.fn().mockResolvedValueOnce({});

    render(
      <OrganizationShowModal
        organization={mockOrg}
        onClose={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onRequestAddPoint={onRequestAddPoint}
        onRequestEditPoint={onRequestEditPoint}
        onDeleteCollectionPoint={onDeleteCollectionPoint}
      />
    );

    expect(screen.getAllByText('Ticiana Rolim Empreendimentos').length).toBeGreaterThan(0);
    expect(screen.getByText('12.345.678/0001-90')).toBeInTheDocument();
    expect(screen.getAllByText('Cliente').length).toBeGreaterThan(0);
    expect(screen.getByText(/05\/02\/2026/)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Excluir' })).toBeInTheDocument();

    // Delega abertura do modal limpo de criação
    fireEvent.click(screen.getByRole('button', { name: /Adicionar ponto de coleta/i }));
    expect(onRequestAddPoint).toHaveBeenCalledTimes(1);

    // Delega abertura do modal limpo de edição
    fireEvent.click(screen.getByRole('button', { name: /Editar ponto Torre Aldeota/i }));
    expect(onRequestEditPoint).toHaveBeenCalledWith(mockOrg.collectionPoints[0]);

    // Excluir ponto com confirmação inline
    fireEvent.click(screen.getByRole('button', { name: /Excluir ponto Torre Aldeota/i }));
    expect(screen.getByText(/Deseja excluir o ponto "Torre Aldeota"\?/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Confirmar exclusão/i }));

    await waitFor(() => {
      expect(onDeleteCollectionPoint).toHaveBeenCalledWith('client-1', 'cp-1');
    });
  });

  it('deve permitir escolher a organização no CollectionPointModal ao adicionar pelo botão do topo', async () => {
    vi.spyOn(cepService, 'getAddressByCep').mockResolvedValueOnce({
      cep: '60170-220',
      street: 'Rua Júlio Ibiapina',
      neighborhood: 'Meireles',
      city: 'Fortaleza',
      state: 'Ceará',
      uf: 'CE',
    });

    const onSave = vi.fn().mockResolvedValueOnce({});

    render(
      <CollectionPointModal
        organization={null}
        organizations={mockOrganizations}
        point={null}
        onClose={vi.fn()}
        onSave={onSave}
      />
    );

    expect(screen.getByText('Novo Ponto de Coleta')).toBeInTheDocument();

    // Select de Organização disponível quando aberto pelo topo
    const orgSelect = screen.getByLabelText(/Organização/i);
    expect(orgSelect).toBeInTheDocument();
    fireEvent.change(orgSelect, { target: { value: 'coop-1' } });

    fireEvent.change(screen.getByLabelText(/Apelido/i), {
      target: { value: 'Galpão Meireles' },
    });
    fireEvent.change(screen.getByLabelText(/CEP/i), {
      target: { value: '60170220' },
    });

    await waitFor(() => {
      expect(cepService.getAddressByCep).toHaveBeenCalledWith('60170220');
      expect(screen.getByLabelText(/Endereço/i)).toHaveValue('Rua Júlio Ibiapina');
    });

    fireEvent.change(screen.getByLabelText(/Número/i), {
      target: { value: '340' },
    });

    const switchBtn = screen.getByRole('switch', { name: /Ponto de coleta ativo/i });
    fireEvent.click(switchBtn);

    fireEvent.click(screen.getByRole('button', { name: /Salvar ponto de coleta/i }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('coop-1', {
        nickname: 'Galpão Meireles',
        zip_code: '60170-220',
        address: 'Rua Júlio Ibiapina',
        number: '340',
        neighborhood: 'Meireles',
        city: 'Fortaleza',
        state: 'CE',
        active: false,
      });
    });
  });

  it('deve exibir apenas o formulário limpo ao editar ponto pelo CollectionPointModal (sem resumo da organização)', async () => {
    const onSave = vi.fn().mockResolvedValueOnce({});

    render(
      <CollectionPointModal
        organization={mockOrg}
        organizations={mockOrganizations}
        point={mockOrg.collectionPoints[0]}
        onClose={vi.fn()}
        onSave={onSave}
      />
    );

    expect(screen.getByText('Editar Ponto de Coleta')).toBeInTheDocument();
    expect(screen.queryByText('12.345.678/0001-90')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/^Organização/i)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Apelido/i), {
      target: { value: 'Torre Aldeota - Entrada B' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Salvar alterações/i }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        'client-1',
        expect.objectContaining({ nickname: 'Torre Aldeota - Entrada B' })
      );
    });
  });
});
