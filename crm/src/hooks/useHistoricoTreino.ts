import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { HistoricoTreino } from '../types/database'

export function useHistoricoTreino(alunoId?: string) {
  const [historico, setHistorico] = useState<HistoricoTreino[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHistorico = async () => {
    try {
      setLoading(true)
      let query = supabase.from('historico_treino').select('*')
      if (alunoId) query = query.eq('aluno_id', alunoId)
      const { data, error: err } = await query.order('data_sessao', { ascending: false })

      if (err) throw err
      setHistorico(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar histórico')
      setHistorico([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistorico()
  }, [alunoId])

  const addSessao = async (sessao: Omit<HistoricoTreino, 'id' | 'created_at'>) => {
    try {
      const { data, error: err } = await supabase
        .from('historico_treino')
        .insert([sessao])
        .select()

      if (err) throw err
      if (data && data.length > 0) setHistorico([data[0], ...historico])
      return data?.[0]
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao adicionar sessão')
    }
  }

  const updateSessao = async (id: string, updates: Partial<HistoricoTreino>) => {
    try {
      const { data, error: err } = await supabase
        .from('historico_treino')
        .update(updates)
        .eq('id', id)
        .select()

      if (err) throw err
      if (data && data.length > 0) setHistorico(historico.map(s => s.id === id ? data[0] : s))
      return data?.[0]
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao atualizar sessão')
    }
  }

  const deleteSessao = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from('historico_treino')
        .delete()
        .eq('id', id)

      if (err) throw err
      setHistorico(historico.filter(s => s.id !== id))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao deletar sessão')
    }
  }

  return { historico, loading, error, addSessao, updateSessao, deleteSessao }
}
