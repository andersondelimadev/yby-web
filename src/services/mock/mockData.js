/**
 * Dados simulados baseados 100% no protótipo do Figma e nos endpoints de produção.
 */

export const MOCK_CLIENTS = [
  { id: 1, name: 'Ticiana Rolim', social_name: 'Ticiana Rolim Empreendimentos', cnpj: '12.345.678/0001-90', email: 'contato@ticianarolim.com.br', phone: '(85) 99123-4567', city: 'Fortaleza', state: 'Ceará', neighborhood: 'Aldeota' },
  { id: 2, name: 'Hospital Jayme da Fonte', social_name: 'Hospital Jayme da Fonte Ltda', cnpj: '23.456.789/0001-01', email: 'adm@jaymedafonte.com.br', phone: '(85) 99234-5678', city: 'Fortaleza', state: 'Ceará', neighborhood: 'Graças' },
  { id: 3, name: 'Arvoredo', social_name: 'Condomínio Residencial Arvoredo', cnpj: '34.567.890/0001-12', email: 'sindico@arvoredo.com.br', phone: '(85) 99345-6789', city: 'Fortaleza', state: 'Ceará', neighborhood: 'Meireles' },
  { id: 4, name: 'Colosso', social_name: 'Colosso Fortaleza Entretenimento', cnpj: '45.678.901/0001-23', email: 'sustentabilidade@colosso.com.br', phone: '(85) 99456-7890', city: 'Fortaleza', state: 'Ceará', neighborhood: 'Edson Queiroz' },
  { id: 5, name: 'Edifício Le Louvre', social_name: 'Condomínio Edifício Le Louvre', cnpj: '56.789.012/0001-34', email: 'contato@lelouvre.com.br', phone: '(85) 99567-8901', city: 'Fortaleza', state: 'Ceará', neighborhood: 'Aldeota' },
  { id: 6, name: 'Locmed (Loja)', social_name: 'Locmed Hospitalar Ltda', cnpj: '67.890.123/0001-45', email: 'loja@locmed.com.br', phone: '(85) 99678-9012', city: 'Fortaleza', state: 'Ceará', neighborhood: 'Centro' },
  { id: 7, name: 'Prisma Residencial', social_name: 'Condomínio Prisma Residencial', cnpj: '78.901.234/0001-56', email: 'prisma@condominios.com.br', phone: '(85) 99789-0123', city: 'Fortaleza', state: 'Ceará', neighborhood: 'Cocó' },
  { id: 8, name: 'Mansão Macedo', social_name: 'Condomínio Mansão Macedo', cnpj: '89.012.345/0001-67', email: 'mansao@macedo.com.br', phone: '(85) 99890-1234', city: 'Fortaleza', state: 'Ceará', neighborhood: 'Aldeota' },
  { id: 9, name: 'Jardim Europa', social_name: 'Condomínio Jardim Europa', cnpj: '90.123.456/0001-78', email: 'contato@jardimeuropa.com.br', phone: '(85) 99901-2345', city: 'Fortaleza', state: 'Ceará', neighborhood: 'Dionísio Torres' },
];

export const MOCK_COOPERATIVES = [
  { id: 1, name: 'Yby Soluções Sustentáveis', shortName: 'Yby', code_access: 'yby2026', employees: 15 },
  { id: 2, name: 'Coocencipe', shortName: 'Coocencipe', code_access: 'cooc2026', employees: 32 },
  { id: 3, name: 'Rede Ceará', shortName: 'Rede Ceará', code_access: 'rede2026', employees: 48 },
  { id: 4, name: 'Rosa Virginia', shortName: 'Rosa Virginia', code_access: 'rosa2026', employees: 22 },
];

export const MOCK_MANAGERS = [
  { id: 1, username: 'gestor.ambiental', email: 'gestor@somosyby.com', clients: [1, 2, 3] },
  { id: 2, username: 'mariana.silva', email: 'mariana@somosyby.com', clients: [4, 5, 6, 7] },
];

export const MOCK_PLANNING = [
  { id: 1, clientId: 1, clientName: 'Ticiana Rolim', seg: 'Yby', ter: 'Yby', qua: 'Yby', qui: 'Yby', sex: 'Yby' },
  { id: 2, clientId: 2, clientName: 'Hospital Jayme da Fonte', seg: 'Coocencipe', ter: 'Coocencipe', qua: 'Coocencipe', qui: 'Coocencipe', sex: 'Coocencipe' },
  { id: 3, clientId: 3, clientName: 'Arvoredo', seg: 'Rede Ceará', ter: 'Rede Ceará', qua: '', qui: '', sex: 'Yby' },
  { id: 4, clientId: 4, clientName: 'Colosso', seg: '', ter: '', qua: 'Rosa Virginia', qui: '', sex: 'Rosa Virginia' },
  { id: 5, clientId: 5, clientName: 'Edifício Le Louvre', seg: 'Rede Ceará', ter: 'Rede Ceará', qua: '', qui: '', sex: '' },
  { id: 6, clientId: 6, clientName: 'Locmed (Loja)', seg: '', ter: '', qua: '', qui: '', sex: 'Rosa Virginia' },
];

