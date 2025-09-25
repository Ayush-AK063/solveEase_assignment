import { useState, useEffect } from 'react'
import { WorkerType } from '@/types/workers'

interface UseWorkersReturn {
  workersData: WorkerType[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useWorkers(): UseWorkersReturn {
  const [workersData, setWorkersData] = useState<WorkerType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/workers')
      if (!response.ok) {
        throw new Error('Failed to fetch workers data')
      }
      const data = await response.json()
      if (data.success) {
        setWorkersData(data.data)
      } else {
        throw new Error(data.error || 'Failed to load workers')
      }
    } catch (error) {
      console.error('Failed to load workers:', error)
      setError(error instanceof Error ? error.message : 'Failed to load workers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return {
    workersData,
    loading,
    error,
    refetch: loadData
  }
}