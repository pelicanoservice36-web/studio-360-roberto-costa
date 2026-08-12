import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Aluno } from '../types/database'

export function useAlunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAlunos = async () => {
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('alunos')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err
      setAlunos(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar alunos')
      setAlunos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlunos()
  }, [])

  const createAluno = async (aluno: Omit<Aluno, 'id' | 'created_at'>) => {
    try {
      const { data, error: err } = await supabase
        .from('alunos')
        .insert([aluno])
        .select()

      if (err) throw err
      if (data) setAlunos([data[0], ...alunos])
      return data?.[0]
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao criar aluno')
    }
  }

  const updateAluno = async (id: string, updates: Partial<Aluno>) => {
    try {
      const { data, error: err } = await supabase
        .from('alunos')
        .update(updates)
        .eq('id', id)
        .select()

      if (err) throw err
      if (data) {
        setAlunos(alunos.map(a => a.id === id ? data[0] : a))
      }
      return data?.[0]
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao atualizar aluno')
    }
  }

  const deleteAluno = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from('alunos')
        .delete()
        .eq('id', id)

      if (err) throw err
      setAlunos(alunos.filter(a => a.id !== id))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao deletar aluno')
    }
  }

  return { alunos, loading, error, fetchAlunos, createAluno, updateAluno, deleteAluno }
}
