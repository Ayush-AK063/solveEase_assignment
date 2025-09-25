import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '../page'

// Mock fetch
global.fetch = jest.fn()

const mockWorkers = [
  {
    id: 1,
    name: 'John Doe',
    profession: 'Plumber',
    services: ['Plumbing', 'Pipe Repair'],
    dailyRate: 500,
    rating: 4.5,
    reviewCount: 25,
    location: 'Mumbai',
    profilePicture: '/images/john.jpg'
  },
  {
    id: 2,
    name: 'Jane Smith',
    profession: 'Electrician',
    services: ['Electrical Work', 'Wiring'],
    dailyRate: 600,
    rating: 4.8,
    reviewCount: 30,
    location: 'Delhi',
    profilePicture: '/images/jane.jpg'
  }
]

describe('Home Page', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockWorkers,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    render(<Home />)
    expect(screen.getByText('Loading workers...')).toBeInTheDocument()
  })

  it('renders workers after loading', async () => {
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })
  })

  it('filters workers by search term', async () => {
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Search workers by name, profession, or service...')
    await userEvent.type(searchInput, 'John')

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
  })

  it('filters workers by service', async () => {
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const serviceSelect = screen.getByDisplayValue('All Services')
    await userEvent.selectOptions(serviceSelect, 'Plumbing')

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
  })

  it('shows no results message when no workers match', async () => {
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Search workers by name, profession, or service...')
    await userEvent.type(searchInput, 'NonExistentWorker')

    expect(screen.getByText('No workers found matching your criteria.')).toBeInTheDocument()
  })

  it('renders page structure correctly', async () => {
    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('banner')).toBeInTheDocument() // header
    expect(screen.getByRole('contentinfo')).toBeInTheDocument() // footer
  })
})