export interface Profile {
  id: string
  full_name: string
  role: 'admin' | 'trainer'
  created_at: string
}

export interface Aluno {
  id: string
  nome: string
  email: string | null
  telefone: string | null
  plano: string | null
  valor_mensalidade: number | null
  data_inicio: string
  ativo: boolean
  trainer_id: string | null
  observacoes: string | null
  created_at: string
}

export interface HistoricoTreino {
  id: string
  aluno_id: string
  trainer_id: string | null
  data_sessao: string
  observacoes: string | null
  created_at: string
}

export interface Pagamento {
  id: string
  aluno_id: string
  competencia: string
  valor: number
  status: 'pendente' | 'pago' | 'atrasado'
  data_vencimento: string
  data_pagamento: string | null
  created_at: string
}

export interface Frequencia {
  id: string
  aluno_id: string
  data_checkin: string
  hora_checkin: string
  created_at: string
}
