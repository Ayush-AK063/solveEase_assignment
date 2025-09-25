import { render, screen } from '@testing-library/react'
import WorkerCard from '../WorkerCard'
import { Worker } from '../../types/worker'

const mockWorker: Worker = {
  id: 1,
  name: 'John Doe',
  profession: 'Plumber Professional',
  services: ['Plumbing', 'Pipe Repair'],
  dailyRate: 590,
  rating: 4.5,
  reviewCount: 25,
  location: 'Mumbai',
  profilePicture: '/images/john.jpg'
}

describe('WorkerCard', () => {
  it('renders worker information correctly', () => {
    render(<WorkerCard worker={mockWorker} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Plumber Professional')).toBeInTheDocument()
    expect(screen.getByText('₹590')).toBeInTheDocument()
    expect(screen.getByText('per day')).toBeInTheDocument()
    expect(screen.getByText('Mumbai')).toBeInTheDocument()
    expect(screen.getByText('4.5 (25 reviews)')).toBeInTheDocument()
  })

  it('renders service badges', () => {
    render(<WorkerCard worker={mockWorker} />)
    
    expect(screen.getByText('Plumbing')).toBeInTheDocument()
    expect(screen.getByText('Pipe Repair')).toBeInTheDocument()
  })

  it('renders contact button', () => {
    render(<WorkerCard worker={mockWorker} />)
    
    expect(screen.getByRole('button', { name: 'Contact Worker' })).toBeInTheDocument()
  })

  it('renders worker image with correct alt text', () => {
    render(<WorkerCard worker={mockWorker} />)
    
    const image = screen.getByAltText('John Doe')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/images/john.jpg')
  })

  it('renders rating stars', () => {
    render(<WorkerCard worker={mockWorker} />)
    
    const stars = screen.getAllByText('★')
    expect(stars).toHaveLength(5)
  })

  it('calculates price with GST correctly', () => {
    const workerWithDifferentPrice: WorkerType = {
      ...mockWorker,
      pricePerDay: 1000
    }
    
    render(<WorkerCard worker={workerWithDifferentPrice} />)
    
    expect(screen.getByText('₹1,180')).toBeInTheDocument() // 1000 * 1.18 with comma formatting
  })

  it('has proper accessibility attributes', () => {
    render(<WorkerCard worker={mockWorker} />)
    
    const article = screen.getByRole('article')
    expect(article).toHaveAttribute('aria-labelledby', 'worker-1-name')
    
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveAttribute('id', 'worker-1-name')
  })
})