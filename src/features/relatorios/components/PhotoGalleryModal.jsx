import React from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/shared/ui/Button.jsx';

export function PhotoGalleryModal({ item, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-yby-border shadow-popup relative">
        <div className="flex items-center justify-between border-b border-yby-border/60 pb-3 mb-4">
          <div>
            <h3 className="font-extrabold text-lg text-yby-heading">Evidências Fotográficas #{item.id}</h3>
            <p className="text-xs text-yby-muted">{item.pev} · {item.date}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-yby-muted hover:text-yby-heading hover:bg-yby-surface"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold text-yby-heading block mb-2">Foto dos Coletores</span>
            <div className="w-full h-48 rounded-xl bg-yby-surface flex flex-col items-center justify-center border border-dashed border-yby-border text-yby-muted">
              <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-xs">Foto registrada pelo coletor em campo</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-yby-heading block mb-2">Status de Avaria</span>
            {item.breakdown === 'Sim' ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-yby-danger bg-red-50 p-3 rounded-lg border border-red-200">
                  Avaria relatada: problema constatado no coletor/PEV durante a coleta.
                </p>
                <div className="w-full h-36 rounded-xl bg-red-50/40 flex flex-col items-center justify-center border border-dashed border-red-200 text-yby-danger">
                  <ImageIcon className="w-7 h-7 mb-1 opacity-70" />
                  <span className="text-xs font-medium">Foto comprobatória da avaria</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-yby-muted bg-yby-surface/40 p-3 rounded-lg border border-yby-border/60">
                Nenhuma avaria relatada na coleta ({item.breakdown}).
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 mt-4 border-t border-yby-border/60">
          <Button type="button" variant="primary" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DeleteConfirmModal({ id, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-yby-border shadow-popup relative">
        <h3 className="font-extrabold text-lg text-yby-heading mb-2">Excluir Coleta #{id}?</h3>
        <p className="text-xs md:text-sm text-yby-muted mb-6 leading-relaxed">
          Tem certeza de que deseja excluir este registro de coleta? Esta ação atualizará os relatórios e os indicadores ambientais do dashboard.
        </p>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm}>
            Sim, excluir registro
          </Button>
        </div>
      </div>
    </div>
  );
}
