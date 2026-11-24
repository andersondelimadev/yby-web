import { describe, it, expect } from 'vitest';
import { validateRoutineInput } from './routineValidator.js';
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
});
