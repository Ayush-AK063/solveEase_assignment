import { renderHook } from '@testing-library/react'
import { useWorkersFilter } from '../useWorkersFilter'
import { WorkerType } from '@/types/workers'

const mockWorkers: WorkerType[] = [
  { id: 1, name: 'Alice Smith', service: 'Plumber', pricePerDay: 500, image: 'image1.jpg' },
  { id: 2, name: 'Bob Johnson', service: 'Electrician', pricePerDay: 600, image: 'image2.jpg' },
  { id: 3, name: 'Charlie Brown', service: 'Plumber', pricePerDay: 400, image: 'image3.jpg' },
  { id: 4, name: 'Diana Prince', service: 'Painter', pricePerDay: 0, image: 'image4.jpg' }, // Should be filtered out
  { id: null as any, name: 'Invalid Worker', service: 'Welder', pricePerDay: 300, image: 'image5.jpg' }, // Should be filtered out
]

describe('useWorkersFilter', () => {
  it('returns all valid workers when no filters applied', () => {
    const { result } = renderHook(() =>
      useWorkersFilter({
        workersData: mockWorkers,
        searchTerm: '',
        selectedService: 'all',
        sortBy: 'name'
      })
    )

    expect(result.current.filteredWorkers).toHaveLength(3) // Excludes invalid workers
    expect(result.current.totalCount).toBe(5)
    expect(result.current.services).toEqual(['Electrician', 'Painter', 'Plumber', 'Welder'])
  })

  it('filters workers by search term (name)', () => {
    const { result } = renderHook(() =>
      useWorkersFilter({
        workersData: mockWorkers,
        searchTerm: 'alice',
        selectedService: 'all',
        sortBy: 'name'
      })
    )

    expect(result.current.filteredWorkers).toHaveLength(1)
    expect(result.current.filteredWorkers[0].name).toBe('Alice Smith')
  })

  it('filters workers by search term (service)', () => {
    const { result } = renderHook(() =>
      useWorkersFilter({
        workersData: mockWorkers,
        searchTerm: 'plumber',
        selectedService: 'all',
        sortBy: 'name'
      })
    )

    expect(result.current.filteredWorkers).toHaveLength(2)
    expect(result.current.filteredWorkers.every(w => w.service === 'Plumber')).toBe(true)
  })

  it('filters workers by selected service', () => {
    const { result } = renderHook(() =>
      useWorkersFilter({
        workersData: mockWorkers,
        searchTerm: '',
        selectedService: 'Electrician',
        sortBy: 'name'
      })
    )

    expect(result.current.filteredWorkers).toHaveLength(1)
    expect(result.current.filteredWorkers[0].service).toBe('Electrician')
  })

  it('sorts workers by name', () => {
    const { result } = renderHook(() =>
      useWorkersFilter({
        workersData: mockWorkers,
        searchTerm: '',
        selectedService: 'all',
        sortBy: 'name'
      })
    )

    const names = result.current.filteredWorkers.map(w => w.name)
    expect(names).toEqual(['Alice Smith', 'Bob Johnson', 'Charlie Brown'])
  })

  it('sorts workers by price', () => {
    const { result } = renderHook(() =>
      useWorkersFilter({
        workersData: mockWorkers,
        searchTerm: '',
        selectedService: 'all',
        sortBy: 'price'
      })
    )

    const prices = result.current.filteredWorkers.map(w => w.pricePerDay)
    expect(prices).toEqual([400, 500, 600])
  })

  it('combines multiple filters', () => {
    const { result } = renderHook(() =>
      useWorkersFilter({
        workersData: mockWorkers,
        searchTerm: 'charlie',
        selectedService: 'Plumber',
        sortBy: 'name'
      })
    )

    expect(result.current.filteredWorkers).toHaveLength(1)
    expect(result.current.filteredWorkers[0].name).toBe('Charlie Brown')
    expect(result.current.filteredWorkers[0].service).toBe('Plumber')
  })

  it('returns empty array when no workers match filters', () => {
    const { result } = renderHook(() =>
      useWorkersFilter({
        workersData: mockWorkers,
        searchTerm: 'nonexistent',
        selectedService: 'all',
        sortBy: 'name'
      })
    )

    expect(result.current.filteredWorkers).toHaveLength(0)
  })
})