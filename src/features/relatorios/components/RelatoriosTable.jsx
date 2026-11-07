import React from 'react';
import { Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/shared/ui/Badge.jsx';
import { Button } from '@/shared/ui/Button.jsx';

const WASTE_BADGE_VARIANTS = {
  'Papel': 'blue',
  'Metal': 'orange',
  'Óleo': 'orange',
  'Vidro': 'teal',
  'Orgânicos': 'gray',
  'Plástico': 'green',
  'Recicláveis Geral': 'green',
};

export function RelatoriosTable({ collections = [], onEdit, onDelete, onViewPhotos }) {
  return (
    <div className="bg-white rounded-2xl border border-yby-border overflow-hidden shadow-card transition-all duration-300 ease-out hover:shadow-card-elevated hover:border-yby-primary/30 cursor-default">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-yby-surface/60 border-b border-yby-border text-xs font-bold text-yby-muted uppercase tracking-wider">
              <th className="py-3.5 px-4">ID</th>
              <th className="py-3.5 px-4">Data | Horário ↓</th>
              <th className="py-3.5 px-4">PEV</th>
              <th className="py-3.5 px-4">Tipo de resíduo</th>
              <th className="py-3.5 px-4">Coleta (kg)</th>
              <th className="py-3.5 px-4">Avaria</th>
              <th className="py-3.5 px-4">Cooperativa</th>
              <th className="py-3.5 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-yby-border/60 text-sm">
            {collections.map((item, index) => {
              const isEven = index % 2 === 1;
              return (
                <tr
                  key={item.id}
                  className={`transition-colors duration-150 ${isEven ? 'bg-yby-zebra hover:bg-yby-tint/40' : 'bg-white hover:bg-yby-tint/40'}`}
                >
                  <td className="py-3.5 px-4 text-xs font-medium text-yby-muted">
                    {item.id}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-yby-heading block">{item.date}</span>
                    <span className="text-xs text-yby-muted block">{item.time}</span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-yby-heading">
                    {item.pev}
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant={WASTE_BADGE_VARIANTS[item.waste] || 'green'}>
                      {item.waste}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-yby-heading">
                    {item.weightKg}
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant={item.breakdown === 'Sim' ? 'red' : 'beige'}>
                      {item.breakdown}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-xs font-medium text-yby-heading">
                    {item.cooperative}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="p-1.5 rounded-lg text-yby-muted hover:text-yby-heading hover:bg-white transition-all duration-150 hover:scale-110 active:scale-95 hover:shadow-sm"
                        title="Editar coleta"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 rounded-lg text-yby-danger/80 hover:text-yby-danger hover:bg-red-50 transition-all duration-150 hover:scale-110 active:scale-95 hover:shadow-sm"
                        title="Excluir coleta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onViewPhotos(item)}
                        className="p-1.5 rounded-lg text-yby-muted hover:text-yby-primary hover:bg-white transition-all duration-150 hover:scale-110 active:scale-95 hover:shadow-sm"
                        title="Ver fotos da coleta"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Rodapé da tabela */}
      <div className="p-4 bg-white border-t border-yby-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-yby-muted">
          Mostrando {collections.length} de 466 registros
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.info('Todos os 466 registros disponíveis já estão carregados.')}
        >
          Carregar mais
        </Button>
      </div>
    </div>
  );
}
