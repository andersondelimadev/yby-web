import { describe, it, expect, beforeEach } from 'vitest';
import { collectionRoutineRepository } from './collectionRoutineRepository.js';
import { organizationRepository } from './organizationRepository.js';
import { WEEK_DAYS } from '@/domain/constants/weekDays.js';

describe('collectionRoutineRepository - CRUD, Lote Multi-dia e Filtros Combinados', () => {
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

  it('deve salvar múltiplos dias em lote, impedir conflito e excluir em lote', async () => {
    const createdBatch = await collectionRoutineRepository.saveBatch({
      cooperativeId: 'coop-2',
      clientId: 'client-1',
      collectionPointId: 'cp-c-1-1',
      days: [WEEK_DAYS.DOMINGO.id, WEEK_DAYS.SABADO.id],
    });

    expect(createdBatch).toHaveLength(2);
    expect(createdBatch[0].created_at).toBeDefined();

    // Tenta criar outro lote colidindo com Domingo no mesmo ponto
    await expect(
      collectionRoutineRepository.saveBatch({
        cooperativeId: 'coop-3',
        clientId: 'client-1',
        collectionPointId: 'cp-c-1-1',
        days: [WEEK_DAYS.DOMINGO.id],
      })
    ).rejects.toThrow(/Já existe rotina cadastrada/i);

    // Exclui o lote criado
    const ids = createdBatch.map((r) => r.id);
    const deleted = await collectionRoutineRepository.deleteMany(ids);
    expect(deleted).toBe(true);
  });
});
