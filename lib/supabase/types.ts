export interface User {
  id: string;
  email: string;
  credit_balance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  action_type: string;
  action_details: string;
  cost: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  project_id?: string;
  metadata?: {
    resolution?: string;
    duration?: number;
    fps?: number;
    prompt?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}