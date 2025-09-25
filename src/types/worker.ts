export interface Worker {
  id: number;
  name: string;
  service: string;
  pricePerDay: number;
  image: string;
}

// Legacy interface for backward compatibility
export interface WorkerType extends Worker {}