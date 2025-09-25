'use client';

import { useState, useEffect } from 'react';
import WorkerCard from '../components/WorkerCard';
import { Worker } from '../types/worker';

export default function Home() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = () => {
    setError(null);
    setLoading(true);
    fetchWorkers();
  };

  const fetchWorkers = async () => {
    try {
      const response = await fetch('/api/workers');
      const result = await response.json();
      const data = result.data || [];
      setWorkers(data);
      setFilteredWorkers(data);
    } catch (error) {
      console.error('Error fetching workers:', error);
      setError('Failed to load workers. Please try again.');
      setWorkers([]);
      setFilteredWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  useEffect(() => {
    let filtered = workers;

    if (searchTerm) {
      filtered = filtered.filter(worker =>
        worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.service.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedService) {
      filtered = filtered.filter(worker =>
        worker.service === selectedService
      );
    }

    if (sortBy === 'name') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price') {
      filtered = filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
    }

    setFilteredWorkers(filtered);
  }, [workers, searchTerm, selectedService, sortBy]);

  const uniqueServices = Array.from(
    new Set(Array.isArray(workers) ? workers.map(worker => worker.service) : [])
  );

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8faff] via-[#eef2f9] to-[#dfe8ff]">
        <div className="animate-spin h-14 w-14 rounded-full border-t-4 border-indigo-600"></div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf2f8] via-[#fce7f3] to-[#fbcfe8]">
        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-10 text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Workers</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={refetch}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:opacity-90 transition-all focus:ring-4 focus:ring-indigo-300"
          >
            Try Again
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8faff] via-[#eef2f9] to-[#dfe8ff]">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-md">
            Professional Workers Directory
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover & hire skilled professionals for your next project. <br />
            Hand-picked and trusted by clients across industries.
          </p>
        </header>

        {/* Search & Filters */}
        <section className="mb-10 bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            
            {/* Search */}
            <div className="relative w-full lg:flex-1">
              <input
                id="search"
                type="text"
                placeholder="🔍 Search by name or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-4 focus:ring-indigo-300 outline-none transition-all"
              />
            </div>

            {/* Filter */}
            <select
              id="service-filter"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full lg:w-52 px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-4 focus:ring-indigo-300 outline-none transition-all"
            >
              <option value="">All Services</option>
              {(uniqueServices || []).map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price')}
              className="w-full lg:w-52 px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-4 focus:ring-indigo-300 outline-none transition-all"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-500 text-center lg:text-left">
            Showing <span className="font-medium">{filteredWorkers.length}</span> of {workers.length} workers
          </div>
        </section>

        {/* Workers Grid */}
        <section>
          {filteredWorkers.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No workers found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {(filteredWorkers || []).map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-500 text-sm">
          <p>© 2024 Workers Directory. Crafted with ❤️. All prices include 18% GST.</p>
        </footer>
      </div>
    </main>
  )
}
