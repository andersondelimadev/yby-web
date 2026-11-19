import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CheckCircle, MapPin, Truck, ArrowLeft, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/shared/layout/PageHeader.jsx';
import { InputField } from '@/shared/ui/InputField.jsx';
import { SelectField } from '@/shared/ui/SelectField.jsx';
import { Button } from '@/shared/ui/Button.jsx';
import { Badge } from '@/shared/ui/Badge.jsx';
import { WASTE_LIST } from '@/domain/constants/wasteTypes.js';
import { calculateWeightInKg } from '@/domain/calculators/wasteWeightCalculator.js';

export function PontoColetaPage() {
  const navigate = useNavigate();

  // Lista de PEVs atribuídos à cooperativa hoje
  const todayPevs = [
    { id: 1, name: 'Ticiana Rolim', address: 'Av. Santos Dumont, 1200 - Aldeota', status: 'pendente' },
    { id: 2, name: 'Hospital Jayme da Fonte', address: 'R. das Graças, 450 - Graças', status: 'pendente' },
    { id: 3, name: 'Arvoredo', address: 'R. Pereira Valente, 890 - Meireles', status: 'concluido' },
  ];

  const [selectedPev, setSelectedPev] = useState(todayPevs[0]);
  const [waste, setWaste] = useState('Recicláveis Geral');
  const [quantity, setQuantity] = useState('50');
  const [unit, setUnit] = useState('kg');
  const [hasBreakdown, setHasBreakdown] = useState(false);
  const [photoAdded, setPhotoAdded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const calculatedKg = calculateWeightInKg(quantity, unit, waste);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success(`Coleta de ${calculatedKg} kg no PEV ${selectedPev.name} registrada com sucesso!`);
      setPhotoAdded(false);
      setQuantity('');
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem('usuario');
            navigate('/signIn');
          }}
          className="inline-flex items-center text-xs font-semibold text-yby-muted hover:text-yby-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Sair do Ponto de Coleta
        </button>
        <Badge variant="green">Cooperativa Conectada</Badge>
      </div>

      <PageHeader
        title="Ponto de Coleta"
        subtitle="Registro em campo de coletas nos PEVs atribuídos hoje"
      />

      {/* Lista de PEVs de Hoje */}
      <div className="bg-yby-surface p-4 sm:p-5 rounded-2xl border border-yby-border transition-all duration-300 ease-out hover:shadow-card hover:border-yby-primary/30 cursor-default">
        <div className="flex items-center gap-2 mb-3">
          <Truck className="w-5 h-5 text-yby-primary" />
          <h2 className="text-sm font-bold text-yby-heading">PEVs da Rota de Hoje</h2>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {todayPevs.map((pev) => {
            const isSelected = selectedPev?.id === pev.id;
            return (
              <button
                key={pev.id}
                type="button"
                onClick={() => setSelectedPev(pev)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all duration-200 hover:-translate-y-0.5 ${
                  isSelected
                    ? 'bg-white border-yby-primary shadow-sm ring-2 ring-yby-tint'
                    : 'bg-white/60 border-yby-border hover:bg-white hover:shadow-sm'
                }`}
              >
                <div>
                  <p className="font-bold text-sm text-yby-heading">{pev.name}</p>
                  <span className="text-xs text-yby-muted flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    {pev.address}
                  </span>
                </div>
                {pev.status === 'concluido' ? (
                  <Badge variant="green">Coletado</Badge>
                ) : (
                  <Badge variant="orange">Pendente</Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulário de Registro de Coleta */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-yby-border shadow-card space-y-5 transition-all duration-300 ease-out hover:shadow-card-elevated hover:border-yby-primary/30 cursor-default">
        <div className="border-b border-yby-border/60 pb-3">
          <h3 className="font-extrabold text-base text-yby-heading">
            Apontar Coleta: {selectedPev?.name}
          </h3>
          <p className="text-xs text-yby-muted">Preencha o peso ou volume e anexe a foto do coletor</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="Tipo de Resíduo"
            required
            options={WASTE_LIST.map((w) => w.name)}
            value={waste}
            onChange={(e) => setWaste(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-2">
            <InputField
              label="Quantidade"
              required
              type="number"
              step="0.1"
              placeholder="Ex: 50"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <SelectField
              label="Unidade"
              required
              options={['kg', 'L']}
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </div>
        </div>

        {/* Feedback do cálculo de densidade */}
        {unit === 'L' && (
          <div className="p-3 bg-yby-tint/40 rounded-xl border border-yby-light text-xs text-yby-primary flex items-center justify-between">
            <span>Conversão por densidade oficial YBY:</span>
            <strong className="text-sm font-extrabold">{calculatedKg} kg</strong>
          </div>
        )}

        {/* Captura de Foto do Coletor */}
        <div>
          <label className="text-xs font-semibold text-yby-heading block mb-2">
            Foto do Coletor / Evidência <span className="text-yby-danger">*</span>
          </label>
          <button
            type="button"
            onClick={() => {
              setPhotoAdded(true);
              toast.success('Foto capturada com sucesso!');
            }}
            className={`w-full py-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-colors ${
              photoAdded
                ? 'border-yby-primary bg-yby-tint/20 text-yby-primary'
                : 'border-yby-border hover:border-yby-primary text-yby-muted hover:text-yby-heading'
            }`}
          >
            {photoAdded ? (
              <>
                <CheckCircle className="w-8 h-8 mb-1 text-yby-primary" />
                <span className="text-xs font-bold">Foto registrada com sucesso!</span>
                <span className="text-[10px] text-yby-muted mt-0.5">Toque para substituir</span>
              </>
            ) : (
              <>
                <Camera className="w-8 h-8 mb-1" />
                <span className="text-xs font-bold">Tirar foto do coletor</span>
                <span className="text-[10px] text-yby-muted mt-0.5">Câmera traseira do celular</span>
              </>
            )}
          </button>
        </div>

        {/* Avaria */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="avaria"
            checked={hasBreakdown}
            onChange={(e) => setHasBreakdown(e.target.checked)}
            className="w-4 h-4 rounded text-yby-primary focus:ring-yby-primary border-yby-border"
          />
          <label htmlFor="avaria" className="text-xs font-medium text-yby-heading cursor-pointer">
            Houve avaria no PEV ou nos coletores
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="lg"
          loading={submitting}
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Registrar Coleta ({calculatedKg} kg)
        </Button>
      </form>
    </div>
  );
}
