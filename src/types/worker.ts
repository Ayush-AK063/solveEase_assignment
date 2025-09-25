export interface Worker {
  id: number;
  name: string;
  service: string;
  pricePerDay: number;
  image: string;
}

// Legacy type alias for backward compatibility
export type WorkerType = Worker;