export const MOCK_COLLECTIONS = [
  { id: 2561, date: '15/10/2026', time: '15:00', pev: 'Prisma Residencial', waste: 'Recicláveis Geral', weightKg: 50, breakdown: 'Não', cooperative: 'Rosa Virginia' },
  { id: 2560, date: '15/10/2026', time: '09:58', pev: 'Mansão Macedo', waste: 'Papel', weightKg: 40, breakdown: 'Não', cooperative: 'Rede Ceará' },
  { id: 2559, date: '14/10/2026', time: '14:53', pev: 'Hospital Jayme da Fonte', waste: 'Plástico', weightKg: 40, breakdown: 'Sim', cooperative: 'Coocencipe' },
  { id: 2558, date: '14/10/2026', time: '10:37', pev: 'Locmed (Loja)', waste: 'Vidro', weightKg: 15, breakdown: 'Não', cooperative: 'Rosa Virginia' },
  { id: 2557, date: '14/10/2026', time: '09:50', pev: 'Jardim Europa', waste: 'Metal', weightKg: 2800, breakdown: 'Não', cooperative: 'Rosa Virginia' },
  { id: 2556, date: '13/10/2026', time: '15:15', pev: 'Ticiana Rolim', waste: 'Óleo', weightKg: 7.5, breakdown: 'Sim', cooperative: 'Yby Soluções Sustentáveis' },
  { id: 2555, date: '13/10/2026', time: '10:54', pev: 'Arvoredo', waste: 'Orgânicos', weightKg: 140, breakdown: 'Não', cooperative: 'Rede Ceará' },
  { id: 2554, date: '13/10/2026', time: '10:19', pev: 'Edifício Le Louvre', waste: 'Recicláveis Geral', weightKg: 30, breakdown: 'Não', cooperative: 'Rede Ceará' },
];

export const MOCK_DASHBOARD_METRICS_YEAR = {
  periodType: 'year',
  periodLabel: 'Ano atual (2026)',
  primary: {
    energy: '266.049,94 MWh',
    water: '637.995,42 L',
    co2: '129.806,64 kg CO₂e',
    climaticValue: 'R$ 5.733,56',
  },
  secondary: {
    socioenvironmental: 'R$ 3.490,42',
    oil: '1.994.930,61 L',
    trees: '597,17 árvores',
    landfillSpace: '347,67 m³',
  },
  wasteDistribution: {
    totalWeight: '68,3 mil kg',
    items: [
      { name: 'Recicláveis Geral', percent: 87.97, color: '#267332' },
      { name: 'Papel', percent: 11.78, color: '#005885' },
      { name: 'Óleo', percent: 0.16, color: '#E65124' },
      { name: 'Orgânicos', percent: 0.09, color: '#7A7067' },
    ],
  },
  monthlyWeight: [
    { month: 'Jan', weight: 420 },
    { month: 'Fev', weight: 650 },
    { month: 'Mar', weight: 780 },
    { month: 'Abr', weight: 850 },
    { month: 'Mai', weight: 4200 },
    { month: 'Jun', weight: 5100 },
    { month: 'Jul', weight: 4800 },
    { month: 'Ago', weight: 31200 },
    { month: 'Set', weight: 16400 },
    { month: 'Out', weight: 6800 },
    { month: 'Nov', weight: 1200 },
    { month: 'Dez', weight: 2100 },
  ],
  monthlyWater: [
    { month: 'Jan', value: 0.1 },
    { month: 'Fev', value: 0.2 },
    { month: 'Mar', value: 0.2 },
    { month: 'Abr', value: 0.2 },
    { month: 'Mai', value: 1.5 },
    { month: 'Jun', value: 1.8 },
    { month: 'Jul', value: 1.7 },
    { month: 'Ago', value: 9.8 },
    { month: 'Set', value: 4.8 },
    { month: 'Out', value: 2.1 },
    { month: 'Nov', value: 0.4 },
    { month: 'Dez', value: 0.8 },
  ],
  monthlyEnergy: [
    { month: 'Jan', value: 1.5 },
    { month: 'Fev', value: 2.2 },
    { month: 'Mar', value: 2.8 },
    { month: 'Abr', value: 3 },
    { month: 'Mai', value: 14 },
    { month: 'Jun', value: 16 },
    { month: 'Jul', value: 15 },
    { month: 'Ago', value: 112 },
    { month: 'Set', value: 58 },
    { month: 'Out', value: 22 },
    { month: 'Nov', value: 4 },
    { month: 'Dez', value: 7 },
  ],
  waterUnit: 'milhões L',
  energyUnit: 'MWh',
};

