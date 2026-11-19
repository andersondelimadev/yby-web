import { describe, it, expect } from 'vitest';
import { userRepository } from './userRepository.js';
import { USER_ROLES } from '@/domain/constants/userRoles.js';
import { USER_STATUS } from '@/domain/constants/userStatuses.js';

describe('userRepository - Gestão de Usuários', () => {
  it('deve listar usuários cadastrados contemplando os papéis do sistema', async () => {
    const list = await userRepository.getAll();
    expect(list.length).toBeGreaterThan(0);

    const rolesFound = new Set(list.map((u) => u.role));
    expect(rolesFound.has(USER_ROLES.GESTOR_YBY.id)).toBe(true);
    expect(rolesFound.has(USER_ROLES.COLABORADOR_YBY.id)).toBe(true);
    expect(rolesFound.has(USER_ROLES.PRESIDENTE_COOPERATIVA.id)).toBe(true);
    expect(rolesFound.has(USER_ROLES.COLABORADOR_COOPERATIVA.id)).toBe(true);
    expect(rolesFound.has(USER_ROLES.CLIENTE.id)).toBe(true);
  });

  it('deve filtrar usuários por papel (role)', async () => {
    const gestores = await userRepository.getAll({ role: USER_ROLES.GESTOR_YBY.id });
    expect(gestores.length).toBeGreaterThan(0);
    expect(gestores.every((u) => u.role === USER_ROLES.GESTOR_YBY.id)).toBe(true);

    const clientes = await userRepository.getAll({ role: USER_ROLES.CLIENTE.id });
    expect(clientes.length).toBeGreaterThan(0);
    expect(clientes.every((u) => u.role === USER_ROLES.CLIENTE.id)).toBe(true);
  });

  it('deve filtrar usuários por organização vinculada', async () => {
    const list = await userRepository.getAll({ organizationId: 'coop-1' });
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((u) => u.organizationId === 'coop-1')).toBe(true);
  });

  it('deve suportar criação de usuários com os 5 papéis oficiais vinculados a organizações', async () => {
    const roles = [
      USER_ROLES.GESTOR_YBY.id,
      USER_ROLES.COLABORADOR_YBY.id,
      USER_ROLES.PRESIDENTE_COOPERATIVA.id,
      USER_ROLES.COLABORADOR_COOPERATIVA.id,
      USER_ROLES.CLIENTE.id,
    ];

    for (const roleId of roles) {
      const created = await userRepository.create({
        name: `Usuário ${roleId}`,
        email: `${roleId}@exemplo.com`,
        role: roleId,
        organizationId: 'org-test',
        organizationName: 'Organização Teste',
        organizationType: 'Cliente',
      });
      expect(created.role).toBe(roleId);
      expect(created.organizationId).toBe('org-test');

      // Limpa após teste
      await userRepository.delete(created.id);
    }
  });

  it('deve criar, atualizar e excluir um usuário', async () => {
    // 1. Criar
    const created = await userRepository.create({
      name: 'Usuário Teste Unitário',
      email: 'teste@unitario.com',
      role: USER_ROLES.COLABORADOR_YBY.id,
      organizationId: 'coop-1',
      organizationName: 'Yby Soluções Sustentáveis',
      organizationType: 'Cooperativa',
    });
    expect(created.id).toBeDefined();
    expect(created.name).toBe('Usuário Teste Unitário');

    // 2. Atualizar
    const updated = await userRepository.update(created.id, {
      name: 'Nome Atualizado',
      role: USER_ROLES.GESTOR_YBY.id,
    });
    expect(updated.name).toBe('Nome Atualizado');
    expect(updated.role).toBe(USER_ROLES.GESTOR_YBY.id);

    // 3. Excluir
    const deleted = await userRepository.delete(created.id);
    expect(deleted).toBe(true);

    const check = await userRepository.getById(created.id);
    expect(check).toBeNull();
  });

  it('deve filtrar usuários por status e iniciar novos usuários como pending por padrão', async () => {
    const activeUsers = await userRepository.getAll({ status: USER_STATUS.ACTIVE.id });
    expect(activeUsers.length).toBeGreaterThan(0);
    expect(activeUsers.every((u) => u.status === USER_STATUS.ACTIVE.id)).toBe(true);

    const pendingUsers = await userRepository.getAll({ status: USER_STATUS.PENDING.id });
    expect(pendingUsers.length).toBeGreaterThan(0);
    expect(pendingUsers.every((u) => u.status === USER_STATUS.PENDING.id)).toBe(true);

    const created = await userRepository.create({
      name: 'Novo Pendente',
      email: 'pendente@yby.com',
      role: USER_ROLES.CLIENTE.id,
      organizationId: 'client-1',
      organizationName: 'Ticiana Rolim Empreendimentos',
      organizationType: 'Cliente',
    });
    expect(created.status).toBe(USER_STATUS.PENDING.id);
    await userRepository.delete(created.id);
  });
});
