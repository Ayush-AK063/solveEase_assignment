import { useMemo } from 'react'
import { WorkerType } from '@/types/workers'

interface UseWorkersFilterProps {
  workersData: WorkerType[]
  searchTerm: string
  selectedService: string
  sortBy: 'name' | 'price'
}

interface UseWorkersFilterReturn {
  filteredWorkers: WorkerType[]
  services: string[]
  totalCount: number
}

export function useWorkersFilter({
  workersData,
  searchTerm,
  selectedService,
  sortBy
}: UseWorkersFilterProps): UseWorkersFilterReturn {
  const services = useMemo(() => {
    const uniqueServices = [...new Set(workersData.map(worker => worker.service))]
    return uniqueServices.sort()
  }, [workersData])

  const filteredWorkers = useMemo(() => {
    return workersData
      .filter((worker) => worker.pricePerDay > 0)
      .filter((worker) => worker.id !== null)
      .filter((worker) => 
        worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.service.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((worker) => selectedService === 'all' || worker.service === selectedService)
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name)
        } else {
          return a.pricePerDay - b.pricePerDay
        }
      })
  }, [workersData, searchTerm, selectedService, sortBy])

  return {
    filteredWorkers,
    services,
    totalCount: workersData.length
  }
}