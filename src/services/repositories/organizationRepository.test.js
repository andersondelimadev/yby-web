import { describe, it, expect, beforeEach } from 'vitest';
import { organizationRepository } from './organizationRepository.js';
import { ORGANIZATION_TYPES, ORGANIZATION_STATUS } from '@/domain/constants/organizationTypes.js';

describe('organizationRepository - Gestão de Organizações', () => {
  beforeEach(() => {
    organizationRepository.reset();
  });

  it('deve listar todas as organizações cadastradas', async () => {
    const list = await organizationRepository.getAll();
    expect(list.length).toBeGreaterThan(0);
    const hasCoop = list.some((o) => o.type === ORGANIZATION_TYPES.COOPERATIVA);
    const hasClient = list.some((o) => o.type === ORGANIZATION_TYPES.CLIENTE);
    const hasYby = list.some((o) => o.type === ORGANIZATION_TYPES.YBY);
    expect(hasCoop).toBe(true);
    expect(hasClient).toBe(true);
    expect(hasYby).toBe(true);
  });

  it('deve filtrar organizações por tipo', async () => {
    const ybyOrgs = await organizationRepository.getAll({ type: ORGANIZATION_TYPES.YBY });
    expect(ybyOrgs.length).toBeGreaterThan(0);
    expect(ybyOrgs.every((o) => o.type === ORGANIZATION_TYPES.YBY)).toBe(true);

    const coops = await organizationRepository.getAll({ type: ORGANIZATION_TYPES.COOPERATIVA });
    expect(coops.length).toBeGreaterThan(0);
    expect(coops.every((o) => o.type === ORGANIZATION_TYPES.COOPERATIVA)).toBe(true);

    const clients = await organizationRepository.getAll({ type: ORGANIZATION_TYPES.CLIENTE });
    expect(clients.length).toBeGreaterThan(0);
    expect(clients.every((o) => o.type === ORGANIZATION_TYPES.CLIENTE)).toBe(true);
  });

  it('deve filtrar organizações por status', async () => {
    const ativas = await organizationRepository.getAll({ status: ORGANIZATION_STATUS.ATIVA });
    expect(ativas.every((o) => o.status === ORGANIZATION_STATUS.ATIVA)).toBe(true);

    const inativas = await organizationRepository.getAll({ status: ORGANIZATION_STATUS.INATIVA });
    expect(inativas.every((o) => o.status === ORGANIZATION_STATUS.INATIVA)).toBe(true);
  });

  it('deve buscar por nome ou CNPJ', async () => {
    const result = await organizationRepository.getAll({ search: 'Coocencipe' });
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].name).toContain('Coocencipe');
  });

  it('deve criar, atualizar, alternar status e excluir uma organização', async () => {
    // 1. Criar
    const created = await organizationRepository.create({
      name: 'Cooperativa Teste Unitário',
      cnpj: '11.222.333/0001-44',
      type: ORGANIZATION_TYPES.COOPERATIVA,
      status: ORGANIZATION_STATUS.ATIVA,
    });
    expect(created.id).toBeDefined();
    expect(created.name).toBe('Cooperativa Teste Unitário');

    // 2. Atualizar
    const updated = await organizationRepository.update(created.id, {
      name: 'Cooperativa Atualizada',
    });
    expect(updated.name).toBe('Cooperativa Atualizada');

    // 3. Toggle Status
    const toggled = await organizationRepository.toggleStatus(created.id);
    expect(toggled.status).toBe(ORGANIZATION_STATUS.INATIVA);

    const toggledBack = await organizationRepository.toggleStatus(created.id);
    expect(toggledBack.status).toBe(ORGANIZATION_STATUS.ATIVA);

    // 4. Excluir
    const deleted = await organizationRepository.delete(created.id);
    expect(deleted).toBe(true);

    const check = await organizationRepository.getById(created.id);
    expect(check).toBeNull();
  });
});
