import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Pagamento } from '../types/database'

export function usePagamentos(alunoId?: string) {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPagamentos = async () => {
    try {
      setLoading(true)
      let query = supabase.from('pagamentos').select('*')
      if (alunoId) query = query.eq('aluno_id', alunoId)
      const { data, error: err } = await query.order('data_vencimento', { ascending: true })

      if (err) throw err
      setPagamentos(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pagamentos')
      setPagamentos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPagamentos()
  }, [alunoId])

  const addPagamento = async (pagamento: Omit<Pagamento, 'id' | 'created_at'>) => {
    try {
      const { data, error: err } = await supabase
        .from('pagamentos')
        .insert([pagamento])
        .select()

      if (err) throw err
      if (data && data.length > 0) setPagamentos([...pagamentos, data[0]])
      return data?.[0]
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao adicionar pagamento')
    }
  }

  const updatePagamento = async (id: string, updates: Partial<Pagamento>) => {
    try {
      const { data, error: err } = await supabase
        .from('pagamentos')
        .update(updates)
        .eq('id', id)
        .select()

      if (err) throw err
      if (data && data.length > 0) setPagamentos(pagamentos.map(p => p.id === id ? data[0] : p))
      return data?.[0]
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao atualizar pagamento')
    }
  }

  const deletePagamento = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from('pagamentos')
        .delete()
        .eq('id', id)

      if (err) throw err
      setPagamentos(pagamentos.filter(p => p.id !== id))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao deletar pagamento')
    }
  }

  return { pagamentos, loading, error, addPagamento, updatePagamento, deletePagamento }
}
