import { describe, it, expect, beforeEach } from 'vitest';
import { collectionRoutineRepository } from './collectionRoutineRepository.js';
import { organizationRepository } from './organizationRepository.js';
import { WEEK_DAYS } from '@/domain/constants/weekDays.js';

describe('collectionRoutineRepository - CRUD e Filtros Combinados', () => {
  beforeEach(() => {
    organizationRepository.reset();
    collectionRoutineRepository.reset();
  });

  it('deve listar rotinas hidratadas com cooperativa, cliente, ponto e endereço resumido', async () => {
    const list = await collectionRoutineRepository.getAll();
    expect(list.length).toBeGreaterThanOrEqual(8);
    expect(list[0].cooperativeName).toBeDefined();
    expect(list[0].clientName).toBeDefined();
    expect(list[0].collectionPointName).toBeDefined();
    expect(list[0].collectionPointAddress).toBeDefined();
  });

  it('deve combinar filtros de cooperativa e múltiplos dias da semana', async () => {
    const filtered = await collectionRoutineRepository.getAll({
      cooperativeId: 'coop-2',
      days: [WEEK_DAYS.SEGUNDA.id, WEEK_DAYS.QUARTA.id],
    });

    expect(filtered.length).toBeGreaterThan(0);
    expect(
      filtered.every(
        (r) =>
          r.cooperativeId === 'coop-2' &&
          [WEEK_DAYS.SEGUNDA.id, WEEK_DAYS.QUARTA.id].includes(r.dayOfWeek)
      )
    ).toBe(true);
  });

  it('deve criar, impedir duplicidade, atualizar e excluir uma rotina mantendo datas de registro', async () => {
    const created = await collectionRoutineRepository.create({
      cooperativeId: 'coop-2',
      clientId: 'client-1',
      collectionPointId: 'cp-c-1-1',
      dayOfWeek: WEEK_DAYS.DOMINGO.id,
    });

    expect(created.id).toBeDefined();
    expect(created.created_at).toBeDefined();
    expect(created.updated_at).toBeDefined();

    // Tenta criar duplicada no mesmo ponto e dia
    await expect(
      collectionRoutineRepository.create({
        cooperativeId: 'coop-3',
        clientId: 'client-1',
        collectionPointId: 'cp-c-1-1',
        dayOfWeek: WEEK_DAYS.DOMINGO.id,
      })
    ).rejects.toThrow(/Já existe uma rotina cadastrada/i);

    // Atualiza o dia da rotina criada
    const updated = await collectionRoutineRepository.update(created.id, {
      cooperativeId: 'coop-3',
      clientId: 'client-1',
      collectionPointId: 'cp-c-1-1',
      dayOfWeek: WEEK_DAYS.SABADO.id,
    });
    expect(updated.cooperativeId).toBe('coop-3');
    expect(updated.dayOfWeek).toBe(WEEK_DAYS.SABADO.id);

    // Exclui
    const deleted = await collectionRoutineRepository.delete(created.id);
    expect(deleted).toBe(true);
  });
});
