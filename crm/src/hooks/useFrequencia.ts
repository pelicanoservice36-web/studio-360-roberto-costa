import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Frequencia } from '../types/database'

export function useFrequencia(alunoId?: string) {
  const [frequencia, setFrequencia] = useState<Frequencia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFrequencia = async () => {
    try {
      setLoading(true)
      let query = supabase.from('frequencia').select('*')
      if (alunoId) query = query.eq('aluno_id', alunoId)
      const { data, error: err } = await query.order('data_checkin', { ascending: false })

      if (err) throw err
      setFrequencia(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar frequência')
      setFrequencia([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFrequencia()
  }, [alunoId])

  const addCheckin = async (checkin: Omit<Frequencia, 'id' | 'created_at'>) => {
    try {
      const { data, error: err } = await supabase
        .from('frequencia')
        .insert([checkin])
        .select()

      if (err) throw err
      if (data) setFrequencia([data[0], ...frequencia])
      return data?.[0]
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao adicionar check-in')
    }
  }

  const deleteCheckin = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from('frequencia')
        .delete()
        .eq('id', id)

      if (err) throw err
      setFrequencia(frequencia.filter(f => f.id !== id))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao deletar check-in')
    }
  }

  return { frequencia, loading, error, addCheckin, deleteCheckin }
}
