import { supabaseAdmin } from '../client';

export async function getUserBalance(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('credit_balance')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data.credit_balance;
}

export async function ensureUserExists(userId: string, email: string, initialBalance: number = 5000) {
  // Check if user exists
  const { data: existing } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();

  if (existing) return existing;

  // Create new user
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({
      id: userId,
      email,
      credit_balance: initialBalance
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}