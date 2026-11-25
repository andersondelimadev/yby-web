import { describe, it, expect } from 'vitest';
import {
  validateRoutineInput,
  validateRoutineBatchInput,
  getOccupiedDaysForPoint,
} from './routineValidator.js';
import { WEEK_DAYS } from '../constants/weekDays.js';

describe('routineValidator - Regras de Domínio de Rotinas de Coleta', () => {
  const existing = [
    {
      id: 'rot-1',
      cooperativeId: 'coop-2',
      cooperativeName: 'Coocencipe',
      clientId: 'client-1',
      collectionPointId: 'cp-c-1-1',
      dayOfWeek: WEEK_DAYS.SEGUNDA.id,
    },
    {
      id: 'rot-2',
      cooperativeId: 'coop-4',
      cooperativeName: 'Rosa Virginia',
      clientId: 'client-1',
      collectionPointId: 'cp-c-1-1',
      dayOfWeek: WEEK_DAYS.TERCA.id,
    },
  ];

  it('deve retornar erros para campos obrigatórios ausentes', () => {
    const result = validateRoutineInput({}, existing);
    expect(result.valid).toBe(false);
    expect(result.errors.cooperativeId).toBeDefined();
    expect(result.errors.clientId).toBeDefined();
    expect(result.errors.collectionPointId).toBeDefined();
    expect(result.errors.dayOfWeek).toBeDefined();
  });

  it('deve bloquear rotina duplicada para o mesmo ponto de coleta e mesmo dia da semana', () => {
    const result = validateRoutineInput(
      {
        cooperativeId: 'coop-3',
        clientId: 'client-1',
        collectionPointId: 'cp-c-1-1',
        dayOfWeek: WEEK_DAYS.SEGUNDA.id,
      },
      existing
    );

    expect(result.valid).toBe(false);
    expect(result.duplicateError).toContain('Segunda-feira');
    expect(result.duplicateError).toContain('Coocencipe');
  });

  it('deve permitir salvar edição da própria rotina sem acusar duplicidade consigo mesma', () => {
    const result = validateRoutineInput(
      {
        cooperativeId: 'coop-3',
        clientId: 'client-1',
        collectionPointId: 'cp-c-1-1',
        dayOfWeek: WEEK_DAYS.SEGUNDA.id,
      },
      existing,
      'rot-1'
    );

    expect(result.valid).toBe(true);
    expect(result.duplicateError).toBeNull();
  });

  it('deve mapear dias ocupados no ponto para bloqueio preventivo e validar lote de múltiplos dias', () => {
    const occupied = getOccupiedDaysForPoint(existing, 'cp-c-1-1', ['rot-1']);
    expect(occupied[WEEK_DAYS.SEGUNDA.id]).toBeUndefined();
    expect(occupied[WEEK_DAYS.TERCA.id]?.cooperativeName).toBe('Rosa Virginia');

    const batchInvalid = validateRoutineBatchInput(
      {
        cooperativeId: 'coop-2',
        clientId: 'client-1',
        collectionPointId: 'cp-c-1-1',
        days: [WEEK_DAYS.QUARTA.id, WEEK_DAYS.TERCA.id],
      },
      existing,
      ['rot-1']
    );
    expect(batchInvalid.valid).toBe(false);
    expect(batchInvalid.duplicateError).toContain('Terça-feira');
    expect(batchInvalid.duplicateError).toContain('Rosa Virginia');

    const batchValid = validateRoutineBatchInput(
      {
        cooperativeId: 'coop-2',
        clientId: 'client-1',
        collectionPointId: 'cp-c-1-1',
        days: [WEEK_DAYS.SEGUNDA.id, WEEK_DAYS.QUARTA.id, WEEK_DAYS.SEXTA.id],
      },
      existing,
      ['rot-1']
    );
    expect(batchValid.valid).toBe(true);
    expect(batchValid.duplicateError).toBeNull();
  });
});
