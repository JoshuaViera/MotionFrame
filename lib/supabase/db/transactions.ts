import { supabaseAdmin } from '../client';

export interface CreateTransactionParams {
  userId: string;
  actionType: 'export' | 'generation' | 'upscale' | 'animation';
  actionDetails: string;
  cost: number; // In cents, negative for charges
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  projectId?: string;
  metadata?: Record<string, any>;
}

export async function createTransaction(params: CreateTransactionParams) {
  const { data, error } = await supabaseAdmin
    .from('transactions')
    .insert({
      user_id: params.userId,
      action_type: params.actionType,
      action_details: params.actionDetails,
      cost: params.cost,
      status: params.status || 'completed',
      project_id: params.projectId,
      metadata: params.metadata
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getTransactionHistory(
  userId: string,
  limit: number = 20,
  offset: number = 0
) {
  const { data, error } = await supabaseAdmin
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data;
}

export async function updateTransactionStatus(
  transactionId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
) {
  const { data, error } = await supabaseAdmin
    .from('transactions')
    .update({ status })
    .eq('id', transactionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}