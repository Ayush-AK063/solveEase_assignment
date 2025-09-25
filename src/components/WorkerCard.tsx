import React, { useState } from 'react';
import Image from 'next/image';
import { Worker } from '../types/worker';

interface WorkerCardProps {
  worker: Worker;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ worker }) => {
  const [imageError, setImageError] = useState(false);

  // Generate a simple avatar fallback based on the worker's name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
      <div className="flex items-start space-x-4 mb-4">
        <div className="flex-shrink-0">
          {!imageError ? (
            <Image
              src={worker.image}
              alt={worker.name}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-gray-100 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {getInitials(worker.name)}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{worker.name}</h3>
          <p className="text-sm text-gray-600">{worker.service} Professional</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-gray-900">₹{Math.round(worker.pricePerDay * 1.18).toLocaleString()}</span>
          <span className="text-sm text-gray-500">per day</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {worker.service}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-sm ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            4.0+ rating
          </span>
        </div>
      </div>
      
      <div className="mt-6">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Contact Worker
        </button>
      </div>
    </div>
  );
};

export default WorkerCard;