export const MOCK_DASHBOARD_METRICS_MONTH = {
  periodType: 'month',
  periodLabel: 'Mês atual (Outubro/2026)',
  primary: {
    energy: '74.820,30 MWh',
    water: '182.410,15 L',
    co2: '36.540,80 kg CO₂e',
    climaticValue: 'R$ 1.620,40',
  },
  secondary: {
    socioenvironmental: 'R$ 980,15',
    oil: '540.230,20 L',
    trees: '168,25 árvores',
    landfillSpace: '98,40 m³',
  },
  wasteDistribution: {
    totalWeight: '21,5 mil kg',
    items: [
      { name: 'Recicláveis Geral', percent: 86.40, color: '#267332' },
      { name: 'Papel', percent: 12.80, color: '#005885' },
      { name: 'Óleo', percent: 0.50, color: '#E65124' },
      { name: 'Orgânicos', percent: 0.30, color: '#7A7067' },
    ],
  },
  monthlyWeight: [
    { month: '01/10', weight: 450 },
    { month: '05/10', weight: 890 },
    { month: '10/10', weight: 1450 },
    { month: '15/10', weight: 2850 },
    { month: '20/10', weight: 3420 },
    { month: '25/10', weight: 2980 },
    { month: '31/10', weight: 3200 },
  ],
  monthlyWater: [
    { month: '01/10', value: 12.5 },
    { month: '05/10', value: 18.4 },
    { month: '10/10', value: 25.1 },
    { month: '15/10', value: 32.8 },
    { month: '20/10', value: 38.5 },
    { month: '25/10', value: 29.2 },
    { month: '31/10', value: 25.9 },
  ],
  monthlyEnergy: [
    { month: '01/10', value: 4.8 },
    { month: '05/10', value: 8.5 },
    { month: '10/10', value: 11.8 },
    { month: '15/10', value: 15.4 },
    { month: '20/10', value: 18.2 },
    { month: '25/10', value: 12.5 },
    { month: '31/10', value: 10.6 },
  ],
  waterUnit: 'mil L',
  energyUnit: 'MWh',
};

export const MOCK_DASHBOARD_METRICS_WEEK = {
  periodType: 'week',
  periodLabel: 'Semana atual (12/10 a 18/10/2026)',
  primary: {
    energy: '61.840,50 MWh',
    water: '148.220,10 L',
    co2: '29.410,25 kg CO₂e',
    climaticValue: 'R$ 1.340,80',
  },
  secondary: {
    socioenvironmental: 'R$ 810,20',
    oil: '460.120,40 L',
    trees: '138,50 árvores',
    landfillSpace: '81,10 m³',
  },
  wasteDistribution: {
    totalWeight: '16,4 mil kg',
    items: [
      { name: 'Recicláveis Geral', percent: 89.20, color: '#267332' },
      { name: 'Papel', percent: 10.30, color: '#005885' },
      { name: 'Óleo', percent: 0.32, color: '#E65124' },
      { name: 'Orgânicos', percent: 0.18, color: '#7A7067' },
    ],
  },
  monthlyWeight: [
    { month: 'Seg (12/10)', weight: 2850 },
    { month: 'Ter (13/10)', weight: 3420 },
    { month: 'Qua (14/10)', weight: 4150 },
    { month: 'Qui (15/10)', weight: 2980 },
    { month: 'Sex (16/10)', weight: 3000 },
    { month: 'Sáb (17/10)', weight: 1200 },
    { month: 'Dom (18/10)', weight: 800 },
  ],
  monthlyWater: [
    { month: 'Seg (12/10)', value: 25.5 },
    { month: 'Ter (13/10)', value: 31.8 },
    { month: 'Qua (14/10)', value: 38.2 },
    { month: 'Qui (15/10)', value: 26.9 },
    { month: 'Sex (16/10)', value: 25.8 },
    { month: 'Sáb (17/10)', value: 11.2 },
    { month: 'Dom (18/10)', value: 7.4 },
  ],
  monthlyEnergy: [
    { month: 'Seg (12/10)', value: 10.8 },
    { month: 'Ter (13/10)', value: 14.2 },
    { month: 'Qua (14/10)', value: 16.5 },
    { month: 'Qui (15/10)', value: 11.9 },
    { month: 'Sex (16/10)', value: 8.4 },
    { month: 'Sáb (17/10)', value: 3.5 },
    { month: 'Dom (18/10)', value: 2.1 },
  ],
  waterUnit: 'mil L',
  energyUnit: 'MWh',
};

export const MOCK_DASHBOARD_METRICS = MOCK_DASHBOARD_METRICS_MONTH;
